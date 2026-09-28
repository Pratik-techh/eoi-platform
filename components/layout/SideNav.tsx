'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ActorRole } from '@/lib/supabase/database.types'

// ─── Nav configuration per role ──────────────────────────────────────────────

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string  // e.g. "SIMULATION" label
}

type NavGroup = {
  heading: string
  items: NavItem[]
}

function getNav(role: ActorRole): NavGroup[] {
  switch (role) {
    case 'gov_analyst':
      return [
        {
          heading: 'National Intelligence',
          items: [
            { label: 'Dashboard', href: '/gov/dashboard', icon: <DashboardIcon /> },
            { label: 'Outcome Funnel', href: '/gov/funnel', icon: <FunnelIcon /> },
            { label: 'Leakage Engine', href: '/gov/leakage', icon: <LeakageIcon /> },
            { label: 'Program Intelligence', href: '/gov/programs', icon: <ProgramIcon /> },
            { label: 'Agency Intelligence', href: '/gov/agencies', icon: <AgencyIcon /> },
            { label: 'Skill Intelligence', href: '/gov/skills', icon: <SkillIcon /> },
            { label: 'Regional Intelligence', href: '/gov/regions', icon: <RegionIcon /> },
          ],
        },
        {
          heading: 'Analytical Tools',
          items: [
            { label: 'Scenario Simulator', href: '/gov/simulator', icon: <SimIcon />, badge: 'SIM' },
            { label: 'AI Analyst', href: '/gov/ai', icon: <AIIcon /> },
            { label: 'Audit Explorer', href: '/gov/audit', icon: <AuditIcon /> },
            { label: 'Integrations', href: '/integrations', icon: <IntegrationIcon /> },
          ],
        },
      ]

    case 'gov_program_admin':
      return [
        {
          heading: 'Program Governance',
          items: [
            { label: 'Program Intelligence', href: '/gov/programs', icon: <ProgramIcon /> },
            { label: 'Agency Oversight', href: '/gov/agencies', icon: <AgencyIcon /> },
            { label: 'Governance Queue', href: '/gov/governance', icon: <GovernanceIcon /> },
            { label: 'Policy Simulator', href: '/gov/simulator', icon: <SimIcon />, badge: 'SIM' },
          ],
        },
        {
          heading: 'Intelligence Overview',
          items: [
            { label: 'Dashboard', href: '/gov/dashboard', icon: <DashboardIcon /> },
            { label: 'Outcome Funnel', href: '/gov/funnel', icon: <FunnelIcon /> },
            { label: 'Skill Intelligence', href: '/gov/skills', icon: <SkillIcon /> },
            { label: 'Integrations', href: '/integrations', icon: <IntegrationIcon /> },
          ],
        },
      ]

    case 'gov_auditor':
      return [
        {
          heading: 'Audit & Integrity',
          items: [
            { label: 'Audit Ledger Explorer', href: '/gov/audit', icon: <AuditIcon /> },
            { label: 'Anomaly Signals', href: '/platform/anomalies', icon: <AnomalyIcon /> },
            { label: 'Governance Reviews', href: '/gov/governance', icon: <GovernanceIcon /> },
            { label: 'Platform Health', href: '/platform/health', icon: <HealthIcon /> },
          ],
        },
        {
          heading: 'Outcome Trajectories',
          items: [
            { label: 'Outcome Funnel', href: '/gov/funnel', icon: <FunnelIcon /> },
            { label: 'Leakage Anomaly Engine', href: '/gov/leakage', icon: <LeakageIcon /> },
            { label: 'Integrations Architecture', href: '/integrations', icon: <IntegrationIcon /> },
          ],
        },
      ]

    case 'agency_admin':
      return [
        {
          heading: 'Academy Management',
          items: [
            { label: 'Dashboard', href: '/agency/dashboard', icon: <DashboardIcon /> },
            { label: 'Course Curricula', href: '/agency/courses', icon: <CourseIcon /> },
            { label: 'Student Cohorts', href: '/agency/students', icon: <StudentIcon /> },
            { label: 'Performance Analytics', href: '/agency/analytics', icon: <AnalyticsIcon /> },
          ],
        },
        {
          heading: 'Verification Inbox',
          items: [
            { label: 'Agency Inbox', href: '/agency/inbox', icon: <InboxIcon /> },
            { label: 'Report Employment', href: '/agency/employment/report', icon: <EmploymentIcon /> },
          ],
        },
      ]

    case 'agency_officer':
      return [
        {
          heading: 'Student Lifecycle',
          items: [
            { label: 'Dashboard', href: '/agency/dashboard', icon: <DashboardIcon /> },
            { label: 'Enrolled Students', href: '/agency/students', icon: <StudentIcon /> },
            { label: 'Continuous Assessments', href: '/agency/assessments', icon: <AssessmentIcon /> },
            { label: 'Job Readiness Bands', href: '/agency/readiness', icon: <ReadinessIcon /> },
          ],
        },
        {
          heading: 'Placement Submissions',
          items: [
            { label: 'Report Employment', href: '/agency/employment/report', icon: <EmploymentIcon /> },
            { label: 'Verification Inbox', href: '/agency/inbox', icon: <InboxIcon /> },
          ],
        },
      ]

    case 'student':
      return [
        {
          heading: 'My Profile',
          items: [
            { label: 'Dashboard', href: '/student/dashboard', icon: <DashboardIcon /> },
            { label: 'Employment History', href: '/student/history', icon: <HistoryIcon /> },
            { label: 'Employability Passport', href: '/student/passport', icon: <PassportIcon /> },
            { label: 'Skill Gap', href: '/student/skills', icon: <SkillIcon /> },
          ],
        },
        {
          heading: 'Actions',
          items: [
            { label: 'Disputes', href: '/student/disputes', icon: <DisputeIcon /> },
            { label: 'Notifications', href: '/student/notifications', icon: <NotifIcon /> },
          ],
        },
      ]

    case 'employer_admin':
      return [
        {
          heading: 'Enterprise Administration',
          items: [
            { label: 'Dashboard', href: '/employer/dashboard', icon: <DashboardIcon /> },
            { label: 'Organization & Legal', href: '/employer/organization', icon: <OrgIcon /> },
            { label: 'Verifier Delegation', href: '/employer/organization#verifiers', icon: <VerifyIcon /> },
          ],
        },
        {
          heading: 'Market Signals & Oversight',
          items: [
            { label: 'Industry Skill Feedback', href: '/employer/feedback', icon: <FeedbackIcon /> },
            { label: 'Verification Queue', href: '/employer/verification', icon: <VerifyIcon />, badge: 'Admin' },
          ],
        },
      ]

    case 'employer_verifier':
      return [
        {
          heading: 'Verification Tasks',
          items: [
            { label: 'Verification Queue', href: '/employer/verification', icon: <VerifyIcon /> },
            { label: 'Dashboard', href: '/employer/dashboard', icon: <DashboardIcon /> },
          ],
        },
        {
          heading: 'Organization',
          items: [
            { label: 'Organization Identity', href: '/employer/organization', icon: <OrgIcon /> },
            { label: 'Industry Feedback', href: '/employer/feedback', icon: <FeedbackIcon /> },
          ],
        },
      ]

    case 'security_officer':
      return [
        {
          heading: 'Security Operations',
          items: [
            { label: 'Security Events', href: '/platform/security', icon: <SecurityIcon /> },
            { label: 'Anomaly Signals', href: '/platform/anomalies', icon: <AnomalyIcon /> },
            { label: 'System Health', href: '/platform/health', icon: <HealthIcon /> },
          ],
        },
      ]

    case 'platform_ops':
      return [
        {
          heading: 'Infrastructure & Ops',
          items: [
            { label: 'System Health', href: '/platform/health', icon: <HealthIcon /> },
            { label: 'Security Telemetry', href: '/platform/security', icon: <SecurityIcon /> },
            { label: 'Anomaly Sweep', href: '/platform/anomalies', icon: <AnomalyIcon /> },
          ],
        },
      ]

    default:
      return []
  }
}

// ─── Icon stubs (inline SVG for zero external dependency) ────────────────────

function DashboardIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg>
}
function FunnelIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M1 3h14M3 7h10M5 11h6M7 15h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
}
function LeakageIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2v12M4 5l4-3 4 3M4 11l4 3 4-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function ProgramIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M5 8h6M5 5h6M5 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
}
function AgencyIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2L2 6v8h4v-4h4v4h4V6L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
}
function SkillIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
}
function RegionIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M2 8h12M8 2c-2 2-2 10 0 12M8 2c2 2 2 10 0 12" stroke="currentColor" strokeWidth="1.3"/></svg>
}
function SimIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 12l3-5 3 3 3-7 3 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function AIIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M5 13c0-1.66 1.34-3 3-3s3 1.34 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
}
function AuditIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M5 6h6M5 9h4M5 12h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
}
function GovernanceIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1L1 5v1h14V5L8 1zM2 6v7h12V6" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><rect x="6" y="10" width="4" height="3" stroke="currentColor" strokeWidth="1.3"/></svg>
}
function IntegrationIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/><circle cx="12" cy="4" r="2" stroke="currentColor" strokeWidth="1.3"/><circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.3"/><path d="M6 8h2l2-3M6 8h2l2 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
}
function StudentIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2 14c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
}
function CourseIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M5 7h6M5 10h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
}
function AssessmentIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 7l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg>
}
function ReadinessIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 12L6 5l3 4 2-3 2 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function EmploymentIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="6" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M5 6V4a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
}
function InboxIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M2 10h3l2 2 2-2h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function AnalyticsIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 13l3-4 3 2 3-5 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function HistoryIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
}
function PassportIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="3" y="1" width="10" height="14" rx="1" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="7" r="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5 12h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
}
function DisputeIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2L2 13h12L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M8 7v3M8 11.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
}
function NotifIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2a5 5 0 00-5 5v3l-1 2h12l-1-2V7a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/><path d="M6.5 13a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3"/></svg>
}
function VerifyIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function OrgIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="4" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.3"/><path d="M5 4V3a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.3"/></svg>
}
function FeedbackIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 2h10a1 1 0 011 1v7a1 1 0 01-1 1H5l-3 3V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
}
function SecurityIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 2L3 4v5c0 3 2 5 5 6 3-1 5-3 5-6V4L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
}
function AnomalyIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 5v4M8 10.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
}
function HealthIcon() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h3l2-5 3 10 2-5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

// ─── SideNav component ────────────────────────────────────────────────────────

type SideNavProps = {
  role: ActorRole
  collapsed?: boolean
  onNavigate?: () => void
}

export function SideNav({ role, collapsed = false, onNavigate }: SideNavProps) {
  const pathname = usePathname()
  const groups = getNav(role)

  return (
    <nav
      aria-label="Main navigation"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        paddingTop: 'var(--sp-2)',
      }}
    >
      {/* Brand header */}
      <div style={{
        padding: collapsed ? 'var(--sp-3) var(--sp-2)' : 'var(--sp-4) var(--sp-4)',
        borderBottom: '1px solid var(--line)',
        marginBottom: 'var(--sp-3)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--sp-3)',
        background: 'linear-gradient(180deg, #FAFCFF 0%, #FFFFFF 100%)',
      }}>
        <div style={{
          width: 32,
          height: 32,
          background: 'linear-gradient(135deg, #112744 0%, #1D4E89 100%)',
          borderRadius: 'var(--r-control)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 2px 6px rgba(29, 78, 137, 0.25)',
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M3 13L6.5 8l3 3L13 5l2 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="15" cy="4" r="1.8" fill="#10B981"/>
          </svg>
        </div>
        {!collapsed && (
          <div>
            <div style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              color: 'var(--ink)',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
            }}>
              EOI Platform
            </div>
            <div style={{
              fontSize: '10px',
              fontWeight: 500,
              color: 'var(--muted)',
              lineHeight: 1.2,
              marginTop: 2,
            }}>
              Outcome Intelligence · SIH 26
            </div>
          </div>
        )}
      </div>

      {/* Nav groups */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--sp-2)' }}>
        {groups.map((group) => (
          <div key={group.heading} style={{ marginBottom: 'var(--sp-4)' }}>
            {!collapsed && (
              <div style={{
                fontSize: '10px',
                fontWeight: 700,
                color: 'var(--muted)',
                padding: 'var(--sp-1) var(--sp-3)',
                marginBottom: 'var(--sp-1)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                {group.heading}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={isActive ? 'page' : undefined}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--sp-2)',
                    padding: collapsed ? '8px' : '7px 12px',
                    borderRadius: 'var(--r-control)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--primary)' : 'var(--ink)',
                    background: isActive ? 'linear-gradient(90deg, rgba(29, 78, 137, 0.12) 0%, rgba(29, 78, 137, 0.03) 100%)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    marginBottom: 2,
                    transform: isActive ? 'translateX(2px)' : 'none',
                  }}
                >
                  <span style={{
                    flexShrink: 0,
                    color: isActive ? 'var(--primary)' : 'var(--muted)',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 0.15s ease',
                  }}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <>
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="sim-label" style={{ fontSize: '9px', padding: '1px 5px' }}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      {/* Bottom Trust & Evaluator status card */}
      {!collapsed && (
        <div style={{
          padding: 'var(--sp-3)',
          paddingBottom: 'var(--sp-6)',
          borderTop: '1px solid var(--line)',
          background: 'var(--canvas)',
        }}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-control)',
            padding: '10px 12px',
            fontSize: '11px',
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            boxShadow: '0 1px 3px rgba(14, 31, 51, 0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="pulse-dot" style={{ width: 6, height: 6 }} />
                Ledger Chain
              </span>
              <span style={{ color: 'var(--verified)', fontWeight: 800, fontSize: '10px', letterSpacing: '0.04em' }}>
                VERIFIED
              </span>
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '10px' }}>
              Zero Master-Admin Active
            </div>
            <Link
              href="/demo"
              className="hover-lift"
              style={{
                marginTop: 4,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                padding: '5px 10px',
                background: 'linear-gradient(135deg, rgba(29, 78, 137, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
                color: 'var(--primary)',
                border: '1px solid rgba(29, 78, 137, 0.2)',
                borderRadius: 'var(--r-control)',
                fontSize: '11px',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.18s ease',
              }}
            >
              <span>⚡ Switch Persona</span>
            </Link>
          </div>
          <div style={{
            fontSize: '10px',
            color: 'var(--muted)',
            marginTop: 8,
            textAlign: 'center',
          }}>
            Synthetic data · Prototype
          </div>
        </div>
      )}
    </nav>
  )
}

