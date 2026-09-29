import { NextResponse } from 'next/server'
import { executeFullStatutoryVerification } from '@/lib/adapters/live-registry'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { candidateId = 'CANDIDATE-001', uan, cin, wageMonth = '08/2026' } = body

    if (!uan || !cin) {
      return NextResponse.json(
        { success: false, error: 'Both UAN (Universal Account Number) and CIN (Corporate ID) are required.' },
        { status: 400 }
      )
    }

    const result = executeFullStatutoryVerification(candidateId, uan, cin, wageMonth)

    return NextResponse.json({
      success: result.verified,
      result,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal statutory adapter error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
