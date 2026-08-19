# Onboarding Screen Contract

Owner: **Codex**  
Current state: **Working implementation; every Product, Copy, UX, and UI layer remains draft.**

Active refinement: [Unified Email Connection](../briefs/ONBOARDING-EMAIL-UNIFIED.md). Earlier [Email Pitch](../briefs/ONBOARDING-EMAIL-PITCH.md), [Optional Email](../briefs/ONBOARDING-EMAIL-CONNECTION.md), and [Curation collapse](../briefs/ONBOARDING-CURATION-COLLAPSE.md) briefs are historical drafts and do not override the unified screen. The [Profile summary accordion](../briefs/ONBOARDING-PROFILE-SUMMARY-ACCORDION.md), [Preference refinement and job curation](../briefs/ONBOARDING-PREFERENCES-AND-CURATION.md), [First Open and review value context](../briefs/ONBOARDING-VALUE-CONTEXT.md), [Naukri Preferences](../briefs/ONBOARDING-PREFERENCES.md), [Naukri Profile Review](../briefs/ONBOARDING-PROFILE-REVIEW.md), [branch-aware progress](../briefs/ONBOARDING-PROGRESS.md), [Naukri import](../briefs/ONBOARDING-NAUKRI-IMPORT.md), [brand opening](../briefs/ONBOARDING-BRAND-OPENING.md), and [first-open hero](../briefs/ONBOARDING-FIRST-OPEN.md) briefs remain available; all screens remain draft.

## Sequence and screen jobs

| Order | State | Entry | Single job | Primary success |
|---|---|---|---|---|
| 1 | First-open hero | `step=welcome` | Establish match → truth → best-shot promise and make Naukri the easiest credible start | Authentication provider selected |
| 2 | Brand opening | `step=brand&hold=1` | Briefly establish AmbitionBox before the hero | Hero opens automatically |
| 3 | Naukri import | `step=import&hold=1` | Show meaningful deterministic progress | Imported profile opens for review |
| 4 | Profile review | `step=profile-review` | Summarize the comprehensive Naukri transfer, surface exceptions, and make every career section reviewable | User continues with reviewed profile |
| 5 | Preferences | `step=preferences` | Review imported ranking preferences without repeating profile setup | Preferences saved |
| 6 | Unified email connection | `step=email` | Ask for the inbox where job updates already arrive, and prove timely help across reply, interview, and offer moments alongside provider choice and trust | Provider selected or setup skipped |
| 7 | Account sheets | `step=email&email=gmail|other` | Select the application inbox without losing progress | Secure scan starts |
| 8 | Secure scan | `step=scan&hold=1` | Turn permission into visible, meaningful progress | Canonical import result created |
| 9 | Import result | `step=complete` | Summarize the consequence and set up Home | User chooses “Show my next move” |
| 10 | Home handoff | `/home?arrival=first` | Carry reviewed context and connection outcome into Home | Claude-owned Home renders the contract |
| 11 | Profile source | `step=profile-start&branch=google|apple` | Offer Naukri, résumé, or guided setup | Source selected |
| 12 | Résumé import | `step=resume-import&hold=1` | Build the same reviewable profile from a deterministic résumé | Profile review opens |
| 13 | Manual setup | `step=manual` | Gather honest context one meaningful question at a time | Profile review opens |
| 14 | Email skip | header Skip on Email | Preserve usefulness without inbox access | Profile-only Home opens without a modal |

## Golden path

`First open → Naukri → Import → Profile review → Preferences → Unified email connection → Gmail → Account → Scan → Import result → Home handoff`

Complete and review this path before secondary branches.

### Naukri review model

The Naukri path imports the complete career-relevant profile defined in `PRODUCT.md`. The review must scale beyond a short fact grid without becoming a long onboarding form:

1. Use a compact attached header with an **AmbitionBox × Naukri** lockup that celebrates fast autofill and attributes the imported details without calling the result a “Naukri profile.”
2. Surface each literal missing field as an immediate Add sub-row beneath its native section header. Do not make it a standalone section, collect gaps only at the end, or infer freshness and conflicts.
3. Group detailed information into professional summary, experience, skills and evidence, education, accomplishments, résumé, and preferences.
4. Keep complete detail collapsed by default; identity remains visible, while the profile summary is the first accordion with its headline as the compact preview. Expansion and edit remain available.
5. Use **Confirm profile** to complete career-fact review, then confirm imported ranking preferences on the separate Preferences screen.

The current implementation follows this model for the Naukri path. Google, Apple, résumé, and manual review behavior remains unchanged in this slice.

### Naukri preference-review model

1. Treat imported preferences as reviewable facts, not empty form fields.
2. Attach the AmbitionBox × Naukri provenance header to one continuous preference surface.
3. Show target role, minimum compensation, preferred locations, work mode, and employment type as full-width editable imported rows.
4. Follow them with visibly optional rows for preferred companies, tech stacks, role level, and industries. Empty values remain **Not added** and never block confirmation.
5. Edit one preference in a focused sheet. Use chips only for genuine choices and multi-select values.
6. Explain that these values shape ranking, never eligibility.
7. Complete the screen with **Confirm preferences**, then show the automated cross-source Curation consequence before Email.

The golden path header shows four steps: Build profile → Review profile → Job preferences → Application tracking. Google/Apple manual setup shows eight steps by adding its five profile questions before the shared review, preferences, and application-tracking stages. The source-choice screen does not pretend the route length is already known.

## Change brief template

```text
Screen:
Desired outcome:
Permitted layers:
Protected layers:
References:
Current lock state:
```

## Per-screen completion

- Requested layer is implemented without altering protected layers.
- Entry, primary action, success, back/close, skip where relevant, and reset behavior work.
- 360px, 390px, and 430px captures are current.
- Hierarchy/density and alignment/detail critiques are complete for UI work.
- Current evidence is linked from `context/STATUS.md`.
- Screen remains draft until the owner explicitly says **lock**.
