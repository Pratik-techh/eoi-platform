'use client'

import { DataTable } from '@/components/DataTable'
import { StatusChip } from '@/components/StatusChip'

export default function AgencyAssessmentsPage() {
  const assessments = [
    {
      id: 'asm-01',
      student_id: 'EOI-S-HERO-0001',
      student_name: 'Arjun Singh',
      course: 'Full Stack Web Development',
      theory_score: '92 / 100',
      practical_score: '96 / 100',
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
      theory_score: '84 / 100',
      practical_score: '88 / 100',
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
      theory_score: '89 / 100',
      practical_score: '91 / 100',
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
      theory_score: '78 / 100',
      practical_score: '82 / 100',
      capstone_project: 'Hospital Clinical Triage & CPR Simulation',
      assessed_date: '2026-08-04',
      assessor: 'Healthcare Sector Council',
      status: 'VERIFIED',
    },
  ]

  const columns = [
    { key: 'student_name', label: 'Candidate Name', sortable: true },
    { key: 'student_id', label: 'EOI Student ID' },
    { key: 'course', label: 'Course' },
    { key: 'theory_score', label: 'Theory Score', sortable: true },
    { key: 'practical_score', label: 'Practical Score', sortable: true },
    { key: 'capstone_project', label: 'Evaluated Capstone Project' },
    { key: 'assessor', label: 'Independent Assessor' },
    {
      key: 'status',
      label: 'Evaluation Status',
      render: (a: any) => <StatusChip status={a.status} label="Certified Passed" />,
    },
  ]

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Assessment & Certification Management</h1>
            <p className="page-header__description">
              Independent Sector Skill Council evaluation records · Feeds the automated job readiness scoring engine
            </p>
          </div>
        </div>
      </div>

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
