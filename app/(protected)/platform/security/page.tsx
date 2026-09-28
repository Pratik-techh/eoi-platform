'use client'

import { StatusChip } from '@/components/StatusChip'
import { DataTable } from '@/components/DataTable'

export default function PlatformSecurityPage() {
  const securityEvents = [
    {
      id: 'sec-01',
      event: 'SESSION_AUTHENTICATED',
      actor: 'gov.analyst@eoi.demo',
      role: 'gov_analyst',
      ip: '127.0.0.1 (Local loopback)',
      timestamp: new Date().toLocaleTimeString('en-IN'),
      status: 'VERIFIED',
    },
    {
      id: 'sec-02',
      event: 'MFA_CHALLENGE_SCAFFOLD',
      actor: 'security.officer@eoi.demo',
      role: 'security_officer',
      ip: '127.0.0.1 (Local loopback)',
      timestamp: new Date().toLocaleTimeString('en-IN'),
      status: 'VERIFIED',
    },
    {
      id: 'sec-03',
      event: 'FORBIDDEN_WRITE_BLOCKED',
      actor: 'agency.officer@eoi.demo',
      role: 'agency_officer',
      ip: '127.0.0.1 (Local loopback)',
      timestamp: new Date().toLocaleTimeString('en-IN'),
      status: 'DISPUTED',
    },
  ]

  const columns = [
    { key: 'event', label: 'Security Event', sortable: true },
    { key: 'actor', label: 'Authenticated Identity', sortable: true },
    { key: 'role', label: 'RBAC Role' },
    { key: 'ip', label: 'Client Origin' },
    { key: 'timestamp', label: 'Timestamp' },
    {
      key: 'status',
      label: 'Security Status',
      render: (r: any) => (
        <StatusChip status={r.status === 'VERIFIED' ? 'VERIFIED' : 'DISPUTED'} label={r.status === 'VERIFIED' ? 'Authorized' : 'Violation Intercepted'} />
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Security Operations Center</h1>
            <p className="page-header__description">
              Zero Trust access control · Session monitoring · OWASP ASVS baseline telemetry (MASTER_PROMPT §11)
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <StatusChip status="VERIFIED" label="Zero Trust Active" />
          </div>
        </div>
      </div>

      {/* Security Architecture Summary */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--sp-4)',
        marginBottom: 'var(--sp-6)',
      }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)', padding: 'var(--sp-4)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', fontWeight: 600 }}>ROW LEVEL SECURITY (RLS)</div>
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--verified)', marginTop: 4 }}>
            Default Deny Enabled
          </div>
          <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: 4 }}>
            All 40+ tables protected by PostgreSQL RLS and server-side policy guards.
          </p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)', padding: 'var(--sp-4)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', fontWeight: 600 }}>PII SEPARATION</div>
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--verified)', marginTop: 4 }}>
            Physically Isolated Schema
          </div>
          <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: 4 }}>
            pii_identity table joined only via opaque EOI Student ID. Govt/AI roles have 0 access.
          </p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)', padding: 'var(--sp-4)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', fontWeight: 600 }}>APPEND-ONLY INTEGRITY</div>
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--verified)', marginTop: 4 }}>
            SHA-256 Hash Chained
          </div>
          <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: 4 }}>
            UPDATE/DELETE triggers raise exceptions. 100% of state changes logged.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={securityEvents}
        idKey="id"
        searchPlaceholder="Search security audit log…"
        exportFileName="security_events_export.csv"
      />
    </div>
  )
}
