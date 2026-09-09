import { expect, test } from '@playwright/test'

const journeyState = (page) => page.evaluate(() => JSON.parse(sessionStorage.getItem('ambitionbox-ceo-demov3-journey-v1')))

test('brand opening establishes AmbitionBox and hands off to the first-open hero', async ({ page }) => {
  await page.goto('/onboarding?step=brand&hold=1&preset=baseline')
  await expect(page.locator('.onboarding-splash .onboarding-brand[aria-label="AmbitionBox"]')).toBeVisible()
  await expect(page.getByText('Your search, in context.')).toHaveCount(0)

  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/onboarding?step=brand&preset=baseline')
  await expect(page.getByText('See the roles worth your time')).toBeVisible()
})

test('Naukri import shows a branded transfer and meaningful progress', async ({ page }) => {
  await page.goto('/onboarding?step=import&hold=1&preset=baseline')
  await expect(page.getByRole('heading', { name: 'Bringing your Naukri profile to AmbitionBox' })).toBeVisible()
  await expect(page.locator('.import-endpoint.naukri img')).toHaveAttribute('src', '/naukri-symbol.png')
  await expect(page.getByRole('progressbar', { name: 'Build profile, step 1 of 4' })).toBeVisible()
  await expect(page.locator('.onboarding-progress i')).toHaveCount(4)
  await expect(page.getByRole('button', { name: 'Close setup' })).toBeVisible()
  await expect(page.getByText('Import progress')).toBeVisible()
  await expect(page.getByText('Bringing your profile')).toBeVisible()
  await expect(page.getByText('Adding your résumé')).toBeVisible()
  await expect(page.getByText('Adding job preferences')).toBeVisible()
  await page.getByRole('button', { name: 'Close setup' }).click()
  await expect(page.getByText('See the roles worth your time')).toBeVisible()
})

test('first open turns a Naukri profile and Gmail into a prioritized Home', async ({ page }) => {
  await page.goto('/onboarding?step=welcome&preset=baseline')
  await expect(page.getByText('See the roles worth your time')).toBeVisible()

  await page.getByRole('button', { name: /Continue with Naukri/ }).click()
  await expect(page.getByRole('heading', { name: 'Bringing your Naukri profile to AmbitionBox' })).toBeVisible()
  await expect(page.getByRole('progressbar', { name: 'Build profile, step 1 of 4' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Review your profile.' })).toBeVisible()
  await expect(page.getByRole('progressbar', { name: 'Review profile, step 2 of 4' })).toBeVisible()
  const transferBrands = page.locator('.profile-transfer-brands img')
  await expect(transferBrands).toHaveCount(2)
  await expect(transferBrands.first()).toHaveAttribute('src', '/favicon.svg')
  await expect(transferBrands.last()).toHaveAttribute('src', '/naukri-symbol.png')
  await expect(page.locator('.profile-detail-toggle')).toHaveCount(7)
  await expect(page.getByText('Your profile, autofilled in seconds')).toBeVisible()
  await expect(page.getByText(/it powers better matches, gap checks, and guidance tailored to you/)).toBeVisible()
  await expect(page.getByText('Senior Backend Engineer at Razorpay')).toBeVisible()
  await expect(page.getByText(/Backend engineer with 6 years of experience building reliable payment systems/)).toHaveCount(0)
  await page.getByRole('button', { name: /Profile summary Senior Backend Engineer/ }).click()
  await expect(page.getByText(/Backend engineer with 6 years of experience building reliable payment systems/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Edit profile summary' })).toBeVisible()
  await page.getByRole('button', { name: /Profile summary Senior Backend Engineer/ }).click()

  await expect(page.getByRole('button', { name: 'Add notice period' })).toBeVisible()
  await page.getByRole('button', { name: 'Add notice period' }).click()
  await expect(page.getByRole('dialog', { name: 'Edit Professional details' })).toBeVisible()
  await page.getByRole('textbox', { name: 'Notice period', exact: true }).fill('30 days')
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.getByRole('button', { name: 'Add notice period' })).toHaveCount(0)

  await page.getByRole('button', { name: /Experience 2 roles across 6 years/ }).click()
  await expect(page.getByText('Backend Engineer', { exact: true })).toBeVisible()
  await expect(page.getByText('Paytm', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Edit experience' }).click()
  await expect(page.getByRole('dialog', { name: 'Edit Experience' })).toBeVisible()
  await page.getByRole('button', { name: 'Save changes' }).click()

  await page.getByRole('button', { name: 'Confirm profile' }).click()
  await expect(page.getByRole('heading', { name: /make sure the right jobs rise first/ })).toBeVisible()
  await expect(page.getByRole('progressbar', { name: 'Job preferences, step 3 of 4' })).toBeVisible()
  await expect(page.getByText('Your job preferences from Naukri')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Add Tech stacks, Not added' })).toBeVisible()
  await page.getByRole('button', { name: 'Add Tech stacks, Not added' }).click()
  await expect(page.getByRole('dialog', { name: 'Add Tech stacks' })).toBeVisible()
  await page.getByRole('button', { name: 'Java' }).click()
  await page.getByRole('button', { name: 'Kafka' }).click()
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.getByRole('button', { name: 'Edit Tech stacks, Java · Kafka' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Edit Minimum compensation, ₹22L+' })).toBeVisible()
  await page.getByRole('button', { name: 'Edit Minimum compensation, ₹22L+' }).click()
  await expect(page.getByRole('dialog', { name: 'Edit Minimum compensation' })).toBeVisible()
  await page.getByRole('textbox', { name: 'Minimum compensation' }).fill('₹24L+')
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.getByRole('button', { name: 'Edit Minimum compensation, ₹24L+' })).toBeVisible()
  await page.getByRole('button', { name: 'Confirm preferences' }).click()

  await expect(page.getByRole('heading', { name: "Connect your inbox. We'll take it from there." })).toBeVisible()
  await expect(page.getByRole('progressbar', { name: 'Application tracking, step 4 of 4' })).toBeVisible()
  await expect(page.getByText('Application tracking across every source')).toBeVisible()
  await expect(page.getByText('Negotiation guidance when it counts')).toBeVisible()
  await expect(page.getByText('Offer analysis with verified pay data')).toBeVisible()
  await expect(page.getByText(/Read-only access/)).toBeVisible()
  await page.getByRole('button', { name: 'Connect Gmail' }).click()
  await expect(page.getByRole('dialog', { name: 'Connect Gmail' })).toBeVisible()
  await page.getByRole('button', { name: /Arjun Mehta/ }).click()
  await expect(page.getByRole('heading', { name: 'Putting your search together...' })).toBeVisible()
  await expect(page.getByText('Looking for roles across all job boards')).toBeVisible()

  await expect(page).toHaveURL(/\/home\?arrival=first$/, { timeout: 8000 })
  await expect(page.getByRole('heading', { name: 'Good morning, Arjun.' })).toBeVisible()
  // The live-email row was removed from Home on 2026-08-19 (Tracker owns the organised
  // count). The handoff is still proved here: the greeting counts what arrived, and the
  // inbox-derived recruiter moment leads the sequence.
  await expect(page.getByText(/4 things need you/)).toBeVisible()
  await expect(page.getByText('PhonePe')).toBeVisible()
  await expect(page.getByText('Detected in Gmail.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Review reply' })).toBeVisible()
  await expect(page.getByRole('button', { name: /Ask AmbitionBox about your next move/ })).toBeVisible()
  await expect.poll(async () => journeyState(page)).toMatchObject({
    authProvider: 'naukri',
    profileSource: 'naukri',
    onboardingProfileConfirmed: true,
    onboardingPreferencesConfirmed: true,
    onboardingComplete: true,
    firstHomeArrival: true,
    emailConnected: true,
    importComplete: true,
    emailSkipped: false,
  })
})

test('parked job curation remains query-addressable and resolves to the unified email screen', async ({ page }) => {
  await page.goto('/onboarding?step=curation&hold=1&preset=baseline')
  await expect(page.getByRole('heading', { name: 'Curating jobs worth your time.' })).toBeVisible()
  await expect(page.getByText('Across Naukri, iimjobs, Hirist, and company career pages.')).toBeVisible()
  await expect(page.locator('.job-curation-screen > header')).toHaveCount(0)
  await expect(page.getByText('Your preferences are set')).toHaveCount(0)
  await expect(page.locator('.job-curation-progress')).toHaveCount(0)
  await expect(page.getByText('Demo simulation · no external job source is contacted')).toHaveCount(0)
  const orbitBefore = await page.locator('.job-curation-orbit').evaluate((node) => getComputedStyle(node).transform)
  await page.waitForTimeout(220)
  const orbitAfter = await page.locator('.job-curation-orbit').evaluate((node) => getComputedStyle(node).transform)
  expect(orbitAfter).not.toBe(orbitBefore)
  await page.waitForTimeout(2300)
  await expect(page.getByRole('heading', { name: 'Curating jobs worth your time.' })).toBeVisible()
  await expect(page).toHaveURL(/step=curation/)

  await page.goto('/onboarding?step=curation&preset=baseline')
  await expect(page.getByRole('heading', { name: 'Curating jobs worth your time.' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Checking what actually fits you.' })).toBeVisible({ timeout: 3500 })
  await expect(page.getByRole('heading', { name: 'Bringing your strongest matches together.' })).toBeVisible({ timeout: 3500 })
  await expect(page.getByRole('heading', { name: "Connect your inbox. We'll take it from there." })).toBeVisible({ timeout: 3500 })
  await expect(page.getByRole('button', { name: 'Connect Gmail' })).toBeVisible()

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/onboarding?step=curation&preset=baseline')
  await expect(page.getByText(/matched against the preferences you just reviewed/)).toBeVisible()
  await expect(page.getByRole('heading', { name: "Connect your inbox. We'll take it from there." })).toBeVisible({ timeout: 5000 })
})

test('Google login supports a conversational profile and editable review', async ({ page }) => {
  await page.goto('/onboarding?step=welcome&preset=baseline')
  await page.getByRole('button', { name: 'Continue with Google' }).click()
  await expect(page.getByRole('heading', { name: 'Better guidance starts with your real career context.' })).toBeVisible()
  await expect(page.getByRole('progressbar')).toHaveCount(0)
  await expect(page.getByText('Choose a starting point')).toBeVisible()
  await page.getByRole('button', { name: /Answer a few questions/ }).click()

  await expect(page.getByRole('heading', { name: 'What do you do today?' })).toBeVisible()
  await expect(page.getByRole('progressbar', { name: 'Current role, step 1 of 8' })).toBeVisible()
  await expect(page.locator('.onboarding-progress i')).toHaveCount(8)
  await page.getByRole('button', { name: /Continue/ }).click()
  await expect(page.getByRole('progressbar', { name: 'Experience, step 2 of 8' })).toBeVisible()
  await page.getByRole('button', { name: '6 years' }).click()
  await page.getByRole('button', { name: /Continue/ }).click()
  await page.getByRole('button', { name: /Continue/ }).click()
  await page.getByRole('button', { name: /Continue/ }).click()
  await page.getByRole('button', { name: 'Review my profile' }).click()

  await expect(page.getByText('Confirmed by you')).toBeVisible()
  await expect(page.getByRole('progressbar', { name: 'Review profile, step 6 of 8' })).toBeVisible()
  await page.getByRole('button', { name: 'Edit current role' }).click()
  await expect(page.getByRole('dialog', { name: 'Edit Role and company' })).toBeVisible()
  await page.getByRole('button', { name: 'Save changes' }).click()
  await page.getByRole('button', { name: 'Review job preferences' }).click()
  await expect(page.getByRole('progressbar', { name: 'Job preferences, step 7 of 8' })).toBeVisible()
  await page.getByRole('button', { name: 'Confirm and continue' }).click()
  await expect(page.getByRole('heading', { name: "Connect your inbox. We'll take it from there." })).toBeVisible()
  await expect(page.getByRole('progressbar', { name: 'Application tracking, step 8 of 8' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Skip' })).toBeVisible()
})

test('email pitch and provider decision are unified and preserve the skip path', async ({ page }) => {
  await page.goto('/onboarding?step=email-pitch&preset=baseline')
  await expect(page.getByRole('heading', { name: "Connect your inbox. We'll take it from there." })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Connect Gmail' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Connect another email' })).toBeVisible()
  await expect(page.getByText(/Read-only access/)).toBeVisible()
  await page.getByRole('button', { name: 'Go back' }).click()
  await expect(page.getByRole('heading', { name: /make sure the right jobs rise first/ })).toBeVisible()
  await page.goto('/onboarding?step=email&preset=baseline')
  await page.getByRole('button', { name: 'Skip' }).click()
  await expect(page).toHaveURL(/\/home\?arrival=first$/)
  await expect.poll(async () => journeyState(page)).toMatchObject({
    emailConnected: false,
    importComplete: false,
    emailSkipped: true,
  })
})

test('email skip opens a useful profile-only Home and does not reopen a modal', async ({ page }) => {
  await page.goto('/onboarding?step=email&preset=baseline')
  await page.getByRole('button', { name: 'Skip' }).click()
  await expect(page).toHaveURL(/\/home\?arrival=first$/)
  await expect(page.getByRole('heading', { name: 'Good morning, Arjun.' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Know what needs you—before an opportunity goes cold.' })).toBeVisible()
  await expect(page.getByRole('button', { name: /Zeta.*86% Preference Match/ })).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect.poll(async () => journeyState(page)).toMatchObject({
    onboardingComplete: true,
    firstHomeArrival: true,
    emailConnected: false,
    importComplete: false,
    emailSkipped: true,
  })
})

test('Home assistant is contextual and names evidence limits', async ({ page }) => {
  await page.goto('/home?preset=tracker')
  // The suggested-question chips were removed from the dock on 2026-08-19, so the test
  // types the question instead of tapping a shortcut to it. Same question, same answer —
  // it is now asked through the composer, which is the path that actually remains.
  await page.getByRole('button', { name: /Ask AmbitionBox about your next move/ }).click()
  const sheet = page.getByRole('dialog', { name: 'Ask AmbitionBox' })
  await expect(sheet).toBeVisible()
  await sheet.getByRole('textbox', { name: 'Ask AmbitionBox' }).fill('How ready am I for my next interview?')
  await sheet.getByRole('button', { name: 'Send question' }).click()
  await expect(page.getByText('I do not have an interview invitation yet.')).toBeVisible()
  await expect(page.getByText('Nothing is sent or changed automatically.')).toBeVisible()
})

test('old education links resolve to the single first-open hero', async ({ page }) => {
  await page.goto('/onboarding?step=education&panel=reality&preset=baseline')
  await expect(page.getByText('See the roles worth your time')).toBeVisible()
  await expect(page.getByText('Arjun Mehta')).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Choose how AmbitionBox helps' })).toHaveCount(0)
})

test('Apple can use the deterministic résumé path and another email can be closed safely', async ({ page }) => {
  await page.goto('/onboarding?step=welcome&preset=baseline')
  await page.getByRole('button', { name: 'Continue with Apple' }).click()
  await expect(page.getByText('Signed in with Apple.')).toBeVisible()
  await page.getByRole('button', { name: /Use my résumé/ }).click()
  await expect(page.getByRole('heading', { name: 'Building your profile from your résumé' })).toBeVisible()
  await expect(page.getByRole('heading', { name: /the profile we.ll start with/ })).toBeVisible()
  await page.goto('/onboarding?step=email&preset=baseline')
  await page.getByRole('button', { name: 'Connect another email' }).click()
  await expect(page.getByRole('dialog', { name: 'Connect another email' })).toBeVisible()
  await expect(page.getByRole('button', { name: /Continue with Outlook/ })).toBeVisible()
  await page.getByRole('button', { name: 'Close' }).click()
  await expect(page.getByRole('heading', { name: "Connect your inbox. We'll take it from there." })).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.getByRole('button', { name: 'Connect another email' }).click()
  await page.getByRole('button', { name: /Continue with Outlook/ }).click()
  await expect(page.getByRole('heading', { name: 'Putting your search together...' })).toBeVisible()
})

test('single first-open hero establishes the promise and detected Naukri profile', async ({ page }) => {
  await page.goto('/onboarding?step=welcome&preset=baseline')
  await expect(page.locator('.first-open-screen .onboarding-brand[aria-label="AmbitionBox"]')).toBeVisible()
  await expect(page.getByText('See the roles worth your time')).toBeVisible()
  await expect(page.getByText('Know the pay, culture, and reality inside')).toBeVisible()
  await expect(page.getByText('Get guidance from résumé to negotiation')).toBeVisible()
  await expect(page.locator('.first-open-hero li')).toHaveCount(3)
  await expect(page.locator('.first-open-flow-line')).toBeVisible()
  await expect(page.getByText('Arjun Mehta')).toBeVisible()
  await expect(page.getByText('arjun.mehta@gmail.com')).toBeVisible()
  await expect(page.getByText(/Autofill your profile, résumé, and preferences/)).toBeVisible()
})

test('single first-open hero makes Naukri primary and keeps Google and Apple visible', async ({ page }) => {
  await page.goto('/onboarding?step=welcome&preset=baseline')
  await expect(page.getByText(/Autofill your profile, résumé, and preferences/)).toBeVisible()
  await expect(page.getByRole('button', { name: /Continue with Naukri/ })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Continue with Apple' })).toBeVisible()
})

test('completed users bypass bare onboarding while stable step links remain inspectable', async ({ page }) => {
  await page.goto('/home?preset=tracker')
  await page.evaluate(() => {
    const key = 'ambitionbox-ceo-demov3-journey-v1'
    const state = JSON.parse(sessionStorage.getItem(key))
    sessionStorage.setItem(key, JSON.stringify({ ...state, onboardingComplete: true }))
  })
  await page.goto('/onboarding')
  await expect(page).toHaveURL(/\/home$/)
  await expect(page.getByRole('heading', { name: 'Good morning, Arjun.' })).toBeVisible()

  await page.goto('/onboarding?step=welcome')
  await expect(page.getByText('See the roles worth your time')).toBeVisible()
})

test('setting every card aside leaves the greeting agreeing with the rail', async ({ page }) => {
  // Regression: the dismissed list used to live inside the carousel, so the greeting
  // never heard about it and the all-clear state read "3 things need a look" directly
  // above an empty rail. The count now comes from the same list the carousel renders.
  //
  // The suite runs with reduced motion, which is the path where a set-aside card is
  // removed immediately rather than fading first.
  await page.goto('/home?preset=offer')
  await expect(page.getByText(/3 things need a look/)).toBeVisible()

  for (let remaining = 3; remaining > 0; remaining -= 1) {
    await page.locator('.action-card').first().locator('.action-card-dismiss').click()
    await page.getByRole('menuitem', { name: 'Ignore' }).first().click()
    await expect(page.locator('.action-card')).toHaveCount(remaining - 1)
  }

  await expect(page.getByText(/nothing is waiting on you right now/)).toBeVisible()
  // The greeting owns the only count on Home, so nothing restates it underneath.
  await expect(page.locator('.action-carousel')).toHaveCount(0)
})

test('the review ask appears only on a calm day, last, and is never counted', async ({ page }) => {
  // A calm day has nothing dated on it. Application updates do not disqualify one —
  // those run on someone else's clock.
  await page.goto('/home?preset=resume')
  const cards = page.locator('.action-card')
  await expect(cards.last()).toHaveClass(/action-card--contribute/)

  // The greeting counts what needs the user. The ask is not one of those things, so the
  // count is one lower than the number of cards on screen.
  await expect(page.getByText(/3 things need a look/)).toBeVisible()
  await expect(cards).toHaveCount(4)

  // It goes somewhere that exists, and that somewhere is honest about not submitting.
  await page.getByRole('button', { name: /Rate working at Razorpay/ }).click()
  const sheet = page.getByRole('dialog', { name: 'Rate working at Razorpay' })
  await expect(sheet).toBeVisible()
  await expect(sheet.getByText(/isn’t wired up in this prototype/)).toBeVisible()
  await sheet.getByRole('button', { name: 'Got it' }).click()

  // A booked round is a dated day, so the ask stays away.
  await page.goto('/home?preset=interview')
  await expect(page.locator('.action-card--contribute')).toHaveCount(0)
})

test('the post-interview card names the interview and asks for the outcome first', async ({ page }) => {
  await page.goto('/home?preset=postinterview')
  // A day of the week is not an interview. The card names the company, the role and the
  // round, because this screen can hold more than one.
  await expect(page.getByRole('heading', { name: 'How did your Juspay interview go?' })).toBeVisible()
  await expect(page.getByText('Senior Backend Engineer · Round 1 of 4')).toBeVisible()

  await page.getByRole('button', { name: /Tell AmbitionBox how it went/ }).click()
  const sheet = page.getByRole('dialog', { name: 'How the Juspay interview went' })
  await expect(sheet).toBeVisible()

  // The contribution is never the price of entry: the questions only appear once the
  // outcome — the part that serves the user — has been answered.
  await expect(sheet.getByText('What did they actually ask?')).toHaveCount(0)
  await sheet.getByRole('button', { name: 'Hard to read' }).click()
  await expect(sheet.getByText('What did they actually ask?')).toBeVisible()
  await expect(sheet.getByText(/isn’t wired up in this prototype/)).toBeVisible()

  // Logging it clears the card.
  await sheet.getByRole('button', { name: /Save how it went/ }).click()
  await expect(page.getByRole('heading', { name: 'How did your Juspay interview go?' })).toHaveCount(0)
})
