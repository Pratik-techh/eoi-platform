'use client'

interface EvidenceBlockProps {
  question: string
  intent: string
  evidence: {
    programConversion: string
    largestDropStage: string
    jobReadyRate: string
    interviewRate: string
    employmentRate: string
    missingSkills: string[]
    eventCount: number
    feedbackCount: number
    calculationVersion: string
  }
  explanation: string
}

export function EvidenceBlock({ question, intent, evidence, explanation }: EvidenceBlockProps) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
      padding: 'var(--sp-6)', marginBottom: 'var(--sp-6)',
    }}>
      {/* Header notice */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingBottom: 'var(--sp-4)', borderBottom: '1px solid var(--line)', marginBottom: 'var(--sp-4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
          <span style={{
            fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--r-control)',
            background: 'var(--chip-info-bg)', color: 'var(--info)', border: '1px solid var(--chip-info-border)',
          }}>
            AI EVIDENCE EXPLAINER
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>
            Intent: <strong>{intent}</strong>
          </span>
        </div>
        <span style={{
          fontSize: '10px', fontWeight: 600, color: 'var(--muted)',
          background: 'var(--canvas)', padding: '2px 6px', borderRadius: 2,
        }}>
          Policy decisions remain with government
        </span>
      </div>

      <div style={{ marginBottom: 'var(--sp-4)' }}>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', fontWeight: 600 }}>QUESTION</div>
        <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink)', marginTop: 2 }}>
          {question}
        </div>
      </div>

      {/* AI Interpretation */}
      <div style={{
        background: 'var(--canvas)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)',
        padding: 'var(--sp-4)', marginBottom: 'var(--sp-5)',
      }}>
        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>
          AI-GENERATED EXPLANATION OF VERIFIED EVIDENCE
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
          {explanation}
        </p>
      </div>

      {/* Structured Evidence Table */}
      <div style={{
        border: '1px solid var(--line)', borderRadius: 'var(--r-control)',
        overflow: 'hidden', marginBottom: 'var(--sp-4)',
      }}>
        <div style={{
          padding: 'var(--sp-2) var(--sp-3)', background: 'var(--canvas)',
          borderBottom: '1px solid var(--line)', fontSize: '11px', fontWeight: 700, color: 'var(--muted)',
        }}>
          GROUNDED STRUCTURED EVIDENCE
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 1, background: 'var(--line)',
        }}>
          <div style={{ background: 'var(--surface)', padding: 'var(--sp-3)' }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)' }}>PROGRAM CONVERSION</div>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--ink)' }}>
              {evidence.programConversion}
            </div>
          </div>
          <div style={{ background: 'var(--surface)', padding: 'var(--sp-3)' }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)' }}>LARGEST LEAKAGE</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--disputed)' }}>
              {evidence.largestDropStage}
            </div>
          </div>
          <div style={{ background: 'var(--surface)', padding: 'var(--sp-3)' }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)' }}>JOB-READY RATE</div>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--ink)' }}>
              {evidence.jobReadyRate}
            </div>
          </div>
          <div style={{ background: 'var(--surface)', padding: 'var(--sp-3)' }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)' }}>INTERVIEW RATE</div>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--ink)' }}>
              {evidence.interviewRate}
            </div>
          </div>
          <div style={{ background: 'var(--surface)', padding: 'var(--sp-3)' }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)' }}>VERIFIED EMPLOYMENT</div>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--verified)' }}>
              {evidence.employmentRate}
            </div>
          </div>
        </div>
      </div>

      {/* Provenance footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',
        fontSize: '11px', color: 'var(--muted)', fontFamily: 'var(--font-mono)',
      }}>
        <span>Evidence Sources: {evidence.eventCount} verified events · {evidence.feedbackCount} employer reviews</span>
        <span>Version: {evidence.calculationVersion} · Timestamp: {new Date().toISOString().split('T')[0]}</span>
      </div>
    </div>
  )
}
