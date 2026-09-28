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
    <div style={{ background: '#0F0F0F', border: '1px solid #242424', borderRadius: 'var(--r-control)', padding: 'var(--sp-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-6)' }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-md)', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
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
            background: '#242424',
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
            {outcomes.map((item, idx) => {
              const isCurrent = idx === 0

              let markerColor = '#18B6A4'
              let markerHalo = '0 0 6px rgba(24, 182, 164, 0.45)'
              if (item.employment_status === 'UNEMPLOYMENT_REPORTED') {
                markerColor = '#D99A32'
                markerHalo = '0 0 6px rgba(217, 154, 50, 0.45)'
              }
              if (item.employment_status === 'VERIFIED_UNEMPLOYED') {
                markerColor = '#8E9192'
                markerHalo = 'none'
              }
              if (item.employment_status === 'DISPUTED') {
                markerColor = '#E05252'
                markerHalo = '0 0 6px rgba(224, 82, 82, 0.45)'
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
                    background: '#0F0F0F',
                    border: `2px solid ${markerColor}`,
                    boxShadow: markerHalo,
                  }} />

                  <div style={{
                    background: isCurrent ? '#151515' : '#080808',
                    border: '1px solid #242424',
                    borderRadius: 'var(--r-control)',
                    padding: 'var(--sp-4)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
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
                        background: '#080808', border: '1px solid #D99A32',
                        borderRadius: 'var(--r-badge)', fontSize: '11px', color: '#D99A32',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        <strong>Unemployment Reported:</strong> Departure date registered as {item.end_date ?? 'today'}. Awaiting employer reconciliation. Prior employment record remains preserved in immutable history.
                      </div>
                    )}

                    {item.employment_status === 'VERIFIED_UNEMPLOYED' && (
                      <div style={{
                        marginTop: 'var(--sp-3)', padding: 'var(--sp-2) var(--sp-3)',
                        background: '#080808', border: '1px solid #242424',
                        borderRadius: 'var(--r-badge)', fontSize: '11px', color: 'var(--muted)',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        <strong>Reconciled & Verified Unemployed:</strong> Employer confirmed departure on {item.end_date}. Learner is eligible for immediate re-skilling placement programs.
                      </div>
                    )}

                    {item.rejection_reason && (
                      <div style={{
                        marginTop: 'var(--sp-3)', padding: 'var(--sp-2) var(--sp-3)',
                        background: '#080808', border: '1px solid #E05252',
                        borderRadius: 'var(--r-badge)', fontSize: '11px', color: '#E05252',
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
