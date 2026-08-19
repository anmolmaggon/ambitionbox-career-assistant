# Change Brief — Unified Email Connection

## Screen

`/onboarding?step=email&preset=baseline`

Compatibility route: `/onboarding?step=email-pitch&preset=baseline` resolves to the same screen.

## Desired outcome

Replace the separate premium pitch and provider-permission screens with one light, high-conviction email connection screen. It must sell assistance across recruiter replies, interviews, and offers while presenting Gmail, another email, trust, and the optional skip in one coherent decision.

## Permitted layers

- **Copy:** headline territories, supporting explanation, proof labels, CTA labels, trust wording.
- **UX:** merge the two email screens; place Skip in the header; route Preferences directly to Email; keep Curation query-addressable but out of the active flow.
- **UI:** convert the pitch to the light AmbitionBox canvas; establish one native assistance artifact; use direct pill provider actions and a compact trust boundary.
- **Shared instructions:** add the owner-requested model-neutral copywriting skill and require it for copy changes.

## Protected layers

- Profile and Preferences data and review behavior.
- Gmail and other-email account sheet behavior.
- Scan, import result, and connected/skipped Home handoff state.
- Runtime fixtures in `src/data.js`.
- Claude-owned Home visuals and copy.
- Frozen sibling projects.

## References

- `MOB-ONB-015`: one consequential native product artifact.
- `MOB-ONB-017`: grouped proof before a decisive CTA.
- `MOB-ONB-018`: quiet tonal canvas and anchored action surface.

Learn the hierarchy and conviction. Do not inherit dark paywall styling, subscription mechanics, decorative glow, or generic AI marks.

## Copy brief

For an active jobseeker managing applications across different sources, show that one job-search inbox connection gives them assistance at every consequential step. The desired action is connecting Gmail. The evidence is three concrete use cases: a recruiter asking about notice period, a scheduled system-design round, and an offer that may deserve negotiation.

Working copy:

- Headline: **Connect your inbox. We'll take it from there.** — **Connect your inbox.** carries the AmbitionBox primary colour. The second clause frames the exchange confidently: connect once, AmbitionBox handles the rest. The prior “Never miss what happens next” tested as vague — users could not tell what connecting would give them.
- Supporting line: **The inbox where your job updates already land.** Names the object plainly without repeating the proof cases or defusing a fear.
- Proof card: six generic capability statements in job search chronological order — application tracking, follow-ups, recruiter replies, interview prep, offer analysis, negotiation guidance. No connecting line, no checkmarks, no scenario-specific trigger→action format.
- Trust line below both provider actions: **Read-only access. You’re in control.**

The trust line states the permission posture without implying that AmbitionBox can never support an explicitly reviewed send action. The current demo still does not send a real message.

## Current lock state

Product, Copy, UX, and UI are all `draft`.

## Parked artifacts

- `step=curation` remains directly inspectable but is not part of the active onboarding path.
- The former dark value screen and separate blue permission screen are removed from the live sequence.
