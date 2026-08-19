# Change Brief — Brand Opening

**Screen:** `/onboarding?step=brand&hold=1&preset=baseline`  
**Desired outcome:** Establish AmbitionBox in one confident gesture, then transition seamlessly into the blue first-open pitch world.  
**Permitted layers:** Copy and UI, including motion.  
**Protected layers:** Product promise, onboarding state and routes, approximately one-second duration, reduced-motion bypass, first-open hero content, shared foundations, and Claude-owned Home.  
**References:** MOB-ONB-001, MOB-ONB-006, and MOB-ONB-008.  
**Current lock state:** Product `draft` · Copy `draft` · UX `draft` · UI `draft`.

## Direction

- Use the same AmbitionBox-blue field as the first-open pitch so the two states feel like one opening movement.
- Show only the AmbitionBox mark; remove the weak tagline because the following hero owns the product promise.
- Let the mark settle at centre, then travel toward the hero header position before the state changes.
- Keep the held query state centred for screenshot and presenter review.
- In reduced-motion mode, skip the travel and open the hero immediately.
- Add no illustration, gradient, spinner, or decorative loading language.

## Protected behavior

- `hold=1` keeps the opening visible.
- Without `hold=1`, the hero opens automatically in approximately one second.
- Completed users continue to bypass onboarding.
- The screen remains draft until the owner explicitly says **lock**.

## Critique pass 1 — hierarchy and density

- The screen now performs one job: establish AmbitionBox. Removing the tagline prevents a one-second state from competing with the real pitch that follows.
- The full AmbitionBox-blue canvas makes the opening and hero feel like one brand world rather than consecutive unrelated screens.
- The mark is the sole focal element and remains correctly centred at 360px, 390px, and 430px.

## Critique pass 2 — alignment, contrast, and motion

- The white wordmark, outlined app mark, and restrained halo retain sufficient contrast without an added glow or gradient.
- The normal-motion path uses one coherent gesture: settle at centre, then travel toward the hero header position before the state changes.
- Reduced-motion mode opens the hero immediately, while `hold=1` preserves the centred review state.
- No clipping or horizontal overflow is visible at the three target widths; the screen remains draft pending explicit owner lock.
