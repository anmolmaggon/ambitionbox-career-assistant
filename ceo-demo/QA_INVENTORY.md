# QA Inventory

## Required states

| Area | Empty / entry | Loading | Success | Return | Reset / preset |
| --- | --- | --- | --- | --- | --- |
| Tracker | Disconnected tracker | 5–6 second Gmail scan + Skip | 15 found; 3 attention, 4 waiting, 8 closed | Populated tracker and Home action | `baseline`, `tracker` |
| Home | Useful disconnected Home | PhonePe send confirmation | Juspay reranks after reply | Navigation preserves progress | `tracker`, `matches` |
| Matches | 2 limited sources | Naukri review flow | Four-source ranked feed | Saved jobs and sources sheets | `matches` |
| Readiness | Juspay at 10/15 | Résumé tailoring | 14/15 tailored résumé | Job detail returns at 14/15 | `readiness`, `resume` |
| Evidence honesty | Java unconfirmed | — | Honest No remains 14/15; confirmed Yes becomes 15/15 | Correction persists | `resume` |
| Interview | Time jump | Invitation transition | Plan, coaching, completion | Completion persists | `interview` |
| Offer | Time jump / reveal | Reveal animation | Decoded offer and copied draft | Draft remains unsent | `offer` |

## Automated coverage

- Uninterrupted click path from Gmail trust sheet through negotiation draft
- Presenter reset and deterministic first-run return
- Horizontal-overflow checks for 9 major states × 3 widths
- Reduced-motion browser context for stable QA
- Production build and frozen-file checksum verification

## Manual checks

- Keyboard focus is visible and bottom navigation uses links
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
