# Home — Alignment Brief + Three Material Directions

## Context

Home currently works and passes 126 tests, but nobody has agreed what it *is*. Every other screen has a change brief in `context/briefs/`; Home has never had one — its decisions were retro-documented into `context/screens/HOME.md` after the fact. The owner has stopped forward work to fix that: agree the problem first, then build three genuinely different ways of showing Home against it.

The owner is explicitly undecided on Home's identity ("even i am not sure here, i am seeing multiple patterns around now"), and supplied three patterns they had been collecting. So this plan does **not** assert a single ethos. It fixes the *problem* (which is evidenced and stable), fixes the *evaluation set* (so the comparison is fair), and builds three candidate identities to decide between.

Three findings from exploration shape the plan:

1. **Home's three surfaces each collide with a neighbour.** Tracker has an attention section with eyebrow `DO NEXT` and headline "3 things need you" plus a pinned Juspay card at the same 89% match ([App.jsx:196](../../Documents/AmbitionBox%20Career%20Assistant/ceo-demov3/src/App.jsx#L196), [:203](../../Documents/AmbitionBox%20Career%20Assistant/ceo-demov3/src/App.jsx#L203)). Matches has an `AssistantDock` and the offer room has its own dock — Home's composer is the third ([App.jsx:392](../../Documents/AmbitionBox%20Career%20Assistant/ceo-demov3/src/App.jsx#L392), [:1021](../../Documents/AmbitionBox%20Career%20Assistant/ceo-demov3/src/App.jsx#L1021)). Home's 4-stage rail sits beside `TrackerBoard`'s 5-column kanban. **Home has no uncontested surface.** Any direction has to earn its ground against a neighbour that already does something similar.
2. **Variants are nearly free.** `App.jsx` renders `<Component key={pathname+search} />`, so a query-string change fully remounts Home. `?design=` works entirely inside `Home.jsx`. Path variants (`/home/b`) and `/demo` registration would need forbidden files.
3. **The owner has prior taste here.** A generic card-stack Home was rejected before; a Lovi-influenced direction with a floating assistant pill was approved. Recorded from earlier work on the parent project, so treat as signal, not law.

## What this decides — and what it does not

**Decides:** what Home is made of, and therefore what it is.

**Does not decide:** the ranking logic, the trust rules, the fixtures, or anything about the demo script. Every layer stays `draft`. Nothing is locked without the owner's literal word "lock".

**Explicitly out of scope** (owner chose "Screen only"): chapter count, narration budget, the unstaged rail payoff, and any `PRESENTER_SCRIPT.md` / `chapters` change. The brief will not mention them.

---

## The problem (fixed — all three directions answer this)

> Arjun's search is scattered across an inbox, a feed, a calendar, and a decision. Every surface tells him about its own slice. Nothing tells him which slice matters today, or why the others don't.

The one claim all three directions must deliver, differing only in how:

> **Home answers "what deserves you right now, and why" across the whole search** — where Tracker, Matches, Prep, and Offer each answer only within their own box.

Each material embodies a different candidate ethos. Picking a material is picking the ethos.

## What must not vary (or the comparison is worthless)

1. **Fixtures.** All three read `juspay` and `interviewIntel` from `data.js`. No hardcoded numbers, no new facts.
2. **Priority order.** offer → interview → recruiter reply → best opportunity → connect email. A direction argues about *presenting* the verdict, never about *what* the verdict is. (The skipped-email inversion inside "best opportunity" is still an open owner question — noted in the brief, unchanged by this work.)
3. **Contract copy**, byte-identical, produced by the kernel — not re-authored per direction. Load-bearing: `Good morning, Arjun.` · `Live from your application email` · `Review reply` · `BEST NEXT OPPORTUNITY` · `/payments experience makes this unusually relevant/` · `INTERVIEW SCHEDULED` · `/Round 1 of 4/` · `Your ₹28L offer is ready to understand.` · `Know what needs you—before an opportunity goes cold.` · `Add an interview manually` · `Add an interview yourself.` · `Ask AmbitionBox about your next move` · `I do not have an interview invitation yet.` · `Nothing is sent or changed automatically.` · `My interview readiness`
4. **Rail markup.** Four `<button>`s, accessible name in **label → value → status** order. `tests/onboarding.spec.js` matches `/Applications 15 total · 3 need you/` and `/Explore Roles from your profile/` as prefixes. A direction may restyle or collapse the rail visually but must keep four buttons.
5. **Trust rules.** "Live" only for a connected source. Preference Match never merged with Profile Readiness, never shortened to "match". No auto-opening modal. Nothing sends without review.
6. **Zero edits under `tests/`.** This is what keeps the exercise honest.
7. **Motion budget.** One orchestrated transition per state consequence. No direction wins on ambient animation. No gradients, glass, sparkles, floating cards, AI-purple — per `context/UI.md`, and note all three references violate this in their own palettes.

## The nine states every direction must handle

At 360 / 390 / 430px:

| # | State | Route |
|---|---|---|
| 1 | Connected first arrival | onboarding → `/home?arrival=first` |
| 2 | Skipped first arrival | `/onboarding?step=email&preset=baseline` → "Set up later" |
| 3 | Reply pending | `/home?preset=tracker` |
| 4 | The rerank | `/home?preset=tracker&action=phonepe` → Send reply |
| 5 | Post-reply steady | `/home?preset=matches` |
| 6 | Résumé-ready / time-jump door | `/home?preset=resume` |
| 7 | Interview scheduled | `/home?preset=interview` |
| 8 | Prep complete, no offer | golden path only — no preset exists |
| 9 | Offer detected / fully-lit rail | `/home?preset=offer` |

**Incoming contracts:** `/home?action=phonepe` opens ReplySheet on mount (Tracker depends on it, [App.jsx:214](../../Documents/AmbitionBox%20Career%20Assistant/ceo-demov3/src/App.jsx#L214)) · `/home` from JobDetail's "See my next move" needs the Juspay hero **and** the "Jump ahead 3 days" block ([App.jsx:470](../../Documents/AmbitionBox%20Career%20Assistant/ceo-demov3/src/App.jsx#L470)) · bare `/home` from PrepReady, OfferReveal close, and the bottom nav · `?action=add-interview` opens AddInterviewSheet · `?arrival=first` has exactly one caller, `Onboarding.jsx:545`.

---

## The three materials

Each maps 1:1 to a reference the owner chose. Today's Home stays the untouched **control** at bare `/home`.

### A · The Answer — `?design=answer` — from MOB-ONB-014 (Places)

Home is the assistant's answer to an implicit question. A stated question, a short prose verdict with inline links into the app, a rule, then one authored answer block carrying the action and its evidence. The rail becomes the answer's scope-of-consideration footer. A persistent "Ask a follow up" affordance sits above the bottom nav.

- **Learn:** lead with one clear recommendation, keep evidence adjacent, always allow a follow-up without competing with the result.
- **Do not copy:** warm editorial theme, serif display type, restaurant context, five-item nav.
- **Bet:** an AI product's home should be an answer, not a dashboard. It's also the only material where the composer stops being a bolted-on third dock and becomes structural.
- **Risk:** can read as a chat transcript; prose is slower to scan than a card.

### B · The Console — `?design=console` — from MOB-ONB-011 / 013 / 010 (Lovi, Quizlet, Oportun)

Greeting, a progress spine across the four stages, one promoted resumable task with visible completion state and a single dominant continuation CTA, then grouped surfaces of lower-commitment context. Lighter and more sectioned than today's dark hero card.

- **Learn:** a visible short path; one resumable thing made dominant with real completion state; completed context stays visible while a missing item gets one obvious action inside the same grouped surface.
- **Do not copy:** day-gamification, frosted glow, mascots, card carousel, premium upsell, decorative background glow.
- **Bet:** a job search is a plan with a state, and seeing the plan's state is what makes the one action feel earned rather than asserted.
- **Risk:** the direction most likely to be rejected. It lives closest to Tracker and closest to the "generic, dashboard-like" failure `CLAUDE.md` warns against — and a generic card-stack Home was already rejected once.

### C · The Composer — `?design=composer` — from MOB-ONB-012 (Natural AI)

Input-first. The composer is the dominant element rather than a 62px row below the fold, and beneath it sit concrete pre-baked actions so the user never has to know what to ask. The next-best-action becomes the first, pre-filled suggestion rather than a hero card.

- **Learn:** a contextual input can open directly into concrete suggested actions.
- **Do not copy:** pastel gradient haze, translucent AI wash, generic assistant welcome, low-contrast controls.
- **Bet:** the front door to an assistant should be the thing you talk to; suggestions solve the blank-page problem that kills most chat UIs.
- **Risk:** defers the verdict. Weakest at making one action own the hierarchy, which is Home's whole job — this is the direction most likely to fail the problem statement rather than the taste test.

---

## Sequence and gates

**Phase 0 — the brief. Docs only, no JSX.** Write `context/briefs/HOME.md` in the exact format of `context/briefs/ONBOARDING-FIRST-OPEN.md` (Screen / Desired outcome / Permitted layers / Protected layers / References / Current lock state, then Current evidence, then a linear ledger). Content: the problem, the collision analysis, the invariants, the nine states, one section per material with bet + risk + learn/do-not-copy. Reference `MOB-ONB-010`–`014` by ID.

**→ Gate 0: owner reads the problem statement and the three materials and says "yes, that's the right set." No code before this.**

**Phase 1 — kernel extraction. Zero visual change.** Refactor `Home.jsx` into a shared kernel + shared parts + a design switch, with today's Home as the default. Also land one plain Home motion fix: the hero entrance is gated on `firstArrival`, so it does not animate when the action changes within a session — drive it off a ref holding the previous `action.id` instead, reduced-motion instant, plain mount static.

**→ Gate 1: `npm test` 126/126 with zero edits under `tests/`, and `npm run build` clean. Screenshots of the default byte-comparable. If this isn't green, stop.**

**Phase 2 — A · The Answer.** Build, then both `context/UI.md` critique passes at all three widths.
**Phase 3 — B · The Console.** Same.
**Phase 4 — C · The Composer.** Same.

**Phase 5 — comparison.** Owner reviews on a phone via the in-app switcher, plus a screenshot grid for states 1, 4, and 8 which the switcher cannot show side by side.

**→ Gate 5: owner picks one, or asks for a hybrid. A hybrid is cheap — it composes already-built shared parts into a fourth function.**

**Phase 6 — record and settle.** Losing directions become prose: one `context/FEEDBACK.md` row each (Area: `Home direction`) with the bet, why it lost, and the durable rule; full prose in the `briefs/HOME.md` ledger. Delete the losing JSX/CSS — their durable artifact is the screenshots under `output/`, which per `START_HERE.md` is evidence and never design direction. Update `context/screens/HOME.md` and the `STATUS.md` evidence cell. **Every layer stays `draft`.**

---

## Implementation structure

**Stay in `src/Home.jsx` + `src/home.css`.** No new files — `context/screens/HOME.md` states in prose that implementation lives in those two, and the owner repeated it. Expect ~950 lines, against `App.jsx`'s 1086; it drops back to ~450 once a direction is chosen.

```
src/Home.jsx
  1. KERNEL — authored once, shared by every direction
     DEFAULT_DESIGN = 'current'        // single constant = the test lever
     DESIGN_KEY = 'ambitionbox-home-design'
     useHomeDesign()   ?design= → sessionStorage → DEFAULT_DESIGN
     useHomeContext()  journey, firstArrival, attention, hasProfileContext,
                       action, stages, prompts
     useHomeSheets()   ?action=phonepe | add-interview, sheet state, sendReply
     nextBestAction() · journeyStages() · contextualPrompts()
     homeAnswer() · introLine()        — all UNCHANGED
  2. SHARED PARTS — restyleable, never re-authorable
     HomeHeader · HeroCard · WhyRow · ConnectNote · TimeJump
     Composer · PromptChips · JourneyRail · AddInterviewLink
  3. DIRECTIONS
     HomeCurrent(ctx) · HomeAnswer(ctx) · HomeConsole(ctx) · HomeComposer(ctx)
  4. DesignSwitcher   — renders only once a ?design= has been seen this session
  5. SHEETS — ReplySheet · AddInterviewSheet · HomeAssistantSheet · OfferStartSheet — UNCHANGED
  6. HomeScreen()     — kernel + switch(design) + one <AnimatePresence>
```

**The rule that makes the comparison fair:** every string a test matches comes from the kernel or a shared part. A direction may **re-arrange** and **re-style** those parts. It may never **re-author** them.

**Switcher behaviour.** A 3-segment control above the bottom nav calling `go('/home?...&design=answer')`. It **appends** to existing params so `?preset=` survives, and writes `sessionStorage['ambitionbox-home-design']` — its own key, never `store.jsx`'s — so the bottom-nav round-trip to bare `/home` keeps the choice. It renders **only** after a `?design=` has been seen this session, so bare `/home` — every test, every existing capture — is untouched. Entry is one URL: `/home?preset=tracker&design=answer`.

**`home.css`** grows to ~500 lines. Shared parts keep their current class names so existing selectors and the `@media (max-width: 370px)` block keep working. Directions get `.home--answer` root modifiers and their own 360px blocks.

## Reference housekeeping

The inbox is already drained — Codex filed and checksummed all five. But they are scoped to onboarding and four sit on `hold`. Minimal amendment to `references/CATALOG.md`, preserving IDs, filenames, checksums, and provenance: change the *Relevant layer/screen* cell to name Home for `MOB-ONB-011`, `012`, `013`, `014`, and flip those four to `active`. Row count stays 10 so `verify:context` still passes. Leaving the bitmaps where they are — re-pathing would invalidate the recorded provenance for no gain.

## Verification

- `npm run build` clean; `npm test` → 126/126 after every phase, with zero edits under `tests/`.
- **The three materials are not covered by the suite** — every test hits bare `/home`. So before Gate 5, flip `DEFAULT_DESIGN` to each of `answer`, `console`, `composer` and run the full suite each time; 126/126 required for all three. This is the gate that catches contract-string drift and 360px overflow in the variants.
- A scratchpad Playwright harness (no repo file) walking every design × all nine states × 360/390/430: asserts zero horizontal overflow, asserts each contract string present in its state, and writes a comparison grid.
- Reduced motion: every section at full opacity, no transform, on all four designs.
- Touch targets ≥44px on all Home-owned controls in all four designs.
- Manual: the four incoming contracts — Tracker PhonePe → ReplySheet; JobDetail "See my next move" → Juspay hero + time jump; OfferReveal close → ₹28L hero; bottom nav round-trip preserves the design choice.

## Risks

- **The Console may be dead on arrival** on brand grounds. Building it anyway is deliberate: it's the honest test of whether "dashboard" is genuinely wrong for Home or was only wrong in its earlier execution. Cheap to reject with evidence.
- **The Composer may fail the problem statement**, not just taste — it's structurally weakest at making one action dominant. If it fails, that itself is a finding worth having.
- **Contract-string drift** in a radical variant. Mitigated structurally by the authoring rule, caught by the `DEFAULT_DESIGN` flip.
- **Codex is editing Onboarding concurrently.** Only `Onboarding.jsx:545` reaches into Home's contract. Re-verify state 1 after its pass lands.
- **Four things to look at, not three.** The control is free and makes the comparison legible, but it does lengthen the review.
