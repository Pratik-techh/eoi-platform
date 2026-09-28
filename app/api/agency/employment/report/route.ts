import { NextResponse } from 'next/server'
import { db } from '@/lib/db/store'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Agency reporting employment outcome:
    // MUST enter PENDING_VERIFICATION (never VERIFIED_EMPLOYED)
    const newOutcome = {
      id: `emp-agency-${Date.now()}`,
      eoi_student_id: body.studentId,
      agency_id: 'ag-delhi-01',
      org_id: 'org-google-01',
      job_role: body.jobRole,
      employment_type: 'FULL_TIME',
      start_date: body.startDate,
      employment_status: 'PENDING_VERIFICATION' as const,
      sequence_number: 1,
      reported_by: 'usr-agency-01',
      created_at: new Date().toISOString(),
    }

    db.employmentOutcomes.unshift(newOutcome)

    db.appendLedgerEvent({
      actor_id: 'usr-agency-01',
      actor_role: 'agency_officer',
      event_type: 'EMPLOYMENT_REPORTED',
      source: 'AGENCY',
      entity_type: 'employment_outcome',
      entity_id: newOutcome.id,
      previous_state: null,
      new_state: 'PENDING_VERIFICATION',
      correlation_id: `corr-rep-${Date.now()}`,
      payload: {
        eoi_student_id: body.studentId,
        employer: body.employerName,
        identifier: `${body.idClass}:${body.idValue}`,
        role: body.jobRole,
      },
    })

    return NextResponse.json({ success: true, outcome: newOutcome })
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
