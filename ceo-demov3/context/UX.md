# UX

## Core hierarchy

Use the sequence:

**Outcome or verdict → supporting evidence → source or trust boundary → action**

- Give every screen one dominant job and one dominant CTA.
- Merge related facts into one coherent surface instead of stacking many cards.
- Use whitespace to establish focus, not to create unexplained empty areas.
- Prefer a real product example or native UI evidence over generic illustration.
- Keep source and uncertainty close to the fact they qualify.

## Change layers

- **Product:** problem, promise, capability, truth, or journey consequence.
- **Copy:** visible words, tone, labels, trust language, and CTA wording.
- **UX:** information order, navigation, inputs, states, optionality, and interaction.
- **UI:** styling, tokens, components, imagery, icons, and motion.

Do not use a lower-layer request to change a higher layer. Record the idea and ask for scope.

## First-open and authentication

- Use one first-open hero, not a multi-card carousel.
- Merge the welcome promise and authentication entry on the same screen.
- Give the pitch and authentication distinct visual worlds on that screen, with an intentional boundary between them.
- Let the three connected value points carry the pitch; do not repeat them in a separate headline.
- Reveal the three points once in their narrative order: match, company reality, then guidance. Motion should reinforce the sequence and never loop.
- Make the simulated detected Naukri profile the golden path.
- Explain the benefit as profile, résumé, and preference autofill followed by user review.
- Keep Google and Apple visible as secondary paths.
- Never imply sign-in grants inbox access.

## Profile and preferences

- Assume AmbitionBox knows nothing until the user imports or confirms it.
- Naukri and résumé paths converge on an editable review.
- Treat Naukri as a comprehensive career-profile transfer. Review the imported profile by exception instead of turning every imported field into an equally prominent form input.
- Before the detailed Naukri review, explain what the profile enables for the user in one supporting sentence. Do not add a second feature list or duplicate profile facts.
- Begin with simple source provenance, then surface literal missing values that the user can add.
- When the entire review artifact comes from one source, attach provenance as the header of that same structured surface. Do not float it as a separate card above the content it qualifies.
- Organise the detailed review into meaningful sections: professional summary, experience, skills and evidence, education, accomplishments, résumé, and job preferences.
- Keep identity visible, but make the professional summary the first collapsed disclosure row. Use its headline as the preview and reveal the full paragraph only when requested.
- Keep complete sections collapsed or compact by default. Elevate only directly observable missing information; allow every section to expand and edit.
- Keep each missing value attached to its native profile section. Surface it early within that section rather than presenting it as a new category or collecting all gaps only at the end.
- Do not infer freshness, conflicts, or other profile intelligence during this onboarding review until the product behavior is explicitly defined.
- Show provenance at the section or value where it matters: Naukri profile, résumé, or AmbitionBox inference. Never blend these into one undifferentiated source.
- Keep job preferences as a dedicated confirmation step even though they were imported, because they control ranking rather than describing past career facts.
- On an imported path, review preferences by exception: show the current values as one continuous list and open one focused editor only when the user chooses a row. Do not default to five always-open form controls.
- Distinguish the imported core set—target role, minimum compensation, preferred locations, work mode, and employment type—from optional refinements for companies, tech stacks, role level, and industries. Optional values may remain empty. Confirming affects ranking and does not block exploration or applications.
- Use chips for genuine single- or multi-choice preferences; keep role and compensation as direct text inputs inside their focused edit sheets.
- Manual setup uses one meaningful question at a time with structured inputs.
- Derive setup progress from the selected profile path. Imported profiles use four setup stages; manual profiles count each of the five questions before review, preferences, and application tracking.
- Do not show determinate progress on profile-source choice because the path length is not known yet.
- Preserve skipped or unknown values as visibly unknown.
- Explain why sensitive optional values improve guidance.
- Preferences shape ranking, not eligibility.

## Email and scan

- Open one unified Email screen directly after Preferences. Keep the former Curation beat parked and out of the active onboarding flow.
- Sell the value and present provider choice on the same screen. Use one connected artifact to demonstrate help across recruiter replies, interviews, and offers.
- Keep the unified screen inside the existing Application Tracking progress stage. Do not fabricate another progress marker for a marketing beat.
- Put the permission boundary directly before the provider actions. The user should understand the consequence, see proof, understand control, then choose Gmail or another email.
- Put the optional Skip in the top-right header. Do not repeat the later action at the bottom.
- Ask after profile and preferences.
- Keep connection optional; skipping still opens a useful profile-based Home.
- Account selection is a bottom sheet and closing returns without losing progress.
- Use a staged scan with meaningful progress rather than a generic spinner.
- Import success summarizes consequences and hands state to Home.

## Accessibility and behavior

- Preserve keyboard navigation, visible focus, semantic labels, and 44px minimum touch targets.
- Support reduced motion without withholding information.
- Design at 390px, then verify 360px and 430px.
- Complete back, close, loading, skip, success, return, and reset states.
