'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ForbiddenContent() {
  const searchParams = useSearchParams()
  const attempted = searchParams.get('attempted') ?? 'the requested resource'
  const redirect = searchParams.get('redirect') ?? '/demo'

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
        maxWidth: 520,
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
          403 — Unauthorized Access
        </h1>

        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.5, marginBottom: 'var(--sp-4)' }}>
          Your current authenticated persona does not have clearance to view:
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
          <Link
            href={redirect}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            <span>Return to Your Authorized Portal →</span>
          </Link>

          <Link
            href="/demo"
            className="btn-secondary"
            style={{ width: '100%', borderColor: 'var(--primary)', color: 'var(--primary)' }}
          >
            <span>⚡ Switch Persona in Evaluator Demo</span>
          </Link>
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
