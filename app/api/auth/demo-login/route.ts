import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { DEMO_ACCOUNTS } from '@/lib/db/store'

const ROLE_HOME: Record<string, string> = {
  gov_analyst: '/gov/dashboard',
  gov_program_admin: '/gov/dashboard',
  gov_auditor: '/gov/audit',
  agency_admin: '/agency/dashboard',
  agency_officer: '/agency/dashboard',
  student: '/student/dashboard',
  employer_admin: '/employer/dashboard',
  employer_verifier: '/employer/verification',
  security_officer: '/platform/security',
  platform_ops: '/platform/health',
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    const account = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.toLowerCase())
    if (!account) {
      return NextResponse.json({ error: 'Account not found. Please use a valid demo account.' }, { status: 404 })
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

    const redirectUrl = ROLE_HOME[account.role] ?? '/gov/dashboard'

    return NextResponse.json({
      ok: true,
      redirectUrl,
      user: {
        id: account.id,
        email: account.email,
        role: account.role,
        name: account.name,
      },
    })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
