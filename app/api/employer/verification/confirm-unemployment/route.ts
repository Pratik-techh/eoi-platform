import { NextResponse } from 'next/server'
import { db } from '@/lib/db/store'

export async function POST(request: Request) {
  try {
    const { outcomeId } = await request.json()
    const result = db.confirmUnemployment({
      outcomeId,
      actorId: 'usr-employer-01',
      actorRole: 'employer_verifier',
    })
    return NextResponse.json(result)
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
