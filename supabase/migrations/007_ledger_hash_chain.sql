-- Migration 007: Append-only ledger with SHA-256 hash chain
-- MASTER_PROMPT Section 5.4 — event integrity

-- ─── Ledger chain state ───────────────────────────────────────────────────────
CREATE TABLE ledger.chain_state (
  chain_id      TEXT PRIMARY KEY DEFAULT 'main',
  head_seq      BIGINT NOT NULL DEFAULT 0,
  head_hash     TEXT NOT NULL DEFAULT 'GENESIS',
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO ledger.chain_state (chain_id, head_seq, head_hash) VALUES ('main', 0, 'GENESIS');

-- ─── Audit events (the Event Ledger) ─────────────────────────────────────────
CREATE TABLE ledger.audit_events (
  event_id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seq            BIGINT NOT NULL UNIQUE,
  occurred_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actor_id       UUID,                         -- NULL for system events
  actor_role     public.actor_role,
  event_type     TEXT NOT NULL,
  source         TEXT NOT NULL,                -- 'AGENCY', 'STUDENT', 'EMPLOYER', 'SYSTEM', 'AI'
  entity_type    TEXT NOT NULL,                -- 'employment_outcome', 'student', 'org', etc.
  entity_id      TEXT NOT NULL,
  previous_state JSONB,
  new_state      JSONB,
  correlation_id UUID NOT NULL DEFAULT uuid_generate_v4(),
  payload        JSONB,
  -- Hash chain fields
  hash           TEXT NOT NULL,                -- SHA-256 hex
  previous_hash  TEXT NOT NULL                 -- Previous event's hash (or 'GENESIS')
);

COMMENT ON TABLE ledger.audit_events IS
  'APPEND-ONLY event ledger with SHA-256 hash chain. '
  'UPDATE/DELETE/TRUNCATE triggers raise exceptions. '
  'All roles have INSERT+SELECT only.';

CREATE INDEX ON ledger.audit_events (seq);
CREATE INDEX ON ledger.audit_events (entity_type, entity_id);
CREATE INDEX ON ledger.audit_events (correlation_id);
CREATE INDEX ON ledger.audit_events (occurred_at DESC);
CREATE INDEX ON ledger.audit_events (actor_id);
CREATE INDEX ON ledger.audit_events (event_type);

-- ─── Sequence for audit events ────────────────────────────────────────────────
CREATE SEQUENCE ledger.audit_event_seq START 1;

-- ─── BEFORE INSERT trigger: compute hash chain ────────────────────────────────
CREATE OR REPLACE FUNCTION ledger.compute_audit_hash()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_head_hash TEXT;
  v_head_seq  BIGINT;
  v_payload   TEXT;
BEGIN
  -- Acquire advisory lock per chain to prevent hash forks under concurrent inserts
  PERFORM pg_advisory_xact_lock(hashtext('ledger_chain_main'));

  -- Get current chain head
  SELECT head_hash, head_seq
    INTO v_head_hash, v_head_seq
    FROM ledger.chain_state
    WHERE chain_id = 'main'
    FOR UPDATE;

  -- Assign sequence number
  NEW.seq := v_head_seq + 1;
  NEW.previous_hash := v_head_hash;

  -- Build canonical JSON for hashing (deterministic key ordering)
  v_payload := json_build_object(
    'seq',          NEW.seq,
    'occurred_at',  NEW.occurred_at,
    'actor_id',     NEW.actor_id,
    'actor_role',   NEW.actor_role,
    'event_type',   NEW.event_type,
    'entity_type',  NEW.entity_type,
    'entity_id',    NEW.entity_id,
    'previous_hash', NEW.previous_hash
  )::TEXT;

  -- Compute SHA-256: previous_hash || canonical_json
  NEW.hash := encode(
    digest(NEW.previous_hash || v_payload, 'sha256'),
    'hex'
  );

  -- Advance chain head
  UPDATE ledger.chain_state
    SET head_seq  = NEW.seq,
        head_hash = NEW.hash,
        updated_at = NOW()
    WHERE chain_id = 'main';

  RETURN NEW;
END;
$$;

CREATE TRIGGER audit_events_hash_chain
  BEFORE INSERT ON ledger.audit_events
  FOR EACH ROW EXECUTE FUNCTION ledger.compute_audit_hash();

-- ─── BEFORE UPDATE/DELETE/TRUNCATE: block all modifications ──────────────────
CREATE OR REPLACE FUNCTION ledger.block_audit_modifications()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Audit ledger is append-only. UPDATE/DELETE/TRUNCATE are forbidden. (MASTER_PROMPT P4)';
END;
$$;

CREATE TRIGGER audit_events_no_update
  BEFORE UPDATE ON ledger.audit_events
  FOR EACH ROW EXECUTE FUNCTION ledger.block_audit_modifications();

CREATE TRIGGER audit_events_no_delete
  BEFORE DELETE ON ledger.audit_events
  FOR EACH ROW EXECUTE FUNCTION ledger.block_audit_modifications();

CREATE TRIGGER audit_events_no_truncate
  BEFORE TRUNCATE ON ledger.audit_events
  EXECUTE FUNCTION ledger.block_audit_modifications();

-- ─── Same append-only protection for employment_status_events ────────────────
CREATE OR REPLACE FUNCTION public.block_status_event_modifications()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Employment status events are append-only. UPDATE/DELETE are forbidden. (MASTER_PROMPT P4)';
END;
$$;

CREATE TRIGGER employment_status_events_no_update
  BEFORE UPDATE ON public.employment_status_events
  FOR EACH ROW EXECUTE FUNCTION public.block_status_event_modifications();

CREATE TRIGGER employment_status_events_no_delete
  BEFORE DELETE ON public.employment_status_events
  FOR EACH ROW EXECUTE FUNCTION public.block_status_event_modifications();

-- Same for employment_verifications
CREATE TRIGGER employment_verifications_no_update
  BEFORE UPDATE ON public.employment_verifications
  FOR EACH ROW EXECUTE FUNCTION public.block_status_event_modifications();

CREATE TRIGGER employment_verifications_no_delete
  BEFORE DELETE ON public.employment_verifications
  FOR EACH ROW EXECUTE FUNCTION public.block_status_event_modifications();

-- ─── Chain integrity verification function ────────────────────────────────────
CREATE OR REPLACE FUNCTION ledger.verify_chain(
  p_from_seq BIGINT DEFAULT 1,
  p_to_seq   BIGINT DEFAULT NULL
)
RETURNS TABLE (
  first_broken_seq BIGINT,
  broken_hash      TEXT,
  expected_hash    TEXT,
  total_verified   BIGINT,
  is_valid         BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_prev_hash TEXT := 'GENESIS';
  v_computed_hash TEXT;
  v_payload TEXT;
  v_row RECORD;
  v_count BIGINT := 0;
  v_broken_seq BIGINT := NULL;
  v_broken_hash TEXT := NULL;
  v_expected_hash TEXT := NULL;
BEGIN
  -- Walk the chain in sequence order
  FOR v_row IN
    SELECT seq, occurred_at, actor_id, actor_role, event_type,
           entity_type, entity_id, previous_hash, hash
      FROM ledger.audit_events
      WHERE seq >= p_from_seq
        AND (p_to_seq IS NULL OR seq <= p_to_seq)
      ORDER BY seq ASC
  LOOP
    -- Verify previous_hash linkage
    IF v_row.previous_hash <> v_prev_hash THEN
      v_broken_seq := v_row.seq;
      v_broken_hash := v_row.hash;
      v_expected_hash := 'previous_hash mismatch: expected ' || v_prev_hash || ' got ' || v_row.previous_hash;
      EXIT;
    END IF;

    -- Recompute hash
    v_payload := json_build_object(
      'seq',          v_row.seq,
      'occurred_at',  v_row.occurred_at,
      'actor_id',     v_row.actor_id,
      'actor_role',   v_row.actor_role,
      'event_type',   v_row.event_type,
      'entity_type',  v_row.entity_type,
      'entity_id',    v_row.entity_id,
      'previous_hash', v_row.previous_hash
    )::TEXT;

    v_computed_hash := encode(digest(v_prev_hash || v_payload, 'sha256'), 'hex');

    IF v_computed_hash <> v_row.hash THEN
      v_broken_seq := v_row.seq;
      v_broken_hash := v_row.hash;
      v_expected_hash := v_computed_hash;
      EXIT;
    END IF;

    v_prev_hash := v_row.hash;
    v_count := v_count + 1;
  END LOOP;

  RETURN QUERY SELECT
    v_broken_seq,
    v_broken_hash,
    v_expected_hash,
    v_count,
    v_broken_seq IS NULL;
END;
$$;

COMMENT ON FUNCTION ledger.verify_chain IS
  'Returns first broken link in the hash chain, or NULL if chain is intact. '
  'Used by Audit Explorer "Verify chain integrity" button.';

-- ─── Helper: insert ledger event (used by all SECURITY DEFINER write functions)
CREATE OR REPLACE FUNCTION ledger.insert_event(
  p_actor_id     UUID,
  p_actor_role   public.actor_role,
  p_event_type   TEXT,
  p_source       TEXT,
  p_entity_type  TEXT,
  p_entity_id    TEXT,
  p_prev_state   JSONB,
  p_new_state    JSONB,
  p_correlation_id UUID,
  p_payload      JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO ledger.audit_events (
    event_id, occurred_at, actor_id, actor_role, event_type, source,
    entity_type, entity_id, previous_state, new_state,
    correlation_id, payload,
    -- hash and previous_hash computed by trigger
    hash, previous_hash
  )
  VALUES (
    uuid_generate_v4(), NOW(), p_actor_id, p_actor_role, p_event_type, p_source,
    p_entity_type, p_entity_id, p_prev_state, p_new_state,
    p_correlation_id, p_payload,
    'PLACEHOLDER', 'PLACEHOLDER'  -- trigger overwrites these
  )
  RETURNING event_id INTO v_event_id;

  RETURN v_event_id;
END;
$$;
