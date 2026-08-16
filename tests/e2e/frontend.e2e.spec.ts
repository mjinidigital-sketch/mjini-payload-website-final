import { test, expect, Page } from '@playwright/test'

test.describe('Frontend', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('can load homepage', async ({ page }) => {
    await page.goto('https://mjinidigital.co.ke')
    await expect(page).toHaveTitle(/Mjini Digital/)
    const heading = page.locator('h1').first()
    await expect(heading).toHaveText('Mjini Digital')
  })
})
