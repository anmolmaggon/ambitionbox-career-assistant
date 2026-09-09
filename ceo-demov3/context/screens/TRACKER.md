# Tracker

The third tab. Owner: Claude. All layers `draft`.

## Job

One screen that shows where every application stands, and lets the user correct it.
The set comes from a read-only scan of the last 90 days plus anything added by hand.

## One model: the pipeline

Rebuilt 2026-08-19 on owner feedback. Tracker used to carry **three** organising models
at once — a stat row that filtered, a *Do Next* section, and a kanban behind a toggle —
and they disagreed with each other. There is now one:

    Shortlisted → Applied → Recruiter review → Recruiter shortlist → Interviewing → Offer → Closed

Defined once in `applicationStages` (`src/data.js`). Every item sits in exactly one
stage. **List** renders the pipeline vertically as labelled, collapsible groups;
**Board** renders the same stages horizontally. Both read one derived array, so their
counts cannot drift — they used to (List said 8 closed, Board said 6).

### The two shortlists

"Shortlist" was doing three jobs at once — the roles you save in Jobs, the recruiter
picking you, and a likelihood chip — so each now names its actor:

- **Shortlisted** leads the pipeline: the user's own saved roles, not applied to yet.
  Owner instruction 2026-08-19 — the search starts when you pick a role, not when you
  send the form. Built from `journey.savedJobs`; a saved role whose company already has
  an application is dropped, because it is tracked further down and would appear twice.
- **Recruiter shortlist** is the other direction: they picked you.
- The "Shortlist outlook" chip is **gone** — see Evidence below.

Saved roles are the one stage that is not an application. They stay out of the 15 the
scan reports and out of the Tracked-from counts — a saved role has no source to trace,
the user picked it — and are named beside the headline instead: *"+ 2 saved roles you
have not applied to."*

### Chips and collapse

A chip row above the list carries **All** plus every stage with its count, using the Jobs
feed's chip shape; selecting one filters to that stage. Each section header is a banded
52px disclosure that visually owns its cards — it was a quiet 13px label on the same
canvas and did not read as a section at all. **Closed starts collapsed**: seven finished
applications should not stand between the user and the stages that still need them.

*Do Next* is gone. Attention lives in the card — a card with something to do carries an
action button; one without does not — rather than in a section that duplicated the list.

## Moving an application

Every card, in both views, carries **Move**. It opens a sheet listing the six stages with
the current one marked, and the pick writes to `journey.applicationStages` keyed by
application id. A user move always beats the imported stage; nothing else rewrites it.

Deliberately **not** drag-and-drop: a six-column board on a 430px phone has no honest
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

Closed cards are flat, muted, and carry **no match score**: showing a percentage beside
a rejection invites a second look at something there is nothing left to do about.

## Board

Kept on the owner's instruction, 2026-08-19. It renders the **same `ApplicationCard`**
List does — it had a card of its own, and the two drifted twice: board type ran at 8–9px
against the list's 13–15px, and the match score was a `.job-score` block in List but a
small grey chip in Board. Sharing the component makes that class of drift impossible,
the same way sharing `grouped` made the counts impossible to disagree.

The column is sized to hold the real card (`min(88vw,344px)`) rather than a shrunken copy
of it, and columns size to their own content instead of stretching to the tallest — a
seven-card Closed column was leaving every other column with a long empty tail.

## Evidence rule

Every signal on a card traces to a field:

| Signal | Traces to |
|---|---|
| `84% Match` | the confirmed preferences |
| `Applied 4d ago` / `Recruiter viewed` | the scanned email |
| `10/15 profile evidence` | `journey.readiness` |
| `Gmail` / `Naukri` / `Saved by you` | how the item entered Tracker |

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

`src/data.js` is canonical. The applications total **15**, the number the scan reports: 2 applied, 2 in recruiter
review, 2 in recruiter shortlist, 2 interviewing, 0 offers, 7 closed. The `tracker` and
`matches` presets also seed `savedJobs: ['zerodha', 'setu']` so the first stage is
legible on arrival; neither company has an application, so nothing double-counts.
Juspay is assembled in `TrackerScreen` rather than the fixture — it is the golden path's
interview and has never lived in `applications`. Closed companies are disjoint from the
Jobs feed, so nothing a user was rejected from resurfaces as a role to find.
