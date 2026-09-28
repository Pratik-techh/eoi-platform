# Metric Definitions & Statistical Methodology — EOI Platform

## 1. Provenance Standard
Every material metric displayed on the EOI platform carries complete verifiable provenance:
`Value + Numerator + Denominator + Method/Formula + Version + Timestamp + Data State`

The platform uses three explicit data states:
- **Verified only (`verified_only`):** Restricted strictly to third-party independently confirmed records.
- **Includes pending (`includes_pending`):** Incorporates reported outcomes currently awaiting employer verification.
- **All records (`all`):** Gross administrative tally including rejected and disputed submissions.

---

## 2. Core KPI Formulas (Calculation Version 1.2)

### 1. Training Completion Rate
- **Formula:** `COUNT(DISTINCT eoi_student_id WHERE status = 'COMPLETED') / COUNT(DISTINCT eoi_student_id WHERE enrolled = true) × 100`
- **Inclusions:** Trainees meeting minimum 70% attendance criteria and passing assessments.
- **Exclusions:** Registrations cancelled within the initial 7-day trial window.

### 2. Job Readiness Rate
- **Formula:** `COUNT(DISTINCT eoi_student_id WHERE readiness_score >= 70.0) / COUNT(DISTINCT eoi_student_id WHERE status = 'COMPLETED') × 100`
- **Readiness Formula (v1.2):** `Readiness = (0.20 × Attendance%) + (0.30 × Theory Assessment) + (0.30 × Practical Assessment) + (0.20 × Capstone Evaluation)`
- **Inclusions:** All NSQF Level 3–5 qualified trainees.

### 3. Interview Conversion Rate
- **Formula:** `COUNT(DISTINCT eoi_student_id with >=1 verified interview_event) / COUNT(DISTINCT eoi_student_id WHERE job_ready = true) × 100`

### 4. Selection Conversion Rate
- **Formula:** `COUNT(DISTINCT eoi_student_id with >=1 selection_event) / COUNT(DISTINCT eoi_student_id with >=1 interview_event) × 100`

### 5. Verified Employment Rate (North-Star Metric)
- **Formula:** `COUNT(DISTINCT eoi_student_id WHERE employment_status = 'VERIFIED_EMPLOYED') / COUNT(DISTINCT eoi_student_id WHERE status = 'COMPLETED') × 100`
- **Inclusions:** Third-party corporate HR/payroll confirmations via authorized enterprise verifier credentials.
- **Exclusions:** Self-reported unverified placements; agency self-certifications; disputed records.

### 6. 6-Month Retention Rate
- **Formula:** `COUNT(outcomes WHERE employment_status = 'VERIFIED_EMPLOYED' AND duration_days >= 180) / COUNT(outcomes WHERE employment_status = 'VERIFIED_EMPLOYED') × 100`

### 7. Average Time-to-Employment
- **Formula:** `AVG(start_date - assessment_completion_date) in days`

### 8. Re-Employment Rate
- **Formula:** `COUNT(DISTINCT eoi_student_id with >=2 sequential employment records) / COUNT(DISTINCT eoi_student_id with >=1 departure) × 100`

---

## 3. Outcome Leakage Engine Statistical Methodology

The Outcome Leakage Engine detects abnormal conversion loss between consecutive skilling funnel stages using a dual-test statistical model:

### A. z-Score Standard Deviation Test
For a cohort $i$ at stage transition $S \to S+1$, conversion rate $C_i$ is compared against national peer baseline mean $\mu$ and standard deviation $\sigma$:
$$z_i = \frac{\mu - C_i}{\sigma}$$

- **Threshold:** A cohort is flagged as `HIGH LEAKAGE` if $z_i \ge 2.0$ (conversion loss exceeds 2 standard deviations from peer baseline).

### B. Interquartile Range (IQR) Outlier Guard
$$C_i < Q_1 - 1.5 \times \text{IQR}$$
Where $Q_1$ is the 25th percentile and $\text{IQR} = Q_3 - Q_1$.

### C. Volume Guard
- Outlier detection requires a minimum sample volume of $N \ge 30$ candidates to prevent sample size bias on small trial batches.

### D. Ethical Language Rule
The platform strictly mandates objective descriptive phrasing:
- *Enforced:* "This cohort exhibits an unusually high conversion loss at this stage."
- *Prohibited:* "Agency X is performing poorly" or premature accusations of fraud.
