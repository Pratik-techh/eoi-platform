'use client'

import { StatusChip } from './StatusChip'
import type { EmploymentOutcome } from '@/lib/db/store'

interface TrajectoryTimelineProps {
  outcomes: EmploymentOutcome[]
  studentName?: string
  studentId?: string
}

export function TrajectoryTimeline({ outcomes, studentName, studentId }: TrajectoryTimelineProps) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)', padding: 'var(--sp-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-6)' }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)' }}>
            Longitudinal Employment Trajectory
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 2 }}>
            Append-only verified employment transitions for {studentName ?? 'Learner'} ({studentId ?? 'EOI-S-0001'})
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
          <StatusChip status="VERIFIED" label="Immutable Event Ledger" />
        </div>
      </div>

      {outcomes.length === 0 ? (
        <div style={{ padding: 'var(--sp-8)', textAlign: 'center', color: 'var(--muted)', fontSize: 'var(--text-sm)' }}>
          No employment trajectory records yet.
        </div>
      ) : (
        <div style={{ position: 'relative', paddingLeft: 'var(--sp-6)' }}>
          {/* Vertical timeline guide line */}
          <div style={{
            position: 'absolute',
            left: 11,
            top: 10,
            bottom: 10,
            width: 2,
            background: 'var(--line)',
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
            {outcomes.map((item, idx) => {
              const isCurrent = idx === 0

              let markerColor = 'var(--verified)'
              if (item.employment_status === 'UNEMPLOYMENT_REPORTED') markerColor = 'var(--pending)'
              if (item.employment_status === 'VERIFIED_UNEMPLOYED') markerColor = 'var(--muted)'
              if (item.employment_status === 'DISPUTED') markerColor = 'var(--disputed)'

              return (
                <div key={item.id} style={{ position: 'relative' }}>
                  {/* Timeline circular node marker */}
                  <div style={{
                    position: 'absolute',
                    left: -29,
                    top: 4,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: 'var(--surface)',
                    border: `3px solid ${markerColor}`,
                  }} />

                  <div style={{
                    background: isCurrent ? 'var(--canvas)' : 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--r-container)',
                    padding: 'var(--sp-4)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                      <div>
                        <span style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink)' }}>
                          {item.job_role}
                        </span>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', marginLeft: 8 }}>
                          · {item.org_id.includes('google') ? 'Google India Pvt. Ltd.' : 'Authorized Partner Employer'}
                        </span>
                      </div>
                      <StatusChip status={item.employment_status} />
                    </div>

                    <div style={{
                      display: 'flex', gap: 'var(--sp-4)', marginTop: 'var(--sp-2)',
                      fontSize: 'var(--text-xs)', color: 'var(--muted)', fontFamily: 'var(--font-mono)',
                    }}>
                      <span>Joined: {item.start_date}</span>
                      {item.end_date && <span>Departed: {item.end_date}</span>}
                      <span>Type: {item.employment_type}</span>
                      <span>Outcome ID: {item.id}</span>
                    </div>

                    {item.employment_status === 'UNEMPLOYMENT_REPORTED' && (
                      <div style={{
                        marginTop: 'var(--sp-3)', padding: 'var(--sp-2) var(--sp-3)',
                        background: 'var(--chip-pending-bg)', border: '1px solid var(--chip-pending-border)',
                        borderRadius: 'var(--r-control)', fontSize: 'var(--text-xs)', color: 'var(--pending)',
                      }}>
                        <strong>Unemployment Reported by Student:</strong> Departure date registered as {item.end_date ?? 'today'}. Awaiting employer reconciliation. Prior employment record remains preserved in immutable history.
                      </div>
                    )}

                    {item.employment_status === 'VERIFIED_UNEMPLOYED' && (
                      <div style={{
                        marginTop: 'var(--sp-3)', padding: 'var(--sp-2) var(--sp-3)',
                        background: 'var(--canvas)', border: '1px solid var(--line)',
                        borderRadius: 'var(--r-control)', fontSize: 'var(--text-xs)', color: 'var(--muted)',
                      }}>
                        <strong>Reconciled & Verified Unemployed:</strong> Employer confirmed departure on {item.end_date}. Learner is eligible for immediate re-skilling placement programs.
                      </div>
                    )}

                    {item.rejection_reason && (
                      <div style={{
                        marginTop: 'var(--sp-3)', padding: 'var(--sp-2) var(--sp-3)',
                        background: 'var(--chip-disputed-bg)', border: '1px solid var(--chip-disputed-border)',
                        borderRadius: 'var(--r-control)', fontSize: 'var(--text-xs)', color: 'var(--disputed)',
                      }}>
                        <strong>Employer Rejection Reason:</strong> {item.rejection_reason}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
