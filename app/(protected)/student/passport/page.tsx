'use client'

import { useState } from 'react'
import { StatusChip } from '@/components/StatusChip'

export default function StudentPassportPage() {
  const [shareEmployment, setShareEmployment] = useState(true)
  const [shareAssessments, setShareAssessments] = useState(true)
  const [shareProjects, setShareProjects] = useState(true)

  const student = {
    name: 'Arjun Singh',
    id: 'EOI-S-HERO-0001',
    agency: 'Delhi Skill Development Institute',
    course: 'Full Stack Web Development',
    nsqf: 'NSQF Level 5',
    completionDate: '28 Jul 2026',
    ledgerHash: 'b4a89f921345d89ce198274a1e948192a8372649172839218274aef129481920',
  }

  const skills = [
    { name: 'Python Programming', proficiency: 'Advanced (Level 4)', verified: true },
    { name: 'REST API Development', proficiency: 'Advanced (Level 4)', verified: true },
    { name: 'React.js', proficiency: 'Intermediate (Level 3)', verified: true },
    { name: 'SQL & Databases', proficiency: 'Intermediate (Level 3)', verified: true },
    { name: 'Git & Version Control', proficiency: 'Advanced (Level 4)', verified: true },
  ]

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Employability Passport</h1>
            <p className="page-header__description">
              Cryptographically verifiable digital credential · Digital Personal Data Protection (DPDP) aligned
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <button
              onClick={() => window.print()}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-2)',
                padding: '6px var(--sp-4)', background: 'var(--primary)', color: 'white',
                border: 'none', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)',
                fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)',
              }}
            >
              Print / Save PDF Credential
            </button>
          </div>
        </div>
      </div>

      {/* Main Passport Document Container */}
      <div style={{
        background: 'var(--surface)', border: '2px solid var(--primary)', borderRadius: 'var(--r-container)',
        padding: 'var(--sp-8)', maxWidth: '800px', margin: '0 auto var(--sp-8)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        {/* Passport Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          borderBottom: '2px solid var(--line)', paddingBottom: 'var(--sp-6)', marginBottom: 'var(--sp-6)',
        }}>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.08em' }}>
              REPUBLIC OF INDIA · SKILL OUTCOME CREDENTIAL
            </div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>
              {student.name}
            </h2>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', marginTop: 2 }}>
              Accredited Program: <strong>{student.course}</strong> ({student.nsqf})
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 2 }}>
              Training Authority: {student.agency}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{
              width: 64, height: 64, background: 'var(--canvas)', border: '1px solid var(--line)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 0 var(--sp-2) auto',
            }}>
              {/* Simulated QR Code */}
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="6" height="6"/>
                <rect x="15" y="3" width="6" height="6"/>
                <rect x="3" y="15" width="6" height="6"/>
                <path d="M15 15h2v2h-2zM19 19h2v2h-2zM15 19h2v2h-2zM19 15h2v2h-2z"/>
              </svg>
            </div>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
              {student.id}
            </div>
          </div>
        </div>

        {/* Verified Skills Grid */}
        <div style={{ marginBottom: 'var(--sp-6)' }}>
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)', marginBottom: 'var(--sp-3)' }}>
            VERIFIED ASSESSED SKILLS & PROFICIENCIES
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--sp-2)' }}>
            {skills.map(sk => (
              <div
                key={sk.name}
                style={{
                  padding: 'var(--sp-2) var(--sp-3)', background: 'var(--canvas)',
                  border: '1px solid var(--line)', borderRadius: 'var(--r-control)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)' }}>{sk.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{sk.proficiency}</div>
                </div>
                <StatusChip status="VERIFIED" label="Certified" />
              </div>
            ))}
          </div>
        </div>

        {/* Verified Employment Record */}
        {shareEmployment && (
          <div style={{ marginBottom: 'var(--sp-6)' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)', marginBottom: 'var(--sp-3)' }}>
              INDEPENDENTLY VERIFIED EMPLOYMENT TRAJECTORY
            </h3>
            <div style={{
              padding: 'var(--sp-4)', background: 'var(--chip-verified-bg)',
              border: '1px solid var(--chip-verified-border)', borderRadius: 'var(--r-control)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)' }}>
                    Software Engineer · Google India Pvt. Ltd.
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 2 }}>
                    Joined: 12 Aug 2026 · Location: Bengaluru · Employer CIN: U72200KA2004FTC033590
                  </div>
                </div>
                <StatusChip status="VERIFIED" label="Corporate Verified" />
              </div>
            </div>
          </div>
        )}

        {/* Ledger Cryptographic Seal */}
        <div style={{
          borderTop: '1px dashed var(--line)', paddingTop: 'var(--sp-4)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap',
          fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)', gap: 'var(--sp-2)',
        }}>
          <div>
            Ledger Audit Chain Reference: <code>{student.ledgerHash.substring(0, 24)}…</code>
          </div>
          <div>
            Verified by: EOI Platform Consensus Protocol
          </div>
        </div>
      </div>

      {/* Visibility Controls (DPDP Compliance per MASTER_PROMPT §5.2) */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
        padding: 'var(--sp-5)', maxWidth: '800px', margin: '0 auto',
      }}>
        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-3)' }}>
          DPDP Visibility & Consent Controls
        </h3>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 'var(--sp-4)' }}>
          Under Digital Personal Data Protection provisions, you control which sections of your employability passport are visible to prospective employers and third parties.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', fontSize: 'var(--text-xs)', color: 'var(--ink)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={shareEmployment}
              onChange={e => setShareEmployment(e.target.checked)}
            />
            Share verified employment trajectory with prospective employers
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', fontSize: 'var(--text-xs)', color: 'var(--ink)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={shareAssessments}
              onChange={e => setShareAssessments(e.target.checked)}
            />
            Share detailed theory and practical assessment scores
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', fontSize: 'var(--text-xs)', color: 'var(--ink)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={shareProjects}
              onChange={e => setShareProjects(e.target.checked)}
            />
            Share capstone project evaluations
          </label>
        </div>
      </div>
    </div>
  )
}
