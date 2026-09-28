'use client'

import { DataTable } from '@/components/DataTable'
import { StatusChip } from '@/components/StatusChip'

export default function AgencyInboxPage() {
  const inboxItems = [
    {
      id: 'inb-01',
      date: '2026-08-13',
      type: 'VERIFICATION_CONFIRMED',
      candidate: 'Arjun Singh (EOI-S-HERO-0001)',
      employer: 'Google India Pvt. Ltd.',
      role: 'Software Engineer',
      status: 'VERIFIED',
      message: 'Employer verified employment start date as 12 Aug 2026. Outcome ledger updated.',
    },
    {
      id: 'inb-02',
      date: '2026-08-14',
      type: 'CORRECTION_REQUESTED',
      candidate: 'Pooja Sharma (EOI-S-1012-0012)',
      employer: 'Infosys Limited',
      role: 'Systems Engineer',
      status: 'PENDING',
      message: 'Employer requested correction: Start date on contract is 01 Sep 2026, not 15 Aug 2026.',
    },
    {
      id: 'inb-03',
      date: '2026-08-15',
      type: 'VERIFICATION_REJECTED',
      candidate: 'Rohit Verma (EOI-S-1018-0018)',
      employer: 'Tata Consultancy Services Ltd',
      role: 'Associate Developer',
      status: 'REJECTED',
      message: 'Employer rejected outcome: Candidate did not complete onboarding background verification.',
    },
  ]

  const columns = [
    { key: 'date', label: 'Date', sortable: true },
    { key: 'candidate', label: 'Candidate', sortable: true },
    { key: 'employer', label: 'Employer Entity', sortable: true },
    { key: 'role', label: 'Designation' },
    {
      key: 'status',
      label: 'Outcome',
      render: (r: any) => <StatusChip status={r.status} />,
    },
    { key: 'message', label: 'Employer Note / Reason' },
  ]

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-header__title">Agency Verification Inbox</h1>
            <p className="page-header__description">
              Realtime feed of employer verification decisions, correction notes, and reconciliation notices
            </p>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={inboxItems}
        idKey="id"
        searchPlaceholder="Filter inbox by candidate or employer…"
        exportFileName="agency_inbox_export.csv"
      />
    </div>
  )
}
