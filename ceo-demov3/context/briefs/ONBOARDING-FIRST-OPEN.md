# Change Brief — First-Open Hero

**Screen:** `/onboarding?step=welcome&preset=baseline`  
**Desired outcome:** A first-time job seeker immediately understands that AmbitionBox finds relevant roles, reveals company reality, and helps them make the opportunity count; a detected simulated Naukri profile makes starting feel effortless.  
**Permitted layers:** Copy, UX, and UI.  
**Protected layers:** Product promise, onboarding state and routes, shared foundations, and Claude-owned Home.  
**References:** MOB-ONB-003, MOB-ONB-004, MOB-ONB-007, MOB-ONB-008, and USER-ONB-001.  
**Current lock state:** Product `draft` · Copy `draft` · UX `draft` · UI `draft`.

## Current evidence

- [360px](../../output/playwright/current/onboarding-welcome-360.png)
- [390px](../../output/playwright/current/onboarding-welcome-390.png)
- [430px](../../output/playwright/current/onboarding-welcome-430.png)

## Critique pass 1 — hierarchy, density, copy, and focal action

- The three-line promise is the dominant element and the Naukri CTA is unmistakably primary.
- The profile preview acts as concrete product proof; no illustration is needed before the structure earns one.
- At 390px and 430px, the expanding blank region between benefits and authentication makes the promise and action feel like separate zones. The 360px version feels more connected.
- The first two benefits are concrete. “A stronger profile and every next step” carries too many ideas and is less specific.
- “Naukri profile found on this device” is a consequential trust claim. Because detection is simulated, its final wording and disclosure should be intentionally resolved before lock.

## Critique pass 2 — alignment, rhythm, icons, contrast, and motion

- Alignment, radii, borders, and icon containers are consistent; all three widths avoid clipping and horizontal overflow.
- The Naukri card owns the lower hierarchy without competing shadows or gradients.
- The Google lettermark and Apple dot look like placeholders beside the more authored Naukri treatment; provider identity needs a deliberate UI decision.
- Trust and legal copy are legible but visually compressed at the bottom, particularly at 360px.
- Entry motion is restrained and reduced-motion behavior is immediate.

## Hero V2 direction

- Preserve the match → truth → best-shot headline.
- Turn the three benefits into a connected vertical signal spine rather than isolated rows.
- Place the recognised Naukri identity directly after the promise with a short bridge, removing the elastic dead zone.
- Keep Naukri dominant and Google/Apple visibly secondary with intentional provider marks.
- Add no illustration or cosmetic AI treatment. The recognised profile is the proof artifact.
- Review first at 390px, then rebalance 360px and 430px. The screen remains draft.

## Hero V2 critique

### Pass 1 — hierarchy and density

- The promise, three connected benefits, bridge, and recognised profile now read as one continuous story.
- The Naukri CTA is the unmistakable focal action while Google and Apple remain visible without competing.
- The elastic dead zone is gone; content is vertically balanced at 360px, 390px, and 430px.
- The third benefit now explains guidance concretely through résumé and negotiation rather than claiming an undefined “every next step.”

### Pass 2 — detail and rhythm

- The connected circular nodes encode the actual match → reality → guidance progression and provide character without illustration.
- Provider marks are deliberate and visually balanced.
- The redundant blue top strip was removed from the Naukri surface; the CTA supplies enough brand emphasis.
- Trust and legal language remain subordinate but readable, with no clipping or horizontal overflow.

## Owner review after Hero V2

Hero V2 was clear but not exciting. The owner identified the missing character as the lack of a visual division between product pitch and authentication. The headline and four supporting/reassurance lines were explicitly removed because they repeated the three value points or added clutter. Hero V3 uses MOB-ONB-008 for the split-world pattern and makes all provider CTAs pill-shaped. Product capability, identity recognition, routes, and authentication behavior remain protected.

## Hero V3 critique

### Pass 1 — hierarchy and density

- The saturated AmbitionBox-blue pitch world and white authentication world now feel intentionally separate at all three target widths.
- The three connected value points are the complete pitch; removing the visible headline avoids saying the same thing twice.
- The recognised Naukri identity leads directly into the dominant Naukri action, while Google and Apple remain complete but secondary paths.
- No generic illustration is needed: the connected signal spine gives the upper section enough character and reinforces the product logic.

### Pass 2 — detail and rhythm

- All three provider actions use a consistent pill silhouette, with the filled Naukri action retaining clear priority.
- Provider marks, identity alignment, divider, and legal line remain balanced at 360px, 390px, and 430px.
- The hard colour boundary is deliberate and produces the requested pitch/login division without decorative gradients or shadows.
- All visible content fits without clipping or horizontal overflow; the screen remains draft pending explicit owner lock.

## Owner refinement after Hero V3

- Removed “most” from the first value point for a more direct promise.
- Elevated autofill into a compact lightning-marked benefit badge immediately below the Naukri action.
- Replaced the temporary italic “n” with the canonical Naukri symbol from BRAND-NAU-001.
- Product capability, authentication behavior, routes, and Home remain protected; the hero remains draft.

## Value-sequence refinement

- Each signal node now uses a distinct pastel category colour while AmbitionBox blue remains the only page-level accent.
- The connecting line draws once from top to bottom and the three points enter in match, reality, then guidance order.
- Reduced motion renders the complete sequence immediately.
- Native icons were chosen over emoji so the visual language remains consistent across devices.
