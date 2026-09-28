-- Migration 006: Employment state machine, interview/selection events, employment outcomes

-- ─── State machine transition table ─────────────────────────────────────────
CREATE TABLE public.allowed_transitions (
  from_status  public.employment_status NOT NULL,
  to_status    public.employment_status NOT NULL,
  actor_role   public.actor_role NOT NULL,
  description  TEXT,
  PRIMARY KEY (from_status, to_status, actor_role)
);

COMMENT ON TABLE public.allowed_transitions IS
  'Enforced by validate_employment_transition(). '
  'Invalid transitions raise exceptions and create INVALID_TRANSITION_ATTEMPT ledger events.';

-- Populate all valid transitions per the state machine in MASTER_PROMPT §6
INSERT INTO public.allowed_transitions (from_status, to_status, actor_role, description) VALUES
  -- Agency reports employment
  ('REPORTED',              'PENDING_VERIFICATION',    'agency_officer',    'Agency submits employment report'),
  ('REPORTED',              'PENDING_VERIFICATION',    'agency_admin',      'Agency admin submits employment report'),
  -- Employer confirms
  ('PENDING_VERIFICATION',  'VERIFIED_EMPLOYED',       'employer_verifier', 'Employer confirms employment'),
  -- Employer rejects
  ('PENDING_VERIFICATION',  'REJECTED',                'employer_verifier', 'Employer rejects employment report'),
  -- Employer requests correction — returns to agency as CORRECTION_REQUESTED sub-status
  ('PENDING_VERIFICATION',  'CORRECTION_REQUESTED',    'employer_verifier', 'Employer requests correction'),
  -- Agency resubmits after correction
  ('CORRECTION_REQUESTED',  'PENDING_VERIFICATION',    'agency_officer',    'Agency resubmits after correction'),
  ('CORRECTION_REQUESTED',  'PENDING_VERIFICATION',    'agency_admin',      'Agency admin resubmits after correction'),
  -- Student reports unemployment (only from verified employed)
  ('VERIFIED_EMPLOYED',     'UNEMPLOYMENT_REPORTED',   'student',           'Student reports end of employment'),
  -- Employer-initiated end of employment
  ('VERIFIED_EMPLOYED',     'UNEMPLOYMENT_REPORTED',   'employer_verifier', 'Employer reports end of employment'),
  -- System transitions to reconciliation pending
  ('UNEMPLOYMENT_REPORTED', 'RECONCILIATION_PENDING',  'agency_officer',    'Agency triggers reconciliation'),
  ('UNEMPLOYMENT_REPORTED', 'RECONCILIATION_PENDING',  'agency_admin',      'Agency admin triggers reconciliation'),
  -- Employer reconciles
  ('RECONCILIATION_PENDING','VERIFIED_UNEMPLOYED',     'employer_verifier', 'Employer confirms unemployment'),
  -- Timeout reconciliation (system-initiated)
  ('RECONCILIATION_PENDING','RECONCILED_BY_TIMEOUT',   'agency_officer',    'System reconciles after employer non-response'),
  ('RECONCILIATION_PENDING','RECONCILED_BY_TIMEOUT',   'agency_admin',      'System reconciles after employer non-response'),
  -- Student reports new employment
  ('VERIFIED_UNEMPLOYED',   'NEW_EMPLOYMENT_REPORTED', 'student',           'Student reports new employment'),
  ('RECONCILED_BY_TIMEOUT', 'NEW_EMPLOYMENT_REPORTED', 'student',           'Student reports new employment after timeout'),
  -- Agency reports new employment
  ('VERIFIED_UNEMPLOYED',   'NEW_EMPLOYMENT_REPORTED', 'agency_officer',    'Agency reports new employment'),
  ('VERIFIED_UNEMPLOYED',   'NEW_EMPLOYMENT_REPORTED', 'agency_admin',      'Agency reports new employment'),
  -- New employment enters verification loop
  ('NEW_EMPLOYMENT_REPORTED','PENDING_VERIFICATION',   'agency_officer',    'New employment enters verification'),
  ('NEW_EMPLOYMENT_REPORTED','PENDING_VERIFICATION',   'agency_admin',      'New employment enters verification'),
  ('NEW_EMPLOYMENT_REPORTED','PENDING_VERIFICATION',   'student',           'New employment enters verification');

-- ─── Interview events ─────────────────────────────────────────────────────────
CREATE TABLE public.interview_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eoi_student_id  TEXT NOT NULL REFERENCES public.students(eoi_student_id),
  agency_id       UUID REFERENCES public.agencies(id),
  org_id          UUID REFERENCES public.organizations(id),
  cohort_id       UUID REFERENCES public.cohorts(id),
  interview_date  DATE NOT NULL,
  interview_type  TEXT CHECK (interview_type IN ('PHONE', 'IN_PERSON', 'VIDEO', 'WALK_IN')),
  outcome         TEXT NOT NULL CHECK (outcome IN ('SELECTED', 'REJECTED', 'ON_HOLD', 'NO_SHOW', 'WITHDRAWN')),
  job_role        TEXT,
  recorded_by     UUID NOT NULL REFERENCES public.app_users(id),
  recorded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  idempotency_key TEXT UNIQUE
);

CREATE INDEX ON public.interview_events (eoi_student_id);
CREATE INDEX ON public.interview_events (agency_id);
CREATE INDEX ON public.interview_events (org_id);

-- ─── Selection events ─────────────────────────────────────────────────────────
CREATE TABLE public.selection_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eoi_student_id  TEXT NOT NULL REFERENCES public.students(eoi_student_id),
  interview_id    UUID REFERENCES public.interview_events(id),
  agency_id       UUID REFERENCES public.agencies(id),
  org_id          UUID NOT NULL REFERENCES public.organizations(id),
  selection_date  DATE NOT NULL,
  job_role        TEXT NOT NULL,
  offered_start   DATE,
  recorded_by     UUID NOT NULL REFERENCES public.app_users(id),
  recorded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  idempotency_key TEXT UNIQUE
);

CREATE INDEX ON public.selection_events (eoi_student_id);
CREATE INDEX ON public.selection_events (org_id);

-- ─── Employment outcomes ───────────────────────────────────────────────────────
CREATE TABLE public.employment_outcomes (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eoi_student_id   TEXT NOT NULL REFERENCES public.students(eoi_student_id),
  agency_id        UUID NOT NULL REFERENCES public.agencies(id),
  org_id           UUID NOT NULL REFERENCES public.organizations(id),
  selection_id     UUID REFERENCES public.selection_events(id),
  job_role         TEXT NOT NULL,
  job_category     TEXT,
  employment_type  TEXT CHECK (employment_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'APPRENTICESHIP', 'INTERNSHIP')),
  compensation_band TEXT,              -- Wage band, NOT exact salary
  location_state   TEXT,
  location_district TEXT,
  start_date       DATE NOT NULL,
  end_date         DATE,
  employment_status public.employment_status NOT NULL DEFAULT 'REPORTED',
  -- Sequence tracking for re-employment
  sequence_number  INTEGER NOT NULL DEFAULT 1,  -- 1 = first employment, 2 = re-employment, etc.
  -- Temporal validation: employment cannot precede training completion
  -- (checked in SECURITY DEFINER function; flag for exceptions)
  temporal_exception_flag BOOLEAN NOT NULL DEFAULT FALSE,
  temporal_exception_reason TEXT,
  temporal_exception_approver UUID REFERENCES public.app_users(id),
  -- Anomaly flags
  is_flagged       BOOLEAN NOT NULL DEFAULT FALSE,
  flag_reason      TEXT,
  -- Idempotency
  idempotency_key  TEXT UNIQUE NOT NULL,
  -- Reporting metadata
  reported_by      UUID NOT NULL REFERENCES public.app_users(id),
  reported_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.employment_outcomes IS
  'Central employment record. Status follows allowed_transitions. '
  'No DELETE operation exists for ordinary users (MASTER_PROMPT §6).';

CREATE INDEX ON public.employment_outcomes (eoi_student_id);
CREATE INDEX ON public.employment_outcomes (agency_id);
CREATE INDEX ON public.employment_outcomes (org_id);
CREATE INDEX ON public.employment_outcomes (employment_status);
CREATE INDEX ON public.employment_outcomes (start_date);
CREATE INDEX ON public.employment_outcomes (reported_at DESC);

-- ─── Employment status events (append-only audit trail) ───────────────────────
CREATE TABLE public.employment_status_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seq             BIGINT NOT NULL,
  outcome_id      UUID NOT NULL REFERENCES public.employment_outcomes(id),
  from_status     public.employment_status,
  to_status       public.employment_status NOT NULL,
  actor_id        UUID NOT NULL REFERENCES public.app_users(id),
  actor_role      public.actor_role NOT NULL,
  source          TEXT NOT NULL CHECK (source IN ('AGENCY', 'STUDENT', 'EMPLOYER', 'SYSTEM')),
  notes           TEXT,
  occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  correlation_id  UUID NOT NULL DEFAULT uuid_generate_v4()
);

COMMENT ON TABLE public.employment_status_events IS 'APPEND-ONLY. UPDATE/DELETE triggers raise exceptions.';

CREATE INDEX ON public.employment_status_events (outcome_id);
CREATE INDEX ON public.employment_status_events (occurred_at DESC);
CREATE UNIQUE INDEX ON public.employment_status_events (outcome_id, seq);

-- Sequence counter per employment outcome
CREATE SEQUENCE IF NOT EXISTS employment_status_event_seq START 1;

-- ─── Employment verifications (append-only) ───────────────────────────────────
CREATE TABLE public.employment_verifications (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  outcome_id        UUID NOT NULL REFERENCES public.employment_outcomes(id),
  verifier_org_id   UUID NOT NULL REFERENCES public.organizations(id),
  verifier_user_id  UUID NOT NULL REFERENCES public.app_users(id),
  action            TEXT NOT NULL CHECK (action IN ('CONFIRM', 'REJECT', 'REQUEST_CORRECTION', 'RECONCILE_UNEMPLOYMENT')),
  reason            TEXT,
  evidence          JSONB,
  occurred_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  correlation_id    UUID NOT NULL DEFAULT uuid_generate_v4()
);

COMMENT ON TABLE public.employment_verifications IS 'APPEND-ONLY. UPDATE/DELETE triggers raise exceptions.';

CREATE INDEX ON public.employment_verifications (outcome_id);
CREATE INDEX ON public.employment_verifications (verifier_org_id);
CREATE INDEX ON public.employment_verifications (occurred_at DESC);
