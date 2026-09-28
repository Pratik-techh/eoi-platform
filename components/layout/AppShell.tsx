'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { SideNav } from './SideNav'
import type { ActorRole } from '@/lib/supabase/database.types'

type AppUser = {
  id: string
  email: string
  role: ActorRole
}

const ROLE_LABELS: Record<ActorRole, string> = {
  gov_analyst:       'Government Analyst',
  gov_program_admin: 'Programme Admin',
  gov_auditor:       'Government Auditor',
  agency_admin:      'Agency Admin',
  agency_officer:    'Agency Officer',
  student:           'Student',
  employer_admin:    'Employer Admin',
  employer_verifier: 'Employer Verifier',
  security_officer:  'Security Officer',
  platform_ops:      'Platform Ops',
}

const QUICK_ROLES = [
  { role: 'gov_analyst', label: 'Government Analyst', person: 'Priya Sharma', icon: '🏛️', path: '/gov/dashboard', email: 'gov.analyst@eoi.demo' },
  { role: 'student', label: 'Student Passport', person: 'Arjun Singh', icon: '🎓', path: '/student/dashboard', email: 'student.x@eoi.demo' },
  { role: 'employer_verifier', label: 'Employer Verifier', person: 'Google India', icon: '🏢', path: '/employer/verification', email: 'employer.verifier@eoi.demo' },
  { role: 'agency_officer', label: 'Training Agency', person: 'Apex Institute', icon: '🏫', path: '/agency/dashboard', email: 'agency.officer@eoi.demo' },
  { role: 'gov_auditor', label: 'Government Auditor', person: 'Amit Verma', icon: '🛡️', path: '/gov/audit', email: 'gov.auditor@eoi.demo' },
]

const SEARCH_ENTITIES = [
  { title: 'National Outcome Funnel', category: 'Government', href: '/gov/funnel', hint: 'Stage drop-off & retention' },
  { title: 'Statistical Leakage Engine', category: 'Government', href: '/gov/leakage', hint: 'Rajasthan |z|=2.94 anomaly' },
  { title: 'Program Intelligence', category: 'Government', href: '/gov/programs', hint: 'PMKVY, NAPS, DDU-GKY schemes' },
  { title: 'Skill Intelligence Engine', category: 'Government', href: '/gov/skills', hint: 'Demand vs supply gap' },
  { title: 'Policy Scenario Simulator', category: 'Tools', href: '/gov/simulator', hint: 'Capacity modeling' },
  { title: 'AI Outcome Policy Analyst', category: 'Tools', href: '/gov/ai', hint: 'Natural language Q&A with citations' },
  { title: 'Cryptographic SHA-256 Audit Ledger', category: 'Audit', href: '/gov/audit', hint: '502 chained blocks' },
  { title: 'Dual-Key Governance & Approvals', category: 'Governance', href: '/gov/governance', hint: 'Multi-party approval queue' },
  { title: 'Candidate Registry & Bulk CSV', category: 'Agency', href: '/agency/students', hint: '500 enrolled trainees' },
  { title: 'Job Readiness Band Engine', category: 'Agency', href: '/agency/readiness', hint: 'High, Medium, Low scoring' },
  { title: 'Report Placement Outcome', category: 'Agency', href: '/agency/employment/report', hint: 'Candidate placement claims' },
  { title: 'Employment Verification Queue', category: 'Employer', href: '/employer/verification', hint: 'Confirm, Reject, Correction' },
  { title: 'Organization Legal Identifiers', category: 'Employer', href: '/employer/organization', hint: 'CIN, EPFO, ESIC registration' },
  { title: 'Employability Passport', category: 'Student', href: '/student/passport', hint: 'Verifiable credentials & PDF' },
  { title: 'Longitudinal Career Trajectory', category: 'Student', href: '/student/history', hint: 'Tenure & transitions' },
  { title: 'Platform Infrastructure & Ops Health', category: 'Platform', href: '/platform/health', hint: 'Uptime & service telemetry' },
  { title: 'Arjun Singh (Student X)', category: 'Candidate', href: '/student/dashboard', hint: 'EOI-S-HERO-0001 (Google India)' },
  { title: 'Google India Pvt. Ltd.', category: 'Employer', href: '/employer/verification', hint: 'org-google-01 · CIN: U72200KA2004FTC033590' },
]

export default function AppShell({ user, children }: { user: AppUser; children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [signingOut, setSigningOut] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)
  const [switchingRole, setSwitchingRole] = useState<string | null>(null)

  // Automatically close mobile navigation drawer & role menu when user navigates
  useEffect(() => {
    setMobileNavOpen(false)
    setRoleMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(prev => !prev)
      } else if (e.key === 'Escape') {
        setSearchOpen(false)
        setMobileNavOpen(false)
        setRoleMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  async function handleQuickRoleSwitch(email: string, targetPath: string) {
    setSwitchingRole(email)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'Demo@EOI2026' }),
      })
      if (res.ok) {
        setRoleMenuOpen(false)
        window.location.href = targetPath
      } else {
        setSwitchingRole(null)
      }
    } catch {
      setSwitchingRole(null)
    }
  }

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const notificationHref =
    user.role === 'student'
      ? '/student/notifications'
      : user.role.startsWith('agency')
      ? '/agency/inbox'
      : user.role.startsWith('employer')
      ? '/employer/verification'
      : user.role.startsWith('gov')
      ? '/gov/governance'
      : '/platform/security'

  const filteredSearch = SEARCH_ENTITIES.filter(
    item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hint.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="app-shell">
      {/* Fixed sidebar */}
      <aside className="sidebar" aria-label="Application sidebar">
        <SideNav role={user.role} />
      </aside>

      {/* Main content area */}
      <div className="main-content">
        {/* Synthetic data banner — always visible, unobtrusive */}
        <div
          className="synthetic-banner"
          role="status"
          aria-label="Data notice"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M6 4v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Synthetic data — prototype · No real personal information
        </div>

        {/* Top bar — Stitch Precision Instrument Header */}
        <header className="topbar" role="banner" style={{
          justifyContent: 'space-between',
          background: '#080808',
          borderBottom: '1px solid #242424',
          boxShadow: 'none',
        }}>
          {/* Left: Hamburger menu (mobile only) + Ministry Emblem & Ledger state indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', minWidth: 0 }}>
            {/* Mobile Hamburger Drawer Toggle */}
            <button
              id="mobile-nav-toggle"
              className="mobile-only-btn"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
              style={{
                width: 34,
                height: 34,
                border: '1px solid #242424',
                borderRadius: 'var(--r-control)',
                background: '#0F0F0F',
                color: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginRight: 4,
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="3" y1="5" x2="15" y2="5" />
                <line x1="3" y1="9" x2="15" y2="9" />
                <line x1="3" y1="13" x2="15" y2="13" />
              </svg>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.06em' }}>
                  EOI
                </span>
                <span style={{ color: 'var(--outline-variant)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>/</span>
                <span className="topbar-branding-subtext" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>
                  Verification System
                </span>
              </Link>
            </div>

            {/* Precision Telemetry Telemetry Matrix (Stitch Header Spec: Only on ultra-wide screens to prevent crowding) */}
            <div className="hidden 2xl:flex items-center gap-3 border-l border-[#242424] pl-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#18B6A4', boxShadow: '0 0 6px rgba(24, 182, 164, 0.45)', display: 'inline-block' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>System:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#FFFFFF', textTransform: 'uppercase', fontWeight: 500 }}>Nominal</span>
              </div>
              <span style={{ color: 'var(--outline-variant)', fontSize: '10px' }}>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Latency:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#FFFFFF', fontWeight: 500 }}>12ms</span>
              </div>
              <span style={{ color: 'var(--outline-variant)', fontSize: '10px' }}>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Engine:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#FFFFFF', fontWeight: 500 }}>v4.18.2</span>
              </div>
            </div>

            <Link
              href="/gov/audit"
              className="topbar-ledger-pill hidden xl:inline-flex"
              title="Inspect Cryptographic SHA-256 Audit Ledger"
              style={{
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                background: '#0F0F0F',
                border: '1px solid #242424',
                borderRadius: 'var(--r-badge)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 500,
                color: 'var(--text-on-surface)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                marginLeft: 'var(--sp-2)',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#18B6A4', boxShadow: '0 0 6px rgba(24, 182, 164, 0.45)' }} />
              <span>LEDGER: 0x7F18...E29A</span>
              <span style={{ color: 'var(--muted)', borderLeft: '1px solid #242424', paddingLeft: 6 }}>
                502 Blocks
              </span>
            </Link>
          </div>

          {/* Right: Quick Switcher, Search, Notifications, User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            {/* 3-Minute Story Tour Trigger */}
            <button
              id="story-tour-trigger"
              onClick={() => {
                try {
                  localStorage.setItem('eoi_tour_active', 'true')
                } catch {}
                window.dispatchEvent(new CustomEvent('start-guided-tour'))
              }}
              title="Start 3-Minute Guided Walkthrough for Judges"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                background: '#080808',
                color: 'var(--text-on-surface)',
                border: '1px solid #242424',
                borderRadius: 'var(--r-control)',
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#D99A32', boxShadow: '0 0 5px rgba(217, 154, 50, 0.5)' }} />
              <span className="hidden sm:inline">Tour</span>
            </button>

            {/* 1-Click Role Switcher for Evaluators (Stitch High-Contrast Action) */}
            <div style={{ position: 'relative' }}>
              <button
                id="evaluator-demo-switcher"
                onClick={() => setRoleMenuOpen(prev => !prev)}
                title="Switch roles & evaluate personas"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  background: '#FFFFFF',
                  color: '#000000',
                  border: '1px solid #FFFFFF',
                  borderRadius: 'var(--r-control)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>Switch Role</span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  style={{
                    transform: roleMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.15s ease',
                    marginLeft: 2,
                  }}
                >
                  <path d="M2.5 3.5L5 6L7.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Role Switcher Popover Dropdown */}
              {roleMenuOpen && (
                <>
                  <div
                    onClick={() => setRoleMenuOpen(false)}
                    style={{ position: 'fixed', inset: 0, zIndex: 140 }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: 'min(300px, calc(100vw - 24px))',
                      maxHeight: 'calc(100vh - 80px)',
                      overflowY: 'auto',
                      background: '#0F0F0F',
                      border: '1px solid #242424',
                      borderRadius: 'var(--r-control)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.95)',
                      padding: 'var(--sp-2)',
                      zIndex: 150,
                      animation: 'fadeInDown 0.15s ease-out',
                    }}
                  >
                    <div style={{
                      padding: '6px 10px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      color: 'var(--muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      borderBottom: '1px solid #242424',
                      marginBottom: 4,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span>Persona Switch</span>
                      <span style={{ fontSize: '10px', color: '#18B6A4', fontWeight: 600 }}>Active Node</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {QUICK_ROLES.map(item => {
                        const isCurrent = user.role === item.role
                        const isPending = switchingRole === item.email
                        return (
                          <button
                            key={item.role}
                            onClick={() => handleQuickRoleSwitch(item.email, item.path)}
                            disabled={isPending}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              width: '100%',
                              padding: '8px 10px',
                              background: isCurrent ? '#1c1b1b' : 'transparent',
                              border: isCurrent ? '1px solid #353534' : '1px solid transparent',
                              borderRadius: 'var(--r-badge)',
                              textAlign: 'left',
                              cursor: isPending ? 'wait' : 'pointer',
                              transition: 'all 0.12s ease',
                              fontFamily: 'var(--font-ui)',
                            }}
                            onMouseEnter={e => {
                              if (!isCurrent) e.currentTarget.style.background = '#151515'
                            }}
                            onMouseLeave={e => {
                              if (!isCurrent) e.currentTarget.style.background = 'transparent'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: '14px' }}>{item.icon}</span>
                              <div>
                                <div style={{ fontSize: '12px', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? '#FFFFFF' : 'var(--text-on-surface)' }}>
                                  {item.label}
                                </div>
                                <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
                                  {item.person}
                                </div>
                              </div>
                            </div>
                            {isCurrent ? (
                              <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#000000', background: '#FFFFFF', padding: '2px 6px', borderRadius: 2, textTransform: 'uppercase' }}>
                                Active
                              </span>
                            ) : isPending ? (
                              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>...</span>
                            ) : null}
                          </button>
                        )
                      })}
                    </div>

                    <div style={{ borderTop: '1px solid #242424', marginTop: 4, paddingTop: 4 }}>
                      <Link
                        href="/demo"
                        onClick={() => setRoleMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          width: '100%',
                          padding: '7px 10px',
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 500,
                          color: '#FFFFFF',
                          textDecoration: 'none',
                          borderRadius: 'var(--r-badge)',
                          background: '#151515',
                          border: '1px solid #242424',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        <span>Demo Guide & 10 Personas →</span>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Global search trigger */}
            <button
              id="global-search-trigger"
              onClick={() => setSearchOpen(true)}
              aria-label="Open global search"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-2)',
                padding: '6px var(--sp-3)',
                border: '1px solid #242424',
                borderRadius: 'var(--r-control)',
                background: '#0F0F0F',
                color: '#A3A3A3',
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                minWidth: 140,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <span className="search-label-text">Search…</span>
              <kbd className="search-shortcut-kbd" style={{
                marginLeft: 'auto',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                border: '1px solid #242424',
                background: '#151515',
                color: '#737373',
                borderRadius: 2,
                padding: '0 4px',
              }}>
                ⌘K
              </kbd>
            </button>

            {/* Notifications with role-safe routing */}
            <Link
              href={notificationHref}
              id="notification-bell"
              aria-label="Notifications"
              title="View notifications"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 34,
                height: 34,
                border: '1px solid #242424',
                borderRadius: 'var(--r-control)',
                color: '#A3A3A3',
                position: 'relative',
                background: '#0F0F0F',
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 2a5 5 0 00-5 5v3l-1 2h12l-1-2V7a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                <path d="M6.5 13a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
            </Link>

            {/* User menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', paddingLeft: 'var(--sp-2)', borderLeft: '1px solid #242424' }}>
              <div className="desktop-user-info" style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: '#FFFFFF' }}>
                  {user.email.split('@')[0]}
                </div>
                <div style={{ fontSize: '10px', color: '#737373', fontWeight: 500 }}>
                  {ROLE_LABELS[user.role]}
                </div>
              </div>
              <div style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000000',
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {user.email[0]?.toUpperCase()}
              </div>
              <button
                id="sign-out-button"
                onClick={handleSignOut}
                disabled={signingOut}
                aria-label="Sign out"
                title="Sign out"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  border: '1px solid #242424',
                  borderRadius: 'var(--r-control)',
                  background: '#0F0F0F',
                  color: '#A3A3A3',
                  cursor: 'pointer',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M9 7H2M6 4l-3 3 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 2h5a1 1 0 011 1v8a1 1 0 01-1 1H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main id="main-content" className="page-content" tabIndex={-1}>
          {children}
        </main>
      </div>

      {/* Global Command Palette Modal (⌘K) — Stitch Precision Modal */}
      {searchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Global search command palette"
          onClick={() => setSearchOpen(false)}
          className="modal-backdrop-animate"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '80px 16px 24px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="modal-card-animate"
            style={{
              width: '100%',
              maxWidth: 600,
              background: '#0F0F0F',
              border: '1px solid #242424',
              borderRadius: 'var(--r-control)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.9)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '80vh',
            }}
          >
            {/* Search Input Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 18px',
              borderBottom: '1px solid #242424',
              background: '#080808',
            }}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5" stroke="var(--primary)" strokeWidth="1.6"/>
                <path d="M11 11l3.5 3.5" stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              <input
                autoFocus
                type="text"
                placeholder="Search anything: funnels, leakage, students, agencies, credentials…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: 'var(--text-base)',
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-ui)',
                }}
              />
              <kbd style={{
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                padding: '2px 6px',
                borderRadius: 4,
                color: 'var(--muted)',
              }}>
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div style={{ overflowY: 'auto', padding: '8px' }}>
              {filteredSearch.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)', fontSize: 'var(--text-sm)' }}>
                  No matching results for &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {filteredSearch.map(item => (
                    <Link
                      key={item.href + item.title}
                      href={item.href}
                      onClick={() => setSearchOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: 'var(--r-control)',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'background 0.1s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'var(--canvas)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink)' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: 2 }}>
                          {item.hint}
                        </div>
                      </div>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        background: 'rgba(29, 78, 137, 0.08)',
                        color: 'var(--primary)',
                        borderRadius: 'var(--r-control)',
                      }}>
                        {item.category}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Slide-Over Drawer */}
      {mobileNavOpen && (
        <div
          className="mobile-drawer-overlay modal-backdrop-animate"
          onClick={() => setMobileNavOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
          }}
        >
          <div
            className="mobile-drawer-panel"
            onClick={e => e.stopPropagation()}
            style={{
              width: 'min(300px, 85vw)',
              height: '100%',
              background: '#080808',
              borderRight: '1px solid #242424',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
              overflowY: 'auto',
              animation: 'slideDrawerIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              borderBottom: '1px solid #242424',
              background: '#0D0D0D',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '4px',
                  background: 'rgba(24, 182, 164, 0.15)',
                  border: '1px solid #18B6A4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                    <path d="M3 13L6.5 8l3 3L13 5l2 4" stroke="#18B6A4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Navigation Menu</span>
              </div>
              <button
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation menu"
                style={{
                  width: 28, height: 28, borderRadius: '4px', border: '1px solid #242424',
                  background: '#151515', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#A3A3A3', fontSize: '13px', fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <SideNav role={user.role} onNavigate={() => setMobileNavOpen(false)} inDrawer={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
