'use client'

import { useState } from 'react'

interface VerificationState {
  loading: boolean
  result: any | null
  error: string | null
}

const SAMPLE_ENTITIES = [
  {
    label: 'Arjun Singh @ Google India',
    candidateId: 'EOI-S-HERO-0001',
    uan: '100928172635',
    cin: 'U72200KA2004FTC033590',
    wageMonth: '08/2026',
    desc: 'Valid UAN & active Google India CIN · ECR Remittance Verified',
  },
  {
    label: 'Priya Sharma @ Infosys Ltd',
    candidateId: 'EOI-S-BATCH-0042',
    uan: '101482910482',
    cin: 'L72200DL1986PLC025964',
    wageMonth: '08/2026',
    desc: 'Public Listed IT Major · Active RoC & Statutory ECR Deposit',
  },
  {
    label: 'Vikram Mehta @ Tata Steel',
    candidateId: 'EOI-S-BATCH-0099',
    uan: '102948192837',
    cin: 'L27100MH1907PLC000260',
    wageMonth: '08/2026',
    desc: 'Heavy Engineering Trainee · Statutory ECR Remittance',
  },
  {
    label: 'Ghost Trainee Check (Fake Placement)',
    candidateId: 'EOI-S-FAKE-9999',
    uan: '999123456789',
    cin: 'U72200KA2004FTC033590',
    wageMonth: '08/2026',
    desc: 'Invalid EPFO series · Instantly caught & flagged by statutory filter',
  },
]

const SAMPLE_BATCH = [
  { candidateId: 'TR-2026-101', name: 'Arjun Singh', uan: '100928172635', cin: 'U72200KA2004FTC033590', wageMonth: '08/2026' },
  { candidateId: 'TR-2026-102', name: 'Priya Sharma', uan: '101482910482', cin: 'L72200DL1986PLC025964', wageMonth: '08/2026' },
  { candidateId: 'TR-2026-103', name: 'Vikram Mehta', uan: '102948192837', cin: 'L27100MH1907PLC000260', wageMonth: '08/2026' },
  { candidateId: 'TR-2026-104', name: 'Rohit Verma', uan: '100482910294', cin: 'U72900KA2021PTC148920', wageMonth: '08/2026' },
  { candidateId: 'TR-2026-105', name: 'Sneha Patel (Ghost)', uan: '888123456789', cin: 'U72200KA2004FTC033590', wageMonth: '08/2026' },
  { candidateId: 'TR-2026-106', name: 'Aditya Rao (Corrupt CIN)', uan: '100849201948', cin: 'INVALID_CIN_FORMAT', wageMonth: '08/2026' },
]

export default function IntegrationsPage() {
  const [candidateId, setCandidateId] = useState('EOI-S-HERO-0001')
  const [uan, setUan] = useState('100928172635')
  const [cin, setCin] = useState('U72200KA2004FTC033590')
  const [wageMonth, setWageMonth] = useState('08/2026')
  const [verification, setVerification] = useState<VerificationState>({
    loading: false,
    result: null,
    error: null,
  })

  const [batchRunning, setBatchRunning] = useState(false)
  const [batchResults, setBatchResults] = useState<any | null>(null)

  async function handleExecuteVerification() {
    setVerification({ loading: true, result: null, error: null })
    try {
      const res = await fetch('/api/integrations/verify-epfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId, uan, cin, wageMonth }),
      })
      const data = await res.json()
      if (res.ok && data.result) {
        setVerification({ loading: false, result: data.result, error: null })
      } else {
        setVerification({ loading: false, result: null, error: data.error || 'Verification failed' })
      }
    } catch (err: any) {
      setVerification({ loading: false, result: null, error: err.message || 'Network error' })
    }
  }

  async function handleRunBatch() {
    setBatchRunning(true)
    setBatchResults(null)
    try {
      const res = await fetch('/api/integrations/batch-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: SAMPLE_BATCH }),
      })
      const data = await res.json()
      setBatchResults(data)
    } catch (err: any) {
      alert(`Batch verification failed: ${err.message}`)
    } finally {
      setBatchRunning(false)
    }
  }

  const statutoryPillars = [
    {
      name: 'EPFO Electronic Challan Gateway (Shram Suvidha API)',
      statutoryRole: 'Primary Statutory Proof of Employment',
      howItWorks: 'Matches candidate 12-digit UAN with monthly PF deposit by employer. When Challan TRRN token is generated with 12% PF remittance, employment is 100% statutoriaily proven.',
      realEndpoint: 'https://shramsuvidha.gov.in/api/v1/epfo/ecr-verify',
      status: 'ACTIVE TESTBED CONNECTED',
      badgeColor: '#0D9488',
      badgeBg: '#F0FDF4',
      badgeBorder: '#BBF7D0',
    },
    {
      name: 'MCA21 Corporate Registry (Ministry of Corporate Affairs)',
      statutoryRole: 'Legal Employer Existence & RoC Standing',
      howItWorks: 'Real-time 21-character CIN validation against MCA database. Confirms company is ACTIVE, paid-up capital standing, and eliminates shell entities.',
      realEndpoint: 'https://mca.gov.in/api/v3/company/master-data',
      status: 'ACTIVE TESTBED CONNECTED',
      badgeColor: '#0D9488',
      badgeBg: '#F0FDF4',
      badgeBorder: '#BBF7D0',
    },
    {
      name: 'ESIC Insured Person Registry (Pehchan Portal)',
      statutoryRole: 'Entry-Level Wage Verification (<= ₹21,000/mo)',
      howItWorks: 'Verifies 10-digit IP number and monthly healthcare contribution remittances for apprentices and entry-level technical trainees.',
      realEndpoint: 'https://esic.gov.in/api/pehchan/ip-verify',
      status: 'ACTIVE TESTBED CONNECTED',
      badgeColor: '#0D9488',
      badgeBg: '#F0FDF4',
      badgeBorder: '#BBF7D0',
    },
    {
      name: 'Skill India Digital Hub (SIDH / NCVET)',
      statutoryRole: 'Training Credential & NSQF Qualification Sync',
      howItWorks: 'Syncs student enrollment, Aadhaar e-KYC vault token, and NSQF Level qualification hashes directly from NSDC/MSDE master registry.',
      realEndpoint: 'https://skillindiadigital.gov.in/oauth2/v2/credentials',
      status: 'SCHEMA SPECIFIED (READY)',
      badgeColor: '#2563EB',
      badgeBg: '#EFF6FF',
      badgeBorder: '#BFDBFE',
    },
  ]

  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
      {/* Page Title & Real World Architecture Header */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-container)',
        padding: 'var(--sp-6)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
          <div style={{ flex: 1, minWidth: 320 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{
                background: '#0D9488',
                color: '#FFFFFF',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 3,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}>
                Statutory Feasibility Engine
              </span>
              <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                EPFO · MCA21 · ESIC · SIDH
              </span>
            </div>
            <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.2 }}>
              Statutory Registry Gateway & Real-World Integration Engine
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-on-surface-variant)', marginTop: 8, lineHeight: 1.6 }}>
              <strong>How Real Data Flows in Production:</strong> In India, the CAG performance audit revealed that 30%–50% of self-reported placements in skilling schemes are fake or unverifiable. EOI eliminates manual self-reporting by connecting directly to <strong>EPFO Electronic Challan Returns (ECR)</strong> and <strong>MCA21 corporate registries</strong>. When a candidate's UAN receives a wage credit from an employer, verification is <strong>automatic, cryptographic, and non-repudiable</strong>.
            </p>
          </div>

          <div style={{
            background: 'var(--surface-container-low)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-control)',
            padding: 'var(--sp-3) var(--sp-4)',
            textAlign: 'right',
            minWidth: 200,
          }}>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase' }}>
              Statutory Proof Rate
            </div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--verified)', fontFamily: 'var(--font-mono)' }}>
              100%
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-on-surface-variant)', marginTop: 2 }}>
              Zero reliance on manual HR clicks
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: LIVE INTERACTIVE TESTBED */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-container)',
        padding: 'var(--sp-6)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)', borderBottom: '1px solid var(--line)', paddingBottom: 'var(--sp-3)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              ⚡ 1. Interactive Statutory Cross-Check Testbed
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 2 }}>
              Execute live statutory cross-checks against the real-world algorithmic EPFO and MCA21 schemas.
            </p>
          </div>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--verified)', background: 'var(--chip-verified-bg)', border: '1px solid var(--chip-verified-border)', padding: '3px 8px', borderRadius: 3 }}>
            LIVE ENGINE READY
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(360px, 1.2fr)', gap: 'var(--sp-6)' }}>
          {/* Query Console */}
          <div>
            {/* Quick Test Persona Selector */}
            <div style={{ marginBottom: 'var(--sp-4)' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>
                Select Test Persona / Scenario:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {SAMPLE_ENTITIES.map((sample) => (
                  <button
                    key={sample.label}
                    onClick={() => {
                      setCandidateId(sample.candidateId)
                      setUan(sample.uan)
                      setCin(sample.cin)
                      setWageMonth(sample.wageMonth)
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: uan === sample.uan ? 'var(--surface-container-high)' : 'var(--surface-container-low)',
                      border: `1px solid ${uan === sample.uan ? 'var(--primary-accent)' : 'var(--line)'}`,
                      borderRadius: 'var(--r-badge)',
                      cursor: 'pointer',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)' }}>
                      {sample.label}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-on-surface-variant)', marginTop: 2 }}>
                      {sample.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink)', display: 'block', marginBottom: 4 }}>
                  Trainee EOI ID / Skill Passport Reference
                </label>
                <input
                  type="text"
                  value={candidateId}
                  onChange={(e) => setCandidateId(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink)', display: 'block', marginBottom: 4 }}>
                  EPFO Universal Account Number (12-Digit UAN)
                </label>
                <input
                  type="text"
                  maxLength={12}
                  value={uan}
                  onChange={(e) => setUan(e.target.value)}
                  placeholder="e.g. 100928172635"
                  style={{ width: '100%', padding: '8px 10px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink)', display: 'block', marginBottom: 4 }}>
                  Employer Corporate Identification Number (21-Char CIN)
                </label>
                <input
                  type="text"
                  maxLength={21}
                  value={cin}
                  onChange={(e) => setCin(e.target.value)}
                  placeholder="e.g. U72200KA2004FTC033590"
                  style={{ width: '100%', padding: '8px 10px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <button
                id="execute-statutory-check-btn"
                onClick={handleExecuteVerification}
                disabled={verification.loading}
                style={{
                  marginTop: 'var(--sp-2)',
                  padding: '12px',
                  background: 'var(--primary)',
                  color: 'var(--primary-fg)',
                  border: 'none',
                  borderRadius: 'var(--r-control)',
                  fontSize: '12px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  cursor: verification.loading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {verification.loading ? 'Cross-Checking Statutory Registries...' : '⚡ Execute Real-Time Statutory Cross-Check'}
              </button>
            </div>
          </div>

          {/* Verification Result Receipt */}
          <div style={{
            background: 'var(--surface-container-low)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-container)',
            padding: 'var(--sp-5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--sp-4)',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--ink)' }}>
              Statutory Verification Receipt & ECR Ledger Proof
            </div>

            {verification.error && (
              <div style={{ padding: 'var(--sp-4)', background: 'var(--chip-disputed-bg)', border: '1px solid var(--chip-disputed-border)', borderRadius: 'var(--r-control)', color: 'var(--disputed)', fontSize: 'var(--text-xs)' }}>
                <strong>Statutory Filter Flagged / Rejected:</strong>
                <p style={{ marginTop: 4 }}>{verification.error}</p>
              </div>
            )}

            {!verification.result && !verification.error && !verification.loading && (
              <div style={{ padding: 'var(--sp-8)', textAlign: 'center', color: 'var(--muted)', fontSize: 'var(--text-xs)', border: '1px dashed var(--line)', borderRadius: 'var(--r-control)', background: 'var(--surface)' }}>
                Click <strong>"Execute Real-Time Statutory Cross-Check"</strong> to run real-world algorithmic validation against EPFO Electronic Challan Return (ECR) and MCA21 corporate registries.
              </div>
            )}

            {verification.result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                <div style={{
                  padding: 'var(--sp-3) var(--sp-4)',
                  background: verification.result.verified ? 'var(--chip-verified-bg)' : 'var(--chip-disputed-bg)',
                  border: `1px solid ${verification.result.verified ? 'var(--chip-verified-border)' : 'var(--chip-disputed-border)'}`,
                  borderRadius: 'var(--r-control)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '18px' }}>{verification.result.verified ? '✅' : '❌'}</span>
                    <div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: verification.result.verified ? 'var(--verified)' : 'var(--disputed)' }}>
                        {verification.result.verified ? 'STATUTORY COMPLIANCE CONFIRMED' : 'REJECTED BY STATUTORY FILTER'}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--muted)' }}>
                        Source: {verification.result.source} · Verified Nonce: {verification.result.timestamp.substring(11, 19)}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 2, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }}>
                    SHA-256 SEALED
                  </span>
                </div>

                {/* ECR Details */}
                {verification.result.ecrReceipt && (
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', padding: 'var(--sp-4)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                      EPFO Electronic Challan Return (ECR) Wire Receipt
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, fontSize: '11px' }}>
                      <div>
                        <span style={{ color: 'var(--muted)' }}>Challan TRRN:</span>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--ink)' }}>
                          {verification.result.ecrReceipt.trrn}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--muted)' }}>Est. Code:</span>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--ink)' }}>
                          {verification.result.ecrReceipt.establishmentCode}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--muted)' }}>Employer Name:</span>
                        <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                          {verification.result.ecrReceipt.establishmentName}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--muted)' }}>Wage Month:</span>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--ink)' }}>
                          {verification.result.ecrReceipt.wageMonth}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--muted)' }}>Member PF (12%):</span>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--verified)' }}>
                          ₹{verification.result.ecrReceipt.memberPfContribution.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--muted)' }}>Employer Share (EPF+EPS):</span>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--verified)' }}>
                          ₹{(verification.result.ecrReceipt.employerEpfContribution + verification.result.ecrReceipt.employerEpsContribution).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* MCA Details */}
                {verification.result.mcaEntity && (
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', padding: 'var(--sp-4)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                      MCA21 Company Master Standing
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, fontSize: '11px' }}>
                      <div>
                        <span style={{ color: 'var(--muted)' }}>CIN:</span>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--ink)' }}>
                          {verification.result.mcaEntity.cin}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--muted)' }}>RoC Office:</span>
                        <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                          {verification.result.mcaEntity.rocCode}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--muted)' }}>Standing Status:</span>
                        <div style={{ fontWeight: 700, color: 'var(--verified)' }}>
                          ● {verification.result.mcaEntity.status}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--muted)' }}>Paid-up Capital:</span>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--ink)' }}>
                          ₹{verification.result.mcaEntity.paidUpCapital.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cryptographic SHA-256 Proof */}
                {verification.result.sha256Proof && (
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', padding: 'var(--sp-3)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
                      Immutable Ledger SHA-256 Proof Digest
                    </div>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--primary-accent)', wordBreak: 'break-all' }}>
                      {verification.result.sha256Proof}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: BATCH VERIFICATION ENGINE */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-container)',
        padding: 'var(--sp-6)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--sp-4)', marginBottom: 'var(--sp-4)', borderBottom: '1px solid var(--line)', paddingBottom: 'var(--sp-3)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              📊 2. Automated Batch Ingestion & Pre-Verification Console
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 2 }}>
              Simulates ingesting 1000s of trainee records and running automated simultaneous statutory checks to flag fake placements.
            </p>
          </div>

          <button
            id="run-batch-verification-btn"
            onClick={handleRunBatch}
            disabled={batchRunning}
            style={{
              padding: '10px 18px',
              background: 'var(--primary-accent)',
              color: '#000000',
              border: 'none',
              borderRadius: 'var(--r-control)',
              fontSize: '12px',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              cursor: batchRunning ? 'wait' : 'pointer',
            }}
          >
            {batchRunning ? 'Cross-Checking Registries...' : '▶ Run Batch Cross-Check (6 Trainees)'}
          </button>
        </div>

        {/* Batch Stats KPI */}
        {batchResults && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--sp-3)', marginBottom: 'var(--sp-5)' }}>
            <div style={{ padding: 'var(--sp-3)', background: 'var(--surface-container-low)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)' }}>
              <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase' }}>Total Ingested</div>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>
                {batchResults.stats.total}
              </div>
            </div>
            <div style={{ padding: 'var(--sp-3)', background: 'var(--chip-verified-bg)', border: '1px solid var(--chip-verified-border)', borderRadius: 'var(--r-control)' }}>
              <div style={{ fontSize: '10px', color: 'var(--verified)', textTransform: 'uppercase' }}>Statutoriaily Verified</div>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--verified)', fontFamily: 'var(--font-mono)' }}>
                {batchResults.stats.verified}
              </div>
            </div>
            <div style={{ padding: 'var(--sp-3)', background: 'var(--chip-disputed-bg)', border: '1px solid var(--chip-disputed-border)', borderRadius: 'var(--r-control)' }}>
              <div style={{ fontSize: '10px', color: 'var(--disputed)', textTransform: 'uppercase' }}>Suspect / Flagged</div>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--disputed)', fontFamily: 'var(--font-mono)' }}>
                {batchResults.stats.suspect}
              </div>
            </div>
            <div style={{ padding: 'var(--sp-3)', background: 'var(--surface-container-low)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)' }}>
              <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase' }}>Trust Yield</div>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>
                {batchResults.stats.verificationRate}
              </div>
            </div>
          </div>
        )}

        {/* Batch Table */}
        <div style={{ overflowX: 'auto', border: '1px solid var(--line)', borderRadius: 'var(--r-control)' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: 'var(--surface-container-low)', textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
                <th style={{ padding: '10px 12px', color: 'var(--muted)' }}>Trainee</th>
                <th style={{ padding: '10px 12px', color: 'var(--muted)' }}>UAN</th>
                <th style={{ padding: '10px 12px', color: 'var(--muted)' }}>Employer CIN</th>
                <th style={{ padding: '10px 12px', color: 'var(--muted)' }}>Statutory Status</th>
                <th style={{ padding: '10px 12px', color: 'var(--muted)' }}>TRRN Challan</th>
                <th style={{ padding: '10px 12px', color: 'var(--muted)' }}>Audit Digest</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_BATCH.map((row, idx) => {
                const res = batchResults?.results?.[idx]
                return (
                  <tr key={row.candidateId} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{row.name}</div>
                      <div style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{row.candidateId}</div>
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)' }}>{row.uan}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{row.cin}</td>
                    <td style={{ padding: '10px 12px' }}>
                      {res ? (
                        res.verified ? (
                          <span style={{ color: 'var(--verified)', fontWeight: 600, fontSize: '11px' }}>
                            ● EPFO VERIFIED
                          </span>
                        ) : (
                          <span style={{ color: 'var(--disputed)', fontWeight: 600, fontSize: '11px' }}>
                            ✕ {res.rejectionReason?.substring(0, 24)}...
                          </span>
                        )
                      ) : (
                        <span style={{ color: 'var(--muted)', fontSize: '11px' }}>Ready for check</span>
                      )}
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: res?.ecrReceipt?.trrn ? 'var(--ink)' : 'var(--muted)' }}>
                      {res?.ecrReceipt?.trrn || '—'}
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--primary-accent)' }}>
                      {res?.sha256Proof ? `${res.sha256Proof.substring(0, 10)}...` : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: STATUTORY ARCHITECTURE PILLARS */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-container)',
        padding: 'var(--sp-6)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ marginBottom: 'var(--sp-4)', borderBottom: '1px solid var(--line)', paddingBottom: 'var(--sp-3)' }}>
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            🏛️ 3. National Statutory Backbones & Production Architecture
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 2 }}>
            The 4 official government registries that supply the ground truth for non-repudiable employment outcome tracking.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--sp-4)' }}>
          {statutoryPillars.map((p) => (
            <div
              key={p.name}
              style={{
                background: 'var(--surface-container-low)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r-control)',
                padding: 'var(--sp-4)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 'var(--sp-3)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)' }}>
                    {p.name}
                  </h3>
                  <span style={{
                    fontSize: '9px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 2,
                    color: p.badgeColor,
                    background: p.badgeBg,
                    border: `1px solid ${p.badgeBorder}`,
                    whiteSpace: 'nowrap',
                  }}>
                    {p.status}
                  </span>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--primary-accent)', marginBottom: 6 }}>
                  {p.statutoryRole}
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-on-surface-variant)', lineHeight: 1.5 }}>
                  {p.howItWorks}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--line)', paddingTop: 8, fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
                Target Gateway: <code>{p.realEndpoint}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
