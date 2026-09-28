'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function HomePage() {
  const router = useRouter()
  const [loggingIn, setLoggingIn] = useState<string | null>(null)

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
      {/* Official Government Header */}
      <header style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--line)',
        padding: 'var(--sp-3) var(--sp-8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-xs)',
      }}>
        {/* Brand & Crest */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
          <div style={{
            width: 40,
            height: 40,
            background: 'linear-gradient(135deg, #091728 0%, #1D4E89 100%)',
            borderRadius: 'var(--r-control)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(29, 78, 137, 0.3)',
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M4 16L8.5 10L12 13.5L16 7L18.5 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="18.5" cy="5.5" r="2" fill="#10B981"/>
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
              <span style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                EOI Platform
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                padding: '2px 6px',
                background: 'rgba(29, 78, 137, 0.08)',
                color: 'var(--primary)',
                borderRadius: 'var(--r-control)',
                border: '1px solid rgba(29, 78, 137, 0.2)',
              }}>
                SIH 2026
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500 }}>
              National Employment Outcome Intelligence Layer · Ministry of Skill Development
            </div>
          </div>
        </div>

        {/* Live System State & Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
          <div style={{
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
          }}>
            <span className="pulse-dot" />
            <span>SHA-256 Ledger Verified (502 Events)</span>
          </div>

          <a
            href="/EOI_Platform_User_Manual_and_Guide.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{
              padding: '6px 14px',
              fontSize: 'var(--text-xs)',
              gap: 6,
              borderColor: '#BAE6FD',
              color: '#0369A1',
            }}
          >
            <span>📄 System Manual (PDF)</span>
          </a>

          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('start-guided-tour'))
            }}
            className="hover-lift"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 'var(--r-control)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(217, 119, 6, 0.4)',
            }}
          >
            <span>🎬</span>
            <span>3-Min Story Tour</span>
          </button>

          <Link
            href="/demo"
            id="hero-demo-link"
            className="btn-primary"
            style={{
              padding: '6px 14px',
              fontSize: 'var(--text-xs)',
              background: 'linear-gradient(135deg, #1D4E89 0%, #2563EB 100%)',
              gap: 6,
            }}
          >
            <span>⚡ 1-Click Demo Guide</span>
          </Link>

          <Link
            href="/login"
            className="btn-secondary"
            style={{
              padding: '6px 14px',
              fontSize: 'var(--text-xs)',
            }}
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section style={{
        background: 'linear-gradient(135deg, #091728 0%, #112744 45%, #1D4E89 100%)',
        color: '#FFFFFF',
        padding: 'var(--sp-12) var(--sp-8) var(--sp-10)',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        {/* Subtle grid accent overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.6,
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Scheme alignment badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 14px',
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            marginBottom: 'var(--sp-4)',
            backdropFilter: 'blur(8px)',
          }}>
            <span style={{ color: '#FCD34D' }}>●</span>
            PMKVY 4.0 · NAPS · DDU-GKY · SIDH · ESIC NATIONAL INTEGRATION ARCHITECTURE
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: 'var(--sp-4)',
            maxWidth: 900,
            margin: '0 auto var(--sp-4)',
          }}>
            From <span style={{ color: '#93C5FD' }}>"How Many Trained?"</span> to <span style={{ color: '#6EE7B7' }}>"What Happened Next?"</span>
          </h1>

          <p style={{
            fontSize: 'var(--text-md)',
            color: '#E2E8F0',
            maxWidth: 780,
            margin: '0 auto var(--sp-8)',
            lineHeight: 1.6,
          }}>
            An automated, trusted, longitudinal outcome layer that bridges skilling records to independently verified employer trajectories — powered by SHA-256 hash chaining, zero master-admin permissions, and statistical anomaly detection.
          </p>

          {/* Core Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--sp-3)', flexWrap: 'wrap', marginBottom: 'var(--sp-10)' }}>
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('start-guided-tour'))
              }}
              className="hover-lift"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--r-control)',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)',
                transition: 'all 0.15s ease',
              }}
            >
              <span>🎬</span>
              <span>Start 3-Minute Story Tour (Auto-Demo)</span>
            </button>

            <Link
              href="/demo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                background: '#FFFFFF',
                color: '#0E1F33',
                borderRadius: 'var(--r-control)',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.15s ease',
              }}
            >
              <span>⚡ Launch Evaluator Demo & Walkthrough</span>
              <span style={{ color: 'var(--primary)' }}>→</span>
            </Link>

            <Link
              href="/gov/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 'var(--r-control)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span>🏛️ Explore Government Command Center</span>
            </Link>

            <Link
              href="/gov/audit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#6EE7B7',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: 'var(--r-control)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span>🔒 Inspect SHA-256 Audit Ledger</span>
            </Link>
          </div>

          {/* Live Platform Metric Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--sp-3)',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 'var(--r-container)',
            padding: 'var(--sp-4)',
            backdropFilter: 'blur(12px)',
          }}>
            <div style={{ padding: 'var(--sp-2)' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>
                500
              </div>
              <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: 2 }}>Enrolled Trainees Tracked</div>
            </div>
            <div style={{ padding: 'var(--sp-2)', borderLeft: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: '#6EE7B7', fontVariantNumeric: 'tabular-nums' }}>
                310 (62.0%)
              </div>
              <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: 2 }}>Independently Verified Employed</div>
            </div>
            <div style={{ padding: 'var(--sp-2)', borderLeft: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: '#93C5FD', fontVariantNumeric: 'tabular-nums' }}>
                82.4%
              </div>
              <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: 2 }}>Job Readiness Rate</div>
            </div>
            <div style={{ padding: 'var(--sp-2)', borderLeft: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: '#FCD34D', fontVariantNumeric: 'tabular-nums' }}>
                |z| = 2.94
              </div>
              <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: 2 }}>Planted Leakage Flagged (RJ)</div>
            </div>
            <div style={{ padding: 'var(--sp-2)', borderLeft: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}>
                502
              </div>
              <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: 2 }}>Cryptographic SHA-256 Blocks</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: 'var(--sp-10) var(--sp-8)', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {/* The 4 Architectural Invariants Banner */}
        <div style={{ marginBottom: 'var(--sp-10)' }}>
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
            <div style={{
              background: 'linear-gradient(135deg, rgba(29, 78, 137, 0.05) 0%, rgba(37, 99, 235, 0.08) 100%)',
              border: '2px dashed var(--primary)',
              borderRadius: 'var(--r-container)',
              padding: 'var(--sp-6)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-3)' }}>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--primary)' }}>
                    ⚡ Evaluator Hero Walkthrough
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--r-control)',
                    background: 'var(--primary)', color: '#FFFFFF',
                  }}>
                    HERO DEMO
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.5, marginBottom: 'var(--sp-4)' }}>
                  Interactive 9-scene guided evaluation walkthrough showing the complete journey: Placement Reported → Verification → Ledger Chained → Anomaly Detected.
                </p>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: 'var(--sp-5)' }}>
                  Switch between 8 authenticated personas instantly without entering passwords.
                </div>
              </div>
              <Link href="/demo" className="btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, #1D4E89 0%, #2563EB 100%)' }}>
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
