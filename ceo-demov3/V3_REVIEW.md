# CEO Demo V3 Review

## Entry point

`http://127.0.0.1:4273/demo`

## Intended click path

1. Start golden path.
2. Tap the AmbitionBox notification.
3. Pause on the full-screen offer and choose **Understand my offer**.
4. Use the desktop presenter rail to rewind.
5. Complete the existing Gmail → Home → Naukri → Matches → evidence → interview journey.
6. Return to the offer, inspect company reality, ask an employee anonymously, review the response, edit move assumptions, and prepare the negotiation response.

## Focused screenshots

- `output/playwright/notification-390.png`
- `output/playwright/reveal-360.png`, `reveal-390.png`, `reveal-430.png`
- `output/playwright/decision-360.png`, `decision-390.png`, `decision-430.png`
- `output/playwright/offer-evaluation-feedback-full-390.png`
- `output/playwright/offer-negotiation-hierarchy-390.png`
- `output/playwright/offer-embedded-salary-insight-390.png`
- `output/playwright/offer-salary-bullets-390.png`
- `output/playwright/offer-clean-ending-390.png`
- `output/playwright/offer-still-in-doubt-390.png`
- `output/playwright/offer-salary-detail-cta-390.png`
- `output/playwright/offer-salary-detail-sheet-390.png`
- `output/playwright/offer-reviews-sheet-390.png`
- `output/playwright/employee-390.png`
- `output/playwright/negotiation-390.png`

## Completed interactions

- Privacy-safe notification and skippable branded launch
- Full-screen offer celebration with close and return state
- Home offer card and reopening path
- Company intelligence with sourced facts and explicit verification gaps
- Reviews Summary with a working **Read all 847 reviews** explorer
- Explained **What more can you do?** step for mediated employee perspective
- Qualitative negotiation power with evidence-linked recommendations
- Editable Pune → Bengaluru move assumptions
- Evidence-grounded offer questions with honest unknown fallback
- Mediated anonymous employee request, waiting, response, and return states
- Editable recruiter response with copy-only completion
- Desktop-only presenter rewind and deterministic URL presets

## Known limitations

- Gmail, Naukri, employee matching, and employee responses are deterministic simulations.
- Cost, tax, relocation, and travel outputs are transparent demo estimates rather than live financial advice.
- The prototype does not contact an employee or send a recruiter message.

## Verification

- Production build: passed
- Automated browser tests: 48 passed
- Mobile overflow QA: passed at 360px, 390px, and 430px
- Reduced-motion QA: covered by browser configuration
- Original `ceo-demo/**` preservation checksum: unchanged
