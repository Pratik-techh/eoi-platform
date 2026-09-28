import { NextResponse } from 'next/server'
import { db } from '@/lib/db/store'

export async function POST() {
  const result = db.verifyLedgerChain()
  return NextResponse.json(result)
}
