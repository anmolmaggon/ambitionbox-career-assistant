import { expect, test } from '@playwright/test'

test('Arjun’s golden path runs from empty tracker to reviewed offer', async ({ page }) => {
  await page.goto('/tracker?preset=baseline&flow=gmail')
  await expect(page.getByRole('heading', { name: 'Every application. One smart Tracker.' })).toBeVisible()
  await expect(page.getByText('Only job-search emails · Read only · Disconnect anytime')).toBeVisible()
  await page.getByRole('button', { name: 'Continue with Gmail' }).click()
  await expect(page.getByRole('dialog', { name: 'Connect Gmail' })).toBeVisible()
  await page.getByRole('button', { name: /Arjun Mehta/ }).click()
  await expect(page.getByText('Scanning the last 90 days')).toBeVisible()
  await page.getByRole('button', { name: 'Skip scan' }).click()
  await expect(page.getByRole('heading', { name: '15 applications found' })).toBeVisible()
  await page.getByRole('button', { name: 'See what needs your attention' }).click()
  await expect(page.getByRole('heading', { name: '15 applications', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: /Juspay Senior Backend Engineer — Prepare for interview/ })).toBeVisible()

  // The reply is a thread now rather than a sheet: North shows the message, names the one
  // thing it cannot know, and hands back a draft the user sends themselves.
  await page.getByRole('button', { name: /PhonePe Backend Engineer III — Reply to recruiter/ }).click()
  await expect(page.getByText('Can you confirm your availability for a quick conversation?')).toBeVisible()
  await page.getByRole('button', { name: '60 days', exact: true }).click()
  await expect(page.locator('.flow-draft-body')).toHaveValue(/notice period is 60 days/)
  await page.getByRole('button', { name: 'Copy and open Gmail' }).click()
  await page.getByRole('button', { name: 'Back to Home' }).click()
  await expect(page.getByText('BEST NEXT OPPORTUNITY')).toBeVisible()
  await expect(page.getByRole('heading', { name: /payments experience makes this unusually relevant/i })).toBeVisible()

  // The tab was relabelled Matches -> Jobs on 2026-08-19; the route is unchanged.
  await page.getByRole('link', { name: 'Jobs', exact: true }).click()
  await expect(page.getByText('From Naukri')).toHaveCount(0)
  // The full-bleed connect card was removed on 2026-08-20 so the tab stops restructuring
  // itself by journey state. Connecting a board now starts where boards are listed.
  await page.getByRole('button', { name: /job board.* connected/ }).click()
  await page.getByRole('dialog', { name: 'Job boards' }).getByRole('button', { name: 'Connect' }).first().click()
  await page.getByRole('button', { name: 'Connect in one tap' }).click()
  await page.getByRole('button', { name: 'Review and edit preferences' }).click()
  await page.getByLabel('Minimum target salary').fill('₹22L+')
  await page.getByRole('button', { name: 'Confirm preferences' }).click()
  await expect(page.getByRole('heading', { name: 'Your matches just got sharper' })).toBeVisible()
  await page.getByRole('button', { name: 'See ranked matches' }).click()
  // The sources strip became job boards only on 2026-08-19 — AmbitionBox is not a board
  // and recruiter email is an inbox, so neither is counted.
  await expect(page.getByText('2 job boards connected')).toBeVisible()
  // Applied roles left the jobs feed on 2026-08-19 — PhonePe is an application to track,
  // not a job to find, so its absence here is the contract now.
  await expect(page.getByText('PhonePe')).toHaveCount(0)

  await page.getByRole('heading', { name: 'Senior Backend Engineer' }).first().click()
  await expect(page.getByText('PREFERENCE MATCH')).toBeVisible()
  // Job detail was ported to the 1B design on 2026-08-19; it now spells the count out
  // and shows which requirements are which, so the locator follows the wording.
  await expect(page.getByText('10 of 15')).toBeVisible()
  // Job detail took 1B's dock on 2026-08-19: the assistant is the way forward from this
  // screen, so the chrome is the assistant rather than a generic primary button.
  await page.getByRole('button', { name: /Close gaps · tailor your résumé/ }).click()
  // The evidence step became 1B's four-question sequence on 2026-08-19: one requirement at
  // a time, each answer classified before anything is claimed.
  for (let i = 0; i < 4; i++) {
    await page.getByRole('button', { name: /Use Arjun’s demo answer/ }).click()
    await page.getByRole('button', { name: /Send answer/ }).click()
  }
  await expect(page.getByText('System-design ownership evidenced')).toBeVisible()
  await expect(page.getByText('Hands-on Kubernetes ownership evidenced')).toBeVisible()
  await page.getByRole('button', { name: 'Tailor my résumé for Juspay' }).click()
  await expect(page.getByText('RÉSUMÉ READY')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Profile Readiness is now 14/15.' })).toBeVisible()
  await page.getByRole('button', { name: 'Not quite' }).click()
  await expect(page.getByText(/résumé remains honest/i)).toBeVisible()
  await page.getByRole('button', { name: 'Return to job' }).click()
  await expect(page.getByText('14 of 15')).toBeVisible()

  await page.getByRole('button', { name: 'See my next move' }).click()
  await page.getByRole('button', { name: 'Jump ahead 3 days' }).click()
  await expect(page.getByText('INTERVIEW SCHEDULED').first()).toBeVisible()
  await page.getByRole('button', { name: 'See what to expect' }).click()
  await expect(page.getByRole('heading', { name: 'Juspay wants to interview you.' })).toBeVisible()
  await expect(page.getByText('That’s the entire email.')).toBeVisible()
  await page.getByRole('button', { name: 'That matches' }).click()
  await page.getByRole('button', { name: 'Decode this interview' }).click()
  await expect(page.getByRole('heading', { name: 'What you’re walking into.' })).toBeVisible()
  await expect(page.getByText('Most companies screen with coding first.')).toBeVisible()
  await page.getByRole('button', { name: 'Where my evidence stands' }).click()
  await expect(page.getByRole('heading', { name: 'Most of this, you already have.' })).toBeVisible()
  await expect(page.getByText('Kept at 14/15. The gap stays named.')).toBeVisible()
  await page.getByRole('button', { name: 'Practise the most likely question' }).click()
  await page.getByRole('button', { name: 'Use demo answer' }).click()
  await page.getByRole('button', { name: 'Get coaching' }).click()
  await expect(page.getByText('Strong foundation')).toBeVisible()
  await page.getByRole('button', { name: 'Mark practice complete' }).click()
  await expect(page.getByText('PREP COMPLETE')).toBeVisible()
  await expect(page.getByText('5/5')).toBeVisible()

  await page.getByRole('button', { name: 'Jump to offer day' }).click()
  await expect(page.getByRole('button', { name: /Open AmbitionBox notification about Juspay/ })).toBeVisible()
  await page.getByRole('button', { name: /Open AmbitionBox notification about Juspay/ }).click()
  await expect(page.getByRole('heading', { name: 'This is the moment you’ve been working towards.' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Congratulations, Arjun. You got the offer.' })).toBeVisible()
  await expect(page.getByText('₹28L', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Understand my offer' }).click()
  await expect(page.getByRole('heading', { name: 'Offer breakdown' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'What employees say about working at Juspay' })).toBeVisible()
  await page.getByRole('button', { name: 'Prepare my response' }).click()
  await expect(page.getByText('Not sent')).toBeVisible()
  await page.getByRole('button', { name: 'Copy reviewed response' }).click()
  await expect(page.getByRole('button', { name: /Copied—ready for review/ })).toBeVisible()
})

test('presenter reset returns the app to its first-run state', async ({ page }) => {
  await page.goto('/demo?preset=offer')
  await page.getByRole('button', { name: 'Reset all demo data' }).click()
  await expect(page.getByRole('button', { name: 'Demo reset' })).toBeVisible()
  await page.getByRole('button', { name: 'Start golden path' }).click()
  await expect(page.getByRole('button', { name: /Open AmbitionBox notification about Juspay/ })).toBeVisible()
})

test('tracker supports another email and manual application entry', async ({ page }) => {
  await page.goto('/tracker?preset=baseline')
  await page.getByRole('button', { name: 'Connect another email' }).click()
  await expect(page.getByRole('dialog', { name: 'Connect another email' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Continue with Outlook' })).toBeVisible()
  await page.getByRole('button', { name: 'Close' }).click()
  await page.getByRole('button', { name: 'Add an application' }).click()
  await page.getByLabel('Company').fill('Atlassian')
  await page.getByLabel('Role').fill('Senior Backend Engineer')
  await page.getByRole('button', { name: 'Add to Tracker' }).click()
  await expect(page.getByRole('heading', { name: '1 application' })).toBeVisible()
  await expect(page.getByText('Atlassian')).toBeVisible()
})

// Five stages, 15 applications. Ghosted cuts across the pipeline rather than following
// Offer, so it holds cards that fell quiet from Applied and from Interview alike.
const PIPELINE = ['5', '3', '0', '3', '4']

test('list and board render the same pipeline with the same counts', async ({ page }) => {
  await page.goto('/tracker?preset=tracker')
  expect(await page.locator('.stage-head__count').allInnerTexts()).toEqual(PIPELINE)
  const chips = (await page.locator('.stage-chips button').allInnerTexts()).map((text) => text.replace(/\s+/g, ' ').trim())
  expect(chips).toEqual([
    'All 15', 'Applied 5', 'Interview scheduled 3', 'Offer 0', 'Ghosted 3', 'Rejected 4',
  ])
  await page.getByRole('button', { name: 'Board' }).click()
  await expect(page.getByLabel('Application board')).toBeVisible()
  expect(await page.locator('.kanban-column > header strong').allInnerTexts()).toEqual(PIPELINE)
  await page.getByRole('button', { name: 'List' }).click()
  await expect(page.getByRole('heading', { name: 'From applied to offer' })).toBeVisible()
})

test('stage sections collapse, and Rejected starts closed', async ({ page }) => {
  await page.goto('/tracker?preset=tracker')
  // Rejected holds the finished applications and should not stand in the way on arrival.
  // Ghosted deliberately does not collapse — those are the ones most likely to be forgotten.
  await expect(page.locator('.application-card--closed')).toHaveCount(0)
  await page.locator('.stage-head', { hasText: 'Rejected' }).click()
  await expect(page.locator('.application-card--closed')).toHaveCount(4)
  await expect(page.getByText('Not selected after the final round')).toBeVisible()
  // A live stage collapses the other way.
  await page.locator('.stage-head', { hasText: 'Applied' }).click()
  await expect(page.getByRole('button', { name: 'Move Amazon SDE III to another stage' })).toHaveCount(0)
})

test('chips filter the list down to one stage', async ({ page }) => {
  await page.goto('/tracker?preset=tracker')
  await page.locator('.stage-chips button', { hasText: 'Ghosted' }).click()
  await expect(page.locator('.stage-group')).toHaveCount(1)
  await expect(page.locator('.application-card')).toHaveCount(3)
  await page.locator('.stage-chips button', { hasText: 'All' }).click()
  await expect(page.locator('.stage-group')).toHaveCount(5)
})

test('the pipeline leads with Applied, and names what has gone quiet', async ({ page }) => {
  await page.goto('/tracker?preset=tracker')
  const stages = await page.locator('.stage-head__title').allInnerTexts()
  expect(stages[0]).toBe('Applied')
  await expect(page.getByRole('heading', { name: '15 applications', exact: true })).toBeVisible()
  await expect(page.getByText('3 have gone quiet · North is watching them')).toBeVisible()
  await expect(page.getByText('Tracked from')).toBeVisible()
})

test('a ghosted card says which stage it fell from', async ({ page }) => {
  await page.goto('/tracker?preset=tracker')
  // Ghosting is not a step in the pipeline, so the card has to carry its own origin —
  // one fell silent after applying, the other after a round that already happened.
  await expect(page.getByText('Applied 52d ago · no reply')).toBeVisible()
  await expect(page.getByText('Interviewed 14d ago · no update')).toBeVisible()
})

test('every card says who moved it, and North’s moves can be undone', async ({ page }) => {
  await page.goto('/tracker?preset=tracker')
  // The Gmail promise, made visible. Without this line the claim lives only in the pitch.
  await expect(page.getByText('Recruiter reply detected').first()).toBeVisible()
  await expect(page.locator('.application-moved__undo').first()).toBeVisible()
  // A move the user made says so, and offers no undo — nothing rewrites it.
  await expect(page.locator('.application-moved--you').first()).toContainText('You moved this')
})

test('an application can be moved from one stage to another', async ({ page }) => {
  await page.goto('/tracker?preset=tracker')
  await page.getByRole('button', { name: 'Move Amazon SDE III to another stage' }).click()
  await expect(page.getByRole('dialog', { name: 'Move Amazon' })).toBeVisible()
  await page.locator('.stage-picker button', { hasText: 'Interview scheduled' }).click()
  await expect(page.getByText('Amazon moved to Interview scheduled.')).toBeVisible()
  // Applied loses one, Interview scheduled gains one, the total is untouched.
  expect(await page.locator('.stage-head__count').allInnerTexts()).toEqual(['4', '4', '0', '3', '4'])
})

test('tracker search finds anything in the pipeline, at any stage', async ({ page }) => {
  await page.goto('/tracker?preset=tracker')
  await page.getByLabel('Search applications').fill('flipkart')
  await expect(page.getByRole('heading', { name: '1 result for “flipkart”' })).toBeVisible()
  await expect(page.getByText('Lead Software Engineer')).toBeVisible()
  // A rejected application and a ghosted one are both reachable from the same field —
  // finding a half-remembered application should not depend on guessing its stage.
  await page.getByLabel('Search applications').fill('navi')
  await expect(page.getByRole('heading', { name: '1 result for “navi”' })).toBeVisible()
  await page.getByLabel('Search applications').fill('ola')
  await expect(page.getByRole('heading', { name: '1 result for “ola”' })).toBeVisible()
  await page.getByRole('button', { name: 'Clear search' }).click()
  await expect(page.getByRole('heading', { name: 'From applied to offer' })).toBeVisible()
})

test('tailored résumé downloads as a real PDF', async ({ page }) => {
  await page.goto('/assistant/juspay?preset=resume&stage=resume')
  const downloadReady = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download PDF' }).click()
  const download = await downloadReady
  expect(download.suggestedFilename()).toBe('Arjun-Mehta-Juspay-Resume.pdf')
})
