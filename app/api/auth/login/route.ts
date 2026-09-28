import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { DEMO_ACCOUNTS } from '@/lib/db/store'

const DEMO_PASSWORD = 'Demo@EOI2026'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (password !== DEMO_PASSWORD) {
      return NextResponse.json({ error: 'Invalid login credentials' }, { status: 401 })
    }

    const account = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase())
    if (!account) {
      return NextResponse.json({ error: 'Account not found. Please use a demo account.' }, { status: 404 })
    }

    const sessionPayload = Buffer.from(
      JSON.stringify({
        id: account.id,
        email: account.email,
        role: account.role,
        name: account.name,
        created: Date.now(),
      })
    ).toString('base64')

    const cookieStore = await cookies()
    cookieStore.set('eoi_session', sessionPayload, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      user: {
        id: account.id,
        email: account.email,
        user_metadata: { role: account.role, full_name: account.name },
      },
    })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
