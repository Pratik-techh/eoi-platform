'use client'

import { useState, useEffect } from 'react'
import { StatusChip } from '@/components/StatusChip'
import { TrajectoryTimeline } from '@/components/TrajectoryTimeline'
import type { EmploymentOutcome } from '@/lib/db/store'

export default function StudentDashboardPage() {
  const [outcomes, setOutcomes] = useState<EmploymentOutcome[]>([])
  const [showUnemploymentModal, setShowUnemploymentModal] = useState(false)
  const [unemploymentReason, setUnemploymentReason] = useState('Resigned to pursue higher education / advanced certification')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)

  useEffect(() => {
    loadOutcomes()
  }, [])

  async function loadOutcomes() {
    const res = await fetch('/api/student/outcomes')
    if (res.ok) {
      const json = await res.json()
      setOutcomes(json.outcomes ?? [])
    }
  }

  const currentEmployment = outcomes[0] ?? null
  const isVerifiedEmployed = currentEmployment?.employment_status === 'VERIFIED_EMPLOYED'

  async function handleReportUnemployment() {
    setIsSubmitting(true)
    const res = await fetch('/api/student/report-unemployment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: unemploymentReason }),
    })

    setIsSubmitting(false)
    if (res.ok) {
      setShowUnemploymentModal(false)
      setAlertMessage('Departure reported. Status updated to UNEMPLOYMENT_REPORTED. Reconciliation notice routed to Google India Pvt. Ltd. Your prior verified employment remains permanently recorded in your history.')
      await loadOutcomes()
    }
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Arjun Singh (Student X)</h1>
            <p className="page-header__description">
              Learner Outcome Profile · EOI Student ID: <code>EOI-S-HERO-0001</code> · Full Stack Web Development
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <StatusChip status="VERIFIED" label="Verified Identity" />
          </div>
        </div>
      </div>

      {alertMessage && (
        <div style={{
          padding: 'var(--sp-4)', background: 'var(--chip-pending-bg)', border: '1px solid var(--chip-pending-border)',
          borderRadius: 'var(--r-container)', fontSize: 'var(--text-sm)', color: 'var(--pending)', marginBottom: 'var(--sp-6)',
        }}>
          {alertMessage}
        </div>
      )}

      {/* Primary Hero Card: CURRENT EMPLOYMENT (MASTER_PROMPT §8.3) */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
        padding: 'var(--sp-6)', marginBottom: 'var(--sp-6)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.05em' }}>
            ACTIVE EMPLOYMENT STATUS
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <StatusChip
              status={currentEmployment?.employment_status ?? 'VERIFIED_EMPLOYED'}
              label={
                currentEmployment?.employment_status === 'VERIFIED_EMPLOYED'
                  ? 'Employer Verified'
                  : currentEmployment?.employment_status === 'UNEMPLOYMENT_REPORTED'
                  ? 'Unemployment Reported — Pending Verification'
                  : currentEmployment?.employment_status === 'VERIFIED_UNEMPLOYED'
                  ? 'Verified Unemployed'
                  : 'Pending'
              }
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--ink)' }}>
              {currentEmployment?.job_role ?? 'Software Engineer'}
            </h2>
            <div style={{ fontSize: 'var(--text-md)', color: 'var(--primary)', fontWeight: 600, marginTop: 2 }}>
              Google India Pvt. Ltd.
            </div>
            <div style={{
              display: 'flex', gap: 'var(--sp-4)', marginTop: 'var(--sp-3)',
              fontSize: 'var(--text-xs)', color: 'var(--muted)', fontFamily: 'var(--font-mono)',
            }}>
              <span>Joined: 12 Aug 2026</span>
              <span>Type: Full-Time</span>
              <span>Location: Bengaluru</span>
              <span>Legal Entity CIN: U72200KA2004FTC033590</span>
            </div>
          </div>

          {/* Report Unemployment Button */}
          {isVerifiedEmployed && (
            <button
              id="report-unemployment-button"
              onClick={() => setShowUnemploymentModal(true)}
              style={{
                padding: '8px var(--sp-4)', background: 'var(--surface)', color: 'var(--disputed)',
                border: '1px solid var(--chip-disputed-border)', borderRadius: 'var(--r-control)',
                fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)',
              }}
            >
              Report unemployment / departure
            </button>
          )}
        </div>
      </div>

      {/* Trajectory Timeline Component */}
      <TrajectoryTimeline
        outcomes={outcomes}
        studentName="Arjun Singh"
        studentId="EOI-S-HERO-0001"
      />

      {/* Report Unemployment Confirmation Dialog */}
      {showUnemploymentModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(14,31,51,0.5)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-4)',
        }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
            width: '100%', maxWidth: '500px', padding: 'var(--sp-6)',
          }}>
            <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-3)' }}>
              Report End of Employment
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 'var(--sp-4)', lineHeight: 1.5 }}>
              Register your departure from <strong>Google India Pvt. Ltd.</strong>. Your prior verified tenure (12 Aug 2026 to present) will <strong>never be deleted or overwritten</strong>. It remains part of your permanent Employability Passport.
            </p>

            <div style={{ marginBottom: 'var(--sp-4)' }}>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                Reason for Departure (Optional)
              </label>
              <textarea
                rows={2}
                value={unemploymentReason}
                onChange={e => setUnemploymentReason(e.target.value)}
                style={{
                  width: '100%', padding: 'var(--sp-2)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-control)', fontSize: 'var(--text-xs)', background: 'var(--surface)',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-2)' }}>
              <button
                onClick={() => setShowUnemploymentModal(false)}
                style={{
                  padding: '6px var(--sp-4)', background: 'var(--canvas)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-control)', fontSize: 'var(--text-xs)', cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                id="confirm-report-unemployment"
                disabled={isSubmitting}
                onClick={handleReportUnemployment}
                style={{
                  padding: '6px var(--sp-4)', background: 'var(--disputed)', color: 'white', border: 'none',
                  borderRadius: 'var(--r-control)', fontSize: 'var(--text-xs)', fontWeight: 600,
                  cursor: isSubmitting ? 'wait' : 'pointer', fontFamily: 'var(--font-ui)',
                }}
              >
                {isSubmitting ? 'Updating trajectory…' : 'Confirm Departure'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
