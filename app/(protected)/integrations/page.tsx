import type { Metadata } from 'next'
import { StatusChip } from '@/components/StatusChip'

export const metadata: Metadata = {
  title: 'External System Integrations | Planned Architecture',
  description: 'Planned external API adapters (SIDH, NCS, e-Shram, EPFO, ESIC, MCA Registries, Employer HRIS)',
}

export default function IntegrationsPage() {
  const adapters = [
    {
      name: 'SIDH (Skill India Digital Hub)',
      purpose: 'Bidirectional sync of certified training completion transcripts & assessment credentials',
      contract: 'SIDHAdapter.fetchTraineeSkillRecords()',
      status: 'Planned integration — not connected',
      chipStatus: 'PENDING',
    },
    {
      name: 'NCS (National Career Service)',
      purpose: 'Live ingestion of regional vacancies to benchmark curriculum demand',
      contract: 'NCSAdapter.fetchJobPostings()',
      status: 'Planned integration — not connected',
      chipStatus: 'PENDING',
    },
    {
      name: 'e-Shram Portal',
      purpose: 'Verification of informal sector apprenticeship and unorganized worker registry',
      contract: 'EShramAdapter.verifyUnorganizedSectorRegistration()',
      status: 'Planned integration — not connected',
      chipStatus: 'PENDING',
    },
    {
      name: 'EPFO (Employees’ Provident Fund Organisation)',
      purpose: 'Automated verification of active monthly provident fund contribution compliance',
      contract: 'EPFOAdapter.verifyEstablishmentIdentifier()',
      status: 'Planned integration — not connected',
      chipStatus: 'PENDING',
    },
    {
      name: 'ESIC (Employees’ State Insurance Corporation)',
      purpose: 'Verification of insured person IP contribution for healthcare and wage verification',
      contract: 'ESICAdapter.verifyInsuredPerson()',
      status: 'Planned integration — not connected',
      chipStatus: 'PENDING',
    },
    {
      name: 'MCA Org Registry (CIN / LLPIN)',
      purpose: 'Automated statutory legal entity verification against Ministry of Corporate Affairs',
      contract: 'OrgRegistryAdapter.verifyCinRegistry()',
      status: 'Planned integration — not connected',
      chipStatus: 'PENDING',
    },
    {
      name: 'Employer HRIS / Payroll Systems',
      purpose: 'Webhook-driven enterprise confirmation of employee start dates and departure notifications',
      contract: 'EmployerSystemAdapter.queryHrisPayrollStatus()',
      status: 'Planned integration — not connected',
      chipStatus: 'PENDING',
    },
  ]

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">External Government & Industry Integrations</h1>
            <p className="page-header__description">
              Architecture specifications for national skilling and enterprise workforce adapters (MASTER_PROMPT §16)
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory Honesty in UI Banner (Operating Rule 6) */}
      <div style={{
        padding: 'var(--sp-4)', background: 'var(--chip-pending-bg)', border: '1px solid var(--chip-pending-border)',
        borderRadius: 'var(--r-container)', fontSize: 'var(--text-xs)', color: 'var(--pending)', marginBottom: 'var(--sp-6)',
        lineHeight: 1.5,
      }}>
        <strong>Integrity & Honesty Notice:</strong> The prototype operates on synthetic data only and does not maintain live connections to production government registries. All future integration adapters are architected behind typed interfaces in <code>lib/adapters/</code> and return <code>NOT_CONNECTED</code>.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
        {adapters.map(a => (
          <div
            key={a.name}
            style={{
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
              padding: 'var(--sp-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--sp-3)',
            }}
          >
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)' }}>
                  {a.name}
                </h2>
                <StatusChip status="PENDING" label="Planned — Not Connected" />
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4 }}>
                {a.purpose}
              </p>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--primary)', marginTop: 4 }}>
                Contract Interface: <code>{a.contract}</code>
              </div>
            </div>

            <span style={{
              fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--r-control)',
              background: 'var(--canvas)', border: '1px solid var(--line)', color: 'var(--muted)',
            }}>
              Stub Status: <code>NOT_CONNECTED</code>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
