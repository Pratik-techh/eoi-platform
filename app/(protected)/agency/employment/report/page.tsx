'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AgencyEmploymentReportPage() {
  const router = useRouter()
  const [studentId, setStudentId] = useState('EOI-S-HERO-0001')
  const [uan, setUan] = useState('100928172635')
  const [employerQuery, setEmployerQuery] = useState('Google India Pvt. Ltd.')
  const [idClass, setIdClass] = useState('CIN')
  const [idValue, setIdValue] = useState('U72200KA2004FTC033590')
  const [jobRole, setJobRole] = useState('Associate Cloud Engineer')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [wageBand, setWageBand] = useState('₹25,000 – ₹35,000')
  const [location, setLocation] = useState('Bengaluru')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [statutoryChecking, setStatutoryChecking] = useState(false)
  const [statutoryResult, setStatutoryResult] = useState<any | null>(null)

  async function handleCrossCheckStatutory() {
    setStatutoryChecking(true)
    setStatutoryResult(null)
    try {
      const res = await fetch('/api/integrations/verify-epfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: studentId,
          uan: uan.trim(),
          cin: idValue.trim(),
          wageMonth: '08/2026',
        }),
      })
      const data = await res.json()
      if (res.ok && data.result) {
        setStatutoryResult(data.result)
      } else {
        alert(data.error || 'Statutory check could not find matching records.')
      }
    } catch (e: any) {
      alert(`Statutory check failed: ${e.message}`)
    } finally {
      setStatutoryChecking(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    // Call report_employment endpoint
    const res = await fetch('/api/agency/employment/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId,
        employerName: employerQuery,
        idClass,
        idValue,
        jobRole,
        startDate,
        wageBand,
        location,
      }),
    })

    setIsSubmitting(false)
    if (res.ok) {
      setSuccessMessage('Employment outcome reported successfully. Outcome is in PENDING_VERIFICATION state awaiting enterprise employer confirmation. The agency cannot self-verify.')
      setTimeout(() => {
        router.push('/agency/inbox')
      }, 2500)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Report Employment Outcome</h1>
            <p className="page-header__description">
              Submit placement trajectory details · Routes automatically to enterprise employer for independent verification (MASTER_PROMPT §8.2)
            </p>
          </div>
        </div>
      </div>

      {/* Trust Notice */}
      <div style={{
        padding: 'var(--sp-3) var(--sp-4)', background: 'var(--chip-pending-bg)', border: '1px solid var(--chip-pending-border)',
        borderRadius: 'var(--r-container)', fontSize: 'var(--text-xs)', color: 'var(--pending)', marginBottom: 'var(--sp-6)',
      }}>
        <strong>No Self-Verification Policy (P1):</strong> Training agencies can report employment outcomes but cannot verify their own reports. Every reported record enters the status <code>PENDING_VERIFICATION</code> and is routed to the authorized employer account.
      </div>

      {successMessage && (
        <div style={{
          padding: 'var(--sp-4)', background: 'var(--chip-verified-bg)', border: '1px solid var(--chip-verified-border)',
          borderRadius: 'var(--r-container)', fontSize: 'var(--text-sm)', color: 'var(--verified)', marginBottom: 'var(--sp-6)',
        }}>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
        padding: 'var(--sp-6)', maxWidth: '720px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          {/* Candidate ID & EPFO UAN */}
          <div className="form-grid-2">
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                Candidate EOI Student ID *
              </label>
              <input
                type="text"
                required
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                placeholder="e.g. EOI-S-HERO-0001"
                style={{
                  width: '100%', padding: 'var(--sp-2) var(--sp-3)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', background: 'var(--surface)',
                  fontFamily: 'var(--font-mono)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                Candidate 12-Digit UAN (EPFO)
              </label>
              <input
                type="text"
                maxLength={12}
                value={uan}
                onChange={e => setUan(e.target.value)}
                placeholder="e.g. 100928172635"
                style={{
                  width: '100%', padding: 'var(--sp-2) var(--sp-3)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', background: 'var(--surface)',
                  fontFamily: 'var(--font-mono)',
                }}
              />
            </div>
          </div>

          {/* Instant Statutory Cross-Check Trigger & Live ECR Box */}
          <div style={{
            padding: 'var(--sp-3)',
            background: statutoryResult ? 'var(--chip-verified-bg)' : 'var(--surface-container-low)',
            border: `1px solid ${statutoryResult ? 'var(--chip-verified-border)' : 'var(--line)'}`,
            borderRadius: 'var(--r-control)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink)' }}>
                  Statutory Cross-Check (Automated Feasibility Engine)
                </div>
                <div style={{ fontSize: '10px', color: 'var(--muted)' }}>
                  Verify candidate UAN & employer CIN against live statutory registries before submitting.
                </div>
              </div>

              <button
                type="button"
                id="pre-verify-statutory-btn"
                onClick={handleCrossCheckStatutory}
                disabled={statutoryChecking}
                style={{
                  padding: '5px 12px',
                  background: 'var(--primary-accent)',
                  color: '#000000',
                  border: 'none',
                  borderRadius: 'var(--r-badge)',
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  cursor: statutoryChecking ? 'wait' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {statutoryChecking ? 'Cross-Checking...' : '⚡ Cross-Check EPFO / MCA'}
              </button>
            </div>

            {statutoryResult && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--line)', fontSize: '11px' }}>
                <div style={{ color: 'var(--verified)', fontWeight: 700, marginBottom: 2 }}>
                  ✓ Statutory ECR Remittance Verified: {statutoryResult.ecrReceipt?.trrn}
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '10px' }}>
                  Establishment: {statutoryResult.ecrReceipt?.establishmentName} · Wage Month: {statutoryResult.ecrReceipt?.wageMonth} · Member PF: ₹{statutoryResult.ecrReceipt?.memberPfContribution}
                </div>
              </div>
            )}
          </div>

          {/* Employer Search & Identifier */}
          <div className="form-grid-3">
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                Employer Legal Entity Name *
              </label>
              <input
                type="text"
                required
                value={employerQuery}
                onChange={e => setEmployerQuery(e.target.value)}
                placeholder="e.g. Google India Pvt. Ltd."
                style={{
                  width: '100%', padding: 'var(--sp-2) var(--sp-3)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', background: 'var(--surface)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                Identifier Class
              </label>
              <select
                value={idClass}
                onChange={e => setIdClass(e.target.value)}
                style={{
                  width: '100%', padding: 'var(--sp-2) var(--sp-3)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', background: 'var(--surface)',
                }}
              >
                <option value="CIN">CIN (MCA)</option>
                <option value="LLPIN">LLPIN</option>
                <option value="EPFO_ESTABLISHMENT_ID">EPFO ID</option>
                <option value="OTHER_AUTHORIZED">Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                Identifier Value *
              </label>
              <input
                type="text"
                required
                value={idValue}
                onChange={e => setIdValue(e.target.value)}
                placeholder="e.g. U72200KA2004FTC033590"
                style={{
                  width: '100%', padding: 'var(--sp-2) var(--sp-3)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', background: 'var(--surface)',
                  fontFamily: 'var(--font-mono)',
                }}
              />
            </div>
          </div>

          {/* Job Role & Start Date */}
          <div className="form-grid-2">
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                Designation / Job Role *
              </label>
              <input
                type="text"
                required
                value={jobRole}
                onChange={e => setJobRole(e.target.value)}
                placeholder="e.g. Software Engineer"
                style={{
                  width: '100%', padding: 'var(--sp-2) var(--sp-3)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', background: 'var(--surface)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                Joining Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                style={{
                  width: '100%', padding: 'var(--sp-2) var(--sp-3)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', background: 'var(--surface)',
                }}
              />
            </div>
          </div>

          {/* Wage Band & Location */}
          <div className="form-grid-2">
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                Monthly Compensation Band
              </label>
              <select
                value={wageBand}
                onChange={e => setWageBand(e.target.value)}
                style={{
                  width: '100%', padding: 'var(--sp-2) var(--sp-3)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', background: 'var(--surface)',
                }}
              >
                <option value="₹12,000 – ₹18,000">₹12,000 – ₹18,000</option>
                <option value="₹18,000 – ₹25,000">₹18,000 – ₹25,000</option>
                <option value="₹25,000 – ₹35,000">₹25,000 – ₹35,000</option>
                <option value="₹35,000+">₹35,000+</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                Workplace Location (City / District)
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru"
                style={{
                  width: '100%', padding: 'var(--sp-2) var(--sp-3)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', background: 'var(--surface)',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: 'var(--sp-2)', padding: '10px 16px', background: '#FFFFFF',
              color: '#000000', border: '1px solid #FFFFFF', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)',
              fontFamily: 'var(--font-mono)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
              cursor: isSubmitting ? 'wait' : 'pointer',
            }}
          >
            {isSubmitting ? 'Submitting to verification pipeline…' : 'Submit for Employer Independent Verification →'}
          </button>
        </div>
      </form>
    </div>
  )
}
