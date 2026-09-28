'use client'

import { useState } from 'react'
import { DataTable } from '@/components/DataTable'
import { StatusChip } from '@/components/StatusChip'

export default function GovProgramsPage() {
  const [programsData, setProgramsData] = useState([
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
  ])

  const [showModal, setShowModal] = useState(false)
  const [alert, setAlert] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [sector, setSector] = useState('Technology')
  const [nsqf, setNsqf] = useState('Level 5')
  const [duration, setDuration] = useState('360 hrs')
  const [enrolled, setEnrolled] = useState('500')

  function handleCreateProgram(e: React.FormEvent) {
    e.preventDefault()
    const newProg = {
      id: `crs-${Date.now()}`,
      name,
      sector,
      nsqf,
      duration,
      enrolled: parseInt(enrolled) || 500,
      completion_rate: '95.0%',
      readiness_rate: '88.0%',
      verified_employment_rate: 'Pending verification',
      retention_6m: '—',
      avg_time_days: 30,
      skill_relevance: '4.5 / 5.0',
      dispute_rate: '0.0%',
    }
    setProgramsData([newProg, ...programsData])
    setShowModal(false)
    setName('')
    setAlert(`Program '${newProg.name}' configured and submitted to Multi-Party Governance queue for co-authorization.`)
  }

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
        const isNum = !isNaN(parseFloat(r.verified_employment_rate))
        const isLow = isNum && parseFloat(r.verified_employment_rate) < 40
        return (
          <span style={{
            fontFamily: 'var(--font-mono)', fontWeight: 700,
            color: !isNum ? 'var(--muted)' : isLow ? 'var(--disputed)' : 'var(--verified)',
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
          <div>
            <h1 className="page-header__title">Program Intelligence</h1>
            <p className="page-header__description">
              Verified longitudinal outcome comparison across all accredited national skilling curricula
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <button
              onClick={() => setShowModal(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-1)',
                padding: '6px var(--sp-3)', background: '#FFFFFF', color: '#000000',
                border: '1px solid #FFFFFF', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-mono)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
                cursor: 'pointer',
              }}
            >
              + Configure Skilling Program
            </button>
            <StatusChip status="VERIFIED" label="Verified cohorts only" />
          </div>
        </div>
      </div>

      {alert && (
        <div
          className="alert-banner-animate"
          style={{
            padding: 'var(--sp-3) var(--sp-4)', background: 'var(--chip-verified-bg)',
          border: '1px solid var(--chip-verified-border)', borderRadius: 'var(--r-control)',
          fontSize: 'var(--text-sm)', color: 'var(--verified)', marginBottom: 'var(--sp-4)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>{alert}</span>
          <button onClick={() => setAlert(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: 'inherit' }}>×</button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={programsData}
        idKey="id"
        searchPlaceholder="Filter programs by name, sector, or NSQF level…"
        exportFileName="program_intelligence_export.csv"
      />

      {showModal && (
        <div
          className="modal-backdrop-animate"
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-4)'
          }}
        >
          <div
            className="modal-card-animate"
            style={{
              background: 'var(--surface)', borderRadius: 'var(--r-container)', width: '100%', maxWidth: '500px',
            border: '1px solid var(--line)', padding: 'var(--sp-6)', boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
          }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--ink)', marginBottom: 'var(--sp-2)' }}>
              Configure Accredited Skilling Program
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 'var(--sp-4)' }}>
              Add a national curriculum framework track. Per Invariant P2, program activation requires dual government co-authorization.
            </p>

            <form onSubmit={handleCreateProgram} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>
                  Program Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electric Vehicle Battery Servicing"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ width: '100%', padding: '7px var(--sp-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>
                    Sector
                  </label>
                  <select
                    value={sector}
                    onChange={e => setSector(e.target.value)}
                    style={{ width: '100%', padding: '7px var(--sp-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Renewable Energy">Renewable Energy</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Retail">Retail</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>
                    NSQF Level
                  </label>
                  <select
                    value={nsqf}
                    onChange={e => setNsqf(e.target.value)}
                    style={{ width: '100%', padding: '7px var(--sp-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                  >
                    <option value="Level 3">Level 3</option>
                    <option value="Level 4">Level 4</option>
                    <option value="Level 5">Level 5</option>
                    <option value="Level 6">Level 6</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>
                    Duration (Hours)
                  </label>
                  <input
                    type="text"
                    required
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    style={{ width: '100%', padding: '7px var(--sp-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>
                    Target Cohort Capacity
                  </label>
                  <input
                    type="number"
                    required
                    value={enrolled}
                    onChange={e => setEnrolled(e.target.value)}
                    style={{ width: '100%', padding: '7px var(--sp-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-2)', marginTop: 'var(--sp-3)' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '7px var(--sp-4)', background: 'var(--canvas)', border: '1px solid var(--line)',
                    borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '7px var(--sp-4)', background: '#FFFFFF', color: '#000000',
                    border: '1px solid #FFFFFF', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)',
                    fontFamily: 'var(--font-mono)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
                    cursor: 'pointer'
                  }}
                >
                  Propose Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
