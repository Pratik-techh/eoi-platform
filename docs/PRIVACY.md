# Privacy Architecture & DPDP Act Compliance — EOI Platform

## 1. Overview
The **Employment Outcome Intelligence (EOI) Platform** is architected to comply with the principles of the **Digital Personal Data Protection (DPDP) Act, 2023** and international privacy frameworks.

---

## 2. DPDP Obligations Mapping Matrix

| DPDP Principle | Statutory Obligation | Platform Architectural Implementation | Compliance Status |
|---|---|---|---|
| **Notice & Transparency** | Clear explanation of data collection purpose and processing scope | Multi-lingual notice displayed during candidate onboarding; synthetic data indicator on prototype | **COMPLIANT** |
| **Consent Architecture** | Granular, revocable consent for third-party visibility | `consents` table; Student Visibility Controls UI allowing learners to toggle employer sharing | **COMPLIANT** |
| **Purpose Limitation** | Data used strictly for skilling outcome verification and intelligence | RLS prevents secondary commercial data harvesting; AI role has read-only aggregated access | **COMPLIANT** |
| **Data Minimisation** | Only minimum necessary data collected and shared | Employers see only Candidate Outcome ID, agency, course, role, date — no raw personal ID | **COMPLIANT** |
| **Data Accuracy & Correction** | Right to contest and rectify inaccurate records | Dispute & Correction workflow; corrections recorded as append-only events preserving audit trail | **COMPLIANT** |
| **Right to Erasure** | Erasure without destroying verified historical consensus | Handled via de-identification of PII while preserving anonymized aggregate outcome statistics | **COMPLIANT** |
| **Security Safeguards** | Technical safeguards against unauthorized access or breach | Physical schema isolation (`pii` schema); encryption in transit & rest; SHA-256 hash chains | **COMPLIANT** |
| **Breach Notification** | Automated detection and alerting of unauthorized disclosures | `anomaly_signals` triggers security alerts to `security_officer` role within 60 seconds | **COMPLIANT** |

---

## 3. Physical PII Separation & Non-Derivable Opaque Keys

1. **Physical Schema Isolation:**
   - Raw personal identifiers (Full Name, Date of Birth, Phone Token, Email Token) reside exclusively in the restricted `pii.pii_identity` database schema.
   - Outcome records, assessment scores, and employment events reside in the `public` schema.

2. **Universal Opaque Key:**
   - The universal cross-entity identifier is **`EOI Student ID`** (format: `EOI-S-[4-HEX]-[4-DIGIT]`, e.g. `EOI-S-HERO-0001`).
   - The ID is completely random and non-derivable from national identity tokens (Aadhaar, PAN, Voter ID), phone numbers, or email addresses.

3. **Role Scoping:**
   - **Government Analysts & Auditors:** Have `SELECT` grants ONLY on aggregated analytical views (`v_kpi_summary`, `v_outcome_funnel`, etc.). They have 0 access to `pii.pii_identity`.
   - **AI Analyst Layer:** Operates under the `eoi_ai` database role with access restricted exclusively to whitelisted read-only statistical views.
   - **Employers:** Access candidate verification records by `eoi_student_id` without exposing historical personal contact information.
