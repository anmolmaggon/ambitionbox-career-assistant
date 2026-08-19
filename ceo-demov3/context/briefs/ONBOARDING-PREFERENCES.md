# Change Brief — Naukri Preferences Review

> The current field set, source copy, and post-confirmation route are superseded by [Preference Refinement and Job Curation](ONBOARDING-PREFERENCES-AND-CURATION.md). This file preserves the earlier iteration without competing with the active brief.

**Screen:** `/onboarding?step=preferences&preset=baseline` on the Naukri golden path  
**Desired outcome:** Turn imported preferences into a fast, source-aware verification step so the user can confirm what should rank first without completing another form.  
**Permitted layers:** Product, Copy, UX, and UI for the Naukri Preferences screen.  
**Protected layers:** Profile Review; email and later screens; routes, store, canonical fixture data, and handoff state; Google, Apple, résumé, and manual screen structure.  
**References:** MOB-ONB-009 for a calm continuous row surface; BRAND-NAU-001 and the established AmbitionBox × Naukri provenance rule.  
**Current lock state:** Product, Copy, UX, and UI are all `draft`.

## Screen job

Confirm the imported preferences that decide which opportunities rise first. This screen does not establish eligibility and must not feel like a blank application form.

## Implemented draft

- Heading: **Let’s make sure the right jobs rise first.**
- Supporting copy explains that the imported preferences decide which jobs rise first and never block exploration or applications.
- One attached AmbitionBox × Naukri source header above one continuous review surface.
- Five editable rows: target role, minimum compensation, preferred locations, work mode, and employment type.
- The attached header attributes **Your job preferences from Naukri** and makes continued editability explicit.
- Four optional refinements—companies, tech stacks, role level, and industries—follow the imported five without becoming required.
- Category colour stays local to icon tiles; the page remains visually quiet.
- Tapping a row opens a focused sheet. Text values use an input, true choices use single- or multi-select chips.
- Primary CTA: **Confirm preferences**.
- The generic secondary-branch form remains unchanged in this slice.

## Protected behavior

- Canonical values continue to come from `src/data.js`.
- Progress remains branch-aware: Naukri Preferences is step 3 of 4.
- Confirming persists the current edited draft, shows the automated cross-source Curation consequence, and then continues to optional application-email setup.
- No preference is presented as an eligibility gate.

## Verification

- Production build passes.
- The Naukri golden-path regression, focused edit sheet, and Home handoff pass.
- 360px, 390px, and 430px responsive checks pass without horizontal overflow.
- Current evidence: `output/playwright/current/onboarding-preferences-{360,390,430}.png`.

This screen remains draft until the owner explicitly says **lock**.
