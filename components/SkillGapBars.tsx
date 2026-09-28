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
      background: '#0F0F0F',
      border: '1px solid #242424',
      borderRadius: 'var(--r-control)',
      padding: 'var(--sp-6)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-5)' }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-md)', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Skill Intelligence: Demand / Supply / Proficiency Triad
          </h2>
          <p style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginTop: 2 }}>
            Triangulated against 50 enterprise employer requirements vs actual certified outcomes
          </p>
        </div>
        <div style={{
          fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-badge)',
          background: '#080808', border: '1px solid #242424', color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          Curriculum Intelligence
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
        {skills.map((s) => {
          const isCritical = s.gap_flag.includes('CRITICAL')
          const isProficiencyGap = s.gap_flag.includes('PROFICIENCY')

          const tagColor = isCritical ? '#E05252' : isProficiencyGap ? '#D99A32' : '#18B6A4'

          return (
            <div
              key={s.skill_name}
              style={{
                padding: '12px 14px',
                border: '1px solid #242424',
                borderLeft: `2px solid ${tagColor}`,
                borderRadius: 'var(--r-control)',
                background: '#080808',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                    {s.skill_name}
                  </span>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginLeft: 8 }}>
                    [{s.domain}]
                  </span>
                </div>
                <span style={{
                  fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 600, padding: '2px 6px', borderRadius: 2,
                  background: '#151515', color: tagColor, border: `1px solid ${tagColor}40`,
                  letterSpacing: '0.04em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 4,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: tagColor, boxShadow: `0 0 5px ${tagColor}80` }} />
                  {s.gap_flag}
                </span>
              </div>

              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-3)',
                fontSize: '11px', fontFamily: 'var(--font-mono)',
              }}>
                <div style={{ background: '#151515', padding: '6px 10px', borderRadius: 2, border: '1px solid #242424' }}>
                  <div style={{ color: 'var(--muted)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>DEMAND LEVEL</div>
                  <div style={{ fontWeight: 600, color: '#FFFFFF', marginTop: 2 }}>{s.demand_level}</div>
                </div>
                <div style={{ background: '#151515', padding: '6px 10px', borderRadius: 2, border: '1px solid #242424' }}>
                  <div style={{ color: 'var(--muted)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>CURRICULUM SUPPLY</div>
                  <div style={{ fontWeight: 600, color: '#FFFFFF', marginTop: 2 }}>{s.supply_level}</div>
                </div>
                <div style={{ background: '#151515', padding: '6px 10px', borderRadius: 2, border: '1px solid #242424' }}>
                  <div style={{ color: 'var(--muted)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>ASSESSED PROFICIENCY</div>
                  <div style={{ fontWeight: 600, color: tagColor, marginTop: 2 }}>{s.job_ready_level}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
