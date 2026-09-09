# AmbitionBox V3 — Start Here

This folder is the model-neutral source of truth for the CEO Demo V3. It exists so Codex, Claude, and future collaborators reconstruct the same product and do not infer intent from old screenshots.

## Instruction precedence

1. The owner's latest explicit instruction in the current conversation
2. A layer marked `locked` in `STATUS.md`
3. The relevant screen contract
4. The Product, Copy, UX, and UI playbooks
5. Historical feedback and references
6. Existing draft implementation

`src/data.js` is canonical for runtime people, companies, counts, compensation, dates, sources, and journey fixtures. Documentation explains meaning and constraints; it must not silently fork those values.

## Mandatory task intake

Before changing a screen, establish:

- **Screen:** the exact state or route
- **Outcome:** what should improve
- **Permitted layers:** Product, Copy, UX, and/or UI
- **Protected layers:** everything outside the permitted scope
- **References:** specific catalogue IDs, or none
- **Lock state:** read from `STATUS.md`

If a consequential item is unclear, ask the owner. If the request already answers it, proceed without repeating the question.

## Read only what the task needs

- Product promise or capability: [PRODUCT.md](PRODUCT.md)
- Words or tone: [COPY.md](COPY.md)
- Structure, navigation, or states: [UX.md](UX.md) and [JOURNEY.md](JOURNEY.md)
- Styling, components, imagery, or motion: [UI.md](UI.md) and [the reference catalogue](../references/CATALOG.md)
- Onboarding: [screens/ONBOARDING.md](screens/ONBOARDING.md)
- Home: [screens/HOME.md](screens/HOME.md)
- Tracker: [screens/TRACKER.md](screens/TRACKER.md)
- Owner feedback or rejected directions: [FEEDBACK.md](FEEDBACK.md)

For any user-facing wording, pitch, naming, CTA, or trust-language change, also read and follow [the shared copywriting skill](../.agents/skills/ambitionbox-v3-copywriting/SKILL.md).

## Ownership

- **Codex owns:** brand opening, first-open hero, Naukri/Google/Apple entry, profile construction and review, preferences, optional email, scan, import result, and Home handoff state.
- **Claude owns:** all Home content, hierarchy, components, and visual behavior after the handoff.
- **Shared foundations:** tokens, runtime data, state, routing, global components, and this context. Change them only when the user's task explicitly includes them.

Models may read every workstream. They edit only their owned area.

## Lock semantics

- All current layers are `draft`.
- Only the owner's explicit word **lock** can set a layer to `locked`.
- “Build it,” “move on,” and completed implementation do not lock anything.
- A later change to a locked layer requires the owner to explicitly reopen it.

## Artifact boundary

- `references/inbox/` is the owner drop zone. Any non-README file there is unprocessed and must be moved, checksummed, and catalogued before design work.
- `references/` contains intentional external inspiration.
- `output/playwright/current/` contains current implementation evidence.
- `output/playwright/archive/` contains history and is never design direction.
- Prototype, QA, and generated AI images are not references unless the owner explicitly promotes one.

## Current resume point

The active refinement is the [Unified Email Connection](briefs/ONBOARDING-EMAIL-UNIFIED.md). Preferences now open one light campaign screen that sells timely help across recruiter replies, interviews, and offers while presenting Gmail, another email, trust, and an optional header Skip in the same decision. Curation is parked outside the live flow but remains query-addressable. Account sheets, scan, import result, and the Home handoff contract are unchanged. All affected screens remain drafts.
