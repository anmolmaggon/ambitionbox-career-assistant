# AmbitionBox CEO Demo V3

An independent offer-first version of the AmbitionBox jobseeker demo. V3 opens with Arjun’s ₹28L Juspay offer, rewinds to his true first app open, builds reviewed career context, turns his application email into a live Home action, and returns to company intelligence, interview preparation, relocation impact, and negotiation.

The original `ceo-demo/` remains unchanged and independently runnable.

## Run V3

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:4273/demo` and choose **Start golden path**. The original demo continues to use port `4173`.

## Routes and deterministic states

- `/demo` — V3 presenter launcher and reset
- `/onboarding` — a single first-open promise with three concise product benefits, a pre-detected simulated Naukri profile, Google/Apple alternatives, profile and preference review, optional email, secure scan, and Home activation. Use `step=brand|welcome|profile-start|import|resume-import|manual|profile-review|preferences|email|scan|complete`; add `branch=google|apple` for blank-profile entry, `email=gmail|other` for account-sheet captures, and `hold=1` for transient brand/import/scan review states. Old `education` and `naukri-account` links safely resolve to the first-open screen
- `/profile` — reviewed career context and preferences
- `/tracker`, `/home`, `/matches` — journey screens. `/home?preset=resume` shows the presenter time jump; `/home?preset=interview` shows the interview card; `?action=add-interview` opens the manual-entry sheet
- `/jobs/juspay`, `/assistant/juspay` — application and evidence flow
- `/prep/juspay` — interview preparation. Entered from the Home interview card. Stages:
  - `?preset=interview&stage=invite&round=open` — the vague invitation and the un-answered round inference
  - `?preset=interview&stage=briefing` — interviewer, source split, four-round loop, ranked themes, outcome rates
  - `?preset=interview&stage=answers&java=open` — confirmed answers mapped to this round, plus the un-answered Java branch
  - `?preset=interview&stage=practice` — the most reported question, ungraded
  - `?preset=interview&stage=coaching` — the same question with the demo answer graded
  - `?preset=offer&stage=ready` — completed prep with derived metrics and questions to ask
  - Secondary params: `round=open|confirmed|corrected|unsure`, `java=open|yes|no`. Both seed local state only and never write journey state
- `/offer/juspay?stage=notification&story=opening` — privacy-safe notification prologue
- `/offer/juspay?stage=notification&story=finale` — finale notification followed by the full-screen offer celebration
- `/offer/juspay?stage=reveal&moment=anticipation&story=finale` — deterministic first emotional beat
- `/offer/juspay?stage=reveal&moment=celebration&story=finale` — deterministic offer reveal for QA
- `/offer/juspay?stage=decision&story=finale` — source-led offer breakdown, salary leverage, company comparison, and reviews
- Add `panel=letter`, `panel=email`, or `panel=assistant` to the decision URL for deterministic review captures
- `/offer/juspay?stage=employee&story=finale` — anonymous mediated Q&A
- `/offer/juspay?stage=negotiation&story=finale` — evidence-backed negotiation draft

Every route supports the canonical `preset` query parameter. V3 uses its own session-storage key and ports, so it never shares state with the original.

## Verify

```bash
npm run verify:context
npm run build
npm test
```

The context check validates the shared entry files, ownership and lock values, reference checksums, internal Markdown links, and the evidence/reference boundary. The browser suite covers the single first-open promise, detected Naukri profile, direct Naukri import, Google, Apple, résumé, manual, Gmail, another-email, and email-skip onboarding paths; contextual Home intelligence; the original golden path; offer/interview interactions; reduced motion; and overflow at 360px, 390px, and 430px. Run `npm run capture` for the deterministic three-width review set in `output/playwright/current/`; prior captures live in `output/playwright/archive/` and are never design references.

## Shared design workflow

Every model starts with `.agents/skills/ambitionbox-v3-workflow/SKILL.md` and `context/START_HERE.md`. Codex owns Onboarding through the Home handoff; Claude owns Home. `src/tokens.css` is the shared draft token layer, while `src/onboarding.css` and `src/home.css` keep workstream styling separate. All Product, Copy, UX, and UI layers remain draft until the owner explicitly says **lock**.

Deferred for a later phase:

- A dedicated current-pay versus new-offer comparison, including take-home change, once the core offer-term hierarchy is settled.
- Voice answer input for interview practice. Capturing spoken answers needs a microphone-permission and transcription-review surface that the review-before-use rule requires, and it cannot be made deterministic for the Playwright capture suite.
- A separate technical question set for the corrected-round branch. Correcting the round currently reorders emphasis and relabels the loop rather than loading different content.

## Safety boundary

Only `ceo-demov3/` is writable for this version. The complete original `ceo-demo/`, earlier prototypes, designs, Mukesh’s project, and root documentation remain read-only. The original demo baseline is recorded in `V3_PRESERVATION_MANIFEST.md`.
