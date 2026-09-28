-- Migration 003: Organizations and employer identity model
-- MASTER_PROMPT Section 5.3 — organization identity model

-- ─── Organizations (canonical) ───────────────────────────────────────────────
CREATE TABLE public.organizations (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  canonical_name   TEXT NOT NULL,
  name_normalized  TEXT NOT NULL GENERATED ALWAYS AS (lower(unaccent(canonical_name))) STORED,
  industry         TEXT,
  state            TEXT,
  district         TEXT,
  claim_status     public.org_claim_status NOT NULL DEFAULT 'UNCLAIMED',
  claimed_by_id    UUID REFERENCES public.app_users(id),
  claimed_at       TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.organizations IS
  'Canonical organization registry. '
  'An org becomes authoritative only through identifier proof + verification challenge. '
  'Name alone NEVER grants control (MASTER_PROMPT §5.3).';

CREATE INDEX ON public.organizations (name_normalized);
CREATE INDEX ON public.organizations USING gin (name_normalized gin_trgm_ops);
CREATE INDEX ON public.organizations (claim_status);

-- ─── Organization identifiers ────────────────────────────────────────────────
CREATE TABLE public.organization_identifiers (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id         UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  id_class       public.identifier_class NOT NULL,
  value          TEXT NOT NULL,
  verified_by    UUID REFERENCES public.app_users(id),
  verified_at    TIMESTAMPTZ,
  status         TEXT NOT NULL DEFAULT 'UNVERIFIED' CHECK (status IN ('UNVERIFIED', 'VERIFIED', 'REJECTED')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (id_class, value)
);

COMMENT ON TABLE public.organization_identifiers IS
  'One org may have multiple identifier types (CIN, LLPIN, EPFO, OTHER). '
  'The model must NOT assume every employer has a CIN (MASTER_PROMPT §5.3).';

CREATE INDEX ON public.organization_identifiers (org_id);
CREATE INDEX ON public.organization_identifiers (id_class, value);

-- ─── Organization claims (verification challenge flow) ───────────────────────
CREATE TABLE public.organization_claims (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id              UUID NOT NULL REFERENCES public.organizations(id),
  claimed_by_user_id  UUID NOT NULL REFERENCES public.app_users(id),
  identifier_id       UUID REFERENCES public.organization_identifiers(id),
  challenge_type      TEXT NOT NULL CHECK (challenge_type IN ('EMAIL_TOKEN', 'DOCUMENT_UPLOAD')),
  challenge_token     TEXT,                 -- One-time token (hashed, never plain)
  challenge_token_hash TEXT,
  document_url        TEXT,                -- Supabase Storage path (if document upload)
  status              TEXT NOT NULL DEFAULT 'PENDING'
                        CHECK (status IN ('PENDING', 'CHALLENGE_SENT', 'VERIFIED', 'REJECTED', 'EXPIRED')),
  -- Multi-party authorization required for overrides
  auth_request_id     UUID,               -- FK added after authorization_requests
  submitted_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at         TIMESTAMPTZ,
  resolver_id         UUID REFERENCES public.app_users(id)
);

COMMENT ON TABLE public.organization_claims IS
  'Claiming an org requires identifier proof + verification challenge. '
  'Fuzzy name match may suggest candidates; it never auto-binds control.';

CREATE INDEX ON public.organization_claims (org_id);
CREATE INDEX ON public.organization_claims (claimed_by_user_id);
CREATE INDEX ON public.organization_claims (status);

-- ─── Agencies (training agencies) ───────────────────────────────────────────
CREATE TABLE public.agencies (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           TEXT NOT NULL,
  name_normalized TEXT NOT NULL GENERATED ALWAYS AS (lower(unaccent(name))) STORED,
  state          TEXT NOT NULL,
  district       TEXT,
  accreditation  TEXT,
  contact_email  TEXT,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX ON public.agencies (name_normalized);
CREATE INDEX ON public.agencies (state);

-- Add agency FK to app_users now that agencies table exists
ALTER TABLE public.app_users
  ADD CONSTRAINT app_users_agency_id_fkey
    FOREIGN KEY (agency_id) REFERENCES public.agencies(id);

-- Add org FK to app_users
ALTER TABLE public.app_users
  ADD CONSTRAINT app_users_org_id_fkey
    FOREIGN KEY (org_id) REFERENCES public.organizations(id);
