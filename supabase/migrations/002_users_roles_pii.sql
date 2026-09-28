-- Migration 002: Users, roles, PII identity
-- Core identity model with physical PII separation

-- ─── PII identity (restricted schema) ──────────────────────────────────────
-- eoi_student_id is the only universal key — never Aadhaar/phone/email
CREATE TABLE pii.pii_identity (
  eoi_student_id    TEXT PRIMARY KEY,   -- EOI-S- + base32 random, opaque
  full_name         TEXT NOT NULL,
  date_of_birth     DATE,
  phone_token       TEXT,               -- Application-level encrypted reference token
  email_token       TEXT,               -- Application-level encrypted reference token
  address_encrypted TEXT,              -- AES-GCM encrypted at application layer
  govt_id_token     TEXT,               -- Reference token only — raw Aadhaar/etc never stored
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE pii.pii_identity IS
  'Physically separated PII. Government/analytics/AI roles have no access. '
  'Joined to outcome tables only by eoi_student_id. '
  'Raw Aadhaar/phone/email are never stored — only reference tokens.';

CREATE INDEX ON pii.pii_identity (eoi_student_id);

-- ─── Roles ──────────────────────────────────────────────────────────────────
CREATE TABLE public.roles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        public.actor_role NOT NULL UNIQUE,
  family      TEXT NOT NULL CHECK (family IN ('government', 'agency', 'student', 'employer', 'platform')),
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.roles (name, family, description) VALUES
  ('gov_analyst',       'government', 'Read aggregated intelligence, AI Q&A, export reports'),
  ('gov_program_admin', 'government', 'Configure programs, propose scoring versions'),
  ('gov_auditor',       'government', 'Full read of audit/event ledger, run chain verification'),
  ('agency_admin',      'agency',     'Manage own agency users, courses, cohorts, students'),
  ('agency_officer',    'agency',     'Register/import students, assessments, report employment'),
  ('student',           'student',    'Own profile/passport, report unemployment, raise disputes'),
  ('employer_admin',    'employer',   'Manage org users, submit org claim, feedback'),
  ('employer_verifier', 'employer',   'Confirm/Reject/Correct verification requests for own org'),
  ('security_officer',  'platform',   'Receive/triage security events, revoke sessions'),
  ('platform_ops',      'platform',   'Infra health, deployments');

-- ─── Users ──────────────────────────────────────────────────────────────────
-- Extends Supabase auth.users with application-layer fields
CREATE TABLE public.app_users (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role             public.actor_role NOT NULL,
  agency_id        UUID,               -- FK added after agencies table
  org_id           UUID,               -- FK added after organizations table
  eoi_student_id   TEXT,               -- FK added after students table
  mfa_enrolled     BOOLEAN NOT NULL DEFAULT FALSE,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at    TIMESTAMPTZ
);

COMMENT ON TABLE public.app_users IS
  'Application-level user profile extending Supabase auth.users. '
  'agency_id, org_id, eoi_student_id are scoping keys for RLS.';

CREATE INDEX ON public.app_users (role);
CREATE INDEX ON public.app_users (agency_id);
CREATE INDEX ON public.app_users (org_id);
CREATE INDEX ON public.app_users (eoi_student_id);

-- ─── Active sessions (for revocation UI) ────────────────────────────────────
CREATE TABLE public.active_sessions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
  session_token_hash TEXT NOT NULL,      -- Hash of session JWT, not the token itself
  user_agent   TEXT,
  ip_address   INET,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at   TIMESTAMPTZ
);

CREATE INDEX ON public.active_sessions (user_id);
CREATE INDEX ON public.active_sessions (revoked_at) WHERE revoked_at IS NULL;

-- ─── Consents (DPDP-aligned) ─────────────────────────────────────────────────
CREATE TABLE public.consents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eoi_student_id  TEXT NOT NULL,
  scope           TEXT NOT NULL,    -- e.g. 'passport:employer_view', 'skills:public'
  purpose         TEXT NOT NULL,    -- DPDP purpose limitation
  granted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at      TIMESTAMPTZ,
  granted_by_ip   INET,
  UNIQUE (eoi_student_id, scope)
);

COMMENT ON TABLE public.consents IS 'DPDP-aligned consent records. Revocation creates new event; does not delete.';

CREATE INDEX ON public.consents (eoi_student_id);
