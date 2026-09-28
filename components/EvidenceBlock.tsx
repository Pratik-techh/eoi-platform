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
      background: '#0F0F0F',
      border: '1px solid #242424',
      borderRadius: 'var(--r-control)',
      padding: 'var(--sp-6)',
      marginBottom: 'var(--sp-6)',
    }}>
      {/* Header notice */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingBottom: 'var(--sp-4)', borderBottom: '1px solid #242424', marginBottom: 'var(--sp-4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
          <span style={{
            fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-badge)',
            background: '#151515', color: '#5B9DFF', border: '1px solid rgba(91, 157, 255, 0.4)',
            letterSpacing: '0.04em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#5B9DFF', boxShadow: '0 0 5px rgba(91, 157, 255, 0.5)' }} />
            AI Grounded Explainer
          </span>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase' }}>
            Intent: <strong style={{ color: '#FFFFFF' }}>{intent}</strong>
          </span>
        </div>
        <span style={{
          fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--muted)',
          background: '#080808', border: '1px solid #242424', padding: '2px 8px', borderRadius: 2,
          textTransform: 'uppercase', letterSpacing: '0.02em',
        }}>
          Policy decisions remain with government
        </span>
      </div>

      <div style={{ marginBottom: 'var(--sp-4)' }}>
        <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          QUESTION
        </div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', marginTop: 2 }}>
          {question}
        </div>
      </div>

      {/* AI Interpretation */}
      <div style={{
        background: '#080808', border: '1px solid #242424', borderRadius: 'var(--r-control)',
        padding: 'var(--sp-4)', marginBottom: 'var(--sp-5)',
      }}>
        <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#18B6A4', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          VERIFIED EVIDENCE SYNTHESIS
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-on-surface)', lineHeight: 1.6, margin: 0 }}>
          {explanation}
        </p>
      </div>

      {/* Structured Evidence Table */}
      <div style={{
        border: '1px solid #242424', borderRadius: 'var(--r-control)',
        overflow: 'hidden', marginBottom: 'var(--sp-4)',
      }}>
        <div style={{
          padding: '8px 12px', background: '#080808',
          borderBottom: '1px solid #242424', fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--muted)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          GROUNDED STRUCTURED TELEMETRY
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 1, background: '#242424',
        }}>
          <div style={{ background: '#0F0F0F', padding: '12px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase' }}>PROGRAM CONVERSION</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginTop: 3 }}>
              {evidence.programConversion}
            </div>
          </div>
          <div style={{ background: '#0F0F0F', padding: '12px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase' }}>LARGEST LEAKAGE</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#E05252', marginTop: 3 }}>
              {evidence.largestDropStage}
            </div>
          </div>
          <div style={{ background: '#0F0F0F', padding: '12px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase' }}>JOB-READY RATE</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginTop: 3 }}>
              {evidence.jobReadyRate}
            </div>
          </div>
          <div style={{ background: '#0F0F0F', padding: '12px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase' }}>INTERVIEW RATE</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginTop: 3 }}>
              {evidence.interviewRate}
            </div>
          </div>
          <div style={{ background: '#0F0F0F', padding: '12px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase' }}>VERIFIED EMPLOYMENT</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#18B6A4', marginTop: 3 }}>
              {evidence.employmentRate}
            </div>
          </div>
        </div>
      </div>

      {/* Provenance footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',
        fontSize: '11px', color: 'var(--muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.02em',
      }}>
        <span>SOURCES: {evidence.eventCount} VERIFIED EVENTS · {evidence.feedbackCount} REVIEWS</span>
        <span>VERSION: {evidence.calculationVersion} · UTC: {new Date().toISOString().split('T')[0]}</span>
      </div>
    </div>
  )
}
