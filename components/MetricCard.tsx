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
  verified_only:    'var(--verified)',
  includes_pending: 'var(--pending)',
  all:              'var(--muted)',
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
    deltaDirection === 'up' && deltaGood ? 'var(--verified)' :
    deltaDirection === 'up' && !deltaGood ? 'var(--disputed)' :
    deltaDirection === 'down' && deltaGood ? 'var(--disputed)' :
    'var(--verified)'

  return (
    <>
      <div
        className="metric-card"
        id={id}
        role="region"
        aria-label={`${label} metric`}
        style={{
          borderTop: `3px solid ${DATA_STATE_COLORS[dataState]}`,
        }}
      >
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            <div style={{ height: 12, background: 'var(--line)', borderRadius: 2, width: '60%', animation: 'fadeIn 1s ease infinite alternate' }} />
            <div style={{ height: 32, background: 'var(--line)', borderRadius: 2, width: '40%' }} />
          </div>
        ) : (
          <>
            {/* Label row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-2)' }}>
              <div className="metric-card__label" style={{ fontWeight: 600 }}>{label}</div>
              {/* Data state badge */}
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: DATA_STATE_COLORS[dataState],
                  border: `1px solid ${DATA_STATE_COLORS[dataState]}`,
                  background: dataState === 'verified_only' ? 'var(--chip-verified-bg)' : dataState === 'includes_pending' ? 'var(--chip-pending-bg)' : 'var(--canvas)',
                  borderRadius: 'var(--r-control)',
                  padding: '1px 6px',
                }}
                aria-label={`Data state: ${DATA_STATE_LABELS[dataState]}`}
              >
                {DATA_STATE_LABELS[dataState]}
              </span>
            </div>

            {/* Value */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--sp-2)' }}>
              <div className="metric-card__value tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 800 }}>{value}</div>
              {unit && (
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', fontWeight: 500 }}>{unit}</div>
              )}
            </div>

            {/* Delta */}
            {delta && (
              <div style={{ marginTop: 'var(--sp-1)', fontSize: 'var(--text-xs)', color: deltaColor, display: 'flex', alignItems: 'center', gap: 2, fontWeight: 600 }}>
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
                  marginTop: 'var(--sp-3)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  background: 'rgba(29, 78, 137, 0.05)',
                  border: '1px solid rgba(29, 78, 137, 0.15)',
                  borderRadius: 'var(--r-control)',
                  padding: '3px 8px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-ui)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.15s ease',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M6 4v3M6 8v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                How is this calculated?
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
              position: 'fixed', inset: 0, background: 'rgba(14,31,51,0.4)',
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
              width: 'min(420px, 100vw)',
              maxWidth: '100vw',
              background: 'var(--surface)',
              borderLeft: '1px solid var(--line)',
              zIndex: 51,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-popover)',
              animation: 'fadeInDown 0.2s ease',
            }}
          >
            {/* Header */}
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
