'use client'

import { useState } from 'react'

export default function EmployerFeedbackPage() {
  const [feedbackType, setFeedbackType] = useState('SKILL_GAP')
  const [missingSkills, setMissingSkills] = useState('SQL & Databases, REST API Development, Communication Skills (English)')
  const [readinessScore, setReadinessScore] = useState(3.4)
  const [relevanceScore, setRelevanceScore] = useState(3.8)
  const [comments, setComments] = useState('Candidates possess good theoretical understanding but struggle with production-grade REST API integrations and advanced SQL schema design.')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatusMessage('Industry feedback successfully logged. Findings have been incorporated into national Skill Intelligence and Program Intelligence engines.')
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Industry Skill Feedback & Demand Signals</h1>
            <p className="page-header__description">
              Google India Pvt. Ltd. · Direct employer signal channel feeding public skilling curriculum adjustments (MASTER_PROMPT §8.4)
            </p>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div style={{
          padding: 'var(--sp-4)', background: 'var(--chip-verified-bg)', border: '1px solid var(--chip-verified-border)',
          borderRadius: 'var(--r-container)', fontSize: 'var(--text-sm)', color: 'var(--verified)', marginBottom: 'var(--sp-6)',
        }}>
          {statusMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
        padding: 'var(--sp-6)', maxWidth: '720px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
              Feedback Category
            </label>
            <select
              value={feedbackType}
              onChange={e => setFeedbackType(e.target.value)}
              style={{
                width: '100%', padding: 'var(--sp-2) var(--sp-3)', border: '1px solid var(--line)',
                borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', background: 'var(--surface)',
              }}
            >
              <option value="SKILL_GAP">Skill Deficit & Missing Competencies</option>
              <option value="CANDIDATE_READINESS">Candidate Interview Readiness Evaluation</option>
              <option value="CURRICULUM_RELEVANCE">Curriculum Industry Relevance Review</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
              Observed Missing Technical & Soft Skills (Comma separated)
            </label>
            <input
              type="text"
              required
              value={missingSkills}
              onChange={e => setMissingSkills(e.target.value)}
              style={{
                width: '100%', padding: 'var(--sp-2) var(--sp-3)', border: '1px solid var(--line)',
                borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', background: 'var(--surface)',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                Candidate Readiness Rating: {readinessScore} / 5.0
              </label>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={readinessScore}
                onChange={e => setReadinessScore(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                Curriculum Industry Relevance: {relevanceScore} / 5.0
              </label>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={relevanceScore}
                onChange={e => setRelevanceScore(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
              Detailed Feedback & Recommendations for Skilling Partners
            </label>
            <textarea
              rows={4}
              required
              value={comments}
              onChange={e => setComments(e.target.value)}
              style={{
                width: '100%', padding: 'var(--sp-2)', border: '1px solid var(--line)',
                borderRadius: 'var(--r-control)', fontSize: 'var(--text-xs)', background: 'var(--surface)',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '10px 16px', background: '#FFFFFF', color: '#000000', border: '1px solid #FFFFFF',
              borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer',
            }}
          >
            Submit Feedback into Skill Intelligence Engine →
          </button>
        </div>
      </form>
    </div>
  )
}
