'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const router = useRouter()
  const [loggingIn, setLoggingIn] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('eoi_theme')
      if (saved === 'dark') setTheme('dark')
      else setTheme('light')
    } catch {}
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    try {
      localStorage.setItem('eoi_theme', nextTheme)
    } catch {}
    document.documentElement.setAttribute('data-theme', nextTheme)
    if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
    }
  }

  async function handleQuickLogin(email: string) {
    setLoggingIn(email)
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        const data = await res.json()
        router.push(data.redirectUrl || '/gov/dashboard')
      } else {
        router.push('/login')
      }
    } catch {
      router.push('/login')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--canvas)',
      color: 'var(--ink)',
      fontFamily: 'var(--font-ui)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Precision Command Header */}
      <header style={{
        background: '#080808',
        borderBottom: '1px solid #242424',
        padding: 'var(--sp-3) var(--sp-4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        gap: 'var(--sp-2)',
      }}>
        {/* Brand & Crest */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', minWidth: 0 }}>
          <div style={{
            width: 34,
            height: 34,
            background: '#0F0F0F',
            border: '1px solid #242424',
            borderRadius: 'var(--r-badge)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M4 16L8.5 10L12 13.5L16 7L18.5 11" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 'var(--text-base)', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                EOI Platform
              </span>
              <span style={{
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                padding: '1px 6px',
                background: '#151515',
                color: 'var(--muted)',
                borderRadius: 'var(--r-badge)',
                border: '1px solid #242424',
                flexShrink: 0,
              }}>
                SIH 2026
              </span>
            </div>
            <div className="landing-header-subtitle" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              National Employment Outcome Intelligence Layer · MSDE
            </div>
          </div>
        </div>

        {/* Desktop Nav Actions — hidden on mobile */}
        <div className="landing-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            background: '#0F0F0F',
            border: '1px solid #242424',
            borderRadius: 'var(--r-badge)',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 500,
            color: '#E2E8F0',
            whiteSpace: 'nowrap',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#18B6A4', boxShadow: '0 0 6px rgba(24, 182, 164, 0.45)', flexShrink: 0 }} />
            <span>SHA-256 Ledger: 502 Blocks</span>
          </div>

          <a
            href="/EOI_Platform_User_Manual_and_Guide.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              background: '#0F0F0F',
              border: '1px solid #333333',
              borderRadius: 'var(--r-badge)',
              color: '#FFFFFF',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
            }}
          >
            <span>Manual (PDF)</span>
          </a>

          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('start-guided-tour'))
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              background: '#0F0F0F',
              color: '#FFFFFF',
              border: '1px solid #333333',
              borderRadius: 'var(--r-badge)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D99A32', boxShadow: '0 0 6px rgba(217, 154, 50, 0.5)', flexShrink: 0 }} />
            <span>3-Min Tour</span>
          </button>

          <Link
            href="/demo"
            id="hero-demo-link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              background: '#FFFFFF',
              color: '#000000',
              border: '1px solid #FFFFFF',
              borderRadius: 'var(--r-badge)',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
            }}
          >
            <span>Demo Personas</span>
          </Link>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              background: '#0F0F0F',
              color: '#FFFFFF',
              border: '1px solid #333333',
              borderRadius: 'var(--r-badge)',
              cursor: 'pointer',
            }}
          >
            {theme === 'dark' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          <Link
            href="/login"
            style={{
              padding: '6px 14px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 'var(--r-badge)',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            Sign In
          </Link>
        </div>

        {/* Mobile-only right cluster: Sign In + Hamburger */}
        <div className="landing-mobile-nav" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
          <Link
            href="/login"
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              background: '#FFFFFF',
              color: '#000000',
              border: '1px solid #FFFFFF',
              borderRadius: 'var(--r-badge)',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            Sign In
          </Link>
          <button
            id="landing-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            style={{
              width: 36,
              height: 36,
              border: '1px solid #242424',
              borderRadius: 'var(--r-control)',
              background: '#0F0F0F',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="3" y1="5" x2="15" y2="5" />
              <line x1="3" y1="9" x2="15" y2="9" />
              <line x1="3" y1="13" x2="15" y2="13" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer for Landing Page */}
      {mobileMenuOpen && (
        <div
          className="landing-mobile-drawer-overlay"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 200,
            display: 'flex',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: 'min(300px, 85vw)',
              height: '100%',
              background: '#080808',
              borderRight: '1px solid #242424',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
              overflowY: 'auto',
              animation: 'slideDrawerIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            {/* Drawer header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 16px',
              borderBottom: '1px solid #242424',
              background: '#0D0D0D',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 26, height: 26,
                  background: '#0F0F0F',
                  border: '1px solid #242424',
                  borderRadius: 4,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="14" height="14" viewBox="0 0 22 22" fill="none">
                    <path d="M4 16L8.5 10L12 13.5L16 7L18.5 11" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>EOI Platform</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                style={{
                  width: 30, height: 30,
                  border: '1px solid #242424',
                  borderRadius: 4,
                  background: '#151515',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#A3A3A3',
                  fontSize: '16px',
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            {/* Drawer links */}
            <div style={{ padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <a href="/EOI_Platform_User_Manual_and_Guide.pdf" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 4, textDecoration: 'none', color: 'var(--text-on-surface)', fontSize: '13px', fontFamily: 'var(--font-ui)' }}
              >
                <span style={{ width: 20, textAlign: 'center', color: 'var(--muted)' }}>📄</span>
                <span>User Manual (PDF)</span>
              </a>
              <button onClick={() => { setMobileMenuOpen(false); window.dispatchEvent(new CustomEvent('start-guided-tour')) }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 4, background: 'transparent', border: 'none', color: 'var(--text-on-surface)', fontSize: '13px', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-ui)', width: '100%' }}
              >
                <span style={{ width: 20, textAlign: 'center' }}>🎬</span>
                <span>3-Minute Story Tour</span>
              </button>
              <div style={{ height: 1, background: '#242424', margin: '4px 12px' }} />
              <Link href="/demo" onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 4, textDecoration: 'none', color: 'var(--text-on-surface)', fontSize: '13px', fontFamily: 'var(--font-ui)' }}
              >
                <span style={{ width: 20, textAlign: 'center' }}>👥</span>
                <span>Demo Personas</span>
              </Link>
              <Link href="/gov/dashboard" onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 4, textDecoration: 'none', color: 'var(--text-on-surface)', fontSize: '13px', fontFamily: 'var(--font-ui)' }}
              >
                <span style={{ width: 20, textAlign: 'center' }}>🏛️</span>
                <span>Government Command Center</span>
              </Link>
              <Link href="/gov/audit" onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 4, textDecoration: 'none', color: '#18B6A4', fontSize: '13px', fontFamily: 'var(--font-ui)' }}
              >
                <span style={{ width: 20, textAlign: 'center' }}>⛓️</span>
                <span>SHA-256 Audit Ledger</span>
              </Link>
              <div style={{ height: 1, background: '#242424', margin: '4px 12px' }} />
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 4, textDecoration: 'none', background: '#FFFFFF', color: '#000000', fontWeight: 700, fontSize: '13px', fontFamily: 'var(--font-mono)', margin: '4px 12px', justifyContent: 'center', textTransform: 'uppercase', letterSpacing: '0.04em' }}
              >
                Sign In →
              </Link>
            </div>

            {/* SHA ledger status */}
            <div style={{ marginTop: 'auto', padding: '12px 16px', borderTop: '1px solid #242424' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#18B6A4', boxShadow: '0 0 6px rgba(24,182,164,0.45)', flexShrink: 0 }} />
                SHA-256 Ledger: 502 Blocks Verified
              </div>
              <div style={{ fontSize: '10px', color: '#4a4a4a', marginTop: 4, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Synthetic Data · Prototype
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner Section (Stitch Precision Console) */}
      <section className="landing-hero-section" style={{
        background: '#000000',
        color: '#FFFFFF',
        padding: 'var(--sp-12) var(--sp-8) var(--sp-10)',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid #242424',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Scheme alignment badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 14px',
            background: '#080808',
            border: '1px solid #242424',
            borderRadius: 'var(--r-badge)',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 500,
            letterSpacing: '0.06em',
            color: 'var(--muted)',
            marginBottom: 'var(--sp-4)',
            textTransform: 'uppercase',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#18B6A4', boxShadow: '0 0 6px rgba(24, 182, 164, 0.45)' }} />
            PMKVY 4.0 · NAPS · DDU-GKY · SIDH · ESIC NATIONAL INTEGRATION ARCHITECTURE
          </div>

          <h1 className="landing-hero-h1" style={{
            fontSize: '2.5rem',
            fontFamily: 'var(--font-ui)',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            marginBottom: 'var(--sp-4)',
            maxWidth: 900,
            margin: '0 auto var(--sp-4)',
            color: '#FFFFFF',
          }}>
            From "How Many Trained?" to "What Happened Next?"
          </h1>

          <p style={{
            fontSize: 'var(--text-md)',
            color: 'var(--muted)',
            maxWidth: 780,
            margin: '0 auto var(--sp-8)',
            lineHeight: 1.6,
          }}>
            An automated, trusted, longitudinal outcome layer that bridges skilling records to independently verified employer trajectories — powered by SHA-256 hash chaining, zero master-admin permissions, and statistical anomaly detection.
          </p>

          {/* Core Action Buttons */}
          <div className="landing-hero-action-row" style={{ display: 'flex', justifyContent: 'center', gap: 'var(--sp-3)', flexWrap: 'wrap', marginBottom: 'var(--sp-10)' }}>
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('start-guided-tour'))
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                background: '#0F0F0F',
                color: '#FFFFFF',
                border: '1px solid #242424',
                borderRadius: 'var(--r-control)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                transition: 'all 0.12s ease',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D99A32', boxShadow: '0 0 6px rgba(217, 154, 50, 0.5)' }} />
              <span>Story Tour (3-Min Auto Walkthrough)</span>
            </button>

            <Link
              href="/demo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                background: '#FFFFFF',
                color: '#000000',
                border: '1px solid #FFFFFF',
                borderRadius: 'var(--r-control)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                textDecoration: 'none',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                transition: 'all 0.12s ease',
              }}
            >
              <span>Launch Evaluator Walkthrough →</span>
            </Link>

            <Link
              href="/gov/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: 'var(--r-control)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                textDecoration: 'none',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                transition: 'all 0.15s ease',
              }}
            >
              <span>Government Command Center</span>
            </Link>

            <Link
              href="/gov/audit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                background: 'rgba(24, 182, 164, 0.12)',
                color: '#18B6A4',
                border: '1px solid rgba(24, 182, 164, 0.35)',
                borderRadius: 'var(--r-control)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                textDecoration: 'none',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#18B6A4', boxShadow: '0 0 6px rgba(24, 182, 164, 0.45)' }} />
              <span>SHA-256 Audit Ledger</span>
            </Link>

            <button
              onClick={() => {
                const el = document.getElementById('core-pillars')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '10px 18px',
                background: 'transparent',
                color: '#CBD5E1',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 'var(--r-control)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 500,
                cursor: 'pointer',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                transition: 'all 0.15s ease',
              }}
            >
              <span>Explore Architecture ↓</span>
            </button>
          </div>

          {/* Live Platform Metric Strip (Stitch Telemetry Matrix) */}
          <div className="landing-metrics-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--sp-3)',
            background: '#080808',
            border: '1px solid #242424',
            borderRadius: 'var(--r-control)',
            padding: 'var(--sp-4)',
          }}>
            <div style={{ padding: 'var(--sp-2)' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>
                500
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginTop: 2, textTransform: 'uppercase' }}>Enrolled Trainees</div>
            </div>
            <div style={{ padding: 'var(--sp-2)', borderLeft: '1px solid #242424' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, color: '#18B6A4', fontVariantNumeric: 'tabular-nums' }}>
                310 (62.0%)
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginTop: 2, textTransform: 'uppercase' }}>Verified Employed</div>
            </div>
            <div style={{ padding: 'var(--sp-2)', borderLeft: '1px solid #242424' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>
                82.4%
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginTop: 2, textTransform: 'uppercase' }}>Job Readiness Rate</div>
            </div>
            <div style={{ padding: 'var(--sp-2)', borderLeft: '1px solid #242424' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, color: '#D99A32', fontVariantNumeric: 'tabular-nums' }}>
                |z| = 2.94
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginTop: 2, textTransform: 'uppercase' }}>Leakage Flag (RJ)</div>
            </div>
            <div style={{ padding: 'var(--sp-2)', borderLeft: '1px solid #242424' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 600, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>
                502
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginTop: 2, textTransform: 'uppercase' }}>SHA-256 Blocks</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="landing-main" style={{ flex: 1, padding: 'var(--sp-10) var(--sp-8)', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {/* The 4 Architectural Invariants Banner */}
        <div id="core-pillars" style={{ marginBottom: 'var(--sp-10)', scrollMarginTop: 80 }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--sp-6)' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--primary)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              Core Architectural Pillars
            </span>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>
              Enforced by Zero-Trust Database Invariants, Not UI Assumptions
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--sp-4)',
          }}>
            <div className="card" style={{ padding: 'var(--sp-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)' }}>
                <span style={{ fontSize: '20px' }}>🛡️</span>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)' }}>
                  P1: Zero Single-Stakeholder Truth
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', lineHeight: 1.5 }}>
                Agencies report placement but cannot verify their own claims. Only authorized employers confirm or reject employment.
              </p>
            </div>

            <div className="card" style={{ padding: 'var(--sp-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)' }}>
                <span style={{ fontSize: '20px' }}>📈</span>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)' }}>
                  P2: Longitudinal Trajectory
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', lineHeight: 1.5 }}>
                Employment is a trajectory, not a binary static check. Tracks 3-month retention, departures, unemployment, and re-employment.
              </p>
            </div>

            <div className="card" style={{ padding: 'var(--sp-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)' }}>
                <span style={{ fontSize: '20px' }}>🔍</span>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)' }}>
                  P3: Statistical Leakage Engine
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', lineHeight: 1.5 }}>
                Automated z-score calculation flags suspicious regional placement drops (|z| ≥ 2.0). Planted Rajasthan leakage detected at z = 2.94.
              </p>
            </div>

            <div className="card" style={{ padding: 'var(--sp-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)' }}>
                <span style={{ fontSize: '20px' }}>⛓️</span>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)' }}>
                  P4 & P5: SHA-256 Ledger & AI Guardrails
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', lineHeight: 1.5 }}>
                Every transition creates a cryptographic SHA-256 block. AI has strictly read-only access and never fabricates or verifies records.
              </p>
            </div>
          </div>
        </div>

        {/* 5 Stakeholder Gateway Cards */}
        <div style={{ marginBottom: 'var(--sp-10)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--sp-5)' }}>
            <div>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--primary)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                Portal Gateway
              </span>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>
                Explore by Stakeholder Persona
              </h2>
            </div>
            <Link href="/demo" style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--primary)' }}>
              View all 8 role capabilities →
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--sp-5)',
          }}>
            {/* Government Portal */}
            <div className="card" style={{ padding: 'var(--sp-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-3)' }}>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--ink)' }}>
                    🏛️ Government Command
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-control)',
                    background: 'rgba(29, 78, 137, 0.08)', color: 'var(--primary)', border: '1px solid rgba(29, 78, 137, 0.2)',
                  }}>
                    Aggregated Views
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.5, marginBottom: 'var(--sp-4)' }}>
                  National outcome conversion funnel, statistical anomaly & leakage engine, scenario simulator, skill demand insights, and AI analyst.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 'var(--sp-5)' }}>
                  <span style={{ fontSize: '11px', background: 'var(--canvas)', padding: '2px 8px', borderRadius: 4 }}>Funnel View</span>
                  <span style={{ fontSize: '11px', background: 'var(--canvas)', padding: '2px 8px', borderRadius: 4 }}>Leakage Engine</span>
                  <span style={{ fontSize: '11px', background: 'var(--canvas)', padding: '2px 8px', borderRadius: 4 }}>Simulator</span>
                </div>
              </div>
              <Link href="/gov/dashboard" className="btn-primary" style={{ width: '100%' }}>
                Enter Government Command Center →
              </Link>
            </div>

            {/* Training Agency Portal */}
            <div className="card" style={{ padding: 'var(--sp-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-3)' }}>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--ink)' }}>
                    🏫 Training Agency Module
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-control)',
                    background: 'var(--chip-pending-bg)', color: 'var(--pending)', border: '1px solid var(--chip-pending-border)',
                  }}>
                    Operational Layer
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.5, marginBottom: 'var(--sp-4)' }}>
                  Cohort registration, assessment scoring, job readiness band calculation (High/Medium/Low), and placement reporting with proof docs.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 'var(--sp-5)' }}>
                  <span style={{ fontSize: '11px', background: 'var(--canvas)', padding: '2px 8px', borderRadius: 4 }}>Student Intake</span>
                  <span style={{ fontSize: '11px', background: 'var(--canvas)', padding: '2px 8px', borderRadius: 4 }}>CSV Batch Import</span>
                  <span style={{ fontSize: '11px', background: 'var(--canvas)', padding: '2px 8px', borderRadius: 4 }}>Placement Reporting</span>
                </div>
              </div>
              <Link href="/agency/dashboard" className="btn-secondary" style={{ width: '100%', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                Enter Training Agency Portal →
              </Link>
            </div>

            {/* Employer Verification Portal */}
            <div className="card" style={{ padding: 'var(--sp-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-3)' }}>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--ink)' }}>
                    🏢 Employer Verifier Queue
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-control)',
                    background: 'var(--chip-verified-bg)', color: 'var(--verified)', border: '1px solid var(--chip-verified-border)',
                  }}>
                    Independent Truth
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.5, marginBottom: 'var(--sp-4)' }}>
                  Three-way verification queue (Confirm / Reject / Request Correction), departure reconciliation, and corporate skill deficit feedback.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 'var(--sp-5)' }}>
                  <span style={{ fontSize: '11px', background: 'var(--canvas)', padding: '2px 8px', borderRadius: 4 }}>3-Way Queue</span>
                  <span style={{ fontSize: '11px', background: 'var(--canvas)', padding: '2px 8px', borderRadius: 4 }}>Audit Evidence</span>
                  <span style={{ fontSize: '11px', background: 'var(--canvas)', padding: '2px 8px', borderRadius: 4 }}>Industry Feedback</span>
                </div>
              </div>
              <Link href="/employer/verification" className="btn-secondary" style={{ width: '100%', borderColor: 'var(--verified)', color: 'var(--verified)' }}>
                Enter Employer Verification Queue →
              </Link>
            </div>

            {/* Student Passport Portal */}
            <div className="card" style={{ padding: 'var(--sp-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-3)' }}>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--ink)' }}>
                    🎓 Student Employability
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-control)',
                    background: 'rgba(107, 78, 155, 0.1)', color: '#6B4E9B', border: '1px solid rgba(107, 78, 155, 0.3)',
                  }}>
                    Verifiable Passport
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.5, marginBottom: 'var(--sp-4)' }}>
                  Tamper-evident Employability Passport, longitudinal employment trajectory, skill gap analysis, and unemployment dispute filing.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 'var(--sp-5)' }}>
                  <span style={{ fontSize: '11px', background: 'var(--canvas)', padding: '2px 8px', borderRadius: 4 }}>Passport PDF</span>
                  <span style={{ fontSize: '11px', background: 'var(--canvas)', padding: '2px 8px', borderRadius: 4 }}>Career Trajectory</span>
                  <span style={{ fontSize: '11px', background: 'var(--canvas)', padding: '2px 8px', borderRadius: 4 }}>Report Departure</span>
                </div>
              </div>
              <Link href="/student/dashboard" className="btn-secondary" style={{ width: '100%' }}>
                Enter Student Passport →
              </Link>
            </div>

            {/* Audit Ledger Portal */}
            <div className="card" style={{ padding: 'var(--sp-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-3)' }}>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--ink)' }}>
                    🔒 Cryptographic Audit Ledger
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-control)',
                    background: 'var(--chip-verified-bg)', color: 'var(--verified)', border: '1px solid var(--chip-verified-border)',
                  }}>
                    SHA-256 Chained
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.5, marginBottom: 'var(--sp-4)' }}>
                  Append-only SHA-256 hash chained event ledger. Run live block-by-block cryptographic verification and inspect correlation IDs.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 'var(--sp-5)' }}>
                  <span style={{ fontSize: '11px', background: 'var(--canvas)', padding: '2px 8px', borderRadius: 4 }}>502 Events</span>
                  <span style={{ fontSize: '11px', background: 'var(--canvas)', padding: '2px 8px', borderRadius: 4 }}>Tamper Detection</span>
                  <span style={{ fontSize: '11px', background: 'var(--canvas)', padding: '2px 8px', borderRadius: 4 }}>Zero Master Admin</span>
                </div>
              </div>
              <Link href="/gov/audit" className="btn-secondary" style={{ width: '100%' }}>
                Verify Audit Chain →
              </Link>
            </div>

            {/* Evaluator 1-Click Hero Demo Guide Card */}
            <div className="card" style={{
              padding: 'var(--sp-6)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-3)' }}>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--ink)' }}>
                    ⚡ Evaluator Hero Walkthrough
                  </div>
                  <span style={{
                    fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--r-badge)',
                    background: 'var(--primary)', color: 'var(--primary-fg)', letterSpacing: '0.04em', textTransform: 'uppercase',
                  }}>
                    HERO DEMO
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.5, marginBottom: 'var(--sp-4)' }}>
                  Interactive 9-scene guided evaluation walkthrough showing the complete journey: Placement Reported → Verification → Ledger Chained → Anomaly Detected.
                </p>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: 'var(--sp-5)' }}>
                  Switch between 8 authenticated personas instantly without entering passwords.
                </div>
              </div>
              <Link href="/demo" className="btn-primary" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '10px 16px',
                borderRadius: 'var(--r-control)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}>
                Open Demo Guide & Role Switcher →
              </Link>
            </div>
          </div>
        </div>

        {/* Evaluator 1-Click Persona Login Shortcuts */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-container)',
          padding: 'var(--sp-6)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: 'var(--sp-10)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
            <div>
              <div style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)' }}>
                ⚡ 1-Click Evaluator Persona Switcher
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 2 }}>
                Click any persona below to authenticate instantly with seeded test credentials
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>
              Universal Demo Password: <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--canvas)', padding: '2px 6px', borderRadius: 3 }}>Demo@EOI2026</code>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--sp-3)',
          }}>
            <button
              onClick={() => handleQuickLogin('gov.analyst@eoi.demo')}
              disabled={!!loggingIn}
              className="btn-secondary"
              style={{ padding: '10px 14px', flexDirection: 'column', alignItems: 'flex-start', height: 'auto' }}
            >
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary)' }}>🏛️ Government Analyst</span>
              <span style={{ fontSize: '10px', color: 'var(--muted)', marginTop: 2 }}>gov.analyst@eoi.demo</span>
            </button>

            <button
              onClick={() => handleQuickLogin('gov.admin@eoi.demo')}
              disabled={!!loggingIn}
              className="btn-secondary"
              style={{ padding: '10px 14px', flexDirection: 'column', alignItems: 'flex-start', height: 'auto' }}
            >
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary)' }}>📋 Program Admin</span>
              <span style={{ fontSize: '10px', color: 'var(--muted)', marginTop: 2 }}>gov.admin@eoi.demo</span>
            </button>

            <button
              onClick={() => handleQuickLogin('gov.auditor@eoi.demo')}
              disabled={!!loggingIn}
              className="btn-secondary"
              style={{ padding: '10px 14px', flexDirection: 'column', alignItems: 'flex-start', height: 'auto' }}
            >
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink)' }}>🔒 Government Auditor</span>
              <span style={{ fontSize: '10px', color: 'var(--muted)', marginTop: 2 }}>gov.auditor@eoi.demo</span>
            </button>

            <button
              onClick={() => handleQuickLogin('agency.officer@eoi.demo')}
              disabled={!!loggingIn}
              className="btn-secondary"
              style={{ padding: '10px 14px', flexDirection: 'column', alignItems: 'flex-start', height: 'auto' }}
            >
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--verified)' }}>🏫 Agency Officer</span>
              <span style={{ fontSize: '10px', color: 'var(--muted)', marginTop: 2 }}>agency.officer@eoi.demo</span>
            </button>

            <button
              onClick={() => handleQuickLogin('agency.admin@eoi.demo')}
              disabled={!!loggingIn}
              className="btn-secondary"
              style={{ padding: '10px 14px', flexDirection: 'column', alignItems: 'flex-start', height: 'auto' }}
            >
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--verified)' }}>📂 Agency Admin</span>
              <span style={{ fontSize: '10px', color: 'var(--muted)', marginTop: 2 }}>agency.admin@eoi.demo</span>
            </button>

            <button
              onClick={() => handleQuickLogin('employer.verifier@eoi.demo')}
              disabled={!!loggingIn}
              className="btn-secondary"
              style={{ padding: '10px 14px', flexDirection: 'column', alignItems: 'flex-start', height: 'auto' }}
            >
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--pending)' }}>🏢 Employer Verifier</span>
              <span style={{ fontSize: '10px', color: 'var(--muted)', marginTop: 2 }}>employer.verifier@eoi.demo</span>
            </button>

            <button
              onClick={() => handleQuickLogin('employer.admin@eoi.demo')}
              disabled={!!loggingIn}
              className="btn-secondary"
              style={{ padding: '10px 14px', flexDirection: 'column', alignItems: 'flex-start', height: 'auto' }}
            >
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--pending)' }}>🏛️ Employer Admin</span>
              <span style={{ fontSize: '10px', color: 'var(--muted)', marginTop: 2 }}>employer.admin@eoi.demo</span>
            </button>

            <button
              onClick={() => handleQuickLogin('student.x@eoi.demo')}
              disabled={!!loggingIn}
              className="btn-secondary"
              style={{ padding: '10px 14px', flexDirection: 'column', alignItems: 'flex-start', height: 'auto' }}
            >
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: '#6B4E9B' }}>🎓 Student Trainee</span>
              <span style={{ fontSize: '10px', color: 'var(--muted)', marginTop: 2 }}>student.x@eoi.demo</span>
            </button>

            <button
              onClick={() => handleQuickLogin('security.officer@eoi.demo')}
              disabled={!!loggingIn}
              className="btn-secondary"
              style={{ padding: '10px 14px', flexDirection: 'column', alignItems: 'flex-start', height: 'auto' }}
            >
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--info)' }}>🛡️ Security Officer</span>
              <span style={{ fontSize: '10px', color: 'var(--muted)', marginTop: 2 }}>security.officer@eoi.demo</span>
            </button>

            <button
              onClick={() => handleQuickLogin('platform.ops@eoi.demo')}
              disabled={!!loggingIn}
              className="btn-secondary"
              style={{ padding: '10px 14px', flexDirection: 'column', alignItems: 'flex-start', height: 'auto' }}
            >
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink)' }}>⚙️ Platform Operations</span>
              <span style={{ fontSize: '10px', color: 'var(--muted)', marginTop: 2 }}>platform.ops@eoi.demo</span>
            </button>
          </div>
        </div>
      </main>

      {/* Official Government Compliance Footer */}
      <footer style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--line)',
        padding: 'var(--sp-8) var(--sp-8)',
        fontSize: 'var(--text-xs)',
        color: 'var(--muted)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 'var(--sp-4)', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
              Employment Outcome Intelligence (EOI) Platform · Smart India Hackathon 2026
            </div>
            <div>
              Problem Statement SIH26135 · Ministry of Skill Development & Entrepreneurship
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-4)', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span className="pulse-dot" style={{ width: 6, height: 6 }} />
              Zero Master-Admin Enforced
            </span>
            <span>·</span>
            <span>DPDP Act 2023 Compliant</span>
            <span>·</span>
            <span>Synthetic Data Prototype</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
