# Home — resolved shape, paused for references (2026-08-18)

**Status: structure resolved, material not started. Paused — owner is gathering
Home-scoped references before any code changes.** Do not begin the carousel rebuild until
those references have been reviewed together. This is the current spec once work resumes.
Everything below this section is the reasoning trail that produced it — kept for
provenance, not for re-reading; superseded where it conflicts with this summary.

## Why paused here specifically

The structural rework in this session (unified carousel, chat greeting, composer dock,
4-tab nav) never addressed the actual original complaint: "all are so bad... no artifact...
no atmosphere... same layout grammar." That was about **material** — field colour, depth,
texture, a real artifact — not structure. The carousel is now the dominant visual element
on the page, so getting its material right matters more than anything built earlier today.
Owner is sourcing references specifically for: (1) dismissable action-card carousels with
real texture/depth, (2) the swipe-to-reveal dismiss gesture (Ignore/Remind later/Mark as
done), (3) a docked composer sitting above a full nav bar together, (4) atmosphere on a
utility screen that isn't white-card-on-grey, staying inside what `context/UI.md` already
rules out (gradients, glass, sparkle, "AI-purple").

**Process note:** drop in `references/inbox/`, flag as Home-scoped so they don't get
mis-filed under onboarding again (happened once already this session — 4 references were
claimed by Codex for an onboarding beat before being scoped to Home).

## Wireframes — every screen/state this plan builds

All 390px. Copy and fixtures are real, taken from `src/data.js` and the ranking logic
already built. Card content in the carousel comes from `nextBestAction()` (card 1) and
`setAside()` (cards 2+) — same functions already coded and falsifier-tested; only the
rendering target changes, from hero+list to one ordered sequence.

### 1 — Reply pending · `/home?preset=tracker`

```
┌──────────────────────────────────────────┐
│ AmbitionBox                        (AM)→ │
├──────────────────────────────────────────┤
│ Thursday · Your job search                │
│ Good morning, Arjun. I looked across      │
│ everything — 4 things need a look.        │
│ ● 15 organised · 3 need you            ›  │
├──────────────────────────────────────────┤
│ ╔═════════════════════════╗ ┌───────────┐│
│ ║✕                        ║ │  (peek)   ││
│ ║RECRUITER REPLY   [2h ago]║ │ Google    ││
│ ║(PP) PhonePe             ║ │ Overdue   ││
│ ║"Can you confirm your    ║ │           ││
│ ║ availability..."        ║ │           ││
│ ║A person is waiting, and ║ │           ││
│ ║replies age fast.        ║ │           ││
│ ║( Review reply      → )  ║ │           ││
│ ╚═════════════════════════╝ └───────────┘│
│      ● ○ ○ ○  1 of 4, swipeable           │
├──────────────────────────────────────────┤
│ ( ✧ Ask AmbitionBox              ➤ )      │
├──────────────────────────────────────────┤
│⌂ Home   ▤ Tracker   ⌕ Matches   ◎ Explore │
└──────────────────────────────────────────┘
Cards 2-4: Google/Overdue ("Next in line..."), CRED/Due
tomorrow ("Tomorrow, not today."), Juspay/2d ago ("Best fit,
nobody is waiting.")
```

**Connected first arrival** (`?arrival=first`, same preset): identical layout — intro line
becomes "Your profile is reviewed and your application email is live. One thing needs you
today," and the whole section plays the one orchestrated entrance already built (`rise()`).

### 2 — Interview scheduled · `/home?preset=interview`

```
┌──────────────────────────────────────────┐
│ AmbitionBox                        (AM)→ │
├──────────────────────────────────────────┤
│ Thursday · Your job search                │
│ Good morning, Arjun. Tuesday is the only  │
│ fixed date in your search right now.      │
│ ● 15 organised · 2 need you            ›  │
├──────────────────────────────────────────┤
│ ╔═════════════════════════╗ ┌───────────┐│
│ ║✕                        ║ │  (peek)   ││
│ ║INTERVIEW SCHEDULED  [Tue]║ │ Google    ││
│ ║(JP) Juspay · Round 1 of 4║ │ Overdue   ││
│ ║"The invite doesn't say   ║ │           ││
│ ║ what this round covers."║ │           ││
│ ║63 interview reports say  ║ │           ││
│ ║what happens inside that  ║ │           ││
│ ║hour.                     ║ │           ││
│ ║( See what to expect  → ) ║ │           ││
│ ╚═════════════════════════╝ └───────────┘│
│      ● ○ ○   1 of 3, swipeable            │
├──────────────────────────────────────────┤
│ ( ✧ Ask AmbitionBox              ➤ )      │
├──────────────────────────────────────────┤
│⌂ Home   ▤ Tracker   ⌕ Matches   ◎ Explore │
└──────────────────────────────────────────┘
Cards 2-3: Google ("Overdue, but it is their slot list — and
Tuesday is the date you control least."), CRED ("Tomorrow, and
it keeps until the round is done.") — reasons change because a
dated pick changes why everything else can wait; this is the
falsifier-verified behaviour already coded.
```

### 3 — Offer detected · `/home?preset=offer`

```
┌──────────────────────────────────────────┐
│ AmbitionBox                        (AM)→ │
├──────────────────────────────────────────┤
│ Thursday · Your job search                │
│ Good morning, Arjun. A live decision is   │
│ open — everything else can wait a day.    │
│ ● 15 organised · 2 need you            ›  │
├──────────────────────────────────────────┤
│ ╔═════════════════════════╗ ┌───────────┐│
│ ║✕                        ║ │  (peek)   ││
│ ║OFFER RECEIVED     [Today]║ │ Juspay    ││
│ ║(JP) Juspay · Senior       ║ │ interview ││
│ ║     Backend · Bengaluru  ║ │           ││
│ ║"Your ₹28L offer is ready ║ │           ││
│ ║ to understand."          ║ │           ││
│ ║See what employees report,║ │           ││
│ ║what the move changes, and║ │           ││
│ ║where you have room to    ║ │           ││
│ ║negotiate.                ║ │           ││
│ ║( Review my offer     → ) ║ │           ││
│ ╚═════════════════════════╝ └───────────┘│
│      ● ○   1 of 2, swipeable              │
├──────────────────────────────────────────┤
│ ( ✧ Ask AmbitionBox              ➤ )      │
├──────────────────────────────────────────┤
│⌂ Home   ▤ Tracker   ⌕ Matches   ◎ Explore │
└──────────────────────────────────────────┘
Card 2: Juspay interview, Round 1 of 4 ("Prep is saved. The
decision lands before the round does.")
```

### 4 — Skipped email, first arrival · `/onboarding?step=email` → Set up later

```
┌──────────────────────────────────────────┐
│ AmbitionBox                        (AM)→ │
├──────────────────────────────────────────┤
│ Thursday · Your job search                │
│ Good morning, Arjun. Your profile and     │
│ preferences are reviewed — your search    │
│ starts with what actually fits you.       │
│ (no live-email row — not connected)       │
├──────────────────────────────────────────┤
│ ╔═════════════════════════╗ ┌───────────┐│
│ ║✕                        ║ │  (peek)   ││
│ ║BEST NEXT OPPORTUNITY     ║ │ Zeta      ││
│ ║(JP) Juspay · Senior       ║ │ 86% match ││
│ ║     Backend Engineer     ║ │           ││
│ ║"Your payments experience ║ │           ││
│ ║ makes this unusually     ║ │           ││
│ ║ relevant."               ║ │           ││
│ ║89% Match · ₹24-30L ·      ║ │           ││
│ ║Hybrid · 4.0★              ║ │           ││
│ ║( See why it fits     → ) ║ │           ││
│ ╚═════════════════════════╝ └───────────┘│
│      ● ○ ○ ○ ○   1 of 5, swipeable        │
├──────────────────────────────────────────┤
│ ( ✧ Ask AmbitionBox              ➤ )      │
├──────────────────────────────────────────┤
│⌂ Home   ▤ Tracker   ⌕ Matches   ◎ Explore │
└──────────────────────────────────────────┘
Cards 2-5: Zeta 86% ("Your fintech domain depth stands out."),
PhonePe 83% ("Already in conversation—replying is your
highest-leverage move."), Groww 76% ("Compelling stretch role;
stronger leadership evidence would help."), and — new, drawn
here as an assumption, not something explicitly agreed —
"Connect application email" folded in as the last card, rather
than kept as today's separate bolted-on ConnectNote section.
Flagging this: keeping it separate would repeat the "two
sections answering the same question" problem already named as
a risk once. Confirm before build.
```

### 5 — Dismiss interaction (every card, every state)

```
Tap ✕ on any card →
┌────────────────────────────────┐
│  Ignore                         │
│  Remind me later                │
│  Mark as done — I handled it    │
└────────────────────────────────┘
```

### 6 — Explore tab · rough direction only, content NOT finalized

```
┌──────────────────────────────────────┐
│ Explore                        (AM)→ │
├──────────────────────────────────────┤
│ What AmbitionBox can help with        │
│ ┌──────────────┐ ┌──────────────┐    │
│ │ SEARCH        │ │ APPLICATIONS  │    │
│ │ 4 ranked roles│ │ 15 · 3 need   │    │
│ └──────────────┘ └──────────────┘    │
│ ┌──────────────┐ ┌──────────────┐    │
│ │ INTERVIEWS    │ │ OFFER         │    │
│ │ add or detect │ │ evaluate one  │    │
│ └──────────────┘ └──────────────┘    │
│ ┌──────────────┐ ┌──────────────┐    │
│ │ OUTREACH      │ │ ADVICE        │    │
│ │ (soon)        │ │ Ask anything  │    │
│ └──────────────┘ └──────────────┘    │
├──────────────────────────────────────┤
│⌂ Home  ▤ Tracker  ⌕ Matches  ◎Explore │
└──────────────────────────────────────┘
Category-hub shape reused from the discarded "Option B" —
right for Explore's job (range), wrong for Home's (urgency).
Needs src/App.jsx (new route) + src/AppUI.jsx (nav) — shared
with Codex. Not buildable as Home-only work.
```

## What Home is (current, final)

Home lays out everything that needs Arjun, ordered by what actually matters most right
now, and explains itself like a person would — not a screen that picks one thing and files
the rest away. The proof of intelligence isn't one confident verdict; it's that the order
visibly changes when reality changes (reply to PhonePe, and Juspay rises in the queue).
This is a real revision from the earlier "one dominant pick, the rest set aside" framing —
recorded honestly as a change, not smoothed over.

## Structure, top to bottom

1. **Header** — logo, avatar → `/profile`.
2. **Chat-style greeting** — one or two sentences explaining the picture in plain language
   ("I looked across everything — 4 things need a look."), plus the live-email status line.
3. **The actionable carousel** — every actionable thing as one ordered, swipeable sequence.
   Peek-card style: same proportion as `TrackerBoard`'s kanban columns
   (`min(82vw, 310px)`), uniform size, no card bigger than another. Order = priority,
   produced by the ranking logic already built and falsifier-tested
   (`nextBestAction()` / `setAside()`). Each card: kicker, entity, headline, one-line
   reason, one CTA, and a dismiss (✕) → **Ignore / Remind me later / Mark as done**
   (dismiss state is new, local-only, not persisted — nothing in `journey` tracks it today).
4. **Composer dock** — pinned above the nav, always visible, does not replace it.
5. **Bottom nav** — Home · Tracker · Matches · **Explore**. Avatar (not the nav) is the
   door to Profile.

## Explore — in the nav, content design deliberately not started

Corrected 2026-08-18: "park it" meant don't over-design its internals yet, not exclude it
from the nav. It's the 4th tab. Content direction still stands from the reasoning trail —
the category-hub shape (Search / Applications / Interviews / Offer / Outreach / Advice as
tiles) that was wrong for Home is the right shape for Explore, since Explore's job is
showing range, not urgency. Naming risk still flagged: the old, removed journey rail used
"Explore" for what is now the Matches tab — worth being deliberate that this reuses the
word for a materially bigger idea, not confusing it with Matches.

**Cost still applies and is now committed, not optional:** a new route (`src/App.jsx`) and
a nav change (`src/AppUI.jsx`) — both shared with Codex. Home-only work cannot ship this
tab; it needs to be raised as a shared-foundation request before Explore can go live, even
though it's now agreed to belong in the nav.

## Explicitly out of this shape

- A separate "what I set aside" section — merged into the carousel.
- The journey rail — stays removed.
- A static capability-list page section — folds into moments (once real) and the
  composer's assistant-sheet index (built, Composer direction only).
- Tools tab, Prep tab — reasoning in the trail below.
- Documents — a future Profile section. Not Home's concern, not built now.

## Known gap between code and this plan

`src/Home.jsx` currently implements the **prior** resolved shape — hero card + a separate
"what I set aside" list beneath it, already built and falsifier-verified. It does **not**
yet implement the unified carousel above. That rebuild has not started.

---

# Reasoning trail (historical, superseded by the summary above)

# Home — information architecture reset (2026-08-18, superseding the material-direction pass)

## Why this supersedes the section below

Three material directions (Answer/Console/Composer) were built, styled to the documented
type scale, and rejected on sight: "all are so bad, we are not able to get it." Diagnosis —
all four shared identical layout grammar (left-aligned, inset, white-card-on-grey, no real
artifact, no atmosphere) and varied only copy/labels. Skinning a structure before the
structure itself was agreed was the mistake, not the material choice. **Do not resume
styling until the IA below is settled.**

## The breadth problem

The owner named the full jobseeker journey: search, gap analysis, match quality, application
updates, **why you got rejected**, reply to a recruiter, **keep documents together**, a
**reach-out tool to recruiters**, interview prep, reach out to hiring managers/peers, offer
evaluation, general advice. Checked against the codebase directly (not memory):

| Moment | Status |
|---|---|
| Search, gaps, match quality, application updates, interview prep, offer evaluation, general advice | **Built and solid** |
| Reply to a recruiter | Built, narrow — one hardcoded PhonePe thread |
| Reach out to hiring managers/peers | Built, narrow — anonymous employee Q&A, offer-stage only |
| Why you got rejected | **Does not exist.** "Closed" in Tracker = archived, no reason |
| Document library | **Does not exist.** One hardcoded résumé filename |
| Proactive reach-out tool | **Does not exist.** Everything is inbound-reactive |

The 3 missing items are Product-layer gaps, not Home-UI gaps — `data.js` has no fixtures,
and inventing fake content on Home would be dishonest. Precedent for the honest move exists
already: `AddInterviewSheet` states outright "Manual entry isn't wired up in this prototype."

## Refined claim on capabilities (correcting an earlier overcorrection)

Earlier I argued capabilities have no tab because they attach to an object (résumé tailoring
→ a job, negotiation → an offer) and therefore belong inside that object, not on Home. Still
true for those. **Not true for objectless capabilities** — a document library isn't inside
any one job; a general reach-out tool isn't scoped to Juspay. Those have nothing to attach
to, so the "lives inside its object" argument doesn't cover them.

## Three structural options — awaiting owner decision

**A — Arbiter stays dominant, breadth lives in one small directory.** Keep the hero + "what
I set aside" as primary content (this part tested well — falsifier passed, contracts held).
Add one bounded entry point (expand the capability sheet, or a tile grid) indexing only the
objectless capabilities, with honest "not wired up yet" entries for the 3 that don't exist.
Home-only change. Keeps one dominant job per screen (`context/UX.md`).

**B — Category hub, no single hero.** Reorganize around domains (Search/Applications/
Interviews/Offer/Outreach/Advice), each a compact state-aware tile. Closest to the raw
breadth, but this is the generic-dashboard shape already rejected once, and it deliberately
breaks the one-dominant-job rule.

**C — Nav carries the breadth, Home stays thin.** Closer to the owner's own wireframe:
expand nav to more permanent destinations (a Prep tab with an empty state pre-interview, a
Tools destination for objectless capabilities). Home's only job stays "what's next." Best
resolves the tension but is the largest scope increase and needs `src/AppUI.jsx` — shared
with Codex, not Home-only.

**Recommendation:** C in direction, A as the Home-only slice buildable without a
shared-foundation request. Owner decision pending — see AskUserQuestion in this turn.

## Resolution on the 3 unbuilt capabilities (2026-08-18)

Owner's call: rejection-insight and reach-out are **moment-specific**, born in Tracker/
Matches, and Home's job is to *notice and rank them when they happen* — not to host a
directory of them. This is the same pattern the PhonePe reply already uses (a Tracker-born
moment surfaced on Home via `nextBestAction()`). Consequence: **Option A needs no new
section.** `nextBestAction()`/`setAside()` gain new candidate branches once Tracker/Matches
can produce those moments — same machinery, not a new one. This also weakens the case for a
standing "Tools" tab specifically for these two, since a moment needs good timing, not a
permanent address.

**Still open:** document library wasn't covered by this resolution — no obvious "moment,"
reads closer to a standing utility beside Profile than a Tracker-born event. Not decided.

## Structural resolution (2026-08-18): unified carousel, not hero + list

Owner's direction, superseding the hero-card + "what I set aside" split built earlier:
**one horizontal, swipeable stack of equal-format cards**, merging today's pick and the
set-aside queue into a single ordered sequence. Each card:
- full width, one in view at a time (swipe for next) — same mechanic as `TrackerBoard`'s
  kanban columns and the existing prompt-chip row, not a new pattern
- carries a dismiss (✕) → **Ignore / Remind me later / Mark as done** (for things that
  happen outside the platform and can't be auto-detected)
- ranking still comes from the same `nextBestAction()` + `setAside()` logic already built
  and falsifier-tested — only the *rendering* changes, from hero+list to a single ordered
  sequence

**This is a real definition shift**, not a restyle: Home moves from "the screen that picks
one thing" toward "the screen that lays everything out, ordered, for you to scan." The
"pick moves when your life moves" proof standard still holds (a queue that reorders is
still arbitration). "One dominant CTA" (`context/UX.md`) is preserved structurally because
only one card is ever in the viewport, even though nothing is visually bigger than anything
else — dominance now comes from position-in-view, not size.

Dismiss state (Ignore/Remind later/Mark as done) is new — nothing in `journey` currently
stores per-item dismissal. Default: local component state, not persisted across reload,
consistent with how the rest of the prototype already behaves. Flagged, not blocking.

Greeting becomes conversational/chat-styled, explaining the picture in one or two sentences
rather than a static line — closer to what "The Answer" direction already proved out.

## Navigation resolution (2026-08-18)

**Home · Tracker · Matches**, avatar → Profile. No Tools tab, no Prep tab. Three
independent lines of reasoning in this conversation converge here:
- Tools loses its reason to exist — rejection-insight and reach-out are moment-driven and
  now surface inside the carousel; documents went to Profile. Nothing distinct is left for it.
- Prep stays out — always contingent on `interviewInvited`, would need its own empty state,
  and the carousel already resurfaces it the moment it's relevant.
- Profile stays off the tab bar — a reference screen, not a returning destination,
  especially now the dock + carousel dominate primary screen real estate.
Tracker and Matches keep their tabs: both have real standalone content worth browsing on
its own terms, not just content a notification points at.

Documents: **a section inside Profile, not built now.** Not a Home concern.

## Card mechanic, resolved

Peek-style, not full-width-one-at-a-time: same proportion as `TrackerBoard`'s kanban
columns (`min(82vw, 310px)`), applied **uniformly across every card** — no first-card-bigger.
Priority shows through order alone.

## Explore — a 4th destination, under discussion, likely NOT Home's scope

Owner asked whether Home should include "everything AmbitionBox," or whether that's a
separate destination. Recommendation: **separate destination**, not Home. Reasoning:

- Home and Explore answer different questions. Home: "what needs me right now" — personal,
  urgent, priority-ordered. Explore: "what can this do for me" — calm, categorical, browsable
  regardless of urgency. Conflating them re-breaks "one dominant job per screen."
- **Reuses discarded work cleanly:** Option B (category-hub: Search/Applications/Interviews/
  Offer/Outreach/Advice as tiles) was wrong for Home but is the right shape for Explore —
  Explore's job is range, not urgency.
- Solves a real gap: nothing today shows full product range independent of journey state,
  which matters most exactly when it's least likely to happen naturally — a CEO watching
  cold, in a state with only 1-2 carousel cards.
- Naming risk: the old (removed) journey rail already used "Explore" as Matches' label. Same
  name risks reading as "this is just Matches again" — flagged, not resolved.
- **Cost, stated plainly:** new screen + new route (`src/App.jsx`) + nav change
  (`src/AppUI.jsx`) — both shared with Codex. Larger than anything else in this plan.
  Not buildable as a Home-only change. **Pending: does this join scope, and who builds it.**

## Open questions blocking any further build

1. Which structural option (A/B/C, or a hybrid).
2. How to treat the 3 unbuilt capabilities: omit from Home entirely / show as honest
   "coming soon" entries / treat as a separate Product-scoping conversation before any UI.
3. Whether "reach out to hiring managers/peers" should generalize beyond the current
   single anonymous-employee-on-offer flow — this is a Product-layer scope call, flagged
   rather than decided unilaterally.

---

# Home — definition, sections, navigation (paper draft, partially superseded above)

## Context

Three material directions were built (Answer / Console / Composer) plus today's Home as a control. The owner stopped implementation: the finish was below the references, and more importantly nobody had settled **what Home is, what sections it holds, and what navigation the app should have**. A full inventory of the codebase then produced findings that change the answer, so this supersedes the previous "build three directions" plan.

This phase produces **paper drafts only** — no code until approved.

Decisions already taken by the owner in conversation:
- **Remove the four-stage journey rail from Home.** ("Remove this from home for sure.")
- **Capability list becomes a sheet**, in the Natural AI pattern — raised from the composer, not sitting on the page. One Home version only, not all of them.
- **Draft all four navigation directions** (N1–N4).

## What Home is

> Home is the only screen that has seen everything. It looks across all of it, says **"today, this one,"** shows **what it weighed and set aside**, and opens **the tool that moves it forward — not the room that contains it.** The feeling is relief, not information. The proof is that the pick moves when your life moves.

The final clause is an amendment. Home currently fails it: the interview CTA lands on `/prep`, the offer CTA on the offer decision screen — both are rooms, not tools.

**Correction to an earlier claim of mine.** I argued the composer's job was surfacing capabilities that have no tab. That was wrong. Of the 15 capabilities that are undiscoverable cold, 13 attach to an object — a job, a round, an offer. They are steps inside one object's lifecycle, not app-level features. The proof is in my own code: `capabilities()` in `src/Home.jsx` is byte-identical across all four presets, so it cannot move when the user's life moves. The real defect is **object depth** (e.g. the relocation estimator is a button inside the 3rd of 7 cards on the offer screen) and it belongs to Offer and Prep, not Home.

## Sections — the line

**First screen:** header (avatar is the door out) → greeting + verdict in prose → live source row → **the pick**, with "why this is first" inside it.

**Below the fold:** **what I set aside** → connect-email note or time jump when they apply → ask.

**Removed:** the four-stage rail · the notification bell (no handler anywhere, and a bell on the arbiter implies a queue Home didn't consider) · the capability list as a page section.

**Rejected as belonging elsewhere:** "pick up where you left off" — a resumable task is a candidate with a strong prior, so it belongs *inside* the pick, which `nextBestAction()` already models (`prepComplete` swaps "See what to expect" → "Review my prep") · saved jobs — a shortlist exists to be compared, that is Matches · "what AmbitionBox knows about you" — that is literally `/profile`'s headline.

**Credibility fix, zero pixels:** Home hardcodes `'Arjun'` in all four directions while `journey.onboardingProfile` — the profile the user personally reviewed — sits unread. The screen that claims to have seen everything has not read the one artifact the user confirmed by hand.

## What replaces the rail: "What I set aside"

The ordered queue behind today's pick. Not navigation — arbitration evidence.

```
What I set aside                              3 things
┌────────────────────────────────────────────────────┐
│ (GO) Google · Software Engineer III        Overdue │
│      Choose interview slots                        │
│      Do this next, straight after the reply.       │
├────────────────────────────────────────────────────┤
│ (CR) CRED · Senior Backend Engineer   Due tomorrow │
│      Review assessment                             │
│      Tomorrow, not today.                          │
├────────────────────────────────────────────────────┤
│ (JP) Juspay · Senior Backend Engineer       2d ago │
│      89% Preference Match                          │
│      Best fit you have, but nobody is waiting.     │
└────────────────────────────────────────────────────┘
```

**Data** — all existing fixtures, nothing invented: `applications.attention[]` (`company`, `role`, `action`, `when`, `color`, `preferenceMatch`), `applications.waiting[]`, `jobs[]` (`preferenceMatch`), and the `interviewInvited` / `offerDetected` flags.

**The rule that keeps it honest:** every reason must be state-derived and specific. *If a reason line could be moved to another row and stay true, it is decoration and the row should be cut.* The top row states when it gets its turn, which makes the section an ordered queue rather than a list.

**Per state**
- *Reply pending* — Google, CRED, Juspay (as drawn).
- *Interview scheduled* — the PhonePe reply **drops into this list** with a date-beats-message reason. This is the clearest on-screen proof the pick moved.
- *Offer detected* — interview, reply and ranked roles all sit under one reason: "A live decision outranks everything else in your search."
- *Skipped email* — no inbox rows exist, so the queue is the other ranked roles: Zeta 86%, PhonePe 83%, Groww 76%, each with a fit reason.

**Where the rail's orphans go:** Interviews and Offer were the only two rail rows without a nav tab. "Add an interview" and "evaluate an offer" are capabilities, so they move into the capability sheet.

## The capability sheet — one direction only

Natural AI's pattern: the composer raises a sheet; the sheet carries suggestions *and* an index of what the product can do. The list never sits on the page.

```
tap composer  ──▶  ╔══════════════════════════════════╗
                   ║ ✧ Ask AmbitionBox                ║
                   ║ Uses your profile, preferences   ║
                   ║ and live applications.           ║
                   ║ ( Ask about your next move   ➤ ) ║
                   ║                                  ║
                   ║ TRY                              ║
                   ║ (What should I prioritise?)      ║
                   ║ (Roles that fit ₹22L+)           ║
                   ║ (My interview readiness)         ║
                   ║                                  ║
                   ║ AMBITIONBOX CAN ALSO             ║
                   ║ (◉) Find roles that fit me     › ║
                   ║ (▤) Tell me what a company is  › ║
                   ║     really like                  ║
                   ║ (▤) Strengthen my application  › ║
                   ║ (◔) Add or prepare an interview› ║
                   ║ ($) Evaluate an offer          › ║
                   ╚══════════════════════════════════╝
```

A static index is legitimate **inside a sheet you deliberately opened** — it is an index you asked for, not a section competing with the pick. Extends the existing `HomeAssistantSheet`; entirely Home-owned.

## Navigation — four drafts

Context: the app is already half nav-less. 6 of 11 routes (`/jobs`, `/assistant`, `/prep`, `/offer`, `/onboarding`, `/demo`) show no tabs and are exited by back arrow. That is one object at four depths and should be recorded as intentional, not debt.

| | Nav | Profile | Composer | Needs shared files |
|---|---|---|---|---|
| **N1** | Home · Tracker · Matches · Profile | tab | in page | no |
| **N2** | Home · Tracker · Matches | avatar | in page | yes |
| **N3** | none | avatar | **fixed bottom bar** | yes |
| **N4** | ask pill + Tracker · Matches | avatar | **fixed bottom bar** | yes |

N3 and N4 move the composer out of the page body into persistent chrome, freeing ~120px and making "what I set aside" load-bearing — in N3 it becomes the only way to see other applications without asking.

**Shared-foundation warning:** the bottom nav is implemented **twice** — `BottomNav` in `src/AppUI.jsx:49-65` and a hand-rolled copy inside `ProfileScreen` at `src/Onboarding.jsx:874`. N2/N3/N4 must change both or they silently diverge. `AppUI.jsx` and `Onboarding.jsx` are Codex's, so any of these needs an explicit owner request.

**Test cost:** low. Only `tests/golden-path.spec.js:23` touches the nav (`getByRole('link', {name: 'Matches'})`) and Matches survives in all four. No test clicks Profile.

## What this changes in code, once approved

Home-owned, no coordination needed:
- `src/Home.jsx` — delete `JourneyRail` + `journeyStages()`; add `setAside()` deriving rows from `applications`/`jobs`; remove the bell; avatar → `/profile`; read `journey.onboardingProfile` for the greeting; extend `HomeAssistantSheet` with the capability index.
- `src/home.css` — set-aside rows, sheet index; delete rail styles.

Requires an owner request to Codex's files: any of N2/N3/N4 (`src/AppUI.jsx`, `src/Onboarding.jsx:874`).

**Contract risk:** deleting the rail breaks two load-bearing accessible names asserted in `tests/onboarding.spec.js` — `/Applications 15 total · 3 need you/` and `/Explore Roles from your profile/`. Both must be re-homed onto the live-source row and the set-aside list, or the tests must be re-pointed — and `tests/` has been read-only throughout. **This needs an explicit decision before implementation.**

## Verification, when built

- `npm run build` clean; full Playwright suite green with each direction flipped to `DEFAULT_DESIGN`.
- Scratchpad harness: every design × 7 states × 360/390/430 — zero overflow, contract strings present, no ambiguous accessible names, touch targets ≥44px.
- **Set-aside falsifier:** capture the section under presets `tracker`, `resume`, `interview`, `offer`. If fewer than 3 of 4 produce *both* a different row set *and* different reasons, it is the rail renamed — cut it.
- Contracts per design: `?action=phonepe` → ReplySheet · `?action=add-interview` · nav round-trip preserves design · the PhonePe→Juspay rerank animates.
- Reduced motion renders everything immediately.

## Risks

1. **"What I set aside" becomes the rail with a nicer heading.** Falsified by the capture test above, and by the swap test on every reason line.
2. **The Google "Overdue" row exposes the ranking.** Home tells the user to answer a 2-hour-old email while an overdue scheduling task sits below it. Surfacing that is deliberate, but if the reason is not airtight a viewer reads it as a bad rank. Fix belongs in `nextBestAction()`'s priority order, not the layout.
3. **Deleting the rail loses "everything is connected"** — the one thing the presenter script says about Home. The replacement must carry that read, or the demo's only Home claim goes with it.
