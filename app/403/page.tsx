'use client'

import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'

function ForbiddenContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const attempted = searchParams.get('attempted') ?? 'the requested resource'
  const redirect = searchParams.get('redirect') ?? '/gov/dashboard'
  const [switching, setSwitching] = useState(false)

  const matchPersona = (() => {
    if (attempted.startsWith('/student')) {
      return { role: 'Student', name: 'Arjun Singh', email: 'student.x@eoi.demo', color: '#10B981' }
    }
    if (attempted.startsWith('/employer')) {
      return { role: 'Employer', name: 'Kavya Reddy (Google India)', email: 'employer.verifier@eoi.demo', color: '#2563EB' }
    }
    if (attempted.startsWith('/agency')) {
      return { role: 'Training Agency', name: 'Rajesh Kumar (Apex)', email: 'agency.officer@eoi.demo', color: '#D97706' }
    }
    if (attempted.startsWith('/gov')) {
      return { role: 'Government Analyst', name: 'Priya Sharma', email: 'gov.analyst@eoi.demo', color: '#1D4E89' }
    }
    if (attempted.startsWith('/platform')) {
      return { role: 'Security Officer', name: 'Vikram Rao', email: 'security.officer@eoi.demo', color: '#6B7280' }
    }
    return null
  })()

  async function handleAutoSwitch() {
    if (!matchPersona) return
    setSwitching(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: matchPersona.email, password: 'Demo@EOI2026' }),
      })
      if (res.ok) {
        window.location.href = attempted
      } else {
        setSwitching(false)
      }
    } catch {
      setSwitching(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--canvas)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--sp-6)',
      fontFamily: 'var(--font-ui)',
    }}>
      <div style={{
        maxWidth: 540,
        width: '100%',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-container)',
        padding: 'var(--sp-8)',
        boxShadow: 'var(--shadow-card)',
        textAlign: 'center',
      }}>
        {/* Shield Icon */}
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--chip-rejected-bg)',
          border: '1px solid var(--chip-rejected-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--sp-4)',
          color: '#9F1239',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="M12 8v4M12 16h.01"/>
          </svg>
        </div>

        <div style={{
          display: 'inline-block',
          padding: '2px 10px',
          background: 'rgba(159, 18, 57, 0.08)',
          color: '#9F1239',
          borderRadius: '999px',
          fontSize: '11px',
          fontWeight: 700,
          marginBottom: 'var(--sp-2)',
        }}>
          SECURITY ENFORCEMENT: PRINCIPLE P1 & P2
        </div>

        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--ink)', marginBottom: 'var(--sp-2)' }}>
          403 — Unauthorized Persona
        </h1>

        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.5, marginBottom: 'var(--sp-4)' }}>
          Your current session does not have clearance to view:
        </p>

        <div style={{
          background: 'var(--canvas)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-control)',
          padding: 'var(--sp-2) var(--sp-3)',
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-mono)',
          color: 'var(--ink)',
          marginBottom: 'var(--sp-5)',
          wordBreak: 'break-all',
        }}>
          {attempted}
        </div>

        <div style={{
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 'var(--r-control)',
          padding: 'var(--sp-3)',
          textAlign: 'left',
          fontSize: '11px',
          color: '#92400E',
          lineHeight: 1.4,
          marginBottom: 'var(--sp-6)',
        }}>
          <strong>Zero Single Stakeholder Truth (P1):</strong> Training agencies cannot verify their own reports, students cannot edit verified records, and government analysts cannot rewrite history.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          {matchPersona && (
            <button
              onClick={handleAutoSwitch}
              disabled={switching}
              className="hover-lift"
              style={{
                width: '100%',
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--r-control)',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                cursor: switching ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7.5 1.5L2 8h4.5l-0.5 4.5L12 6H7.5l0.5-4.5z" fill="#FEF08A"/>
              </svg>
              <span>
                {switching
                  ? `Switching to ${matchPersona.role}…`
                  : `Switch to ${matchPersona.name} & Continue →`}
              </span>
            </button>
          )}

          <Link
            href={redirect}
            className="btn-primary"
            style={{ width: '100%', textAlign: 'center' }}
          >
            <span>Return to Your Authorized Portal →</span>
          </Link>

          <Link
            href="/demo"
            className="btn-secondary"
            style={{ width: '100%', textAlign: 'center', borderColor: 'var(--primary)', color: 'var(--primary)' }}
          >
            <span>⚡ Open Evaluator Demo Persona Switcher</span>
          </Link>

          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('start-guided-tour'))
            }}
            className="hover-lift"
            style={{
              width: '100%',
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--r-control)',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 2px 8px rgba(217, 119, 6, 0.35)',
            }}
          >
            <span>🎬</span>
            <span>Launch 3-Minute Guided Story Tour</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ForbiddenPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForbiddenContent />
    </Suspense>
  )
}
