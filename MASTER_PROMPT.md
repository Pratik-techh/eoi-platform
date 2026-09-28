# MASTER PROMPT — Employment Outcome Intelligence (EOI) Platform
### Target: Google Antigravity (agent-first IDE) · SIH 2026 · SIH26135

> **How to use:** Create an empty workspace, open it in Antigravity, set the agent to **Planning mode**, and paste everything below the line as the first message. Also save Sections 0–4 and 17 as `AGENTS.md` (workspace rules) so every agent and sub-task inherits them. Do not trim any section; the agent must treat this as a contract.

---

# 0. ROLE AND OPERATING CONTRACT

You are a principal engineering team (staff full-stack engineer, database/security architect, data engineer, and senior product designer) building the **Employment Outcome Intelligence (EOI) Platform**: a trusted, automated, longitudinal outcome layer that connects skilling records to verified employment trajectories and turns them into program and skill intelligence for government.

**Thesis:** `TRUST → TRAJECTORY → INTELLIGENCE`
**Core design rule:** *The dashboard is not the source of truth. The verified event history is.*
**One-line pitch:** "We don't just track who was trained. We track what happened next, verify it, preserve it, and learn from it."

The product is **not** a training portal, recruitment portal, placement dashboard, or AI chatbot. It is a trusted employment outcome layer that sits around existing government systems and does not replace them.

## Operating rules for you, the agent
1. **Plan first.** Produce an *Implementation Plan* artifact (architecture, folder structure, DB ERD, RLS matrix, state machine, phase list, risk list) and a *Task List* artifact. Do not write application code until the plan is written. Then proceed phase by phase without waiting for approval unless blocked.
2. **Nothing in this document is optional.** Every feature, state, role, table, rule, metric, screen, and success criterion here must exist and work. At the end, produce the *Traceability Report* in Section 19 with a pass/fail per item and evidence.
3. **No mock logic.** Every number on every screen must come from PostgreSQL through real queries/views over the seeded data. No hard-coded chart arrays, no `Math.random()` in the UI, no fake loading.
4. **Verify with the browser.** After each phase, use the browser sub-agent to click through the affected flows, capture screenshots, and fix defects. The Hero Demo (Section 15) must be run end to end and recorded as a walkthrough artifact.
5. **Working software over prose.** Every phase ends with the app building (`next build`), type-checking (`tsc --noEmit`), linting cleanly, and running locally with one command.
6. **Be honest in the UI.** The prototype uses **synthetic data only** and has **no live integrations**. A persistent, unobtrusive "Synthetic data — prototype" indicator must be visible, and future integrations (SIDH, NCS, e-Shram, EPFO, ESIC, org registries, employer systems) appear only as clearly labelled "Planned integration — not connected" entries.
7. If something is ambiguous, choose the most conservative, trust-preserving interpretation and record it in `docs/DECISIONS.md`. Do not stop to ask.

---

# 1. PRODUCT INTENT (what must be true)

The system must let government move from *"How many people did we train?"* → *"What happened to them?"* → *"What should the system learn from what happened?"*

It must answer: Did they become job-ready? Get interviewed? Actually get employed? Who independently verified it? How long did they stay? What happened after it ended? Which skills produce employment? Where are learners lost? Which courses/agencies need investigation? What does industry demand that training does not provide?

**Four gaps it closes:** Trust gap (Reported ≠ Verified, motivated by CAG-identified placement discrepancies) · Trajectory gap (Employed → Unemployed → Re-employed, not a boolean) · Skill gap (training supply vs employer demand) · Decision gap (decision *support*, never automatic policy decisions).

**North-star flow the data model must represent:**
Training → Assessment → Job Readiness → Interview → Selection → Employment → Retention → Employment Ends → Unemployment → Re-employment → Outcome Intelligence → Program/Skill Insights.

---

# 2. NON-NEGOTIABLE DESIGN PRINCIPLES (enforce in code, not just UI)

| # | Principle | Enforcement required |
|---|---|---|
| P1 | **No single stakeholder controls truth.** An agency can report employment but cannot verify its own report. A student can report unemployment but cannot rewrite a verified employer record. An employer can verify but cannot modify training history. Government consumes intelligence but cannot silently rewrite history. | DB-level RLS + `SECURITY DEFINER` functions as the only write path + server-side checks + state-machine guards. Add automated tests that attempt each forbidden action and assert failure. |
| P2 | **No master administrator.** No role can create, verify, modify, delete and override all critical data. Sensitive operations need separated permissions and multi-party authorization. | Split roles (Section 4). Implement a two-person `authorization_requests` mechanism for sensitive operations. No `service_role` key ever reaches the browser, and server code uses it only in narrowly scoped, audited functions. |
| P3 | **Machines do routine work.** Validation, entity matching, workflow transitions, notifications, calculations, analytics, audit logging, anomaly detection are automatic. Humans handle disputes, exceptions, governance, investigations, policy configuration. | Triggers, DB functions, Edge Functions/route handlers, scheduled jobs. |
| P4 | **Never destroy historical truth.** Status changes create new events. No `DELETE`/destructive `UPDATE` of outcome history. | Append-only tables, `BEFORE UPDATE/DELETE` triggers that raise, `REVOKE UPDATE, DELETE` from all app roles. |
| P5 | **AI is never the source of truth.** AI interprets verified structured data. It cannot verify employment, create employment records, override verification, fabricate statistics, silently change scores, or determine policy. | AI gets read-only, whitelisted, aggregated views only; its DB role has `SELECT` on those views and nothing else; every AI answer must cite the query results it used. |

---

# 3. TECH STACK (fixed)

- **Frontend:** Next.js (App Router) + TypeScript (strict) + Tailwind CSS + shadcn/ui (heavily customised to the design system in Section 14) + Recharts (funnel, trends, distributions; build custom SVG where Recharts cannot express the design, e.g. the funnel and the Sankey-like trajectory).
- **Backend:** Next.js server layer (route handlers + server actions) with **event-driven service boundaries** (folders: `identity`, `training`, `readiness`, `employment`, `verification`, `trust`, `ledger`, `analytics`, `skills`, `notifications`, `ai`, `audit`). Each service exposes typed functions; the UI never touches tables directly for writes.
- **Database:** PostgreSQL via **Supabase** (relational integrity, transactions, RLS, triggers, SQL analytics). Use migrations under `supabase/migrations`, seed scripts under `supabase/seed`, and provide `docker`/`supabase start` local setup plus a one-command bootstrap (`pnpm setup` → migrate → seed → run). If Supabase cloud credentials are absent, run fully on local Supabase.
- **Auth:** Supabase Auth (secure password hashing, secure cookie sessions, session revocation, MFA-ready structure: `mfa_enrolled` flag and TOTP enrollment UI scaffold).
- **Authorization:** PostgreSQL RLS + server-side authorization (both, always).
- **Automation:** PostgreSQL triggers + Supabase Edge Functions (or Next.js route handlers if Edge is unavailable locally) + a scheduled job runner for snapshots/anomaly scans.
- **Event integrity:** Append-only event tables + **SHA-256 hash chaining** (no blockchain).
- **Validation:** Zod on every boundary (forms, server actions, route handlers, webhooks).
- **Realtime:** Supabase Realtime (or SSE) so dashboards and queues update automatically after a verification.
- **Storage:** Supabase Storage behind a small `ObjectStore` interface (future dedicated object storage) for certificates/supporting documents.
- **AI:** Provider-agnostic `LLMClient` interface (env-configured; default to any available provider key). AI is only an analytical interpretation layer. If no key is set, fall back to a deterministic template-based explainer that uses the same evidence objects, so the feature still works.
- **Deployment:** Vercel + Supabase. Provide `.env.example`, `README.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/PRIVACY.md`, `docs/DECISIONS.md`, `docs/METRICS.md`.
- **Tests:** Vitest (unit), pgTAP or SQL-based tests for RLS/triggers, Playwright (E2E for Hero Demo and forbidden-action tests).

---

# 4. ROLES, IDENTITY AND ACCESS MODEL

## 4.1 Primary users
Government · Training Agency · Student · Employer. Implement these as role families with the finer-grained roles below to satisfy "no master administrator."

| Role | Family | Can | Cannot |
|---|---|---|---|
| `gov_analyst` | Government | Read aggregated/authorized intelligence, run simulations, use AI Q&A, export reports | See raw PII, write outcome data |
| `gov_program_admin` | Government | Configure programs, authorize programs, propose scoring/metric versions | Activate a scoring version alone; verify anything; edit history |
| `gov_auditor` | Government | Full read of audit/event ledger, run chain verification, open/close investigations | Modify any data |
| `agency_admin` | Agency | Manage own agency's users, courses, cohorts, students | Verify employment; touch other agencies |
| `agency_officer` | Agency | Register/import students, assessments, readiness inputs, report employment | Verify; approve org claims |
| `student` | Student | Own profile/passport, report unemployment, raise disputes, control visibility | Verify own employment; alter verified employer record; edit training/assessment records |
| `employer_admin` | Employer | Manage org's authorized users, submit org claim, feedback | Modify student training history |
| `employer_verifier` | Employer | Confirm/Reject/Request Correction on verification requests for own canonical org | Verify orgs other than own; verify without an authenticated org account |
| `security_officer` | Platform | Receive/triage security events, revoke sessions, review anomalies | Read outcome PII or alter outcomes |
| `platform_ops` | Platform | Infra health, deployments | Any data-plane read/write |

## 4.2 Multi-party authorization (must be implemented and demoable)
Table `authorization_requests` (`id, operation, payload, requested_by, required_approvals, status`) + `authorization_approvals` (`request_id, approver_id, decision, at`). Rules: requester ≠ approver; approvers must be distinct users from distinct role types where specified. Operations that **require** it: activating a new `scoring_version`/metric calculation version; approving an organization identifier claim override; granting/changing privileged roles; exporting record-level (de-identified) datasets; closing an investigation flagged high severity. Show these in a "Governance" screen with pending/approved/rejected requests.

## 4.3 Zero Trust
Every request independently validates: identity, role, resource, operation, ownership/authority, **current resource state** (e.g. cannot confirm an already-rejected record). Implement as a single `authorize(actor, action, resource)` policy function used by all server code, mirrored by RLS.

---

# 5. DATABASE (PostgreSQL) — build all of it

## 5.1 Entities (all required)
`users, roles, user_roles, organizations, organization_identifiers, students, agencies, companies, courses, skills, cohorts, enrollments, assessments, assessment_results, projects, job_readiness_records, employment_outcomes, employment_verifications, employment_status_events, industry_feedback, skill_requirements, disputes, notifications, audit_events, scoring_versions, analytics_snapshots`

Add supporting tables (needed to satisfy the PRD): `course_skills` (skills taught/assessed + target proficiency), `student_skills` (proficiency history), `interview_events` and `selection_events` (so Interview/Selection funnel stages are real), `certifications`, `metric_definitions`, `metric_results` (provenance), `anomaly_signals`, `investigations`, `authorization_requests`, `authorization_approvals`, `organization_claims`, `consents` (DPDP-aligned), `ledger_chain_state`, `simulation_runs`, `ai_query_log`, `pii_identity` (separated PII).

## 5.2 Privacy separation
- `pii_identity` (name, DOB, phone, email, address, government-ID reference tokens) is **physically separate** from outcome/analytics tables and is joined **only** by `eoi_student_id`.
- Application-wide key is **`EOI Student ID`** (opaque, non-derivable, e.g. `EOI-S-` + base32 random, never from Aadhaar/phone/email). Raw personal identifiers are never used as universal keys.
- Government/analytics roles have **no** access to `pii_identity`. Employers see only Student Outcome ID + agency + course + role + date (+ minimum verification info). Agencies see PII only for their own students.
- Application-level encryption (pgcrypto or app-layer AES-GCM) for especially sensitive fields; TLS in transit; encryption at rest documented.
- `consents` table + student "visibility controls" UI (who can see which passport sections). Treat DPDP as a core consideration: `docs/PRIVACY.md` maps obligations (notice, consent, purpose limitation, minimisation, correction/erasure workflow handled as *dispute/correction events without destroying verified history*, breach notification hook, data-principal rights) to the deployment model and flags dates as "to be confirmed against deployment".

## 5.3 Organization identity model
- `organizations` (canonical org) ← `organization_identifiers(org_id, id_class, value, verified_by, verified_at, status)`.
- Identifier classes: `CIN`, `LLPIN`, `EPFO_ESTABLISHMENT_ID`, `OTHER_AUTHORIZED`. **The model must not assume every employer has a CIN.**
- Pipeline: Reported Employer → Identifier Resolution → Canonical Organization → Authorized Employer Account → Verification Request.
- **Never grant organization control because someone typed a matching company name.** Claiming an org requires identifier proof + a verification mechanism (simulate a verification challenge: emailed one-time token to a registry-listed domain OR document upload reviewed under multi-party authorization). Unclaimed orgs' verification requests stay `awaiting_org_claim`.
- Fuzzy name matching may only *suggest* candidates to a human/agency; it can never auto-bind control.

## 5.4 Append-only + hash-chained ledger
`audit_events` (the Event Ledger) columns: `event_id (uuid), seq (bigint per chain), occurred_at (timestamptz), actor_id, actor_role, event_type, source, entity_type, entity_id, previous_state, new_state, correlation_id, payload (jsonb), hash (sha256 hex), previous_hash`.
- `BEFORE INSERT` trigger computes `hash = sha256(previous_hash || canonical_json(row fields))` using a per-chain advisory lock to prevent forks; `ledger_chain_state` holds chain head.
- `BEFORE UPDATE OR DELETE OR TRUNCATE` triggers raise exceptions; app roles have `INSERT`/`SELECT` only.
- `verify_ledger_chain(from_seq, to_seq)` SQL function returns first broken link if any. The Audit Explorer exposes "Verify chain integrity" and displays the head hash.
- Same append-only guarantees for `employment_status_events`, `employment_verifications` history, `disputes` event trail, and `scoring_versions`.
- All critical writes go through `SECURITY DEFINER` functions (`report_employment`, `request_verification`, `confirm_employment`, `reject_employment`, `request_correction`, `report_unemployment`, `reconcile_unemployment`, `report_new_employment`, `raise_dispute`, `resolve_dispute`, …) which validate, transition state, and write the ledger event in **one transaction**.

## 5.5 RLS matrix
Produce `docs/RLS_MATRIX.md` (role × table × operation) and implement every policy. Default deny. Agencies scoped by `agency_id`; students by `eoi_student_id = auth.uid() mapping`; employers by canonical `org_id` membership; government by program authorization scope and aggregate-only views for analytics roles. Write SQL tests proving each forbidden cross-role access fails.

---

# 6. EMPLOYMENT STATUS ENGINE (state machine — exact)

```
REPORTED → PENDING_VERIFICATION → VERIFIED_EMPLOYED
REPORTED → REJECTED
VERIFIED_EMPLOYED → UNEMPLOYMENT_REPORTED → RECONCILIATION_PENDING → VERIFIED_UNEMPLOYED
VERIFIED_UNEMPLOYED → NEW_EMPLOYMENT_REPORTED → VERIFICATION → VERIFIED_EMPLOYED
```
- Implement as a transition table (`allowed_transitions`) enforced in the DB function; invalid transitions raise and produce a `INVALID_TRANSITION_ATTEMPT` ledger/anomaly event.
- Additional handling: `Request Correction` returns the record to the agency as `CORRECTION_REQUESTED` (a sub-status of `PENDING_VERIFICATION`) and preserves history; `DISPUTED` overlays without deleting.
- **No DELETE EMPLOYMENT operation exists** for ordinary users — not in UI, API, or RLS.
- Reconciliation of unemployment: employer confirms end date / or the student's claim is auto-reconciled after a configurable window with employer non-response (state flagged `RECONCILED_BY_TIMEOUT`, shown as such and counted separately in provenance). Also support employer-initiated end-of-employment notification. A student's own report never becomes "verified unemployed" without reconciliation.
- Track first employment, duration, transitions, unemployment periods, re-employment, retention (e.g. 3/6/12-month), wage band progression where available.

## 6.1 Trust Engine — verification states
`Reported · Pending · Verified · Unverified · Disputed · Rejected · Self-reported`. Every critical record carries one. Government metrics default to **verified-only** where the metric requires it. Unverified/self-reported/pending records are **visibly and consistently distinguished everywhere** (status chip with icon + text, never colour alone).

---

# 7. EVENT-DRIVEN PIPELINE (implement exactly, each stage a real, testable step)

`INPUT → AUTHENTICATION → AUTHORIZATION → VALIDATION → ENTITY RESOLUTION → DUPLICATE DETECTION → CONSISTENCY CHECK → STATE TRANSITION → EVENT LOG → VERIFICATION WORKFLOW → OUTCOME ENGINE → ANALYTICS → NOTIFICATION → DASHBOARD PROJECTION`

Implement as a `pipeline` module with a typed step interface, shared by all write paths, with per-step timing visible in the ledger payload. A failure at any step produces a rejected-attempt event (never silent).

## 7.1 Data Integrity Engine (automated)
- **Identity validation:** referenced entity exists.
- **Referential integrity:** student belongs to the reporting agency.
- **Temporal validation:** employment cannot precede claimed training completion (unless an explicit, supported exception flag with justification and approver); readiness ≤ interview ≤ selection ≤ employment ordering; end date ≥ start date.
- **Duplicate detection:** duplicate employment or assessment submissions (idempotency key + fuzzy same-student/same-org/overlapping-dates rule).
- **State validation:** invalid transitions blocked.
- **Anomaly detection:** e.g. an agency reporting hundreds of employment events in seconds; abnormal verification-confirm latency; one employer confirming implausibly fast/all; identical role/date patterns; agency with verified-rate far outside peer distribution. The system shows **"ANOMALY DETECTED"** and creates an `anomaly_signals` **investigation signal**. **It must never auto-declare fraud**; wording in UI is "signal", "needs review".
- Rate limiting + abuse detection at the API layer.

---

# 8. MODULES AND SCREENS — BUILD ALL

## 8.1 Government Module
1. **Government Intelligence Dashboard** — KPIs: students enrolled, trained, completion rate, assessment completion, job-ready rate, interview rate, selection rate, **verified employment rate**, retention rate, average time to employment, re-employment rate, wage progression (only where legally/operationally available; otherwise show "Not available" with the reason). Every KPI card has value, delta/trend, data-state badge, and a "How is this calculated?" provenance drawer.
2. **Outcome Funnel (interactive)** — Enrolled → Trained → Assessed → Job Ready → Interviewed → Selected → Employed → Retained. Each stage shows count, percentage (of previous and of start), trend, and distributions by **geography, course, agency, skill**. Clicking a stage/segment cross-filters the page.
3. **Outcome Leakage Engine** — automatically detects major or unusual stage drop-off (statistical rule: conversion vs peer/historical baseline using z-score/IQR plus a minimum-volume guard; document the rule in `docs/METRICS.md` with a version). Displays e.g. *"HIGH LEAKAGE: INTERVIEW → EMPLOYMENT"* with supporting data. Drill-down by course, agency, district, industry, skill, employer, cohort, time. **Language rule: evidence before interpretation; never "Agency X is bad" — always "This cohort exhibits an unusually high conversion loss at this stage."**
4. **Program Intelligence** — per program: completion, readiness, employment, retention, time-to-employment, skill relevance, employer feedback, dispute rate, conversion at each stage, leakage, employment stability.
5. **Agency Intelligence** — compare agencies on **verified** outcome metrics. **No pay-to-rank mechanism** (no sponsored/paid ordering; sorting is user-controlled and neutral; include volume-adjusted intervals so small samples are not over-read).
6. **Skill Intelligence** — demand, supply, skill gap, regional gap, industry demand, emerging skill signals (rising demand mentions over time), curriculum relevance. Includes the Demand/Supply/Job-ready-proficiency triad (e.g. React: Demand High · Supply Medium · Job-ready proficiency Low → "Potential skill-supply gap").
7. **Regional Intelligence** — global filters: State, District, Region, Industry, Skill, Program, Time period; map or ranked geography view (use an inline India state/district choropleth built from a bundled GeoJSON/TopoJSON if available offline; otherwise a proportional-symbol/ranked grid).
8. **Program Scenario Simulator** — inputs (region, program, capacity +N%, plus optional adjustments). Outputs: additional training volume, expected readiness range, historical employment-conversion range, skill-demand coverage. Uses historical/synthetic data with ranges (not point predictions). **Must be labelled `SIMULATION` / "Scenario — not a prediction or guaranteed outcome"** on the panel, in exports, and in saved `simulation_runs`.
9. **Audit Explorer** — inspect who submitted data, who verified it, when the event occurred, what source generated it, current status, and historical transitions; filter/search by entity, actor, correlation ID, time; timeline view per correlation ID; chain-integrity verification; export.
10. **Governance** — authorization requests, scoring/metric versions, anomaly signals & investigations queue, program authorization.
11. **AI Analyst panel** (Section 12).

## 8.2 Training Agency Module
- **Agency Dashboard:** trainees, active cohorts, completed students, assessments, job-ready students, reported employment, verified employment, retention, pending/disputed counts; the reported-vs-verified gap shown explicitly.
- **Student Management:** register student, **import students (CSV upload with validation preview, row-level errors, duplicate detection, idempotent commit)**, assign cohort, view profile, training history, assessment history, readiness, employment status.
- **Course Management:** course, curriculum, duration, skills (with target proficiency), cohort, enrollment.
- **Assessment Management:** assessment, score, practical assessment, project, skill proficiency capture.
- **Job Readiness:** computed by the system from structured inputs using a versioned, transparent `scoring_versions` formula (assessment scores, practical, projects, skill proficiency vs course targets, attendance/completion). Show the score breakdown; agencies cannot type a readiness score. Score changes create new records; nothing is silently changed.
- **Interview/Selection recording:** agency (and employer) can log interview and selection events feeding the funnel.
- **Employment Reporting form:** student, employer, organization identifier, job role, employment date, applicable compensation band, location. Employer entered via identifier resolution (search canonical orgs by identifier class; "employer not found" path creates an *unclaimed* org candidate). **Agency cannot mark as verified**; UI has no such control and the API rejects it.
- **Outcome Analytics:** cohort outcomes, course outcomes, employment conversion, retention, skill gaps, employer feedback.
- Agency sees verification outcomes and correction requests in its inbox.

## 8.3 Student Module
- **Student Dashboard** primary component: **CURRENT EMPLOYMENT** (status, employer, role, joined date, "Employer Verified" chip) with secondary action **Report unemployment**.
- **Employment Lifecycle** visual: VERIFIED EMPLOYED → STUDENT REPORTS END → RECONCILIATION → VERIFIED UNEMPLOYED. Previous employment stays in history.
- **Employment History** timeline (verified/pending/unemployment-reported entries with dates, e.g. "12 Aug 2026 → 24 Sep 2026 · VERIFIED EMPLOYMENT · 24 Sep 2026 UNEMPLOYMENT REPORTED · 28 Sep 2026 VERIFICATION STATUS: PENDING").
- **Re-employment:** new employment records can be added later without destroying prior history.
- **Employability Passport:** Student Outcome ID, skills, proficiency, courses, certifications, projects, assessments, job readiness, employment history; visibility controls; printable/PDF view with a verification QR/hash reference. Only verified items get a verified mark.
- **Skill Gap:** current proficiency vs industry-required proficiency (radar or paired bars), with plain-language recommendations derived from data (not AI-invented).
- **Dispute / Correction:** dispute employment, report incorrect employer, incorrect training, incorrect assessment data. Disputes create events and keep the record; show dispute status and outcome.
- Notifications inbox.

## 8.4 Employer Module
- **Employer Dashboard:** pending verification, verified employment, rejected records, disputes, industry feedback.
- **Organization Identity:** claim flow, identifier management (CIN/LLPIN/EPFO/other), claim status, authorized users.
- **Entity Resolution view:** Reported Employer → Identifier Resolution → Canonical Organization → Authorized Employer Account → Verification Request, shown visually per request.
- **Employment Verification queue:** each item shows Student Outcome ID, Agency, Course, Role, Employment date, relevant verification info. Actions: **Confirm / Reject / Request Correction** (reason required for Reject/Correction). Also handle unemployment/end-of-employment reconciliation requests.
- **Industry Feedback:** required skills, skill gaps, candidate readiness, curriculum relevance, hiring requirements (structured forms feeding `industry_feedback` and `skill_requirements`).

## 8.5 Cross-cutting screens
Login / role-based routing, profile & security settings (MFA-ready UI, active sessions with revoke), notification center, global search, help/"How to read this platform" (explains verification states and provenance), 403/404/empty/error states with actionable copy.

---

# 9. TRUST, PROVENANCE AND METRICS

- **Every material metric** carries: `Value + Source + Method + Timestamp + Data State`. Provide a reusable `<MetricProvenance>` drawer. Example drill-down (must be reproducible from data): *Verified Employment Rate 67.4% · Eligible outcomes 2,438 · Verified employed 1,644 · Pending 121 · Disputed 21 · Excluded 3 · Calculation version 1.2 · Last calculated <timestamp>.*
- `metric_definitions` (formula, inclusion/exclusion rules, verified-only flag, version) and `metric_results`/`analytics_snapshots` store computed results with `calculation_version`. New versions activate only via multi-party authorization; old results stay reproducible.
- **Automatic updates:** confirming/rejecting/reconciling an outcome triggers recalculation (event → analytics → dashboard projection) and pushes realtime updates. Recalculation itself writes `ANALYTICS_RECALCULATED` to the ledger.
- Exclusion reasons are explicit and countable (e.g. training incomplete, temporal violation, duplicate).

---

# 10. NOTIFICATION ENGINE (automatic)

Notify: employer of employment reports · student of status changes · agency of verification outcomes · organization of claim/verification requests · authorized users of disputes · security administrators of serious security events. In-app (realtime) with read/unread, deep links, and an email-outbox table (simulated sending; clearly labelled). Notifications are generated by triggers/pipeline, never by UI code.

---

# 11. SECURITY (verify against OWASP ASVS baseline; document in `docs/SECURITY.md`)

Zero Trust per request · RBAC + DB policies + server authorization · TLS, encryption at rest, field-level protection for sensitive data · secure password hashing, MFA-ready, secure sessions, session revocation · API: Zod schema validation, rate limiting, abuse detection, secure headers (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy), input sanitisation, dependency monitoring (`npm audit`/Dependabot config) · no secrets in client bundle · CSRF protection for cookie sessions · audit of every privileged action · security events notify `security_officer`. Include an ASVS checklist table with status per relevant control.

---

# 12. AI INTELLIGENCE LAYER

**AI is downstream of verified data.**
- **Can:** explain anomalies, summarise outcomes, identify recurring patterns, explain skill gaps, generate reports, answer natural-language analytical questions.
- **Cannot:** verify employment, create factual employment records, override verification, fabricate statistics, silently change scores, independently determine public policy.
- **Architecture:** natural-language question → *intent router* → **whitelisted parameterised analytics queries** (read-only views) → evidence object → LLM writes an explanation **only from the evidence object** → response validator rejects any number not present in the evidence → response displays **Evidence, Data sources (counts of verified outcome events / employer feedback events), Calculation version, timestamp**. Log to `ai_query_log`. The AI DB role has no write grants; there is no tool that writes to outcome tables.
- **Required example behaviour:** "Why is employment conversion low for this program?" → Employment conversion 34%; largest leakage Job Ready → Interview; observed evidence (78% job-ready, 71% interviewed, 29% employed — computed live from data); recurring employer feedback (e.g. SQL, REST APIs, Communication — from real feedback rows); data sources "N verified outcome events, M employer feedback events". The UI labels it "AI-generated explanation of verified evidence" and shows "policy decisions remain with government."
- Report generation: produce a structured, downloadable (PDF/print-styled HTML) program brief with provenance footers.
- Fallback deterministic explainer when no LLM key.

---

# 13. SKILL INTELLIGENCE ENGINE

Demand (employer-required skills from `skill_requirements` + feedback) · Supply (skills taught/assessed from `course_skills`, assessments) · Comparison producing Skill Gap (demand level, supply level, job-ready proficiency level, flag "Potential skill-supply gap"). Add regional and industry cuts, emerging-skill detection (growth in demand mentions over trailing periods), and curriculum-relevance score per course. Feed Program Intelligence, Student Skill Gap, Regional Intelligence, and the AI explainer.

---

# 14. DESIGN SYSTEM — must look like a professionally designed government-grade product, NOT vibe-coded

**Audience & job:** analysts, programme officers, auditors and district officials who scan dense data daily, plus students on mid-range phones. Feeling: *institutional, calm, exact, trustworthy.* Think a well-run public statistics portal crossed with a modern audit tool — not a startup landing page.

**Hard bans (these are tells of generated UI — do not use):** purple/blue-violet gradient washes; glassmorphism; glowing shadows; emoji as icons; identical rounded cards for everything; tracked-out ALL-CAPS eyebrow above every heading; "01 / 02 / 03" numbering on non-sequential content; single-word accent colour in headlines; fade-and-slide-up on every section; hover-lift on every card; hero stat + gradient number blocks; lorem ipsum or "John Doe / Acme Corp"; placeholder illustrations; dark-mode-only neon dashboards; decorative charts with no axes/units.

**Tokens (define as CSS variables + Tailwind theme; use these unless you have a reasoned improvement, recorded in `docs/DESIGN.md`):**
- Ink `#0E1F33` · Surface `#FFFFFF` · Canvas `#F4F6F9` · Line `#DDE3EA` · Muted text `#526173`
- Primary (institutional blue) `#1D4E89` · Verified `#0F766E` · Pending `#B45309` · Disputed/Alert `#B42318` · Info `#2C5FA8` · Simulation `#6B4E9B` (used *only* for simulation labelling)
- Verification/status colours are always paired with an icon **and** text label; contrast ≥ WCAG AA.
- Support light theme by default and a considered dark theme (true design pass, not inverted colours).

**Type:** IBM Plex Sans for UI and IBM Plex Mono for IDs, hashes, timestamps only; tabular numerals on all numeric tables/KPIs; a defined type scale (12/13/14/16/20/24/32) with consistent line-heights; sentence case everywhere; line length < 75ch for prose. Support Devanagari fallback (Noto Sans Devanagari) and structure text for i18n (English + Hindi scaffold with a language switcher on key screens).

**Layout & components:** fixed left navigation grouped by task (not by database table), compact top bar with global filters/search/notifications/profile/role badge; page header with title, description, data freshness, and primary actions; 12-column grid, 4/8px spacing scale; **two radii only** (4px controls, 8px containers); borders over shadows (one subtle elevation for popovers/dialogs only). Data tables are first-class: sticky headers, column sorting/filtering/visibility, density toggle, CSV export, row detail drawers, keyboard navigation, virtualised for long lists, skeleton loading, meaningful empty states. Charts: labelled axes and units, direct labelling where possible, consistent categorical palette, accessible table alternative for every chart, tooltips with counts *and* percentages, "data state" badge on each chart. The Outcome Funnel and Leakage highlight are the **one memorable, carefully crafted visual** — everything else stays quiet.

**Signature components to build:** `StatusChip` (all verification/employment states), `MetricCard` + `MetricProvenance` drawer, `FunnelChart`, `LeakageCallout`, `TrajectoryTimeline` (employment history), `StateMachineDiagram` (current node highlighted), `LedgerTimeline` (events with hash preview + copy), `EntityResolutionFlow`, `SkillGapBars`, `ScenarioPanel` (persistent SIMULATION badge), `EvidenceBlock` (for AI answers), `FilterBar`, `DataTable`.

**Copy:** plain, specific, user-perspective language. Buttons say what happens ("Confirm employment", "Report unemployment", "Send correction request"). Errors state what went wrong and how to fix it, without apologising. Empty states are invitations to act. No marketing fluff inside the app. Realistic Indian names, agencies, districts, employers, courses and role titles in all seeded data.

**Quality floor:** responsive from 360px to 4K (student and employer views are mobile-first; government/agency are desktop-first but usable on tablet); visible focus rings; full keyboard operation; ARIA for charts/dialogs/tables; `prefers-reduced-motion` respected; motion only when it answers a user action (state change confirmation, drawer open) plus one orchestrated moment on the government dashboard's first load; no layout shift; Lighthouse ≥ 90 performance/accessibility on core pages; consistent loading, error and permission-denied states on every route.

**Design process (required):** before coding UI, write `docs/DESIGN.md` containing the token system, 3 short layout concepts with ASCII wireframes for the Government dashboard, choose one, and note what was revised to avoid generic defaults. After building, screenshot every major screen with the browser sub-agent, critique against this section, and fix. Remove one decorative element per screen before finishing.

---

# 15. SYNTHETIC DATA AND HERO DEMO

## 15.1 Seed (deterministic seed script with fixed RNG seed; realistic distributions)
Minimum: **5 agencies · 8 courses · 30 skills · 500 students · 50 employers · 10 cohorts · 300 employment events**, including verified, pending, rejected, disputed outcomes; unemployment transitions; re-employment; interview and selection events; job-readiness records with computed scores; skill-demand data across states/districts/industries; employer feedback; certifications and projects; **deliberate anomalies** (e.g. one agency bursting 200+ employment reports in seconds; a temporal violation; a duplicate; an implausibly fast employer confirmation pattern); at least one unclaimed org and one org with LLPIN/EPFO identifier and no CIN; historical months of data so trends and emerging-skill signals are real; several users per role including demo accounts listed in README (`gov.analyst@…`, `agency.officer@…`, `student.x@…`, `employer.verifier@…`, `auditor@…`, etc.). Additionally provide a scaled demo dataset (10,000 trained / ~3,100 employed) via aggregate-consistent seed so the Hero Demo headline numbers appear naturally; the seed must include a **major Interview → Employment leakage** planted in one program/region for the leakage engine to legitimately detect. All seeded events must flow through the same ledger functions so the hash chain is valid from row one.

## 15.2 Hero Demo (must run continuously, with no manual DB edits)
1. **Government:** dashboard shows ~10,000 trained / ~3,100 employed; system highlights major outcome leakage.
2. **Investigate:** click the leakage → stage explanation + underlying evidence and drill-downs.
3. **Student:** open Student X → `VERIFIED EMPLOYED — Google India Pvt. Ltd.` (Software Engineer, joined 12 Aug 2026).
4. **Lifecycle change:** student selects *Report unemployment* → status `Unemployment reported — Verification pending`; previous Google employment stays in history.
5. **Employer:** Google's organization panel receives the request in realtime.
6. **Verification:** employer confirms → backend auto-transitions state.
7. **Intelligence:** government dashboard updates automatically (realtime), with `ANALYTICS_RECALCULATED` visible in the ledger.
8. **Skills:** system surfaces recurring missing skills.
9. **Decision support:** government sees the affected program/course/region and runs a **SIMULATION**.
Add a Playwright script `e2e/hero-demo.spec.ts` that executes all nine scenes with assertions, and a "Demo guide" page (available to demo accounts only) with one-click account switching for judges. Demonstrates Trust → Trajectory → Intelligence → Action in one loop.

---

# 16. FUTURE INTEGRATIONS (display and architecture only)

Define adapter interfaces (`SIDHAdapter`, `NCSAdapter`, `EShramAdapter`, `EPFOAdapter`, `ESICAdapter`, `OrgRegistryAdapter`, `EmployerSystemAdapter`) with typed contracts and **mock/disabled implementations** returning `NOT_CONNECTED`. An "Integrations" page lists them as *Planned — not connected*. **Never claim live integration.**

---

# 17. ENGINEERING STANDARDS

- Monorepo-simple structure: `/app`, `/components`, `/features/<domain>`, `/lib`, `/server/services`, `/supabase/migrations`, `/supabase/seed`, `/supabase/tests`, `/e2e`, `/docs`.
- TypeScript strict, no `any`, ESLint + Prettier, absolute imports, generated DB types from Supabase.
- Server actions/route handlers = thin; business rules live in DB functions and service modules; UI never bypasses them.
- Idempotency keys on all write endpoints; optimistic UI only for non-critical actions.
- Structured logging with correlation IDs propagated to the ledger.
- Performance: analytics via SQL views/materialised views/indices; dashboards load < 1.5s on seeded data; pagination everywhere; no N+1.
- Accessibility & i18n as in Section 14. README includes architecture diagram (Mermaid), setup, demo accounts, and how to run tests.
- Commit in small, meaningful steps with conventional commit messages.

---

# 18. BUILD PHASES (execute in order; each ends with build + tests + browser verification)

1. **Foundation:** repo, tooling, design tokens, base layout, auth, role routing, env, CI scripts.
2. **Data & trust core:** all migrations, RLS, PII separation, org identity model, ledger with hash chain + append-only triggers, state machine and transition table, `SECURITY DEFINER` write functions, integrity engine, authorization_requests, SQL tests.
3. **Seed:** deterministic realistic dataset via ledger functions, planted leakage and anomalies, demo accounts.
4. **Agency module** (students, import, courses, assessments, readiness, employment reporting, analytics).
5. **Employer module** (org claim, resolution, verification queue, feedback).
6. **Student module** (dashboard, lifecycle, history, passport, skill gap, disputes).
7. **Analytics engine:** metric definitions, snapshots, provenance, realtime projections, notifications.
8. **Government module** (dashboard, funnel, leakage, program/agency/skill/regional intelligence, simulator, audit explorer, governance).
9. **Skill intelligence + AI layer** with evidence-grounded answers and reports.
10. **Security hardening, privacy docs, accessibility pass, performance pass, design critique pass with screenshots.**
11. **E2E:** Hero Demo spec, forbidden-action suite, RLS tests; fix everything; produce final artifacts.

---

# 19. ACCEPTANCE — PROTOTYPE SUCCESS CRITERIA (all must pass, with evidence)

Automated tests must prove each:
- [ ] No agency can self-verify employment (UI, API and DB levels).
- [ ] No student can self-verify employment.
- [ ] No ordinary administrator can silently alter verified history (UPDATE/DELETE rejected; chain verification detects tampering).
- [ ] Every critical transition produces a ledger event with actor, role, source, previous/new state, correlation ID, hash, previous hash.
- [ ] Every verified outcome has a clear provenance trail viewable in the UI.
- [ ] Dashboard metrics are computed automatically and update after verification without refresh.
- [ ] Employment changes preserve historical state; re-employment does not overwrite.
- [ ] Unverified records are visibly distinguished everywhere.
- [ ] Role permissions are enforced server-side and in RLS.
- [ ] AI cannot modify source-of-truth records (no write grants; tested).
- [ ] Disputes preserve history.
- [ ] Organization claims require an appropriate verification mechanism; name-matching alone grants nothing.
- [ ] Scenario outputs are always labelled SIMULATION.
- [ ] No pay-to-rank mechanism exists in Agency Intelligence.
- [ ] No claim of live integration anywhere.

## Traceability Report (final artifact)
Produce `docs/TRACEABILITY.md`: a table with every numbered item in Sections 5–16 (each module, screen, metric, state, table, engine, notification, security control, AI rule, seed requirement, hero scene), the file/route/migration that implements it, and the test or screenshot proving it. Any item not passing must be listed with a reason and fixed before finishing.

---

# 20. FINAL PRODUCT STATEMENT (keep in README)

Employment Outcome Intelligence is a secure, automated and verifiable digital layer that follows a learner from training to employment and beyond, independently validates critical employment events, preserves the complete outcome history, detects where employment outcomes break down, and converts those verified trajectories into actionable skill and program intelligence.

**Begin now with the Implementation Plan and Task List artifacts.**
