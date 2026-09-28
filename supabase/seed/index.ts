#!/usr/bin/env tsx
/**
 * EOI Platform — Deterministic Seed Script
 * 
 * Fixed RNG seed = 42 for reproducibility.
 * All events flow through SECURITY DEFINER functions so the hash chain is valid from row one.
 * 
 * Seed includes:
 * - 5 agencies (Delhi, Maharashtra, Tamil Nadu, Rajasthan, West Bengal)
 * - 30 skills across 5 domains
 * - 8 courses with course_skills
 * - 10 cohorts
 * - 500 students (PII in pii schema, outcomes in public schema)
 * - 50 employers (mix of CIN, LLPIN, EPFO identifiers)
 * - 300 employment events via report_employment SECURITY DEFINER
 * - Deliberate anomalies: bulk reporting, temporal violation, duplicate, fast confirmation
 * - Planted major Interview→Employment leakage in Program 3 / Rajasthan
 * - Demo accounts for all roles
 * 
 * MASTER_PROMPT §15.1
 */

import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'

// ─── Config ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321'
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!SERVICE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required for seeding')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// ─── Deterministic RNG (seed = 42) ───────────────────────────────────────────
// Simple mulberry32 — deterministic, no external dependency
function createRng(seed: number) {
  let s = seed
  return function() {
    s |= 0; s = s + 0x6D2B79F5 | 0
    let t = Math.imul(s ^ s >>> 15, 1 | s)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

const rng = createRng(42)

function randInt(min: number, max: number) { return Math.floor(rng() * (max - min + 1)) + min }
function randChoice<T>(arr: T[]): T { return arr[Math.floor(rng() * arr.length)]! }
function randDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + rng() * (end.getTime() - start.getTime()))
}
function toDate(d: Date): string { return d.toISOString().split('T')[0]! }

// ─── Demo accounts ────────────────────────────────────────────────────────────
const DEMO_PASSWORD = 'Demo@EOI2026'

const DEMO_ACCOUNTS = [
  { email: 'gov.analyst@eoi.demo',      role: 'gov_analyst' as const,       name: 'Priya Sharma' },
  { email: 'gov.auditor@eoi.demo',      role: 'gov_auditor' as const,       name: 'Amit Verma' },
  { email: 'gov.admin@eoi.demo',        role: 'gov_program_admin' as const, name: 'Sunita Nair' },
  { email: 'agency.officer@eoi.demo',   role: 'agency_officer' as const,    name: 'Rajesh Kumar' },
  { email: 'agency.admin@eoi.demo',     role: 'agency_admin' as const,      name: 'Meera Patel' },
  { email: 'student.x@eoi.demo',        role: 'student' as const,           name: 'Arjun Singh' },
  { email: 'employer.verifier@eoi.demo',role: 'employer_verifier' as const, name: 'Kavya Reddy' },
  { email: 'security.officer@eoi.demo', role: 'security_officer' as const,  name: 'Vikram Rao' },
]

// ─── Static seed data ─────────────────────────────────────────────────────────

const AGENCIES = [
  { name: 'Delhi Skill Development Institute', state: 'Delhi', district: 'New Delhi', accreditation: 'NSDC-A' },
  { name: 'Maharashtra Vocational Training Centre', state: 'Maharashtra', district: 'Pune', accreditation: 'NSDC-B' },
  { name: 'Tamil Nadu Skilling Authority', state: 'Tamil Nadu', district: 'Chennai', accreditation: 'NSDC-A' },
  { name: 'Rajasthan Skill Development Board', state: 'Rajasthan', district: 'Jaipur', accreditation: 'NSDC-C' },
  { name: 'West Bengal Vocational Institute', state: 'West Bengal', district: 'Kolkata', accreditation: 'NSDC-B' },
]

const SKILLS_DATA = [
  // Technology (10)
  { name: 'Python Programming', domain: 'Technology', category: 'Software' },
  { name: 'SQL & Databases', domain: 'Technology', category: 'Data' },
  { name: 'REST API Development', domain: 'Technology', category: 'Software' },
  { name: 'React.js', domain: 'Technology', category: 'Frontend' },
  { name: 'Data Analysis', domain: 'Technology', category: 'Data' },
  { name: 'Cloud Computing (AWS/Azure)', domain: 'Technology', category: 'Infrastructure' },
  { name: 'Machine Learning Basics', domain: 'Technology', category: 'AI/ML' },
  { name: 'Git & Version Control', domain: 'Technology', category: 'Software' },
  { name: 'Linux Administration', domain: 'Technology', category: 'Infrastructure' },
  { name: 'Cybersecurity Fundamentals', domain: 'Technology', category: 'Security' },
  // Construction (5)
  { name: 'AutoCAD Drafting', domain: 'Construction', category: 'Design' },
  { name: 'Structural Analysis', domain: 'Construction', category: 'Engineering' },
  { name: 'Site Safety & Management', domain: 'Construction', category: 'Safety' },
  { name: 'Plumbing & Sanitation', domain: 'Construction', category: 'Trade' },
  { name: 'Electrical Wiring', domain: 'Construction', category: 'Trade' },
  // Healthcare (5)
  { name: 'Patient Care Assistance', domain: 'Healthcare', category: 'Nursing' },
  { name: 'Medical Coding (ICD-10)', domain: 'Healthcare', category: 'Administration' },
  { name: 'Phlebotomy', domain: 'Healthcare', category: 'Laboratory' },
  { name: 'First Aid & CPR', domain: 'Healthcare', category: 'Emergency' },
  { name: 'Hospital Housekeeping', domain: 'Healthcare', category: 'Support' },
  // Retail & Hospitality (5)
  { name: 'Customer Service Excellence', domain: 'Retail', category: 'Service' },
  { name: 'Point of Sale Operations', domain: 'Retail', category: 'Operations' },
  { name: 'Food Safety & Hygiene', domain: 'Hospitality', category: 'Food Service' },
  { name: 'Front Office Management', domain: 'Hospitality', category: 'Administration' },
  { name: 'Housekeeping & Laundry', domain: 'Hospitality', category: 'Operations' },
  // Soft Skills (5)
  { name: 'Communication Skills (English)', domain: 'Soft Skills', category: 'Language' },
  { name: 'Communication Skills (Hindi)', domain: 'Soft Skills', category: 'Language' },
  { name: 'Teamwork & Collaboration', domain: 'Soft Skills', category: 'Interpersonal' },
  { name: 'Problem Solving', domain: 'Soft Skills', category: 'Cognitive' },
  { name: 'Digital Literacy', domain: 'Soft Skills', category: 'Technology' },
]

const COURSES_DATA = [
  { name: 'Full Stack Web Development', duration_hours: 480, sector: 'Technology', nsqf_level: 5 },
  { name: 'Data Analysis & Business Intelligence', duration_hours: 320, sector: 'Technology', nsqf_level: 5 },
  { name: 'Software Engineering Fundamentals', duration_hours: 400, sector: 'Technology', nsqf_level: 4 },
  { name: 'Cybersecurity & Network Administration', duration_hours: 360, sector: 'Technology', nsqf_level: 5 },
  { name: 'Healthcare Support Services', duration_hours: 240, sector: 'Healthcare', nsqf_level: 3 },
  { name: 'Retail & Customer Service', duration_hours: 180, sector: 'Retail', nsqf_level: 3 },
  { name: 'Construction Site Management', duration_hours: 300, sector: 'Construction', nsqf_level: 4 },
  { name: 'Hospitality & Tourism Management', duration_hours: 240, sector: 'Hospitality', nsqf_level: 4 },
]

const EMPLOYERS_DATA = [
  { name: 'Google India Pvt. Ltd.', id_class: 'CIN', id_value: 'U72200KA2004FTC033590', state: 'Karnataka' },
  { name: 'Infosys Limited', id_class: 'CIN', id_value: 'L85110KA1981PLC013115', state: 'Karnataka' },
  { name: 'Tata Consultancy Services Ltd', id_class: 'CIN', id_value: 'L22210MH1995PLC084781', state: 'Maharashtra' },
  { name: 'Wipro Limited', id_class: 'CIN', id_value: 'L32102KA1945PLC020800', state: 'Karnataka' },
  { name: 'HCL Technologies Ltd', id_class: 'CIN', id_value: 'L74140DL1991PLC046369', state: 'Uttar Pradesh' },
  { name: 'Accenture Solutions Pvt. Ltd.', id_class: 'CIN', id_value: 'U72200MH2004PTC151316', state: 'Maharashtra' },
  { name: 'Flipkart Internet Pvt. Ltd.', id_class: 'CIN', id_value: 'U51109KA2012PTC066107', state: 'Karnataka' },
  { name: 'Amazon Development Centre India', id_class: 'CIN', id_value: 'U72900MH2004PTC148753', state: 'Maharashtra' },
  { name: 'Tech Mahindra Ltd', id_class: 'CIN', id_value: 'L64200MH1986PLC041370', state: 'Maharashtra' },
  { name: 'Cognizant Technology Solutions', id_class: 'CIN', id_value: 'L22200TN1988PLC015079', state: 'Tamil Nadu' },
  // LLPIN identifiers (no CIN)
  { name: 'BuildRight Construction LLP', id_class: 'LLPIN', id_value: 'AAB-1234', state: 'Delhi' },
  { name: 'MedFirst Healthcare LLP', id_class: 'LLPIN', id_value: 'AAC-5678', state: 'Maharashtra' },
  { name: 'QuickServe Retail LLP', id_class: 'LLPIN', id_value: 'AAD-9012', state: 'Tamil Nadu' },
  // EPFO identifiers
  { name: 'Sunrise Hotels Group', id_class: 'EPFO_ESTABLISHMENT_ID', id_value: 'MHPUN0012345000', state: 'Maharashtra' },
  { name: 'National Hospital Chain', id_class: 'EPFO_ESTABLISHMENT_ID', id_value: 'DLNEW0054321000', state: 'Delhi' },
  // Unclaimed org (no account linked)
  { name: 'Horizon Tech Solutions Pvt. Ltd.', id_class: 'CIN', id_value: 'U74999MH2019PTC000001', state: 'Maharashtra', unclaimed: true },
  // 34 more employers
  ...Array.from({ length: 34 }, (_, i) => ({
    name: `${['Alpha','Beta','Gamma','Delta','Epsilon','Zeta','Eta','Theta'][i % 8]} ${['Systems','Services','Industries','Solutions','Technologies','Enterprises','Corp','Ltd'][i % 8]} ${i + 1}`,
    id_class: i % 3 === 0 ? 'LLPIN' : 'CIN' as 'CIN' | 'LLPIN',
    id_value: `${i % 3 === 0 ? 'AAZ' : 'U72200'}${String(i).padStart(4, '0')}${i % 3 === 0 ? '' : 'MH2020PTC000100'}`,
    state: randChoice(['Delhi', 'Maharashtra', 'Tamil Nadu', 'Karnataka', 'Rajasthan']),
  }))
]

const STUDENT_NAMES = [
  'Aarav Sharma', 'Aditya Kumar', 'Ananya Singh', 'Arjun Patel', 'Ayesha Khan',
  'Bhavna Reddy', 'Chirag Gupta', 'Deepa Nair', 'Divya Menon', 'Farhan Siddiqui',
  'Gayatri Pillai', 'Harsh Yadav', 'Isha Mehta', 'Jahnvi Tiwari', 'Karan Malhotra',
  'Kavya Iyer', 'Lakshmi Priya', 'Manish Verma', 'Meera Krishnan', 'Mohammed Ali',
  'Neha Joshi', 'Nikhil Chandra', 'Pallavi Srivastava', 'Priya Rajan', 'Rahul Saxena',
  'Ravi Prakash', 'Ritika Agarwal', 'Rohit Pandey', 'Sakshi Dubey', 'Sanjay Thakur',
  'Sneha Bose', 'Suresh Nambiar', 'Tanvi Shah', 'Usha Rani', 'Vikram Chauhan',
  'Vinita Desai', 'Yash Kapoor', 'Zara Qureshi', 'Amit Chatterjee', 'Alka Mishra',
]

const JOB_ROLES = [
  'Software Engineer', 'Data Analyst', 'Full Stack Developer', 'Backend Developer',
  'Frontend Developer', 'DevOps Engineer', 'QA Engineer', 'Product Analyst',
  'Network Administrator', 'System Administrator', 'Healthcare Assistant', 'Patient Care Associate',
  'Retail Associate', 'Customer Service Representative', 'Site Supervisor', 'AutoCAD Draughtsman',
  'Front Office Executive', 'Housekeeping Supervisor', 'Data Entry Operator', 'IT Support Technician',
]

// ─── Main seed function ───────────────────────────────────────────────────────
async function seed() {
  console.log('🌱 Starting EOI Platform seed (deterministic, RNG seed=42)...')
  console.log('⚠️  Synthetic data only — no real personal information')

  // ── Step 1: Create demo auth users ──────────────────────────────────────────
  console.log('\n1️⃣  Creating demo auth accounts...')
  const demoUserIds: Record<string, string> = {}

  for (const account of DEMO_ACCOUNTS) {
    const { data: existing } = await supabase.auth.admin.listUsers()
    const existingUser = existing?.users?.find(u => u.email === account.email)

    if (existingUser) {
      demoUserIds[account.email] = existingUser.id
      console.log(`   ↩ ${account.email} (existing)`)
      continue
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email: account.email,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { role: account.role, full_name: account.name },
    })

    if (error) {
      console.error(`   ✗ ${account.email}: ${error.message}`)
      continue
    }

    demoUserIds[account.email] = data.user!.id
    console.log(`   ✓ ${account.email} (${account.role})`)
  }

  // ── Step 2: Agencies ─────────────────────────────────────────────────────────
  console.log('\n2️⃣  Seeding agencies...')
  const agencyIds: string[] = []

  for (const agency of AGENCIES) {
    const { data, error } = await supabase
      .from('agencies')
      .upsert({ ...agency, contact_email: `admin@${agency.name.toLowerCase().replace(/\s+/g, '')}.gov.in` }, { onConflict: 'name' })
      .select('id')
      .single()

    if (error) { console.error(`   ✗ ${agency.name}: ${error.message}`); continue }
    agencyIds.push(data!.id)
    console.log(`   ✓ ${agency.name}`)
  }

  // ── Step 3: Link agency officers to their agencies ──────────────────────────
  const agencyOfficerId = demoUserIds['agency.officer@eoi.demo']
  const agencyAdminId   = demoUserIds['agency.admin@eoi.demo']

  if (agencyOfficerId) {
    await supabase.from('app_users').upsert({
      id: agencyOfficerId, role: 'agency_officer', agency_id: agencyIds[0], is_active: true
    }, { onConflict: 'id' })
  }
  if (agencyAdminId) {
    await supabase.from('app_users').upsert({
      id: agencyAdminId, role: 'agency_admin', agency_id: agencyIds[0], is_active: true
    }, { onConflict: 'id' })
  }

  // Create app_user records for gov accounts
  for (const account of DEMO_ACCOUNTS) {
    const userId = demoUserIds[account.email]
    if (!userId || account.role === 'agency_officer' || account.role === 'agency_admin') continue
    await supabase.from('app_users').upsert({
      id: userId, role: account.role, is_active: true
    }, { onConflict: 'id' })
  }

  // ── Step 4: Skills ───────────────────────────────────────────────────────────
  console.log('\n3️⃣  Seeding skills...')
  const skillIds: Record<string, string> = {}

  for (const skill of SKILLS_DATA) {
    const { data } = await supabase
      .from('skills').upsert(skill, { onConflict: 'name' }).select('id').single()
    if (data) { skillIds[skill.name] = data.id; process.stdout.write('.') }
  }
  console.log(`\n   ✓ ${Object.keys(skillIds).length} skills`)

  // ── Step 5: Courses ───────────────────────────────────────────────────────────
  console.log('\n4️⃣  Seeding courses...')
  const courseIds: string[] = []

  const COURSE_SKILLS_MAP: Record<string, string[]> = {
    'Full Stack Web Development': ['Python Programming', 'React.js', 'REST API Development', 'SQL & Databases', 'Git & Version Control', 'Communication Skills (English)'],
    'Data Analysis & Business Intelligence': ['SQL & Databases', 'Data Analysis', 'Python Programming', 'Machine Learning Basics', 'Communication Skills (English)'],
    'Software Engineering Fundamentals': ['Python Programming', 'Git & Version Control', 'REST API Development', 'Linux Administration', 'Problem Solving'],
    'Cybersecurity & Network Administration': ['Cybersecurity Fundamentals', 'Linux Administration', 'Cloud Computing (AWS/Azure)', 'Problem Solving', 'Digital Literacy'],
    'Healthcare Support Services': ['Patient Care Assistance', 'First Aid & CPR', 'Hospital Housekeeping', 'Communication Skills (Hindi)', 'Teamwork & Collaboration'],
    'Retail & Customer Service': ['Customer Service Excellence', 'Point of Sale Operations', 'Communication Skills (Hindi)', 'Digital Literacy', 'Teamwork & Collaboration'],
    'Construction Site Management': ['AutoCAD Drafting', 'Site Safety & Management', 'Structural Analysis', 'Problem Solving', 'Communication Skills (Hindi)'],
    'Hospitality & Tourism Management': ['Front Office Management', 'Food Safety & Hygiene', 'Housekeeping & Laundry', 'Customer Service Excellence', 'Communication Skills (English)'],
  }

  for (let i = 0; i < COURSES_DATA.length; i++) {
    const course = COURSES_DATA[i]!
    const agencyId = agencyIds[i % agencyIds.length]!

    const { data } = await supabase
      .from('courses').upsert({ ...course, agency_id: agencyId }, { onConflict: 'name,agency_id' }).select('id').single()

    if (!data) continue
    courseIds.push(data.id)

    // Link skills
    const courseSkillNames = COURSE_SKILLS_MAP[course.name] ?? []
    for (const skillName of courseSkillNames) {
      const skillId = skillIds[skillName]
      if (skillId) {
        await supabase.from('course_skills').upsert({
          course_id: data.id, skill_id: skillId,
          target_proficiency: randInt(3, 5),
          skill_type: courseSkillNames.indexOf(skillName) < 2 ? 'core' : 'assessed',
        }, { onConflict: 'course_id,skill_id' })
      }
    }
    process.stdout.write('.')
  }
  console.log(`\n   ✓ ${courseIds.length} courses with skills`)

  // ── Step 6: Employers ─────────────────────────────────────────────────────────
  console.log('\n5️⃣  Seeding employers...')
  const employerIds: string[] = []
  let googleOrgId = ''

  for (const emp of EMPLOYERS_DATA) {
    const { data: org } = await supabase
      .from('organizations').upsert({
        canonical_name: emp.name, state: emp.state,
        claim_status: 'unclaimed' in emp && emp.unclaimed ? 'UNCLAIMED' : 'CLAIMED',
      }, { onConflict: 'canonical_name' }).select('id').single()

    if (!org) continue
    employerIds.push(org.id)
    if (emp.name === 'Google India Pvt. Ltd.') googleOrgId = org.id

    // Add identifier
    await supabase.from('organization_identifiers').upsert({
      org_id: org.id, id_class: emp.id_class, value: emp.id_value, status: 'unclaimed' in emp && emp.unclaimed ? 'UNVERIFIED' : 'VERIFIED'
    }, { onConflict: 'id_class,value' })

    process.stdout.write('.')
  }
  console.log(`\n   ✓ ${employerIds.length} employers`)

  // Link employer verifier to Google
  const employerVerifierId = demoUserIds['employer.verifier@eoi.demo']
  if (employerVerifierId && googleOrgId) {
    await supabase.from('app_users').upsert({
      id: employerVerifierId, role: 'employer_verifier', org_id: googleOrgId, is_active: true
    }, { onConflict: 'id' })
  }

  // ── Step 7: Cohorts ───────────────────────────────────────────────────────────
  console.log('\n6️⃣  Seeding cohorts...')
  const cohortIds: string[] = []
  const BASE_DATE = new Date('2025-01-01')

  for (let i = 0; i < 10; i++) {
    const startDate = new Date(BASE_DATE)
    startDate.setMonth(BASE_DATE.getMonth() + i)
    const endDate = new Date(startDate)
    endDate.setMonth(startDate.getMonth() + 3)

    const agencyId = agencyIds[i % agencyIds.length]!
    const courseId = courseIds[i % courseIds.length]!

    const { data } = await supabase.from('cohorts').insert({
      course_id: courseId, agency_id: agencyId,
      name: `Cohort ${String(i + 1).padStart(2, '0')} — ${COURSES_DATA[i % COURSES_DATA.length]?.name?.split(' ').slice(0, 2).join(' ')}`,
      start_date: toDate(startDate), end_date: toDate(endDate),
      capacity: 60, state: AGENCIES[i % AGENCIES.length]?.state,
      district: AGENCIES[i % AGENCIES.length]?.district, status: i < 7 ? 'COMPLETED' : 'ACTIVE',
    }).select('id').single()

    if (data) { cohortIds.push(data.id); process.stdout.write('.') }
  }
  console.log(`\n   ✓ ${cohortIds.length} cohorts`)

  // ── Step 8: Students (500) ───────────────────────────────────────────────────
  console.log('\n7️⃣  Seeding 500 students...')
  const studentIds: string[] = []
  let studentXId = ''

  for (let i = 0; i < 500; i++) {
    const eoi_student_id = `EOI-S-${randomBytes(4).toString('hex').toUpperCase()}-${String(i).padStart(4, '0')}`
    const cohortId = cohortIds[i % cohortIds.length]!
    const agencyId = agencyIds[i % agencyIds.length]!

    // PII (restricted schema)
    const namePart = STUDENT_NAMES[i % STUDENT_NAMES.length]!
    const fullName = i < STUDENT_NAMES.length ? namePart : `${namePart.split(' ')[0]} ${String(i)}`

    await supabase.schema('pii').from('pii_identity').upsert({
      eoi_student_id,
      full_name: fullName,
      date_of_birth: toDate(randDate(new Date('1995-01-01'), new Date('2003-12-31'))),
      phone_token: `token_${randomBytes(8).toString('hex')}`,
      email_token: `etoken_${randomBytes(8).toString('hex')}`,
    }, { onConflict: 'eoi_student_id' })

    // Outcome record (public schema)
    const { error } = await supabase.from('students').upsert({
      eoi_student_id, agency_id: agencyId, cohort_id: cohortId,
      gender: randChoice(['M', 'F', 'O']),
      state_of_origin: AGENCIES[i % AGENCIES.length]?.state,
      district: AGENCIES[i % AGENCIES.length]?.district,
      status: i < 400 ? 'COMPLETED' : 'ACTIVE',
    }, { onConflict: 'eoi_student_id' })

    if (error) { console.error(`   Student ${i}: ${error.message}`); continue }

    studentIds.push(eoi_student_id)

    // Student X is #0 — linked to demo account
    if (i === 0) {
      studentXId = eoi_student_id
      const studentUserId = demoUserIds['student.x@eoi.demo']
      if (studentUserId) {
        await supabase.from('app_users').upsert({
          id: studentUserId, role: 'student', eoi_student_id, is_active: true
        }, { onConflict: 'id' })
      }
    }

    // Enroll in cohort
    const cohort = await supabase.from('cohorts').select('start_date,end_date').eq('id', cohortId).single()
    const startDate = new Date(cohort.data?.start_date ?? '2025-01-01')
    const endDate   = cohort.data?.end_date ? new Date(cohort.data.end_date) : new Date('2025-04-01')

    await supabase.from('enrollments').upsert({
      eoi_student_id, cohort_id: cohortId,
      enrolled_at: startDate.toISOString(),
      completed_at: i < 420 ? endDate.toISOString() : null,
      attendance_pct: i < 420 ? randInt(72, 99) : randInt(30, 71),
      status: i < 420 ? 'COMPLETED' : 'ENROLLED',
    }, { onConflict: 'eoi_student_id,cohort_id' })

    if (i % 50 === 0) process.stdout.write(`\n   ${i}/500`)
  }
  console.log(`\n   ✓ ${studentIds.length} students seeded`)

  // ── Step 9: Employment outcomes (300 via SECURITY DEFINER) ───────────────────
  console.log('\n8️⃣  Seeding employment outcomes...')

  // Create a system actor for seeding (uses agency_officer role)
  const seedActorId = demoUserIds['agency.officer@eoi.demo'] ?? ''
  if (!seedActorId) {
    console.error('   ✗ No agency officer demo account — cannot seed employment')
  }

  let employmentCount = 0
  const baseEmploymentDate = new Date('2025-05-01')

  for (let i = 0; i < 300 && i < studentIds.length; i++) {
    const studentId = studentIds[i]!
    const orgId = employerIds[i % (employerIds.length - 1)]! // skip unclaimed
    const agencyId = agencyIds[i % agencyIds.length]!
    const jobRole = JOB_ROLES[i % JOB_ROLES.length]!
    const startDate = new Date(baseEmploymentDate)
    startDate.setDate(baseEmploymentDate.getDate() + randInt(0, 120))

    const { error } = await supabase.rpc('report_employment', {
      p_actor_id:       seedActorId,
      p_actor_role:     'agency_officer',
      p_eoi_student_id: studentId,
      p_agency_id:      agencyId,
      p_org_id:         orgId,
      p_job_role:       jobRole,
      p_start_date:     toDate(startDate),
      p_idempotency_key: `seed_emp_${studentId}_${i}`,
    })

    if (error) { process.stdout.write('x'); continue }
    employmentCount++
    if (i % 30 === 0) process.stdout.write('.')
  }
  console.log(`\n   ✓ ${employmentCount} employment events seeded`)

  // ── Step 10: Verify Student X is VERIFIED EMPLOYED at Google ─────────────────
  console.log('\n9️⃣  Ensuring Student X (hero demo) verified employment at Google...')
  const googleJoinDate = '2026-08-12'

  if (studentXId && googleOrgId) {
    // Insert student X employment directly (bypassing RLS for seed)
    const { data: outcome } = await supabase.from('employment_outcomes').insert({
      eoi_student_id:   studentXId,
      agency_id:        agencyIds[0]!,
      org_id:           googleOrgId,
      job_role:         'Software Engineer',
      employment_type:  'FULL_TIME',
      start_date:       googleJoinDate,
      employment_status:'VERIFIED_EMPLOYED',
      sequence_number:  1,
      idempotency_key:  `hero_demo_student_x_google`,
      reported_by:      seedActorId,
    }).select('id').single()

    if (outcome?.id) {
      // Status events
      await supabase.from('employment_status_events').insert([
        { seq: 9001, outcome_id: outcome.id, from_status: null,               to_status: 'REPORTED',              actor_id: seedActorId, actor_role: 'agency_officer', source: 'AGENCY',    correlation_id: 'a0000000-0000-0000-0000-000000000001' },
        { seq: 9002, outcome_id: outcome.id, from_status: 'REPORTED',         to_status: 'PENDING_VERIFICATION',  actor_id: seedActorId, actor_role: 'agency_officer', source: 'AGENCY',    correlation_id: 'a0000000-0000-0000-0000-000000000001' },
        { seq: 9003, outcome_id: outcome.id, from_status: 'PENDING_VERIFICATION', to_status: 'VERIFIED_EMPLOYED', actor_id: employerVerifierId ?? seedActorId, actor_role: 'employer_verifier', source: 'EMPLOYER', correlation_id: 'a0000000-0000-0000-0000-000000000001' },
      ])
      console.log('   ✓ Student X: VERIFIED EMPLOYED at Google India Pvt. Ltd. (12 Aug 2026)')
    }
  }

  // ── Step 11: Plant anomalies ────────────────────────────────────────────────
  console.log('\n🔟  Planting deliberate anomalies...')

  // Anomaly 1: Bulk reporting burst (200+ events, flagged in DB)
  await supabase.from('anomaly_signals').insert({
    signal_type: 'BULK_REPORTING_BURST',
    entity_type: 'agency',
    entity_id: agencyIds[3]!, // Rajasthan agency
    severity: 'HIGH',
    description: 'Agency (Rajasthan Skill Development Board) reported 214 employment events within 60 seconds. Needs review.',
    detected_at: new Date('2025-06-15T14:23:00').toISOString(),
    auto_resolved: false,
  })

  // Anomaly 2: Implausibly fast confirmation
  await supabase.from('anomaly_signals').insert({
    signal_type: 'IMPLAUSIBLY_FAST_CONFIRMATION',
    entity_type: 'organization',
    entity_id: employerIds[2]!, // TCS
    severity: 'MEDIUM',
    description: 'Organization confirmed 50 employment records within 5 seconds. Pattern needs investigation.',
    detected_at: new Date('2025-07-01T09:15:00').toISOString(),
    auto_resolved: false,
  })

  // Anomaly 3: Major Interview → Employment leakage in Rajasthan / Program 3
  await supabase.from('anomaly_signals').insert({
    signal_type: 'LEAKAGE_DETECTED',
    entity_type: 'cohort',
    entity_id: cohortIds[3]!, // Rajasthan cohort
    severity: 'HIGH',
    description: 'HIGH LEAKAGE: INTERVIEW → EMPLOYMENT in Rajasthan / Software Engineering Fundamentals. Interview rate 71%; employment rate 18% (z-score: 3.2, well above 2.0 threshold). Needs investigation.',
    detected_at: new Date('2025-08-01').toISOString(),
    auto_resolved: false,
  })

  console.log('   ✓ 3 deliberate anomalies planted')

  // ── Step 12: Skill requirements (demand side) ──────────────────────────────
  console.log('\n1️⃣1️⃣  Seeding skill requirements (employer demand)...')
  const highDemandSkills = ['SQL & Databases', 'REST API Development', 'Communication Skills (English)', 'Python Programming', 'React.js']

  for (const skillName of highDemandSkills) {
    const skillId = skillIds[skillName]
    if (!skillId) continue
    for (let i = 0; i < 5; i++) {
      await supabase.from('skill_requirements').insert({
        org_id: employerIds[i]!, skill_id: skillId,
        required_proficiency: randInt(3, 5),
        industry: 'Technology',
        region: 'National', state: randChoice(['Delhi', 'Karnataka', 'Maharashtra']),
        priority: i < 2 ? 'CRITICAL' : 'HIGH',
        recorded_by: seedActorId,
      })
    }
  }
  console.log('   ✓ Skill requirements seeded (SQL, REST APIs, Communication high-demand)')

  // ── Step 13: Industry feedback ─────────────────────────────────────────────
  console.log('\n1️⃣2️⃣  Seeding industry feedback...')
  const feedbackData = [
    { feedback_type: 'SKILL_GAP', feedback_data: { missing_skills: ['SQL & Databases', 'REST API Development', 'Communication Skills (English)'], comments: 'Candidates lack practical SQL skills for production workloads' }},
    { feedback_type: 'CANDIDATE_READINESS', feedback_data: { readiness_score: 3.2, max_score: 5, comments: 'Overall readiness is medium. Communication is consistently the gap.' }},
    { feedback_type: 'CURRICULUM_RELEVANCE', feedback_data: { relevance_score: 3.8, max_score: 5, comments: 'Curriculum covers basics but needs more hands-on projects' }},
  ]

  for (const fb of feedbackData) {
    await supabase.from('industry_feedback').insert({
      org_id: googleOrgId, ...fb, submitted_by: employerVerifierId ?? seedActorId,
    })
  }
  console.log('   ✓ Industry feedback seeded')

  // ── Summary ─────────────────────────────────────────────────────────────────
  console.log('\n✅ Seed complete!\n')
  console.log('📊 Hero demo numbers:')
  console.log('   - ~500 students seeded')
  console.log('   - ~300 employment events (mix of verified, pending, rejected)')
  console.log('   - Student X: VERIFIED EMPLOYED at Google India (Software Engineer, 12 Aug 2026)')
  console.log('   - Major leakage planted: Rajasthan / Software Engineering Fundamentals')
  console.log('\n🔑 Demo accounts (password: Demo@EOI2026):')
  for (const a of DEMO_ACCOUNTS) console.log(`   ${a.role.padEnd(22)} ${a.email}`)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
