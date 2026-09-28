# Design System Specification
**Employment Outcome Intelligence (EOI) Platform**
*Design Standard: Stitch Precision Instrument Verification (Dark Telemetry Mode)*
*Reference: Stitch Project https://stitch.withgoogle.com/projects/7054499307188474498 & MASTER_PROMPT Section 14*

---

## 1. Design Philosophy & Intent

The EOI Platform is styled according to the **Stitch Precision Instrument Verification** system: a technical, pitch-black dark telemetry console engineered for government analysts, programme officers, CAG auditors, and district magistrates who interrogate longitudinal outcome trajectories daily.

### Core Aesthetic Pillars
- **Pitch-Black Achromatic Canvas:** Pure `#000000` canvas with `#080808` sub-rails and `#0F0F0F` elevated instrument cards.
- **Hardware-Grade Telemetry Diodes:** 6px/8px status pinhole diode indicators with subtle, focused micro-halos (`0 0 6px`) replacing fuzzy glassmorphic blobs.
- **Rectilinear Geometry:** Strict `rounded-[2px]` and `rounded-[4px]` edges. No oversized pill shapes or decorative curved bubbles.
- **Hairlines Over Shadows:** High-precision 1px `#242424` structural hairline borders define visual hierarchy rather than soft diffuse shadows.
- **Dual Type Discipline:** High-legibility `Inter` for interface prose and labels paired with `JetBrains Mono` for numbers, cryptographic ledger hashes, correlation IDs, and status diode tags (`font-feature-settings: "tnum"`).

### Hard Aesthetic Bans
- **NO** soft purple/blue-violet gradient washes or floating glassmorphism cards.
- **NO** floating emoji as icons (Lucide React institutional iconography only).
- **NO** neon rainbow color palettes or ungrounded decorative chart axes.
- **NO** pill-shaped buttons or rounded badge bubbles.
- **NO** placeholder mock names or uncalibrated numbers. Realistic Indian jurisdictions, schemes, and canonical entities only.

---

## 2. Design Tokens & Foundations

### 2.1 Color Palette
| Token Name | Hex Code | HSL / RGB | Semantic Application |
|---|---|---|---|
| `canvas` | `#000000` | `hsl(0, 0%, 0%)` | Deep space black main backdrop |
| `surface-sub` | `#080808` | `hsl(0, 0%, 3%)` | Sub-rails, command bar, data table zebra rows |
| `surface` | `#0F0F0F` | `hsl(0, 0%, 6%)` | Primary instrument panels, cards, dialogs |
| `surface-elevated`| `#151515` | `hsl(0, 0%, 8%)` | Hover states, metric sub-blocks, callout cards |
| `line` | `#242424` | `hsl(0, 0%, 14%)` | Structural hairlines, table borders, dividers |
| `line-subtle` | `#1A1A1A` | `hsl(0, 0%, 10%)` | Secondary grid lines, faint delimiters |
| `ink` | `#F0F0F0` | `hsl(0, 0%, 94%)` | High-contrast typographic content & headings |
| `muted` | `#8E9192` | `hsl(200, 2%, 57%)` | Technical metadata, mono table column headers |
| `verified` | `#18B6A4` | `rgb(24, 182, 164)` | Verified employment diode, cryptographic root pass |
| `pending` | `#D99A32` | `rgb(217, 154, 50)` | Pending review diode, reconciliation queue |
| `disputed` / `danger` | `#E05252` | `rgb(224, 82, 82)` | Disputed trajectory, statistical leakage anomaly |
| `info` | `#5B9DFF` | `rgb(91, 157, 255)` | Telemetry notes, protocol version, system parameters |
| `simulation` | `#9B7AE8` | `rgb(155, 122, 232)`| Counterfactual simulation mode indicators |

*Telemetry Rule:* Every status chip is rendered as an instrument diode with a 6px circular LED dot and concentrated micro-halo (`box-shadow: 0 0 6px <color>45`), paired with uppercase `JetBrains Mono` label text.

### 2.2 Typography Scale
- **UI Font:** `Inter` (neutral, crisp, institutional legibility).
- **Monospace Font:** `JetBrains Mono` (hashes, correlation IDs, timestamps, diode labels, KPIs).
- **Tabular Figures:** `font-feature-settings: "tnum" 1` applied to all data tables and KPI cards.
- **Scale:**
  - `text-[10px]` / `text-xs`: 10-12px / line-height 14-16px (micro status tags, SHA-256 ledger chips)
  - `text-sm`: 13px / line-height 18px (dense table rows, form inputs, command bar telemetry)
  - `text-base`: 14px / line-height 20px (default body, narrative descriptions)
  - `text-md`: 16px / line-height 24px (card titles, section headers)
  - `text-lg`: 20px / line-height 28px (module headers)
  - `text-xl`: 24px / line-height 32px (page titles)
  - `text-2xl` / `text-3xl`: 28-36px / line-height 36-44px (headline KPI metrics)

### 2.3 Spacing & Geometry
- **Grid:** 12-column layout with 8px / 4px sub-grid.
- **Radii Rule:**
  - `rounded-[2px]`: telemetry diode chips, micro-badges, code snippets.
  - `rounded-[4px]`: controls, buttons, form inputs, instrument cards, modals, drawers.
- **Hairlines:** Thin 1px `#242424` borders throughout. No heavy shadows or elevation blurs.

---

## 3. Dashboard Layout & Command Architecture

The Government Analytics and Auditor dashboards implement a unified high-density instrument console:
```
+---------------------------------------------------------------------------------------+
| COMMAND BAR: System: Nominal | Latency: 12ms | LEDGER: 0x7F18...E29A | Switch Role     |
+---------------------------------------------------------------------------------------+
| AUDIT PERSISTENT BANNER: Synthetic Data — Prototype Indicator                         |
+---------------------------------------------------------------------------------------+
| EXECUTIVE TELEMETRY STRIP: Enrolled | Assessed | Job-Ready | Verified (with LEDs)     |
+---------------------------------------------------------------------------------------+
| SIGNATURE INTERACTIVE FUNNEL (Custom SVG Solid Bars, Leakage Badges, Calibrated Axials)|
+---------------------------------------------------------------------------------------+
| DUAL COLUMNS:                                                                         |
| Left: Outcome Leakage Anomaly Feed             | Right: Provenance & Methodology      |
| (Statistical z-score alerts with evidence)     | (Calculation version 1.2, exclusions)|
+---------------------------------------------------------------------------------------+
| PRECISION DATA TABLE: Sortable, Filterable, Density Toggle, CSV Export, Monospace IDs |
+---------------------------------------------------------------------------------------+
```

---

## 4. Signature Components

1. **`StatusChip`:** Implements all 17 canonical verification & trajectory states with 6px diode indicators, micro-halos, and uppercase mono typography.
2. **`MetricCard` + `MetricProvenance`:** Instrument cards featuring a top telemetry indicator bar, high-contrast numbers, and a precision provenance slide-over showing exact formulas, exclusions, and calculation versions.
3. **`FunnelChart`:** Clean SVG funnel with solid `#353534`, `#18B6A4`, and `#D99A32` calibration bars, drop-off loss metrics, and zero blurred gradients.
4. **`LeakageCallout`:** Telemetry anomaly card featuring an `#E05252` crimson diode and left accent line, statistical z-score badge, and deep links to investigations.
5. **`TrajectoryTimeline`:** Longitudinal timeline tracking learner transitions through training, assessment, employment, departure, unemployment, and re-employment with diode nodes and hash-chained events.
6. **`EntityResolutionFlow`:** Zero-trust pipeline demonstrating Reported Employer → Resolution Engine → Canonical Org ID → Verifier Account with dark code snippets.
7. **`SkillGapBars`:** Three-tier proficiency triad (Demand vs Supply vs Job-Ready Proficiency) in high-contrast dark telemetry cards.
8. **`EvidenceBlock`:** AI citation container explicitly listing underlying structured data rows, record counts, and calculation version with monospace evidence grids.
