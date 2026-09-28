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
      background: '#0F0F0F',
      border: '1px solid #242424',
      borderLeft: '2px solid #E05252',
      borderRadius: 'var(--r-control)',
      padding: 'var(--sp-4) var(--sp-5)',
      marginBottom: 'var(--sp-6)',
      transition: 'border-color 0.15s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
        <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-start', flex: 1, minWidth: 'min(280px, 100%)' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 'var(--r-badge)',
            background: '#151515',
            border: '1px solid rgba(224, 82, 82, 0.4)',
            color: '#E05252',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            marginTop: 2,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E05252', boxShadow: '0 0 6px rgba(224, 82, 82, 0.5)' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 600, padding: '2px 8px', borderRadius: 2,
                background: '#151515', color: '#E05252', border: '1px solid rgba(224, 82, 82, 0.4)', letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                Statistical Anomaly
              </span>
              <h3 style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#FFFFFF', margin: 0, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                LEAKAGE DETECTED: {stageFrom} → {stageTo}
              </h3>
              <span style={{
                fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 500, color: '#E05252',
                background: '#080808', border: '1px solid #242424', padding: '1px 6px', borderRadius: 2,
              }}>
                z = {zScore.toFixed(1)}σ
              </span>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-on-surface)', marginTop: 6, lineHeight: 1.45, margin: '6px 0 4px 0' }}>
              <strong>Statistical finding:</strong> This cohort exhibits an unusually high conversion loss. Verified placement is <strong style={{ color: '#E05252' }}>{observedRate}%</strong> vs national peer baseline of <strong style={{ color: '#18B6A4' }}>{baselineRate}%</strong> (|z|: <strong>{zScore.toFixed(1)}</strong>, threshold 2.0σ).
            </p>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
              SCOPE: {programName} · REGION: {region} · COHORT: {sampleSize} CANDIDATES
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'center', flexShrink: 0 }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              padding: '6px 12px', background: '#080808', border: '1px solid #242424',
              borderRadius: 'var(--r-badge)', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--text-on-surface)',
              cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em',
            }}
          >
            {expanded ? 'Hide Evidence ↑' : 'Inspect Evidence ↓'}
          </button>
          <Link
            href="/gov/leakage"
            style={{
              padding: '6px 14px', background: '#FFFFFF', border: '1px solid #FFFFFF',
              color: '#000000', borderRadius: 'var(--r-badge)', fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 600,
              textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em',
            }}
          >
            Drill-down →
          </Link>
        </div>
      </div>

      {expanded && (
        <div style={{
          marginTop: 'var(--sp-4)', paddingTop: 'var(--sp-4)', borderTop: '1px solid #242424',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--sp-4)',
        }}>
          <div style={{ background: '#080808', padding: 'var(--sp-3)', borderRadius: 'var(--r-badge)', border: '1px solid #242424' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              RECURRING EMPLOYER FEEDBACK
            </div>
            <div style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 600, marginTop: 4 }}>
              Top Missing Skills:
            </div>
            <ul style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-on-surface-variant)', paddingLeft: 18, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <li>SQL & Databases (84% demand gap)</li>
              <li>REST API Architecture (78% demand gap)</li>
              <li>Technical Workplace Communication</li>
            </ul>
          </div>

          <div style={{ background: '#080808', padding: 'var(--sp-3)', borderRadius: 'var(--r-badge)', border: '1px solid #242424' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              CONFIDENCE INTERVAL & DATA SOURCE
            </div>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-on-surface)', marginTop: 4 }}>
              Confidence Interval: <strong style={{ color: '#FFFFFF' }}>16.2% – 20.4%</strong> (95% CI)
            </div>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginTop: 4 }}>
              Calculated via z-score metric v1.2 over 420 verified candidate interview events across 3 quarters.
            </div>
          </div>

          <div style={{ background: '#080808', padding: 'var(--sp-3)', borderRadius: 'var(--r-badge)', border: '1px solid #242424' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              RECOMMENDED NEXT STEP
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-on-surface)', marginTop: 4 }}>
              Simulate curriculum capacity adjustment or initiate curriculum relevance review.
            </div>
            <Link
              href="/gov/simulator"
              style={{ display: 'inline-block', fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#18B6A4', fontWeight: 600, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}
            >
              Run Scenario Simulator →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
