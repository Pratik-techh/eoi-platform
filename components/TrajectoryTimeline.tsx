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
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', padding: 'var(--sp-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-6)' }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-md)', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Longitudinal Employment Trajectory
          </h2>
          <p style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginTop: 2 }}>
            Append-only verified transitions for {studentName ?? 'Learner'} ({studentId ?? 'EOI-S-0001'})
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
          <StatusChip status="VERIFIED" label="Immutable Event Ledger" />
        </div>
      </div>

      {outcomes.length === 0 ? (
        <div style={{ padding: 'var(--sp-8)', textAlign: 'center', color: 'var(--muted)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
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
            width: 1,
            background: 'var(--line)',
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
            {outcomes.map((item, idx) => {
              const isCurrent = idx === 0

              let markerColor = 'var(--verified)'
              let markerHalo = 'var(--halo-verified)'
              if (item.employment_status === 'UNEMPLOYMENT_REPORTED') {
                markerColor = 'var(--pending)'
                markerHalo = 'var(--halo-pending)'
              }
              if (item.employment_status === 'VERIFIED_UNEMPLOYED') {
                markerColor = 'var(--muted)'
                markerHalo = 'none'
              }
              if (item.employment_status === 'DISPUTED') {
                markerColor = 'var(--disputed)'
                markerHalo = 'var(--halo-disputed)'
              }

              return (
                <div key={item.id} style={{ position: 'relative' }}>
                  {/* Timeline circular diode node marker */}
                  <div style={{
                    position: 'absolute',
                    left: -29,
                    top: 6,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: 'var(--surface)',
                    border: `2px solid ${markerColor}`,
                    boxShadow: markerHalo,
                  }} />

                  <div style={{
                    background: isCurrent ? 'var(--surface-container-high)' : 'var(--surface-container-low)',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--r-control)',
                    padding: 'var(--sp-4)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                          {item.job_role}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--muted)', marginLeft: 8 }}>
                          · {item.org_id.includes('google') ? 'Google India Pvt. Ltd.' : 'Authorized Partner Employer'}
                        </span>
                      </div>
                      <StatusChip status={item.employment_status} />
                    </div>

                    <div style={{
                      display: 'flex', gap: 'var(--sp-4)', marginTop: 8, flexWrap: 'wrap',
                      fontSize: '11px', color: 'var(--muted)', fontFamily: 'var(--font-mono)',
                    }}>
                      <span>JOINED: {item.start_date}</span>
                      {item.end_date && <span>DEPARTED: {item.end_date}</span>}
                      <span>TYPE: {item.employment_type}</span>
                      <span>ID: {item.id}</span>
                    </div>

                    {item.employment_status === 'UNEMPLOYMENT_REPORTED' && (
                      <div style={{
                        marginTop: 'var(--sp-3)', padding: 'var(--sp-2) var(--sp-3)',
                        background: 'var(--chip-pending-bg)', border: '1px solid var(--chip-pending-border)',
                        borderRadius: 'var(--r-badge)', fontSize: '11px', color: 'var(--pending)',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        <strong>Unemployment Reported:</strong> Departure date registered as {item.end_date ?? 'today'}. Awaiting employer reconciliation. Prior employment record remains preserved in immutable history.
                      </div>
                    )}

                    {item.employment_status === 'VERIFIED_UNEMPLOYED' && (
                      <div style={{
                        marginTop: 'var(--sp-3)', padding: 'var(--sp-2) var(--sp-3)',
                        background: 'var(--surface-container-low)', border: '1px solid var(--line)',
                        borderRadius: 'var(--r-badge)', fontSize: '11px', color: 'var(--muted)',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        <strong>Reconciled & Verified Unemployed:</strong> Employer confirmed departure on {item.end_date}. Learner is eligible for immediate re-skilling placement programs.
                      </div>
                    )}

                    {item.rejection_reason && (
                      <div style={{
                        marginTop: 'var(--sp-3)', padding: 'var(--sp-2) var(--sp-3)',
                        background: 'var(--chip-disputed-bg)', border: '1px solid var(--chip-disputed-border)',
                        borderRadius: 'var(--r-badge)', fontSize: '11px', color: 'var(--disputed)',
                        fontFamily: 'var(--font-mono)',
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
