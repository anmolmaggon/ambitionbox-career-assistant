# Change Brief — Naukri Import

**Screen:** `/onboarding?step=import&hold=1&preset=baseline`  
**Desired outcome:** Make the one-tap Naukri advantage tangible by showing the user’s profile, résumé, and preferences moving into AmbitionBox as meaningful, trustworthy progress.  
**Permitted layers:** Copy, UX, and UI, including motion and the reusable onboarding `FlowHeader` presentation.  
**Protected layers:** Product capability, deterministic fixture data, import duration, back action, route/state behavior, profile-review handoff, résumé branch behavior, shared foundations outside `FlowHeader`, and Claude-owned Home.  
**References:** BRAND-NAU-001 and USER-ONB-003. MOB-ONB-009 is intentionally held for Profile Review and is not used here.  
**Current lock state:** Product `draft` · Copy `draft` · UX `draft` · UI `draft`.

## Current critique

- The existing screen communicates progress but the italic “n” and generic orbit do not show what is actually happening.
- The title is clear, while the large empty lower canvas makes the three progress rows feel detached from the transfer.
- The step states are meaningful and should be preserved.
- The simulation boundary is present but should remain visually subordinate.

## Direction

- Replace the generic orbit with a branded Naukri-to-AmbitionBox transfer bridge.
- Use the canonical Naukri symbol and AmbitionBox mark as the endpoints.
- Animate one restrained signal across the bridge; reduced-motion mode keeps the endpoints and progress states without movement.
- Keep the three imported objects in one continuous structured progress surface.
- Maintain the direct heading and avoid consent or loading filler.
- Keep the résumé branch functional with a document source endpoint.
- The screen remains draft until the owner explicitly says **lock**.

## Critique pass 1 — hierarchy and density

- The Naukri-to-AmbitionBox bridge makes the transfer legible before any copy is read and replaces the generic loading metaphor with a product-specific one.
- The heading remains the dominant message, while the overlapping progress surface visually connects the promise to its three concrete objects.
- “Step 2 of 3,” Done, In progress, and Next make state understandable without an abstract percentage.
- The lower canvas stays intentionally quiet because this state lasts approximately 1.5 seconds; the simulation boundary remains available without joining the focal hierarchy.

## Critique pass 2 — alignment, contrast, and motion

- The canonical Naukri and AmbitionBox marks are balanced endpoints with a single restrained transfer signal between them.
- Green appears only on confirmed completion, blue on the current step, and neutral grey on the upcoming step.
- The card, labels, title, and trust note remain aligned and unclipped at 360px, 390px, and 430px.
- Reduced-motion mode fixes the transfer signal at the bridge midpoint and removes pulsing while preserving all progress information.
- The screen remains draft pending explicit owner lock.

## Owner refinement

- Animate each completed green check with one restrained container pop and check-stroke draw.
- Replace the title-and-linear-bar header with a reusable back / six-stage progress / optional-close structure.
- Let the header inherit a blue hero when present; keep the same structure on a white surface elsewhere.
- Keep the final state static and complete in reduced-motion mode.
