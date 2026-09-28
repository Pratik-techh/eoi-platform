'use client'

import Link from 'next/link'
import { LeakageCallout } from '@/components/LeakageCallout'
import { DataTable } from '@/components/DataTable'

export default function GovLeakagePage() {
  const leakageSignals = [
    { id: 'anom-01', signal_type: 'LEAKAGE_DETECTED', severity: 'HIGH', description: 'Conversion loss in Rajasthan Cohort 04 exceeds 3 sigma' }
  ]

  const drilldownData = [
    {
      cohort: 'Cohort 04 — Software Engineering',
      agency: 'Rajasthan Skill Development Board',
      region: 'Rajasthan / Jaipur',
      stage: 'Interview → Employed',
      interviewed: 84,
      employed: 15,
      observed_pct: '17.9%',
      peer_baseline: '68.4%',
      z_score: 3.2,
      status: 'HIGH LEAKAGE',
    },
    {
      cohort: 'Cohort 02 — Data Analysis',
      agency: 'Maharashtra Vocational Training Centre',
      region: 'Maharashtra / Pune',
      stage: 'Job Ready → Interview',
      interviewed: 62,
      employed: 52,
      observed_pct: '83.9%',
      peer_baseline: '87.6%',
      z_score: 0.6,
      status: 'NORMAL',
    },
    {
      cohort: 'Cohort 01 — Full Stack Web Dev',
      agency: 'Delhi Skill Development Institute',
      region: 'Delhi / New Delhi',
      stage: 'Interview → Employed',
      interviewed: 58,
      employed: 48,
      observed_pct: '82.8%',
      peer_baseline: '72.0%',
      z_score: -1.1,
      status: 'OUTPERFORMING',
    },
    {
      cohort: 'Cohort 03 — Cybersecurity',
      agency: 'Tamil Nadu Skilling Authority',
      region: 'Tamil Nadu / Chennai',
      stage: 'Interview → Employed',
      interviewed: 45,
      employed: 34,
      observed_pct: '75.6%',
      peer_baseline: '70.5%',
      z_score: -0.7,
      status: 'NORMAL',
    },
    {
      cohort: 'Cohort 05 — Healthcare Support',
      agency: 'West Bengal Vocational Institute',
      region: 'West Bengal / Kolkata',
      stage: 'Selected → Employed',
      interviewed: 50,
      employed: 38,
      observed_pct: '76.0%',
      peer_baseline: '86.7%',
      z_score: 1.4,
      status: 'MILD VARIANCE',
    },
  ]

  const columns = [
    { key: 'cohort', label: 'Cohort / Course', sortable: true },
    { key: 'agency', label: 'Training Agency', sortable: true },
    { key: 'region', label: 'Region / District', sortable: true },
    { key: 'stage', label: 'Evaluated Funnel Stage' },
    { key: 'observed_pct', label: 'Observed Rate', sortable: true },
    { key: 'peer_baseline', label: 'Peer Baseline' },
    {
      key: 'z_score',
      label: 'z-Score',
      sortable: true,
      render: (r: any) => (
        <span style={{
          fontFamily: 'var(--font-mono)', fontWeight: 700,
          color: r.z_score >= 2.0 ? 'var(--disputed)' : 'var(--ink)',
        }}>
          {r.z_score.toFixed(1)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Detection Flag',
      render: (r: any) => (
        <span style={{
          fontSize: '11px', fontWeight: 600, padding: '2px 6px', borderRadius: 'var(--r-control)',
          background: r.status === 'HIGH LEAKAGE' ? 'var(--chip-disputed-bg)' : r.status === 'OUTPERFORMING' ? 'var(--chip-verified-bg)' : 'var(--canvas)',
          color: r.status === 'HIGH LEAKAGE' ? 'var(--disputed)' : r.status === 'OUTPERFORMING' ? 'var(--verified)' : 'var(--muted)',
          border: `1px solid ${r.status === 'HIGH LEAKAGE' ? 'var(--chip-disputed-border)' : r.status === 'OUTPERFORMING' ? 'var(--chip-verified-border)' : 'var(--line)'}`,
        }}>
          {r.status}
        </span>
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Outcome Leakage Detection Engine</h1>
            <p className="page-header__description">
              Statistical drop-off detection using IQR and z-score analysis (threshold: |z| ≥ 2.0) vs national cohort baselines
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <Link
              href="/gov/simulator"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-1)',
                padding: '6px var(--sp-4)', background: 'var(--sim)', color: 'white',
                borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', fontWeight: 600, textDecoration: 'none',
              }}
            >
              Simulate capacity adjustment →
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Hero Leakage Callout */}
      <LeakageCallout
        stageFrom="Interviewed"
        stageTo="Employed"
        programName="Software Engineering Fundamentals"
        region="Rajasthan / Jaipur"
        zScore={3.2}
        baselineRate={68.4}
        observedRate={18.2}
        sampleSize={420}
      />

      {/* Drill-down Table */}
      <div style={{ marginTop: 'var(--sp-6)' }}>
        <div style={{ marginBottom: 'var(--sp-3)' }}>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)' }}>
            Stage Conversion Loss Drill-down by Cohort & Region
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>
            Statistical analysis of all active and completed batches · Sorted by statistical significance
          </p>
        </div>
        <DataTable columns={columns} data={drilldownData} idKey="cohort" exportFileName="leakage_analysis_export.csv" />
      </div>

      {/* Statistical Methodology Provenance */}
      <div style={{
        marginTop: 'var(--sp-6)', padding: 'var(--sp-4)', background: 'var(--canvas)',
        border: '1px solid var(--line)', borderRadius: 'var(--r-container)', fontSize: 'var(--text-xs)', color: 'var(--muted)', lineHeight: 1.5,
      }}>
        <strong>Statistical Methodology Note:</strong> Outlier detection runs automatically on verified event transitions. A cohort is flagged as exhibiting high leakage when its stage conversion rate falls below 2 standard deviations from the national peer mean (|z| ≥ 2.0) with a minimum cohort volume guard (N ≥ 30). Wording adheres to the strict evidence standard: "This cohort exhibits an unusually high conversion loss at this stage" rather than punitive attributions.
      </div>
    </div>
  )
}
