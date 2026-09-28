-- Migration 005: Assessments, student skills, job readiness, scoring versions

-- ─── Scoring versions (versioned readiness formula) ──────────────────────────
CREATE TABLE public.scoring_versions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  version_number    TEXT NOT NULL UNIQUE,   -- e.g. '1.0', '1.1', '2.0'
  formula           JSONB NOT NULL,         -- Component weights and rules
  description       TEXT NOT NULL,
  is_active         BOOLEAN NOT NULL DEFAULT FALSE,
  activated_at      TIMESTAMPTZ,
  deactivated_at    TIMESTAMPTZ,
  -- Multi-party authorization required to activate
  activated_by_auth_request_id UUID,        -- FK added after authorization_requests
  created_by        UUID REFERENCES public.app_users(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.scoring_versions IS
  'Versioned job readiness scoring formulas. '
  'Activating a new version requires multi-party authorization. '
  'Old versions remain to reproduce historical scores.';

-- Seed initial scoring version (active by default)
INSERT INTO public.scoring_versions (version_number, formula, description, is_active, activated_at) VALUES
('1.0', '{
  "weights": {
    "assessment_score": 0.35,
    "practical_assessment": 0.25,
    "project_score": 0.15,
    "attendance": 0.10,
    "skill_proficiency_avg": 0.15
  },
  "min_passing_score": 60,
  "thresholds": {
    "high": 80,
    "medium": 60,
    "low": 0
  }
}', 'Initial scoring version: assessment 35%, practical 25%, project 15%, attendance 10%, skills 15%',
TRUE, NOW());

-- ─── Assessments ─────────────────────────────────────────────────────────────
CREATE TABLE public.assessments (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id    UUID NOT NULL REFERENCES public.courses(id),
  cohort_id    UUID REFERENCES public.cohorts(id),
  name         TEXT NOT NULL,
  type         TEXT NOT NULL CHECK (type IN ('WRITTEN', 'PRACTICAL', 'PROJECT', 'ORAL', 'MIXED')),
  max_score    NUMERIC(6,2) NOT NULL DEFAULT 100,
  passing_score NUMERIC(6,2),
  conducted_at TIMESTAMPTZ,
  created_by   UUID REFERENCES public.app_users(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ON public.assessments (course_id);
CREATE INDEX ON public.assessments (cohort_id);

-- ─── Assessment results ───────────────────────────────────────────────────────
CREATE TABLE public.assessment_results (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eoi_student_id  TEXT NOT NULL REFERENCES public.students(eoi_student_id),
  assessment_id   UUID NOT NULL REFERENCES public.assessments(id),
  enrollment_id   UUID REFERENCES public.enrollments(id),
  score           NUMERIC(6,2) NOT NULL,
  practical_score NUMERIC(6,2),
  notes           TEXT,
  recorded_by     UUID NOT NULL REFERENCES public.app_users(id),
  recorded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Idempotency: prevent duplicate submissions
  idempotency_key TEXT UNIQUE,
  UNIQUE (eoi_student_id, assessment_id)
);

CREATE INDEX ON public.assessment_results (eoi_student_id);
CREATE INDEX ON public.assessment_results (assessment_id);

-- ─── Student skills (proficiency history — append-oriented) ───────────────────
CREATE TABLE public.student_skills (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eoi_student_id  TEXT NOT NULL REFERENCES public.students(eoi_student_id),
  skill_id        UUID NOT NULL REFERENCES public.skills(id),
  proficiency     INTEGER NOT NULL CHECK (proficiency BETWEEN 1 AND 5),
  source          TEXT NOT NULL CHECK (source IN ('ASSESSMENT', 'SELF_REPORTED', 'EMPLOYER_FEEDBACK', 'INSTRUCTOR')),
  assessed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  recorded_by     UUID REFERENCES public.app_users(id)
);

COMMENT ON TABLE public.student_skills IS
  'Proficiency history — new rows added for each assessment, not updated. '
  'Latest proficiency = most recent row per (eoi_student_id, skill_id).';

CREATE INDEX ON public.student_skills (eoi_student_id);
CREATE INDEX ON public.student_skills (skill_id);
CREATE INDEX ON public.student_skills (eoi_student_id, skill_id, assessed_at DESC);

-- ─── Job readiness records ────────────────────────────────────────────────────
CREATE TABLE public.job_readiness_records (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eoi_student_id      TEXT NOT NULL REFERENCES public.students(eoi_student_id),
  enrollment_id       UUID REFERENCES public.enrollments(id),
  scoring_version_id  UUID NOT NULL REFERENCES public.scoring_versions(id),
  composite_score     NUMERIC(6,2) NOT NULL,
  component_scores    JSONB NOT NULL,   -- Breakdown by component
  readiness_band      TEXT NOT NULL CHECK (readiness_band IN ('HIGH', 'MEDIUM', 'LOW')),
  computed_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  computed_by         TEXT NOT NULL DEFAULT 'SYSTEM'
);

COMMENT ON TABLE public.job_readiness_records IS
  'Computed by the system from structured inputs using versioned scoring formula. '
  'Agencies cannot manually enter a readiness score. '
  'New computation creates a new record; nothing is silently changed.';

CREATE INDEX ON public.job_readiness_records (eoi_student_id);
CREATE INDEX ON public.job_readiness_records (eoi_student_id, computed_at DESC);
CREATE INDEX ON public.job_readiness_records (readiness_band);

-- ─── Industry feedback and skill requirements ─────────────────────────────────
CREATE TABLE public.industry_feedback (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id         UUID REFERENCES public.organizations(id),
  course_id      UUID REFERENCES public.courses(id),
  sector         TEXT,
  feedback_type  TEXT NOT NULL CHECK (feedback_type IN ('CURRICULUM_RELEVANCE', 'CANDIDATE_READINESS', 'SKILL_GAP', 'HIRING_REQUIREMENTS', 'GENERAL')),
  feedback_data  JSONB NOT NULL,
  submitted_by   UUID NOT NULL REFERENCES public.app_users(id),
  submitted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ON public.industry_feedback (org_id);
CREATE INDEX ON public.industry_feedback (sector);
CREATE INDEX ON public.industry_feedback (submitted_at DESC);

CREATE TABLE public.skill_requirements (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id               UUID REFERENCES public.organizations(id),
  skill_id             UUID NOT NULL REFERENCES public.skills(id),
  required_proficiency INTEGER NOT NULL CHECK (required_proficiency BETWEEN 1 AND 5),
  industry             TEXT,
  region               TEXT,
  state                TEXT,
  district             TEXT,
  priority             TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  recorded_by          UUID NOT NULL REFERENCES public.app_users(id),
  recorded_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ON public.skill_requirements (skill_id);
CREATE INDEX ON public.skill_requirements (industry, region);
CREATE INDEX ON public.skill_requirements (recorded_at DESC);
