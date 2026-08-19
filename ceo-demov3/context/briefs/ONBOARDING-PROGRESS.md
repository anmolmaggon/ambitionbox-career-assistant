# Change Brief — Branch-aware Onboarding Progress

**Screens:** Shared flow header across profile import/manual setup, review, preferences, and optional application email  
**Desired outcome:** Make progress feel earned and truthful by deriving the number and position of segments from the user's selected profile path.  
**Permitted layers:** Onboarding UX, UI, accessibility semantics, and the shared onboarding-progress model.  
**Protected layers:** Product promises, visible screen copy outside the header, runtime fixtures, import/scan timing, stable routes, Home handoff behavior, Claude-owned Home, and sibling projects.  
**References:** USER-ONB-003 for header anatomy only.  
**Current lock state:** Product `draft` · Copy `draft` · UX `draft` · UI `draft`.

## Problem

- The prior header always rendered six anonymous markers.
- Screens supplied arbitrary percentages that did not correspond to canonical journey states.
- Manual question progress was mixed into the same percentage scale as imported profile setup.
- The profile-source screen claimed determinate progress before the route length was known.

## Implemented model

- Imported Naukri/résumé path: Build profile → Review profile → Job preferences → Application tracking (four steps).
- Google/Apple manual path: Current role → Experience → Location → Compensation → Skills → Review profile → Job preferences → Application tracking (eight steps).
- Profile-source choice keeps the shared back/header anatomy but replaces fake progress with a quiet contextual label.
- Import rows and secure scan retain their own local progress systems.
- The progressbar announces a semantic label and exact step position instead of a fabricated percentage.

## Critique pass 1 — hierarchy and density

- Four imported-path segments read as a short setup and reinforce the speed advantage of Naukri/résumé import.
- Eight manual-path segments honestly signal the additional work without adding another explanatory block.
- The source-choice label prevents a misleading jump in total steps before the user chooses a path.
- Global progress remains visually quieter than the screen's primary heading and action.

## Critique pass 2 — alignment, detail, and accessibility

- Four and eight segments remain centred without clipping at 360px, 390px, and 430px.
- The elongated current marker and completed markers preserve the previously selected header anatomy.
- Accessible labels now read, for example, “Review profile, step 2 of 4” and “Experience, step 2 of 8.”
- Reduced motion preserves progress state without transition dependence.
- All affected screens remain draft pending explicit owner lock.
