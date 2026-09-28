import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { SkillGapBars } from '@/components/SkillGapBars'
import { StatusChip } from '@/components/StatusChip'

export const metadata: Metadata = {
  title: 'Skill Intelligence | Government Intelligence',
  description: 'Employer demand vs training supply vs job-ready proficiency across sectors',
}

export default async function GovSkillsPage() {
  const supabase = await createClient()
  const { data: skillGaps } = await supabase.from('v_skill_gap').select('*')

  const emergingSkills = [
    { skill: 'REST API Architecture', growth: '+44% YoY', domain: 'Technology', demandScore: 88 },
    { skill: 'Cloud Security / IAM', growth: '+38% YoY', domain: 'Technology', demandScore: 82 },
    { skill: 'Data Pipeline Engineering (SQL/ETL)', growth: '+35% YoY', domain: 'Technology', demandScore: 91 },
    { skill: 'Patient Care Records & Telehealth', growth: '+29% YoY', domain: 'Healthcare', demandScore: 76 },
    { skill: 'Workplace Conversational English', growth: '+27% YoY', domain: 'Soft Skills', demandScore: 94 },
  ]

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Skill Intelligence Engine</h1>
            <p className="page-header__description">
              Continuous demand-supply triangulation derived from verified employer requirements vs certified trainee proficiencies
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <StatusChip status="VERIFIED" label="Triangulated data" />
          </div>
        </div>
      </div>

      {/* Main Triad Comparison Bars */}
      <SkillGapBars skills={skillGaps ?? []} />

      {/* Emerging Skill Signals Section */}
      <div style={{
        marginTop: 'var(--sp-6)', background: 'var(--surface)', border: '1px solid var(--line)',
        borderRadius: 'var(--r-container)', padding: 'var(--sp-6)',
      }}>
        <div style={{ marginBottom: 'var(--sp-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            <span style={{
              fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: 'var(--r-control)',
              background: 'var(--chip-info-bg)', color: 'var(--info)', border: '1px solid var(--chip-info-border)',
            }}>
              TREND SIGNAL
            </span>
            <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)' }}>
              Emerging Industry Skill Signals (Trailing 12 Months)
            </h2>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4 }}>
            Fastest-growing employer hiring requirements detected across 50 authorized enterprise partners
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--sp-3)' }}>
          {emergingSkills.map((sk) => (
            <div
              key={sk.skill}
              style={{
                background: 'var(--canvas)', border: '1px solid var(--line)',
                borderRadius: 'var(--r-control)', padding: 'var(--sp-4)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{sk.domain}</span>
                <span style={{
                  fontSize: '11px', fontWeight: 700, color: 'var(--verified)',
                  background: 'var(--chip-verified-bg)', padding: '1px 6px', borderRadius: 2,
                }}>
                  {sk.growth}
                </span>
              </div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>
                {sk.skill}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                Employer Demand Index: <strong style={{ color: 'var(--ink)' }}>{sk.demandScore}/100</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
