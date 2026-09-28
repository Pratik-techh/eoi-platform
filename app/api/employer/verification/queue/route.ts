import { NextResponse } from 'next/server'
import { db } from '@/lib/db/store'

export async function GET() {
  // Returns items in PENDING_VERIFICATION or UNEMPLOYMENT_REPORTED
  const queue = db.employmentOutcomes.filter(
    o => o.employment_status === 'PENDING_VERIFICATION' || o.employment_status === 'UNEMPLOYMENT_REPORTED'
  )
  return NextResponse.json({ queue })
}
