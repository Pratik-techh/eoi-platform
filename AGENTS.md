# AGENTS.md — Workspace Rules (Employment Outcome Intelligence Platform)
# Sourced from: MASTER_PROMPT.md Sections 0–4 and 17
# Every agent and sub-task inherits these rules. Do NOT modify without multi-party approval.

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

# 17. ENGINEERING STANDARDS

- Monorepo-simple structure: `/app`, `/components`, `/features/<domain>`, `/lib`, `/server/services`, `/supabase/migrations`, `/supabase/seed`, `/supabase/tests`, `/e2e`, `/docs`.
- TypeScript strict, no `any`, ESLint + Prettier, absolute imports, generated DB types from Supabase.
- Server actions/route handlers = thin; business rules live in DB functions and service modules; UI never bypasses them.
- Idempotency keys on all write endpoints; optimistic UI only for non-critical actions.
- Structured logging with correlation IDs propagated to the ledger.
- Performance: analytics via SQL views/materialised views/indices; dashboards load < 1.5s on seeded data; pagination everywhere; no N+1.
- Accessibility & i18n as in Section 14. README includes architecture diagram (Mermaid), setup, demo accounts, and how to run tests.
- Commit in small, meaningful steps with conventional commit messages.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
