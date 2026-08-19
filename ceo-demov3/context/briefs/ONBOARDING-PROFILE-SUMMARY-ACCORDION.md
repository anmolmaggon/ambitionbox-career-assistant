# Change Brief - Profile Summary Accordion

**Screen:** `/onboarding?step=profile-review&preset=baseline` on the Naukri golden path  
**Desired outcome:** Keep the imported professional summary available and editable without forcing a long text block open during the initial profile scan.  
**Permitted layers:** Profile Review UX and UI for the professional-summary disclosure only.  
**Protected layers:** Imported profile copy and data, source provenance, identity, other profile sections, missing-field behavior, CTA, routes, progress, Preferences, Home, and sibling projects.  
**References:** MOB-ONB-009 for a continuous grouped surface and clear disclosure-row hierarchy. The owner-provided crop is current implementation evidence, not an external reference.  
**Current lock state:** Product `draft` · Copy `draft` · UX `draft` · UI `draft`.

## Direction

- Keep name, current role, and employer immediately visible as identity context.
- Move the profile headline and full professional summary into the first accordion in the profile detail list.
- Use the profile headline as the collapsed preview and reveal the full paragraph only on request.
- Keep the existing focused Profile summary editor reachable from inside the expanded accordion.
- Start collapsed, like the other complete imported sections. Missing information remains the only detail elevated by default.
- Preserve the single continuous AmbitionBox × Naukri surface and all downstream behavior.

The screen remains draft until the owner explicitly says **lock**.

## Critique pass 1 - hierarchy and density

- The default view now establishes source and identity, then begins one consistent list of reviewable sections.
- The headline provides enough information to recognise the imported summary without exposing a long paragraph before the user asks for it.
- Notice period remains the only elevated exception, so the review-by-exception hierarchy is preserved.

## Critique pass 2 - alignment, detail, and accessibility

- The collapsed preview truncates safely at 360px, 390px, and 430px with no horizontal overflow.
- The expanded paragraph remains 14px with comfortable line height, followed by the imported headline and a pill-shaped edit action.
- The summary button exposes its expanded state and the existing focused editor remains reachable.
- Build, context integrity, focused golden-path interaction, and three responsive overflow checks pass.
- Current evidence: `output/playwright/current/onboarding-profile-review-390.png` and `output/playwright/current/onboarding-profile-summary-expanded-390.png`.
