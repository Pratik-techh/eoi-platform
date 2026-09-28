/**
 * EOI Platform — External Integration Adapter Contracts
 * MASTER_PROMPT Section 16 — Future Integrations
 * 
 * Strict rule: All adapters are typed stubs returning NOT_CONNECTED.
 * No live integration claims.
 */

export type AdapterStatus = 'NOT_CONNECTED' | 'PLANNED' | 'DISABLED'

export interface AdapterResult<T = unknown> {
  status: AdapterStatus
  connected: false
  message: string
  data: T | null
}

export interface SIDHAdapter {
  fetchTraineeSkillRecords(eoiStudentId: string): Promise<AdapterResult>
}

export interface NCSAdapter {
  fetchJobPostings(sector: string): Promise<AdapterResult>
}

export interface EShramAdapter {
  verifyUnorganizedSectorRegistration(uwinToken: string): Promise<AdapterResult>
}

export interface EPFOAdapter {
  verifyEstablishmentIdentifier(epfoId: string): Promise<AdapterResult>
}

export interface ESICAdapter {
  verifyInsuredPerson(ipNumber: string): Promise<AdapterResult>
}

export interface OrgRegistryAdapter {
  verifyCinRegistry(cin: string): Promise<AdapterResult>
  verifyLlpinRegistry(llpin: string): Promise<AdapterResult>
}

export interface EmployerSystemAdapter {
  queryHrisPayrollStatus(employeeId: string, orgId: string): Promise<AdapterResult>
}

// ─── Concrete Default Disabled Implementations ───────────────────────────────

const NOT_CONNECTED_RESPONSE: AdapterResult = {
  status: 'NOT_CONNECTED',
  connected: false,
  message: 'Planned integration — not connected in prototype.',
  data: null,
}

export const sidhAdapter: SIDHAdapter = {
  async fetchTraineeSkillRecords() { return NOT_CONNECTED_RESPONSE },
}

export const ncsAdapter: NCSAdapter = {
  async fetchJobPostings() { return NOT_CONNECTED_RESPONSE },
}

export const eShramAdapter: EShramAdapter = {
  async verifyUnorganizedSectorRegistration() { return NOT_CONNECTED_RESPONSE },
}

export const epfoAdapter: EPFOAdapter = {
  async verifyEstablishmentIdentifier() { return NOT_CONNECTED_RESPONSE },
}

export const esicAdapter: ESICAdapter = {
  async verifyInsuredPerson() { return NOT_CONNECTED_RESPONSE },
}

export const orgRegistryAdapter: OrgRegistryAdapter = {
  async verifyCinRegistry() { return NOT_CONNECTED_RESPONSE },
  async verifyLlpinRegistry() { return NOT_CONNECTED_RESPONSE },
}

export const employerSystemAdapter: EmployerSystemAdapter = {
  async queryHrisPayrollStatus() { return NOT_CONNECTED_RESPONSE },
}
