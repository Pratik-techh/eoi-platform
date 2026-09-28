'use client'

import { DataTable } from '@/components/DataTable'
import { StatusChip } from '@/components/StatusChip'
import { db } from '@/lib/db/store'

export default function AgencyCoursesPage() {
  const courses = db.courses

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
      key: 'status',
      label: 'Accreditation Status',
      render: () => <StatusChip status="VERIFIED" label="NSDC Accredited" />,
    },
  ]

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Curriculum & Course Management</h1>
            <p className="page-header__description">
              NSDC-accredited skilling tracks · Target proficiency mapping per NSQF guidelines
            </p>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={courses ?? []}
        idKey="id"
        searchPlaceholder="Search curricula by name or sector…"
        exportFileName="agency_courses_export.csv"
      />
    </div>
  )
}
