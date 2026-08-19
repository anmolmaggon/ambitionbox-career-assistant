# Change Brief - Optional Application Email

**Screen:** `/onboarding?step=email&preset=baseline`  
**Desired outcome:** Convert the premium value promise into an informed provider decision: AmbitionBox is already finding relevant roles, while the user understands the inbox consequence, trust boundary, and available choices.  
**Permitted layers:** Copy, UX, UI, and one motivated entry sequence inside the Email Connection screen.  
**Protected layers:** Product capabilities and trust claims; optionality; Curation collapse; branch-aware progress; Gmail and other-email account sheets; scan/import behavior; Home handoff state; runtime fixture data; shared foundations and sibling projects.  
**References:** MOB-ONB-005 for a bold direct headline plus one concrete product artifact, MOB-ONB-007 for primary/secondary action hierarchy, and MOB-ONB-008 for the hard visual division between a coloured pitch world and a white decision world.  
**Current lock state:** Product `draft` · Copy `draft` · UX `draft` · UI `draft`.

## Direction

- This screen follows the distinct [Premium Email Assistance Pitch](ONBOARDING-EMAIL-PITCH.md). Do not repeat its three-step product theatre or remove its value-to-permission separation.
- Keep Email Connection persuasive without reducing it to a permission settings screen.
- Keep a compact live status at the top: **We’re finding the roles that fit you.** This carries the Curation consequence forward without repeating its full animation.
- Bridge the two simultaneous activities with **Meanwhile**.
- Lead the email pitch with the opportunity consequence: **The right opportunity shouldn’t get lost in your inbox.**
- Show one native product example: a recruiter reply becomes a **Review today** action on Home.
- Keep the example generic so the screen does not imply that AmbitionBox has read an inbox before permission.
- Separate the campaign and decision worlds: confident AmbitionBox blue above, quiet white trust and provider actions below.
- Put the read-only boundary directly before the provider actions and keep it compact.
- Use **Connect Gmail**, **Connect another email**, and **Set up later** so sign-in and inbox permission remain distinct.
- Reveal the pitch and proof once. Only the three matching dots loop because they communicate genuine ongoing work.
- Reduced motion shows the complete pitch and static matching status immediately.

The screen remains draft until the owner explicitly says **lock**.

## Critique pass 1 - hierarchy and density

- The live matching status, emotional email promise, one product consequence, and white decision section form four clear levels. The screen no longer reads as a settings form.
- The recruiter-reply example is generic and explicitly framed as a transformation, so it demonstrates value without implying pre-permission inbox access.
- The primary Gmail action is dominant; another email remains fully visible; later stays available without competing.

## Critique pass 2 - alignment, detail, and accessibility

- Core heading and body type remain readable at all three target widths. Supporting metadata is subordinate but not used for essential instructions.
- The blue pitch and white action section create an unmistakable campaign-to-decision transition while the permission boundary stays attached to the connection controls.
- All text-labelled actions use full pill radii and preserve minimum touch heights.
- The proof sequence animates only transform and opacity, runs once, and renders immediately under reduced motion. Ongoing dots stop under reduced motion.
- Visual captures at 360px, 390px, and 430px show no clipping or horizontal overflow.

## Current evidence

- `output/playwright/current/onboarding-email-360.png`
- `output/playwright/current/onboarding-email-390.png`
- `output/playwright/current/onboarding-email-430.png`
- `output/playwright/current/onboarding-email-reduced-motion-390.png`
