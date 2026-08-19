# CEO Demo V2 Workspace Rules

- Work only inside `ceo-demo-v2/`. The original `ceo-demo/` and every other sibling path are frozen references.
- Keep canonical people, companies, compensation, counts, and evidence in `src/data.js`.
- Preserve the forward-only journey and derive the activity log from its stage.
- Never mark a message sent before the user reviews the exact text and approves it.
- Ask for experience evidence that cannot be safely inferred; preserve explicit gaps.
- Complete return, reset, permission-declined, success, and reduced-motion states.
- Verify the golden path and key states at 360px, 390px, and 430px.
- Re-run `scripts/verify-preservation.sh` before handoff.
