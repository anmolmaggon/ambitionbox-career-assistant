# Change Brief - Curation Copy Cycle and Email Collapse

**Screen:** `/onboarding?step=curation&hold=1&preset=baseline` and the automatic transition into `step=email`  
**Desired outcome:** Let job curation feel active long enough to understand, then preserve that work as a living background while the optional application-email request arrives.  
**Permitted layers:** Curation Copy, UX, UI, and motion; routing presentation between Curation and Email.  
**Protected layers:** Representative job sources, confirmed preferences, Email screen content and permissions, account sheets, scan/import logic, progress semantics, Home, runtime data, and sibling projects.  
**References:** None. The owner-provided screenshot is current implementation evidence, not external design direction.  
**Current lock state:** Product `draft` · Copy `draft` · UX `draft` · UI `draft`.

## Direction

- Remove the redundant top AmbitionBox mark and “Your preferences are set” status.
- Keep one central source-to-AmbitionBox network as the visual signature.
- Replace the bottom three-step checklist with three sequential educational messages in the main copy area.
- Give each message enough time to read; keep the complete curation moment on screen for about 6.6 seconds.
- Remove the visible demo-simulation footer from this transition.
- Keep `hold=1` as a stable review state showing the first message and the living network without advancing.
- At completion, shrink the curation world upward while the existing Email screen enters over it. Keep the network pulse alive until the surface is covered.
- In reduced-motion mode, show one combined static explanation and use a short opacity handoff without cycling copy or pulsing the network.

### White-canvas refinement

- Use a white canvas rather than a full AmbitionBox-blue field so Curation feels like quiet product work, not a promotional interstitial.
- Keep dark primary copy and muted supporting copy on white.
- Concentrate AmbitionBox blue in the connection paths, signal dots, hub, and restrained halo. Source tiles use pale neutral surfaces and cool borders.
- Keep all four source tiles as consistent text labels. Do not give Naukri a standalone logo inside this network; the network is about source coverage rather than provider promotion.
- Let the four source tiles and their connection paths orbit slowly around a fixed AmbitionBox hub. Counter-rotate each tile so its label remains upright. Use an 18-second orbit and preserve the motion through the collapse.
- Preserve extra contrast around the shrinking white surface so it remains legible behind the entering Email screen.

The screen remains draft until the owner explicitly says **lock**.

## Critique pass 1 - hierarchy and density

- The changing headline and source network are now the only two hierarchy levels; no redundant status, logo, checklist, or footer competes with them.
- Each message has about 2.2 seconds before the next one and the complete Curation moment remains visible for about 6.6 seconds.
- The surrounding white field is intentionally quiet so the live network reads as one coherent system rather than another card stack.

## Critique pass 2 - alignment, detail, and accessibility

- The network remains centred and unclipped at 360px, 390px, and 430px, with readable source labels and stable copy height across message changes.
- Text-only source nodes now give Naukri, LinkedIn, company sites, and job boards equal visual weight; AmbitionBox remains the only branded hub.
- The four sources and their connection paths complete one slow 18-second orbit around the fixed AmbitionBox hub. Each source counter-rotates, so its label stays upright throughout the movement.
- Timed visual frames confirm the orbit remains balanced and unclipped at 360px, 390px, and 430px; the changing arrangement reads as active collection rather than a static diagram.
- The hub and connection signals pulse while Curation is present, including during collapse, and stop once Email covers it.
- The collapse frame visibly retains the bordered white surface behind the entering Email header; the final Email layout and controls remain unchanged.
- Reduced motion exposes a combined static explanation, removes pulse and copy cycling, and still advances to Email.
- Build, context integrity, focused golden-path and Curation interaction tests, and six Curation/Email responsive checks pass.
- Current evidence: `output/playwright/current/onboarding-curation-orbit-360.png`, `output/playwright/current/onboarding-curation-orbit-390-a.png`, `output/playwright/current/onboarding-curation-orbit-390-b.png`, `output/playwright/current/onboarding-curation-orbit-430.png`, and `output/playwright/current/onboarding-curation-collapse-mid-390.png`.
