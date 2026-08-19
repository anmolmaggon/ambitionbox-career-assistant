# AmbitionBox Jobseeker Assistant — CEO Demo

A self-contained mobile React prototype that follows Arjun Mehta from an empty application tracker to a reviewed ₹28L Juspay offer. Gmail and Naukri are deterministic simulations of future capabilities; no real account is accessed.

## Run the demo

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:4173/demo` and choose **Start golden path**.

## Presenter controls

- `/demo` — reset and chapter launcher
- `/tracker` — Gmail and automatic application tracker
- `/home` — ranked next career action
- `/matches` — Naukri connection and multi-source matches
- `/jobs/juspay` — Preference Match and Profile Readiness
- `/assistant/juspay` — evidence check and tailored résumé
- `/prep/juspay` — interview invitation and personalized coaching
- `/offer/juspay` — offer reveal, compensation intelligence, and negotiation review

Every chapter launcher applies a canonical journey preset before navigation. Additional `preset` and `stage` query parameters make review and screenshot states deterministic.

## Verify

```bash
npm run build
npm run test:smoke
npm test
npm run capture
bash scripts/verify-preservation.sh
```

The browser suite exercises the uninterrupted golden path, reset behavior, and major states at 360px, 390px, and 430px. Captures live in `output/playwright/`.

## Safety boundary

All implementation files are contained in `ceo-demo/`. Sibling prototypes, designs, Mukesh’s project, and root documentation are read-only. Root `AGENTS.md` is environment-managed and logged separately in `PRESERVATION_MANIFEST.md`.
