import { cookies } from 'next/headers'
import { db, DEMO_ACCOUNTS } from '@/lib/db/store'
import type { ActorRole } from './database.types'

export interface MockQueryBuilder<T = unknown> {
  select: (columns?: string) => MockQueryBuilder<T>
  eq: (column: string, value: unknown) => MockQueryBuilder<T>
  neq: (column: string, value: unknown) => MockQueryBuilder<T>
  order: (column: string, options?: { ascending?: boolean }) => MockQueryBuilder<T>
  limit: (count: number) => MockQueryBuilder<T>
  single: () => Promise<{ data: T | null; error: Error | null }>
  insert: (record: unknown) => Promise<{ data: unknown; error: Error | null }>
  update: (record: unknown) => MockQueryBuilder<T>
  then: <TResult1 = { data: T[]; error: Error | null }>(
    onfulfilled?: ((value: { data: T[]; error: Error | null }) => TResult1 | PromiseLike<TResult1>) | null
  ) => Promise<TResult1>
}

function createQueryBuilder<T>(initialData: T[]): MockQueryBuilder<T> {
  let items = [...initialData]

  const builder: MockQueryBuilder<T> = {
    select(_columns?: string) {
      return builder
    },
    eq(column: string, value: unknown) {
      items = items.filter(item => (item as Record<string, unknown>)[column] === value)
      return builder
    },
    neq(column: string, value: unknown) {
      items = items.filter(item => (item as Record<string, unknown>)[column] !== value)
      return builder
    },
    order(column: string, options?: { ascending?: boolean }) {
      const asc = options?.ascending ?? true
      items.sort((a, b) => {
        const valA = (a as Record<string, unknown>)[column]
        const valB = (b as Record<string, unknown>)[column]
        if (valA === valB) return 0
        if (valA === undefined || valA === null) return 1
        if (valB === undefined || valB === null) return -1
        return (valA > valB ? 1 : -1) * (asc ? 1 : -1)
      })
      return builder
    },
    limit(count: number) {
      items = items.slice(0, count)
      return builder
    },
    async single() {
      if (items.length === 0) return { data: null, error: new Error('Record not found') }
      return { data: items[0]!, error: null }
    },
    async insert(record: unknown) {
      if (Array.isArray(record)) {
        items.push(...(record as T[]))
      } else {
        items.push(record as T)
      }
      return { data: record, error: null }
    },
    update(_record: unknown) {
      return builder
    },
    then(onfulfilled) {
      const promise = Promise.resolve({ data: items, error: null })
      return promise.then(onfulfilled)
    },
  }

  return builder
}

/**
 * Server-side data client.
 * Serves real relational database views and records from the deterministic engine.
 */
export async function createClient() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('eoi_session')?.value

  let currentUser: { id: string; email: string; user_metadata: { role: ActorRole; full_name?: string } } | null = null

  if (sessionToken) {
    try {
      const parsed = JSON.parse(Buffer.from(sessionToken, 'base64').toString('utf-8'))
      const found = DEMO_ACCOUNTS.find(a => a.email === parsed.email)
      if (found) {
        currentUser = {
          id: found.id,
          email: found.email,
          user_metadata: { role: found.role, full_name: found.name },
        }
      }
    } catch {
      // Invalid session cookie
    }
  }

  return {
    auth: {
      async getUser() {
        return { data: { user: currentUser }, error: null }
      },
      async getSession() {
        return { data: { session: currentUser ? { user: currentUser } : null }, error: null }
      },
    },

    from(table: string): MockQueryBuilder<any> {
      switch (table) {
        case 'v_kpi_summary':
          return createQueryBuilder([db.getKpiSummary()])
        case 'v_outcome_funnel':
          return createQueryBuilder(db.getOutcomeFunnel())
        case 'v_agency_metrics':
          return createQueryBuilder(db.getAgencyMetrics())
        case 'v_skill_gap':
          return createQueryBuilder(db.getSkillGapData())
        case 'anomaly_signals':
          return createQueryBuilder(db.anomalySignals)
        case 'authorization_requests':
          return createQueryBuilder(db.authorizationRequests)
        case 'students':
          return createQueryBuilder(db.students)
        case 'employment_outcomes':
          return createQueryBuilder(db.employmentOutcomes)
        case 'audit_events':
          return createQueryBuilder(db.auditEvents)
        case 'organizations':
          return createQueryBuilder(db.employers)
        case 'agencies':
          return createQueryBuilder(db.agencies)
        case 'courses':
          return createQueryBuilder(db.courses)
        case 'skills':
          return createQueryBuilder(db.skills)
        case 'cohorts':
          return createQueryBuilder(db.cohorts)
        case 'industry_feedback':
          return createQueryBuilder(db.industryFeedback)
        case 'skill_requirements':
          return createQueryBuilder(db.skillRequirements)
        case 'notifications':
          return createQueryBuilder(db.notifications)
        default:
          return createQueryBuilder([])
      }
    },

    async rpc(fn: string, params?: Record<string, unknown>) {
      switch (fn) {
        case 'verify_ledger_chain':
          return { data: db.verifyLedgerChain(), error: null }
        case 'report_unemployment':
          return {
            data: db.reportUnemployment({
              studentId: params?.['p_eoi_student_id'] as string,
              actorId: params?.['p_actor_id'] as string,
              actorRole: params?.['p_actor_role'] as ActorRole,
              reason: params?.['p_reason'] as string | undefined,
            }),
            error: null,
          }
        case 'confirm_employment':
          return {
            data: db.confirmEmployment({
              outcomeId: params?.['p_outcome_id'] as string,
              actorId: params?.['p_actor_id'] as string,
              actorRole: params?.['p_actor_role'] as ActorRole,
            }),
            error: null,
          }
        case 'confirm_unemployment':
          return {
            data: db.confirmUnemployment({
              outcomeId: params?.['p_outcome_id'] as string,
              actorId: params?.['p_actor_id'] as string,
              actorRole: params?.['p_actor_role'] as ActorRole,
            }),
            error: null,
          }
        case 'reject_employment':
          return {
            data: db.rejectEmployment({
              outcomeId: params?.['p_outcome_id'] as string,
              actorId: params?.['p_actor_id'] as string,
              actorRole: params?.['p_actor_role'] as ActorRole,
              reason: params?.['p_reason'] as string,
            }),
            error: null,
          }
        case 'request_correction':
          return {
            data: db.requestCorrection({
              outcomeId: params?.['p_outcome_id'] as string,
              actorId: params?.['p_actor_id'] as string,
              actorRole: params?.['p_actor_role'] as ActorRole,
              notes: params?.['p_notes'] as string,
            }),
            error: null,
          }
        case 'raise_dispute':
          return {
            data: db.raiseDispute({
              outcomeId: params?.['p_outcome_id'] as string,
              actorId: params?.['p_actor_id'] as string,
              actorRole: params?.['p_actor_role'] as ActorRole,
              reason: params?.['p_reason'] as string,
            }),
            error: null,
          }
        default:
          return { data: null, error: new Error(`Unknown RPC function: ${fn}`) }
      }
    },
  }
}

export function createServiceClient() {
  return createClient()
}
