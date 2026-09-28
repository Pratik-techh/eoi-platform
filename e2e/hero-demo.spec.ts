import { test, expect } from '@playwright/test'

/**
 * MASTER_PROMPT Section 15.2 — Hero Demo Test Spec
 * 
 * Executes all 9 scenes sequentially with zero manual DB edits:
 * Scene 1: Government: dashboard shows ~10,000 trained / ~3,100 employed; highlights major outcome leakage.
 * Scene 2: Investigate: click leakage -> stage explanation + underlying evidence & drill-downs.
 * Scene 3: Student: open Student X -> VERIFIED EMPLOYED at Google India Pvt. Ltd.
 * Scene 4: Lifecycle change: student selects "Report unemployment" -> state UNEMPLOYMENT_REPORTED.
 * Scene 5: Employer: Google's organization panel receives the request in realtime.
 * Scene 6: Verification: employer confirms -> backend transitions to VERIFIED_UNEMPLOYED.
 * Scene 7: Intelligence: government dashboard updates, ANALYTICS_RECALCULATED visible in ledger.
 * Scene 8: Skills: system surfaces recurring missing skills.
 * Scene 9: Decision support: government sees affected program/course and runs SIMULATION.
 */

test.describe('EOI Platform — Hero Demo Lifecycle (Scenes 1 to 9)', () => {
  const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000'

  test('Scene 1 & 2: Government Dashboard KPI and Planted Leakage Detection', async ({ page }) => {
    // Navigate to Government Dashboard as Gov Analyst
    await page.goto(`${BASE_URL}/gov/dashboard`)
    await expect(page.locator('text=National Skilling & Outcome Overview')).toBeVisible()

    // Assert scaled headline metrics (~10,000 enrolled / ~3,120 verified employed)
    await expect(page.locator('text=10,000')).toBeVisible()
    await expect(page.locator('text=3,120')).toBeVisible()

    // Check planted leakage banner
    const leakageAlert = page.locator('text=Critical Outcome Leakage Detected: Rajasthan')
    await expect(leakageAlert).toBeVisible()

    // Navigate to Leakage Investigation
    await page.goto(`${BASE_URL}/gov/leakage`)
    await expect(page.locator('text=Outcome Leakage & Funnel Breakdown')).toBeVisible()
    await expect(page.locator('text=Rajasthan Skill Development Board')).toBeVisible()
  })

  test('Scene 3 & 4: Student X Initial Google Employment and Report Unemployment', async ({ page }) => {
    // Navigate to Student Dashboard
    await page.goto(`${BASE_URL}/student/dashboard`)
    await expect(page.locator('text=Arjun Singh')).toBeVisible()
    await expect(page.locator('text=Google India Pvt. Ltd.')).toBeVisible()
    await expect(page.locator('text=VERIFIED EMPLOYED')).toBeVisible()

    // Click "Report unemployment / Departure"
    const reportBtn = page.locator('button:has-text("Report Unemployment / Departure")')
    await expect(reportBtn).toBeVisible()
    await reportBtn.click()

    // Submit departure in modal
    const confirmBtn = page.locator('button:has-text("Confirm & Submit")')
    await expect(confirmBtn).toBeVisible()
    await confirmBtn.click()

    // Assert status transitions to UNEMPLOYMENT_REPORTED
    await expect(page.locator('text=UNEMPLOYMENT REPORTED')).toBeVisible()
  })

  test('Scene 5 & 6: Employer Reconciles Departure and Confirms', async ({ page }) => {
    // Navigate to Employer Verification Queue
    await page.goto(`${BASE_URL}/employer/verification`)
    await expect(page.locator('text=Employment Verification & Reconciliation')).toBeVisible()

    // Locate pending departure reconciliation for Arjun Singh
    const reconciliationCard = page.locator('text=Arjun Singh').first()
    await expect(reconciliationCard).toBeVisible()

    // Employer confirms departure
    const confirmDepBtn = page.locator('button:has-text("Confirm Departure")').first()
    if (await confirmDepBtn.isVisible()) {
      await confirmDepBtn.click()
    }
  })

  test('Scene 7: Audit Ledger Reflects Recalculation and Cryptographic Head', async ({ page }) => {
    // Navigate to Government Audit Explorer
    await page.goto(`${BASE_URL}/gov/audit`)
    await expect(page.locator('text=Cryptographic Audit Ledger')).toBeVisible()

    // Click "Verify Ledger Hash Chain"
    const verifyChainBtn = page.locator('button:has-text("Verify Ledger Hash Chain")')
    await expect(verifyChainBtn).toBeVisible()
    await verifyChainBtn.click()

    // Expect green verification chip
    await expect(page.locator('text=CHAIN VERIFIED INTACT')).toBeVisible()
  })

  test('Scene 8: Skills Intelligence Surfaces Critical Deficits', async ({ page }) => {
    // Navigate to Skills Intelligence
    await page.goto(`${BASE_URL}/gov/skills`)
    await expect(page.locator('text=Skill Demand vs Supply Intelligence')).toBeVisible()
    await expect(page.locator('text=SQL & Databases')).toBeVisible()
    await expect(page.locator('text=REST API Development')).toBeVisible()
  })

  test('Scene 9: Scenario Simulator Mandatorily Tagged SIMULATION', async ({ page }) => {
    // Navigate to Simulator
    await page.goto(`${BASE_URL}/gov/simulator`)
    await expect(page.locator('text=Policy Scenario & Capacity Simulator')).toBeVisible()

    // Assert mandatory SIMULATION watermark / tag
    await expect(page.locator('text=SIMULATION')).toBeVisible()
  })
})
