import { NextResponse } from 'next/server'
import { db } from '@/lib/db/store'

export async function GET() {
  const events = db.auditEvents
  const verification = db.verifyLedgerChain()
  return NextResponse.json({ events, verification })
}
