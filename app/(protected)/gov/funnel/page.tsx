import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db/store'
import { FunnelChart } from '@/components/FunnelChart'
import { LeakageCallout } from '@/components/LeakageCallout'
import { StatusChip } from '@/components/StatusChip'

export const metadata: Metadata = {
  title: 'Outcome Funnel | Government Intelligence',
  description: 'National longitudinal conversion funnel from training to 6-month retention',
}

export default async function GovFunnelPage() {
  let funnel = null
  let kpi = null

  try {
    const supabase = await createClient()
    const [funnelRes, kpiRes] = await Promise.all([
      supabase.from('v_outcome_funnel').select('*'),
      supabase.from('v_kpi_summary').select('*').single(),
    ])
    if (!funnelRes.error && funnelRes.data && funnelRes.data.length > 0) {
      funnel = funnelRes.data
    }
    if (!kpiRes.error && kpiRes.data) {
      kpi = kpiRes.data
    }
  } catch {
    // Fall back to local store
  }

  const stages = funnel ?? db.getOutcomeFunnel()
  const kpiData = (kpi ?? db.getKpiSummary()) as Record<string, number | string>

  const enrolled = Number(kpiData.total_enrolled ?? kpiData.trainees_enrolled ?? 500)
  const verifiedEmployed = Number(kpiData.total_verified_employed ?? kpiData.verified_employed_count ?? 310)
  const retained = Number(kpiData.total_retained_3m ?? kpiData.retained_count ?? 230)
  const verifiedRate = Number(kpiData.verified_employment_rate ?? ((verifiedEmployed / enrolled) * 100)).toFixed(1)
  const retentionRate = Number(kpiData.retention_rate_3m ?? kpiData.retention_rate ?? ((retained / verifiedEmployed) * 100)).toFixed(1)

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
        zScore={2.94}
        baselineRate={68.4}
        observedRate={18.2}
        sampleSize={420}
      />

      {/* Funnel Chart */}
      <FunnelChart stages={stages} />

      {/* Contextual Metric Cards */}
      <div style={{
        marginTop: 'var(--sp-6)',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--sp-4)',
      }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)', padding: 'var(--sp-4)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', fontWeight: 600 }}>CUMULATIVE CONVERSION</div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>
            {verifiedRate}%
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4 }}>
            {new Intl.NumberFormat('en-IN').format(verifiedEmployed)} verified employed from {new Intl.NumberFormat('en-IN').format(enrolled)} enrolled candidates.
          </p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)', padding: 'var(--sp-4)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', fontWeight: 600 }}>6-MONTH RETENTION CONVERSION</div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--verified)', marginTop: 4 }}>
            {retentionRate}%
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4 }}>
            {new Intl.NumberFormat('en-IN').format(retained)} of {new Intl.NumberFormat('en-IN').format(verifiedEmployed)} verified employed remained actively retained after 90–180 days.
          </p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)', padding: 'var(--sp-4)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', fontWeight: 600 }}>AVG. TIME TO EMPLOYMENT</div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--primary)', marginTop: 4 }}>
            {kpiData.avg_time_to_employment_days ?? 42} Days
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4 }}>
            From assessment completion to verified employment start date.
          </p>
        </div>
      </div>
    </div>
  )
}
