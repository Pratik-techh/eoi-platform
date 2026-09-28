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
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)', padding: 'var(--sp-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-5)' }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)' }}>
            National Outcome Conversion Funnel
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 2 }}>
            Interactive stage conversion from Enrollment to 6-Month Retention · Click any stage to filter
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>Data State:</span>
          <span style={{
            fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-control)',
            background: 'var(--chip-verified-bg)', border: '1px solid var(--chip-verified-border)', color: 'var(--verified)',
          }}>
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

          let barBg = 'linear-gradient(90deg, #1D4E89 0%, #2563EB 100%)'
          if (st.stage.includes('Verified') || st.stage.includes('Retained')) {
            barBg = 'linear-gradient(90deg, #0F766E 0%, #10B981 100%)'
          }
          if (isLeakagePoint) {
            barBg = 'linear-gradient(90deg, #B45309 0%, #F59E0B 100%)'
          }

          return (
            <div
              key={st.stage}
              onClick={() => onStageSelect?.(st.stage)}
              onMouseEnter={() => setHoveredStage(st.stage)}
              onMouseLeave={() => setHoveredStage(null)}
              style={{
                cursor: 'pointer',
                padding: 'var(--sp-3) var(--sp-4)',
                borderRadius: 'var(--r-control)',
                background: isSelected ? 'var(--canvas)' : isHovered ? '#F8FAFC' : 'transparent',
                border: isSelected ? '1px solid var(--primary)' : '1px solid var(--line)',
                boxShadow: isHovered ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)' }}>
                    {st.stage}
                  </span>
                  {isLeakagePoint && (
                    <span style={{
                      fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                      background: 'var(--chip-disputed-bg)', color: 'var(--disputed)', border: '1px solid var(--chip-disputed-border)',
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                    }}>
                      <span>⚠️ HIGH LEAKAGE:</span> -{st.dropoff_rate.toFixed(1)}%
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)' }}>
                    {new Intl.NumberFormat('en-IN').format(st.count)}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    background: 'rgba(29, 78, 137, 0.08)',
                    padding: '2px 6px',
                    borderRadius: 4,
                    minWidth: 50,
                    textAlign: 'center',
                  }}>
                    {st.pct_of_start.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Bar track */}
              <div style={{ height: 12, background: 'var(--line)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${widthPct}%`,
                    background: barBg,
                    borderRadius: 4,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>

              {/* Step drop indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginTop: 4 }}>
                <span>Conversion from previous: <strong>{st.pct_of_prev.toFixed(1)}%</strong></span>
                <span>Drop-off at stage: <strong style={{ color: isLeakagePoint ? 'var(--disputed)' : 'var(--muted)' }}>{st.dropoff_rate.toFixed(1)}%</strong></span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
