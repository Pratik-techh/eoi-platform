'use client'

import { useState } from 'react'
import Link from 'next/link'

interface LeakageCalloutProps {
  stageFrom?: string
  stageTo?: string
  programName?: string
  region?: string
  zScore?: number
  baselineRate?: number
  observedRate?: number
  sampleSize?: number
}

export function LeakageCallout({
  stageFrom = 'Interviewed',
  stageTo = 'Employed',
  programName = 'Software Engineering Fundamentals',
  region = 'Rajasthan / Jaipur',
  zScore = 3.2,
  baselineRate = 68.4,
  observedRate = 18.2,
  sampleSize = 420,
}: LeakageCalloutProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{
      background: 'linear-gradient(180deg, #FEF2F2 0%, #FFFFFF 100%)',
      border: '1px solid #FECACA',
      borderLeft: '4px solid #DC2626',
      borderRadius: 'var(--r-container)',
      padding: 'var(--sp-4) var(--sp-5)',
      marginBottom: 'var(--sp-6)',
      boxShadow: '0 2px 8px -2px rgba(220, 38, 38, 0.08)',
      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
        <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-start', flex: 1, minWidth: 'min(280px, 100%)' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--r-control)',
            background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
            color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            marginTop: 2,
            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.25)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: 'var(--r-control)',
                background: '#DC2626', color: 'white', letterSpacing: '0.04em',
              }}>
                STATISTICAL ANOMALY
              </span>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: '#991B1B', margin: 0 }}>
                HIGH LEAKAGE: {stageFrom.toUpperCase()} → {stageTo.toUpperCase()}
              </h3>
              <span style={{
                fontSize: '11px', fontWeight: 700, color: '#DC2626',
                background: 'rgba(220, 38, 38, 0.1)', padding: '1px 6px', borderRadius: 3,
              }}>
                z = {zScore.toFixed(1)}σ
              </span>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink)', marginTop: 6, lineHeight: 1.45, margin: '6px 0 4px 0' }}>
              <strong>Statistical finding:</strong> This cohort exhibits an unusually high conversion loss. Verified placement is <strong>{observedRate}%</strong> vs national peer baseline of <strong>{baselineRate}%</strong> (|z|: <strong>{zScore.toFixed(1)}</strong>, well above the 2.0σ threshold).
            </p>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>
              Scope: <strong>{programName}</strong> · Region: <strong>{region}</strong> · Evaluated cohort: <strong>{sampleSize} candidates</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'center', flexShrink: 0 }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              padding: '6px 12px', background: 'var(--surface)', border: '1px solid #FECACA',
              borderRadius: 'var(--r-control)', fontSize: 'var(--text-xs)', fontWeight: 600, color: '#991B1B',
              cursor: 'pointer', fontFamily: 'var(--font-ui)', transition: 'all 0.15s ease',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            {expanded ? 'Hide evidence ↑' : 'Inspect evidence ↓'}
          </button>
          <Link
            href="/gov/leakage"
            style={{
              padding: '6px 14px', background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
              color: 'white', borderRadius: 'var(--r-control)', fontSize: 'var(--text-xs)', fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.15s ease', boxShadow: '0 2px 5px rgba(220, 38, 38, 0.25)',
            }}
          >
            Drill-down engine →
          </Link>
        </div>
      </div>

      {expanded && (
        <div style={{
          marginTop: 'var(--sp-4)', paddingTop: 'var(--sp-4)', borderTop: '1px solid var(--chip-disputed-border)',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--sp-4)',
        }}>
          <div style={{ background: 'var(--surface)', padding: 'var(--sp-3)', borderRadius: 'var(--r-control)', border: '1px solid var(--line)' }}>
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>RECURRING EMPLOYER FEEDBACK</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink)', fontWeight: 600, marginTop: 4 }}>
              Top Missing Skills:
            </div>
            <ul style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', paddingLeft: 18, marginTop: 4 }}>
              <li>SQL & Databases (84% employer demand gap)</li>
              <li>REST API Architecture (78% demand gap)</li>
              <li>Workplace English Communication</li>
            </ul>
          </div>

          <div style={{ background: 'var(--surface)', padding: 'var(--sp-3)', borderRadius: 'var(--r-control)', border: '1px solid var(--line)' }}>
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>CONFIDENCE INTERVAL & DATA SOURCE</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink)', marginTop: 4 }}>
              Confidence Interval: <strong>16.2% – 20.4%</strong> (95% CI)
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4 }}>
              Calculated using IQR / z-score metric v1.2 over 420 verified candidate interview events across 3 quarters.
            </div>
          </div>

          <div style={{ background: 'var(--surface)', padding: 'var(--sp-3)', borderRadius: 'var(--r-control)', border: '1px solid var(--line)' }}>
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>RECOMMENDED NEXT STEP</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink)', marginTop: 4 }}>
              Simulate curriculum capacity adjustment or initiate curriculum relevance review with authorized regional officers.
            </div>
            <Link
              href="/gov/simulator"
              style={{ display: 'inline-block', fontSize: '11px', color: 'var(--primary)', fontWeight: 600, marginTop: 6 }}
            >
              Run Scenario Simulator →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
