'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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

export default function AppShell({ user, children }: { user: AppUser; children: React.ReactNode }) {
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

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
          {/* Left: Ministry Emblem & Ledger state indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 'var(--r-control)',
                background: 'linear-gradient(135deg, #091728 0%, #1D4E89 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(29, 78, 137, 0.25)',
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 10l3-4 2.5 2.5L10 4l2 4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.15 }}>
                  National Outcome Intelligence
                </div>
                <div style={{ fontSize: '10px', color: 'var(--muted)', lineHeight: 1.2 }}>
                  Ministry of Skill Development & Entrepreneurship
                </div>
              </div>
            </div>

            <Link
              href="/gov/audit"
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
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
                minWidth: 160,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Search…
              <kbd style={{
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

            {/* Notifications */}
            <Link
              href={user.role === 'student' ? '/student/notifications' : '/gov/governance'}
              id="notification-bell"
              aria-label="Notifications"
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
              }}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 2a5 5 0 00-5 5v3l-1 2h12l-1-2V7a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                <path d="M6.5 13a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
            </Link>

            {/* User menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', paddingLeft: 'var(--sp-2)', borderLeft: '1px solid var(--line)' }}>
              <div style={{ textAlign: 'right' }}>
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
    </div>
  )
}
