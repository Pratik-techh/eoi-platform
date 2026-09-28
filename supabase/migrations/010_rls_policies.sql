-- Migration 010: Row Level Security — default deny, all policies
-- MASTER_PROMPT Section 5.5 — complete RLS matrix

-- ─── Enable RLS on all tables ────────────────────────────────────────────────
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_identifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_readiness_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scoring_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allowed_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.selection_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employment_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employment_status_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employment_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorization_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorization_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomaly_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metric_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metric_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_query_log ENABLE ROW LEVEL SECURITY;

-- Enable RLS on ledger schema tables
ALTER TABLE ledger.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger.chain_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE pii.pii_identity ENABLE ROW LEVEL SECURITY;

-- ─── Helper function: get current user's app_user record ─────────────────────
CREATE OR REPLACE FUNCTION public.current_app_user()
RETURNS public.app_users
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT * FROM public.app_users WHERE id = auth.uid()
$$;

-- ─── Helper: get current user's role ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.actor_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.app_users WHERE id = auth.uid()
$$;

-- ─── Helper: get current user's agency_id ────────────────────────────────────
CREATE OR REPLACE FUNCTION public.current_user_agency_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT agency_id FROM public.app_users WHERE id = auth.uid()
$$;

-- ─── Helper: get current user's org_id ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.current_user_org_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT org_id FROM public.app_users WHERE id = auth.uid()
$$;

-- ─── Helper: get current student's eoi_student_id ────────────────────────────
CREATE OR REPLACE FUNCTION public.current_student_id()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT eoi_student_id FROM public.app_users WHERE id = auth.uid()
$$;

-- ════════════════════════════════════════════════════════════════════════════════
-- PII IDENTITY — restricted schema
-- ONLY agency roles (own agency students) may read
-- Government, analytics, employer, AI roles: NO ACCESS
-- ════════════════════════════════════════════════════════════════════════════════
CREATE POLICY "pii_agency_own_students" ON pii.pii_identity
  FOR SELECT
  USING (
    public.current_user_role() IN ('agency_admin', 'agency_officer')
    AND EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.eoi_student_id = pii_identity.eoi_student_id
        AND s.agency_id = public.current_user_agency_id()
    )
  );

-- Students can read their own PII
CREATE POLICY "pii_student_own" ON pii.pii_identity
  FOR SELECT
  USING (
    public.current_user_role() = 'student'
    AND eoi_student_id = public.current_student_id()
  );

-- ════════════════════════════════════════════════════════════════════════════════
-- ORGANIZATIONS — all authenticated users can see canonical orgs (name + claim status)
-- Employer roles: can see and manage their own org
-- ════════════════════════════════════════════════════════════════════════════════
CREATE POLICY "orgs_read_all_authenticated" ON public.organizations
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "orgs_employer_update_own" ON public.organizations
  FOR UPDATE USING (
    public.current_user_role() IN ('employer_admin')
    AND id = public.current_user_org_id()
  );

-- ─── Organization identifiers ─────────────────────────────────────────────────
CREATE POLICY "org_identifiers_read_all" ON public.organization_identifiers
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "org_identifiers_employer_own" ON public.organization_identifiers
  FOR INSERT WITH CHECK (
    public.current_user_role() IN ('employer_admin')
    AND org_id = public.current_user_org_id()
  );

-- ─── Agencies ─────────────────────────────────────────────────────────────────
CREATE POLICY "agencies_read_authenticated" ON public.agencies
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ─── Skills ──────────────────────────────────────────────────────────────────
CREATE POLICY "skills_read_all" ON public.skills
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ─── Courses ─────────────────────────────────────────────────────────────────
CREATE POLICY "courses_read_all" ON public.courses
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "courses_agency_write_own" ON public.courses
  FOR ALL USING (
    public.current_user_role() IN ('agency_admin', 'agency_officer')
    AND agency_id = public.current_user_agency_id()
  );

-- ─── Cohorts ─────────────────────────────────────────────────────────────────
CREATE POLICY "cohorts_read_all" ON public.cohorts
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "cohorts_agency_write_own" ON public.cohorts
  FOR ALL USING (
    public.current_user_role() IN ('agency_admin', 'agency_officer')
    AND agency_id = public.current_user_agency_id()
  );

-- ─── Students ────────────────────────────────────────────────────────────────
CREATE POLICY "students_agency_own" ON public.students
  FOR ALL USING (
    public.current_user_role() IN ('agency_admin', 'agency_officer')
    AND agency_id = public.current_user_agency_id()
  );

CREATE POLICY "students_student_own" ON public.students
  FOR SELECT USING (
    public.current_user_role() = 'student'
    AND eoi_student_id = public.current_student_id()
  );

-- Government: aggregate only (via views — direct table SELECT blocked for analytics)
CREATE POLICY "students_gov_analyst_no_pii" ON public.students
  FOR SELECT USING (
    public.current_user_role() IN ('gov_analyst', 'gov_program_admin', 'gov_auditor')
    -- Can see outcome fields but NOT in combination with PII (PII is in separate schema)
  );

-- ─── Employment outcomes ──────────────────────────────────────────────────────
CREATE POLICY "employment_agency_own" ON public.employment_outcomes
  FOR SELECT USING (
    public.current_user_role() IN ('agency_admin', 'agency_officer')
    AND agency_id = public.current_user_agency_id()
  );

-- Agency can INSERT via SECURITY DEFINER functions only
-- (RLS allows SELECT; writes go through report_employment function)
CREATE POLICY "employment_employer_own_org" ON public.employment_outcomes
  FOR SELECT USING (
    public.current_user_role() IN ('employer_admin', 'employer_verifier')
    AND org_id = public.current_user_org_id()
  );

CREATE POLICY "employment_student_own" ON public.employment_outcomes
  FOR SELECT USING (
    public.current_user_role() = 'student'
    AND eoi_student_id = public.current_student_id()
  );

CREATE POLICY "employment_gov_read_all" ON public.employment_outcomes
  FOR SELECT USING (
    public.current_user_role() IN ('gov_analyst', 'gov_program_admin', 'gov_auditor')
  );

-- ─── Employment status events ─────────────────────────────────────────────────
CREATE POLICY "emp_status_events_select_all_authenticated" ON public.employment_status_events
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- INSERT allowed (via triggers/functions); no direct UPDATE or DELETE
CREATE POLICY "emp_status_events_insert" ON public.employment_status_events
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ─── Employment verifications ─────────────────────────────────────────────────
CREATE POLICY "emp_verifications_read_all" ON public.employment_verifications
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "emp_verifications_insert" ON public.employment_verifications
  FOR INSERT WITH CHECK (
    public.current_user_role() = 'employer_verifier'
    AND verifier_org_id = public.current_user_org_id()
  );

-- ─── Disputes ────────────────────────────────────────────────────────────────
CREATE POLICY "disputes_student_own" ON public.disputes
  FOR SELECT USING (
    public.current_user_role() = 'student'
    AND eoi_student_id = public.current_student_id()
  );

CREATE POLICY "disputes_agency_read" ON public.disputes
  FOR SELECT USING (
    public.current_user_role() IN ('agency_admin', 'agency_officer')
    AND EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.eoi_student_id = disputes.eoi_student_id
        AND s.agency_id = public.current_user_agency_id()
    )
  );

CREATE POLICY "disputes_gov_read" ON public.disputes
  FOR SELECT USING (
    public.current_user_role() IN ('gov_auditor', 'gov_analyst', 'gov_program_admin')
  );

-- ─── Notifications ────────────────────────────────────────────────────────────
CREATE POLICY "notifications_own" ON public.notifications
  FOR ALL USING (user_id = auth.uid());

-- ─── Authorization requests ───────────────────────────────────────────────────
CREATE POLICY "auth_requests_gov_read" ON public.authorization_requests
  FOR SELECT USING (
    public.current_user_role() IN ('gov_analyst', 'gov_program_admin', 'gov_auditor')
  );

CREATE POLICY "auth_requests_submit" ON public.authorization_requests
  FOR INSERT WITH CHECK (
    public.current_user_role() IN ('gov_program_admin', 'agency_admin', 'employer_admin')
    AND requested_by = auth.uid()
  );

-- ─── Anomaly signals and investigations ──────────────────────────────────────
CREATE POLICY "anomaly_gov_read" ON public.anomaly_signals
  FOR SELECT USING (
    public.current_user_role() IN ('gov_analyst', 'gov_program_admin', 'gov_auditor', 'security_officer')
  );

CREATE POLICY "investigations_gov_read" ON public.investigations
  FOR SELECT USING (
    public.current_user_role() IN ('gov_auditor', 'security_officer')
  );

-- ─── Audit ledger ─────────────────────────────────────────────────────────────
CREATE POLICY "audit_events_read_auditor" ON ledger.audit_events
  FOR SELECT USING (
    public.current_user_role() IN ('gov_auditor', 'gov_analyst', 'security_officer')
  );

CREATE POLICY "audit_events_insert_all" ON ledger.audit_events
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "chain_state_read_auditor" ON ledger.chain_state
  FOR SELECT USING (
    public.current_user_role() IN ('gov_auditor', 'gov_analyst')
  );

-- ─── Metric definitions / analytics ───────────────────────────────────────────
CREATE POLICY "metric_defs_read_all" ON public.metric_definitions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "analytics_snapshots_gov_read" ON public.analytics_snapshots
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "metric_results_read_all" ON public.metric_results
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ─── Simulation runs ──────────────────────────────────────────────────────────
CREATE POLICY "simulation_gov_all" ON public.simulation_runs
  FOR ALL USING (
    public.current_user_role() IN ('gov_analyst', 'gov_program_admin')
  );

-- ─── AI query log ────────────────────────────────────────────────────────────
CREATE POLICY "ai_log_gov_read" ON public.ai_query_log
  FOR SELECT USING (
    public.current_user_role() IN ('gov_analyst', 'gov_program_admin', 'gov_auditor')
  );

CREATE POLICY "ai_log_insert_gov" ON public.ai_query_log
  FOR INSERT WITH CHECK (
    public.current_user_role() IN ('gov_analyst', 'gov_program_admin')
  );

-- ─── Assessment results ───────────────────────────────────────────────────────
CREATE POLICY "assessment_results_agency_own" ON public.assessment_results
  FOR ALL USING (
    public.current_user_role() IN ('agency_admin', 'agency_officer')
    AND EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.eoi_student_id = assessment_results.eoi_student_id
        AND s.agency_id = public.current_user_agency_id()
    )
  );

CREATE POLICY "assessment_results_student_own" ON public.assessment_results
  FOR SELECT USING (
    public.current_user_role() = 'student'
    AND eoi_student_id = public.current_student_id()
  );

-- ─── Job readiness records ────────────────────────────────────────────────────
CREATE POLICY "readiness_agency_own" ON public.job_readiness_records
  FOR SELECT USING (
    public.current_user_role() IN ('agency_admin', 'agency_officer')
    AND EXISTS (
      SELECT 1 FROM public.students s
      WHERE s.eoi_student_id = job_readiness_records.eoi_student_id
        AND s.agency_id = public.current_user_agency_id()
    )
  );

CREATE POLICY "readiness_student_own" ON public.job_readiness_records
  FOR SELECT USING (
    public.current_user_role() = 'student'
    AND eoi_student_id = public.current_student_id()
  );

CREATE POLICY "readiness_gov_read" ON public.job_readiness_records
  FOR SELECT USING (
    public.current_user_role() IN ('gov_analyst', 'gov_program_admin', 'gov_auditor')
  );

-- ─── Scoring versions ─────────────────────────────────────────────────────────
CREATE POLICY "scoring_versions_read_all" ON public.scoring_versions
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ─── Allowed transitions ─────────────────────────────────────────────────────
CREATE POLICY "allowed_transitions_read_all" ON public.allowed_transitions
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- ─── Industry feedback ────────────────────────────────────────────────────────
CREATE POLICY "industry_feedback_employer_own" ON public.industry_feedback
  FOR ALL USING (
    public.current_user_role() IN ('employer_admin', 'employer_verifier')
    AND (org_id IS NULL OR org_id = public.current_user_org_id())
  );

CREATE POLICY "industry_feedback_gov_read" ON public.industry_feedback
  FOR SELECT USING (
    public.current_user_role() IN ('gov_analyst', 'gov_program_admin', 'gov_auditor')
  );

CREATE POLICY "industry_feedback_agency_read" ON public.industry_feedback
  FOR SELECT USING (
    public.current_user_role() IN ('agency_admin', 'agency_officer')
  );

-- ─── Skill requirements ───────────────────────────────────────────────────────
CREATE POLICY "skill_requirements_read_all" ON public.skill_requirements
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "skill_requirements_employer_write" ON public.skill_requirements
  FOR INSERT WITH CHECK (
    public.current_user_role() IN ('employer_admin', 'employer_verifier')
  );
