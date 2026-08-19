---
name: ambitionbox-v3-workflow
description: Keep AmbitionBox CEO Demo V3 product, copy, UX, UI, references, screen locks, workstream ownership, and implementation aligned. Use for every review, redesign, copy change, UX change, UI change, or code change inside ceo-demov3/.
---

# AmbitionBox V3 workflow

Treat `context/` as the model-neutral source of truth. Keep this skill procedural and do not duplicate project facts here.

## Start every task

1. Read `context/START_HERE.md` completely.
2. Confirm that the requested screen belongs to the active model's workstream.
3. Read the screen contract and only the Product, Copy, UX, or UI playbooks relevant to the request.
4. Establish a change brief with:
   - screen and desired outcome;
   - permitted layer or layers;
   - protected layers;
   - references to use;
   - current lock state.
5. If the user's request leaves a consequential item above ambiguous, ask before editing. Do not ask for information already present in the request or context.

## Respect change layers

- **Product:** user problem, promise, capability, truth, source, or journey outcome.
- **Copy:** visible words, tone, labels, CTA language, and trust wording.
- **UX:** information order, screen sequence, navigation, inputs, optionality, and interaction behavior.
- **UI:** typography, spacing, colour, components, imagery, icons, and motion.

Change only permitted layers. Record useful cross-layer ideas without implementing them. Treat shared foundations, state, navigation, and tokens as protected unless the change brief explicitly includes them.

## Handle references and feedback

- Inspect `references/inbox/` before design work. Every non-README file there is an unprocessed owner reference.
- Move each inbox file to a stable descriptive path under `references/`, then catalogue it before use. Never delete the only saved copy.
- Copy every intentional user-provided design reference into `references/` before using it.
- Add its provenance, checksum, learning, non-learning, affected layer, and status to `references/CATALOG.md`.
- Never treat prototype screens, generated QA captures, or rejected AI imagery as design inspiration.
- Convert material owner feedback into a durable rule in `context/FEEDBACK.md`.

## Locking and ownership

- Treat every screen and token as draft unless `context/STATUS.md` explicitly says `locked`.
- Update a layer to `locked` only when the owner explicitly uses the word **lock** for that layer or screen.
- Do not interpret “build it,” “move on,” implementation, or successful QA as a lock.
- Codex owns Onboarding through the Home handoff. Claude owns Home. Shared foundations require explicit scope.

## Complete a screen

1. Preserve all protected layers and existing journey invariants.
2. Implement the permitted slice.
3. Verify behavior and responsive layout at 360px, 390px, and 430px.
4. Perform hierarchy/density and alignment/detail critique passes for UI work.
5. Update the screen contract, current evidence link, and feedback record.
6. Keep the layer marked `draft` until explicitly locked.

## Required project reading

- Product work: `context/PRODUCT.md` and `src/data.js`.
- Copy work: `context/COPY.md`.
- UX work: `context/UX.md` and `context/JOURNEY.md`.
- UI work: `context/UI.md` and the relevant entries in `references/CATALOG.md`.
- Onboarding: `context/screens/ONBOARDING.md`.
- Home: `context/screens/HOME.md`.

Never modify frozen sibling projects. Preserve simulated-integration disclosures, source boundaries, explicit unknowns, review-before-send behavior, and the distinction between Preference Match and Profile Readiness.
