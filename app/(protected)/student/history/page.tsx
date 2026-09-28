import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { TrajectoryTimeline } from '@/components/TrajectoryTimeline'

export const metadata: Metadata = {
  title: 'Employment History | Employability Passport',
  description: 'Verified historical employment trajectory and longitudinal tenure records',
}

export default async function StudentHistoryPage() {
  const supabase = await createClient()
  const { data: outcomes } = await supabase
    .from('employment_outcomes')
    .select('*')
    .eq('eoi_student_id', 'EOI-S-HERO-0001')

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Historical Employment Trajectory</h1>
            <p className="page-header__description">
              Permanent, tamper-evident record of all verified employment and transition events (MASTER_PROMPT §8.3)
            </p>
          </div>
        </div>
      </div>

      <TrajectoryTimeline
        outcomes={outcomes ?? []}
        studentName="Arjun Singh"
        studentId="EOI-S-HERO-0001"
      />
    </div>
  )
}
