import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { FunnelChart } from '@/components/FunnelChart'
import { LeakageCallout } from '@/components/LeakageCallout'
import { StatusChip } from '@/components/StatusChip'

export const metadata: Metadata = {
  title: 'Outcome Funnel | Government Intelligence',
  description: 'National longitudinal conversion funnel from training to 6-month retention',
}

export default async function GovFunnelPage() {
  const supabase = await createClient()
  const { data: funnel } = await supabase.from('v_outcome_funnel').select('*')
  const { data: kpi } = await supabase.from('v_kpi_summary').select('*').single()

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Longitudinal Outcome Funnel</h1>
            <p className="page-header__description">
              National aggregate stage transitions · Enrolled → Retained (6 Months) · Verified outcomes only
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <StatusChip status="VERIFIED" label="Verified conversion" />
          </div>
        </div>
      </div>

      {/* Outcome Leakage Highlight */}
      <LeakageCallout
        stageFrom="Interviewed"
        stageTo="Selected / Employed"
        programName="Software Engineering Fundamentals"
        region="Rajasthan / Jaipur"
        zScore={3.2}
        baselineRate={68.4}
        observedRate={18.2}
        sampleSize={420}
      />

      {/* Funnel Chart */}
      <FunnelChart stages={funnel ?? []} />

      {/* Contextual Metric Cards */}
      <div style={{
        marginTop: 'var(--sp-6)',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--sp-4)',
      }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)', padding: 'var(--sp-4)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', fontWeight: 600 }}>CUMULATIVE CONVERSION</div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>
            31.2%
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4 }}>
            3,120 verified employed from 10,000 enrolled candidates.
          </p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)', padding: 'var(--sp-4)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', fontWeight: 600 }}>6-MONTH RETENTION CONVERSION</div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--verified)', marginTop: 4 }}>
            78.1%
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4 }}>
            2,438 of 3,120 verified employed remained actively retained after 180 days.
          </p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)', padding: 'var(--sp-4)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', fontWeight: 600 }}>AVG. TIME TO EMPLOYMENT</div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--primary)', marginTop: 4 }}>
            {kpi?.avg_time_to_employment_days ?? 42} Days
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4 }}>
            From assessment completion to verified employment start date.
          </p>
        </div>
      </div>
    </div>
  )
}
