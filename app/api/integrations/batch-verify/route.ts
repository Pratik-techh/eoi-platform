import { NextResponse } from 'next/server'
import { executeFullStatutoryVerification } from '@/lib/adapters/live-registry'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { records } = body

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Records array is required and must not be empty.' },
        { status: 400 }
      )
    }

    const results = records.map((r, index) => {
      const candidateId = r.candidateId || `TRAINEE-${String(index + 1).padStart(4, '0')}`
      return executeFullStatutoryVerification(candidateId, r.uan || '', r.cin || '', r.wageMonth || '08/2026')
    })

    const totalCount = results.length
    const verifiedCount = results.filter(r => r.verified).length
    const suspectCount = totalCount - verifiedCount

    return NextResponse.json({
      success: true,
      stats: {
        total: totalCount,
        verified: verifiedCount,
        suspect: suspectCount,
        verificationRate: `${((verifiedCount / totalCount) * 100).toFixed(1)}%`,
      },
      results,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal batch verification error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
