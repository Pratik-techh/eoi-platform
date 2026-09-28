/**
 * Database type stubs — replace with generated types after running:
 *   pnpm db:types
 *
 * This file is a placeholder so TypeScript compiles before Supabase is running.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      employment_status:
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
      verification_status: 'REPORTED' | 'PENDING' | 'VERIFIED' | 'UNVERIFIED' | 'DISPUTED' | 'REJECTED' | 'SELF_REPORTED'
      actor_role:
        | 'gov_analyst'
        | 'gov_program_admin'
        | 'gov_auditor'
        | 'agency_admin'
        | 'agency_officer'
        | 'student'
        | 'employer_admin'
        | 'employer_verifier'
        | 'security_officer'
        | 'platform_ops'
      identifier_class: 'CIN' | 'LLPIN' | 'EPFO_ESTABLISHMENT_ID' | 'OTHER_AUTHORIZED'
      org_claim_status: 'UNCLAIMED' | 'CLAIM_PENDING' | 'CLAIMED' | 'CLAIM_REJECTED'
      auth_request_status: 'PENDING' | 'APPROVED' | 'REJECTED'
      investigation_status: 'OPEN' | 'UNDER_REVIEW' | 'CLOSED'
      dispute_status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED'
    }
    CompositeTypes: Record<string, never>
  }
}

// Convenience type aliases
export type EmploymentStatus = Database['public']['Enums']['employment_status']
export type VerificationStatus = Database['public']['Enums']['verification_status']
export type ActorRole = Database['public']['Enums']['actor_role']
export type IdentifierClass = Database['public']['Enums']['identifier_class']
export type OrgClaimStatus = Database['public']['Enums']['org_claim_status']
export type AuthRequestStatus = Database['public']['Enums']['auth_request_status']
