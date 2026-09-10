import { expect, test } from '@playwright/test'

const states = [
  ['/demo?preset=baseline', 'Jump to a chapter'],
  ['/onboarding?step=brand&hold=1&preset=baseline', 'AmbitionBox'],
  ['/onboarding?step=welcome&preset=baseline', 'See the roles worth your time'],
  ['/onboarding?step=import&hold=1&preset=baseline', 'Bringing your Naukri profile'],
  ['/onboarding?step=profile-start&branch=google&preset=baseline', 'Better guidance starts'],
  ['/onboarding?step=manual&branch=google&preset=baseline', 'What do you do today'],
  ['/onboarding?step=profile-review&preset=baseline', 'Review your profile'],
  ['/onboarding?step=preferences&preset=baseline', 'make sure the right jobs rise first'],
  ['/onboarding?step=curation&hold=1&preset=baseline', 'Curating jobs worth your time'],
  ['/onboarding?step=email&preset=baseline', 'take it from there'],
  ['/onboarding?step=scan&hold=1&preset=tracker', 'Putting your search together...'],
  ['/profile?preset=tracker', 'What North knows'],
  ['/tracker?preset=baseline', 'Every application. One smart Tracker.'],
  ['/home?preset=tracker', 'Good morning, Arjun.'],
  // The Jobs intro block was removed on 2026-08-19; the feed's own control anchors it now.
  ['/matches?preset=matches', 'Sort jobs by'],
  ['/jobs/juspay?preset=readiness', 'Senior Backend Engineer'],
  ['/assistant/juspay?preset=resume&stage=resume', 'Profile Readiness is now 14/15.'],
  ['/prep/juspay?preset=interview&stage=invite&round=open', 'Juspay wants to interview you.'],
  ['/prep/juspay?preset=interview&stage=briefing', 'walking into'],
  ['/prep/juspay?preset=interview&stage=answers&java=open', 'Most of this, you already have.'],
  ['/prep/juspay?preset=interview&stage=practice', 'worst incident you were responsible for'],
  ['/prep/juspay?preset=interview&stage=coaching', 'Strong foundation'],
  ['/prep/juspay?preset=offer&stage=ready', 'PREP COMPLETE'],
  ['/home?preset=interview', 'INTERVIEW BOOKED'],
  ['/home?preset=interview&action=add-interview', 'Add an interview yourself.'],
  ['/tracker?preset=interview', 'Prepare for interview'],
  ['/offer/juspay?preset=offer&stage=notification&story=opening', 'Tap the notification to open'],
  ['/offer/juspay?preset=offer&stage=reveal&moment=celebration&story=finale', 'You got the offer.'],
  ['/offer/juspay?preset=offer&stage=decision&story=finale', 'What employees say about working at Juspay'],
  ['/offer/juspay?preset=offer&stage=employee&status=responded&story=finale', 'Verified Juspay employee'],
  ['/offer/juspay?preset=offer&stage=negotiation&story=finale', 'Ask confidently'],
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
