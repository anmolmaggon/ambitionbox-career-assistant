import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const baseURL = process.env.DEMO_URL || 'http://127.0.0.1:4273'
const output = new URL('../output/playwright/current/', import.meta.url)
const states = [
  ['launcher', '/demo?preset=baseline'],
  ['onboarding-brand', '/onboarding?step=brand&hold=1&preset=baseline'],
  ['onboarding-welcome', '/onboarding?step=welcome&preset=baseline'],
  ['onboarding-profile-start', '/onboarding?step=profile-start&branch=google&preset=baseline'],
  ['onboarding-naukri-import', '/onboarding?step=import&hold=1&branch=naukri&preset=baseline'],
  ['onboarding-resume-import', '/onboarding?step=resume-import&hold=1&branch=google&preset=baseline'],
  ['onboarding-manual', '/onboarding?step=manual&branch=google&preset=baseline'],
  ['onboarding-profile-review', '/onboarding?step=profile-review&preset=baseline'],
  ['onboarding-preferences', '/onboarding?step=preferences&preset=baseline'],
  ['onboarding-curation', '/onboarding?step=curation&hold=1&preset=baseline'],
  ['onboarding-email', '/onboarding?step=email&preset=baseline'],
  ['onboarding-gmail-account', '/onboarding?step=email&email=gmail&preset=baseline'],
  ['onboarding-other-email', '/onboarding?step=email&email=other&preset=baseline'],
  ['onboarding-scan', '/onboarding?step=scan&hold=1&preset=baseline'],
  ['onboarding-complete', '/onboarding?step=complete&preset=tracker'],
  ['tracker-empty', '/tracker?preset=baseline'],
  ['gmail-trust', '/tracker?preset=baseline&flow=gmail'],
  ['tracker-populated', '/tracker?preset=tracker'],
  ['home-priority', '/home?preset=tracker'],
  ['home-reranked', '/home?preset=matches'],
  ['matches-ranked', '/matches?preset=matches'],
  ['job-readiness', '/jobs/juspay?preset=readiness'],
  ['evidence-insight', '/assistant/juspay?preset=readiness&stage=insight'],
  ['resume-ready', '/assistant/juspay?preset=resume&stage=resume'],
  ['home-interview', '/home?preset=interview'],
  ['home-add-interview', '/home?preset=interview&action=add-interview'],
  ['tracker-interview', '/tracker?preset=interview'],
  ['interview-invite', '/prep/juspay?preset=interview&stage=invite&round=open'],
  ['interview-invite-confirmed', '/prep/juspay?preset=interview&stage=invite&round=confirmed'],
  ['interview-briefing', '/prep/juspay?preset=interview&stage=briefing'],
  ['interview-answers', '/prep/juspay?preset=interview&stage=answers&java=open'],
  ['interview-answers-gap', '/prep/juspay?preset=interview&stage=answers&java=no'],
  ['interview-practice', '/prep/juspay?preset=interview&stage=practice'],
  ['interview-coaching', '/prep/juspay?preset=interview&stage=coaching'],
  ['interview-ready', '/prep/juspay?preset=offer&stage=ready'],
  ['offer-notification', '/offer/juspay?preset=offer&stage=notification&story=opening'],
  ['offer-reveal', '/offer/juspay?preset=offer&stage=reveal&story=finale'],
  ['offer-decision', '/offer/juspay?preset=offer&stage=decision&story=finale'],
  ['offer-employee', '/offer/juspay?preset=offer&stage=employee&status=responded&story=finale'],
  ['offer-negotiation', '/offer/juspay?preset=offer&stage=negotiation&story=finale'],
]
const activeStates = process.env.CAPTURE_SCOPE === 'onboarding'
  ? states.filter(([name]) => name.startsWith('onboarding-'))
  : states

await mkdir(output, { recursive: true })
const browser = await chromium.launch()
for (const width of [360, 390, 430]) {
  const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: 'reduce', deviceScaleFactor: 1 })
  const page = await context.newPage()
  for (const [name, path] of activeStates) {
    await page.goto(`${baseURL}${path}`, { waitUntil: 'networkidle' })
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.screenshot({ path: fileURLToPath(new URL(`${name}-${width}.png`, output)), fullPage: ['offer-decision', 'interview-briefing', 'interview-answers', 'interview-ready'].includes(name) })
  }
  await context.close()
}
await browser.close()
console.log(`Captured ${activeStates.length * 3} deterministic screenshots in output/playwright/current/`)
