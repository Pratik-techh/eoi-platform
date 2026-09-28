import type { Metadata } from 'next'
import { StatusChip } from '@/components/StatusChip'
import { EntityResolutionFlow } from '@/components/EntityResolutionFlow'

export const metadata: Metadata = {
  title: 'Organization Identity | Enterprise Management',
  description: 'Manage legal entity identifiers, claim status, and authorized verification officers',
}

export default async function EmployerOrganizationPage() {
  const identifiers = [
    { class: 'CIN', value: 'U72200KA2004FTC033590', issuer: 'Ministry of Corporate Affairs (MCA)', status: 'VERIFIED' },
    { class: 'EPFO_ESTABLISHMENT_ID', value: 'KNBLR0045678000', issuer: 'Employees’ Provident Fund Organisation', status: 'VERIFIED' },
    { class: 'ESIC_CODE', value: '53000123450000999', issuer: 'Employees’ State Insurance Corporation', status: 'VERIFIED' },
  ]

  const verifiers = [
    { name: 'Kavya Reddy', email: 'employer.verifier@eoi.demo', role: 'Employer Verifier', granted: '10 Aug 2026', status: 'ACTIVE' },
    { name: 'Siddharth Iyer', email: 'sid.iyer@google.com', role: 'Employer Admin', granted: '01 Jul 2026', status: 'ACTIVE' },
  ]

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Organization Identity & Legal Verification</h1>
            <p className="page-header__description">
              Google India Pvt. Ltd. · Canonical ID: org-google-01 · State: Karnataka
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <StatusChip status="VERIFIED" label="Claimed & Authorized" />
          </div>
        </div>
      </div>

      {/* Visual Resolution Flow */}
      <EntityResolutionFlow />

      {/* Identifiers & Authorized Accounts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--sp-6)' }}>
        {/* Identifiers Table */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
          padding: 'var(--sp-5)',
        }}>
          <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-4)' }}>
            Registered Legal Identifiers
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {identifiers.map(id => (
              <div
                key={id.value}
                style={{
                  padding: 'var(--sp-3)', background: 'var(--canvas)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-control)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)' }}>
                    {id.class}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                    {id.value}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: 2 }}>
                    Issuer: {id.issuer}
                  </div>
                </div>
                <StatusChip status="VERIFIED" label="Registry Bound" />
              </div>
            ))}
          </div>
        </div>

        {/* Authorized Verifiers */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
          padding: 'var(--sp-5)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
            <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink)' }}>
              Authorized Verification Officers
            </h2>
            <span style={{ fontSize: '10px', color: 'var(--muted)', background: 'var(--canvas)', padding: '2px 6px', borderRadius: 2 }}>
              Dual-Party Grant Rule
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {verifiers.map(v => (
              <div
                key={v.email}
                style={{
                  padding: 'var(--sp-3)', background: 'var(--canvas)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-control)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)' }}>
                    {v.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                    {v.email}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: 2 }}>
                    Role: {v.role} · Authorized: {v.granted}
                  </div>
                </div>
                <StatusChip status="VERIFIED" label="Authorized" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
