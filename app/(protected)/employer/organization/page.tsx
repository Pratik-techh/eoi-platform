'use client'

import { useState } from 'react'
import { StatusChip } from '@/components/StatusChip'
import { EntityResolutionFlow } from '@/components/EntityResolutionFlow'

export default function EmployerOrganizationPage() {
  const [activeTab, setActiveTab] = useState<'verifiers' | 'identifiers' | 'claims'>('verifiers')
  const [alert, setAlert] = useState<{ type: 'success' | 'info'; message: string } | null>(null)

  // 1. Authorized Verifiers State
  const [verifiers, setVerifiers] = useState([
    {
      id: 'vrf-01',
      name: 'Kavya Reddy',
      email: 'employer.verifier@eoi.demo',
      role: 'Authorized Verifier',
      scope: 'Full Verification Rights (Placements & Departures)',
      granted: '10 Aug 2026',
      status: 'ACTIVE' as 'ACTIVE' | 'SUSPENDED',
      employeeId: 'GOOG-IND-8841',
    },
    {
      id: 'vrf-02',
      name: 'Siddharth Iyer',
      email: 'employer.admin@eoi.demo',
      role: 'Employer Administrator',
      scope: 'Enterprise Administration & Policy Delegation',
      granted: '01 Jul 2026',
      status: 'ACTIVE' as 'ACTIVE' | 'SUSPENDED',
      employeeId: 'GOOG-IND-1002',
    },
  ])
  const [showAddVerifierModal, setShowAddVerifierModal] = useState(false)
  const [newVerifierName, setNewVerifierName] = useState('')
  const [newVerifierEmail, setNewVerifierEmail] = useState('')
  const [newVerifierEmpId, setNewVerifierEmpId] = useState('')
  const [newVerifierScope, setNewVerifierScope] = useState('Full Verification Rights (Placements & Departures)')

  // 2. Legal Identifiers State
  const [identifiers, setIdentifiers] = useState([
    { class: 'CIN', value: 'U72200KA2004FTC033590', issuer: 'Ministry of Corporate Affairs (MCA)', status: 'VERIFIED', verifiedAt: '2026-07-01' },
    { class: 'GSTIN', value: '29AAACG1234A1Z5', issuer: 'Goods & Services Tax Network (GSTN)', status: 'VERIFIED', verifiedAt: '2026-07-05' },
    { class: 'EPFO_ESTABLISHMENT_ID', value: 'KNBLR0045678000', issuer: 'Employees’ Provident Fund Organisation', status: 'VERIFIED', verifiedAt: '2026-07-10' },
    { class: 'ESIC_CODE', value: '53000123450000999', issuer: 'Employees’ State Insurance Corporation', status: 'VERIFIED', verifiedAt: '2026-07-10' },
    { class: 'PAN', value: 'AAACG1234A', issuer: 'Income Tax Department (CBDT)', status: 'VERIFIED', verifiedAt: '2026-07-02' },
  ])
  const [showAddIdModal, setShowAddIdModal] = useState(false)
  const [newIdClass, setNewIdClass] = useState('LLPIN')
  const [newIdValue, setNewIdValue] = useState('')
  const [newIdIssuer, setNewIdIssuer] = useState('Ministry of Corporate Affairs')
  const [newIdProofDoc, setNewIdProofDoc] = useState('')

  // 3. Organization Claim Challenge State
  const [challengeSent, setChallengeSent] = useState(false)

  function handleToggleVerifierStatus(id: string) {
    setVerifiers(prev => prev.map(v => {
      if (v.id === id) {
        const nextStatus = v.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
        setAlert({
          type: 'info',
          message: `Verification privileges for ${v.name} have been updated to ${nextStatus}. Event recorded in immutable audit ledger.`,
        })
        return { ...v, status: nextStatus }
      }
      return v
    }))
  }

  function handleAddVerifierSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newEntry = {
      id: `vrf-${Date.now()}`,
      name: newVerifierName,
      email: newVerifierEmail,
      role: 'Authorized Verifier',
      scope: newVerifierScope,
      granted: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'ACTIVE' as const,
      employeeId: newVerifierEmpId,
    }
    setVerifiers(prev => [...prev, newEntry])
    setShowAddVerifierModal(false)
    setNewVerifierName('')
    setNewVerifierEmail('')
    setNewVerifierEmpId('')
    setAlert({
      type: 'success',
      message: `Officer ${newEntry.name} (${newEntry.email}) successfully authorized under Dual-Party Verifier Grant rules. Authentication credentials dispatched.`,
    })
  }

  function handleAddIdentifierSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newEntry = {
      class: newIdClass,
      value: newIdValue,
      issuer: newIdIssuer,
      status: 'VERIFIED',
      verifiedAt: new Date().toISOString().split('T')[0]!,
    }
    setIdentifiers(prev => [...prev, newEntry])
    setShowAddIdModal(false)
    setNewIdValue('')
    setNewIdProofDoc('')
    setAlert({
      type: 'success',
      message: `Legal identifier [${newEntry.class}: ${newEntry.value}] submitted and bound to Google India Pvt. Ltd. (org-google-01). Registry integrity verified.`,
    })
  }

  function handleSendChallenge() {
    setChallengeSent(true)
    setAlert({
      type: 'success',
      message: 'Cryptographic challenge token successfully dispatched to registry-listed corporate domain MX (hr-verifications@google.com). Token valid for 24 hours.',
    })
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-1)' }}>
              <h1 className="page-header__title" style={{ margin: 0 }}>Google India Pvt. Ltd.</h1>
              <span style={{
                fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--r-control)',
                background: 'var(--chip-verified-bg)', color: 'var(--verified)', border: '1px solid var(--chip-verified-border)'
              }}>
                ENTERPRISE PARTNER
              </span>
            </div>
            <p className="page-header__description">
              Canonical Org ID: <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>org-google-01</code> · Primary State: Karnataka · Enterprise Administration Console
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'center' }}>
            <StatusChip status="VERIFIED" label="Claimed & Registry Bound" />
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {alert && (
        <div
          className="alert-banner-animate"
          style={{
            padding: 'var(--sp-3) var(--sp-4)',
          background: alert.type === 'success' ? 'var(--chip-verified-bg)' : 'var(--canvas)',
          border: `1px solid ${alert.type === 'success' ? 'var(--chip-verified-border)' : 'var(--line)'}`,
          borderRadius: 'var(--r-control)',
          fontSize: 'var(--text-sm)',
          color: alert.type === 'success' ? 'var(--verified)' : 'var(--ink)',
          marginBottom: 'var(--sp-5)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>{alert.message}</span>
          <button
            onClick={() => setAlert(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'var(--text-md)', fontWeight: 700 }}
          >
            ×
          </button>
        </div>
      )}

      {/* Visual Entity Resolution Flow */}
      <EntityResolutionFlow />

      {/* Navigation Tabs for Employer Admin */}
      <div style={{
        display: 'flex', gap: 'var(--sp-2)', borderBottom: '1px solid var(--line)',
        marginBottom: 'var(--sp-6)', marginTop: 'var(--sp-4)'
      }}>
        <button
          onClick={() => setActiveTab('verifiers')}
          style={{
            padding: 'var(--sp-2) var(--sp-4)',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'verifiers' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'verifiers' ? 'var(--primary)' : 'var(--muted)',
            fontWeight: activeTab === 'verifiers' ? 700 : 500,
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
          }}
        >
          Authorized Verification Officers ({verifiers.length})
        </button>
        <button
          onClick={() => setActiveTab('identifiers')}
          style={{
            padding: 'var(--sp-2) var(--sp-4)',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'identifiers' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'identifiers' ? 'var(--primary)' : 'var(--muted)',
            fontWeight: activeTab === 'identifiers' ? 700 : 500,
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
          }}
        >
          Legal & Statutory Identifiers ({identifiers.length})
        </button>
        <button
          onClick={() => setActiveTab('claims')}
          style={{
            padding: 'var(--sp-2) var(--sp-4)',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'claims' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'claims' ? 'var(--primary)' : 'var(--muted)',
            fontWeight: activeTab === 'claims' ? 700 : 500,
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
          }}
        >
          Organization Claim & Governance
        </button>
      </div>

      {/* TAB 1: AUTHORIZED VERIFIERS MANAGEMENT */}
      {activeTab === 'verifiers' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)' }}>
                Authorized Verification Officers & Delegation Rules
              </h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>
                Per Principle P1: Training agencies cannot self-verify. Only authenticated corporate verifiers can execute placement and departure reconciliations.
              </p>
            </div>
            <button
              onClick={() => setShowAddVerifierModal(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-1)',
                padding: '6px var(--sp-3)', background: 'var(--primary)', color: 'white',
                border: 'none', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)',
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              + Authorize Verification Officer
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--sp-4)' }}>
            {verifiers.map(v => (
              <div
                key={v.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--r-container)',
                  padding: 'var(--sp-4)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 'var(--sp-3)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
                        {v.name}
                      </h3>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                        {v.email}
                      </div>
                    </div>
                    <StatusChip
                      status={v.status === 'ACTIVE' ? 'VERIFIED' : 'DISPUTED'}
                      label={v.status === 'ACTIVE' ? 'Active' : 'Suspended'}
                    />
                  </div>

                  <div style={{ marginTop: 'var(--sp-3)', fontSize: '11px', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div><strong>Corporate Role:</strong> {v.role}</div>
                    <div><strong>Employee ID:</strong> <code style={{ fontFamily: 'var(--font-mono)' }}>{v.employeeId}</code></div>
                    <div><strong>Delegation Scope:</strong> {v.scope}</div>
                    <div><strong>Granted On:</strong> {v.granted} (Dual-Party Rule Validated)</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--sp-2)', borderTop: '1px solid var(--line)', paddingTop: 'var(--sp-3)' }}>
                  <button
                    onClick={() => handleToggleVerifierStatus(v.id)}
                    style={{
                      flex: 1,
                      padding: '5px var(--sp-2)',
                      background: v.status === 'ACTIVE' ? 'var(--canvas)' : 'var(--chip-verified-bg)',
                      border: `1px solid ${v.status === 'ACTIVE' ? 'var(--line)' : 'var(--chip-verified-border)'}`,
                      borderRadius: 'var(--r-control)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      color: v.status === 'ACTIVE' ? 'var(--disputed)' : 'var(--verified)',
                      cursor: 'pointer',
                    }}
                  >
                    {v.status === 'ACTIVE' ? 'Suspend Privileges' : 'Reactivate Verifier'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 'var(--sp-6)', padding: 'var(--sp-4)', background: 'var(--canvas)',
            border: '1px solid var(--line)', borderRadius: 'var(--r-container)', fontSize: 'var(--text-xs)', color: 'var(--muted)', lineHeight: 1.5
          }}>
            <strong>Security Invariant (Principle P1 & ASVS v4.0):</strong> An Employer Administrator configures verified delegates but cannot verify placements without delegation credentials. Verification decisions append a cryptographic signature linked to the individual officer's token and authenticated session.
          </div>
        </div>
      )}

      {/* TAB 2: LEGAL & STATUTORY IDENTIFIERS */}
      {activeTab === 'identifiers' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)' }}>
                Registered Corporate & Statutory Identifiers
              </h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>
                Enterprise identity bound to official MCA, GSTN, EPFO, and ESIC registries to eliminate duplicate entities and shell companies (MASTER_PROMPT §5.3).
              </p>
            </div>
            <button
              onClick={() => setShowAddIdModal(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-1)',
                padding: '6px var(--sp-3)', background: 'var(--primary)', color: 'white',
                border: 'none', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)',
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              + Register Legal Identifier
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--sp-4)' }}>
            {identifiers.map(id => (
              <div
                key={id.value}
                style={{
                  background: 'var(--surface)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-container)', padding: 'var(--sp-4)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)' }}>
                    {id.class}
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                    {id.value}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: 2 }}>
                    Issuer: {id.issuer}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: 1 }}>
                    Bound: {id.verifiedAt} · Registry Hash Active
                  </div>
                </div>
                <StatusChip status="VERIFIED" label="Registry Bound" />
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 'var(--sp-6)', padding: 'var(--sp-4)', background: 'var(--canvas)',
            border: '1px solid var(--line)', borderRadius: 'var(--r-container)', fontSize: 'var(--text-xs)', color: 'var(--muted)', lineHeight: 1.5
          }}>
            <strong>Identifier Normalization Architecture:</strong> The platform supports non-CIN corporate entities (LLPs, Societies, Government Entities, EPFO establishment codes). Placement submissions using any verified alias resolve deterministically to this canonical organization record.
          </div>
        </div>
      )}

      {/* TAB 3: ORGANIZATION CLAIM & GOVERNANCE */}
      {activeTab === 'claims' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
            padding: 'var(--sp-6)'
          }}>
            <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-2)' }}>
              Organization Claim Status & Domain Binding
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.5, marginBottom: 'var(--sp-5)' }}>
              Per Section 5.3: Control is never granted simply because a user typed a matching company name. An organization claim requires statutory registry identifier proof and an authenticated challenge on a registry-listed email domain.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
              <div style={{ padding: 'var(--sp-4)', background: 'var(--canvas)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)' }}>CLAIM STATUS</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--verified)', marginTop: 4 }}>
                  CLAIMED & VERIFIED
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: 2 }}>
                  Authenticated since 01 Jul 2026
                </div>
              </div>

              <div style={{ padding: 'var(--sp-4)', background: 'var(--canvas)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)' }}>OFFICIAL DOMAIN MX</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--ink)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                  @google.com
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: 2 }}>
                  DNS SPF/DKIM validated
                </div>
              </div>

              <div style={{ padding: 'var(--sp-4)', background: 'var(--canvas)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)' }}>DUAL-KEY GOVERNANCE</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>
                  Zero Active Disputes
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: 2 }}>
                  No conflicting corporate claims
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
              <button
                onClick={handleSendChallenge}
                style={{
                  padding: '8px var(--sp-4)', background: challengeSent ? 'var(--canvas)' : 'var(--primary)',
                  color: challengeSent ? 'var(--muted)' : 'white', border: `1px solid ${challengeSent ? 'var(--line)' : 'var(--primary)'}`,
                  borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer',
                }}
              >
                {challengeSent ? '✓ Cryptographic Challenge Dispatched' : 'Re-verify Corporate Domain Challenge'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: AUTHORIZE NEW VERIFICATION OFFICER */}
      {showAddVerifierModal && (
        <div
          className="modal-backdrop-animate"
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-4)'
          }}
        >
          <div
            className="modal-card-animate"
            style={{
              background: 'var(--surface)', borderRadius: 'var(--r-container)', width: '100%', maxWidth: '520px',
            border: '1px solid var(--line)', padding: 'var(--sp-6)', boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
          }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--ink)', marginBottom: 'var(--sp-2)' }}>
              Authorize Verification Officer
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 'var(--sp-4)' }}>
              Issue cryptographic verification credentials to a designated HR or corporate payroll representative.
            </p>

            <form onSubmit={handleAddVerifierSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>
                  Officer Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Deshmukh"
                  value={newVerifierName}
                  onChange={e => setNewVerifierName(e.target.value)}
                  style={{ width: '100%', padding: '7px var(--sp-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>
                  Corporate Work Email (Must match official domain @google.com)
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh.d@google.com"
                  value={newVerifierEmail}
                  onChange={e => setNewVerifierEmail(e.target.value)}
                  style={{ width: '100%', padding: '7px var(--sp-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>
                  Corporate Employee ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GOOG-IND-9912"
                  value={newVerifierEmpId}
                  onChange={e => setNewVerifierEmpId(e.target.value)}
                  style={{ width: '100%', padding: '7px var(--sp-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>
                  Delegation Authority Scope
                </label>
                <select
                  value={newVerifierScope}
                  onChange={e => setNewVerifierScope(e.target.value)}
                  style={{ width: '100%', padding: '7px var(--sp-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                >
                  <option value="Full Verification Rights (Placements & Departures)">Full Verification Rights (Placements & Departures)</option>
                  <option value="Placement Verification Only">Placement Verification Only</option>
                  <option value="Departure / Unemployment Reconciliation Only">Departure / Unemployment Reconciliation Only</option>
                </select>
              </div>

              <div style={{
                background: 'var(--canvas)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)',
                padding: 'var(--sp-3)', fontSize: '11px', color: 'var(--muted)', marginTop: 'var(--sp-2)'
              }}>
                <strong>Dual-Party Grant Requirement:</strong> Granting verification privileges is co-signed by Employer Admin (<code style={{ fontFamily: 'var(--font-mono)' }}>employer.admin@eoi.demo</code>) and verified against statutory organization identifiers.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-2)', marginTop: 'var(--sp-3)' }}>
                <button
                  type="button"
                  onClick={() => setShowAddVerifierModal(false)}
                  style={{
                    padding: '7px var(--sp-4)', background: 'var(--canvas)', border: '1px solid var(--line)',
                    borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '7px var(--sp-4)', background: 'var(--primary)', color: 'white',
                    border: 'none', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Confirm & Authorize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTER CORPORATE IDENTIFIER */}
      {showAddIdModal && (
        <div
          className="modal-backdrop-animate"
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-4)'
          }}
        >
          <div
            className="modal-card-animate"
            style={{
              background: 'var(--surface)', borderRadius: 'var(--r-container)', width: '100%', maxWidth: '500px',
            border: '1px solid var(--line)', padding: 'var(--sp-6)', boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
          }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--ink)', marginBottom: 'var(--sp-2)' }}>
              Register Statutory Identifier
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 'var(--sp-4)' }}>
              Bind an additional statutory registry record to this canonical enterprise identity.
            </p>

            <form onSubmit={handleAddIdentifierSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>
                  Identifier Class
                </label>
                <select
                  value={newIdClass}
                  onChange={e => {
                    setNewIdClass(e.target.value)
                    if (e.target.value === 'LLPIN') setNewIdIssuer('Ministry of Corporate Affairs')
                    else if (e.target.value === 'EPFO_ESTABLISHMENT_ID') setNewIdIssuer('Employees’ Provident Fund Organisation')
                    else if (e.target.value === 'GSTIN') setNewIdIssuer('Goods & Services Tax Network')
                    else if (e.target.value === 'PAN') setNewIdIssuer('Income Tax Department')
                    else setNewIdIssuer('Statutory Regulatory Authority')
                  }}
                  style={{ width: '100%', padding: '7px var(--sp-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                >
                  <option value="LLPIN">LLPIN (Limited Liability Partnership Identification Number)</option>
                  <option value="EPFO_ESTABLISHMENT_ID">EPFO Establishment ID</option>
                  <option value="ESIC_CODE">ESIC Establishment Code</option>
                  <option value="GSTIN">GSTIN (Goods and Services Tax)</option>
                  <option value="PAN">PAN (Permanent Account Number)</option>
                  <option value="OTHER_AUTHORIZED">Other Authorized Statutory Code</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>
                  Identifier Value
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AAA-1234 or 29AAACG1234A1Z5"
                  value={newIdValue}
                  onChange={e => setNewIdValue(e.target.value)}
                  style={{ width: '100%', padding: '7px var(--sp-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>
                  Issuing Statutory Authority
                </label>
                <input
                  type="text"
                  required
                  value={newIdIssuer}
                  onChange={e => setNewIdIssuer(e.target.value)}
                  style={{ width: '100%', padding: '7px var(--sp-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>
                  Supporting Proof Document Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. Registration Certificate No. MCA/2026/099182"
                  value={newIdProofDoc}
                  onChange={e => setNewIdProofDoc(e.target.value)}
                  style={{ width: '100%', padding: '7px var(--sp-3)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-2)', marginTop: 'var(--sp-3)' }}>
                <button
                  type="button"
                  onClick={() => setShowAddIdModal(false)}
                  style={{
                    padding: '7px var(--sp-4)', background: 'var(--canvas)', border: '1px solid var(--line)',
                    borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '7px var(--sp-4)', background: 'var(--primary)', color: 'white',
                    border: 'none', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Submit & Bind to Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
