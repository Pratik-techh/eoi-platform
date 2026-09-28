import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { StatusChip } from '@/components/StatusChip'
import { MetricCard } from '@/components/MetricCard'

export const metadata: Metadata = {
  title: 'Agency Dashboard | Training Partner Operations',
  description: 'Trainees, assessments, readiness, and verified employment conversion',
}

export default async function AgencyDashboardPage() {
  const supabase = await createClient()
  const { data: kpi } = await supabase.from('v_kpi_summary').select('*').single()
  const { data: students } = await supabase.from('students').select('*').limit(5)

  // Agency metrics (Delhi Skill Development Institute)
  const traineesCount = 2200
  const completedCount = 2050
  const jobReadyCount = 1820
  const reportedEmployment = 1680
  const verifiedEmployment = 1490
  const pendingVerification = 120
  const disputedCount = 15

  const reportedVerifiedGap = reportedEmployment - verifiedEmployment

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Delhi Skill Development Institute</h1>
            <p className="page-header__description">
              Agency Operations · Accreditation: NSDC-A · Partner ID: ag-delhi-01
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <Link
              href="/agency/employment/report"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-1)',
                padding: '6px var(--sp-4)', background: 'var(--primary)', color: 'white',
                borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', fontWeight: 600, textDecoration: 'none',
              }}
            >
              + Report employment outcome
            </Link>
          </div>
        </div>
      </div>

      {/* Reported-vs-Verified Gap Component (Mandatory: explicit, cannot be hidden per §8.2) */}
      <div style={{
        background: 'var(--canvas)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
        padding: 'var(--sp-4) var(--sp-5)', marginBottom: 'var(--sp-6)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-4)',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 6px', background: 'var(--primary)', color: 'white', borderRadius: 2 }}>
              CAG DISCREPANCY GAP METRIC
            </span>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)' }}>
              Reported vs. Verified Employment Gap: {reportedVerifiedGap} Trainees
            </span>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4, margin: 0 }}>
            Reported by Agency: <strong>{reportedEmployment}</strong> · Independently Verified by Employers: <strong>{verifiedEmployment}</strong> (Verification Rate: <strong>88.7%</strong>)
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)' }}>PENDING VERIFICATION</div>
            <div style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--pending)' }}>{pendingVerification}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)' }}>DISPUTED OUTCOMES</div>
            <div style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--disputed)' }}>{disputedCount}</div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        <MetricCard
          id="agency_enrolled"
          label="Trainees Enrolled"
          value={new Intl.NumberFormat('en-IN').format(traineesCount)}
          delta="+8.4% vs last quarter"
          deltaDirection="up"
          provenance={{
            formula: 'COUNT(DISTINCT eoi_student_id) WHERE agency_id = current_agency',
            numerator: String(traineesCount),
            denominator: String(traineesCount),
            dataState: 'verified_only',
            calculationVersion: '1.2',
            calculatedAt: new Date().toISOString(),
            inclusions: ['All enrolled candidates in active or completed cohorts'],
            exclusions: ['Cancelled registrations before day 7'],
          }}
        />

        <MetricCard
          id="agency_completed"
          label="Assessment Completed"
          value={new Intl.NumberFormat('en-IN').format(completedCount)}
          delta="93.1% completion rate"
          deltaDirection="up"
          provenance={{
            formula: 'COUNT(DISTINCT eoi_student_id) WHERE status = "COMPLETED"',
            numerator: String(completedCount),
            denominator: String(traineesCount),
            dataState: 'verified_only',
            calculationVersion: '1.2',
            calculatedAt: new Date().toISOString(),
            inclusions: ['Trainees passing practical and theory evaluations'],
            exclusions: ['Incomplete attendance (<70%)'],
          }}
        />

        <MetricCard
          id="agency_job_ready"
          label="Job-Ready Qualified"
          value={new Intl.NumberFormat('en-IN').format(jobReadyCount)}
          delta="88.8% of completed"
          deltaDirection="up"
          provenance={{
            formula: 'Computed from assessment score + practicals + attendance in scoring_versions',
            numerator: String(jobReadyCount),
            denominator: String(completedCount),
            dataState: 'verified_only',
            calculationVersion: '1.2',
            calculatedAt: new Date().toISOString(),
            inclusions: ['Readiness score ≥ 70/100 under NSQF Level 5 formula'],
            exclusions: ['Unverified mock tests'],
          }}
        />

        <MetricCard
          id="agency_verified_employed"
          label="Independently Verified Employed"
          value={new Intl.NumberFormat('en-IN').format(verifiedEmployment)}
          delta="72.7% verified placement rate"
          deltaDirection="up"
          provenance={{
            formula: 'COUNT(outcomes) WHERE employment_status = "VERIFIED_EMPLOYED"',
            numerator: String(verifiedEmployment),
            denominator: String(completedCount),
            dataState: 'verified_only',
            calculationVersion: '1.2',
            calculatedAt: new Date().toISOString(),
            inclusions: ['Third-party enterprise confirmations via canonical org accounts'],
            exclusions: ['Self-reported unverified claims', 'Disputed records'],
          }}
        />
      </div>

      {/* Quick Actions & Recent Trainees */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--sp-6)' }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
          padding: 'var(--sp-5)',
        }}>
          <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-3)' }}>
            Agency Operational Tasks
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            <Link
              href="/agency/students"
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: 'var(--sp-3)', background: 'var(--canvas)', borderRadius: 'var(--r-control)',
                textDecoration: 'none', color: 'var(--ink)', fontSize: 'var(--text-sm)',
              }}
            >
              <span>Manage & Import Students (CSV)</span>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>→</span>
            </Link>
            <Link
              href="/agency/assessments"
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: 'var(--sp-3)', background: 'var(--canvas)', borderRadius: 'var(--r-control)',
                textDecoration: 'none', color: 'var(--ink)', fontSize: 'var(--text-sm)',
              }}
            >
              <span>Record Practical & Theory Assessments</span>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>→</span>
            </Link>
            <Link
              href="/agency/inbox"
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: 'var(--sp-3)', background: 'var(--canvas)', borderRadius: 'var(--r-control)',
                textDecoration: 'none', color: 'var(--ink)', fontSize: 'var(--text-sm)',
              }}
            >
              <span>Verification Outcomes & Correction Requests</span>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>→</span>
            </Link>
          </div>
        </div>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
          padding: 'var(--sp-5)',
        }}>
          <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-3)' }}>
            Recent Registered Trainees
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            {(students ?? []).map((st: any) => (
              <div
                key={st.eoi_student_id}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 'var(--sp-2) 0', borderBottom: '1px solid var(--line)',
                }}
              >
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)' }}>
                    {st.full_name}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                    {st.eoi_student_id}
                  </div>
                </div>
                <StatusChip status={st.status === 'COMPLETED' ? 'VERIFIED' : 'PENDING'} label={st.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
