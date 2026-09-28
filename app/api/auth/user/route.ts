import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { DEMO_ACCOUNTS } from '@/lib/db/store'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('eoi_session')?.value

  if (!token) {
    return NextResponse.json({ user: null })
  }

  try {
    const parsed = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'))
    const found = DEMO_ACCOUNTS.find(a => a.email === parsed.email)
    if (!found) return NextResponse.json({ user: null })

    return NextResponse.json({
      user: {
        id: found.id,
        email: found.email,
        user_metadata: { role: found.role, full_name: found.name },
      },
    })
  } catch {
    return NextResponse.json({ user: null })
  }
}
