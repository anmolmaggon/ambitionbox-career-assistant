import { expect, test } from '@playwright/test'

const states = [
  ['/demo?preset=baseline', 'Jump to a chapter'],
  ['/tracker?preset=baseline', 'Your job search is probably already in your inbox.'],
  ['/home?preset=tracker', 'Good morning, Arjun.'],
  ['/matches?preset=matches', 'The roles worth your time.'],
  ['/jobs/juspay?preset=readiness', 'Senior Backend Engineer'],
  ['/assistant/juspay?preset=resume&stage=resume', 'Profile Readiness is now 14/15.'],
  ['/prep/juspay?preset=interview&stage=plan', 'One focused hour to feel ready.'],
  ['/offer/juspay?preset=offer', 'You got the offer, Arjun.'],
  ['/offer/juspay?preset=offer&stage=details', 'What ₹28L contains'],
]

for (const width of [360, 390, 430]) {
  test.describe(`${width}px mobile QA`, () => {
    test.use({ viewport: { width, height: 844 } })
    for (const [path, text] of states) {
      test(`${path} has no horizontal overflow`, async ({ page }) => {
        await page.goto(path)
        await expect(page.getByText(text, { exact: false }).first()).toBeVisible()
        const sizes = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth }))
        expect(sizes.document).toBeLessThanOrEqual(sizes.viewport)
      })
    }
  })
}
