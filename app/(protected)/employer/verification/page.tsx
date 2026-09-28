'use client'

import { useState, useEffect } from 'react'
import { StatusChip } from '@/components/StatusChip'
import type { EmploymentOutcome } from '@/lib/db/store'

export default function EmployerVerificationPage() {
  const [queue, setQueue] = useState<EmploymentOutcome[]>([])
  const [selectedOutcome, setSelectedOutcome] = useState<EmploymentOutcome | null>(null)
  const [actionType, setActionType] = useState<'CONFIRM' | 'REJECT' | 'CORRECTION' | null>(null)
  const [reason, setReason] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusAlert, setStatusAlert] = useState<string | null>(null)

  useEffect(() => {
    async function loadQueue() {
      const res = await fetch('/api/employer/verification/queue')
      if (res.ok) {
        const json = await res.json()
        setQueue(json.queue ?? [])
      }
    }
    loadQueue()
  }, [])

  async function handleExecuteAction() {
    if (!selectedOutcome || !actionType) return
    setIsProcessing(true)

    const endpoint =
      actionType === 'CONFIRM'
        ? selectedOutcome.employment_status === 'UNEMPLOYMENT_REPORTED'
          ? '/api/employer/verification/confirm-unemployment'
          : '/api/employer/verification/confirm'
        : actionType === 'REJECT'
        ? '/api/employer/verification/reject'
        : '/api/employer/verification/correction'

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        outcomeId: selectedOutcome.id,
        reason,
      }),
    })

    setIsProcessing(false)
    if (res.ok) {
      const msg =
        actionType === 'CONFIRM'
          ? selectedOutcome.employment_status === 'UNEMPLOYMENT_REPORTED'
            ? 'Departure reconciled and verified. State transitioned to VERIFIED_UNEMPLOYED in immutable ledger.'
            : 'Employment confirmed. Outcome transitioned to VERIFIED_EMPLOYED.'
          : actionType === 'REJECT'
          ? 'Outcome rejected. Candidate flagged as REJECTED in audit trail.'
          : 'Correction requested and sent to training agency inbox.'

      setStatusAlert(msg)
      setSelectedOutcome(null)
      setActionType(null)
      setReason('')

      // Refresh queue
      const qRes = await fetch('/api/employer/verification/queue')
      if (qRes.ok) {
        const json = await qRes.json()
        setQueue(json.queue ?? [])
      }
    }
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Employment Verification Queue</h1>
            <p className="page-header__description">
              Google India Pvt. Ltd. · Enterprise Verification Authority · Actions execute atomic ledger transitions
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <StatusChip status="PENDING" label={`${queue.length} Awaiting Verification`} />
          </div>
        </div>
      </div>

      {/* Enterprise Verification Authority & Role Banner */}
      <div style={{
        padding: 'var(--sp-3) var(--sp-4)', background: 'var(--canvas)',
        border: '1px solid var(--line)', borderRadius: 'var(--r-control)',
        fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 'var(--sp-4)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-2)'
      }}>
        <span>
          <strong>Authority Context:</strong> Operating under Enterprise Partner ID <code>org-google-01</code>. Verification decisions execute atomic transitions appended directly to the SHA-256 event ledger.
        </span>
        <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>
          Dual-Party Delegation Active (Kavya Reddy / Siddharth Iyer)
        </span>
      </div>

      {statusAlert && (
        <div style={{
          padding: 'var(--sp-4)', background: 'var(--chip-verified-bg)', border: '1px solid var(--chip-verified-border)',
          borderRadius: 'var(--r-container)', fontSize: 'var(--text-sm)', color: 'var(--verified)', marginBottom: 'var(--sp-6)',
        }}>
          {statusAlert}
        </div>
      )}

      {/* Verification Queue List */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)', overflow: 'hidden' }}>
        <div style={{
          padding: 'var(--sp-3) var(--sp-4)', background: 'var(--canvas)', borderBottom: '1px solid var(--line)',
          fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--muted)',
        }}>
          ACTIVE VERIFICATION & RECONCILIATION REQUESTS
        </div>

        {queue.length === 0 ? (
          <div style={{ padding: 'var(--sp-8)', textAlign: 'center', color: 'var(--muted)', fontSize: 'var(--text-sm)' }}>
            All verification requests have been processed. Queue is clean.
          </div>
        ) : (
          <div>
            {queue.map(item => {
              const isUnemployment = item.employment_status === 'UNEMPLOYMENT_REPORTED'

              return (
                <div
                  key={item.id}
                  style={{
                    padding: 'var(--sp-4)', borderBottom: '1px solid var(--line)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-4)',
                    background: isUnemployment ? '#FFFBEB' : 'var(--surface)',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                      <span style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)' }}>
                        {item.job_role}
                      </span>
                      {isUnemployment ? (
                        <span style={{
                          fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: 2,
                          background: 'var(--chip-pending-bg)', color: 'var(--pending)', border: '1px solid var(--chip-pending-border)',
                        }}>
                          UNEMPLOYMENT RECONCILIATION
                        </span>
                      ) : (
                        <StatusChip status="PENDING" label="New Hire Confirmation" />
                      )}
                    </div>

                    <div style={{
                      display: 'flex', gap: 'var(--sp-4)', marginTop: 4,
                      fontSize: 'var(--text-xs)', color: 'var(--muted)', fontFamily: 'var(--font-mono)',
                    }}>
                      <span>Candidate: {item.eoi_student_id}</span>
                      <span>Joined: {item.start_date}</span>
                      {item.end_date && <span>Reported Departure: {item.end_date}</span>}
                    </div>

                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4 }}>
                      Reporting Agency: Delhi Skill Development Institute (ag-delhi-01) · Idempotency Ref: <code>{item.id}</code>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                    <button
                      id={`confirm-${item.id}`}
                      onClick={() => { setSelectedOutcome(item); setActionType('CONFIRM') }}
                      style={{
                        padding: '6px var(--sp-4)', background: 'var(--verified)', color: 'white',
                        border: 'none', borderRadius: 'var(--r-control)', fontSize: 'var(--text-xs)', fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'var(--font-ui)',
                      }}
                    >
                      {isUnemployment ? 'Confirm Departure' : 'Confirm Employment'}
                    </button>
                    {!isUnemployment && (
                      <>
                        <button
                          onClick={() => { setSelectedOutcome(item); setActionType('CORRECTION') }}
                          style={{
                            padding: '6px var(--sp-3)', background: 'var(--surface)', color: 'var(--pending)',
                            border: '1px solid var(--chip-pending-border)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-xs)', fontWeight: 600,
                            cursor: 'pointer', fontFamily: 'var(--font-ui)',
                          }}
                        >
                          Request Correction
                        </button>
                        <button
                          onClick={() => { setSelectedOutcome(item); setActionType('REJECT') }}
                          style={{
                            padding: '6px var(--sp-3)', background: 'var(--surface)', color: 'var(--disputed)',
                            border: '1px solid var(--chip-disputed-border)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-xs)', fontWeight: 600,
                            cursor: 'pointer', fontFamily: 'var(--font-ui)',
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Confirmation / Action Dialog */}
      {selectedOutcome && actionType && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(14,31,51,0.5)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-4)',
        }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
            width: '100%', maxWidth: '500px', padding: 'var(--sp-6)',
          }}>
            <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-3)' }}>
              {actionType === 'CONFIRM'
                ? selectedOutcome.employment_status === 'UNEMPLOYMENT_REPORTED'
                  ? 'Confirm Employee Departure (Reconciliation)'
                  : 'Confirm Verified Employment'
                : actionType === 'REJECT'
                ? 'Reject Employment Report'
                : 'Request Correction from Training Agency'}
            </h2>

            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 'var(--sp-4)', lineHeight: 1.5 }}>
              Candidate: <strong>{selectedOutcome.eoi_student_id}</strong> · Role: <strong>{selectedOutcome.job_role}</strong>
              <br />
              This decision will write an immutable SHA-256 hash-chained event to the audit ledger signed by your authenticated enterprise verifier credentials.
            </p>

            {(actionType === 'REJECT' || actionType === 'CORRECTION') && (
              <div style={{ marginBottom: 'var(--sp-4)' }}>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                  Reason / Clarification Notes *
                </label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Provide precise explanation for rejection or correction request…"
                  style={{
                    width: '100%', padding: 'var(--sp-2)', border: '1px solid var(--line)',
                    borderRadius: 'var(--r-control)', fontSize: 'var(--text-xs)', background: 'var(--surface)',
                  }}
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-2)' }}>
              <button
                onClick={() => { setSelectedOutcome(null); setActionType(null) }}
                style={{
                  padding: '6px var(--sp-4)', background: 'var(--canvas)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-control)', fontSize: 'var(--text-xs)', cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                id="execute-verification-action"
                disabled={isProcessing || ((actionType === 'REJECT' || actionType === 'CORRECTION') && !reason.trim())}
                onClick={handleExecuteAction}
                style={{
                  padding: '6px var(--sp-4)',
                  background: actionType === 'CONFIRM' ? 'var(--verified)' : actionType === 'REJECT' ? 'var(--disputed)' : 'var(--pending)',
                  color: 'white', border: 'none', borderRadius: 'var(--r-control)', fontSize: 'var(--text-xs)', fontWeight: 600,
                  cursor: isProcessing ? 'wait' : 'pointer', fontFamily: 'var(--font-ui)',
                }}
              >
                {isProcessing ? 'Writing to ledger…' : 'Confirm & Sign Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
