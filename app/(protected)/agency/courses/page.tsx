'use client'

import { useState } from 'react'
import { DataTable } from '@/components/DataTable'
import { StatusChip } from '@/components/StatusChip'
import { db } from '@/lib/db/store'

export default function AgencyCoursesPage() {
  const [coursesList, setCoursesList] = useState(db.courses)
  const [showModal, setShowModal] = useState(false)
  const [alert, setAlert] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [sector, setSector] = useState('Technology')
  const [nsqfLevel, setNsqfLevel] = useState(5)
  const [durationHours, setDurationHours] = useState(360)
  const [instructor, setInstructor] = useState('')

  function handleAddCourseSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newCourse = {
      id: `crs-${Date.now()}`,
      name,
      sector,
      nsqf_level: nsqfLevel,
      duration_hours: durationHours,
      agency_id: 'ag-delhi-01',
      skills: [
        { skill_id: 'skl-01', target_proficiency: 4, skill_type: 'core' },
        { skill_id: 'skl-02', target_proficiency: 4, skill_type: 'core' },
        { skill_id: 'skl-03', target_proficiency: 3, skill_type: 'elective' },
      ],
      instructor: instructor || 'Dr. Sunita Rao',
    }

    setCoursesList([newCourse as any, ...coursesList])
    setShowModal(false)
    setName('')
    setInstructor('')
    setAlert(`Curriculum '${newCourse.name}' successfully accredited and registered under Agency training tracks.`)
  }

  const columns = [
    { key: 'name', label: 'Curriculum / Course Name', sortable: true },
    { key: 'sector', label: 'Sector', sortable: true },
    { key: 'nsqf_level', label: 'NSQF Level', sortable: true, render: (c: any) => `Level ${c.nsqf_level}` },
    { key: 'duration_hours', label: 'Duration', sortable: true, render: (c: any) => `${c.duration_hours} Hours` },
    {
      key: 'skills_count',
      label: 'Linked Target Skills',
      render: (c: any) => `${c.skills?.length ?? 5} Target Skills`,
    },
    {
      key: 'instructor',
      label: 'Lead Instructor',
      render: (c: any) => (
        <span style={{ fontSize: '11px', color: 'var(--ink)' }}>
          {c.instructor ?? 'Faculty Assigned'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Accreditation Status',
      render: () => <StatusChip status="VERIFIED" label="NSDC Accredited" />,
    },
  ]

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
          <div>
            <h1 className="page-header__title">Curriculum & Course Management</h1>
            <p className="page-header__description">
              NSDC-accredited skilling tracks · Target proficiency mapping per NSQF guidelines (Agency Admin Console)
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <button
              onClick={() => setShowModal(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-1)',
                padding: '6px var(--sp-3)', background: 'var(--primary)', color: 'white',
                border: 'none', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)',
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              + Add Accredited Course
            </button>
          </div>
        </div>
      </div>

      {alert && (
        <div style={{
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
        data={coursesList ?? []}
        idKey="id"
        searchPlaceholder="Search curricula by name or sector…"
        exportFileName="agency_courses_export.csv"
      />

      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-4)'
        }}>
          <div style={{
            background: 'var(--surface)', borderRadius: 'var(--r-container)', width: '100%', maxWidth: '480px',
            border: '1px solid var(--line)', padding: 'var(--sp-6)', boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
          }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--ink)', marginBottom: 'var(--sp-2)' }}>
              Add Accredited Course Track
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 'var(--sp-4)' }}>
              Configure a new NSQF-aligned training course for candidate enrollments and competency assessments.
            </p>

            <form onSubmit={handleAddCourseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>
                  Course / Curriculum Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud Security & DevOps"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ width: '100%', padding: '7px var(--sp-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>
                    Industry Sector
                  </label>
                  <select
                    value={sector}
                    onChange={e => setSector(e.target.value)}
                    style={{ width: '100%', padding: '7px var(--sp-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Automotive">Automotive</option>
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
                    value={nsqfLevel}
                    onChange={e => setNsqfLevel(parseInt(e.target.value))}
                    style={{ width: '100%', padding: '7px var(--sp-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                  >
                    <option value={3}>Level 3 (Certificate)</option>
                    <option value={4}>Level 4 (Vocational Certificate)</option>
                    <option value={5}>Level 5 (Diploma)</option>
                    <option value={6}>Level 6 (Advanced Diploma)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>
                    Duration (Hours)
                  </label>
                  <input
                    type="number"
                    required
                    value={durationHours}
                    onChange={e => setDurationHours(parseInt(e.target.value))}
                    style={{ width: '100%', padding: '7px var(--sp-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>
                    Lead Instructor / Faculty
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Prof. R. K. Saxena"
                    value={instructor}
                    onChange={e => setInstructor(e.target.value)}
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
                    padding: '7px var(--sp-4)', background: 'var(--primary)', color: 'white',
                    border: 'none', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Save & Accredit Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
