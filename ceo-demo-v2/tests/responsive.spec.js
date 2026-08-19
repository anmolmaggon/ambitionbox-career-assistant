import { expect, test } from '@playwright/test'

const states = [
  ['/demo?preset=post_import', 'Five moments, one application.'],
  ['/today?preset=post_import', 'While you were away, your job search kept moving.'],
  ['/applications?preset=post_import', 'Every thread,'],
  ['/profile?preset=post_import', 'Built once. Used everywhere.'],
  ['/applications/juspay?preset=followup', 'The chasing is already handled.'],
  ['/applications/juspay?preset=question', 'Only one thing needs you.'],
  ['/applications/juspay?preset=interview', 'Your interview prep'],
  ['/applications/juspay?preset=interview&view=practice', 'Design an idempotent payment callback service.'],
  ['/applications/juspay?preset=offer', 'You got the offer, Arjun.'],
  ['/applications/juspay?preset=offer&view=negotiate', 'Ask for ₹30L'],
  ['/applications/juspay?preset=finale', 'Negotiation sent.'],
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
