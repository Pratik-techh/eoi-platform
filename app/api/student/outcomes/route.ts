import { NextResponse } from 'next/server'
import { db } from '@/lib/db/store'

export async function GET() {
  // Returns Student X's outcomes (EOI-S-HERO-0001)
  const outcomes = db.employmentOutcomes.filter(o => o.eoi_student_id === 'EOI-S-HERO-0001')
  return NextResponse.json({ outcomes })
}
