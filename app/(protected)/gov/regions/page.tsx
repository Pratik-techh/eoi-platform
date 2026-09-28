'use client'

import { DataTable } from '@/components/DataTable'
import { StatusChip } from '@/components/StatusChip'

export default function GovRegionsPage() {
  const stateData = [
    {
      state: 'Delhi',
      districts_covered: 11,
      total_trained: 2200,
      verified_employed: 1680,
      conversion_rate: '76.4%',
      avg_wage_band: '₹22,000 – ₹28,000',
      top_sector: 'Technology',
      top_gap: 'REST API Architecture',
      retention_6m: '83.2%',
    },
    {
      state: 'Maharashtra',
      districts_covered: 24,
      total_trained: 2450,
      verified_employed: 1840,
      conversion_rate: '75.1%',
      avg_wage_band: '₹20,000 – ₹26,000',
      top_sector: 'Technology & Services',
      top_gap: 'Cloud Computing (AWS/Azure)',
      retention_6m: '81.4%',
    },
    {
      state: 'Tamil Nadu',
      districts_covered: 18,
      total_trained: 1950,
      verified_employed: 1470,
      conversion_rate: '75.4%',
      avg_wage_band: '₹18,000 – ₹24,000',
      top_sector: 'Manufacturing & Tech',
      top_gap: 'SQL & Databases',
      retention_6m: '79.8%',
    },
    {
      state: 'Karnataka',
      districts_covered: 15,
      total_trained: 1800,
      verified_employed: 1410,
      conversion_rate: '78.3%',
      avg_wage_band: '₹24,000 – ₹32,000',
      top_sector: 'Technology',
      top_gap: 'Full Stack Web Dev',
      retention_6m: '84.6%',
    },
    {
      state: 'Rajasthan',
      districts_covered: 14,
      total_trained: 2100,
      verified_employed: 470, // Planted drop
      conversion_rate: '22.4%',
      avg_wage_band: '₹12,000 – ₹16,000',
      top_sector: 'Software & Construction',
      top_gap: 'SQL & Communication Skills',
      retention_6m: '54.0%',
    },
    {
      state: 'West Bengal',
      districts_covered: 12,
      total_trained: 1500,
      verified_employed: 1040,
      conversion_rate: '69.3%',
      avg_wage_band: '₹15,000 – ₹20,000',
      top_sector: 'Healthcare & Retail',
      top_gap: 'Patient Care Records',
      retention_6m: '74.2%',
    },
  ]

  const columns = [
    { key: 'state', label: 'State / Territory', sortable: true },
    { key: 'districts_covered', label: 'Districts' },
    { key: 'total_trained', label: 'Trained Trainees', sortable: true },
    { key: 'verified_employed', label: 'Verified Employed', sortable: true },
    {
      key: 'conversion_rate',
      label: 'Verified Conversion',
      sortable: true,
      render: (r: any) => {
        const isLow = parseFloat(r.conversion_rate) < 30
        return (
          <span style={{
            fontFamily: 'var(--font-mono)', fontWeight: 700,
            color: isLow ? 'var(--disputed)' : 'var(--verified)',
          }}>
            {r.conversion_rate}
          </span>
        )
      },
    },
    { key: 'retention_6m', label: '6m Retention', sortable: true },
    { key: 'avg_wage_band', label: 'Monthly Wage Band' },
    { key: 'top_sector', label: 'Primary Sector' },
    { key: 'top_gap', label: 'Primary Skill Deficit' },
  ]

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Regional Intelligence</h1>
            <p className="page-header__description">
              State and district level verified employment outcomes, wage trajectories, and regional skill deficits
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <StatusChip status="VERIFIED" label="State aggregate" />
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={stateData}
        idKey="state"
        searchPlaceholder="Search states or primary sectors…"
        exportFileName="regional_intelligence_export.csv"
      />
    </div>
  )
}
