import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const baseURL = process.env.DEMO_URL || 'http://127.0.0.1:4175'
const output = new URL('../output/playwright/', import.meta.url)
const states = [
  ['launcher', '/demo?preset=post_import'],
  ['today-active', '/today?preset=post_import'],
  ['applications', '/applications?preset=post_import'],
  ['profile-memory', '/profile?preset=post_import'],
  ['followup-review', '/applications/juspay?preset=followup'],
  ['followup-sent', '/applications/juspay?stage=followup_sent'],
  ['recruiter-question', '/applications/juspay?preset=question'],
  ['honest-reply-sent', '/applications/juspay?stage=reply_sent'],
  ['interview-plan', '/applications/juspay?preset=interview'],
  ['interview-practice', '/applications/juspay?preset=interview&view=practice'],
  ['offer-decision', '/applications/juspay?preset=offer'],
  ['offer-negotiation', '/applications/juspay?preset=offer&view=negotiate'],
  ['finale', '/applications/juspay?preset=finale'],
]

await mkdir(output, { recursive: true })
const browser = await chromium.launch()
for (const width of [360, 390, 430]) {
  const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: 'reduce', deviceScaleFactor: 1 })
  const page = await context.newPage()
  for (const [name, path] of states) {
    await page.goto(`${baseURL}${path}`, { waitUntil: 'networkidle' })
    await page.screenshot({ path: fileURLToPath(new URL(`${name}-${width}.png`, output)), fullPage: true })
  }
  await context.close()
}
await browser.close()
console.log(`Captured ${states.length * 3} deterministic screenshots in output/playwright/`)
