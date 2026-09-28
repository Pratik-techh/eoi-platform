import { NextResponse } from 'next/server'
import { db } from '@/lib/db/store'

export async function POST(request: Request) {
  try {
    const { outcomeId, reason } = await request.json()
    const result = db.rejectEmployment({
      outcomeId,
      actorId: 'usr-employer-01',
      actorRole: 'employer_verifier',
      reason,
    })
    return NextResponse.json(result)
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
