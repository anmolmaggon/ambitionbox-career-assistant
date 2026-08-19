# Change Brief - Preference Refinement and Job Curation

**Screens:** `/onboarding?step=profile-review&preset=baseline`, `/onboarding?step=preferences&preset=baseline`, and `/onboarding?step=curation&hold=1&preset=baseline`  
**Desired outcome:** Compress Profile Review value context, make imported and optional job preferences easy to distinguish, and show an immediate cross-source matching consequence before the optional email pitch.  
**Permitted layers:** Product, Copy, UX, and UI for the Profile Review supporting sentence, Naukri Preferences, and the new Curation transition; journey routing only to insert Curation between Preferences and Email.  
**Protected layers:** Profile data, profile-review sections and editors, authentication, Email screen design and permissions, scan/import logic, Home design and handoff state, secondary profile branches, and shared navigation.  
**References:** MOB-ONB-009 for grouped review hierarchy; USER-ONB-004 for additive optional preference controls.  
**Current lock state:** Product, Copy, UX, and UI are all `draft`.

## Direction

- Profile Review explains its user value in one concise supporting sentence rather than a second feature list.
- Preferences retain five imported ranking controls and add four optional refinements: preferred companies, tech stacks, role level, and industries.
- Empty optional values remain visibly empty and are addable; they are never required to continue.
- The source header says what the surface contains and where it came from without using a count that becomes inaccurate.
- Confirming preferences opens a brief automated Curation screen. It names Naukri, LinkedIn, company career pages, and leading job boards, then advances to Email.
- Curation uses one source-to-AmbitionBox network, three sequential educational copy beats, and a collapse behind Email. `hold=1` preserves the first copy beat and living network for review. This supersedes the earlier bottom stage checklist.

## Constraints

- Do not add job-search-stage classification such as “actively exploring.”
- Do not claim literal coverage of every job on the internet. Use “across the web” and representative sources.
- Optional preference controls must remain usable with zero selected values.
- Reduced motion shows one combined Curation explanation, removes the ambient pulse and copy cycling, and still leaves enough time to read it.
- All integrations remain explicitly simulated.

All affected screens remain draft until the owner explicitly says **lock**.
