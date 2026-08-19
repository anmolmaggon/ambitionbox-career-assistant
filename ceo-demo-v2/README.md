# AmbitionBox Career Assistant — CEO Demo V2

A self-contained mobile React prototype showing what happens after Gmail has already reconstructed Arjun Mehta’s job search. AmbitionBox owns the monitoring and preparation across one Juspay application; Arjun is interrupted only for approval or information the system cannot know.

## Run

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:4175/demo` and choose **Start golden path**. The original demo remains available separately on port 4173.

## Product routes

- `/today` — live monitoring and the one current decision.
- `/applications` — all reconstructed application threads.
- `/applications/juspay` — the continuous follow-up, interview, and offer journey.
- `/profile` — career memory, verified evidence, and sources.
- `/demo` — presenter launcher and deterministic chapter presets.

`preset` and `stage` query parameters produce stable review states. The golden path begins after email import and takes approximately 5–6 minutes.

## Verify

```bash
npm run build
npm run test:smoke
npm test
npm run capture
bash scripts/verify-preservation.sh
```

Captures are written to `output/playwright/` at 360px, 390px, and 430px.

## Safety boundary

All Gmail events and sends are deterministic simulations. The UI never marks a draft or negotiation sent before the exact message is reviewed and approved. No real email, calendar, account, or backend is accessed.
