'use client'

export interface SkillGapItem {
  skill_name: string
  domain: string
  demand_level: string
  supply_level: string
  job_ready_level: string
  gap_flag: string
}

interface SkillGapBarsProps {
  skills: SkillGapItem[]
}

export function SkillGapBars({ skills }: SkillGapBarsProps) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
      padding: 'var(--sp-6)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-5)' }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)' }}>
            Skill Intelligence: Demand / Supply / Proficiency Triad
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 2 }}>
            Triangulated against 50 enterprise employer requirements vs actual certified outcomes
          </p>
        </div>
        <div style={{
          fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-control)',
          background: 'var(--canvas)', border: '1px solid var(--line)', color: 'var(--muted)',
        }}>
          LIVE CURRICULUM INTELLIGENCE
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
        {skills.map((s) => {
          const isCritical = s.gap_flag.includes('CRITICAL')
          const isProficiencyGap = s.gap_flag.includes('PROFICIENCY')

          return (
            <div
              key={s.skill_name}
              style={{
                padding: 'var(--sp-3) var(--sp-4)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-control)',
                background: isCritical ? '#FEF2F2' : isProficiencyGap ? '#FEF3C7' : 'var(--canvas)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-2)' }}>
                <div>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink)' }}>
                    {s.skill_name}
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginLeft: 8 }}>
                    ({s.domain})
                  </span>
                </div>
                <span style={{
                  fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: 2,
                  background: isCritical ? 'var(--disputed)' : isProficiencyGap ? 'var(--pending)' : 'var(--verified)',
                  color: 'white',
                }}>
                  {s.gap_flag}
                </span>
              </div>

              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-3)',
                fontSize: 'var(--text-xs)',
              }}>
                <div style={{ background: 'var(--surface)', padding: '6px 10px', borderRadius: 4, border: '1px solid var(--line)' }}>
                  <div style={{ color: 'var(--muted)', fontSize: '10px' }}>EMPLOYER DEMAND</div>
                  <div style={{ fontWeight: 600, color: 'var(--ink)', marginTop: 2 }}>{s.demand_level}</div>
                </div>
                <div style={{ background: 'var(--surface)', padding: '6px 10px', borderRadius: 4, border: '1px solid var(--line)' }}>
                  <div style={{ color: 'var(--muted)', fontSize: '10px' }}>CURRICULUM SUPPLY</div>
                  <div style={{ fontWeight: 600, color: 'var(--ink)', marginTop: 2 }}>{s.supply_level}</div>
                </div>
                <div style={{ background: 'var(--surface)', padding: '6px 10px', borderRadius: 4, border: '1px solid var(--line)' }}>
                  <div style={{ color: 'var(--muted)', fontSize: '10px' }}>JOB-READY PROFICIENCY</div>
                  <div style={{ fontWeight: 600, color: 'var(--ink)', marginTop: 2 }}>{s.job_ready_level}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
