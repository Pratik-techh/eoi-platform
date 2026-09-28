# Design System Specification
**Employment Outcome Intelligence (EOI) Platform**
*Design Standard: Institutional, Calm, Exact, Trustworthy*
*Reference: MASTER_PROMPT Section 14*

---

## 1. Design Philosophy & Intent

The EOI Platform is engineered for government analysts, programme officers, CAG auditors, and district magistrates who interrogate dense data daily, alongside students verifying credentials on mobile devices.

### Hard Aesthetic Bans (Zero "Vibe-Coded" Tells)
- **NO** purple/blue-violet gradient washes or hero glassmorphism.
- **NO** floating emoji as icons (Lucide React institutional iconography only).
- **NO** dark-mode-only neon palettes or decorative chart axes without units.
- **NO** single-word accent highlights in headings.
- **NO** placeholder illustrations or mock names like "John Doe / Acme Corp". Realistic Indian jurisdictions, schemes, and canonical entities only.

---

## 2. Design Tokens & Foundations

### 2.1 Color Palette
| Token Name | Hex Code | HSL Equivalent | Semantic Application |
|---|---|---|---|
| `ink` | `#0E1F33` | `hsl(212, 57%, 13%)` | Primary typographic content & headings |
| `surface` | `#FFFFFF` | `hsl(0, 0%, 100%)` | Card backgrounds, panels, modals |
| `canvas` | `#F4F6F9` | `hsl(216, 25%, 97%)` | App background, navigation gutter |
| `line` | `#DDE3EA` | `hsl(213, 20%, 89%)` | Structural borders, dividers, table grid lines |
| `muted` | `#526173` | `hsl(213, 16%, 38%)` | Secondary meta text, table headers |
| `primary` | `#1D4E89` | `hsl(212, 65%, 33%)` | Institutional blue: action buttons, active navigation |
| `verified` | `#0F766E` | `hsl(175, 77%, 26%)` | Teal: independently verified outcomes, cryptographic integrity |
| `pending` | `#B45309` | `hsl(38, 92%, 37%)` | Amber: awaiting employer verification, review required |
| `disputed` | `#B42318` | `hsl(4, 77%, 40%)` | Dark Red: contested outcomes, critical leakage anomaly |
| `info` | `#2C5FA8` | `hsl(215, 58%, 42%)` | Blue: system notes, metadata explanations |
| `simulation` | `#6B4E9B` | `hsl(262, 33%, 45%)` | Deep Purple: reserved strictly for scenario simulation |

*Rule:* Every status chip is always paired with an icon **and** text label (WCAG AA contrast). Color is never the sole carrier of meaning.

### 2.2 Typography Scale
- **UI Font:** IBM Plex Sans (systematic, readable, institutional).
- **Monospace Font:** IBM Plex Mono (IDs, hashes, correlation IDs, timestamps only).
- **Tabular Figures:** `font-feature-settings: "tnum" 1` applied to all data tables and KPI cards.
- **Scale:**
  - `text-xs`: 12px / line-height 16px (meta timestamps, hash snippets)
  - `text-sm`: 13px / line-height 18px (dense table rows, status chips)
  - `text-base`: 14px / line-height 20px (default body, form inputs)
  - `text-md`: 16px / line-height 24px (subheadings, card titles)
  - `text-lg`: 20px / line-height 28px (section headers)
  - `text-xl`: 24px / line-height 32px (page titles)
  - `text-2xl`: 32px / line-height 40px (headline KPI metrics)

### 2.3 Spacing & Geometry
- **Grid:** 12-column layout with 8px / 4px sub-grid.
- **Radii Rule:** Exactly two radii throughout the entire system:
  - `rounded-[4px]`: controls, buttons, form inputs, status chips, badges.
  - `rounded-[8px]`: containers, cards, dialogs, drawers.
- **Elevation:** Borders over shadows. Thin 1px `#DDE3EA` borders with one subtle elevation (`shadow-sm`) reserved exclusively for floating popovers and dialog overlays.

---

## 3. Dashboard Layout Concepts & Selection

During initial architecture, three layout concepts were evaluated for the Government Analytics Dashboard:

### Concept A: Classic Multi-Tab Portal
- Tab 1: Enrolment & Training
- Tab 2: Assessment & Readiness
- Tab 3: Placement & Verification
*Evaluation: Rejected.* Creates artificial silos; hides the longitudinal trajectory and prevents analysts from spotting drop-off leakage across stages in one continuous glance.

### Concept B: Dense Modular Widget Grid
- 16 equal-sized modular draggable widgets.
*Evaluation: Rejected.* Too noisy; lacks visual hierarchy; creates erratic cognitive load for senior officials scanning for immediate intervention points.

### Concept C: Unified Funnel & Trajectory Hierarchy (Selected)
```
+---------------------------------------------------------------------------------------+
| TOP BAR: Scope Filters (State, Program, Cohort) | Data Freshness | Role Switcher     |
+---------------------------------------------------------------------------------------+
| PERSISTENT BANNER: Synthetic Data — Prototype Indicator                              |
+---------------------------------------------------------------------------------------+
| EXECUTIVE KPI STRIP: 4 Critical Metrics (Enrolled, Assessed, Job-Ready, Verified)    |
+---------------------------------------------------------------------------------------+
| SIGNATURE INTERACTIVE FUNNEL (Custom SVG with Drop-off % and Leakage Highlight)      |
+---------------------------------------------------------------------------------------+
| DUAL COLUMNS:                                                                         |
| Left: Outcome Leakage Anomaly Feed             | Right: Provenance & Methodology      |
| (Statistical z-score alerts with evidence)     | (Calculation version 1.2, exclusions)|
+---------------------------------------------------------------------------------------+
| DRILL-DOWN DATA TABLE: Sortable, Filterable, Density Toggle, CSV Export              |
+---------------------------------------------------------------------------------------+
```
*Rationale:* Places the longitudinal pipeline front and center. Allows instant visual identification of where training investments fail to convert into verified employment.

---

## 4. Signature Components

1. **`StatusChip`:** Handles all 8 canonical verification states (`VERIFIED_EMPLOYED`, `PENDING_VERIFICATION`, `UNEMPLOYMENT_REPORTED`, `RECONCILIATION_PENDING`, `VERIFIED_UNEMPLOYED`, `CORRECTION_REQUESTED`, `REJECTED`, `DISPUTED`).
2. **`MetricCard` + `MetricProvenance`:** Reusable cards with inline delta, status tag, and clickable "How is this calculated?" slide-over drawer displaying exact numerator, denominator, exclusions, and calculation version.
3. **`FunnelChart`:** Custom SVG funnel rendering stage volume, conversion rate from previous stage, conversion from start, and stage drop-off bars.
4. **`LeakageCallout`:** Statistical anomaly container with evidence badges and deep link to investigation view.
5. **`TrajectoryTimeline`:** Longitudinal timeline tracking learner transitions through employment, departure, unemployment, and re-employment without overwriting historical records.
6. **`EntityResolutionFlow`:** Visual pipeline demonstrating Reported Employer → Resolution → Canonical Org → Verifier Account.
7. **`SkillGapBars`:** Three-tier proficiency triad (Corporate Demand vs Training Supply vs Job-Ready Proficiency).
8. **`EvidenceBlock`:** AI citation container explicitly listing underlying structured data rows, record counts, and calculation version.
