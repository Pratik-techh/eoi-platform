# Row-Level Security (RLS) Policy Matrix
**Employment Outcome Intelligence (EOI) Platform**
*Classification: Formal Security Architecture Specification*
*Reference: MASTER_PROMPT Section 2 (P1-P5), Section 4 (Roles & Access), Migration 002*

---

## 1. Executive Summary & Security Model

The EOI Platform enforces a **Zero Trust Defense-in-Depth** model:
1. **Application-Layer Guards:** Every API Route Handler and Server Action validates the caller's session, assigned role, resource ownership, and valid state-machine transition before executing database queries.
2. **Database-Level RLS:** PostgreSQL Row-Level Security policies are strictly enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY; ALTER TABLE ... FORCE ROW LEVEL SECURITY;`) on all application tables.
3. **No Master Administrator:** There is no generic "superadmin" role with blanket SELECT/INSERT/UPDATE/DELETE grants.
4. **Append-Only Immutability:** Historical outcome tables (`audit_ledger`, `employment_events`, `verification_decisions`, `student_disputes`) have `UPDATE` and `DELETE` privileges permanently revoked from all standard roles, enforced by PostgreSQL `BEFORE UPDATE OR DELETE` triggers that raise `SQLSTATE 42501` (insufficient privilege).
5. **PII Isolation:** Personally Identifiable Information (Aadhaar, legal name, phone, address) resides exclusively in `student_pii`, accessible strictly to the student themselves and authorised agency staff for registered cohorts under RLS. Government analysts, auditors, and employers only ever see de-identified profiles (`student_profiles`).

---

## 2. Platform Roles & Families

| Role Identifier | Family | Scope & Authority |
|---|---|---|
| `gov_analyst` | Government | Read-only aggregated analytical views, funnel distributions, simulation tools, AI query engine. Strictly prohibited from viewing raw PII or writing outcome records. |
| `gov_program_admin` | Government | Configure accredited programs, register target cohorts, propose scoring methodology versions. Cannot self-activate scoring versions alone or verify employment. |
| `gov_auditor` | Government | Read access to raw audit ledger, cryptographic hash verification, open/close formal anomaly investigations. No write access to operational data. |
| `agency_admin` | Training Agency | Manage institutional profile, accredited curriculum, instructor assignments, and cohort rosters for their own agency (`agency_id`). |
| `agency_officer` | Training Agency | Register students, record theory/practical/capstone assessments, compute readiness scores, report placement claims. **Prohibited from self-verifying employment.** |
| `student` | Student | Read own employability passport, download verifiable outcome credentials, toggle DPDP consent flags, report self-unemployment, submit disputes. **Prohibited from self-verifying employment.** |
| `employer_admin` | Employer | Manage canonical corporate profiles, verify organizational identifiers (CIN, GSTIN, TAN), manage authorized verifiers for their own organization (`org_id`). |
| `employer_verifier` | Employer | Review incoming verification requests for their verified canonical organization, confirm/reject placement claims, confirm employee departures. |
| `security_officer` | Platform / Ops | Read security audit logs, anomaly detection telemetry, revoke compromised sessions, review high-severity integrity alarms. Prohibited from modifying outcome data. |
| `platform_ops` | Platform / Ops | Infrastructure health, migration status, queue throughput. Strictly isolated from business and outcome data plane. |
| `ai_analyst` | System / Automation | Service account utilized by LLM/AI interpretation engine. Strictly granted `SELECT` privileges only on aggregated, whitelisted SQL views (`v_kpi_summary`, `v_skill_gap`, `v_agency_metrics`). No access to raw event tables, PII, or write endpoints. |

---

## 3. Comprehensive RLS Matrix

### Legend
- **S:** `SELECT` (Read)
- **I:** `INSERT` (Create)
- **U:** `UPDATE` (Modify)
- **D:** `DELETE` (Remove)
- **—:** Denied / No access
- `(own)`: Filtered to caller's own agency, organization, or student ID.
- `(agg)`: De-identified aggregated views only.
- `(req)`: Requires multi-party authorization request approval.

| Table Name | `gov_analyst` | `gov_program_admin` | `gov_auditor` | `agency_admin` | `agency_officer` | `student` | `employer_admin` | `employer_verifier` | `security_officer` | `ai_analyst` |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Identity & Users** | | | | | | | | | | |
| `users` | — | — | S | S (own) | — | S (own) | S (own) | S (own) | S | — |
| `user_roles` | — | — | S | S (own) | — | S (own) | S (own) | — | S, U (req) | — |
| `user_sessions` | — | — | S | — | — | S (own) | — | — | S, D (revoke) | — |
| **Academic & Skilling** | | | | | | | | | | |
| `programs` | S | S, I, U | S | S | S | S | S | S | S | S |
| `courses` | S | S, U | S | S, I (own) | S (own) | S | S | S | — | S |
| `training_agencies` | S | S, U | S | S, U (own) | S (own) | S | S | S | — | S |
| `agency_staff` | — | — | S | S, I, U (own)| S (own) | — | — | — | S | — |
| `cohorts` | S | S | S | S, I, U (own)| S (own) | S (own) | — | — | — | S |
| **Learner Data & PII** | | | | | | | | | | |
| `student_profiles` | S (anon) | S (anon) | S | S (own) | S (own) | S (own) | S (consented) | S (consented) | — | S (agg) |
| `student_pii` | **DENIED** | **DENIED** | S (audited) | S (own cohort) | S (own cohort) | S (own) | **DENIED** | **DENIED** | **DENIED** | **DENIED** |
| `student_enrollments`| S | S | S | S, I, U (own)| S, I (own) | S (own) | — | — | — | S (agg) |
| `student_assessments`| S | S | S | S, I (own) | S, I (own) | S (own) | S (consented) | S (consented) | — | S (agg) |
| `job_readiness_scores`| S | S | S | S (own) | S (own) | S (own) | S (consented) | S (consented) | — | S (agg) |
| `interviews` | S (agg) | S | S | S, I (own) | S, I (own) | S (own) | S, I (own) | S, I (own) | — | S (agg) |
| `selections` | S (agg) | S | S | S, I (own) | S, I (own) | S (own) | S, I (own) | S, I (own) | — | S (agg) |
| **Employer & Entity Resolution** | | | | | | | | | | |
| `organizations` | S | S | S | S | S | S | S, U (own) | S (own) | S | S |
| `organization_identifiers` | S | S | S | — | — | — | S, I (own) | S (own) | S | — |
| `organization_claims`| S | S, U (req) | S | — | — | — | S, I (own) | S (own) | S | — |
| `organization_authorized_users` | — | — | S | — | — | — | S, I, D (own)| S (own) | S | — |
| **Employment & Verification** | | | | | | | | | | |
| `employment_records`| S (agg) | S | S | S (own) | S, I (report)| S (own) | S (own) | S (own) | — | S (agg) |
| `employment_events` | S (agg) | S | S | S (own) | S (own) | S (own) | S (own) | S (own) | — | S (agg) |
| `verification_requests`| S (agg) | S | S | S (own) | S (own) | S (own) | S (own) | S (own) | — | S (agg) |
| `verification_decisions`| S (agg) | S | S | S (own) | S (own) | S (own) | S (own) | S, I (verify)| — | S (agg) |
| `student_disputes` | S (agg) | S | S | S (own) | S (own) | S, I (own) | S (own) | S (own) | S | S (agg) |
| **Trust, Ledger & Integrity** | | | | | | | | | | |
| `audit_ledger` | S (agg) | S | S (verify)| S (own) | — | S (own) | S (own) | — | S | **DENIED** |
| `ledger_checkpoints` | S | S | S | — | — | — | — | — | S | — |
| `anomalies` | S | S, U | S | — | — | — | — | — | S, U | — |
| `authorization_requests`| S | S, I (req) | S | — | — | — | S, I (req) | — | S | — |
| `authorization_approvals`| S | S, I (req) | S | — | — | — | S, I (req) | — | S | — |
| **Market & Skill Intelligence** | | | | | | | | | | |
| `skills` | S | S, I, U | S | S | S | S | S | S | — | S |
| `skill_demands` | S | S | S | S | S | S | S, I (own) | S (own) | — | S |
| `course_skills` | S | S, U | S | S, I (own) | S (own) | S | S | S | — | S |
| `employer_feedback` | S (agg) | S | S | S (agg) | S (agg) | — | S, I (own) | S, I (own) | — | S (agg) |
| **Platform Telemetry & Governance** | | | | | | | | | | |
| `system_metrics` | S | S | S | — | — | — | — | — | S | S |
| `metric_snapshots` | S | S | S | — | — | — | — | — | S | S |
| `simulation_runs` | S, I (own)| S, I (own)| S | — | — | — | — | — | — | — |
| `security_events` | — | — | S | — | — | — | — | — | S, I | — |
| `notifications` | S (own) | S (own) | S (own) | S (own) | S (own) | S (own) | S (own) | S (own) | S (own) | — |

---

## 4. Key Security Invariants & Trigger Enforcement

### 4.1 Invariant 1: Append-Only Ledger Immutability
```sql
CREATE OR REPLACE FUNCTION trg_enforce_append_only()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'CRITICAL SECURITY VIOLATION: Ledger and event records are immutable. UPDATE and DELETE are prohibited.'
        USING ERRCODE = '42501';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_ledger_immutability
BEFORE UPDATE OR DELETE ON audit_ledger
FOR EACH ROW EXECUTE FUNCTION trg_enforce_append_only();

CREATE TRIGGER enforce_events_immutability
BEFORE UPDATE OR DELETE ON employment_events
FOR EACH ROW EXECUTE FUNCTION trg_enforce_append_only();
```

### 4.2 Invariant 2: No Agency Self-Verification
An agency may submit a reported placement through `api/agency/employment/report`, transitioning state to `REPORTED_PENDING_VERIFICATION`. Only an authorized verifier of the target canonical organization can execute `VERIFY_EMPLOYMENT` to transition to `VERIFIED_EMPLOYED`.
```sql
CREATE OR REPLACE FUNCTION trg_check_verification_authority()
RETURNS TRIGGER AS $$
DECLARE
    v_user_role TEXT;
BEGIN
    SELECT role INTO v_user_role FROM user_roles WHERE user_id = auth.uid();
    IF v_user_role NOT IN ('employer_verifier', 'employer_admin') THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Agencies and students cannot verify employment claims.'
            USING ERRCODE = '42501';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4.3 Invariant 3: Multi-Party Authorization for Sensitive Operations
Operations requiring two-party agreement:
1. Activating a new `scoring_version` or weight formula.
2. Approving an organization legal claim override (e.g. overriding CIN dispute).
3. Granting or escalating privileged roles (`gov_program_admin`, `security_officer`).
4. Closing a high-severity anomaly investigation.

Enforced via `authorization_requests` where `requester_id != approver_id` is asserted both in SQL CHECK constraints and server-side policy guards.
