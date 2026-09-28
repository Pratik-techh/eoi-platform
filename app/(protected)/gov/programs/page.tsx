'use client'

import { DataTable } from '@/components/DataTable'
import { StatusChip } from '@/components/StatusChip'

export default function GovProgramsPage() {

  const programsData = [
    {
      id: 'crs-01',
      name: 'Full Stack Web Development',
      sector: 'Technology',
      nsqf: 'Level 5',
      duration: '480 hrs',
      enrolled: 1850,
      completion_rate: '94.2%',
      readiness_rate: '88.5%',
      verified_employment_rate: '76.4%',
      retention_6m: '82.1%',
      avg_time_days: 38,
      skill_relevance: '4.4 / 5.0',
      dispute_rate: '0.8%',
    },
    {
      id: 'crs-02',
      name: 'Data Analysis & Business Intelligence',
      sector: 'Technology',
      nsqf: 'Level 5',
      duration: '320 hrs',
      enrolled: 1620,
      completion_rate: '92.8%',
      readiness_rate: '86.1%',
      verified_employment_rate: '74.2%',
      retention_6m: '79.5%',
      avg_time_days: 41,
      skill_relevance: '4.2 / 5.0',
      dispute_rate: '0.6%',
    },
    {
      id: 'crs-03',
      name: 'Software Engineering Fundamentals',
      sector: 'Technology',
      nsqf: 'Level 4',
      duration: '400 hrs',
      enrolled: 2100,
      completion_rate: '89.4%',
      readiness_rate: '78.2%',
      verified_employment_rate: '34.8%', // Planted drop
      retention_6m: '58.0%',
      avg_time_days: 64,
      skill_relevance: '3.1 / 5.0',
      dispute_rate: '3.9%',
    },
    {
      id: 'crs-04',
      name: 'Cybersecurity & Network Administration',
      sector: 'Technology',
      nsqf: 'Level 5',
      duration: '360 hrs',
      enrolled: 1250,
      completion_rate: '95.1%',
      readiness_rate: '89.0%',
      verified_employment_rate: '78.9%',
      retention_6m: '84.2%',
      avg_time_days: 35,
      skill_relevance: '4.6 / 5.0',
      dispute_rate: '0.4%',
    },
    {
      id: 'crs-05',
      name: 'Healthcare Support Services',
      sector: 'Healthcare',
      nsqf: 'Level 3',
      duration: '240 hrs',
      enrolled: 1100,
      completion_rate: '96.2%',
      readiness_rate: '91.4%',
      verified_employment_rate: '81.2%',
      retention_6m: '85.6%',
      avg_time_days: 28,
      skill_relevance: '4.5 / 5.0',
      dispute_rate: '0.2%',
    },
    {
      id: 'crs-06',
      name: 'Retail & Customer Service',
      sector: 'Retail',
      nsqf: 'Level 3',
      duration: '180 hrs',
      enrolled: 950,
      completion_rate: '91.0%',
      readiness_rate: '84.0%',
      verified_employment_rate: '68.5%',
      retention_6m: '71.2%',
      avg_time_days: 45,
      skill_relevance: '3.8 / 5.0',
      dispute_rate: '1.2%',
    },
  ]

  const columns = [
    { key: 'name', label: 'Program Name', sortable: true },
    { key: 'sector', label: 'Sector', sortable: true },
    { key: 'nsqf', label: 'NSQF Level' },
    { key: 'enrolled', label: 'Enrolled', sortable: true },
    { key: 'completion_rate', label: 'Completion', sortable: true },
    { key: 'readiness_rate', label: 'Job Ready', sortable: true },
    {
      key: 'verified_employment_rate',
      label: 'Verified Employed',
      sortable: true,
      render: (r: any) => {
        const isLow = parseFloat(r.verified_employment_rate) < 40
        return (
          <span style={{
            fontFamily: 'var(--font-mono)', fontWeight: 700,
            color: isLow ? 'var(--disputed)' : 'var(--verified)',
          }}>
            {r.verified_employment_rate}
          </span>
        )
      },
    },
    { key: 'retention_6m', label: '6m Retention', sortable: true },
    { key: 'avg_time_days', label: 'Avg Days', sortable: true },
    { key: 'skill_relevance', label: 'Skill Relevance', sortable: true },
    { key: 'dispute_rate', label: 'Dispute Rate' },
  ]

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Program Intelligence</h1>
            <p className="page-header__description">
              Verified longitudinal outcome comparison across all accredited national skilling curricula
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <StatusChip status="VERIFIED" label="Verified cohorts only" />
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={programsData}
        idKey="id"
        searchPlaceholder="Filter programs by name, sector, or NSQF level…"
        exportFileName="program_intelligence_export.csv"
      />
    </div>
  )
}
