'use client'

import { DataTable } from '@/components/DataTable'
import { StatusChip } from '@/components/StatusChip'

export default function AgencyAnalyticsPage() {
  const cohortAnalytics = [
    {
      cohort: 'Cohort 01 — Full Stack Web Dev',
      enrolled: 60,
      completed: 58,
      job_ready: 54,
      verified_employed: 48,
      conversion_pct: '82.8%',
      retention_6m: '87.5%',
      feedback_score: '4.6 / 5.0',
    },
    {
      cohort: 'Cohort 02 — Data Analysis',
      enrolled: 60,
      completed: 56,
      job_ready: 50,
      verified_employed: 42,
      conversion_pct: '75.0%',
      retention_6m: '81.0%',
      feedback_score: '4.3 / 5.0',
    },
    {
      cohort: 'Cohort 03 — Cybersecurity',
      enrolled: 60,
      completed: 57,
      job_ready: 52,
      verified_employed: 45,
      conversion_pct: '78.9%',
      retention_6m: '84.4%',
      feedback_score: '4.5 / 5.0',
    },
    {
      cohort: 'Cohort 04 — Healthcare Support',
      enrolled: 60,
      completed: 59,
      job_ready: 55,
      verified_employed: 51,
      conversion_pct: '86.4%',
      retention_6m: '88.2%',
      feedback_score: '4.7 / 5.0',
    },
  ]

  const columns = [
    { key: 'cohort', label: 'Cohort Name', sortable: true },
    { key: 'enrolled', label: 'Enrolled' },
    { key: 'completed', label: 'Completed' },
    { key: 'job_ready', label: 'Job Ready' },
    { key: 'verified_employed', label: 'Verified Employed' },
    {
      key: 'conversion_pct',
      label: 'Verified Conversion',
      sortable: true,
      render: (c: any) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--verified)' }}>
          {c.conversion_pct}
        </span>
      ),
    },
    { key: 'retention_6m', label: '6m Retention Rate', sortable: true },
    { key: 'feedback_score', label: 'Employer Rating', sortable: true },
  ]

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Agency Outcome Analytics</h1>
            <p className="page-header__description">
              Longitudinal cohort tracking · Verified employment conversion and 6-month retention rates
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <StatusChip status="VERIFIED" label="Verified cohorts" />
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={cohortAnalytics}
        idKey="cohort"
        searchPlaceholder="Filter cohorts…"
        exportFileName="agency_analytics_export.csv"
      />
    </div>
  )
}
