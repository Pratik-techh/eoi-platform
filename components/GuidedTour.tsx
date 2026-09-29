'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export interface TourStep {
  step: number
  title: string
  roleName: string
  roleIcon: string
  email: string
  path: string
  insight: string
  judgePitch: string
}

export const TOUR_STEPS: TourStep[] = [
  {
    step: 0,
    title: '1. The National Outcome Crisis',
    roleName: 'Government Analyst (Priya Sharma)',
    roleIcon: '🏛️',
    email: 'gov.analyst@eoi.demo',
    path: '/gov/dashboard',
    insight: 'National overview: 10,000 enrolled across schemes, but only 3,120 reached verified employment. 68.8% outcome leakage.',
    judgePitch: '"Government cannot manage what it cannot verify. This dashboard reveals the true employment gap."',
  },
  {
    step: 1,
    title: '2. Statistical Leakage Outlier Engine',
    roleName: 'Government Analyst (Priya Sharma)',
    roleIcon: '🏛️',
    email: 'gov.analyst@eoi.demo',
    path: '/gov/leakage',
    insight: 'Statistical IQR / z-score anomaly detection catches Rajasthan Software Engineering reporting 92% placement but only 22% verified (z = 2.94).',
    judgePitch: '"Instead of manual audits, statistical anomaly detection automatically flags fraudulent agency cohorts."',
  },
  {
    step: 2,
    title: '3. Agency Reports Placement Claim',
    roleName: 'Training Agency (Apex Institute)',
    roleIcon: '🏫',
    email: 'agency.officer@eoi.demo',
    path: '/agency/employment/report',
    insight: 'Apex Institute reports that student Arjun Singh was placed at Google India with ₹1,50,000/mo. But agency cannot verify itself.',
    judgePitch: '"Under Principle P1, the agency reports the claim, but CANNOT verify its own placement. Truth is segregated."',
  },
  {
    step: 3,
    title: '4. Independent Employer Verification',
    roleName: 'Employer Verifier (Google India)',
    roleIcon: '🏢',
    email: 'employer.verifier@eoi.demo',
    path: '/employer/verification',
    insight: 'Google India logs into its own authorized portal to Confirm, Reject, or Request Correction on Arjun\'s placement.',
    judgePitch: '"Zero Single Stakeholder Truth: Only the verified enterprise employer can authenticate an employment record."',
  },
  {
    step: 4,
    title: '5. Student Employability Passport',
    roleName: 'Student (Arjun Singh)',
    roleIcon: '🎓',
    email: 'student.x@eoi.demo',
    path: '/student/passport',
    insight: 'Arjun receives an un-fakeable digital passport with cryptographic QR codes, proving his real training & verified salary trajectory.',
    judgePitch: '"Empowers candidates with portable, tamper-proof proof of career history that no fraudulent institute can fake."',
  },
  {
    step: 5,
    title: '6. Cryptographic SHA-256 Ledger',
    roleName: 'Government Auditor (Amit Verma)',
    roleIcon: '🛡️',
    email: 'gov.auditor@eoi.demo',
    path: '/gov/audit',
    insight: 'Every status transition is cryptographically signed and chained with SHA-256 hashes. Over 500 immutable event blocks.',
    judgePitch: '"No master admin can secretly alter history or delete records. True mathematical accountability."',
  },
]

export function GuidedTour() {
  const router = useRouter()
  const pathname = usePathname()
  const [active, setActive] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [switching, setSwitching] = useState(false)

  // Sync state from localStorage on mount and listen to custom event
  useEffect(() => {
    try {
      const storedActive = localStorage.getItem('eoi_tour_active')
      const storedStep = localStorage.getItem('eoi_tour_step')
      if (storedActive === 'true') {
        setActive(true)
        if (storedStep) setCurrentStepIdx(parseInt(storedStep, 10) || 0)
      }
    } catch {}

    function handleEventStart() {
      setActive(true)
      setMinimized(false)
      setCurrentStepIdx(0)
    }
    window.addEventListener('start-guided-tour', handleEventStart)
    return () => window.removeEventListener('start-guided-tour', handleEventStart)
  }, [])

  async function handleStartTour() {
    setSwitching(true)
    setActive(true)
    setMinimized(false)
    setCurrentStepIdx(0)
    try {
      localStorage.setItem('eoi_tour_active', 'true')
      localStorage.setItem('eoi_tour_step', '0')
    } catch {}

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'gov.analyst@eoi.demo', password: 'Demo@EOI2026' }),
      })
      if (res.ok) {
        window.location.href = '/gov/dashboard'
        return
      }
    } catch {}
    setSwitching(false)
  }

  // If not active, render a prominent persistent floating launcher button
  if (!active) {
    return (
      <>
        {/* Desktop: full pill button */}
        <div className="tour-float-desktop" style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
        }}>
          <button
            id="global-floating-tour-btn"
            onClick={handleStartTour}
            className="hover-lift"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#FFFFFF',
              border: '2px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: switching ? 'wait' : 'pointer',
              boxShadow: '0 8px 30px rgba(217, 119, 6, 0.5)',
              transition: 'all 0.2s ease',
              fontFamily: 'var(--font-ui)',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '18px' }}>🎬</span>
            <span>{switching ? 'Launching…' : 'Start 3-Minute Story Tour'}</span>
            <span style={{
              background: 'rgba(0, 0, 0, 0.25)',
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              Evaluator Mode
            </span>
          </button>
        </div>
        {/* Mobile: compact icon-only FAB */}
        <div className="tour-float-mobile" style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 9999,
        }}>
          <button
            id="global-floating-tour-btn-mobile"
            onClick={handleStartTour}
            aria-label="Start 3-Minute Story Tour"
            style={{
              width: 52,
              height: 52,
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#FFFFFF',
              border: '2px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '50%',
              fontSize: '22px',
              cursor: switching ? 'wait' : 'pointer',
              boxShadow: '0 4px 20px rgba(217, 119, 6, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {switching ? '⏳' : '🎬'}
          </button>
        </div>
      </>
    )
  }

  const current: TourStep = TOUR_STEPS[currentStepIdx] ?? (TOUR_STEPS[0] as TourStep)
  const isFirst = currentStepIdx === 0
  const isLast = currentStepIdx === TOUR_STEPS.length - 1

  async function goToStep(idx: number) {
    if (idx < 0 || idx >= TOUR_STEPS.length) return
    const target = TOUR_STEPS[idx]
    if (!target) return
    setSwitching(true)
    setCurrentStepIdx(idx)
    try {
      localStorage.setItem('eoi_tour_step', idx.toString())
    } catch {}

    try {
      // Auto-switch account
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: target.email, password: 'Demo@EOI2026' }),
      })
      if (res.ok) {
        window.location.href = target.path
      } else {
        setSwitching(false)
      }
    } catch {
      setSwitching(false)
    }
  }

  function handleClose() {
    setActive(false)
    try {
      localStorage.setItem('eoi_tour_active', 'false')
    } catch {}
  }

  if (minimized) {
    return (
      <div style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
      }}>
        <button
          onClick={() => setMinimized(false)}
          className="hover-lift"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 16px',
            background: 'linear-gradient(135deg, #091728 0%, #1D4E89 100%)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '999px',
            boxShadow: '0 8px 24px rgba(14, 31, 51, 0.35)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <span>🎬</span>
          <span>Resume Tour: Step {currentStepIdx + 1}/6</span>
        </button>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      maxWidth: 440,
      width: 'calc(100vw - 40px)',
      background: 'rgba(9, 23, 40, 0.96)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      color: '#FFFFFF',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '16px',
      padding: '18px 20px',
      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.45)',
      zIndex: 9999,
      fontFamily: 'var(--font-ui)',
      animation: 'slideUp 0.2s ease-out',
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: '10px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '2px 8px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #1D4E89 100%)',
            color: '#FFFFFF',
          }}>
            🎬 3-Minute Story Tour
          </span>
          <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
            Step {currentStepIdx + 1} of {TOUR_STEPS.length}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => setMinimized(true)}
            title="Minimize Tour"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '2px 6px',
            }}
          >
            _
          </button>
          <button
            onClick={handleClose}
            title="Exit Tour"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '2px 6px',
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Step Title & Persona Badge */}
      <div style={{ marginBottom: 10 }}>
        <h4 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 6px', color: '#F8FAFC' }}>
          {current.title}
        </h4>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '11px',
          color: '#38BDF8',
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          padding: '2px 8px',
          borderRadius: '6px',
        }}>
          <span>{current.roleIcon}</span>
          <span>{current.roleName}</span>
        </div>
      </div>

      {/* Context Insight */}
      <p style={{
        fontSize: '12px',
        color: '#CBD5E1',
        lineHeight: 1.5,
        margin: '0 0 10px',
      }}>
        {current.insight}
      </p>

      {/* Judge Pitch Box */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.12)',
        borderLeft: '3px solid #F59E0B',
        padding: '8px 10px',
        borderRadius: '0 6px 6px 0',
        marginBottom: 14,
        fontSize: '11px',
        color: '#FDE68A',
        lineHeight: 1.4,
      }}>
        <strong>💡 Pitch to Judges:</strong> {current.judgePitch}
      </div>

      {/* Step Progress Indicators */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
        {TOUR_STEPS.map((_, i) => (
          <div
            key={i}
            onClick={() => goToStep(i)}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: i <= currentStepIdx ? '#38BDF8' : 'rgba(255, 255, 255, 0.15)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title={`Go to Step ${i + 1}`}
          />
        ))}
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <button
          onClick={() => goToStep(currentStepIdx - 1)}
          disabled={isFirst || switching}
          style={{
            padding: '7px 12px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: isFirst ? '#475569' : '#E2E8F0',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: isFirst || switching ? 'not-allowed' : 'pointer',
          }}
        >
          ◀ Previous
        </button>

        {isLast ? (
          <button
            onClick={handleClose}
            className="hover-lift"
            style={{
              flex: 1,
              padding: '7px 14px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              border: 'none',
              color: '#FFFFFF',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
            }}
          >
            🎉 Finish Tour & Explore
          </button>
        ) : (
          <button
            onClick={() => goToStep(currentStepIdx + 1)}
            disabled={switching}
            className="hover-lift"
            style={{
              flex: 1,
              padding: '7px 14px',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4E89 100%)',
              border: 'none',
              color: '#FFFFFF',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: switching ? 'wait' : 'pointer',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            {switching ? (
              <span>Switching Persona…</span>
            ) : (
              <>
                <span>Next Step ▶</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
