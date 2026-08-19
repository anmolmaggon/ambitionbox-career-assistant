# Change Brief - Premium Email Assistance Pitch

**Screen:** `/onboarding?step=email-pitch&preset=baseline`  
**Desired outcome:** Sell the connected-search experience as a premium advantage before asking the user to choose an email provider. The user should understand that AmbitionBox can stay across every application and help at the moments that change what happens next.  
**Permitted layers:** Product, Copy, UX, and UI for the new pre-email screen and its entry and exit transitions.  
**Protected layers:** Profile and Preferences; Curation content; branch-aware progress count; Email Connection provider and trust choices; email optionality; Gmail and other-email account sheets; Secure Scan; import result; Home handoff state; canonical runtime data; shared foundations; sibling projects.  
**References:** MOB-ONB-015 for consequential product theatre, MOB-ONB-016 for one personalised explanation and a later choice, MOB-ONB-017 for a cinematic hero plus grouped proof, and MOB-ONB-018 for a quiet premium canvas and anchored action.  
**Current lock state:** Product `draft` · Copy `draft` · UX `draft` · UI `draft`.

## Direction

- Insert one user-controlled marketing beat between Curation and Email Connection.
- Lead with **Your whole job search, one step ahead.**
- Explain the email consequence in one short sentence: **Connect your application email. AmbitionBox spots what changed, prepares what comes next, and helps you act in time.**
- Demonstrate the breadth through one native living journey, not feature cards or a fake app screenshot:
  - Recruiter reply -> Draft the right response
  - Interview invite -> Prepare for the real round
  - Offer received -> Compare, negotiate, decide
- Let the connected line and the three assistance moments reveal once from top to bottom. Reduced motion shows the finished state immediately.
- Use one dark, cold-luxury AmbitionBox canvas, restrained inner borders, a single electric-blue accent, and no gradients, glass, generic AI sparkle, stock imagery, or 3D illustration.
- Use **Connect my search** to open the existing Email Connection decision screen. Preserve **Set up later** on this pitch and again on Email Connection.
- Keep the same semantic Application Tracking progress stage. This is a value beat within that stage, not a fabricated extra setup step.

The screen remains draft until the owner explicitly says **lock**.

## Critique pass 1 - hierarchy and density

- The outcome-led headline, single conditional explanation, connected three-moment artifact, and anchored action create one clear selling sequence.
- Value and permission are no longer competing on one surface. Provider logos and privacy mechanics appear only after **Connect my search**.
- Generous negative space keeps the screen premium without hiding the product proof or pushing the primary action below the viewport.

## Critique pass 2 - alignment, detail, and accessibility

- The solid cold-navy canvas, restrained inner border, and electric-blue nodes remain consistent at 360px, 390px, and 430px without horizontal overflow.
- Signal labels are subordinate, assistance outcomes carry the row hierarchy, and every essential text size remains within the onboarding type rules.
- The connected line and moments reveal once with transform and opacity. Reduced motion renders the complete artifact immediately.
- The primary and later actions retain full-pill or text-button semantics and 44px minimum touch targets.

## Current evidence

- `output/playwright/current/onboarding-email-pitch-360.png`
- `output/playwright/current/onboarding-email-pitch-390.png`
- `output/playwright/current/onboarding-email-pitch-430.png`

## Copy self-audit

- **Your whole job search** refers to the user's active applications and steps, not their entire career.
- **One step ahead** is supported by the concrete reply, interview, and offer assistance shown on the same screen.
- **Spots what changed** becomes true only after the user connects email; the supporting sentence begins with that condition.
- No copy implies that AmbitionBox sends, accepts, applies, or negotiates automatically.
