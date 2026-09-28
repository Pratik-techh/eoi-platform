-- Migration 004: Skills, courses, cohorts, enrollments, certifications, projects

-- ─── Skills ──────────────────────────────────────────────────────────────────
CREATE TABLE public.skills (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL UNIQUE,
  domain       TEXT NOT NULL,    -- e.g. 'Technology', 'Construction', 'Healthcare'
  category     TEXT,             -- Sub-category
  description  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ON public.skills (domain);
CREATE INDEX ON public.skills USING gin (name gin_trgm_ops);

-- ─── Courses ─────────────────────────────────────────────────────────────────
CREATE TABLE public.courses (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id      UUID NOT NULL REFERENCES public.agencies(id),
  name           TEXT NOT NULL,
  description    TEXT,
  duration_hours INTEGER NOT NULL DEFAULT 0,
  qp_code        TEXT,            -- NSQF Qualification Pack code
  nsqf_level     INTEGER CHECK (nsqf_level BETWEEN 1 AND 10),
  sector         TEXT,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ON public.courses (agency_id);

-- ─── Course skills (skills taught/assessed with target proficiency) ───────────
CREATE TABLE public.course_skills (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id          UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  skill_id           UUID NOT NULL REFERENCES public.skills(id),
  target_proficiency INTEGER NOT NULL CHECK (target_proficiency BETWEEN 1 AND 5),
  skill_type         TEXT NOT NULL DEFAULT 'core' CHECK (skill_type IN ('core', 'supplementary', 'assessed')),
  UNIQUE (course_id, skill_id)
);

CREATE INDEX ON public.course_skills (course_id);
CREATE INDEX ON public.course_skills (skill_id);

-- ─── Cohorts ─────────────────────────────────────────────────────────────────
CREATE TABLE public.cohorts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id    UUID NOT NULL REFERENCES public.courses(id),
  agency_id    UUID NOT NULL REFERENCES public.agencies(id),
  name         TEXT NOT NULL,
  start_date   DATE NOT NULL,
  end_date     DATE,
  capacity     INTEGER,
  state        TEXT,
  district     TEXT,
  status       TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ON public.cohorts (course_id);
CREATE INDEX ON public.cohorts (agency_id);
CREATE INDEX ON public.cohorts (status);

-- ─── Students (outcome record — no PII) ──────────────────────────────────────
-- All PII lives in pii.pii_identity joined by eoi_student_id
CREATE TABLE public.students (
  eoi_student_id   TEXT PRIMARY KEY,   -- Opaque ID: 'EOI-S-' + base32 random
  agency_id        UUID NOT NULL REFERENCES public.agencies(id),
  cohort_id        UUID REFERENCES public.cohorts(id),
  enrolled_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  gender           TEXT CHECK (gender IN ('M', 'F', 'O', 'PREFER_NOT_TO_SAY')),
  state_of_origin  TEXT,
  district         TEXT,
  status           TEXT NOT NULL DEFAULT 'ENROLLED'
                     CHECK (status IN ('ENROLLED', 'ACTIVE', 'COMPLETED', 'DROPPED', 'TRANSFERRED')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.students IS
  'Outcome-only student record. No PII stored here. '
  'Join pii.pii_identity on eoi_student_id for name/contact (agency-scoped access only).';

CREATE INDEX ON public.students (agency_id);
CREATE INDEX ON public.students (cohort_id);
CREATE INDEX ON public.students (status);

-- Add student FK to app_users
ALTER TABLE public.app_users
  ADD CONSTRAINT app_users_eoi_student_id_fkey
    FOREIGN KEY (eoi_student_id) REFERENCES public.students(eoi_student_id);

-- Add student FK to consents
ALTER TABLE public.consents
  ADD CONSTRAINT consents_eoi_student_id_fkey
    FOREIGN KEY (eoi_student_id) REFERENCES public.students(eoi_student_id);

-- ─── Enrollments ─────────────────────────────────────────────────────────────
CREATE TABLE public.enrollments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eoi_student_id  TEXT NOT NULL REFERENCES public.students(eoi_student_id),
  cohort_id       UUID NOT NULL REFERENCES public.cohorts(id),
  enrolled_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  dropped_at      TIMESTAMPTZ,
  attendance_pct  NUMERIC(5,2) CHECK (attendance_pct BETWEEN 0 AND 100),
  status          TEXT NOT NULL DEFAULT 'ENROLLED'
                    CHECK (status IN ('ENROLLED', 'COMPLETED', 'DROPPED', 'TRANSFERRED')),
  UNIQUE (eoi_student_id, cohort_id)
);

CREATE INDEX ON public.enrollments (eoi_student_id);
CREATE INDEX ON public.enrollments (cohort_id);
CREATE INDEX ON public.enrollments (status);

-- ─── Certifications ──────────────────────────────────────────────────────────
CREATE TABLE public.certifications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eoi_student_id  TEXT NOT NULL REFERENCES public.students(eoi_student_id),
  course_id       UUID NOT NULL REFERENCES public.courses(id),
  enrollment_id   UUID REFERENCES public.enrollments(id),
  cert_number     TEXT,
  cert_hash       TEXT,   -- SHA-256 of certificate content for verification
  issued_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until     TIMESTAMPTZ,
  issuing_body    TEXT,
  status          TEXT NOT NULL DEFAULT 'VALID' CHECK (status IN ('VALID', 'REVOKED', 'EXPIRED'))
);

CREATE INDEX ON public.certifications (eoi_student_id);
CREATE INDEX ON public.certifications (cert_hash);

-- ─── Projects ────────────────────────────────────────────────────────────────
CREATE TABLE public.projects (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eoi_student_id  TEXT NOT NULL REFERENCES public.students(eoi_student_id),
  course_id       UUID REFERENCES public.courses(id),
  enrollment_id   UUID REFERENCES public.enrollments(id),
  title           TEXT NOT NULL,
  description     TEXT,
  skills_demonstrated UUID[],   -- Array of skill IDs
  score           NUMERIC(5,2),
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at     TIMESTAMPTZ,
  reviewer_id     UUID REFERENCES public.app_users(id)
);

CREATE INDEX ON public.projects (eoi_student_id);
