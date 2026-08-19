import { expect, test } from '@playwright/test'

test('the invitation shows only what a real invite contains, and names what it omits', async ({ page }) => {
  await page.goto('/prep/juspay?preset=interview&stage=invite&round=open')
  await expect(page.getByRole('heading', { name: 'Juspay wants to interview you.' })).toBeVisible()
  await expect(page.getByText('Interview · Senior Backend Engineer')).toBeVisible()
  await expect(page.getByText('That’s the entire email.')).toBeVisible()
  await expect(page.getByText('What this round covers').first()).toBeVisible()
  // The old build asserted a round type the invitation could not have contained.
  await expect(page.getByText('System Design Interview')).toHaveCount(0)
})

test('round type is inferred with its confidence, and confirmed by the candidate', async ({ page }) => {
  await page.goto('/prep/juspay?preset=interview&stage=invite&round=open')
  await expect(page.getByText('51 of 63 reports')).toBeVisible()
  await expect(page.getByText(/Still unknown/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Decode this interview' })).toBeDisabled()
  await page.getByRole('button', { name: 'I’m not sure' }).click()
  await expect(page.getByText(/We’ll prepare you for both/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Decode this interview' })).toBeEnabled()
})

test('the briefing separates what a candidate could find from what only AmbitionBox has', async ({ page }) => {
  await page.goto('/prep/juspay?preset=interview&stage=briefing')
  await expect(page.getByText('What you could find yourself')).toBeVisible()
  await expect(page.getByText('What only AmbitionBox knows')).toBeVisible()
  await expect(page.getByText('63 interview reports for this role and level')).toBeVisible()
  await expect(page.getByText(/deterministic demo figures/)).toBeVisible()
})

test('interviewer research stays inside the public and first-party boundary', async ({ page }) => {
  await page.goto('/prep/juspay?preset=interview&stage=briefing')
  await expect(page.getByText('Nikhil Rao')).toBeVisible()
  await expect(page.getByText('Engineering Manager · Payments Core')).toBeVisible()
  await expect(page.getByText('Publicly published').first()).toBeVisible()
  await expect(page.getByText(/never use anyone’s private profile or job-search activity/)).toBeVisible()
})

test('themes are ranked by report count and open anonymised excerpts', async ({ page }) => {
  await page.goto('/prep/juspay?preset=interview&stage=briefing')
  await expect(page.getByRole('button', { name: /Incident ownership/ })).toBeVisible()
  await page.getByRole('button', { name: /Incident ownership/ }).click()
  const sheet = page.getByRole('dialog', { name: /Incident ownership in interview reports/ })
  await expect(sheet).toBeVisible()
  await expect(sheet.getByText(/worst production issue/)).toBeVisible()
  await expect(sheet.getByText(/Anonymised and lightly paraphrased/)).toBeVisible()
})

test('the evidence stage maps confirmed answers onto this round and names the one gap', async ({ page }) => {
  await page.goto('/prep/juspay?preset=interview&stage=answers&java=open')
  await expect(page.getByText('Kafka-based payment callback retry service')).toBeVisible()
  await expect(page.getByText('31% fewer callback failures at peak volume')).toBeVisible()
  await expect(page.getByText('Confirmed by you in the evidence check').first()).toBeVisible()
  await expect(page.getByText('We won’t write a Java story for you.')).toBeVisible()
  // The honest-inference guard: on-call is not in Arjun's confirmed evidence.
  await expect(page.getByText(/It does not cover an on-call rotation/)).toBeVisible()
})

test('declining Java preserves the gap and carries to the job screen', async ({ page }) => {
  await page.goto('/prep/juspay?preset=interview&stage=answers&java=open')
  await page.getByRole('button', { name: 'Not quite' }).click()
  await expect(page.getByText('Kept at 14/15. The gap stays named.')).toBeVisible()
  await expect(page.getByText('How to answer it truthfully and still be credible')).toBeVisible()
  await page.goto('/jobs/juspay')
  await expect(page.getByText('14/15', { exact: true })).toBeVisible()
})

test('confirming Java honestly moves readiness to 15/15 across screens', async ({ page }) => {
  await page.goto('/prep/juspay?preset=interview&stage=answers&java=open')
  await page.getByRole('button', { name: 'Yes, I did' }).click()
  await expect(page.getByText('Confirmed. Profile Readiness is now 15/15.')).toBeVisible()
  await page.goto('/jobs/juspay')
  await expect(page.getByText('15/15', { exact: true })).toBeVisible()
})

test('coaching grades what was actually typed rather than praising anything', async ({ page }) => {
  await page.goto('/prep/juspay?preset=interview&stage=practice')
  await page.getByLabel('Your answer').fill('x')
  await page.getByRole('button', { name: 'Get coaching' }).click()
  await expect(page.getByText('Strong foundation')).toHaveCount(0)
  await expect(page.getByText('I can’t score that yet')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Mark practice complete' })).toBeDisabled()
})

test('a partial answer is named as partial, with the misses listed', async ({ page }) => {
  await page.goto('/prep/juspay?preset=interview&stage=practice')
  await page.getByLabel('Your answer').fill('We added an idempotency key and a retry with backoff.')
  await page.getByRole('button', { name: 'Get coaching' }).click()
  await expect(page.getByText('A start — not yet an answer')).toBeVisible()
  await expect(page.getByText(/You didn’t mention/)).toBeVisible()
  await expect(page.getByText('ADD THIS LINE')).toHaveCount(0)
})

test('a complete answer earns the improvement line, and the line is attributed', async ({ page }) => {
  await page.goto('/prep/juspay?preset=interview&stage=coaching')
  await expect(page.getByText('Strong foundation')).toBeVisible()
  await expect(page.getByText('ADD THIS LINE')).toBeVisible()
  await expect(page.getByText(/In 17 of the 51 reports/)).toBeVisible()
  await expect(page.getByText(/the 34 reports on incident ownership/)).toBeVisible()
  await expect(page.getByText('1 OF 3')).toHaveCount(0)
})

test('the ready state derives its metrics and arms the candidate with questions', async ({ page }) => {
  await page.goto('/prep/juspay?preset=offer&stage=ready')
  await expect(page.getByText('PREP COMPLETE')).toBeVisible()
  await expect(page.getByText('5/5')).toBeVisible()
  await expect(page.getByText('10m')).toHaveCount(0)
  await expect(page.getByText(/Who owns a payment incident at 2 AM/)).toBeVisible()
  // Regression guard for the questionsToVerify string -> object refactor.
  await expect(page.getByText(/Verifies: Manager expectations, workload, and growth path/)).toBeVisible()
})

test('the interview is visible on Home and Tracker without stealing the offer card', async ({ page }) => {
  await page.goto('/home?preset=interview')
  await expect(page.getByText('INTERVIEW SCHEDULED').first()).toBeVisible()
  await expect(page.getByText(/Round 1 of 4/)).toBeVisible()
  await page.goto('/tracker?preset=interview')
  await expect(page.getByText('See what to expect and start tailored prep')).toBeVisible()
  await expect(page.getByText('Tue 11:00')).toBeVisible()
  await page.goto('/home?preset=offer')
  await expect(page.getByRole('heading', { name: 'Your ₹28L offer is ready to understand.' })).toBeVisible()
})

test('adding an interview manually is reachable and honest about its limits', async ({ page }) => {
  // The page-level link was removed from Home on 2026-08-19 — it had become a lone link
  // floating under the carousel. The capability index inside the assistant sheet is now
  // the single entry point, so the test follows that path instead. Preset is `tracker`
  // because the capability routes to /prep once an interview already exists.
  await page.goto('/home?preset=tracker')
  await page.getByRole('button', { name: /Ask AmbitionBox about your next move/ }).click()
  await page.getByRole('button', { name: /Add or prepare an interview/ }).click()
  const sheet = page.getByRole('dialog', { name: 'Add an interview manually' })
  await expect(sheet).toBeVisible()
  await expect(sheet.getByText(/isn’t wired up in this prototype/)).toBeVisible()
  await sheet.getByRole('button', { name: 'Got it' }).click()
  await expect(sheet).toHaveCount(0)
})
