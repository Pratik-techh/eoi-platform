'use client'

import { useState } from 'react'
import { EvidenceBlock } from '@/components/EvidenceBlock'

export default function GovAiPage() {
  const [question, setQuestion] = useState('Why is employment conversion low for Software Engineering in Rajasthan?')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<{
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
  } | null>({
    intent: 'PROGRAM_LEAKAGE_ANALYSIS',
    evidence: {
      programConversion: '18.2%',
      largestDropStage: 'Interview → Employment (-74.1% drop)',
      jobReadyRate: '78.2%',
      interviewRate: '71.0%',
      employmentRate: '18.2%',
      missingSkills: ['SQL & Databases', 'REST API Architecture', 'Workplace English Communication'],
      eventCount: 420,
      feedbackCount: 14,
      calculationVersion: '1.2',
    },
    explanation:
      'Verified outcome evidence indicates a critical breakdown between candidate interviews and final employment offers for Software Engineering in Rajasthan. While 78.2% of trainees achieve job readiness and 71.0% proceed to interviews, only 18.2% convert to verified employment. Grounded enterprise feedback from 14 corporate partners highlights a consistent deficit in practical SQL database querying and production REST API architecture. Trainees demonstrate theoretical competence but fail technical code evaluations requiring real-world database manipulation.',
  })

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Simulate intent router + parameterised query + response validator
    setTimeout(() => {
      setResponse({
        intent: 'PROGRAM_LEAKAGE_ANALYSIS',
        evidence: {
          programConversion: '18.2%',
          largestDropStage: 'Interview → Employment (-74.1% drop)',
          jobReadyRate: '78.2%',
          interviewRate: '71.0%',
          employmentRate: '18.2%',
          missingSkills: ['SQL & Databases', 'REST API Architecture', 'Workplace English Communication'],
          eventCount: 420,
          feedbackCount: 14,
          calculationVersion: '1.2',
        },
        explanation:
          'Verified outcome evidence indicates a critical breakdown between candidate interviews and final employment offers for Software Engineering in Rajasthan. While 78.2% of trainees achieve job readiness and 71.0% proceed to interviews, only 18.2% convert to verified employment. Grounded enterprise feedback from 14 corporate partners highlights a consistent deficit in practical SQL database querying and production REST API architecture. Trainees demonstrate theoretical competence but fail technical code evaluations requiring real-world database manipulation.',
      })
      setLoading(false)
    }, 400)
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">AI Outcome Intelligence Analyst</h1>
            <p className="page-header__description">
              Evidence-grounded analytical explanations · Read-only access · Citations required on all numbers (MASTER_PROMPT §12)
            </p>
          </div>
        </div>
      </div>

      {/* Principle Banner */}
      <div style={{
        padding: 'var(--sp-3) var(--sp-4)', background: 'var(--canvas)', border: '1px solid var(--line)',
        borderRadius: 'var(--r-container)', fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 'var(--sp-6)',
        lineHeight: 1.5,
      }}>
        <strong>AI Non-Negotiable Principle (P5):</strong> AI is downstream of verified data and never the source of truth. It cannot verify employment, create employment records, override verification, fabricate statistics, or determine public policy. Answers are bounded to pre-aggregated structured evidence objects.
      </div>

      {/* Question Form */}
      <form onSubmit={handleAsk} style={{ marginBottom: 'var(--sp-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Ask a question about program performance, leakage, or skill gaps…"
            style={{
              flex: 1, padding: 'var(--sp-3) var(--sp-4)', border: '1px solid var(--line)',
              borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', color: 'var(--ink)',
              background: 'var(--surface)', outline: 'none', fontFamily: 'var(--font-ui)',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: 'var(--sp-3) var(--sp-6)', background: 'var(--primary)', color: 'white',
              border: 'none', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)',
              fontWeight: 600, cursor: loading ? 'wait' : 'pointer', fontFamily: 'var(--font-ui)',
            }}
          >
            {loading ? 'Interpreting evidence…' : 'Analyze evidence'}
          </button>
        </div>

        {/* Suggested prompts */}
        <div style={{ display: 'flex', gap: 'var(--sp-2)', marginTop: 'var(--sp-2)', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: 'var(--muted)', alignSelf: 'center' }}>Suggested:</span>
          {[
            'Why is employment conversion low for Software Engineering in Rajasthan?',
            'Which skills exhibit the highest demand-supply mismatch nationally?',
            'What is the 6-month retention rate for Full Stack Web Development?',
          ].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setQuestion(s)}
              style={{
                fontSize: '11px', color: 'var(--primary)', background: 'var(--canvas)',
                border: '1px solid var(--line)', padding: '2px 8px', borderRadius: 'var(--r-control)',
                cursor: 'pointer', fontFamily: 'var(--font-ui)',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </form>

      {/* Evidence Block Output */}
      {response && (
        <EvidenceBlock
          question={question}
          intent={response.intent}
          evidence={response.evidence}
          explanation={response.explanation}
        />
      )}
    </div>
  )
}
