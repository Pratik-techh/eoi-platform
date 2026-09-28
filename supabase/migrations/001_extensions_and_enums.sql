-- Migration 001: Extensions and schemas
-- Foundational PostgreSQL extensions required for the EOI platform

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cryptographic functions (SHA-256 hash chaining, field-level encryption)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Fuzzy text matching (org name suggestion only — never auto-binding)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Unaccent for name normalisation
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ─── Schemas ────────────────────────────────────────────────────────────────

-- pii_identity lives in a restricted schema.
-- Government/analytics/AI roles have NO access to this schema.
-- Only agency roles (scoped to own agency) and platform_ops may access it.
CREATE SCHEMA IF NOT EXISTS pii;
COMMENT ON SCHEMA pii IS 'Physically separated PII store. Government and AI roles have no grants here.';

CREATE SCHEMA IF NOT EXISTS ledger;
COMMENT ON SCHEMA ledger IS 'Append-only event ledger with SHA-256 hash chain.';

-- ─── Enums ──────────────────────────────────────────────────────────────────

CREATE TYPE public.employment_status AS ENUM (
  'REPORTED',
  'PENDING_VERIFICATION',
  'VERIFIED_EMPLOYED',
  'REJECTED',
  'UNEMPLOYMENT_REPORTED',
  'RECONCILIATION_PENDING',
  'VERIFIED_UNEMPLOYED',
  'RECONCILED_BY_TIMEOUT',
  'NEW_EMPLOYMENT_REPORTED',
  'CORRECTION_REQUESTED',
  'DISPUTED'
);

CREATE TYPE public.verification_status AS ENUM (
  'REPORTED',
  'PENDING',
  'VERIFIED',
  'UNVERIFIED',
  'DISPUTED',
  'REJECTED',
  'SELF_REPORTED'
);

CREATE TYPE public.actor_role AS ENUM (
  'gov_analyst',
  'gov_program_admin',
  'gov_auditor',
  'agency_admin',
  'agency_officer',
  'student',
  'employer_admin',
  'employer_verifier',
  'security_officer',
  'platform_ops'
);

CREATE TYPE public.identifier_class AS ENUM (
  'CIN',
  'LLPIN',
  'EPFO_ESTABLISHMENT_ID',
  'OTHER_AUTHORIZED'
);

CREATE TYPE public.org_claim_status AS ENUM (
  'UNCLAIMED',
  'CLAIM_PENDING',
  'CLAIMED',
  'CLAIM_REJECTED'
);

CREATE TYPE public.auth_request_status AS ENUM (
  'PENDING',
  'APPROVED',
  'REJECTED'
);

CREATE TYPE public.investigation_status AS ENUM (
  'OPEN',
  'UNDER_REVIEW',
  'CLOSED'
);

CREATE TYPE public.dispute_status AS ENUM (
  'OPEN',
  'UNDER_REVIEW',
  'RESOLVED',
  'DISMISSED'
);

CREATE TYPE public.anomaly_severity AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL'
);
