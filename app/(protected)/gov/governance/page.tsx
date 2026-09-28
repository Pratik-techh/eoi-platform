'use client'

import { StatusChip } from '@/components/StatusChip'
import { DataTable } from '@/components/DataTable'
import { db } from '@/lib/db/store'

export default function GovGovernancePage() {
  const authRequests = db.authorizationRequests
  const anomalies = db.anomalySignals

  const authColumns = [
    {
      key: 'operation',
      label: 'Operation',
      render: (r: any) => (
        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
          {r.operation.replace(/_/g, ' ')}
        </span>
      ),
    },
    { key: 'description', label: 'Summary' },
    { key: 'requested_by', label: 'Requested By' },
    {
      key: 'required_approvals',
      label: 'Approvals Needed',
      render: (r: any) => `${r.approvals?.length ?? 0} of ${r.required_approvals} (Dual-Party Rule)`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (r: any) => <StatusChip status={r.status} />,
    },
    {
      key: 'created_at',
      label: 'Submitted Date',
      render: (r: any) => new Date(r.created_at).toLocaleDateString('en-IN'),
    },
  ]

  const anomalyColumns = [
    {
      key: 'signal_type',
      label: 'Signal Type',
      render: (a: any) => (
        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
          {a.signal_type.replace(/_/g, ' ')}
        </span>
      ),
    },
    { key: 'description', label: 'Investigation Detail' },
    {
      key: 'severity',
      label: 'Severity',
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
      label: 'State',
      render: (a: any) => (
        <StatusChip status={a.auto_resolved ? 'VERIFIED' : 'PENDING'} label={a.auto_resolved ? 'Resolved' : 'Active Investigation'} />
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Platform Governance & Authorizations</h1>
            <p className="page-header__description">
              Separation of duties · Two-person authorization requests · Algorithmic anomaly investigations (MASTER_PROMPT §4.2)
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <StatusChip status="VERIFIED" label="Zero Trust Governance" />
          </div>
        </div>
      </div>

      {/* Principle Banner */}
      <div style={{
        padding: 'var(--sp-4)', background: 'var(--canvas)', border: '1px solid var(--line)',
        borderRadius: 'var(--r-container)', fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 'var(--sp-6)',
        lineHeight: 1.5,
      }}>
        <strong>No Master Administrator Rule (P2):</strong> No single individual or role possesses unilateral authority to activate metric calculation formulas, override organization legal claims, or wipe outcome records. Privileged operations require independent dual-party authorization where Requester ≠ Approver.
      </div>

      {/* Multi-Party Authorization Requests */}
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <div style={{ marginBottom: 'var(--sp-3)' }}>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)' }}>
            Pending & Completed Authorization Requests
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>
            Requires 2 distinct signatures from authorized role families before execution
          </p>
        </div>
        <DataTable columns={authColumns} data={authRequests ?? []} idKey="id" exportFileName="authorizations_export.csv" />
      </div>

      {/* Anomaly Signals & Investigations Queue */}
      <div>
        <div style={{ marginBottom: 'var(--sp-3)' }}>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)' }}>
            Integrity Engine Anomaly Signals & Active Investigations
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>
            Automated signals generated on burst submissions, latency anomalies, or statistical leakage
          </p>
        </div>
        <DataTable columns={anomalyColumns} data={anomalies ?? []} idKey="id" exportFileName="anomalies_export.csv" />
      </div>
    </div>
  )
}
