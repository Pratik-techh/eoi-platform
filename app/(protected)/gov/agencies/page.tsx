'use client'

import { DataTable } from '@/components/DataTable'
import { StatusChip } from '@/components/StatusChip'
import { db } from '@/lib/db/store'

export default function GovAgenciesPage() {
  const agencies = db.getAgencyMetrics()

  const columns = [
    { key: 'agency_name', label: 'Training Agency Name', sortable: true },
    { key: 'state', label: 'State', sortable: true },
    { key: 'district', label: 'District' },
    { key: 'accreditation', label: 'Accreditation', sortable: true },
    { key: 'total_students', label: 'Enrolled Trainees', sortable: true },
    { key: 'completed_students', label: 'Completed', sortable: true },
    { key: 'reported_employment', label: 'Reported Emp.', sortable: true },
    { key: 'verified_employment', label: 'Verified Emp.', sortable: true },
    {
      key: 'verified_rate',
      label: 'Verified Rate',
      sortable: true,
      render: (r: any) => {
        const isLow = r.verified_rate < 30
        return (
          <span style={{
            fontFamily: 'var(--font-mono)', fontWeight: 700,
            color: isLow ? 'var(--disputed)' : 'var(--verified)',
          }}>
            {r.verified_rate.toFixed(1)}%
          </span>
        )
      },
    },
    {
      key: 'confidence_interval',
      label: '95% Confidence Interval',
      render: (r: any) => (
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
          {r.confidence_interval_low.toFixed(1)}% – {r.confidence_interval_high.toFixed(1)}%
        </span>
      ),
    },
    {
      key: 'retention_rate',
      label: '6m Retention',
      sortable: true,
      render: (r: any) => `${r.retention_rate.toFixed(1)}%`,
    },
    {
      key: 'dispute_rate',
      label: 'Dispute Rate',
      render: (r: any) => (
        <span style={{ color: r.dispute_rate > 3.0 ? 'var(--disputed)' : 'var(--muted)' }}>
          {r.dispute_rate.toFixed(1)}%
        </span>
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Agency Intelligence</h1>
            <p className="page-header__description">
              Objective, user-sorted verified outcome performance · No sponsored rankings or commercial ordering
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <StatusChip status="VERIFIED" label="Verified data only" />
          </div>
        </div>
      </div>

      {/* No Pay-to-Rank Policy Banner */}
      <div style={{
        padding: 'var(--sp-3) var(--sp-4)', background: 'var(--canvas)', border: '1px solid var(--line)',
        borderRadius: 'var(--r-control)', fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 'var(--sp-5)',
        display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M7 4.5v3M7 9.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <span>
          <strong>Platform Integrity Policy:</strong> Sorting is strictly user-controlled and neutral. No agency can purchase placement, badges, or sponsored ranking. Confidence intervals adjust for batch volume to prevent over-interpreting small sample sizes.
        </span>
      </div>

      <DataTable
        columns={columns}
        data={agencies ?? []}
        idKey="agency_id"
        searchPlaceholder="Search training partners by name, state, or district…"
        exportFileName="agency_intelligence_export.csv"
      />
    </div>
  )
}
