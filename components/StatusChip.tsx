/**
 * StatusChip — displays verification/employment status.
 *
 * CRITICAL DESIGN RULE (MASTER_PROMPT §14):
 * Status is ALWAYS communicated with icon + text + colour.
 * Never colour alone. Contrast ≥ WCAG AA.
 *
 * Maps to: EmploymentStatus | VerificationStatus | custom string
 */

type StatusChipVariant =
  | 'REPORTED'
  | 'PENDING_VERIFICATION'
  | 'VERIFIED_EMPLOYED'
  | 'REJECTED'
  | 'UNEMPLOYMENT_REPORTED'
  | 'RECONCILIATION_PENDING'
  | 'VERIFIED_UNEMPLOYED'
  | 'RECONCILED_BY_TIMEOUT'
  | 'NEW_EMPLOYMENT_REPORTED'
  | 'CORRECTION_REQUESTED'
  | 'DISPUTED'
  | 'VERIFIED'
  | 'PENDING'
  | 'UNVERIFIED'
  | 'SELF_REPORTED'
  | 'SIMULATION'
  | 'AWAITING_ORG_CLAIM'

type StatusConfig = {
  label: string
  className: string
  icon: React.ReactNode
}

const STATUS_CONFIG: Record<StatusChipVariant, StatusConfig> = {
  REPORTED: {
    label: 'Reported',
    className: 'status-chip status-chip--info',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M5 3v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="5" cy="7" r="0.5" fill="currentColor"/>
      </svg>
    ),
  },
  PENDING_VERIFICATION: {
    label: 'Pending verification',
    className: 'status-chip status-chip--pending',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M5 3v2l1.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  VERIFIED_EMPLOYED: {
    label: 'Verified employed',
    className: 'status-chip status-chip--verified',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M3 5l1.5 1.5 2.5-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  REJECTED: {
    label: 'Rejected',
    className: 'status-chip status-chip--rejected',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M3.5 3.5l3 3M6.5 3.5l-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  UNEMPLOYMENT_REPORTED: {
    label: 'Unemployment reported',
    className: 'status-chip status-chip--pending',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M5 3.5v2.5M5 7v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  RECONCILIATION_PENDING: {
    label: 'Reconciliation pending',
    className: 'status-chip status-chip--pending',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M5 3v2l1.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  VERIFIED_UNEMPLOYED: {
    label: 'Verified unemployed',
    className: 'status-chip status-chip--info',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M3 5l1.5 1.5 2.5-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  RECONCILED_BY_TIMEOUT: {
    label: 'Reconciled (timeout)',
    className: 'status-chip status-chip--info',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.3" strokeDasharray="2 1"/>
        <path d="M5 3v2l1 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  NEW_EMPLOYMENT_REPORTED: {
    label: 'New employment reported',
    className: 'status-chip status-chip--info',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M5 3v4M3 5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  CORRECTION_REQUESTED: {
    label: 'Correction requested',
    className: 'status-chip status-chip--pending',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path d="M2 8l1-3L7 2l1 1L4 7l-2 1z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
      </svg>
    ),
  },
  DISPUTED: {
    label: 'Disputed',
    className: 'status-chip status-chip--disputed',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path d="M5 1L1 9h8L5 1z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
        <path d="M5 4.5v2M5 7.5v.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      </svg>
    ),
  },
  VERIFIED: {
    label: 'Verified',
    className: 'status-chip status-chip--verified',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M3 5l1.5 1.5 2.5-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  PENDING: {
    label: 'Pending',
    className: 'status-chip status-chip--pending',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M5 3v2l1.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  UNVERIFIED: {
    label: 'Unverified',
    className: 'status-chip status-chip--info',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.3" strokeDasharray="2 1"/>
      </svg>
    ),
  },
  SELF_REPORTED: {
    label: 'Self-reported',
    className: 'status-chip status-chip--info',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <circle cx="5" cy="3" r="2" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M2 9c0-1.66 1.34-3 3-3s3 1.34 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  SIMULATION: {
    label: 'Simulation',
    className: 'status-chip status-chip--simulation',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path d="M1 7l2-3.5 2 2 2-4 2 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  AWAITING_ORG_CLAIM: {
    label: 'Awaiting org claim',
    className: 'status-chip status-chip--pending',
    icon: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M5 3v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="5" cy="7" r="0.5" fill="currentColor"/>
      </svg>
    ),
  },
}

type StatusChipProps = {
  status: StatusChipVariant
  /** Override the default label */
  label?: string
  /** Additional CSS class */
  className?: string
}

/**
 * StatusChip renders an employment/verification status with icon + text + colour.
 * Never colour alone. WCAG AA compliant.
 */
export function StatusChip({ status, label, className = '' }: StatusChipProps) {
  const config = STATUS_CONFIG[status]
  if (!config) {
    return (
      <span className={`status-chip status-chip--info ${className}`}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.3"/>
        </svg>
        {label ?? status}
      </span>
    )
  }

  return (
    <span className={`${config.className} ${className}`} aria-label={`Status: ${label ?? config.label}`}>
      {config.icon}
      {label ?? config.label}
    </span>
  )
}

export type { StatusChipVariant }
