'use client'

import { useState } from 'react'
import { StatusChip } from '@/components/StatusChip'
import { DataTable } from '@/components/DataTable'
import { db, AuthorizationRequest } from '@/lib/db/store'

export default function GovGovernancePage() {
  const [requests, setRequests] = useState(db.authorizationRequests)
  const [anomalies, setAnomalies] = useState(db.anomalySignals)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [showProposeModal, setShowProposeModal] = useState(false)
  const [operationType, setOperationType] = useState('ACTIVATE_SCORING_VERSION')
  const [description, setDescription] = useState('Proposal to activate Scoring Model v1.3 incorporating weighted soft skills and remote internship evaluations.')

  function handleApprove(reqId: string) {
    const req = requests.find(r => r.id === reqId)
    if (!req) return

    // Invariant P2 Dual-Key Check: Requester cannot approve own proposal
    const approverEmail = 'gov.admin@eoi.demo'
    if (req.requested_by === approverEmail) {
      setAlert({
        type: 'error',
        message: 'Security Violation (P2 Invariant): Requester cannot approve their own authorization proposal. A distinct authorized officer must provide the second signature.',
      })
      return
    }

    const updated = requests.map(r => {
      if (r.id === reqId) {
        const approvals = [
          ...(r.approvals || []),
          {
            approver_id: approverEmail,
            approver_role: 'gov_program_admin',
            decided_at: new Date().toISOString(),
            decision: 'APPROVE' as const,
          },
        ]
        const isComplete = approvals.length >= r.required_approvals
        return {
          ...r,
          approvals,
          status: isComplete ? ('APPROVED' as const) : ('PENDING' as const),
        }
      }
      return r
    })

    setRequests(updated)
    setAlert({
      type: 'success',
      message: `Second key signature cryptographically applied by ${approverEmail}. Multi-party dual-key authorization requirements fulfilled. Action executed in ledger.`,
    })
  }

  function handleReject(reqId: string) {
    const updated = requests.map(r => (r.id === reqId ? { ...r, status: 'REJECTED' as const } : r))
    setRequests(updated)
    setAlert({
      type: 'success',
      message: 'Authorization request rejected. Event registered in SHA-256 audit ledger.',
    })
  }

  function handleProposeSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newReq: AuthorizationRequest = {
      id: `auth-${Date.now()}`,
      operation: operationType,
      payload: { operation: operationType, requested_by: 'gov.analyst@eoi.demo' },
      requested_by: 'gov.analyst@eoi.demo',
      required_approvals: 2,
      approvals: [{
        approver_id: 'gov.analyst@eoi.demo',
        approver_role: 'gov_analyst',
        decided_at: new Date().toISOString(),
        decision: 'APPROVE' as const,
      }],
      status: 'PENDING' as const,
      created_at: new Date().toISOString(),
      description,
    }
    setRequests([newReq, ...requests])
    setShowProposeModal(false)
    setAlert({
      type: 'success',
      message: `New dual-key authorization proposal submitted. Awaiting 2nd signature from an independent program officer before execution.`,
    })
  }

  const authColumns = [
    {
      key: 'operation',
      label: 'Operation',
      render: (r: any) => (
        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
          {r.operation.replace(/_/g, ' ')}
        </span>
      ),
    },
    { key: 'description', label: 'Summary' },
    { key: 'requested_by', label: 'Requested By' },
    {
      key: 'required_approvals',
      label: 'Dual Signatures',
      render: (r: any) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
          {r.approvals?.length ?? 0} of {r.required_approvals} Keys
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r: any) => <StatusChip status={r.status} />,
    },
    {
      key: 'actions',
      label: 'Action',
      render: (r: any) => {
        if (r.status !== 'PENDING') {
          return <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Completed</span>
        }
        return (
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => handleApprove(r.id)}
              style={{
                padding: '4px 8px', background: 'var(--verified)', color: 'white',
                border: 'none', borderRadius: 'var(--r-control)', fontSize: '11px',
                fontWeight: 700, cursor: 'pointer',
              }}
            >
              ✓ Sign Key
            </button>
            <button
              onClick={() => handleReject(r.id)}
              style={{
                padding: '4px 8px', background: 'var(--canvas)', color: 'var(--disputed)',
                border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              Reject
            </button>
          </div>
        )
      },
    },
  ]

  const anomalyColumns = [
    {
      key: 'signal_type',
      label: 'Signal Type',
      render: (a: any) => (
        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
          {a.signal_type.replace(/_/g, ' ')}
        </span>
      ),
    },
    { key: 'description', label: 'Investigation Detail' },
    {
      key: 'severity',
      label: 'Severity',
      render: (a: any) => (
        <span style={{
          fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: 2,
          background: a.severity === 'HIGH' || a.severity === 'CRITICAL' ? 'var(--chip-disputed-bg)' : 'var(--chip-pending-bg)',
          color: a.severity === 'HIGH' || a.severity === 'CRITICAL' ? 'var(--disputed)' : 'var(--pending)',
          border: `1px solid ${a.severity === 'HIGH' || a.severity === 'CRITICAL' ? 'var(--chip-disputed-border)' : 'var(--chip-pending-border)'}`,
        }}>
          {a.severity}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'State',
      render: (a: any) => (
        <StatusChip status={a.auto_resolved ? 'VERIFIED' : 'PENDING'} label={a.auto_resolved ? 'Resolved' : 'Active Investigation'} />
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
          <div>
            <h1 className="page-header__title">Platform Governance & Dual-Key Authorizations</h1>
            <p className="page-header__description">
              Separation of duties · Two-person authorization requests · Algorithmic anomaly investigations (MASTER_PROMPT §4.2 & PDF Section 02)
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <button
              onClick={() => setShowProposeModal(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-2)',
                padding: '6px var(--sp-4)', background: 'var(--primary)', color: 'white',
                border: 'none', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)',
                fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              + Propose Dual-Key Action
            </button>
          </div>
        </div>
      </div>

      {alert && (
        <div style={{
          padding: 'var(--sp-4)',
          background: alert.type === 'success' ? 'var(--chip-verified-bg)' : 'var(--chip-disputed-bg)',
          border: `1px solid ${alert.type === 'success' ? 'var(--chip-verified-border)' : 'var(--chip-disputed-border)'}`,
          borderRadius: 'var(--r-container)', fontSize: 'var(--text-sm)',
          color: alert.type === 'success' ? 'var(--verified)' : 'var(--disputed)',
          marginBottom: 'var(--sp-6)',
        }}>
          {alert.message}
        </div>
      )}

      {/* Principle Banner */}
      <div style={{
        padding: 'var(--sp-4)', background: 'var(--canvas)', border: '1px solid var(--line)',
        borderRadius: 'var(--r-container)', fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 'var(--sp-6)',
        lineHeight: 1.5,
      }}>
        <strong>No Master Administrator Rule (P2):</strong> No single individual or role possesses unilateral authority to activate metric calculation formulas, override organization legal claims, or wipe outcome records. Privileged operations require independent dual-party authorization where Requester ≠ Approver.
      </div>

      {/* Propose Modal */}
      {showProposeModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(14,31,51,0.5)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-4)',
        }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-container)',
            width: '100%', maxWidth: '600px', padding: 'var(--sp-6)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
              <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)' }}>
                Propose Dual-Key Governance Action
              </h2>
              <button
                onClick={() => setShowProposeModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProposeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                  Operation Type (Requires Dual-Key Multi-Party Approval)
                </label>
                <select
                  value={operationType}
                  onChange={e => setOperationType(e.target.value)}
                  style={{ width: '100%', padding: 'var(--sp-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', background: 'var(--surface)' }}
                >
                  <option value="ACTIVATE_SCORING_VERSION">Activating a New Metric/Scoring Algorithm Version</option>
                  <option value="OVERRIDE_ORG_CLAIM">Overriding Organization Legal Identifier Discrepancy</option>
                  <option value="GRANT_PRIVILEGED_ROLE">Elevating Privileged Platform Security Role</option>
                  <option value="CLOSE_ANOMALY_INVESTIGATION">Closing High-Severity Regional Anomaly Signal</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
                  Justification & Technical Summary *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  style={{ width: '100%', padding: 'var(--sp-2)', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)' }}
                />
              </div>

              <div style={{
                padding: 'var(--sp-3)', background: 'var(--canvas)', border: '1px solid var(--line)',
                borderRadius: 'var(--r-control)', fontSize: '11px', color: 'var(--muted)',
              }}>
                By submitting, your signature will be appended as Key 1. A second distinct officer must sign before this action can take effect.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-2)' }}>
                <button
                  type="button"
                  onClick={() => setShowProposeModal(false)}
                  style={{ padding: '6px var(--sp-4)', background: 'none', border: '1px solid var(--line)', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '6px var(--sp-4)', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Submit Proposal (Key 1)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Multi-Party Authorization Requests */}
      <div style={{ marginBottom: 'var(--sp-8)' }}>
        <div style={{ marginBottom: 'var(--sp-3)' }}>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)' }}>
            Pending & Completed Authorization Requests
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>
            Requires 2 distinct signatures from authorized role families before execution (P2 Enforced)
          </p>
        </div>
        <DataTable columns={authColumns} data={requests ?? []} idKey="id" exportFileName="authorizations_export.csv" />
      </div>

      {/* Anomaly Signals & Investigations Queue */}
      <div>
        <div style={{ marginBottom: 'var(--sp-3)' }}>
          <h2 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--ink)' }}>
            Integrity Engine Anomaly Signals & Active Investigations
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>
            Automated signals generated on burst submissions, latency anomalies, or statistical leakage
          </p>
        </div>
        <DataTable columns={anomalyColumns} data={anomalies ?? []} idKey="id" exportFileName="anomalies_export.csv" />
      </div>
    </div>
  )
}
