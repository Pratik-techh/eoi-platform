'use client'

import { DataTable } from '@/components/DataTable'
import { StatusChip } from '@/components/StatusChip'

export default function AgencyReadinessPage() {
  const readinessRecords = [
    {
      student_id: 'EOI-S-HERO-0001',
      student_name: 'Arjun Singh',
      course: 'Full Stack Web Development',
      attendance_component: '94% (Weight: 20%)',
      theory_component: '92% (Weight: 30%)',
      practical_component: '96% (Weight: 30%)',
      project_component: '95% (Weight: 20%)',
      computed_score: 94.4,
      scoring_version: 'v1.2 (NSQF Level 5 Weighted)',
      band: 'High (≥75%)',
      qualification: 'QUALIFIED FOR INTERVIEW',
    },
    {
      student_id: 'EOI-S-1002-0002',
      student_name: 'Aditya Kumar',
      course: 'Data Analysis & Business Intelligence',
      attendance_component: '88% (Weight: 20%)',
      theory_component: '84% (Weight: 30%)',
      practical_component: '88% (Weight: 30%)',
      project_component: '85% (Weight: 20%)',
      computed_score: 86.2,
      scoring_version: 'v1.2 (NSQF Level 5 Weighted)',
      band: 'High (≥75%)',
      qualification: 'QUALIFIED FOR INTERVIEW',
    },
    {
      student_id: 'EOI-S-1003-0003',
      student_name: 'Ananya Singh',
      course: 'Cybersecurity & Network Administration',
      attendance_component: '91% (Weight: 20%)',
      theory_component: '89% (Weight: 30%)',
      practical_component: '91% (Weight: 30%)',
      project_component: '90% (Weight: 20%)',
      computed_score: 90.2,
      scoring_version: 'v1.2 (NSQF Level 5 Weighted)',
      band: 'High (≥75%)',
      qualification: 'QUALIFIED FOR INTERVIEW',
    },
    {
      student_id: 'EOI-S-1004-0004',
      student_name: 'Arjun Patel',
      course: 'Healthcare Support Services',
      attendance_component: '74% (Weight: 20%)',
      theory_component: '62% (Weight: 30%)',
      practical_component: '65% (Weight: 30%)',
      project_component: '60% (Weight: 20%)',
      computed_score: 64.9,
      scoring_version: 'v1.2 (NSQF Level 5 Weighted)',
      band: 'Medium (50–74%)',
      qualification: 'REMEDIAL REQUIRED',
    },
    {
      student_id: 'EOI-S-1005-0005',
      student_name: 'Pooja Bhatt',
      course: 'Retail & Customer Service',
      attendance_component: '52% (Weight: 20%)',
      theory_component: '44% (Weight: 30%)',
      practical_component: '48% (Weight: 30%)',
      project_component: '40% (Weight: 20%)',
      computed_score: 46.4,
      scoring_version: 'v1.2 (NSQF Level 5 Weighted)',
      band: 'Low (<50%)',
      qualification: 'REMEDIAL REQUIRED',
    },
  ]

  const columns = [
    { key: 'student_name', label: 'Candidate Name', sortable: true },
    { key: 'student_id', label: 'EOI Student ID' },
    { key: 'course', label: 'Course' },
    {
      key: 'computed_score',
      label: 'Readiness Score',
      sortable: true,
      render: (r: any) => (
        <span style={{
          fontFamily: 'var(--font-mono)', fontWeight: 700,
          color: r.computed_score >= 75 ? 'var(--verified)' : r.computed_score >= 50 ? 'var(--pending)' : 'var(--disputed)',
        }}>
          {r.computed_score.toFixed(1)} / 100
        </span>
      ),
    },
    {
      key: 'band',
      label: 'Readiness Band',
      sortable: true,
      render: (r: any) => {
        const isHigh = r.computed_score >= 75
        const isMed = r.computed_score >= 50 && r.computed_score < 75
        return (
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 'var(--r-control)',
            background: isHigh ? 'var(--chip-verified-bg)' : isMed ? 'var(--chip-pending-bg)' : 'var(--chip-disputed-bg)',
            color: isHigh ? 'var(--verified)' : isMed ? 'var(--pending)' : 'var(--disputed)',
            border: `1px solid ${isHigh ? 'var(--chip-verified-border)' : isMed ? 'var(--chip-pending-border)' : 'var(--chip-disputed-border)'}`,
          }}>
            {r.band}
          </span>
        )
      },
    },
    { key: 'scoring_version', label: 'Active Scoring Rule' },
    {
      key: 'qualification',
      label: 'Funnel Eligibility',
      render: (r: any) => (
        <StatusChip
          status={r.computed_score >= 75 ? 'VERIFIED' : 'PENDING'}
          label={r.qualification}
        />
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Job Readiness Computation Engine</h1>
            <p className="page-header__description">
              Computed strictly by automated algorithm · Agencies cannot manually enter or override readiness scores (MASTER_PROMPT §8.2)
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <StatusChip status="VERIFIED" label="Scoring Rule v1.2" />
          </div>
        </div>
      </div>

      {/* Formula Transparency Drawer Info */}
      <div style={{
        padding: 'var(--sp-4)', background: 'var(--canvas)', border: '1px solid var(--line)',
        borderRadius: 'var(--r-container)', fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 'var(--sp-6)',
        lineHeight: 1.5,
      }}>
        <strong>Algorithmic Formula (Version 1.2):</strong> <code>Readiness Score = (0.20 × Attendance%) + (0.30 × Theory Assessment) + (0.30 × Practical Assessment) + (0.20 × Capstone Evaluation)</code>. Threshold for interview qualification is 70.0. All score computations are append-only; changes produce new versioned ledger records.
      </div>

      <DataTable
        columns={columns}
        data={readinessRecords}
        idKey="student_id"
        searchPlaceholder="Filter candidate readiness by name or qualification…"
        exportFileName="job_readiness_export.csv"
      />
    </div>
  )
}
