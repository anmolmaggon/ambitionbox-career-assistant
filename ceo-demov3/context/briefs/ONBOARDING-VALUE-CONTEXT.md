# Change Brief - Onboarding Value Context

> Profile value density and the expanded preference set are superseded by [Preference Refinement and Job Curation](ONBOARDING-PREFERENCES-AND-CURATION.md). First Open direction in this brief remains active.

**Screens:** `/onboarding?step=welcome&preset=baseline`, `/onboarding?step=profile-review&preset=baseline`, and `/onboarding?step=preferences&preset=baseline`  
**Desired outcome:** Give the first-open promise more character and sequential storytelling, then explain what the reviewed profile and preferences will do for the user.  
**Permitted layers:** Product articulation, Copy, UX, and UI for First Open, Naukri Profile Review, and Naukri Preferences.  
**Protected layers:** Authentication structure and provider hierarchy; canonical data; routes, journey state, and handoff behavior; imported profile sections and editors; preference editors; Import, Email, Home, and all secondary branches.  
**References:** MOB-ONB-004 and MOB-ONB-007 for terse icon-led benefits; MOB-ONB-009 for restrained category colour and grouped hierarchy.  
**Current lock state:** Product, Copy, UX, and UI are all `draft`.

## Direction

- Keep the existing three-point First Open story, but give each point a distinct pastel icon treatment within the AmbitionBox blue field.
- Reveal the connecting line and benefits once, from top to bottom. The sequence communicates match, reality, then guidance. Reduced motion renders the complete state immediately.
- On Profile Review, make the user benefit visible before the imported profile in one concise supporting sentence.
- On Preferences, state that the imported values and optional refinements control ranking rather than eligibility, and make clear that they remain editable.
- Keep the branch-aware progress header. It gives orientation on the long review screens and remains visually subordinate to the screen job.

## Constraints

- Use the established Lucide family and Figtree system; do not introduce emoji rendering differences or a second icon library.
- Do not add illustration, gradients, scores, or generic AI theatre.
- Do not duplicate the detailed profile or preference values in a second card.
- Motion must animate only transform and opacity, run once, and respect reduced-motion preference.

All affected screens remain draft until the owner explicitly says **lock**.
