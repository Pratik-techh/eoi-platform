# Security Architecture & OWASP ASVS Baseline — EOI Platform

## 1. Zero Trust Security Model
Every request to the EOI platform independently validates:
1. **Identity & Authentication:** Validated session token via secure HTTP-only cookies.
2. **Role & Authority:** RBAC role authorization via `authorize(actor, action, resource)`.
3. **Resource Scope:** Strict multi-tenant isolation (Agencies isolated by `agency_id`, Employers by canonical `org_id`, Students by `eoi_student_id`).
4. **State Preconditions:** Verifies valid state machine transitions (e.g. cannot confirm an already rejected record).
5. **No Master Administrator:** Privileged system changes require two-party authorization.

---

## 2. OWASP ASVS (Application Security Verification Standard) Baseline Matrix

| ASVS ID | Control Description | EOI Platform Implementation | Status |
|---|---|---|---|
| **V1.1** | Architecture & Threat Modeling | Separation of PII into `pii` schema; append-only audit ledger; strict service boundaries | **PASSED** |
| **V2.1** | Password Security & Hashing | Argon2id / bcrypt standard via Supabase Auth; minimum length 8 chars; rate limits | **PASSED** |
| **V3.1** | Session Management | HTTP-only, SameSite=Lax cookies; active session monitoring; session revocation | **PASSED** |
| **V4.1** | Access Control & Authorization | Dual-layer: Server-side `authorize()` + PostgreSQL Row Level Security (Default Deny) | **PASSED** |
| **V4.3** | Multi-Tenancy & Data Isolation | Strict schema separation; agencies cannot view other agencies; students view own records | **PASSED** |
| **V5.1** | Input Validation & Sanitization | Strict Zod validation on all API route handlers and server actions | **PASSED** |
| **V6.1** | Cryptography & Data Integrity | Recursive SHA-256 hash chaining on all `audit_events`; immutable ledger head | **PASSED** |
| **V8.1** | Data Protection & PII Separation | Physical separation: `pii_identity` table in restricted schema; joined only by opaque ID | **PASSED** |
| **V10.1**| Audit & Logging | Structured JSON audit events capturing actor, role, previous state, new state, hash | **PASSED** |
| **V13.1**| API & Web Services Security | Rate limiting middleware; CORS protection; secure HTTP headers | **PASSED** |
| **V14.1**| Secure Headers Configuration | CSP, HSTS, X-Frame-Options: DENY, Referrer-Policy: strict-origin-when-cross-origin | **PASSED** |

---

## 3. Append-Only Integrity & Cryptographic Hash Chaining
All state changes flow through `SECURITY DEFINER` database functions that enforce:
- `BEFORE UPDATE OR DELETE OR TRUNCATE` triggers on `audit_events` that unconditionally raise exceptions.
- `BEFORE INSERT` trigger computing `hash = sha256(previous_hash || canonical_json(event_payload))`.
- `verify_ledger_chain()` function executing automated verification across all sequential transactions.

---

## 4. Secret Management & Client Bundle Audit
- `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to server-side code and is NEVER prefixed with `NEXT_PUBLIC_`.
- Static build verification checks client bundle AST to guarantee zero leaked secrets.
