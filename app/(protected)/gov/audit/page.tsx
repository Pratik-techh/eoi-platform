'use client'

import { useState, useEffect } from 'react'
import { DataTable } from '@/components/DataTable'
import { StatusChip } from '@/components/StatusChip'
import type { AuditEvent } from '@/lib/db/store'

export default function GovAuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([])
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean
    totalEvents: number
    headHash: string
    brokenLink?: number
  } | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    async function fetchAudit() {
      const res = await fetch('/api/audit')
      if (res.ok) {
        const json = await res.json()
        setEvents(json.events ?? [])
        setVerificationResult(json.verification ?? null)
      }
    }
    fetchAudit()
  }, [])

  async function handleVerifyChain() {
    setIsVerifying(true)
    try {
      const res = await fetch('/api/audit/verify', { method: 'POST' })
      const json = await res.json()
      setVerificationResult(json)
    } finally {
      setIsVerifying(false)
    }
  }

  const columns = [
    {
      key: 'seq',
      label: 'Seq #',
      sortable: true,
      render: (e: AuditEvent) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
          #{e.seq}
        </span>
      ),
    },
    {
      key: 'event_type',
      label: 'Event Type',
      sortable: true,
      render: (e: AuditEvent) => (
        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
          {e.event_type}
        </span>
      ),
    },
    { key: 'source', label: 'Source' },
    { key: 'actor_role', label: 'Actor Role' },
    {
      key: 'transition',
      label: 'State Transition',
      render: (e: AuditEvent) => (
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>
          {e.previous_state ?? 'NULL'} → {e.new_state ?? 'NULL'}
        </span>
      ),
    },
    {
      key: 'hash',
      label: 'SHA-256 Hash',
      render: (e: AuditEvent) => (
        <span
          title={e.hash}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '10px',
            background: 'var(--canvas)', padding: '2px 6px', borderRadius: 2,
          }}
        >
          {e.hash.substring(0, 12)}…{e.hash.substring(e.hash.length - 6)}
        </span>
      ),
    },
    {
      key: 'occurred_at',
      label: 'Timestamp',
      sortable: true,
      render: (e: AuditEvent) => (
        <span style={{ fontSize: '11px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          {new Date(e.occurred_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      ),
    },
  ]

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Audit Explorer & Ledger Integrity</h1>
            <p className="page-header__description">
              Cryptographically verified, append-only event ledger with SHA-256 hash chaining (MASTER_PROMPT §5.4)
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
            <button
              onClick={handleVerifyChain}
              disabled={isVerifying}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-2)',
                padding: '6px var(--sp-4)', background: 'var(--primary)', color: 'white',
                border: 'none', borderRadius: 'var(--r-control)', fontSize: 'var(--text-sm)',
                fontWeight: 600, cursor: isVerifying ? 'wait' : 'pointer', fontFamily: 'var(--font-ui)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {isVerifying ? 'Verifying Hashes…' : 'Verify Ledger Hash Chain'}
            </button>
          </div>
        </div>
      </div>

      {/* Verification Status Card */}
      {verificationResult && (
        <div style={{
          background: verificationResult.valid ? 'var(--chip-verified-bg)' : 'var(--chip-disputed-bg)',
          border: `1px solid ${verificationResult.valid ? 'var(--chip-verified-border)' : 'var(--chip-disputed-border)'}`,
          borderRadius: 'var(--r-container)',
          padding: 'var(--sp-4) var(--sp-5)',
          marginBottom: 'var(--sp-6)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-3)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
              <StatusChip status={verificationResult.valid ? 'VERIFIED' : 'DISPUTED'} />
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: verificationResult.valid ? 'var(--verified)' : 'var(--disputed)' }}>
                {verificationResult.valid
                  ? `Cryptographic Chain Verified: 100% Intact across ${verificationResult.totalEvents} sequential events`
                  : `Chain Tampering Detected at Sequence #${verificationResult.brokenLink}`}
              </span>
            </div>
            <div style={{
              fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--ink)', marginTop: 4,
              wordBreak: 'break-all',
            }}>
              Current Ledger Head Hash: <code>{verificationResult.headHash}</code>
            </div>
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>
            Algorithm: SHA-256 recursive chaining
          </div>
        </div>
      )}

      {/* Audit DataTable */}
      <DataTable
        columns={columns}
        data={events}
        idKey="event_id"
        searchPlaceholder="Search audit events by type, actor, or source…"
        exportFileName="eoi_audit_ledger_export.csv"
      />
    </div>
  )
}
