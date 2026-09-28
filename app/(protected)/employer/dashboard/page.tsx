import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db/store'
import { MetricCard } from '@/components/MetricCard'
import { StatusChip } from '@/components/StatusChip'
import { EntityResolutionFlow } from '@/components/EntityResolutionFlow'

export const metadata: Metadata = {
  title: 'Employer Dashboard | Enterprise Verification',
  description: 'Enterprise organization verification queue, employee status, and industry feedback',
}

export default async function EmployerDashboardPage() {
  let outcomesData = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('employment_outcomes').select('*')
    if (data && data.length > 0) {
      outcomesData = data
    }
  } catch {
    // Fall back to local store
  }

  const allOutcomes = outcomesData ?? db.employmentOutcomes

  const pendingCount = allOutcomes.filter(o => o.employment_status === 'PENDING_VERIFICATION' || o.employment_status === 'UNEMPLOYMENT_REPORTED').length
  const verifiedCount = allOutcomes.filter(o => o.employment_status === 'VERIFIED_EMPLOYED').length
  const rejectedCount = allOutcomes.filter(o => o.employment_status === 'REJECTED').length

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Google India Pvt. Ltd.</h1>
            <p className="page-header__description">
              Enterprise Partner ID: org-google-01 · Legal Identifier: CIN U72200KA2004FTC033590 · Status: CLAIMED & VERIFIED
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <Link
              href="/employer/verification"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-2)',
                padding: '6px var(--sp-4)', background: 'var(--primary)', color: 'white',
                borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', fontWeight: 600, textDecoration: 'none',
              }}
            >
              Open verification queue ({pendingCount}) →
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        <MetricCard
          id="emp_pending_queue"
          label="Pending Verification Queue"
          value={String(pendingCount)}
          delta="Action Required"
          deltaDirection="neutral"
          provenance={{
            formula: 'COUNT(outcomes) WHERE org_id = current_org AND status IN ("PENDING_VERIFICATION", "UNEMPLOYMENT_REPORTED")',
            numerator: String(pendingCount),
            denominator: String(pendingCount + verifiedCount),
            dataState: 'includes_pending',
            calculationVersion: '1.2',
            calculatedAt: new Date().toISOString(),
            inclusions: ['Agency reports awaiting confirmation', 'Student unemployment reconciliation requests'],
            exclusions: ['Already confirmed records'],
          }}
        />

        <MetricCard
          id="emp_verified_hires"
          label="Active Verified Hires"
          value={new Intl.NumberFormat('en-IN').format(verifiedCount)}
          delta="Retained active workforce"
          deltaDirection="up"
          provenance={{
            formula: 'COUNT(outcomes) WHERE org_id = current_org AND status = "VERIFIED_EMPLOYED"',
            numerator: String(verifiedCount),
            denominator: String(verifiedCount),
            dataState: 'verified_only',
            calculationVersion: '1.2',
            calculatedAt: new Date().toISOString(),
            inclusions: ['Verified full-time placements'],
            exclusions: ['Terminated or reconciled departures'],
          }}
        />

        <MetricCard
          id="emp_rejected_claims"
          label="Rejected Claims"
          value={String(rejectedCount)}
          delta="Audit Logged"
          deltaDirection="neutral"
          provenance={{
            formula: 'COUNT(outcomes) WHERE org_id = current_org AND status = "REJECTED"',
            numerator: String(rejectedCount),
            denominator: String(verifiedCount + rejectedCount),
            dataState: 'all',
            calculationVersion: '1.2',
            calculatedAt: new Date().toISOString(),
            inclusions: ['Agency submissions not matching corporate payroll records'],
            exclusions: ['Pending corrections'],
          }}
        />

        <MetricCard
          id="emp_feedback_count"
          label="Industry Feedback Reports"
          value="2"
          delta="Curriculum signals submitted"
          deltaDirection="neutral"
          provenance={{
            formula: 'COUNT(industry_feedback) WHERE org_id = current_org',
            numerator: '2',
            denominator: '2',
            dataState: 'verified_only',
            calculationVersion: '1.2',
            calculatedAt: new Date().toISOString(),
            inclusions: ['Skill requirement submissions and candidate evaluations'],
            exclusions: ['Draft feedback'],
          }}
        />
      </div>

      {/* Enterprise Admin Operations & Delegation Panel */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
        padding: 'var(--sp-5)', marginBottom: 'var(--sp-6)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
              Enterprise Administration & Verifier Delegation
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 2 }}>
              Manage corporate legal identifiers, authorized verification delegates, and industry demand signals
            </p>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: 'var(--canvas)', color: 'var(--muted)', border: '1px solid var(--line)' }}>
            Admin Console Active
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--sp-3)' }}>
          <Link
            href="/employer/organization"
            style={{
              padding: 'var(--sp-3) var(--sp-4)', background: 'var(--canvas)', border: '1px solid var(--line)',
              borderRadius: 'var(--r-control)', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 2
            }}
          >
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink)' }}>
              Authorized Verifiers →
            </span>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
              2 Active officers (Dual-Party Rule)
            </span>
          </Link>

          <Link
            href="/employer/organization"
            style={{
              padding: 'var(--sp-3) var(--sp-4)', background: 'var(--canvas)', border: '1px solid var(--line)',
              borderRadius: 'var(--r-control)', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 2
            }}
          >
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink)' }}>
              Statutory Identifiers →
            </span>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
              CIN, GSTIN, EPFO, ESIC verified
            </span>
          </Link>

          <Link
            href="/employer/feedback"
            style={{
              padding: 'var(--sp-3) var(--sp-4)', background: 'var(--canvas)', border: '1px solid var(--line)',
              borderRadius: 'var(--r-control)', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 2
            }}
          >
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink)' }}>
              Industry Skill Signals →
            </span>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
              Feed demand to curriculum engine
            </span>
          </Link>

          <Link
            href="/employer/verification"
            style={{
              padding: 'var(--sp-3) var(--sp-4)', background: 'var(--canvas)', border: '1px solid var(--line)',
              borderRadius: 'var(--r-control)', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 2
            }}
          >
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink)' }}>
              Verification Oversight →
            </span>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
              {pendingCount} Candidates pending verification
            </span>
          </Link>
        </div>
      </div>

      {/* Entity Resolution Flow Visual */}
      <EntityResolutionFlow />
    </div>
  )
}
