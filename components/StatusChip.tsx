/**
 * StatusChip — displays verification/employment status.
 *
 * STITCH MCP PRECISION INSTRUMENT SPECIFICATION:
 * Height 22px, horizontal padding 8px, background #0F0F0F, border 1px solid #242424, rounded 2px.
 * 6px circular diode dot positioned left with micro-halo glow, uppercase JetBrains Mono label.
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
  dotColor: string
  dotHalo: string
  icon?: React.ReactNode
}

const STATUS_CONFIG: Record<StatusChipVariant, StatusConfig> = {
  REPORTED: {
    label: 'Reported',
    className: 'status-chip status-chip--info',
    dotColor: '#5B9DFF',
    dotHalo: '0 0 6px rgba(91, 157, 255, 0.45)',
  },
  PENDING_VERIFICATION: {
    label: 'Pending verification',
    className: 'status-chip status-chip--pending',
    dotColor: '#D99A32',
    dotHalo: '0 0 6px rgba(217, 154, 50, 0.45)',
  },
  VERIFIED_EMPLOYED: {
    label: 'Verified employed',
    className: 'status-chip status-chip--verified',
    dotColor: '#18B6A4',
    dotHalo: '0 0 6px rgba(24, 182, 164, 0.45)',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'status-chip status-chip--rejected',
    dotColor: '#E05252',
    dotHalo: '0 0 6px rgba(224, 82, 82, 0.45)',
  },
  UNEMPLOYMENT_REPORTED: {
    label: 'Unemployment reported',
    className: 'status-chip status-chip--pending',
    dotColor: '#D99A32',
    dotHalo: '0 0 6px rgba(217, 154, 50, 0.45)',
  },
  RECONCILIATION_PENDING: {
    label: 'Reconciliation pending',
    className: 'status-chip status-chip--pending',
    dotColor: '#D99A32',
    dotHalo: '0 0 6px rgba(217, 154, 50, 0.45)',
  },
  VERIFIED_UNEMPLOYED: {
    label: 'Verified unemployed',
    className: 'status-chip status-chip--info',
    dotColor: '#5B9DFF',
    dotHalo: '0 0 6px rgba(91, 157, 255, 0.45)',
  },
  RECONCILED_BY_TIMEOUT: {
    label: 'Reconciled (timeout)',
    className: 'status-chip status-chip--info',
    dotColor: '#5B9DFF',
    dotHalo: '0 0 6px rgba(91, 157, 255, 0.45)',
  },
  NEW_EMPLOYMENT_REPORTED: {
    label: 'New employment reported',
    className: 'status-chip status-chip--info',
    dotColor: '#5B9DFF',
    dotHalo: '0 0 6px rgba(91, 157, 255, 0.45)',
  },
  CORRECTION_REQUESTED: {
    label: 'Correction requested',
    className: 'status-chip status-chip--pending',
    dotColor: '#D99A32',
    dotHalo: '0 0 6px rgba(217, 154, 50, 0.45)',
  },
  DISPUTED: {
    label: 'Disputed',
    className: 'status-chip status-chip--disputed',
    dotColor: '#E05252',
    dotHalo: '0 0 6px rgba(224, 82, 82, 0.45)',
  },
  VERIFIED: {
    label: 'Verified',
    className: 'status-chip status-chip--verified',
    dotColor: '#18B6A4',
    dotHalo: '0 0 6px rgba(24, 182, 164, 0.45)',
  },
  PENDING: {
    label: 'Pending',
    className: 'status-chip status-chip--pending',
    dotColor: '#D99A32',
    dotHalo: '0 0 6px rgba(217, 154, 50, 0.45)',
  },
  UNVERIFIED: {
    label: 'Unverified',
    className: 'status-chip status-chip--rejected',
    dotColor: '#E05252',
    dotHalo: '0 0 6px rgba(224, 82, 82, 0.45)',
  },
  SELF_REPORTED: {
    label: 'Self reported',
    className: 'status-chip status-chip--info',
    dotColor: '#5B9DFF',
    dotHalo: '0 0 6px rgba(91, 157, 255, 0.45)',
  },
  SIMULATION: {
    label: 'Simulation',
    className: 'status-chip status-chip--simulation',
    dotColor: '#9B7AE8',
    dotHalo: '0 0 6px rgba(155, 122, 232, 0.45)',
  },
  AWAITING_ORG_CLAIM: {
    label: 'Awaiting org claim',
    className: 'status-chip status-chip--pending',
    dotColor: '#D99A32',
    dotHalo: '0 0 6px rgba(217, 154, 50, 0.45)',
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
 * StatusChip renders an employment/verification status with diode dot + uppercase mono text.
 * Strictly conforms to Stitch Precision Instrument design.
 */
export function StatusChip({ status, label, className = '' }: StatusChipProps) {
  const config = STATUS_CONFIG[status]
  if (!config) {
    return (
      <span className={`status-chip status-chip--info ${className}`}>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#5B9DFF',
            boxShadow: '0 0 6px rgba(91, 157, 255, 0.45)',
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        <span>{label ?? status}</span>
      </span>
    )
  }

  return (
    <span className={`${config.className} ${className}`} aria-label={`Status: ${label ?? config.label}`}>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: config.dotColor,
          boxShadow: config.dotHalo,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      <span>{label ?? config.label}</span>
    </span>
  )
}

export type { StatusChipVariant }
