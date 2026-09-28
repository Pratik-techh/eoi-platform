'use client'

import { StatusChip } from '@/components/StatusChip'
import { DataTable } from '@/components/DataTable'
import { db } from '@/lib/db/store'

export default function PlatformAnomaliesPage() {
  const anomalies = db.anomalySignals

  const columns = [
    {
      key: 'signal_type',
      label: 'Signal Type',
      sortable: true,
      render: (a: any) => (
        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
          {a.signal_type.replace(/_/g, ' ')}
        </span>
      ),
    },
    { key: 'description', label: 'Investigation Findings' },
    {
      key: 'severity',
      label: 'Severity',
      sortable: true,
      render: (a: any) => (
        <span style={{
          fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: 2,
          background: a.severity === 'HIGH' || a.severity === 'CRITICAL' ? 'var(--chip-disputed-bg)' : 'var(--chip-pending-bg)',
          color: a.severity === 'HIGH' || a.severity === 'CRITICAL' ? 'var(--disputed)' : 'var(--pending)',
          border: `1px solid ${a.severity === 'HIGH' || a.severity === 'CRITICAL' ? 'var(--chip-disputed-border)' : 'var(--chip-pending-border)'}`,
        }}>
          {a.severity}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Investigation Status',
      render: (a: any) => (
        <StatusChip status={a.auto_resolved ? 'VERIFIED' : 'PENDING'} label={a.auto_resolved ? 'Resolved' : 'Needs Review'} />
      ),
    },
    {
      key: 'detected_at',
      label: 'Detected Date',
      render: (a: any) => new Date(a.detected_at).toLocaleDateString('en-IN'),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Automated Anomaly Signal Registry</h1>
            <p className="page-header__description">
              Data integrity monitoring · Statistical outliers · Rate anomalies (MASTER_PROMPT §7.1)
            </p>
          </div>
        </div>
      </div>

      {/* Language Policy Banner */}
      <div style={{
        padding: 'var(--sp-4)', background: 'var(--canvas)', border: '1px solid var(--line)',
        borderRadius: 'var(--r-container)', fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 'var(--sp-6)',
        lineHeight: 1.5,
      }}>
        <strong>Integrity Policy:</strong> The automated integrity engine flags patterns as <em>"Signals"</em> requiring human investigation. The system never automatically declares fraud or terminates partner contracts without multi-party governance review.
      </div>

      <DataTable
        columns={columns}
        data={anomalies ?? []}
        idKey="id"
        searchPlaceholder="Filter anomaly signals…"
        exportFileName="anomaly_signals_export.csv"
      />
    </div>
  )
}
