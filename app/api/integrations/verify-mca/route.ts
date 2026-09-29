import { NextResponse } from 'next/server'
import { queryMCARegistry, parseCIN } from '@/lib/adapters/live-registry'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cin } = body

    if (!cin) {
      return NextResponse.json({ success: false, error: 'CIN is required.' }, { status: 400 })
    }

    const check = parseCIN(cin)
    if (!check.valid) {
      return NextResponse.json({ success: false, error: check.reason }, { status: 400 })
    }

    const entity = queryMCARegistry(cin)
    return NextResponse.json({ success: true, entity })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal MCA registry error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
