-- Migration 008: SECURITY DEFINER write functions (the only write path for critical operations)
-- MASTER_PROMPT Section 5.4 — all critical writes in one atomic transaction

-- ─── State machine validation helper ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.validate_employment_transition(
  p_outcome_id UUID,
  p_to_status  public.employment_status,
  p_actor_role public.actor_role
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_status public.employment_status;
  v_is_allowed BOOLEAN;
BEGIN
  -- Get current status
  SELECT employment_status INTO v_current_status
    FROM public.employment_outcomes
    WHERE id = p_outcome_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Employment outcome % not found', p_outcome_id;
  END IF;

  -- Check allowed_transitions
  SELECT EXISTS (
    SELECT 1 FROM public.allowed_transitions
    WHERE from_status = v_current_status
      AND to_status = p_to_status
      AND actor_role = p_actor_role
  ) INTO v_is_allowed;

  IF NOT v_is_allowed THEN
    -- Log invalid transition attempt to ledger before raising
    PERFORM ledger.insert_event(
      NULL, p_actor_role,
      'INVALID_TRANSITION_ATTEMPT', 'SYSTEM',
      'employment_outcome', p_outcome_id::TEXT,
      jsonb_build_object('status', v_current_status),
      jsonb_build_object('attempted_status', p_to_status),
      uuid_generate_v4(),
      jsonb_build_object('reason', 'Transition not in allowed_transitions')
    );
    RAISE EXCEPTION 'Invalid state transition: % → % for role %. This attempt has been logged.',
      v_current_status, p_to_status, p_actor_role;
  END IF;
END;
$$;

-- ─── report_employment ────────────────────────────────────────────────────────
-- Called by: agency_officer, agency_admin
-- Validates: temporal constraints, duplicates, entity references
CREATE OR REPLACE FUNCTION public.report_employment(
  p_actor_id       UUID,
  p_actor_role     public.actor_role,
  p_eoi_student_id TEXT,
  p_agency_id      UUID,
  p_org_id         UUID,
  p_job_role       TEXT,
  p_start_date     DATE,
  p_employment_type TEXT DEFAULT 'FULL_TIME',
  p_compensation_band TEXT DEFAULT NULL,
  p_location_state TEXT DEFAULT NULL,
  p_location_district TEXT DEFAULT NULL,
  p_idempotency_key TEXT DEFAULT NULL,
  p_correlation_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_outcome_id     UUID;
  v_correlation_id UUID;
  v_seq_num        INTEGER;
  v_training_end   DATE;
  v_idempotency_key TEXT;
BEGIN
  -- Role check (P1: only agency roles can report)
  IF p_actor_role NOT IN ('agency_officer', 'agency_admin') THEN
    RAISE EXCEPTION 'Only agency roles can report employment (P1 enforcement). Role: %', p_actor_role;
  END IF;

  -- Agency scope: actor must belong to the reporting agency
  IF NOT EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = p_actor_id AND agency_id = p_agency_id
  ) THEN
    RAISE EXCEPTION 'Actor % does not belong to agency % (scope violation)', p_actor_id, p_agency_id;
  END IF;

  -- Student must belong to reporting agency
  IF NOT EXISTS (
    SELECT 1 FROM public.students
    WHERE eoi_student_id = p_eoi_student_id AND agency_id = p_agency_id
  ) THEN
    RAISE EXCEPTION 'Student % does not belong to agency % (referential integrity)', p_eoi_student_id, p_agency_id;
  END IF;

  -- Idempotency: return existing outcome if key already used
  v_idempotency_key := COALESCE(p_idempotency_key,
    md5(p_eoi_student_id || p_org_id::TEXT || p_start_date::TEXT));

  SELECT id INTO v_outcome_id
    FROM public.employment_outcomes
    WHERE idempotency_key = v_idempotency_key;

  IF FOUND THEN
    RETURN v_outcome_id;  -- Idempotent: same result
  END IF;

  -- Temporal validation: employment start cannot precede training completion
  SELECT MAX(e.completed_at::DATE) INTO v_training_end
    FROM public.enrollments e
    WHERE e.eoi_student_id = p_eoi_student_id;

  IF v_training_end IS NOT NULL AND p_start_date < v_training_end THEN
    -- Log temporal violation anomaly
    INSERT INTO public.anomaly_signals (signal_type, entity_type, entity_id, severity, description, auto_resolved)
    VALUES ('TEMPORAL_VIOLATION', 'employment_report', p_eoi_student_id, 'HIGH',
      format('Employment start date %s precedes training completion %s', p_start_date, v_training_end), FALSE);
    RAISE EXCEPTION 'Employment start date % precedes training completion date % (temporal violation). Flag as exception first.',
      p_start_date, v_training_end;
  END IF;

  -- Sequence number (re-employment counting)
  SELECT COALESCE(MAX(sequence_number), 0) + 1 INTO v_seq_num
    FROM public.employment_outcomes
    WHERE eoi_student_id = p_eoi_student_id;

  v_correlation_id := COALESCE(p_correlation_id, uuid_generate_v4());

  -- Create employment outcome
  INSERT INTO public.employment_outcomes (
    eoi_student_id, agency_id, org_id, job_role, employment_type,
    compensation_band, location_state, location_district,
    start_date, employment_status, sequence_number,
    idempotency_key, reported_by, reported_at
  ) VALUES (
    p_eoi_student_id, p_agency_id, p_org_id, p_job_role, p_employment_type,
    p_compensation_band, p_location_state, p_location_district,
    p_start_date, 'REPORTED', v_seq_num,
    v_idempotency_key, p_actor_id, NOW()
  ) RETURNING id INTO v_outcome_id;

  -- Status event
  INSERT INTO public.employment_status_events (
    seq, outcome_id, from_status, to_status, actor_id, actor_role, source, correlation_id
  ) VALUES (
    nextval('employment_status_event_seq'), v_outcome_id,
    NULL, 'REPORTED', p_actor_id, p_actor_role, 'AGENCY', v_correlation_id
  );

  -- Advance to PENDING_VERIFICATION
  PERFORM public.validate_employment_transition(v_outcome_id, 'PENDING_VERIFICATION', p_actor_role);

  UPDATE public.employment_outcomes SET employment_status = 'PENDING_VERIFICATION', updated_at = NOW()
    WHERE id = v_outcome_id;

  INSERT INTO public.employment_status_events (
    seq, outcome_id, from_status, to_status, actor_id, actor_role, source, correlation_id
  ) VALUES (
    nextval('employment_status_event_seq'), v_outcome_id,
    'REPORTED', 'PENDING_VERIFICATION', p_actor_id, p_actor_role, 'AGENCY', v_correlation_id
  );

  -- Ledger event
  PERFORM ledger.insert_event(
    p_actor_id, p_actor_role, 'EMPLOYMENT_REPORTED', 'AGENCY',
    'employment_outcome', v_outcome_id::TEXT,
    NULL, jsonb_build_object('status', 'PENDING_VERIFICATION', 'student', p_eoi_student_id, 'org', p_org_id),
    v_correlation_id,
    jsonb_build_object('job_role', p_job_role, 'start_date', p_start_date)
  );

  -- Notification: employer
  INSERT INTO public.notifications (user_id, type, title, body, entity_type, entity_id)
  SELECT u.id, 'VERIFICATION_REQUEST',
    'New employment verification request',
    format('A new employment record for role "%s" requires your verification.', p_job_role),
    'employment_outcome', v_outcome_id::TEXT
  FROM public.app_users u
  WHERE u.org_id = p_org_id AND u.role = 'employer_verifier' AND u.is_active = TRUE;

  RETURN v_outcome_id;
END;
$$;

-- ─── confirm_employment ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.confirm_employment(
  p_actor_id    UUID,
  p_actor_role  public.actor_role,
  p_outcome_id  UUID,
  p_org_id      UUID,
  p_evidence    JSONB DEFAULT NULL,
  p_correlation_id UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_correlation_id UUID;
  v_prev_state JSONB;
BEGIN
  -- Role check: only employer_verifier
  IF p_actor_role <> 'employer_verifier' THEN
    RAISE EXCEPTION 'Only employer_verifier can confirm employment (P1 enforcement). Role: %', p_actor_role;
  END IF;

  -- Org scope check: verifier must belong to the org being verified
  IF NOT EXISTS (
    SELECT 1 FROM public.app_users
    WHERE id = p_actor_id AND org_id = p_org_id
  ) THEN
    RAISE EXCEPTION 'Verifier % does not belong to organization % (scope violation)', p_actor_id, p_org_id;
  END IF;

  -- Outcome must be for this org
  IF NOT EXISTS (
    SELECT 1 FROM public.employment_outcomes WHERE id = p_outcome_id AND org_id = p_org_id
  ) THEN
    RAISE EXCEPTION 'Employment outcome % does not belong to organization %', p_outcome_id, p_org_id;
  END IF;

  -- Validate transition
  PERFORM public.validate_employment_transition(p_outcome_id, 'VERIFIED_EMPLOYED', p_actor_role);

  SELECT jsonb_build_object('status', employment_status) INTO v_prev_state
    FROM public.employment_outcomes WHERE id = p_outcome_id;

  v_correlation_id := COALESCE(p_correlation_id, uuid_generate_v4());

  -- Record verification
  INSERT INTO public.employment_verifications (outcome_id, verifier_org_id, verifier_user_id, action, evidence, correlation_id)
  VALUES (p_outcome_id, p_org_id, p_actor_id, 'CONFIRM', p_evidence, v_correlation_id);

  -- Transition
  UPDATE public.employment_outcomes
    SET employment_status = 'VERIFIED_EMPLOYED', updated_at = NOW()
    WHERE id = p_outcome_id;

  INSERT INTO public.employment_status_events (
    seq, outcome_id, from_status, to_status, actor_id, actor_role, source, correlation_id
  ) VALUES (
    nextval('employment_status_event_seq'), p_outcome_id,
    'PENDING_VERIFICATION', 'VERIFIED_EMPLOYED', p_actor_id, p_actor_role, 'EMPLOYER', v_correlation_id
  );

  -- Ledger event
  PERFORM ledger.insert_event(
    p_actor_id, p_actor_role, 'EMPLOYMENT_CONFIRMED', 'EMPLOYER',
    'employment_outcome', p_outcome_id::TEXT,
    v_prev_state, jsonb_build_object('status', 'VERIFIED_EMPLOYED'),
    v_correlation_id, p_evidence
  );

  -- Analytics recalculation trigger
  PERFORM public.trigger_analytics_recalculation(p_outcome_id, v_correlation_id);

  -- Notify student and agency
  PERFORM public.notify_employment_status_change(p_outcome_id, 'VERIFIED_EMPLOYED', v_correlation_id);
END;
$$;

-- ─── reject_employment ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.reject_employment(
  p_actor_id    UUID,
  p_actor_role  public.actor_role,
  p_outcome_id  UUID,
  p_org_id      UUID,
  p_reason      TEXT,
  p_correlation_id UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_correlation_id UUID;
  v_prev_state JSONB;
BEGIN
  IF p_actor_role <> 'employer_verifier' THEN
    RAISE EXCEPTION 'Only employer_verifier can reject employment. Role: %', p_actor_role;
  END IF;

  IF p_reason IS NULL OR trim(p_reason) = '' THEN
    RAISE EXCEPTION 'Rejection reason is required';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.app_users WHERE id = p_actor_id AND org_id = p_org_id) THEN
    RAISE EXCEPTION 'Verifier scope violation';
  END IF;

  PERFORM public.validate_employment_transition(p_outcome_id, 'REJECTED', p_actor_role);

  SELECT jsonb_build_object('status', employment_status) INTO v_prev_state
    FROM public.employment_outcomes WHERE id = p_outcome_id;

  v_correlation_id := COALESCE(p_correlation_id, uuid_generate_v4());

  INSERT INTO public.employment_verifications (outcome_id, verifier_org_id, verifier_user_id, action, reason, correlation_id)
  VALUES (p_outcome_id, p_org_id, p_actor_id, 'REJECT', p_reason, v_correlation_id);

  UPDATE public.employment_outcomes SET employment_status = 'REJECTED', updated_at = NOW()
    WHERE id = p_outcome_id;

  INSERT INTO public.employment_status_events (seq, outcome_id, from_status, to_status, actor_id, actor_role, source, notes, correlation_id)
  VALUES (nextval('employment_status_event_seq'), p_outcome_id,
    'PENDING_VERIFICATION', 'REJECTED', p_actor_id, p_actor_role, 'EMPLOYER', p_reason, v_correlation_id);

  PERFORM ledger.insert_event(p_actor_id, p_actor_role, 'EMPLOYMENT_REJECTED', 'EMPLOYER',
    'employment_outcome', p_outcome_id::TEXT, v_prev_state, jsonb_build_object('status', 'REJECTED', 'reason', p_reason),
    v_correlation_id, jsonb_build_object('reason', p_reason));

  PERFORM public.trigger_analytics_recalculation(p_outcome_id, v_correlation_id);
  PERFORM public.notify_employment_status_change(p_outcome_id, 'REJECTED', v_correlation_id);
END;
$$;

-- ─── report_unemployment ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.report_unemployment(
  p_actor_id    UUID,
  p_actor_role  public.actor_role,
  p_outcome_id  UUID,
  p_end_date    DATE DEFAULT NULL,
  p_correlation_id UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_correlation_id UUID;
  v_prev_state JSONB;
  v_eoi_student_id TEXT;
BEGIN
  -- Only student or employer_verifier can report unemployment
  IF p_actor_role NOT IN ('student', 'employer_verifier') THEN
    RAISE EXCEPTION 'Only student or employer_verifier can report unemployment. Role: %', p_actor_role;
  END IF;

  -- If student: must own the record
  SELECT eoi_student_id INTO v_eoi_student_id FROM public.employment_outcomes WHERE id = p_outcome_id;

  IF p_actor_role = 'student' THEN
    IF NOT EXISTS (SELECT 1 FROM public.app_users WHERE id = p_actor_id AND eoi_student_id = v_eoi_student_id) THEN
      RAISE EXCEPTION 'Student does not own this employment record (scope violation)';
    END IF;
  END IF;

  PERFORM public.validate_employment_transition(p_outcome_id, 'UNEMPLOYMENT_REPORTED', p_actor_role);

  SELECT jsonb_build_object('status', employment_status) INTO v_prev_state
    FROM public.employment_outcomes WHERE id = p_outcome_id;

  v_correlation_id := COALESCE(p_correlation_id, uuid_generate_v4());

  UPDATE public.employment_outcomes
    SET employment_status = 'UNEMPLOYMENT_REPORTED',
        end_date = COALESCE(p_end_date, CURRENT_DATE),
        updated_at = NOW()
    WHERE id = p_outcome_id;

  INSERT INTO public.employment_status_events (seq, outcome_id, from_status, to_status, actor_id, actor_role, source, correlation_id)
  VALUES (nextval('employment_status_event_seq'), p_outcome_id,
    'VERIFIED_EMPLOYED', 'UNEMPLOYMENT_REPORTED', p_actor_id, p_actor_role,
    CASE WHEN p_actor_role = 'student' THEN 'STUDENT' ELSE 'EMPLOYER' END, v_correlation_id);

  PERFORM ledger.insert_event(p_actor_id, p_actor_role, 'UNEMPLOYMENT_REPORTED', 'STUDENT',
    'employment_outcome', p_outcome_id::TEXT, v_prev_state,
    jsonb_build_object('status', 'UNEMPLOYMENT_REPORTED', 'end_date', p_end_date),
    v_correlation_id, '{}'::JSONB);

  PERFORM public.notify_employment_status_change(p_outcome_id, 'UNEMPLOYMENT_REPORTED', v_correlation_id);
END;
$$;

-- ─── request_correction ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.request_correction(
  p_actor_id    UUID,
  p_actor_role  public.actor_role,
  p_outcome_id  UUID,
  p_org_id      UUID,
  p_reason      TEXT,
  p_correlation_id UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_correlation_id UUID;
BEGIN
  IF p_actor_role <> 'employer_verifier' THEN
    RAISE EXCEPTION 'Only employer_verifier can request correction';
  END IF;

  IF p_reason IS NULL OR trim(p_reason) = '' THEN
    RAISE EXCEPTION 'Correction reason is required';
  END IF;

  PERFORM public.validate_employment_transition(p_outcome_id, 'CORRECTION_REQUESTED', p_actor_role);

  v_correlation_id := COALESCE(p_correlation_id, uuid_generate_v4());

  INSERT INTO public.employment_verifications (outcome_id, verifier_org_id, verifier_user_id, action, reason, correlation_id)
  VALUES (p_outcome_id, p_org_id, p_actor_id, 'REQUEST_CORRECTION', p_reason, v_correlation_id);

  UPDATE public.employment_outcomes SET employment_status = 'CORRECTION_REQUESTED', updated_at = NOW()
    WHERE id = p_outcome_id;

  INSERT INTO public.employment_status_events (seq, outcome_id, from_status, to_status, actor_id, actor_role, source, notes, correlation_id)
  VALUES (nextval('employment_status_event_seq'), p_outcome_id,
    'PENDING_VERIFICATION', 'CORRECTION_REQUESTED', p_actor_id, p_actor_role, 'EMPLOYER', p_reason, v_correlation_id);

  PERFORM ledger.insert_event(p_actor_id, p_actor_role, 'CORRECTION_REQUESTED', 'EMPLOYER',
    'employment_outcome', p_outcome_id::TEXT, NULL, jsonb_build_object('status', 'CORRECTION_REQUESTED', 'reason', p_reason),
    v_correlation_id, jsonb_build_object('reason', p_reason));

  PERFORM public.notify_employment_status_change(p_outcome_id, 'CORRECTION_REQUESTED', v_correlation_id);
END;
$$;

-- ─── raise_dispute ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.raise_dispute(
  p_actor_id    UUID,
  p_actor_role  public.actor_role,
  p_entity_type TEXT,
  p_entity_id   TEXT,
  p_dispute_type TEXT,
  p_description TEXT,
  p_correlation_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_dispute_id UUID;
  v_correlation_id UUID;
  v_eoi_student_id TEXT;
BEGIN
  IF p_actor_role <> 'student' THEN
    RAISE EXCEPTION 'Only students can raise disputes';
  END IF;

  SELECT eoi_student_id INTO v_eoi_student_id FROM public.app_users WHERE id = p_actor_id;

  v_correlation_id := COALESCE(p_correlation_id, uuid_generate_v4());

  INSERT INTO public.disputes (
    eoi_student_id, entity_type, entity_id, dispute_type, description, status, correlation_id
  ) VALUES (
    v_eoi_student_id, p_entity_type, p_entity_id, p_dispute_type, p_description, 'OPEN', v_correlation_id
  ) RETURNING id INTO v_dispute_id;

  -- Overlay DISPUTED status on employment outcome if applicable
  IF p_entity_type = 'employment_outcome' THEN
    UPDATE public.employment_outcomes
      SET is_flagged = TRUE, flag_reason = 'DISPUTED: ' || p_description, updated_at = NOW()
      WHERE id = p_entity_id::UUID;
  END IF;

  PERFORM ledger.insert_event(p_actor_id, p_actor_role, 'DISPUTE_RAISED', 'STUDENT',
    p_entity_type, p_entity_id, NULL,
    jsonb_build_object('dispute_id', v_dispute_id, 'type', p_dispute_type),
    v_correlation_id, jsonb_build_object('description', p_description));

  RETURN v_dispute_id;
END;
$$;

-- ─── Stub functions (implemented in later migrations) ────────────────────────

-- Notification stub (implemented in migration 010)
CREATE OR REPLACE FUNCTION public.notify_employment_status_change(
  p_outcome_id UUID, p_new_status TEXT, p_correlation_id UUID
) RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  -- Stub: full implementation in migration 010
  NULL;
END;
$$;

-- Analytics recalculation stub (implemented in migration 009)
CREATE OR REPLACE FUNCTION public.trigger_analytics_recalculation(
  p_outcome_id UUID, p_correlation_id UUID
) RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  -- Stub: full implementation in migration 009
  NULL;
END;
$$;
