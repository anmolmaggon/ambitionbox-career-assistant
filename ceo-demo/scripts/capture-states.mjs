import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const baseURL = process.env.DEMO_URL || 'http://127.0.0.1:4173'
const output = new URL('../output/playwright/', import.meta.url)
const states = [
  ['launcher', '/demo?preset=baseline'],
  ['tracker-empty', '/tracker?preset=baseline'],
  ['gmail-trust', '/tracker?preset=baseline&flow=gmail'],
  ['tracker-populated', '/tracker?preset=tracker'],
  ['home-priority', '/home?preset=tracker'],
  ['home-reranked', '/home?preset=matches'],
  ['matches-ranked', '/matches?preset=matches'],
  ['job-readiness', '/jobs/juspay?preset=readiness'],
  ['evidence-insight', '/assistant/juspay?preset=readiness&stage=insight'],
  ['resume-ready', '/assistant/juspay?preset=resume&stage=resume'],
  ['interview-plan', '/prep/juspay?preset=interview&stage=plan'],
  ['interview-practice', '/prep/juspay?preset=interview&stage=practice'],
  ['interview-coaching', '/prep/juspay?preset=interview&stage=coaching'],
  ['offer-reveal', '/offer/juspay?preset=offer'],
  ['offer-decision', '/offer/juspay?preset=offer&stage=details'],
]

await mkdir(output, { recursive: true })
const browser = await chromium.launch()
for (const width of [360, 390, 430]) {
  const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: 'reduce', deviceScaleFactor: 1 })
  const page = await context.newPage()
  for (const [name, path] of states) {
    await page.goto(`${baseURL}${path}`, { waitUntil: 'networkidle' })
    await page.screenshot({ path: fileURLToPath(new URL(`${name}-${width}.png`, output)) })
  }
  await context.close()
}
await browser.close()
console.log(`Captured ${states.length * 3} deterministic screenshots in output/playwright/`)
