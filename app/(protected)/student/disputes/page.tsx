'use client'

import { useState } from 'react'
import { StatusChip } from '@/components/StatusChip'

export default function StudentDisputesPage() {
  const [disputeType, setDisputeType] = useState('EMPLOYMENT')
  const [reason, setReason] = useState('')
  const [disputes, setDisputes] = useState([
    {
      id: 'disp-01',
      date: '2026-08-05',
      type: 'INCORRECT_ROLE',
      detail: 'Initial placement role reported as Support Engineer instead of Software Engineer.',
      status: 'RESOLVED',
      outcome: 'Training agency updated and employer confirmed correct Software Engineer role.',
    },
  ])
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newDispute = {
      id: `disp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]!,
      type: disputeType,
      detail: reason,
      status: 'PENDING',
      outcome: 'Under independent review by agency officer and platform auditor.',
    }
    setDisputes([newDispute, ...disputes])
    setSuccessMsg('Dispute logged into immutable ledger. All prior records remain preserved.')
    setReason('')
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Disputes & Record Corrections</h1>
            <p className="page-header__description">
              Contest incorrect training, assessment, or employment submissions · History is preserved, never destroyed (MASTER_PROMPT §8.3)
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div style={{
          padding: 'var(--sp-4)', background: 'var(--chip-verified-bg)', border: '1px solid var(--chip-verified-border)',
          borderRadius: 'var(--r-container)', fontSize: 'var(--text-sm)', color: 'var(--verified)', marginBottom: 'var(--sp-6)',
        }}>
          {successMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--sp-6)' }}>
        {/* Raise Dispute Form */}
        <form onSubmit={handleSubmit} style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
          padding: 'var(--sp-6)',
        }}>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-4)' }}>
            Raise a Record Dispute
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                Dispute Subject
              </label>
              <select
                value={disputeType}
                onChange={e => setDisputeType(e.target.value)}
                style={{
                  width: '100%', padding: 'var(--sp-2) var(--sp-3)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', background: 'var(--surface)',
                }}
              >
                <option value="EMPLOYMENT">Dispute Employment Report / Designation</option>
                <option value="ASSESSMENT">Dispute Assessment Evaluation Score</option>
                <option value="TRAINING">Dispute Attendance / Cohort Completion</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                Factual Evidence & Explanation *
              </label>
              <textarea
                rows={4}
                required
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="State the discrepancy clearly (e.g. correct job designation, date of offer, or assessment component)…"
                style={{
                  width: '100%', padding: 'var(--sp-2)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-control)', fontSize: 'var(--text-xs)', background: 'var(--surface)',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: 'var(--sp-3)', background: 'var(--disputed)', color: 'white', border: 'none',
                borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-ui)',
              }}
            >
              Submit Dispute to Audit Ledger →
            </button>
          </div>
        </form>

        {/* Dispute History */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
          padding: 'var(--sp-6)',
        }}>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-4)' }}>
            Dispute Trail & Status
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {disputes.map(d => (
              <div
                key={d.id}
                style={{
                  padding: 'var(--sp-4)', background: 'var(--canvas)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-control)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink)' }}>
                    {d.type.replace(/_/g, ' ')}
                  </span>
                  <StatusChip status={d.status === 'RESOLVED' ? 'VERIFIED' : 'PENDING'} label={d.status} />
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', margin: '4px 0' }}>
                  {d.detail}
                </p>
                <div style={{ fontSize: '11px', color: 'var(--ink)', borderTop: '1px solid var(--line)', paddingTop: 4, marginTop: 4 }}>
                  <strong>Outcome:</strong> {d.outcome}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
