-- Migration 009: Disputes, notifications, authorization requests, anomaly signals, analytics

-- ─── Disputes (append-only event trail) ──────────────────────────────────────
CREATE TABLE public.disputes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eoi_student_id  TEXT NOT NULL REFERENCES public.students(eoi_student_id),
  entity_type     TEXT NOT NULL,
  entity_id       TEXT NOT NULL,
  dispute_type    TEXT NOT NULL CHECK (dispute_type IN (
    'INCORRECT_EMPLOYER', 'INCORRECT_EMPLOYMENT_DATE',
    'INCORRECT_TRAINING', 'INCORRECT_ASSESSMENT',
    'EMPLOYMENT_NOT_RECOGNIZED', 'OTHER'
  )),
  description     TEXT NOT NULL,
  status          public.dispute_status NOT NULL DEFAULT 'OPEN',
  resolution      TEXT,
  resolver_id     UUID REFERENCES public.app_users(id),
  resolved_at     TIMESTAMPTZ,
  correlation_id  UUID NOT NULL DEFAULT uuid_generate_v4(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.disputes IS 'Disputes preserve history — status changes do NOT delete the original record.';

CREATE INDEX ON public.disputes (eoi_student_id);
CREATE INDEX ON public.disputes (entity_type, entity_id);
CREATE INDEX ON public.disputes (status);

-- Append-only block for disputes
CREATE TRIGGER disputes_no_delete
  BEFORE DELETE ON public.disputes
  FOR EACH ROW EXECUTE FUNCTION public.block_status_event_modifications();

-- ─── Notifications ────────────────────────────────────────────────────────────
CREATE TABLE public.notifications (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
  type         TEXT NOT NULL,
  title        TEXT NOT NULL,
  body         TEXT NOT NULL,
  entity_type  TEXT,
  entity_id    TEXT,
  is_read      BOOLEAN NOT NULL DEFAULT FALSE,
  deep_link    TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ON public.notifications (user_id, is_read);
CREATE INDEX ON public.notifications (user_id, created_at DESC);

-- Email outbox (simulated — clearly labelled, not actually sent)
CREATE TABLE public.email_outbox (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  to_email    TEXT NOT NULL,
  subject     TEXT NOT NULL,
  body_html   TEXT NOT NULL,
  entity_type TEXT,
  entity_id   TEXT,
  status      TEXT NOT NULL DEFAULT 'SIMULATED' CHECK (status IN ('SIMULATED', 'QUEUED', 'SENT', 'FAILED')),
  label       TEXT NOT NULL DEFAULT 'Simulated email — not actually sent',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Authorization requests (multi-party governance) ─────────────────────────
CREATE TABLE public.authorization_requests (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operation         TEXT NOT NULL CHECK (operation IN (
    'ACTIVATE_SCORING_VERSION',
    'ORG_IDENTIFIER_CLAIM_OVERRIDE',
    'GRANT_PRIVILEGED_ROLE',
    'EXPORT_RECORD_LEVEL_DATASET',
    'CLOSE_HIGH_SEVERITY_INVESTIGATION'
  )),
  payload           JSONB NOT NULL,
  description       TEXT NOT NULL,
  requested_by      UUID NOT NULL REFERENCES public.app_users(id),
  required_approvals INTEGER NOT NULL DEFAULT 2,
  status            public.auth_request_status NOT NULL DEFAULT 'PENDING',
  resolved_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.authorization_requests IS
  'Multi-party authorization: requester ≠ approver; approvers from distinct role types. (MASTER_PROMPT §4.2)';

CREATE INDEX ON public.authorization_requests (status);
CREATE INDEX ON public.authorization_requests (requested_by);

CREATE TABLE public.authorization_approvals (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id    UUID NOT NULL REFERENCES public.authorization_requests(id),
  approver_id   UUID NOT NULL REFERENCES public.app_users(id),
  decision      TEXT NOT NULL CHECK (decision IN ('APPROVED', 'REJECTED')),
  notes         TEXT,
  decided_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (request_id, approver_id)
);

COMMENT ON TABLE public.authorization_approvals IS
  'Requester cannot approve their own request (enforced in submit_authorization_request function).';

-- ─── Anomaly signals ─────────────────────────────────────────────────────────
CREATE TABLE public.anomaly_signals (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  signal_type   TEXT NOT NULL,
  entity_type   TEXT NOT NULL,
  entity_id     TEXT NOT NULL,
  severity      public.anomaly_severity NOT NULL DEFAULT 'MEDIUM',
  description   TEXT NOT NULL,
  detected_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  auto_resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_at   TIMESTAMPTZ
);

COMMENT ON TABLE public.anomaly_signals IS
  'Anomaly signals — never auto-declare fraud. '
  'UI must use language: "signal", "needs review", never "fraud" or "bad actor".';

CREATE INDEX ON public.anomaly_signals (entity_type, entity_id);
CREATE INDEX ON public.anomaly_signals (detected_at DESC);
CREATE INDEX ON public.anomaly_signals (severity);

-- ─── Investigations ───────────────────────────────────────────────────────────
CREATE TABLE public.investigations (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  anomaly_id     UUID REFERENCES public.anomaly_signals(id),
  title          TEXT NOT NULL,
  description    TEXT,
  severity       public.anomaly_severity NOT NULL,
  status         public.investigation_status NOT NULL DEFAULT 'OPEN',
  opened_by      UUID NOT NULL REFERENCES public.app_users(id),
  opened_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_by      UUID REFERENCES public.app_users(id),
  closed_at      TIMESTAMPTZ,
  -- High-severity investigations require multi-party authorization to close
  close_auth_request_id UUID REFERENCES public.authorization_requests(id),
  notes          TEXT
);

CREATE INDEX ON public.investigations (status);
CREATE INDEX ON public.investigations (severity);

-- ─── Metric definitions and results ──────────────────────────────────────────
CREATE TABLE public.metric_definitions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              TEXT NOT NULL UNIQUE,
  slug              TEXT NOT NULL UNIQUE,   -- e.g. 'verified_employment_rate'
  formula           TEXT NOT NULL,
  description       TEXT NOT NULL,
  inclusion_rules   TEXT[],
  exclusion_rules   TEXT[],
  verified_only     BOOLEAN NOT NULL DEFAULT TRUE,
  version           TEXT NOT NULL DEFAULT '1.0',
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed all KPI definitions
INSERT INTO public.metric_definitions (name, slug, formula, description, verified_only, version) VALUES
  ('Enrollment Rate',          'enrollment_rate',          'enrolled / invited * 100',                        'Students enrolled out of those invited',           FALSE, '1.0'),
  ('Training Completion Rate', 'training_completion_rate', 'completed / enrolled * 100',                      'Students completing training',                    FALSE, '1.0'),
  ('Assessment Completion Rate','assessment_completion_rate','assessed / completed * 100',                    'Completing students who completed assessments',   FALSE, '1.0'),
  ('Job Ready Rate',           'job_readiness_rate',       'job_ready / assessed * 100',                     'Assessed students achieving readiness score ≥ 60', FALSE, '1.0'),
  ('Interview Rate',           'interview_rate',            'interviewed / job_ready * 100',                  'Job-ready students who received interviews',      FALSE, '1.0'),
  ('Selection Rate',           'selection_rate',            'selected / interviewed * 100',                   'Interviewed students who were selected',          FALSE, '1.0'),
  ('Verified Employment Rate', 'verified_employment_rate',  'verified_employed / enrolled * 100',             'Enrolled students with verified employment',       TRUE,  '1.0'),
  ('Retention Rate (3 month)', 'retention_rate_3m',         'retained_3m / verified_employed * 100',          'Verified employed students retained at 3 months',  TRUE,  '1.0'),
  ('Avg Time to Employment',   'avg_time_to_employment',    'AVG(start_date - training_end_date) in days',    'Average days from training end to employment',     TRUE,  '1.0'),
  ('Re-employment Rate',       'reemployment_rate',         're_employed / verified_unemployed * 100',        'Verified unemployed students who found new work',  TRUE,  '1.0');

CREATE TABLE public.analytics_snapshots (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  snapshot_type       TEXT NOT NULL,    -- 'DASHBOARD', 'PROGRAM', 'AGENCY', 'SKILL', 'REGION'
  filters             JSONB NOT NULL DEFAULT '{}'::JSONB,
  data                JSONB NOT NULL,
  calculated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  calculation_version TEXT NOT NULL DEFAULT '1.0'
);

CREATE INDEX ON public.analytics_snapshots (snapshot_type, calculated_at DESC);

CREATE TABLE public.metric_results (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  definition_id       UUID NOT NULL REFERENCES public.metric_definitions(id),
  snapshot_id         UUID REFERENCES public.analytics_snapshots(id),
  filters             JSONB NOT NULL DEFAULT '{}'::JSONB,
  value               NUMERIC(12, 4) NOT NULL,
  numerator           NUMERIC(12, 4),
  denominator         NUMERIC(12, 4),
  calculated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  calculation_version TEXT NOT NULL DEFAULT '1.0'
);

CREATE INDEX ON public.metric_results (definition_id, calculated_at DESC);

-- ─── Simulation runs ──────────────────────────────────────────────────────────
CREATE TABLE public.simulation_runs (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  params            JSONB NOT NULL,
  results           JSONB NOT NULL,
  labelled_simulation BOOLEAN NOT NULL DEFAULT TRUE CHECK (labelled_simulation = TRUE),  -- Always TRUE
  created_by        UUID NOT NULL REFERENCES public.app_users(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.simulation_runs IS
  'labelled_simulation is always TRUE — enforced by CHECK constraint. '
  'Simulation outputs MUST be labelled everywhere they appear.';

-- ─── AI query log ────────────────────────────────────────────────────────────
CREATE TABLE public.ai_query_log (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id       UUID REFERENCES public.app_users(id),
  question       TEXT NOT NULL,
  intent         TEXT,
  evidence       JSONB,              -- The evidence object fed to LLM
  response       TEXT,
  model          TEXT,
  latency_ms     INTEGER,
  was_fallback   BOOLEAN NOT NULL DEFAULT FALSE,  -- TRUE if used deterministic fallback
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ON public.ai_query_log (actor_id, created_at DESC);

-- ─── Full notifications implementation ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.notify_employment_status_change(
  p_outcome_id UUID,
  p_new_status TEXT,
  p_correlation_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_outcome RECORD;
BEGIN
  SELECT eo.eoi_student_id, eo.agency_id, eo.job_role, eo.org_id,
         o.canonical_name AS org_name
    INTO v_outcome
    FROM public.employment_outcomes eo
    JOIN public.organizations o ON o.id = eo.org_id
    WHERE eo.id = p_outcome_id;

  -- Notify student
  INSERT INTO public.notifications (user_id, type, title, body, entity_type, entity_id, deep_link)
  SELECT u.id,
    'EMPLOYMENT_STATUS_CHANGE',
    'Employment status updated',
    format('Your employment record at %s (%s) has been updated to: %s',
      v_outcome.org_name, v_outcome.job_role, replace(p_new_status, '_', ' ')),
    'employment_outcome', p_outcome_id::TEXT,
    '/student/history'
  FROM public.app_users u
  WHERE u.eoi_student_id = v_outcome.eoi_student_id;

  -- Notify agency
  INSERT INTO public.notifications (user_id, type, title, body, entity_type, entity_id, deep_link)
  SELECT u.id,
    'EMPLOYMENT_STATUS_CHANGE',
    format('Employment record %s', replace(p_new_status, '_', ' ')),
    format('Employment record for student at %s has been updated to: %s',
      v_outcome.org_name, replace(p_new_status, '_', ' ')),
    'employment_outcome', p_outcome_id::TEXT,
    '/agency/dashboard'
  FROM public.app_users u
  WHERE u.agency_id = v_outcome.agency_id
    AND u.role IN ('agency_admin', 'agency_officer');
END;
$$;
