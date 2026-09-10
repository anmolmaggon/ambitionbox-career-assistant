# Tracker

The third tab. Owner: Claude. All layers `draft`.

## Job

One screen that shows where every application stands, and lets the user correct it.
The set comes from a read-only scan of the last 90 days plus anything added by hand.

A card's action opens the same thread Home opens — see [FLOW.md](FLOW.md). Two ways of
handling one recruiter reply, written separately, is how two screens start disagreeing
about what the product does.

## One model: the pipeline

Rebuilt 2026-09-10 on Pranoy's instruction. Seven stages became five:

    Applied → Interview scheduled → Offer → Ghosted → Rejected

Defined once in `applicationStages` (`src/data.js`). Every item sits in exactly one stage.
**List** renders the pipeline vertically as labelled, collapsible groups; **Board** renders
the same stages horizontally. Both read one derived array, so their counts cannot drift.

### What changed, and why

- **Shortlisted left.** A role saved but never applied to is a Jobs concept. It has no
  source to trace and nothing to track, and it was the one column here holding something
  that was not an application. Jobs owns it now, behind the bookmark. This supersedes the
  2026-08-19 instruction that put it at the head of the pipeline.
- **Recruiter review and Recruiter shortlist folded into Applied.** A recruiter reading
  you, or picking you for a next round with no date attached, is a signal on the card — the
  meta line and the provenance line both carry it. It is not a place the application moved
  to.
- **Interview scheduled means a slot exists**, and carries two phases. `pre` is a booked
  or offered round; `post` is a round that has happened and is waiting on a debrief. One
  stage, two faces, because the card is the same card and a second round puts it back in
  `pre`.
- **Closed split by cause.** Its two halves need opposite things from the user: a
  rejection is over, silence is not.

### Ghosted is not a step

It cuts across the pipeline. An application can fall quiet after you apply, after an
invite, or after you interview, so a ghosted card keeps `ghostedFrom` and says on its face
where it fell from — *"Applied 52d ago · no reply"*, *"Interviewed 14d ago · no update"* —
and the follow-up it offers is written for that origin.

Thresholds live in `ghostRules`. The clock counts days of **nothing at all** and resets on
any signal — an email, a recruiter view, a calendar change, or the user editing the card.

| From | Days | Why this number |
|---|---|---|
| Applied | 45 | Pranoy's number |
| An unanswered invite | 7 | They offered slots; a week of silence on their own offer is not patience |
| A round that happened | 10 | Someone owes you an answer about a conversation you both had |

Offer and Rejected never ghost. One has its own clock inside the offer flow, the other is
finished. A follow-up buys `ghostFollowUpGrace` (14) more days before North offers to
close the application; closing it moves the card to Rejected with a note that the user
closed it, not the company.

**Ghosted deliberately does not collapse on arrival.** Rejected does. The quiet ones are
the applications most likely to be forgotten, which is the entire reason they have a stage.

### Provenance: who moved this

Every card carries a line naming who moved it, from where, and how. North's own moves say
what it detected and offer an **Undo**; a move the user made says *"You moved this"* and
is never rewritten.

Until a card said this on its face, the Gmail claim — North reads your inbox and keeps the
board current — lived only in the pitch. The mark is the **needle, not a sparkle**:
`context/UI.md` rules sparkles out by name as the generic sign for "an AI did something",
and whose move this was is exactly what the line is reporting.

### Chips and collapse

A chip row above the list carries **All** plus every stage with its count, using the Jobs
feed's chip shape; selecting one filters to that stage. Each section header is a banded
52px disclosure that visually owns its cards — it was a quiet 13px label on the same
canvas and did not read as a section at all. **Rejected starts collapsed**: finished
applications should not stand between the user and the stages that still need them.

*Do Next* is gone. Attention lives in the card — a card with something to do carries an
action button; one without does not — rather than in a section that duplicated the list.

## Moving an application

Every card, in both views, carries **Move**. It opens a sheet listing the five stages with
the current one marked, and the pick writes to `journey.applicationStages` keyed by
application id. A user move always beats the imported stage; nothing else rewrites it.

Deliberately **not** drag-and-drop: a five-column board on a 430px phone has no honest
drop target, and the affordance has to exist in the vertical list too.

## Summary surface

Period, total, Synced badge; then an internal divider and the **Tracked from** row —
Gmail, Naukri, and Added by you with counts. Provenance shares the surface's border
rather than floating in a second card (UI.md's rule for a source header qualifying a
whole surface). This replaced the three-way stat filter: the stages are the filter now.

## Card

One shape for every application at every stage, typeset against `.job-id__*` in the Jobs
feed so the two tabs read as one product: company 13px/800, **role 15px** as the line
that carries the eye, metadata 11px, full-pill 44px actions, and the same `.job-score`
match block. The old card ran a 14px company over an 11px role with a 38px
rounded-rectangle button — the role, which is what the user scans for, was the smallest
line on the card.

Rejected cards are flat, muted, and carry **no match score**: showing a percentage beside
a rejection invites a second look at something there is nothing left to do about.

## Board

Kept on the owner's instruction, 2026-08-19. It renders the **same `ApplicationCard`**
List does — it had a card of its own, and the two drifted twice: board type ran at 8–9px
against the list's 13–15px, and the match score was a `.job-score` block in List but a
small grey chip in Board. Sharing the component makes that class of drift impossible,
the same way sharing `grouped` made the counts impossible to disagree.

The column is sized to hold the real card (`min(88vw,344px)`) rather than a shrunken copy
of it, and columns size to their own content instead of stretching to the tallest — a
long Rejected column was leaving every other column with an empty tail.

## Evidence rule

Every signal on a card traces to a field:

| Signal | Traces to |
|---|---|
| `84% Match` | the confirmed preferences |
| `Applied 4d ago` / `Recruiter viewed` | the scanned email |
| `10/15 profile evidence` | `journey.readiness` |
| `Gmail` / `Naukri` / `Added by you` | how the item entered Tracker |
| `Recruiter reply detected · Gmail · 2h ago` | `movedBy`, `movedVia`, `movedAgo` |
| `Applied 52d ago · no reply` | `ghostedFrom` and `silentDays` against `ghostRules` |

A **"Shortlist outlook: Promising"** chip sat on the card until 2026-08-19. It was three
hardcoded adjectives in the fixture with no derivation, no source, and no consumer other
than the JSX that printed it — the only claim on the card that stood on nothing. Removed
on owner challenge.

Predicting an application's odds needs applicant volume and hiring-funnel data.
AmbitionBox has employee-reported pay and reviews, not that. Do not reintroduce an
outcome forecast until there is a real source to put behind it.

## Search

An in-page `.job-search` field, the same shape the Jobs feed uses, with Add beside it. It
runs across the whole pipeline, not the visible stage — finding a half-remembered
application should not depend on guessing which stage it ended up in.

## Empty state

No connected email and no manual applications: the pitch, the two provider actions, the
trust line, and a quiet **Add an application yourself** — the only way in for someone who
never connects an inbox. No search field: there is nothing to search yet.

## Data

`src/data.js` is canonical. The applications total **15**, the number the scan reports:
5 applied, 3 interviewing (one of them Juspay), 0 offers, 3 ghosted, 4 rejected. The
fixture holds 14; Juspay is assembled in `TrackerScreen` because it is the golden path's
interview and has never lived in `applications`.

The fixture is **flat** as of 2026-09-10. The old shape split it three ways (attention /
waiting / closed), which was the stat model this screen already dropped — a second
grouping alongside the pipeline is exactly the disagreement that model caused. Stage is
the only grouping.

Every company with a live, ghosted or rejected application is filtered out of the Jobs
feed. Resurfacing a company that went quiet on you, or turned you down, as a fresh role to
try is the feed forgetting what Tracker knows.
