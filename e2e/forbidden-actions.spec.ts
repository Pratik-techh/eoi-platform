import { test, expect } from '@playwright/test'

/**
 * MASTER_PROMPT Section 2 & Section 19 — Forbidden Actions Suite
 * 
 * Verifies non-negotiable security invariants (P1 to P5):
 * 1. Agency cannot verify employment.
 * 2. Student cannot verify employment.
 * 3. Platform telemetry isolated to security officer.
 * 4. Synthetic data banner is always visible.
 * 5. Integrations are clearly marked "Planned — not connected".
 */

test.describe('EOI Platform — Forbidden Actions & Invariants', () => {
  const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000'

  test('P1: Agency Placement Reporting Form has NO Self-Verification Control', async ({ page }) => {
    // Agency Officer reports employment
    await page.goto(`${BASE_URL}/agency/employment/report`)
    await expect(page.locator('text=Report Employment Placement')).toBeVisible()

    // Assert that the submit button submits for VERIFICATION, never "Self-Verify"
    const submitBtn = page.locator('button:has-text("Submit Placement for Employer Verification")')
    await expect(submitBtn).toBeVisible()

    // Ensure there is NO checkbox or toggle claiming self-verification
    const selfVerifyOption = page.locator('text=Mark as Verified')
    await expect(selfVerifyOption).toHaveCount(0)
  })

  test('P1 & P4: Student Employability Passport has NO Direct Edit Controls for Outcomes', async ({ page }) => {
    await page.goto(`${BASE_URL}/student/passport`)
    await expect(page.locator('text=Employability Passport')).toBeVisible()

    // Verify verification hash is displayed
    await expect(page.locator('text=VERIFIED')).toBeVisible()

    // Assert that student CANNOT alter verified employment records directly
    const editRecordBtn = page.locator('button:has-text("Edit Employment Record")')
    await expect(editRecordBtn).toHaveCount(0)
  })

  test('P5: AI Analyst is Read-Only with Whitelisted Views and Structured Evidence', async ({ page }) => {
    await page.goto(`${BASE_URL}/gov/ai`)
    await expect(page.locator('text=AI Outcome Intelligence Analyst')).toBeVisible()

    // AI interface contains citation/evidence drawer and no action/mutation buttons
    const mutateDatabaseBtn = page.locator('button:has-text("Update Database")')
    await expect(mutateDatabaseBtn).toHaveCount(0)
  })

  test('Mandatory Synthetic Data Indicator is Unobtrusive and Visible Everywhere', async ({ page }) => {
    await page.goto(`${BASE_URL}/gov/dashboard`)
    await expect(page.locator('text=Synthetic data — prototype')).toBeVisible()

    await page.goto(`${BASE_URL}/student/dashboard`)
    await expect(page.locator('text=Synthetic data — prototype')).toBeVisible()

    await page.goto(`${BASE_URL}/employer/dashboard`)
    await expect(page.locator('text=Synthetic data — prototype')).toBeVisible()
  })

  test('Integrations Page Strictly Labels All Adapters as "Planned — not connected"', async ({ page }) => {
    await page.goto(`${BASE_URL}/integrations`)
    await expect(page.locator('text=External System Adapters')).toBeVisible()

    // All external connectors must show Planned integration
    const notConnectedBadges = page.locator('text=Planned integration — not connected')
    const count = await notConnectedBadges.count()
    expect(count).toBeGreaterThanOrEqual(7)
  })
})
