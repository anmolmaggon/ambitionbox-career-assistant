# AmbitionBox Career Assistant — PROJECT_CONTEXT

> Canonical product & decision source for the Career Assistant prototype.
> When any older exploration (ChatGPT, Claude, Antigravity, screenshots in `Designs so far/`)
> conflicts with this file, **this file wins**. Screenshots are inspiration, not decisions.
>
> Roles: **Codex** = product planner & design reviewer (owns product logic, sequencing, review gates).
> **Claude Code** = implementation executor (builds exactly to spec, stops at each review gate).
>
> Last updated: 2026-07-30 · Status: **Checkpoint 2A — Home: Career Action Hub — LOCKED**

---

## 0. Checkpoint 2A — Home: Career Action Hub — LOCKED

**Do not redesign, rebuild, or visually revise the current screen.** Checkpoint 2A is approved. Preserve its current composition, copy, density, and styling.

- **Canonical implementation:** `prototype/home-2a.html`
- **Primary references:**
  - `home-2a.css`, `home-2a.js`
  - Latest verified artifacts and screenshots generated for 390px, 360px, and 430px.

### 0.1 Locked decisions (Checkpoint 2A)

#### Navigation & Layout
- Top navigation rail uses solid folder-tabs with a dark neutral active state.
- Bottom floatbar is strictly reserved for the Explore compass FAB and the persistent Career Assistant pill.
- The "Explore" button is the gateway to all other AmbitionBox products.

#### Actionable Opportunities
- **Next-best action (Hero):** Time-sensitive actions (e.g., recruiter responses) take the hero spot with clear, embedded primary actions (e.g., "Review reply"). Review state is handled via an in-card panel and CSS transitions, not a new page.
- **Secondary opportunities:** Displayed below the hero (e.g., Juspay application). Links point to the corresponding Job Detail (1B).

#### Career Context
- **New for you:** A horizontally scrollable rail of recommended jobs and events, aligning perfectly with standard page gutters.
- **Momentum stats:** A horizontally scrollable rail of 5 key stats (applications sent, tailored résumés, prep sessions, questions practised, interviews reached), all featuring outline icons above the numbers.
- **For today (Aurora quote):** A full-bleed block at the bottom with a magical, slow-moving aurora gradient and a radial mask that fades the edges into the background.

---

## 0.5. Checkpoint 1A — Direction B v2 — LOCKED

**Do not redesign, rebuild, or visually revise the current screen.** Direction B v2 is approved. Preserve its current composition, copy, density and styling.

- **Canonical implementation:** `prototype/job-detail-1a-direction-b.html`
- **Primary review screenshot:** `prototype/screenshots/direction-b-390-v2.png`
- **Superseded references (kept, NOT deleted):**
  - `prototype/job-detail-1a.html` — original Checkpoint 1A and the earlier **Revision 1A.1 / 1A.2 (Direction A)** direction. Superseded by Direction B v2; retained for reference only.
  - Earlier screenshots (`checkpoint-1a-*.png`, `1a.1-*.png`, `1a.2-*.png`, `direction-b-390.png`) — historical; superseded by `direction-b-390-v2.png`.

### 0.6 Locked decisions (Checkpoint 1A)

#### Job identity
- Role title, company and source remain **concise**.
- The **AmbitionBox rating is presented as a tag beside the company name**, making the AmbitionBox intelligence layer visually attributable.
- Job attributes (location, employment type, work mode, experience) are **handled within Preference Match**, not duplicated in the header.
- **Preserve the current Save and Apply actions** (Save + Apply on Naukri row sits above Preference Match).

#### Preference Match
- **Preference Match remains separate from Profile Readiness.**
- It is **the only area that uses a percentage** (89%).
- The current **89% computed-intelligence hero, salary insight, and expandable breakdown entry point** ("See match breakdown") are approved.
- Job attributes are **checked against the user's preferences**, colour-coded:
  - **Green = matches**
  - **Amber / yellow = conflict or meaningful trade-off**
  - **Grey = neutral** (no preference captured)
- **Salary, location and work-mode conflicts belong here — never inside Profile Readiness.**

#### Profile Readiness
- Keep the current **contained Profile Readiness widget** and the **"10 of 15 requirements evidenced"** presentation.
- **Do not introduce a readiness percentage.**
- **Visible UI = three groups:**
  1. **What already fits**
  2. **What to strengthen**
  3. **What may hold you back**
- **Internally retain four logical states:** 1) Confirmed Match, 2) Evidence Needed, 3) Requirement Mismatch, 4) Unknown.
- **Present Unknown items inside "What to strengthen."**
- **Do not show an "Unknown" label or a "Confirm" tag in the UI.**
- The **assistant may ask whatever is required later** to resolve an Unknown item.
- **Preference conflicts must never be presented as requirement mismatches.**

#### Assistant
- **Preserve the current assistant entry point** (persistent bottom "Ask the Career Assistant" bar; looping typewriter placeholder).
- Assistant **completion states, tailored résumé delivery, and application-question preparation live inside chat — not on the Job Detail page.**
- Job Detail will only **reflect resulting readiness updates** later.

#### Visual direction
- **Direction B v2 is approved.** Preserve its current composition, copy, density and styling.
- Future screens should use the **design system as a foundation while allowing intentional creative liberties for AI-first patterns** (see `CLAUDE.md`).

---

## 1. What this is

A mobile-first **Job Detail experience** for AmbitionBox that adds an intelligence layer on top
of a standard (Naukri-sourced) job posting. The product answers two separate questions for a
logged-in candidate:

1. **Should I want this job?** → *Preference Match* (fit against the candidate's stated preferences).
2. **Am I ready to get this job?** → *Profile Readiness* (evidence of the candidate against the role's requirements).

Tone is **calm intelligence**: honest, specific, never hypey. It tells the candidate the truth about
their standing and offers to help close the gap — it never inflates, gamifies, or fabricates evidence.

---

## 2. Canonical scenario — Arjun Mehta → Senior Backend Engineer @ Juspay

**This is the only canonical scenario. The earlier Product-Designer scenario is void and removed.**

**Candidate — Arjun Mehta**
- Software Engineer at **Razorpay**.
- **6 years** of experience.
- **₹15L** current CTC · **₹22L** preferred/target CTC.
- Based in **Bengaluru**.
- Targeting **SDE-2 / Senior Backend** roles.

**Opportunity — Senior Backend Engineer @ Juspay**
- Sourced **via Naukri**.
- **Bengaluru** · **Full-time** · **Hybrid** · **6–9 years**.
- Estimated salary: **₹24–30L** (above Arjun's ₹22L target).
- AmbitionBox rating: **4.0** based on **847 reviews**.

Company stage (e.g. "Series C") and industry are **AmbitionBox Intelligence / preference dimensions**, not
the Naukri posting layer. (In Direction B v2 the job attributes are surfaced inside Preference Match, not the header.)

---

## 3. Canonical Profile Readiness fixture (deterministic)

**15 requirements total → "10 of 15 requirements evidenced".** Four **logical** states (retained internally; see §3.1 for how they are presented):

**Confirmed Match — 10**
1. 6 years of backend engineering
2. Payments & fintech systems
3. REST & gRPC API design
4. Microservices architecture
5. PostgreSQL & data modelling
6. Redis & caching
7. Kafka & event-driven systems
8. AWS production systems
9. Monitoring & incident response
10. Code reviews & engineer mentoring

**Evidence Needed — 3** (one concise "missing evidence" sentence each)
1. **System-design ownership** — contributes to architecture, but end-to-end ownership of a major system design isn't shown yet.
2. **Scale & throughput metrics** — large-scale systems are mentioned, but concrete volume / latency / reliability numbers aren't shown.
3. **Cross-team technical leadership** — mentoring is visible, but leadership across several engineering teams isn't established.

**Requirement Mismatch — 1** (one concise comparison sentence)
1. **Java production experience** — role asks for 3+ years of production Java; **Arjun explicitly confirmed he has not used Java in production** (candidate-confirmed, not a missing-keyword inference). UI copy: *"The role asks for 3+ years of production Java; you confirmed you haven't used Java in production."*

**Unknown — 1**
1. **Hands-on Kubernetes ownership** — not evidenced in the résumé and not yet confirmed by Arjun.

### 3.1 Presentation (LOCKED — Direction B v2)
The four logical states are retained internally, but the **visible UI shows three groups**:

| Visible group | Logical state(s) | Count |
|---|---|---|
| **What already fits** | Confirmed Match | 10 |
| **What to strengthen** | Evidence Needed **+ Unknown** | 4 |
| **What may hold you back** | Requirement Mismatch | 1 |

- Headline is **"10 of 15 requirements evidenced" — no readiness percentage.**
- Evidence meter = **10 green · 4 amber · 1 red** (no grey segment; the Unknown item rides in the amber band).
- Overview shows **item titles only**; each item's explanation is retained in the data (`data-detail` attributes) and moves to future detail sheets.
- **No "Unknown" label and no "Confirm" tag are shown in the UI.** The assistant resolves Unknown items later; the Job Detail page only reflects resulting readiness updates.
- All three groups use the same coloured-dot bullet rows; each **expanded group's status tint fades as a gradient** down through its rows.

---

## 4. Core product rules (non-negotiable)

- **Preference Match and Profile Readiness are separate.** Only **Preference Match** uses a **percentage**.
- **Profile Readiness never uses a percentage** — it is "x of y requirements evidenced".
- **Evidence Needed ≠ Requirement Mismatch ≠ Unknown:**
  - *Evidence Needed* — capability may exist; the profile doesn't yet **prove** it.
  - *Requirement Mismatch* — a **confirmed** conflict with a stated requirement.
  - *Unknown* — **not confirmed either way** (presented within "What to strengthen"). Unknown is **not** a mismatch.
- **Absence of a résumé keyword alone is not a confirmed mismatch** (it may be Unknown or Evidence Needed).
- **Salary, location, work-mode and other preference conflicts never appear inside Readiness** — they live only in Preference Match.
- **Never invent achievements, skills, metrics, or candidate evidence.**
- **Preference Match chip colours:** green = matches · amber/yellow = conflict or meaningful trade-off · grey = neutral (no preference captured).
- **Readiness group colours:** What already fits = green · What to strengthen = amber (includes Unknown internally) · What may hold you back = restrained red. No grey category is shown in the UI; grey must never represent a confirmed mismatch.

---

## 5. Visual direction

- **Calm intelligence.** Generous spacing, strong hierarchy, crisp copy, contained intelligence modules.
  AmbitionBox tokens + Figtree; brand blue `#3f5cfb` is the single loud colour; status colours are status-only.
  Tabular numerals for 89%, salary, rating, requirement counts.
- **AI-first liberties are intentional** (composition, progressive disclosure, subtle depth/glow, motion) but must stay
  recognisably AmbitionBox and reuse foundations — see `CLAUDE.md`.
- **Avoid:** generic AI gradients as surface fills, glassmorphism, dense dashboards, decorative clutter, low-contrast text.

### 5.1 Mobbin visual references (guides for spacing/rhythm/hierarchy/motion — NOT templates)
- **Journal (iOS)** — https://mobbin.com/apps/journal-ios-9819c592-b411-4cfa-a5bb-0a2bd90d52e8/90df7547-440b-4c6d-9257-9eb7fda8502b/screens
- **Lovi (iOS)** — https://mobbin.com/apps/lovi-ios-a3579a78-5f71-4605-8b4f-07b28595c3f5/edb007ea-76af-4349-a20e-6c02973808ec/screens

Reviewed via the Mobbin integration (genuine Journal + Lovi iOS screens examined, not metadata).
**Journal** → editorial hierarchy, uncluttered opening, mixed-density modules, compact metadata.
**Lovi** → calm breathing room, quiet status rows, light borders, soft spring-like motion, one dominant idea per viewport.
Do **not** copy Journal's media storytelling or Lovi's pastel/skincare personality.

---

## 6. Checkpoint plan

### Checkpoint 2A — Home: Career Action Hub — LOCKED
Canonical implementation: `prototype/home-2a.html`. The approved screen, top → bottom:
1. **Header & Navigation** — Dynamic greeting; notification bell & profile badge; horizontally scrollable folder-tabs (Home active).
2. **Next-best action** — "Review reply" hero card with in-card state transition (opening → review → sent → reranked).
3. **Secondary opportunity** — Juspay card pushed to the front after the hero action completes.
4. **New for you** — Horizontally scrollable rail of recommended jobs/events.
5. **Momentum** — Horizontally scrollable rail of 5 user stats with icons.
6. **Aurora quote** — Full-bleed gradient background that fades into the page, presenting a daily career affirmation.
7. **Floatbar** — Persistent bottom container with the Explore FAB and the Career Assistant pill.

### Checkpoint 1A — Direction B v2 — LOCKED
Canonical implementation: `prototype/job-detail-1a-direction-b.html`. The approved screen, top → bottom:
1. **Job identity** — role title; company + **AmbitionBox rating tag**; source ("via Naukri · Posted 2 days ago"). **Save + Apply on Naukri** actions sit above Preference Match.
2. **Preference Match** — computed-intelligence hero: spark mark + **89%** score badge; salary green chip (**₹24–30L · above ₹22L target**); preference-checked chips (green/amber/grey); **"See match breakdown"** entry point (bottom sheet deferred).
3. **Profile Readiness** — contained widget: **"10 of 15 requirements evidenced"** + 15-part meter; three groups (**What already fits / What to strengthen / What may hold you back**); titles-only overview; **"Close gaps · tailor your résumé"** assistant link at the bottom of the container.
4. **Assistant entry** — persistent bottom **"Ask the Career Assistant"** bar with a looping typewriter placeholder.

See §0.6 and §3.1 for the full locked decisions and readiness presentation.

### Deferred (do NOT build without an explicit instruction)
Preference Match **bottom sheet** · requirement-detail sheets · Career Assistant **chat** · résumé generation ·
application-question preparation · application flow · lower AmbitionBox Intelligence modules · **any Checkpoint 1B
functionality** · the **React/TypeScript port** (only after the locked visual structure is approved for porting).

**Do not begin Checkpoint 1B or build the Preference Match bottom sheet yet.**

---

## 7. Build & system references

- **Design system (READ-ONLY foundation):** `/Users/anmol.maggon/Documents/ai-exp/AmbitionBox Repos_Understanding_Product/design-system` — source under `ai/` (`HOW-TO-USE.md`, `DESIGN-SYSTEM.md`, `tokens.css`, `components.css`, `components.json`, `references/`). **Do not modify its generated files; do not copy the whole repo in.** See `CLAUDE.md`.
- **Canonical prototypes:** `prototype/home-2a.html` and `prototype/job-detail-1a-direction-b.html` (+ copied `tokens.css` / `components.css` in `prototype/`).
- Use `var(--token)` for every colour/size/spacing/radius/shadow/type where a token exists. No raw hex, no magic numbers (small effect-only alpha glows excepted).

---

## 8. Resolved decisions & notes
- Preview surfaces (rating tag, Preference Match hero, "See match breakdown", the in-container assistant link) are intentionally **non-interactive previews** at this checkpoint; their destinations are deferred. **Approved / locked.**
- "Apply on Naukri" links to the Naukri site as a real external navigation placeholder (no exact posting URL available). **Approved / locked** until a canonical posting URL is supplied.
- Assistant completion, tailored résumé, and application-question prep **live inside chat** (deferred), not on Job Detail.
