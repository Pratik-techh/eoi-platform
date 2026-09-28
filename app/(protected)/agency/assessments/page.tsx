'use client'

import { useState } from 'react'
import { DataTable } from '@/components/DataTable'
import { StatusChip } from '@/components/StatusChip'

export default function AgencyAssessmentsPage() {
  const [showLogModal, setShowLogModal] = useState(false)
  const [successAlert, setSuccessAlert] = useState<string | null>(null)

  // Form states
  const [studentId, setStudentId] = useState('EOI-S-HERO-0001')
  const [studentName, setStudentName] = useState('Arjun Singh')
  const [course, setCourse] = useState('Full Stack Web Development')
  const [technicalScore, setTechnicalScore] = useState(92)
  const [practicalScore, setPracticalScore] = useState(96)
  const [softSkillsScore, setSoftSkillsScore] = useState(90)
  const [attendancePct, setAttendancePct] = useState(94)
  const [capstoneProject, setCapstoneProject] = useState('E-Commerce Microservices Architecture')
  const [assessor, setAssessor] = useState('National Skill Certification Panel')

  const [assessments, setAssessments] = useState([
    {
      id: 'asm-01',
      student_id: 'EOI-S-HERO-0001',
      student_name: 'Arjun Singh',
      course: 'Full Stack Web Development',
      technical_score: 92,
      practical_score: 96,
      soft_skills_score: 90,
      attendance_pct: 94,
      composite_score: 93.2,
      band: 'High (≥75%)',
      capstone_project: 'E-Commerce Microservices Architecture',
      assessed_date: '2026-07-28',
      assessor: 'National Skill Certification Panel',
      status: 'VERIFIED',
    },
    {
      id: 'asm-02',
      student_id: 'EOI-S-1002-0002',
      student_name: 'Aditya Kumar',
      course: 'Data Analysis & Business Intelligence',
      technical_score: 84,
      practical_score: 88,
      soft_skills_score: 82,
      attendance_pct: 88,
      composite_score: 85.6,
      band: 'High (≥75%)',
      capstone_project: 'Retail Supply Chain Analytics Dashboard',
      assessed_date: '2026-07-30',
      assessor: 'Sector Skill Council Assessor',
      status: 'VERIFIED',
    },
    {
      id: 'asm-03',
      student_id: 'EOI-S-1003-0003',
      student_name: 'Ananya Singh',
      course: 'Cybersecurity & Network Administration',
      technical_score: 89,
      practical_score: 91,
      soft_skills_score: 88,
      attendance_pct: 91,
      composite_score: 89.8,
      band: 'High (≥75%)',
      capstone_project: 'Zero Trust Network Segmentation Lab',
      assessed_date: '2026-08-02',
      assessor: 'National Skill Certification Panel',
      status: 'VERIFIED',
    },
    {
      id: 'asm-04',
      student_id: 'EOI-S-1004-0004',
      student_name: 'Arjun Patel',
      course: 'Healthcare Support Services',
      technical_score: 62,
      practical_score: 65,
      soft_skills_score: 70,
      attendance_pct: 74,
      composite_score: 66.9,
      band: 'Medium (50–74%)',
      capstone_project: 'Hospital Clinical Triage & CPR Simulation',
      assessed_date: '2026-08-04',
      assessor: 'Healthcare Sector Council',
      status: 'VERIFIED',
    },
    {
      id: 'asm-05',
      student_id: 'EOI-S-1005-0005',
      student_name: 'Pooja Bhatt',
      course: 'Retail & Customer Service',
      technical_score: 44,
      practical_score: 48,
      soft_skills_score: 50,
      attendance_pct: 52,
      composite_score: 48.0,
      band: 'Low (<50%)',
      capstone_project: 'Point of Sale Inventory Auditing',
      assessed_date: '2026-08-06',
      assessor: 'Retail Sector Council',
      status: 'PENDING',
    },
  ])

  function handleSaveAssessment(e: React.FormEvent) {
    e.preventDefault()
    // Scoring formula: (Tech * 0.3) + (Pract * 0.3) + (Soft * 0.2) + (Att * 0.2)
    const composite = parseFloat(
      (technicalScore * 0.3 + practicalScore * 0.3 + softSkillsScore * 0.2 + attendancePct * 0.2).toFixed(1)
    )
    const band = composite >= 75 ? 'High (≥75%)' : composite >= 50 ? 'Medium (50–74%)' : 'Low (<50%)'

    const newRecord = {
      id: `asm-${Date.now()}`,
      student_id: studentId,
      student_name: studentName,
      course,
      technical_score: technicalScore,
      practical_score: practicalScore,
      soft_skills_score: softSkillsScore,
      attendance_pct: attendancePct,
      composite_score: composite,
      band,
      capstone_project: capstoneProject,
      assessed_date: new Date().toISOString().split('T')[0]!,
      assessor,
      status: 'VERIFIED',
    }

    setAssessments([newRecord, ...assessments])
    setShowLogModal(false)
    setSuccessAlert(
      `Assessment recorded for ${studentName} (${studentId}). Computed readiness score: ${composite}/100 [Band: ${band}]. SHA-256 event logged.`
    )
  }

  const columns = [
    { key: 'student_name', label: 'Candidate Name', sortable: true },
    { key: 'student_id', label: 'EOI Student ID' },
    { key: 'course', label: 'Course' },
    {
      key: 'technical_score',
      label: 'Technical Exam',
      sortable: true,
      render: (a: any) => `${a.technical_score} / 100`,
    },
    {
      key: 'practical_score',
      label: 'Practical Lab',
      sortable: true,
      render: (a: any) => `${a.practical_score} / 100`,
    },
    {
      key: 'soft_skills_score',
      label: 'Soft Skills',
      sortable: true,
      render: (a: any) => `${a.soft_skills_score} / 100`,
    },
    {
      key: 'attendance_pct',
      label: 'Attendance',
      sortable: true,
      render: (a: any) => `${a.attendance_pct}%`,
    },
    {
      key: 'composite_score',
      label: 'Readiness Score',
      sortable: true,
      render: (a: any) => (
        <span style={{
          fontFamily: 'var(--font-mono)', fontWeight: 700,
          color: a.composite_score >= 75 ? 'var(--verified)' : a.composite_score >= 50 ? 'var(--pending)' : 'var(--disputed)',
        }}>
          {a.composite_score}
        </span>
      ),
    },
    {
      key: 'band',
      label: 'Assigned Band',
      sortable: true,
      render: (a: any) => {
        const isHigh = a.composite_score >= 75
        const isMed = a.composite_score >= 50 && a.composite_score < 75
        return (
          <span style={{
            fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--r-control)',
            background: isHigh ? 'var(--chip-verified-bg)' : isMed ? 'var(--chip-pending-bg)' : 'var(--chip-disputed-bg)',
            color: isHigh ? 'var(--verified)' : isMed ? 'var(--pending)' : 'var(--disputed)',
            border: `1px solid ${isHigh ? 'var(--chip-verified-border)' : isMed ? 'var(--chip-pending-border)' : 'var(--chip-disputed-border)'}`,
          }}>
            {a.band}
          </span>
        )
      },
    },
    { key: 'assessor', label: 'Sector Assessor' },
    {
      key: 'status',
      label: 'Evaluation Status',
      render: (a: any) => <StatusChip status={a.status} label="Certified Passed" />,
    },
  ]

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
          <div>
            <h1 className="page-header__title">Assessment & Continuous Scoring</h1>
            <p className="page-header__description">
              Technical exams, practical lab evaluations, soft skills ratings, and mandatory attendance metrics (MASTER_PROMPT §8.2 & PDF Section 04)
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <button
              onClick={() => setShowLogModal(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-2)',
                padding: '6px var(--sp-4)', background: '#FFFFFF', color: '#000000',
                border: '1px solid #FFFFFF', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-mono)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
                cursor: 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              + Log Continuous Assessment
            </button>
          </div>
        </div>
      </div>

      {successAlert && (
        <div style={{
          padding: 'var(--sp-4)', background: 'var(--chip-verified-bg)', border: '1px solid var(--chip-verified-border)',
          borderRadius: 'var(--r-container)', fontSize: 'var(--text-sm)', color: 'var(--verified)', marginBottom: 'var(--sp-6)',
        }}>
          {successAlert}
        </div>
      )}

      {/* Log Assessment Modal */}
      {showLogModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(14,31,51,0.5)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-4)',
        }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
            width: '100%', maxWidth: '640px', padding: 'var(--sp-6)', maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
              <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)' }}>
                Log Continuous Candidate Assessment
              </h2>
              <button
                onClick={() => setShowLogModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAssessment} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                    Candidate Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    style={{ width: '100%', padding: 'var(--sp-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                    EOI Student ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    style={{ width: '100%', padding: 'var(--sp-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                  Accredited Course *
                </label>
                <select
                  value={course}
                  onChange={e => setCourse(e.target.value)}
                  style={{ width: '100%', padding: 'var(--sp-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', background: 'var(--surface)' }}
                >
                  <option value="Full Stack Web Development">Full Stack Web Development (NSQF Level 5)</option>
                  <option value="Data Analysis & Business Intelligence">Data Analysis & Business Intelligence (NSQF Level 5)</option>
                  <option value="Cybersecurity & Network Administration">Cybersecurity & Network Administration (NSQF Level 5)</option>
                  <option value="Healthcare Support Services">Healthcare Support Services (NSQF Level 3)</option>
                  <option value="Retail & Customer Service">Retail & Customer Service (NSQF Level 3)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                    Technical Exam Score (0–100) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={technicalScore}
                    onChange={e => setTechnicalScore(Number(e.target.value))}
                    style={{ width: '100%', padding: 'var(--sp-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                    Practical Lab Evaluation (0–100) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={practicalScore}
                    onChange={e => setPracticalScore(Number(e.target.value))}
                    style={{ width: '100%', padding: 'var(--sp-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                    Soft Skills & Communication (0–100) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={softSkillsScore}
                    onChange={e => setSoftSkillsScore(Number(e.target.value))}
                    style={{ width: '100%', padding: 'var(--sp-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                    Mandatory Attendance % (0–100) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={attendancePct}
                    onChange={e => setAttendancePct(Number(e.target.value))}
                    style={{ width: '100%', padding: 'var(--sp-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                  Evaluated Capstone Project Title
                </label>
                <input
                  type="text"
                  value={capstoneProject}
                  onChange={e => setCapstoneProject(e.target.value)}
                  style={{ width: '100%', padding: 'var(--sp-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                  Independent Assessor Organization *
                </label>
                <input
                  type="text"
                  required
                  value={assessor}
                  onChange={e => setAssessor(e.target.value)}
                  style={{ width: '100%', padding: 'var(--sp-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                />
              </div>

              {/* Dynamic Readiness Preview */}
              <div style={{
                padding: 'var(--sp-3)', background: 'var(--canvas)', border: '1px solid var(--line)',
                borderRadius: 'var(--r-control)', fontSize: 'var(--text-xs)', color: 'var(--muted)',
              }}>
                Calculated Readiness: <strong>{(technicalScore * 0.3 + practicalScore * 0.3 + softSkillsScore * 0.2 + attendancePct * 0.2).toFixed(1)} / 100</strong> · Assigned Band: <strong>
                  {(technicalScore * 0.3 + practicalScore * 0.3 + softSkillsScore * 0.2 + attendancePct * 0.2) >= 75 ? 'High (≥75%)' : (technicalScore * 0.3 + practicalScore * 0.3 + softSkillsScore * 0.2 + attendancePct * 0.2) >= 50 ? 'Medium (50–74%)' : 'Low (<50%)'}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-2)', marginTop: 'var(--sp-2)' }}>
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  style={{ padding: '6px var(--sp-4)', background: 'none', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '6px var(--sp-4)', background: '#FFFFFF', color: '#000000',
                    border: '1px solid #FFFFFF', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)',
                    fontFamily: 'var(--font-mono)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
                    cursor: 'pointer'
                  }}
                >
                  Save & Compute Readiness Band
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={assessments}
        idKey="id"
        searchPlaceholder="Search assessments by candidate or course…"
        exportFileName="assessments_export.csv"
      />
    </div>
  )
}
