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

  // Automatically close mobile navigation drawer when user navigates
  useEffect(() => {
    setMobileNavOpen(false)
  }, [pathname])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(prev => !prev)
      } else if (e.key === 'Escape') {
        setSearchOpen(false)
        setMobileNavOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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

        {/* Top bar */}
        <header className="topbar" role="banner" style={{
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 1px 3px rgba(14, 31, 51, 0.05)',
        }}>
          {/* Left: Hamburger menu (mobile only) + Ministry Emblem & Ledger state indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            {/* Mobile Hamburger Drawer Toggle */}
            <button
              id="mobile-nav-toggle"
              className="mobile-only-btn hover-lift"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
              style={{
                width: 34,
                height: 34,
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-control)',
                background: 'var(--canvas)',
                color: 'var(--ink)',
                display: 'none',
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

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 'var(--r-control)',
                background: 'linear-gradient(135deg, #091728 0%, #1D4E89 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(29, 78, 137, 0.25)',
                flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 10l3-4 2.5 2.5L10 4l2 4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.15, whiteSpace: 'nowrap' }}>
                  National Outcome Intelligence
                </div>
                <div className="topbar-branding-subtext" style={{ fontSize: '10px', color: 'var(--muted)', lineHeight: 1.2 }}>
                  Ministry of Skill Development & Entrepreneurship
                </div>
              </div>
            </div>

            <Link
              href="/gov/audit"
              className="topbar-ledger-pill"
              title="Inspect Cryptographic SHA-256 Audit Ledger"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--verified)',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                marginLeft: 'var(--sp-2)',
              }}
            >
              <span className="pulse-dot" />
              <span>SHA-256 Ledger Verified</span>
              <span style={{ color: 'var(--muted)', fontWeight: 400, borderLeft: '1px solid var(--line)', paddingLeft: 6 }}>
                502 Events
              </span>
            </Link>
          </div>

          {/* Right: Quick Switcher, Search, Notifications, User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            {/* 1-Click Role Switcher for Evaluators */}
            <Link
              href="/demo"
              id="evaluator-demo-switcher"
              className="hover-lift"
              title="Switch roles & evaluate personas"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                background: 'linear-gradient(135deg, #1D4E89 0%, #2563EB 50%, #3B82F6 100%)',
                color: '#FFFFFF',
                borderRadius: 'var(--r-control)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)',
                transition: 'all 0.18s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6.5 1.5L2 7h4l-0.5 4.5L10 6H6l0.5-4.5z" fill="#FCD34D"/>
              </svg>
              <span>⚡ Switch Role</span>
            </Link>

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
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-control)',
                background: 'var(--canvas)',
                color: 'var(--muted)',
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
                border: '1px solid var(--line)',
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
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-control)',
                color: 'var(--muted)',
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

            {/* User menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', paddingLeft: 'var(--sp-2)', borderLeft: '1px solid var(--line)' }}>
              <div className="desktop-user-info" style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)' }}>
                  {user.email.split('@')[0]}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 500 }}>
                  {ROLE_LABELS[user.role]}
                </div>
              </div>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 'var(--text-xs)',
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
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--r-control)',
                  background: 'transparent',
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

      {/* Global Command Palette Modal (⌘K) */}
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
            background: 'rgba(9, 23, 40, 0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
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
              borderRadius: 'var(--r-container)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
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
              background: 'var(--canvas)',
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
            background: 'rgba(14, 31, 51, 0.55)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 90,
            display: 'flex',
          }}
        >
          <div
            className="mobile-drawer-panel"
            onClick={e => e.stopPropagation()}
            style={{
              width: 'min(300px, 85vw)',
              height: '100%',
              background: 'var(--surface)',
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
              background: 'var(--canvas)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 'var(--r-control)',
                  background: 'linear-gradient(135deg, #112744 0%, #1D4E89 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                    <path d="M3 13L6.5 8l3 3L13 5l2 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink)' }}>Navigation Menu</span>
              </div>
              <button
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation menu"
                style={{
                  width: 28, height: 28, borderRadius: 'var(--r-control)', border: '1px solid var(--line)',
                  background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--muted)', fontSize: '13px', fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <SideNav role={user.role} onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
