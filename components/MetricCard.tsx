'use client'

import { useState } from 'react'

type MetricProvenance = {
  formula: string
  numerator: string
  denominator: string
  inclusions: string[]
  exclusions: string[]
  calculationVersion: string
  calculatedAt: string
  dataState: 'verified_only' | 'includes_pending' | 'all'
  pendingCount?: number
  disputedCount?: number
  excludedCount?: number
}

type MetricCardProps = {
  id: string
  label: string
  value: string | number
  /** E.g. "+2.3 pp vs last month" */
  delta?: string
  deltaDirection?: 'up' | 'down' | 'neutral'
  /** Positive or negative semantic — e.g. 'up' is good for employment rate, bad for dropout rate */
  deltaGood?: boolean
  unit?: string
  dataState?: 'verified_only' | 'includes_pending' | 'all'
  provenance?: MetricProvenance
  loading?: boolean
}

const DATA_STATE_LABELS: Record<string, string> = {
  verified_only:    'Verified only',
  includes_pending: 'Includes pending',
  all:              'All records',
}

const DATA_STATE_COLORS: Record<string, string> = {
  verified_only:    '#18B6A4',
  includes_pending: '#D99A32',
  all:              '#8E9192',
}

const DATA_STATE_HALOS: Record<string, string> = {
  verified_only:    '0 0 6px rgba(24, 182, 164, 0.45)',
  includes_pending: '0 0 6px rgba(217, 154, 50, 0.45)',
  all:              'none',
}

export function MetricCard({
  id,
  label,
  value,
  delta,
  deltaDirection = 'neutral',
  deltaGood = true,
  unit,
  dataState = 'verified_only',
  provenance,
  loading = false,
}: MetricCardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const deltaColor =
    deltaDirection === 'neutral' ? 'var(--muted)' :
    deltaDirection === 'up' && deltaGood ? '#18B6A4' :
    deltaDirection === 'up' && !deltaGood ? '#E05252' :
    deltaDirection === 'down' && deltaGood ? '#E05252' :
    '#18B6A4'

  return (
    <>
      <div
        className="metric-card"
        id={id}
        role="region"
        aria-label={`${label} metric`}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-control)',
          padding: '16px',
        }}
      >
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            <div style={{ height: 12, background: 'var(--surface-container-high)', borderRadius: 2, width: '60%' }} />
            <div style={{ height: 32, background: 'var(--surface-container-high)', borderRadius: 2, width: '40%' }} />
          </div>
        ) : (
          <>
            {/* Label and Diode Telemetry Row (Stitch Precision Spec) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div className="metric-card__label" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {label}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: DATA_STATE_COLORS[dataState],
                    boxShadow: DATA_STATE_HALOS[dataState],
                    display: 'inline-block',
                  }}
                  title={DATA_STATE_LABELS[dataState]}
                />
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    color: 'var(--muted)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {DATA_STATE_LABELS[dataState]}
                </span>
              </div>
            </div>

            {/* Value */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
              <div className="metric-card__value tabular-nums" style={{ fontFamily: 'var(--font-ui)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.025em' }}>
                {value}
              </div>
              {unit && (
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontWeight: 500, textTransform: 'uppercase' }}>{unit}</div>
              )}
            </div>

            {/* Delta */}
            {delta && (
              <div style={{ marginTop: 6, fontSize: '11px', fontFamily: 'var(--font-mono)', color: deltaColor, display: 'flex', alignItems: 'center', gap: 3, fontWeight: 500 }}>
                {deltaDirection === 'up' && '↑ '}
                {deltaDirection === 'down' && '↓ '}
                {delta}
              </div>
            )}

            {/* Provenance trigger */}
            {provenance && (
              <button
                onClick={() => setDrawerOpen(true)}
                aria-expanded={drawerOpen}
                aria-controls={`${id}-provenance`}
                style={{
                  marginTop: 12,
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  color: 'var(--text-on-surface-variant)',
                  background: 'var(--surface-container-low)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--r-badge)',
                  padding: '3px 8px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  transition: 'all 0.12s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--outline)'
                  e.currentTarget.style.color = 'var(--ink)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--line)'
                  e.currentTarget.style.color = 'var(--text-on-surface-variant)'
                }}
              >
                <span>// Provenance Data →</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* Provenance drawer */}
      {provenance && drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.65)',
              zIndex: 50, animation: 'fadeIn 0.15s ease',
            }}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div
            id={`${id}-provenance`}
            role="dialog"
            aria-label={`${label} — calculation provenance`}
            aria-modal="true"
            style={{
              position: 'fixed',
              right: 0, top: 0, bottom: 0,
              width: 'min(440px, 100vw)',
              maxWidth: '100vw',
              background: 'var(--surface)',
              borderLeft: '1px solid var(--line)',
              zIndex: 51,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-popover)',
              animation: 'fadeInDown 0.18s ease',
            }}
          >
            <div style={{
              padding: 'var(--sp-4)',
              borderBottom: '1px solid var(--line)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              position: 'sticky',
              top: 0,
              background: 'var(--surface)',
            }}>
              <div>
                <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)' }}>
                  How is this calculated?
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', marginTop: 2 }}>{label}</div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close provenance drawer"
                style={{
                  width: 32, height: 32, border: '1px solid var(--line)',
                  borderRadius: 'var(--r-control)', background: 'transparent',
                  cursor: 'pointer', color: 'var(--muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              {/* Formula */}
              <section>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--muted)', marginBottom: 'var(--sp-2)' }}>FORMULA</div>
                <code style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-sm)',
                  background: 'var(--canvas)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--r-control)',
                  padding: 'var(--sp-3)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                }}>
                  {provenance.formula}
                </code>
              </section>

              {/* Current values */}
              <section>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--muted)', marginBottom: 'var(--sp-2)' }}>CURRENT VALUES</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                  <Row label="Numerator" value={provenance.numerator} />
                  <Row label="Denominator" value={provenance.denominator} />
                  {provenance.pendingCount !== undefined && <Row label="Pending (excluded)" value={String(provenance.pendingCount)} />}
                  {provenance.disputedCount !== undefined && <Row label="Disputed (excluded)" value={String(provenance.disputedCount)} />}
                  {provenance.excludedCount !== undefined && <Row label="Total excluded" value={String(provenance.excludedCount)} />}
                </div>
              </section>

              {/* Inclusions */}
              {provenance.inclusions.length > 0 && (
                <section>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--muted)', marginBottom: 'var(--sp-2)' }}>INCLUDED IN CALCULATION</div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
                    {provenance.inclusions.map((inc, i) => (
                      <li key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--ink)', display: 'flex', gap: 'var(--sp-2)', alignItems: 'flex-start' }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginTop: 2, flexShrink: 0 }} aria-hidden="true">
                          <circle cx="6" cy="6" r="5" fill="var(--chip-verified-bg)" stroke="var(--verified)" strokeWidth="1"/>
                          <path d="M3.5 6l1.5 1.5 3-3" stroke="var(--verified)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {inc}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Exclusions */}
              {provenance.exclusions.length > 0 && (
                <section>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--muted)', marginBottom: 'var(--sp-2)' }}>EXCLUDED FROM CALCULATION</div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
                    {provenance.exclusions.map((exc, i) => (
                      <li key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--ink)', display: 'flex', gap: 'var(--sp-2)', alignItems: 'flex-start' }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginTop: 2, flexShrink: 0 }} aria-hidden="true">
                          <circle cx="6" cy="6" r="5" fill="var(--chip-rejected-bg)" stroke="var(--disputed)" strokeWidth="1"/>
                          <path d="M4 4l4 4M8 4L4 8" stroke="var(--disputed)" strokeWidth="1.2" strokeLinecap="round"/>
                        </svg>
                        {exc}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Metadata */}
              <section>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--muted)', marginBottom: 'var(--sp-2)' }}>METADATA</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                  <Row label="Calculation version" value={provenance.calculationVersion} mono />
                  <Row label="Last calculated" value={new Date(provenance.calculatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} mono />
                  <Row label="Data state" value={DATA_STATE_LABELS[provenance.dataState] ?? provenance.dataState} />
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </>
  )
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--sp-4)' }}>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', flexShrink: 0 }}>{label}</span>
      <span style={{
        fontSize: 'var(--text-sm)',
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)',
        color: 'var(--ink)',
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </span>
    </div>
  )
}

export type { MetricProvenance }
