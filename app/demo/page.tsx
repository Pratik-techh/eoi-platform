'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DEMO_ACCOUNTS } from '@/lib/db/store'

export default function DemoGuidePage() {
  const router = useRouter()
  const [switching, setSwitching] = useState<string | null>(null)

  async function handleSwitchAccount(email: string) {
    setSwitching(email)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'Demo@EOI2026' }),
    })
    setSwitching(null)
    if (res.ok) {
      router.refresh()
      const roleMap: Record<string, string> = {
        gov_analyst: '/gov/dashboard',
        gov_program_admin: '/gov/programs',
        gov_auditor: '/gov/audit',
        agency_admin: '/agency/dashboard',
        agency_officer: '/agency/dashboard',
        student: '/student/dashboard',
        employer_admin: '/employer/organization',
        employer_verifier: '/employer/verification',
        security_officer: '/platform/security',
        platform_ops: '/platform/health',
      }
      const found = DEMO_ACCOUNTS.find(a => a.email === email)
      const target: string = (found && roleMap[found.role]) || '/gov/dashboard'
      router.push(target)
    }
  }

  const scenes = [
    {
      num: 1,
      title: 'Government Dashboard',
      actor: 'gov.analyst@eoi.demo',
      desc: 'National aggregate: ~10,000 enrolled / ~3,120 verified employed. Highlights major outcome drop-off.',
      target: '/gov/dashboard',
    },
    {
      num: 2,
      title: 'Outcome Leakage Engine',
      actor: 'gov.analyst@eoi.demo',
      desc: 'Statistical IQR / z-score detection: HIGH LEAKAGE in Rajasthan / Software Engineering. Drill-down evidence.',
      target: '/gov/leakage',
    },
    {
      num: 3,
      title: 'Student X Profile',
      actor: 'student.x@eoi.demo',
      desc: 'Arjun Singh (Student X) profile showing VERIFIED EMPLOYED at Google India Pvt. Ltd. (joined 12 Aug 2026).',
      target: '/student/dashboard',
    },
    {
      num: 4,
      title: 'Report Unemployment Lifecycle',
      actor: 'student.x@eoi.demo',
      desc: 'Student reports departure. State transitions to UNEMPLOYMENT_REPORTED. Prior Google employment remains preserved.',
      target: '/student/dashboard',
    },
    {
      num: 5,
      title: 'Employer Verification Queue',
      actor: 'employer.verifier@eoi.demo',
      desc: 'Google verifier receives Student X unemployment reconciliation request in realtime queue.',
      target: '/employer/verification',
    },
    {
      num: 6,
      title: 'Employer Confirms Departure',
      actor: 'employer.verifier@eoi.demo',
      desc: 'Verifier clicks Confirm Departure. Backend auto-transitions state to VERIFIED_UNEMPLOYED and signs hash-chained event.',
      target: '/employer/verification',
    },
    {
      num: 7,
      title: 'Realtime Recalculation & Ledger',
      actor: 'gov.auditor@eoi.demo',
      desc: 'Government audit explorer shows ANALYTICS_RECALCULATED event signed with sequential SHA-256 hash.',
      target: '/gov/audit',
    },
    {
      num: 8,
      title: 'Skill Intelligence Demand Deficit',
      actor: 'gov.analyst@eoi.demo',
      desc: 'System surfaces recurring missing skills (SQL, REST APIs, Workplace English) from enterprise feedback.',
      target: '/gov/skills',
    },
    {
      num: 9,
      title: 'Scenario Simulation',
      actor: 'gov.admin@eoi.demo',
      desc: 'Government runs Scenario Simulator with capacity expansion and bridge module. Outputs clearly labelled SIMULATION.',
      target: '/gov/simulator',
    },
  ]

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: 'var(--sp-8) var(--sp-4)' }}>
      <div style={{ marginBottom: 'var(--sp-6)' }}>
        <div style={{
          display: 'inline-block', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: 'var(--r-control)',
          background: 'var(--primary)', color: 'white', letterSpacing: '0.05em', marginBottom: 'var(--sp-2)',
        }}>
          SIH 2026 EVALUATION GUIDE
        </div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--ink)' }}>
          Hero Demo Walkthrough & 1-Click Role Switcher
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--sp-3)', marginTop: 'var(--sp-3)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', margin: 0 }}>
            Experience the complete <code>TRUST → TRAJECTORY → INTELLIGENCE → ACTION</code> loop across all 9 interactive scenes (MASTER_PROMPT §15.2).
          </p>
          <a
            href="/EOI_Platform_User_Manual_and_Guide.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              padding: '8px 16px',
              fontSize: 'var(--text-xs)',
              gap: 8,
              background: 'linear-gradient(135deg, #091728 0%, #1D4E89 100%)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span>📄 Download Official Manual & Guide (PDF)</span>
          </a>
        </div>
      </div>

      {/* 1-Click Role Switcher Bar */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
        padding: 'var(--sp-5)', marginBottom: 'var(--sp-8)',
      }}>
        <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)', marginBottom: 'var(--sp-3)' }}>
          Instant Role Switcher (No Password Required)
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
          {DEMO_ACCOUNTS.map(acc => (
            <button
              key={acc.email}
              id={`switch-${acc.role}`}
              disabled={switching === acc.email}
              onClick={() => handleSwitchAccount(acc.email)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-2)',
                padding: '6px 12px', background: 'var(--canvas)', border: '1px solid var(--line)',
                borderRadius: 'var(--r-control)', fontSize: 'var(--text-xs)', fontWeight: 600,
                color: 'var(--ink)', cursor: 'pointer', fontFamily: 'var(--font-ui)',
              }}
            >
              <span>{acc.name}</span>
              <span style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                ({acc.role})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Hero Demo 9 Scenes Interactive Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
        {scenes.map(sc => (
          <div
            key={sc.num}
            style={{
              background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
              padding: 'var(--sp-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-4)',
            }}
          >
            <div style={{ display: 'flex', gap: 'var(--sp-4)', alignItems: 'flex-start' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 'var(--text-sm)',
                flexShrink: 0,
              }}>
                {sc.num}
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)' }}>
                  Scene {sc.num}: {sc.title}
                </h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 2, maxWidth: '600px' }}>
                  {sc.desc}
                </p>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                  Account: <strong>{sc.actor}</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSwitchAccount(sc.actor)}
              style={{
                padding: '8px 16px', background: 'var(--primary)', color: 'white',
                border: 'none', borderRadius: 'var(--r-control)', fontSize: 'var(--text-xs)', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-ui)',
              }}
            >
              Switch & Run Scene {sc.num} →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
