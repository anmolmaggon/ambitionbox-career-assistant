# Change Brief - Naukri Profile Review

**Screen:** `/onboarding?step=profile-review&preset=baseline` on the Naukri golden path  
**Desired outcome:** Make a comprehensive Naukri career-profile transfer understandable, checkable, and correctable without becoming a long form.  
**Permitted layers:** Profile Review Copy, UX, UI, edit-flow typography, and the shared CTA-radius rule.  
**Protected layers:** Product data, profile sections, routes, progress semantics, Preferences behavior, secondary-source review behavior, Home, and sibling projects.  
**References:** MOB-ONB-009 for calm grouped surfaces and row hierarchy; BRAND-NAU-001 for source continuity.  
**Current lock state:** Product `draft` · Copy `draft` · UX `draft` · UI `draft`.

## Current critique

- The owner has expanded the product contract from a thin autofill to the complete career-relevant Naukri profile. The current seven-field surface is therefore structurally obsolete.
- The current continuous profile surface is directionally correct and keeps every field editable.
- The imported source sits outside the profile artifact, so the relationship between Naukri and the data feels weaker than it did on the import screen.
- Four equal full-width rows make the most scannable facts feel longer and more settings-like than necessary.
- Source, identity, facts, skills, and résumé need a clearer internal hierarchy without becoming separate cards.

## Direction

- Import the complete career-relevant Naukri profile defined in `PRODUCT.md`; exclude gender.
- Use review by exception only for literal source gaps. Do not infer that a value is stale, conflicting, or needs confirmation during onboarding.
- Organise detail into professional summary, experience, skills and evidence, education, accomplishments, résumé, and job preferences.
- Keep complete sections compact or collapsed and make each section expandable and editable.
- Distinguish Naukri profile values, résumé-derived values, and AmbitionBox inferences.
- Confirm career facts here; keep imported preferences for the dedicated next step.
- Call the result the user's profile, with compact Naukri provenance. Do not call it a “Naukri profile.”
- Remove the compensation freshness inference and the redundant Profile/Résumé/Preferences inventory.
- Keep notice period empty in the fixture and expose a working Add sub-row directly beneath Professional details, not as a standalone section.
- Use restrained category colour for row icon tiles and a pill-shaped **Confirm profile** CTA.
- Treat every text-labelled action—including contextual Edit actions—as a pill. Keep icon-only utilities and disclosure rows distinct.
- Use readable 14–15px working type for core content instead of shrinking rows to expose more information above the fold.
- Add delight through the factual autofill outcome: **Your profile, autofilled in seconds**. Use an AmbitionBox × Naukri lockup for the relationship and no separate decorative speed icon.
- Attach the Naukri autofill receipt to the profile surface as its header. It shares the surface's border and radius, with an internal divider and no card gap.
- The previous two-column seven-field matrix remains implementation evidence only and is superseded as the target structure.
- The screen remains draft until the owner explicitly says **lock**.

## Critique pass 1 - hierarchy and density

- The attached source header now makes the payoff felt—profile autofill in seconds—while clearly qualifying the profile directly below it.
- A literal missing notice period demonstrates review by exception inside its native Professional details section without adding inferred intelligence.
- Identity remains open because it orients the user. Profile summary now leads the seven detailed sections as a collapsed accordion with its headline as the preview.
- Larger working type intentionally exposes fewer rows above the fold; the complete profile remains scrollable and the persistent primary action stays available.

## Critique pass 2 - alignment, detail, and accessibility

- Source receipt, missing-field treatment, 14–15px core type, section labels, and the fixed action remain aligned and unclipped at 360px, 390px, and 430px.
- Each disclosure uses a full-width button with explicit expanded state; each section exposes a working edit action in an accessible bottom sheet.
- Confirm, Add, Save, and contextual Edit actions use pill geometry; icon-only edit and navigation utilities retain role-appropriate shapes.
- The canonical AmbitionBox × Naukri lockup preserves both product ownership and source continuity without another decorative icon.
- Long résumé and section summaries truncate safely while expanded details wrap naturally.
- No decorative motion was added. Disclosure changes are immediate and reduced-motion safe.
- The current evidence is `output/playwright/current/onboarding-profile-review-390.png`.
- A concise **What this profile unlocks** list now explains the user value before the imported detail: matched roles, visible gaps, and tailored application guidance. It does not duplicate profile facts.
- Build, 11 onboarding tests, and 90 responsive checks pass. The screen remains draft pending explicit owner lock.
- The latest attached-header refinement additionally passed the golden-path interaction and Profile Review overflow checks at 360px, 390px, and 430px.
- The latest missing-field hierarchy refinement also passed the Add/save interaction and Profile Review overflow checks at all three widths.
