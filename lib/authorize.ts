/**
 * Authorization Policy Engine
 *
 * Every request independently validates: identity, role, resource, operation,
 * ownership/authority, and current resource state.
 *
 * This function is the single source of server-side authorization truth —
 * used by all server actions and route handlers, mirrored by RLS policies.
 *
 * Zero Trust: there are no "trusted" callers. All checks are repeated per request.
 *
 * MASTER_PROMPT Section 4.3
 */

import type { ActorRole } from './supabase/database.types'

// ─── Types ──────────────────────────────────────────────────────────────────

export type Actor = {
  id: string
  role: ActorRole
  agencyId?: string
  orgId?: string
  studentEoiId?: string
}

export type Action =
  // Employment lifecycle
  | 'employment:report'
  | 'employment:verify'          // NEVER allowed for agency (P1)
  | 'employment:confirm'
  | 'employment:reject'
  | 'employment:request_correction'
  | 'employment:report_unemployment'
  | 'employment:reconcile_unemployment'
  | 'employment:report_new_employment'
  // Student
  | 'student:register'
  | 'student:import'
  | 'student:read_own'
  | 'student:read_agency'
  | 'student:read_aggregate'
  // Disputes
  | 'dispute:raise'
  | 'dispute:resolve'
  // Assessments
  | 'assessment:record'
  | 'assessment:read'
  // Organization
  | 'org:claim'
  | 'org:verify_claim'
  // Governance
  | 'governance:read'
  | 'governance:submit_auth_request'
  | 'governance:approve_auth_request'
  | 'governance:open_investigation'
  | 'governance:close_investigation'
  // Analytics
  | 'analytics:read_aggregate'
  | 'analytics:read_program'
  | 'analytics:export_aggregate'
  // PII
  | 'pii:read'                   // NEVER for gov/analytics/employer
  // AI
  | 'ai:query'
  | 'ai:write'                   // NEVER for ai role (P5)
  // Audit
  | 'ledger:read'
  | 'ledger:verify_chain'
  // Simulation
  | 'simulation:run'
  | 'simulation:read'

export type Resource = {
  type: string
  agencyId?: string
  orgId?: string
  ownerId?: string          // eoi_student_id for student-owned resources
  currentStatus?: string    // current state machine status
  verifiedAt?: string | null
}

export type AuthzResult =
  | { allowed: true }
  | { allowed: false; reason: string; code: 'FORBIDDEN' | 'INVALID_STATE' | 'WRONG_OWNER' | 'ROLE_DENIED' }

// ─── Policy matrix ───────────────────────────────────────────────────────────

const ROLE_POLICIES: Record<ActorRole, Set<Action>> = {
  gov_analyst: new Set([
    'analytics:read_aggregate',
    'analytics:read_program',
    'analytics:export_aggregate',
    'ai:query',
    'simulation:run',
    'simulation:read',
    'governance:read',
  ]),
  gov_program_admin: new Set([
    'analytics:read_aggregate',
    'analytics:read_program',
    'governance:read',
    'governance:submit_auth_request',
    'governance:approve_auth_request',
    'simulation:read',
  ]),
  gov_auditor: new Set([
    'analytics:read_aggregate',
    'analytics:read_program',
    'ledger:read',
    'ledger:verify_chain',
    'governance:read',
    'governance:open_investigation',
    'governance:close_investigation',
  ]),
  agency_admin: new Set([
    'student:register',
    'student:import',
    'student:read_agency',
    'assessment:record',
    'assessment:read',
    'employment:report',
    'governance:submit_auth_request',
  ]),
  agency_officer: new Set([
    'student:register',
    'student:import',
    'student:read_agency',
    'assessment:record',
    'assessment:read',
    'employment:report',
  ]),
  student: new Set([
    'student:read_own',
    'employment:report_unemployment',
    'dispute:raise',
  ]),
  employer_admin: new Set([
    'org:claim',
    'governance:submit_auth_request',
  ]),
  employer_verifier: new Set([
    'employment:confirm',
    'employment:reject',
    'employment:request_correction',
    'employment:reconcile_unemployment',
    'org:claim',
  ]),
  security_officer: new Set([
    'governance:read',
    'governance:open_investigation',
  ]),
  platform_ops: new Set([
    // Infra health only — no data plane access
  ]),
}

// Actions that are NEVER allowed regardless of role — checked separately
const ABSOLUTE_DENIALS: Partial<Record<ActorRole, Set<Action>>> = {
  // Agency can never verify its own report (Principle P1)
  agency_admin:   new Set<Action>(['employment:verify', 'employment:confirm', 'pii:read']),
  agency_officer: new Set<Action>(['employment:verify', 'employment:confirm', 'pii:read']),
  // Students cannot verify their own employment
  student:        new Set<Action>(['employment:verify', 'employment:confirm', 'ai:write', 'pii:read']),
  // Government roles cannot read PII
  gov_analyst:      new Set<Action>(['pii:read', 'ai:write']),
  gov_program_admin: new Set<Action>(['pii:read', 'ai:write']),
  gov_auditor:      new Set<Action>(['pii:read', 'ai:write']),
  // AI is read-only
  // (no ai role in primary roles — ai:write is blocked universally via DB grants)
}

// ─── Main authorize function ─────────────────────────────────────────────────

/**
 * authorize(actor, action, resource)
 *
 * @param actor  - The authenticated user with their role
 * @param action - The operation being attempted
 * @param resource - The target resource with its current state
 * @returns AuthzResult — allowed: true or false with reason
 *
 * Usage: const result = authorize(actor, 'employment:confirm', { type: 'employment_outcome', orgId: ... })
 *        if (!result.allowed) throw new ForbiddenError(result.reason)
 */
export function authorize(actor: Actor, action: Action, resource: Resource): AuthzResult {
  // 1. Absolute denials — blocked regardless of any other factor
  const absoluteDenied = ABSOLUTE_DENIALS[actor.role]
  if (absoluteDenied?.has(action)) {
    return {
      allowed: false,
      reason: `Role '${actor.role}' is absolutely prohibited from action '${action}' (trust principle enforcement).`,
      code: 'ROLE_DENIED',
    }
  }

  // 2. Role policy check
  const allowedActions = ROLE_POLICIES[actor.role]
  if (!allowedActions.has(action)) {
    return {
      allowed: false,
      reason: `Role '${actor.role}' does not have permission to perform '${action}'.`,
      code: 'ROLE_DENIED',
    }
  }

  // 3. Ownership / scoping checks
  if (action.startsWith('student:read_agency') || action === 'employment:report') {
    // Agency roles must match resource's agency
    if (resource.agencyId && actor.agencyId && resource.agencyId !== actor.agencyId) {
      return {
        allowed: false,
        reason: 'Agency personnel can only access their own agency\'s students.',
        code: 'WRONG_OWNER',
      }
    }
  }

  if (action === 'student:read_own' || action === 'employment:report_unemployment' || action === 'dispute:raise') {
    // Students can only access their own records
    if (resource.ownerId && actor.studentEoiId && resource.ownerId !== actor.studentEoiId) {
      return {
        allowed: false,
        reason: 'Students can only access their own records.',
        code: 'WRONG_OWNER',
      }
    }
  }

  if (action === 'employment:confirm' || action === 'employment:reject' || action === 'employment:request_correction') {
    // Employer verifiers can only act on their own org's requests
    if (resource.orgId && actor.orgId && resource.orgId !== actor.orgId) {
      return {
        allowed: false,
        reason: 'Employer verifiers can only act on verification requests for their own organization.',
        code: 'WRONG_OWNER',
      }
    }
  }

  // 4. Current resource state checks (no confirming an already-rejected record, etc.)
  if (action === 'employment:confirm' || action === 'employment:reject') {
    const invalidStates = ['VERIFIED_EMPLOYED', 'REJECTED', 'VERIFIED_UNEMPLOYED']
    if (resource.currentStatus && invalidStates.includes(resource.currentStatus)) {
      return {
        allowed: false,
        reason: `Cannot perform '${action}' on a record in '${resource.currentStatus}' state.`,
        code: 'INVALID_STATE',
      }
    }
  }

  if (action === 'employment:report_unemployment') {
    if (resource.currentStatus !== 'VERIFIED_EMPLOYED') {
      return {
        allowed: false,
        reason: 'Can only report unemployment when currently verified as employed.',
        code: 'INVALID_STATE',
      }
    }
  }

  if (action === 'employment:reconcile_unemployment') {
    const validStates = ['UNEMPLOYMENT_REPORTED', 'RECONCILIATION_PENDING']
    if (resource.currentStatus && !validStates.includes(resource.currentStatus)) {
      return {
        allowed: false,
        reason: `Cannot reconcile unemployment from state '${resource.currentStatus}'.`,
        code: 'INVALID_STATE',
      }
    }
  }

  return { allowed: true }
}

// ─── Error helper ─────────────────────────────────────────────────────────────

export class AuthorizationError extends Error {
  code: string
  constructor(result: Extract<AuthzResult, { allowed: false }>) {
    super(result.reason)
    this.name = 'AuthorizationError'
    this.code = result.code
  }
}

/**
 * assertAuthorized — throws AuthorizationError if not allowed.
 * Use in server actions and route handlers before any DB write.
 */
export function assertAuthorized(actor: Actor, action: Action, resource: Resource): void {
  const result = authorize(actor, action, resource)
  if (!result.allowed) {
    throw new AuthorizationError(result)
  }
}
