'use client'

import { useState } from 'react'

export interface FunnelStage {
  stage: string
  count: number
  pct_of_start: number
  pct_of_prev: number
  dropoff_rate: number
}

interface FunnelChartProps {
  stages: FunnelStage[]
  onStageSelect?: (stage: string) => void
  selectedStage?: string | null
}

export function FunnelChart({ stages, onStageSelect, selectedStage }: FunnelChartProps) {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null)

  const maxCount = stages[0]?.count ?? 10000

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', padding: 'var(--sp-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-5)' }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-md)', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            National Outcome Conversion Funnel
          </h2>
          <p style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginTop: 3 }}>
            Interactive stage conversion from Enrollment to 6-Month Retention · Click any stage to filter
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase' }}>State:</span>
          <span style={{
            fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-badge)',
            background: 'var(--surface-container-low)', border: '1px solid var(--line)', color: 'var(--verified)', display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--verified)', boxShadow: '0 0 6px rgba(24, 182, 164, 0.45)' }} />
            VERIFIED OUTCOMES
          </span>
        </div>
      </div>

      {/* Funnel bars stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
        {stages.map((st) => {
          const widthPct = Math.max(12, (st.count / maxCount) * 100)
          const isSelected = selectedStage === st.stage
          const isHovered = hoveredStage === st.stage
          const isLeakagePoint = st.dropoff_rate > 35 // Highlight major drop

          let barBg = 'var(--surface-container-highest)'
          if (st.stage.includes('Verified') || st.stage.includes('Retained')) {
            barBg = 'var(--verified)'
          }
          if (isLeakagePoint) {
            barBg = 'var(--pending)'
          }

          return (
            <div
              key={st.stage}
              onClick={() => onStageSelect?.(st.stage)}
              onMouseEnter={() => setHoveredStage(st.stage)}
              onMouseLeave={() => setHoveredStage(null)}
              style={{
                cursor: 'pointer',
                padding: '12px 16px',
                borderRadius: 'var(--r-control)',
                background: isSelected ? 'var(--surface-container-high)' : isHovered ? 'var(--surface-container)' : 'var(--surface-container-low)',
                border: isSelected ? '1px solid var(--primary-accent)' : '1px solid var(--line)',
                transition: 'all 0.12s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                  <span style={{ fontSize: '13px', fontFamily: 'var(--font-ui)', fontWeight: 600, color: 'var(--ink)' }}>
                    {st.stage}
                  </span>
                  {isLeakagePoint && (
                    <span style={{
                      fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 600, padding: '2px 8px', borderRadius: 2,
                      background: 'var(--chip-disputed-bg)', color: 'var(--disputed)', border: '1px solid var(--chip-disputed-border)',
                      display: 'inline-flex', alignItems: 'center', gap: 4, textTransform: 'uppercase',
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--disputed)', boxShadow: '0 0 5px rgba(224, 82, 82, 0.5)' }} />
                      HIGH LEAKAGE: -{st.dropoff_rate.toFixed(1)}%
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>
                    {new Intl.NumberFormat('en-IN').format(st.count)}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'var(--text-on-surface-variant)',
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    padding: '2px 6px',
                    borderRadius: 2,
                    minWidth: 50,
                    textAlign: 'center',
                  }}>
                    {st.pct_of_start.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Bar track */}
              <div style={{ height: 8, background: 'var(--surface-container-high)', borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${widthPct}%`,
                    background: barBg,
                    borderRadius: 2,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>

              {/* Step drop indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginTop: 6, textTransform: 'uppercase' }}>
                <span>Prev Conversion: <strong style={{ color: 'var(--text-on-surface)' }}>{st.pct_of_prev.toFixed(1)}%</strong></span>
                <span>Stage Drop-off: <strong style={{ color: isLeakagePoint ? 'var(--disputed)' : 'var(--muted)' }}>{st.dropoff_rate.toFixed(1)}%</strong></span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
