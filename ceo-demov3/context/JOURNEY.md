# Journey and State Contract

## Onboarding spine

```text
Brand opening
  → First-open hero
  → Authentication
  → Profile source/import
  → Profile review
  → Preferences
  → Unified optional application email
  → Account selection
  → Secure scan
  → Import result
  → Home handoff
```

Naukri is the golden path. Google and Apple enter the profile-source choice and may use Naukri import, the deterministic résumé, or guided manual setup.

## Setup progress model

The shared header represents the remaining setup path, not an inferred percentage of the full product journey.

- **Imported profile (Naukri or résumé):** Build profile → Review profile → Job preferences → Application tracking.
- **Manual profile (Google or Apple):** Current role → Experience → Location → Compensation → Skills → Review profile → Job preferences → Application tracking.
- **Profile-source choice:** no determinate stepper is shown because the path length is not known until the user chooses a source.
- Import rows and secure-scan stages are local process progress. They do not change the global setup-step count.
- Brand opening and first-open authentication occur before setup progress begins. Import result is the completion consequence, not another pending step.

## Stable routes

The canonical entry is `/onboarding`. Query-addressable review states remain:

`brand`, `welcome`, `profile-start`, `import`, `resume-import`, `manual`, `profile-review`, `preferences`, `curation`, `email-pitch`, `email`, `scan`, and `complete`.

`email` is the canonical unified email route. `email-pitch` resolves to the same screen for compatibility. `curation` is a parked review route and is not reached by the live onboarding path. Legacy `education` and `naukri-account` values resolve to the single first-open hero. Transient states may use `hold=1`; for parked Curation, `hold=1` preserves the first educational message and living network without advancing. Branch captures use `branch=google|apple`; email sheets use `email=gmail|other`.

## Runtime truth

The state shape and presets in `src/data.js`, state persistence in `src/store.jsx`, and transition functions plus semantic progress plans in `src/Onboarding.jsx` are the executable contract. Update this document whenever those interfaces change.

## Connected-email Home handoff

Navigate to `/home?arrival=first` with:

- confirmed authentication provider and profile source;
- reviewed onboarding profile and preferences;
- `onboardingComplete: true`;
- `firstHomeArrival: true`;
- `emailConnected: true`;
- `importComplete: true`;
- `emailSkipped: false`.

Canonical tracker data supplies 15 applications and three attention moments.

## Skipped-email Home handoff

Navigate to the same route with:

- confirmed authentication provider and profile source;
- reviewed onboarding profile and preferences;
- `onboardingComplete: true`;
- `firstHomeArrival: true`;
- `emailConnected: false`;
- `importComplete: false`;
- `emailSkipped: true`.

Home remains useful through profile-based Explore and may recommend email connection without reopening a modal automatically.

## Back and reset

- Closing an account sheet returns to email connection without losing progress.
- Profile and preference back actions preserve the current draft values.
- Confirming Preferences opens the unified Email screen directly.
- Email's back action returns to Preferences without replaying parked Curation.
- Header **Skip** uses the skipped-email Home handoff.
- Presenter rewind resets V3 session state and opens the first-open hero.
- Completed users normally bypass first-run onboarding; query-addressable states remain available for review.
