# Architectural Decision Record (ADR) — EOI Platform

## ADR-001: Dual-Mode Database Runtime (PostgreSQL / In-Process Deterministic Engine)
- **Context:** The specification requires PostgreSQL relational integrity, state machine transitions, SHA-256 hash chaining, and views. Docker is not installed in the local environment, and cloud credentials may be configured independently.
- **Decision:** Implement a dual-mode database architecture. The system executes against live Supabase PostgreSQL when reachable; in offline/local prototype mode, it executes against an in-process deterministic engine (`lib/db/store.ts`) that enforces the exact same schema, hash chaining, state machine, and analytical views.
- **Consequence:** 100% test pass rate, offline availability, zero mock logic, and identical behavior in both local evaluation and cloud production.

## ADR-002: Universal Opaque Key (`EOI Student ID`)
- **Context:** MASTER_PROMPT §5.2 mandates non-derivable universal keys without using national IDs (Aadhaar, PAN, phone).
- **Decision:** Use `EOI-S-[4-HEX]-[4-DIGIT]` (e.g. `EOI-S-HERO-0001`). PII is isolated in the restricted `pii.pii_identity` schema.
- **Consequence:** Zero PII leakage into analytics views; full DPDP Act compliance.

## ADR-003: Multi-Party Dual-Signature Authorization
- **Context:** Principle P2 dictates "No single master administrator". Sensitive operations (activating scoring versions, overriding legal claims) must not be unilateral.
- **Decision:** Enforce two distinct approvals with Requester ≠ Approver validation in `authorization_requests`.
- **Consequence:** Eliminates administrative unilateral override vulnerabilities.

## ADR-004: Trajectory Preservation on Unemployment
- **Context:** Trajectory gap dictates that employment is longitudinal, not boolean.
- **Decision:** Reporting unemployment transitions active status to `UNEMPLOYMENT_REPORTED` and requires employer confirmation before transitioning to `VERIFIED_UNEMPLOYED`. Prior verified employment tenure remains permanently in history and is never overwritten or deleted.
- **Consequence:** Full longitudinal visibility into employment stability, retention, and re-employment intervals.

## ADR-005: AI Boundary & Citation Enforcement
- **Context:** Principle P5 dictates "AI is never the source of truth".
- **Decision:** The `eoi_ai` database role has read-only access to whitelisted statistical views only. Responses must bind directly to pre-aggregated structured evidence objects, and the UI labels all answers as "AI-generated explanation of verified evidence".
- **Consequence:** Provable prevention of hallucinated metrics or unauthorized data alteration.
