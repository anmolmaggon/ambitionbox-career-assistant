# QA Inventory

## Required states

| Area | Empty / entry | Loading | Success | Return | Reset / preset |
| --- | --- | --- | --- | --- | --- |
| First open | One promise, three icon-led benefits, detected Naukri profile, and Google/Apple alternatives | Direct Naukri/résumé import with meaningful stages | Reviewed profile and preferences | Import and profile-review back actions return to the single first-open screen; later back actions preserve draft answers | `baseline`, `/onboarding?step=welcome` |
| Onboarding email | Optional connection with trust boundary | Four-stage secure scan + Skip | 15 found and signal carried to Home | Skip opens profile-only Home | `baseline`, `tracker` |
| Tracker | Disconnected tracker | 5–6 second Gmail scan + Skip | 15 found; 3 attention, 4 waiting, 8 closed | Populated tracker and Home action | `baseline`, `tracker` |
| Home | Useful disconnected Home | PhonePe send confirmation | Juspay reranks after reply | Adaptive assistant and career rail preserve progress | `tracker`, `matches` |
| Matches | 2 limited sources | Naukri review flow | Four-source ranked feed | Saved jobs and sources sheets | `matches` |
| Readiness | Juspay at 10/15 | Résumé tailoring | 14/15 tailored résumé | Job detail returns at 14/15 | `readiness`, `resume` |
| Evidence honesty | Java unconfirmed | — | Honest No remains 14/15; confirmed Yes becomes 15/15 | Correction persists | `resume` |
| Interview entry | Home presenter time jump | — | Interview card on Home, interview row on Tracker, honest attention count | Card copy changes once prep completes | `interview`, `action=add-interview` |
| Interview decoding | Invitation that states nothing about the round | — | Round inferred with its confidence, then confirmed or corrected by the candidate | Choice persists in `roundConfirmed` | `interview`, `stage=invite`, `round=open\|confirmed\|corrected\|unsure` |
| Interview briefing | Decoded loop | — | Interviewer, source split, inversion, ranked themes, outcome rates | Theme excerpt sheets close back to the briefing | `interview`, `stage=briefing` |
| Interview honesty | Java unevidenced, 9 of 51 | — | Honest No stays 14/15 with a handling strategy; Yes becomes 15/15 | Choice shared with the résumé beat | `interview`, `stage=answers`, `java=open\|yes\|no` |
| Interview coaching | Empty answer | — | Grade reflects what was typed: empty blocks completion, partial names the misses, strong earns the attributed line | Derived metrics on the ready state | `interview`, `stage=practice\|coaching`, `offer` + `stage=ready` |
| Offer prologue | Notification | Branded launch + anticipation beat | Consolidated Juspay + ₹28L celebration card | Close returns to Home offer card | `offer`, `stage=notification|reveal`, `moment=anticipation|celebration` |
| Offer decision | Personal verdict | — | Company, negotiation, and move intelligence | Assumptions and answers persist | `offer`, `stage=decision` |
| Anonymous employee | Matched masked profile | Simulated waiting | Employee-experience response | Response returns to decision | `stage=employee`, `status=responded` |
| Negotiation | Evidence-backed recommendations | — | Editable reviewed draft can be copied | Nothing sent or accepted | `stage=negotiation` |

## Automated coverage

- Offer-first prologue, presenter rewind, and uninterrupted click path through the reviewed negotiation draft
- First-open detected-Naukri golden path plus Google, Apple, résumé, manual, Gmail, another-email, and email-skip branches; editable review; contextual assistant; and living career-journey actions
- Dedicated interview-intelligence suite: source boundary, round inference, excerpt sheets, Java branch in both directions, and answer grading at empty, partial, and complete
- Presenter reset and deterministic first-run return
- Horizontal-overflow checks for the major journey states at 360px, 390px, and 430px
- Reduced-motion browser context for stable QA
- Production build and frozen-file checksum verification

## Manual checks

- Keyboard focus is visible; first-open actions expose readable labels and touch targets; motion respects reduced-motion preferences; bottom navigation exposes labelled 44px actions
- Forms have labels, names, autocomplete intent, and editable values
- Sheets contain overscroll and expose explicit close controls
- Message sending and negotiation require review
- Preference Match and Profile Readiness remain semantically separate
- Screenshot review at 360px, 390px, and 430px

## Known limitations

- Gmail and Naukri connections are simulated future capabilities.
- Job and company data are canonical demo fixtures, not live API results.
- The downloaded résumé is generated client-side for the demo and is not a production résumé service.
- No email, application, profile update, offer acceptance, or negotiation is sent externally.
- No real employee is contacted; employee request and response states are explicitly labelled prototype simulations.
- The interviewer is fictional, and interview report counts, round patterns, theme rankings and outcome rates are deterministic demo figures, not live AmbitionBox interview data.
- Interviewer research is limited to publicly published material and first-party AmbitionBox aggregates. No private profile or job-search activity is used.
- Voice answer input is deferred; practice answers are typed. Capturing spoken answers needs a microphone-permission and transcription-review surface, and it cannot be made deterministic for the capture suite.
- Correcting the round to technical reorders emphasis and relabels the loop; it does not load a separate technical question set.
