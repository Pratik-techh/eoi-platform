import { NextResponse } from 'next/server'
import { db } from '@/lib/db/store'

export async function POST(request: Request) {
  try {
    const { reason } = await request.json()
    const result = db.reportUnemployment({
      studentId: 'EOI-S-HERO-0001',
      actorId: 'usr-student-01',
      actorRole: 'student',
      reason,
    })
    return NextResponse.json(result)
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
