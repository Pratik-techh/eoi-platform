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
  const [isMac, setIsMac] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('light')

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.userAgent || navigator.platform))
    }
    try {
      const savedTheme = localStorage.getItem('eoi_theme') as 'dark' | 'light' | null
      if (savedTheme === 'dark') {
        setTheme('dark')
        document.documentElement.setAttribute('data-theme', 'dark')
        document.documentElement.classList.remove('light')
        document.documentElement.classList.add('dark')
      } else {
        setTheme('light')
        document.documentElement.setAttribute('data-theme', 'light')
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
      }
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
      {/* Sidebar with collapse support */}
      <aside
        className="sidebar"
        data-collapsed={sidebarCollapsed ? 'true' : 'false'}
        aria-label="Application sidebar"
      >
        <SideNav
          role={user.role}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
        />
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
          background: 'var(--surface-container-low)',
          borderBottom: '1px solid var(--line)',
          boxShadow: 'none',
        }}>
          {/* Left: Sidebar Collapse & Mobile Menu Toggle + Emblem & Ledger indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', minWidth: 0 }}>
            {/* Sidebar Collapse / Mobile Drawer Toggle Button */}
            <button
              id="sidebar-toggle-btn"
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
                  setMobileNavOpen(prev => !prev)
                } else {
                  setSidebarCollapsed(prev => !prev)
                }
              }}
              title={sidebarCollapsed ? 'Expand navigation menu' : 'Collapse / hide navigation menu'}
              aria-label="Toggle navigation menu"
              style={{
                width: 34,
                height: 34,
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-control)',
                background: 'var(--surface)',
                color: 'var(--ink)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginRight: 4,
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--primary-accent)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--line)'
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
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '0.06em' }}>
                  EOI
                </span>
                <span style={{ color: 'var(--outline)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>/</span>
                <span className="topbar-branding-subtext" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  Verification System
                </span>
              </Link>
            </div>

            {/* Precision Telemetry Telemetry Matrix (Stitch Header Spec: Only on ultra-wide screens to prevent crowding) */}
            <div className="topbar-telemetry" style={{ alignItems: 'center', gap: 12, borderLeft: '1px solid var(--line)', paddingLeft: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--verified)', boxShadow: '0 0 6px rgba(13, 148, 136, 0.45)', display: 'inline-block' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>System:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink)', textTransform: 'uppercase', fontWeight: 600 }}>Nominal</span>
              </div>
              <span style={{ color: 'var(--outline)', fontSize: '10px' }}>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Latency:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink)', fontWeight: 600 }}>12ms</span>
              </div>
              <span style={{ color: 'var(--outline)', fontSize: '10px' }}>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Engine:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink)', fontWeight: 600 }}>v4.18.2</span>
              </div>
            </div>

            <Link
              href="/gov/audit"
              className="topbar-ledger-pill"
              title="Inspect Cryptographic SHA-256 Audit Ledger"
              style={{
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-badge)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: 'var(--ink)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                marginLeft: 'var(--sp-2)',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--verified)', boxShadow: '0 0 6px rgba(13, 148, 136, 0.45)' }} />
              <span>LEDGER: 0x7F18...E29A</span>
              <span style={{ color: 'var(--muted)', borderLeft: '1px solid var(--line)', paddingLeft: 6 }}>
                502 Blocks
              </span>
            </Link>
          </div>

          {/* Right: Quick Switcher, Search, Notifications, User */}
          <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', flexShrink: 0 }}>
            {/* 3-Minute Story Tour Trigger */}
            <button
              id="story-tour-trigger"
              className="topbar-tour-btn"
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
                background: 'var(--surface)',
                color: 'var(--ink)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-control)',
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--pending)', boxShadow: '0 0 5px rgba(217, 154, 50, 0.5)' }} />
              <span className="hidden sm:inline">Tour</span>
            </button>

            {/* 1-Click Role Switcher for Evaluators (Stitch High-Contrast Action) */}
            <div className="topbar-role-switcher" style={{ position: 'relative', zIndex: 140 }}>
              <button
                id="evaluator-demo-switcher"
                onClick={(e) => {
                  e.stopPropagation()
                  setRoleMenuOpen(prev => !prev)
                }}
                title="Switch roles & evaluate personas"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  background: 'var(--primary)',
                  color: 'var(--primary-fg)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--r-control)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ color: 'var(--primary-fg)' }}>Switch Role</span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  style={{
                    transform: roleMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.15s ease',
                    marginLeft: 2,
                    color: 'var(--primary-fg)',
                  }}
                >
                  <path d="M2.5 3.5L5 6L7.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Role Switcher Popover Dropdown */}
              {roleMenuOpen && (
                <>
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      setRoleMenuOpen(false)
                    }}
                    style={{ position: 'fixed', inset: 0, zIndex: 140 }}
                  />
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: 'min(300px, calc(100vw - 24px))',
                      maxHeight: 'calc(100vh - 80px)',
                      overflowY: 'auto',
                      background: 'var(--surface)',
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--r-control)',
                      boxShadow: 'var(--shadow-popover)',
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
                      borderBottom: '1px solid var(--line)',
                      marginBottom: 4,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span>Persona Switch</span>
                      <span style={{ fontSize: '10px', color: 'var(--primary-accent)', fontWeight: 600 }}>Active Node</span>
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
                              background: isCurrent ? 'var(--surface-container-high)' : 'transparent',
                              border: isCurrent ? '1px solid var(--line)' : '1px solid transparent',
                              borderRadius: 'var(--r-badge)',
                              textAlign: 'left',
                              cursor: isPending ? 'wait' : 'pointer',
                              transition: 'all 0.12s ease',
                              fontFamily: 'var(--font-ui)',
                            }}
                            onMouseEnter={e => {
                              if (!isCurrent) e.currentTarget.style.background = 'var(--surface-container-low)'
                            }}
                            onMouseLeave={e => {
                              if (!isCurrent) e.currentTarget.style.background = 'transparent'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: '14px' }}>{item.icon}</span>
                              <div>
                                <div style={{ fontSize: '12px', fontWeight: isCurrent ? 700 : 500, color: 'var(--ink)' }}>
                                  {item.label}
                                </div>
                                <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
                                  {item.person}
                                </div>
                              </div>
                            </div>
                            {isCurrent ? (
                              <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-fg)', background: 'var(--primary)', padding: '2px 6px', borderRadius: 2, textTransform: 'uppercase' }}>
                                Active
                              </span>
                            ) : isPending ? (
                              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>...</span>
                            ) : null}
                          </button>
                        )
                      })}
                    </div>

                    <div style={{ borderTop: '1px solid var(--line)', marginTop: 4, paddingTop: 4 }}>
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
                          fontWeight: 600,
                          color: 'var(--ink)',
                          textDecoration: 'none',
                          borderRadius: 'var(--r-badge)',
                          background: 'var(--surface-container-low)',
                          border: '1px solid var(--line)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          transition: 'all 0.12s ease',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'var(--primary-accent)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'var(--line)'
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
              className="topbar-search"
              onClick={() => setSearchOpen(true)}
              aria-label="Open global search"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-control)',
                background: 'var(--surface)',
                color: 'var(--text-on-surface-variant)',
                fontSize: '12px',
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--outline-variant)'
                e.currentTarget.style.background = 'var(--surface-container-high)'
                e.currentTarget.style.color = 'var(--ink)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--line)'
                e.currentTarget.style.background = 'var(--surface)'
                e.currentTarget.style.color = 'var(--text-on-surface-variant)'
              }}
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0, opacity: 0.85 }}>
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <span className="search-label-text" style={{ fontWeight: 500, letterSpacing: '0.01em' }}>Search...</span>
              <kbd className="search-shortcut-kbd" style={{
                marginLeft: 6,
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                border: '1px solid var(--line)',
                background: 'var(--surface-container-high)',
                color: 'var(--muted)',
                borderRadius: 3,
                padding: '1px 5px',
                lineHeight: '14px',
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
              }}>
                {isMac ? '⌘K' : 'Ctrl K'}
              </kbd>
            </button>

            {/* Notifications with role-safe routing */}
            <Link
              href={notificationHref}
              id="notification-bell"
              className="topbar-notif-btn"
              aria-label="Notifications"
              title="View notifications"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 34,
                height: 34,
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-control)',
                color: 'var(--text-on-surface-variant)',
                position: 'relative',
                background: 'var(--surface)',
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 2a5 5 0 00-5 5v3l-1 2h12l-1-2V7a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                <path d="M6.5 13a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
            </Link>

            {/* Theme Toggle Button (Light / Dark Mode Switcher) */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 34,
                height: 34,
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-control)',
                color: 'var(--text-on-surface-variant)',
                background: 'var(--surface)',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
            >
              {theme === 'dark' ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            {/* User menu */}
            <div className="topbar-user-section" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', paddingLeft: 'var(--sp-2)', borderLeft: '1px solid var(--line)' }}>
              <div className="desktop-user-info" style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)' }}>
                  {user.email.split('@')[0]}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 500 }}>
                  {ROLE_LABELS[user.role]}
                </div>
              </div>
              <div style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'var(--ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--canvas)',
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {user.email[0]?.toUpperCase()}
              </div>
              <button
                id="sign-out-button"
                className="topbar-signout-btn"
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
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--r-control)',
                  background: 'var(--surface)',
                  color: 'var(--muted)',
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
            background: 'rgba(0, 0, 0, 0.75)',
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
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-control)',
              boxShadow: 'var(--shadow-popover)',
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
              borderBottom: '1px solid var(--line)',
              background: 'var(--surface-container-low)',
            }}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5" stroke="var(--primary)" strokeWidth="1.6"/>
                <path d="M11 11l3.5 3.5" stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              <input
                autoFocus
                type="text"
                className="search-palette-input"
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
                        e.currentTarget.style.background = 'var(--surface-container-high)'
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
                        background: 'var(--surface-container-high)',
                        color: 'var(--ink)',
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
            background: 'rgba(0, 0, 0, 0.7)',
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
              background: 'var(--surface-container-low)',
              borderRight: '1px solid var(--line)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-popover)',
              overflowY: 'auto',
              animation: 'slideDrawerIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              borderBottom: '1px solid var(--line)',
              background: 'var(--surface)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '4px',
                  background: 'var(--chip-verified-bg)',
                  border: '1px solid var(--verified)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                    <path d="M3 13L6.5 8l3 3L13 5l2 4" stroke="#18B6A4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Navigation Menu</span>
              </div>
              <button
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation menu"
                style={{
                  width: 28, height: 28, borderRadius: '4px', border: '1px solid var(--line)',
                  background: 'var(--surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--ink)', fontSize: '13px', fontWeight: 700,
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
