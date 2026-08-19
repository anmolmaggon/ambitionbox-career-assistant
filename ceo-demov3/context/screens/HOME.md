# Home Screen Contract

Owner: **Claude**  
Current state: **Working implementation; every Product, Copy, UX, and UI layer remains draft.**

Codex may change Home only to perform a mechanical file separation or to preserve the documented onboarding handoff. It must not redesign Home.

Implementation lives in `src/Home.jsx` and `src/home.css` only.

## Required onboarding inputs

Read `context/JOURNEY.md` for the complete contract.

Home must support:

1. Connected-email first arrival with reviewed profile/preferences, 15 applications, and three attention moments.
2. Email-skipped first arrival with reviewed profile/preferences and a useful profile-based experience.
3. No automatic reopening of the email modal after skip.
4. Later PhonePe, Juspay, interview, and offer states already represented in `src/data.js`.

### How Home consumes the handoff

- Home treats first arrival as `arrival=first` **and** `firstHomeArrival: true`. Both must hold.
- **The first-arrival line is written warm, not as a status report** (2026-08-19). “Your profile is reviewed and your application email is live” read as a system confirming its own setup to someone who had just arrived. It now opens with arrival, and it names **everything the screen drew on**, not just the inbox: “You're all set up. I've been across your application email and your ranked roles — 4 things need you, most urgent first.” Crediting only the email under-claimed — the sequence mixes email-derived moments with roles ranked against the reviewed preferences. Home is the screen that has seen everything; the greeting says so.
- Home **never clears `firstHomeArrival`.** The flag stays inspectable for the onboarding contract test; arrival-only presentation is derived from the route instead.
- First arrival changes the greeting line and plays one orchestrated section reveal. It never adds a card, a modal, or an interstitial.

## Home definition, settled 2026-08-18

> Home is the only screen that has seen everything. It looks across all of it, says **"today, this one,"** shows **what it weighed and set aside**, and opens **the tool that moves it forward — not the room that contains it.** The feeling is relief, not information. The proof is that the pick moves when your life moves.

**The rail is gone.** Its first two rows routed to Matches and Tracker — the bottom-nav tabs drawn larger — and it cost ~420px.

**Below the sequence: a quote of the day**, under an all-caps `QUOTE OF THE DAY` label, separated from the sequence by a hairline the width of the text column so it reads as the page's footer rather than one more thing in the stack. The quotation is **set in a serif** — it is editorial content and the one place on Home where the voice is not AmbitionBox's, so it is allowed to look that way. The deviation from Figtree is contained to this block and the mark above it; deleting one `font-family` line reverts it. Deliberately not a card — Home already stacks white surfaces and another one would read as a fifth thing needing attention. It is the screen exhaling after the work, so its weight comes from the mark, the measure and the whitespace instead of a container. Attributions are checked; nothing widely misattributed is included, and no paraphrase is passed off as a quotation. Keyed to the day of the week so it is genuinely *of the day* and stable within one sitting.

**Amended 2026-08-18: the hero and "What I set aside" are one carousel.** Home stopped being the screen that picks one thing and files the rest away; it lays everything out in order and lets the user scan it. The arbitration claim is unchanged and still falsifiable — *the order moves when the user's life moves* — it is simply no longer told by drawing one card larger. "One dominant CTA" is preserved structurally: only one card is in the viewport at a time, so dominance comes from position rather than size.

- One horizontal, swipeable, peeking sequence at `min(82vw, 310px)`, **uniform across every card**. No dots and no “1 of 4” counter as of 2026-08-19: the peeking neighbour is the affordance, and a counter under a sequence you can see is a label for something already visible.
- Order is `nextBestAction()` first, then `setAside()`, then the email connection when it is missing. Both ranking functions are unchanged; only the rendering target moved.
- Rows come from `applications.attention`, `applications.waiting` and `jobs`. Nothing is invented.
- Ordered by urgency (Overdue → Today → Due tomorrow → ranked roles). Only the head of the queue may claim "Next in line."
- **Reasons must be state-derived.** A pick with a fixed date (interview, offer) changes why everything else waits. *If a reason could move to another row and stay true, it is decoration — cut the row.*
- Verified by a falsifier across five states: 5/5 distinct reason sets, and no two reasons inside a state repeat. Re-run after any change to either ranking function.
- Every card carries a dismiss (✕) → **Ignore / Remind me later / Mark as done — I handled it**. The menu closes on a tap anywhere outside it or on Escape; a menu that only closes by choosing something is a trap. The third option exists because plenty of this happens off the platform and nothing can detect that it did. Dismissal is **local component state, not persisted** — nothing in `journey` records it, and inventing persistence would claim a memory the prototype does not have.
- **Every card carries a category mark** — a 28px tinted tile holding one icon. The colour is restrained and stays inside the tile, per `context/UI.md`, and the split carries meaning rather than decorating: a **coloured** mark is something happening *to* you (a person waiting → blue, a date booked → violet, money on the table → green, a Tracker item due → amber) and a **slate** mark is something sitting there for you to choose (ranked roles, the email connection). A queued role also takes a quiet CTA instead of the solid one, because nobody is waiting on it. Cards stay identical in size and elevation; only identity varies.
- **Material:** MOB-HOME-003 (Bond) — white cards on the quiet canvas, small grey eyebrow, bold plain-language claim, evidence strip, exactly one pill action. MOB-HOME-006 (Klarna) for the peeking mechanic and the elongated active dot; MOB-HOME-005 (Monzo) for dismissal being a property of the card. Their gradient fields are explicitly not carried across.

**Capabilities do not belong on the page.** Of the 15 capabilities that are undiscoverable cold, 13 attach to an object — a job, a round, an offer — so they are steps in an object's lifecycle, not app-level features. The proof: the old page-level capability list was byte-identical across all four presets, so it could not move when the user's life moves. It now lives as an index inside the assistant sheet (MOB-ONB-012, Natural AI). As of 2026-08-18 that index is permanent in every direction, not the Composer only: an Explore tab was considered and dropped because it would have been this same list repackaged as tiles, and the composer that opens the sheet is permanent chrome, so the index is reachable from any state without spending a tab. The page-level list stays gone — permanent means permanently in the sheet, not back on the page. The real defect is object depth, and it belongs to Offer and Prep.

**Wordmark (2026-08-19):** on Home the wordmark is set in one ink — the blue "Box" is the app-wide treatment from `styles.css` and stays there. The mark carries the brand colour, so the first colour the eye lands on is the pick rather than the header. Home-owned override; no other screen changes.

**Credibility fixes:** Home reads `journey.onboardingProfile` for the greeting instead of hardcoding "Arjun" · the header avatar opens `/profile` · the notification bell is removed (it had no handler anywhere, and a bell on the arbiter implies a queue Home did not consider).

## Navigation — n2 promoted app-wide, 2026-08-18

**Home · Tracker · Jobs**, avatar → Profile. The third tab was relabelled from *Matches* to **Jobs** on 2026-08-19 — “matches” was product vocabulary rather than the user's — and takes a compass rather than a magnifier, so it does not read as a second search field. Its route is unchanged at `/matches`, and `tests/golden-path.spec.js` was re-pointed to the new label. Profile left the tab bar because it is a reference screen, not a returning destination; Tracker and Matches keep theirs because both hold content worth browsing on its own terms. Treatment follows MOB-HOME-001 (Cleo): icons with labels, active expressed as a filled glyph rather than a coloured chip, the bar sitting quietly on the canvas instead of as a heavy white shelf.

This is now `BottomNav` in `src/AppUI.jsx`, so it is the same three tabs on every screen. **The `?nav=` axis is gone** — n3 and n4 existed to test whether the composer should be permanent chrome, and that question is answered below, so they were deleted rather than left as dead alternatives.

**The composer is part of the bottom cluster (2026-08-18).** Per MOB-HOME-001 (Cleo), suggested questions, the ask pill and the three tabs read as one quiet group sitting on the canvas — not an input buried under the fold above a separate white shelf. The cluster fades into the canvas rather than being fenced off by a border, so content passes under it. It is ~244px of permanent chrome, which is the deliberate cost of Ask being reachable from any scroll position and any state; Home reserves `padding-bottom: 272px` so nothing ends underneath it.

**The cluster reads as a sheet (2026-08-19):** white, rounded 28px at the top, lifted off the canvas by a shadow, with a grab handle above the chips. Solid, so nothing shows through the tabs. On white the chips take a hairline instead of a shadow and the ask takes a recessed tinted field instead of a raised button, so it reads as the thing you type into. **The handle is a real control** — it opens the assistant, which is where a swipe up would land. An affordance that does nothing is a lie the moment someone tries it. Home reserves `padding-bottom: 216px` for it; `.screen`'s shared 132px is not enough.

The tab bar inside the cluster is still the shared `BottomNav`; Home only takes it out of fixed positioning so the group can own the bottom together. The three legacy directions still render their own in-page composer, so the dock carries the ask **only when the design does not**.

✅ **The duplicate is gone.** `ProfileScreen` (`src/Onboarding.jsx`) hand-rolled its own copy of the bar, referenced `Home` without importing it, and had been throwing on every render — `/profile` was blank at all three widths and three `responsive.spec.js` cases were failing before this pass. It now renders the shared `BottomNav`, which is what stops the two from diverging again.

## Test contract changes

Deleting the rail removed the two elements these locators pointed at. Both assertions keep their intent and their place in the flow; only the locator moved:

| Was | Now | Still proves |
|---|---|---|
| `/Applications 15 total · 3 need you/` | `/4 things need a look/` + `Detected in Gmail.` | the connected inbox produced a counted, ranked Home |
| `/Explore Roles from your profile/` | `/Zeta.*86% Preference Match/` | email-skip Home offers profile-ranked roles |

The carousel keeps both locators without changing either spec. The queued cards all reach the same few destinations, so each of their CTAs takes an `aria-label` of `company · detail · visible label` — that is what a screen reader needs anyway (two bare “Open in Tracker” buttons on one screen are ambiguous), it keeps the visible label inside the accessible name, and it is what `/Zeta.*86% Preference Match/` now matches. **Card 1's CTA never takes one**, so `Review reply`, `See what to expect`, `Review my offer` and `Connect application email` stay exact-matchable.

## Design directions in flight (2026-08-18)

Home is being decided between three material directions, built side by side against the same kernel. Today's Home is kept untouched as the control. **All four are draft; none is chosen.**

**Amended 2026-08-18:** the carousel rebuild and the Bond material pass were applied to the default `current` direction only. The other three are untouched and still render the hero + set-aside shape, so they are now comparison material for a decision rather than three live candidates. **Open gate:** resolve whether they are deleted before any further material work, so a pass is never applied four times.

| Route | Direction | Reference | Credibility comes from |
|---|---|---|---|
| `/home` | Current — carousel, Bond material | MOB-HOME-001/003/005/006 | the order visibly moving when the state moves |
| `/home?design=answer` | A · The Answer | MOB-ONB-014 | the reply reading as considered |
| `/home?design=console` | B · The Console | MOB-ONB-011 / 013 / 010 | coverage — nothing dropped |
| `/home?design=composer` | C · The Composer | MOB-ONB-012 | an input that opens into concrete actions |

### The authoring rule

`Home.jsx` is kernel → shared parts → designs. **Every string a Playwright test matches is produced by the kernel or a shared part. A direction may re-arrange and re-style those parts; it may never re-author them.** This is what keeps the comparison fair and the suite green under any direction.

- `DEFAULT_DESIGN` is the test lever. The suite only ever hits bare `/home`, so a direction is covered only while it is the default; flip the constant and re-run to verify one.
- `?design=` persists to `sessionStorage['ambitionbox-home-design']` — Home's own key, never `store.jsx`'s — so the choice survives the bottom nav's round trip to bare `/home`. The switcher renders only once a `?design=` has been seen, so bare `/home` is untouched for tests and captures.
- Losing directions get deleted after the decision; their durable artifact is screenshots plus a `FEEDBACK.md` row each.

## Durable decisions

### Adaptive next-best-action, rendered as the head of the carousel

- `nextBestAction()` still decides what leads. The first matching branch is card 1; it is no longer drawn larger than the rest.
- Priority order: **offer → interview → recruiter reply → best opportunity → connect email.** The connect-email branch is the fallback for a visitor with no profile context, not the answer to a skipped email.
- **Removed 2026-08-19: the “Why this is first” row.** Once the hero became a sequence, every card already carried the reason it sits where it sits, so a separate row restated the order in different words. The adaptive logic stays legible through the card reasons themselves and through the assistant, which still answers `whyQuestion` when asked. `WhyRow` survives only inside the three legacy directions.
- Card actions are pinned to the floor of the card so a sequence holding different amounts of evidence still lines its buttons up.
- Preference Match leads the opportunity evidence row as **“89% Preference Match”**. It is never shortened to “match” and never merged with Profile Readiness.
- **Superseded 2026-08-18:** the interview beat no longer keeps the prep-v3 violet field, and the offer beat no longer keeps its green one. A sequence of equals cannot have one card wearing a different field without re-introducing the hero the rebuild removed; the beat stays distinguishable by its eyebrow, its badge and its position.
- The greeting states how many things the sequence holds. A line claiming “one thing” above four cards is untrue, so the count comes from the sequence itself rather than being authored per state.

### Skipped-email arrival

- The dominant surface is the **profile-based best opportunity**, because `JOURNEY.md` requires Home to remain useful through profile-based Explore.
- Email connection is the **last card in the carousel**, not a separate section below it — two surfaces answering “what should I do next” was the shape that made Home read as a dashboard. It keeps the heading “Know what needs you—before an opportunity goes cold.”, states the read-only boundary, and navigates to `/onboarding?step=email` only on tap. It is the one card that carries no dismiss: “mark as done” is not true of a connection that has not happened.
- No modal opens automatically, on arrival or afterwards.

### Contextual composer

- The composer label **“Ask AmbitionBox about your next move”** is now the pill's **accessible name** rather than its drawn text (2026-08-19). The pill types out example questions the way a search field cycles a placeholder; the typed line is `aria-hidden`, so a screen reader still hears the contract string. **Under reduced motion the contract string is what is drawn**, immediately and without a caret. The typed examples are deliberately not the chip set — the chips sit directly above, and repeating them would show the same range twice.
- **The assistant's mark is the AmbitionBox mark, not a sparkle** (2026-08-19), in the dock pill and in the sheet. A sparkle is the generic sign for “an AI did something”, which `context/UI.md` rules out by name, and it made the one permanent control on the screen look like every other product's.
- A grounding line names what the answer actually uses, and it changes with the state (live applications vs. reviewed profile only). **Moved 2026-08-18:** it now leads the assistant sheet instead of sitting under the composer. A slim Cleo pill has no room for a second line, and the grounding is most useful at the moment the answer is about to be given.
- **Superseded 2026-08-19: suggested prompts are no longer derived from state.** They are pitches for what the assistant is *for*, and they name **AmbitionBox's own territory** — pay fairness, take-home, company comparison — rather than asking vague planning questions, because that range is what nobody discovers cold. The carousel already proves Home adapts — it visibly reorders when the user's life moves — so the chips stopped competing with it and went back to showing someone who has never asked anything what is worth asking. The five are stable in every state, and each lands on a real `homeAnswer()` branch backed by real fixtures — a chip that produces a shrug is worse than no chip. **The take-home answer names what is missing rather than inventing it:** no take-home fixture exists anywhere in the prototype, so the answer separates fixed from variable pay, says the letter does not give the split, and points at the one figure that *is* measurable (the ₹13k monthly cost-of-living delta). Confident wrong numbers are the thing this product exists to avoid. Chips use **short labels**; the sheet uses the **full question**, so the two surfaces never collide as duplicate controls.
- **“Add an interview manually” left the page on 2026-08-19.** After the carousel rebuild it was a lone link floating below the sequence, and the capability index already offered the same sheet — two entry points to one honest disclaimer. The index is now the only one. `tests/prep-intel.spec.js` was re-pointed through it and keeps its intent unchanged; `?action=add-interview` still opens the sheet directly.
- `homeAnswer()` is ordered most-specific-first. The “no interview invitation yet” answer is a contract string used by `tests/onboarding.spec.js`.

### Living career-journey rail — removed

Kept here only so the decision is not re-litigated. Four stages (Explore → Applications → Interviews → Offer) with reached states and a filling connector. It was cut because its first two rows routed to Matches and Tracker — the bottom-nav tabs drawn larger — and it taught a journey model Home does not use. **“Live” is still reserved for a connected source** wherever that word appears.

### Copy

- The greeting eyebrow reads **“Thursday · 9:41 am”**, set in caps, as of 2026-08-19 — it is a timestamp, and caps read as metadata rather than as the first line of a sentence. It is a fixture time, not a device clock: it agrees with “Good morning”, and it stays inside the Thursday the rest of the data assumes (“2h ago”, “Overdue”, Tuesday's round), which a real clock would contradict. The earlier “Thursday · Your job search” — itself a narrowing of “Your career”, which overstated the scope — survives in the three legacy directions.
- **Removed 2026-08-19: the live-email row** (“Live from your application email · 15 organised · 3 need you”). It restated what the sequence beneath it already showed, and Tracker owns the organised-inbox count. `LiveSummary` survives only inside the three legacy directions.
- Counts still appear once per screen. The greeting now owns the only count on Home, and it counts the sequence it introduces.

## Accessible-name trap, hit twice now

Any string that ends up inside a control's accessible name must not contain the substring **“Close”**, or it collides with every sheet's Close control under a non-exact `getByRole('button', { name: 'Close' })`. It caught the capability index once (“Close the evidence gap”) and the ranked-roles card again on 2026-08-19 — “89% is your closest match” fed the CTA's composed `aria-label`. That card now reads “89% Preference Match”, which is what the Preference Match rule asks for anyway.

## Accessibility and responsive

- Verified at 360, 390, and 430px with no horizontal overflow.
- Reduced motion renders every section at full opacity with no transform; the arrival reveal is skipped, not deferred.
- All Home-owned controls are ≥44px, verified by measuring every button and link on the screen. The header avatar mark is still the shared 36px `.avatar` from `styles.css`; Home cannot resize it without moving every other screen's Topbar, so it grows the **hit area** around it to 44px instead. Home also stopped nesting AppUI's `<Avatar />` — itself a button — inside its own profile button, which had put two controls in the same 36px square.

## Protected boundaries

- Preserve runtime fixtures and source/trust rules. Home reads `juspay` and `interviewIntel` from `src/data.js` rather than restating values.
- Keep Preference Match separate from Profile Readiness.
- Do not change Onboarding-owned routes or state transitions without an explicit shared-foundation request.
- Update this contract and `context/STATUS.md` when Home work materially changes.

## Evidence

`output/playwright/current/home-*.png` predates the carousel rebuild. `npm run capture` is still held back: it rewrites every screen, and Codex's onboarding evidence is in flight. Refresh it as one pass once onboarding settles. The rebuild was verified instead by the full Playwright suite (134 passing), the five-state falsifier, and screenshots at 360/390/430 with no horizontal overflow.

## Claude task intake

Confirm the Home state, desired outcome, permitted Product/Copy/UX/UI layers, protected layers, references, and current lock state before editing.
