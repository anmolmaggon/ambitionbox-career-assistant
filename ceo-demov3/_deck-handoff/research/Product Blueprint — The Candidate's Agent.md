# Product Blueprint — The Candidate's Agent

**Draft v5 · 17 July 2026 · New Vision workstream**
*(v5, prototype-reconciliation round: the Scout sub-brand is dropped — the agent ships as AmbitionBox itself; the tracker is respecified on **events, not statuses**, with the seven statuses and five lanes the prototype actually runs; every status now owes the user a move; the referral finder is written up properly and gains its third leg — **Naukri's database**; the give-back moment at offer-accept becomes a first-class contribution moment; §8 turns from a shot list into a record of what shipped. v4, stress-test round: "Tell your agent" open profile input; AB browsing intent becomes a profile signal, not just a doorway; GitHub + portfolio connectors pulled into Phase I — LinkedIn deliberately stays later (no public API; ToS-safety is a moat); interview rounds made first-class in the tracker schema; VIEWED downgraded to source-labelled best-effort; reconciliation prompts for the steps email never saw; stage-by-stage tracker value table added. v3: forwarding alias removed — Phase I tracking is Naukri import + one-tap logging, full inbox arrives in Phase II; auto-apply stance is "not for now" rather than "never"; interruption metric explained simply. v2 resolved Anmol's 30 review comments: Phases I/II/III, prep/WhatsApp/Void re-phased, profile connectors, daily/on-match digest, plain-language rewrites.)*
**Upstream:** [Vision v6](Vision%20—%20AmbitionBox,%20the%20Candidate's%20Agent.md) · [Competitive Landscape (updated 17 Jul)](Competitive%20Landscape%20—%20Candidate-Side%20Job%20Platforms.md) · India hiring research (Jul 2026)
**What this is:** the build-facing definition of Act 1 — surfaces, features, roadmap, logics, aha moments, modules, and monetization.
**On the prototype:** a working demo of Act 1 now exists (`New Vision/scout_demo.html`). It is a demo, not a spec — some of its choices are demo-scope rather than product decisions, and a feature being demoable does not move its ship date. Where this document and the prototype disagree, the disagreement is called out inline rather than smoothed over.

---

## 1. Product definition & constraints

**The product is an agent, not a tool — a broker who works only for you.** To consumers it ships as **AmbitionBox** — no sub-brand, no second name to learn before you can use the one you already trust ("agent" stays the internal and category term — see Vision v6). It watches the job market for you, tracks your entire search through your own inbox, and tells you the truth — including "skip this one." Its verdicts are private, explained, and grounded in AmbitionBox's company truth. Its customer today is the candidate; employer-side products come in later acts, and never at the cost of the agent's loyalty.

**The test every feature must pass:** *does this give the candidate more leverage than they had before?* If it merely extracts (attention, data, volume), it doesn't ship. **What this rule actually rejects, concretely:** infinite job feeds built for scroll time; application streaks and volume badges; notifications sent for traffic rather than usefulness; selling candidate contact data to recruiters; paywalling any truth (bands, ratings, verdicts); dark-pattern trials and forced ratings (the exact patterns burning Sprout/Wobo/AIApply).

**Build constraints (the anti-goals, restated for builders):**
1. **No auto-apply — for now.** Today the human applies; the agent guides *how* (see Phase I). An **assisted apply** may come later (Phase III+ decision gate): one job at a time, with your explicit approval per application. What stays permanent regardless: the agent never sprays, and applying is never priced or pitched on volume.
2. No score a candidate carries publicly. Verdicts are per-job, private, explainable.
3. No feature whose promise requires employer cooperation to function.
4. No employer influence on any verdict, ranking, or digest slot — enforced at the architecture level.
5. The free core (tracking, verdicts, digest) is never degraded to sell an upgrade.
6. Consent is granular, revocable, and legible; DPDP-compliant from the first line of code. **The full permission set, so we know what we're asking for:** Naukri account link (profile + applied jobs) · email, read-only, job-mail-only (Google restricted scope / Outlook equivalent) · calendar, read-only, optional (interview detection) · push notifications · WhatsApp opt-in (Phase III) · offer-letter parsing, separate opt-in · anonymized aggregate contribution (powers company response-rate data), separate opt-in. Each asked at the moment it unlocks value, never as a wall.

---

## 2. Experience architecture

### Where the agent lives
- **Home:** inside AmbitionBox — the app and mobile web. The agent is a first-class destination with its own tab. **Navigation note:** this takes the prime slot Communities currently occupies; with Communities in low-investment mode, its tab real estate is the natural space the agent inherits (decision to confirm with the AB app team).
- **Voice:** push notifications and email in Phases I–II; the **WhatsApp channel joins in Phase III**. Everything the agent ever says also lives visibly in-app — notifications are pointers, the app is the record.
- **Desktop web:** in plain terms — we build phone-first; a desktop version comes later and shows the same pipeline and verdicts on a bigger screen. Nothing desktop-only.

### Entry points (in priority order)
1. **Company pages — the contextual doorway.** Someone reading Swiggy reviews at 11pm is mid-search: *"Interviewing at Swiggy? I'll watch this one for you."*
2. **Salary and interview pages** — same mechanic, matched to the stage the page implies.
3. **Naukri bridge** — SSO + profile import. **Pitch note (important):** on Naukri surfaces the agent is *never* pitched as "better jobs" — that's a direct clash with Naukri's own product. There it's pitched as the thing Naukri doesn't do: *"track everything, everywhere, and know where you stand."* Complementary framing on family surfaces, differentiated framing everywhere else.
4. **Direct** — campaigns, referrals from the share-a-verdict loop.

### Surface map
| Surface | Job | Phase |
|---|---|---|
| Agent home | The agent's daily briefing: what changed overnight, what needs your action today, what it found for you | I |
| Digest deck | Fresh matches as they appear — a short, finishable card deck, daily or whenever there's a real match (never padded) | I |
| Verdict page | One job, one verdict, full reasons — backed by deep AB data on the spot: the salary band chart, culture ratings, interview difficulty, response behavior. Also reachable by pasting any job link | I |
| Pipeline | Every application, every status, every silence — agent-narrated, not a chore board | I |
| Offer analyzer | Percentiles, structure breakdown, negotiation intel, multi-offer comparison | II |
| Prep corner | Company-specific questions, mock interviews, interview-review history | II *(prep is a Naukri clash if led with in Phase I — see roadmap)* |
| Profile & connectors | What the agent knows about you, where it learned it, and every field showing what it unlocks; the connector list grows over time | I (basic) → ongoing |
| Consent controls | Lives **inside Settings** — what's connected, what's read, what's stored, one-tap revoke. Legible, not buried; but a settings surface, not a destination | I |

---

## 3. Feature inventory by module

Sizes: S (weeks), M (1–2 months), L (a quarter+ or hard dependencies). "Have" = exists in the family today.

### M1 · Ingestion, identity & the profile
| Feature | What it does | Phase | Needs / Have | Size |
|---|---|---|---|---|
| Naukri profile import | SSO + one-tap import of profile, work history, skills | I | Have: Naukri SSO bridge | S |
| Naukri applied-jobs import | Reconstructs an instant pipeline from Naukri application history | I | Have: niAppliedJobs | S |
| Resume parse | Zero-typing start for non-Naukri users | I | Standard parsing | S |
| Goals & preferences capture | The agent learns what you want — target roles, cities, salary, non-negotiables — through trades and inference-then-confirm, never a form | I | Design-led | S |
| **"Tell your agent"** | An open door on the profile (text/voice): volunteer what no import contains — the side project not on the resume, "can't relocate," the real skill hiding behind a vague designation. The agent extracts structured facts, you confirm each, and every fact carries a "you told me" provenance chip. A door, never a form — nothing required, nothing blank-to-fill | I | LLM extraction | S |
| AB browsing intent as profile signal | The company/salary/interview pages you read on AB stop being just the entry doorway and become live intent signal — "reading fintech companies for three weeks" sharpens verdicts before you've typed a word | I | Have: AB analytics (72L monthly visits) | S |
| GitHub + portfolio connect | One-tap GitHub OAuth (real skill evidence — our first users are developers) and paste-a-URL portfolio read | I | GitHub OAuth; URL fetch | S |
| **Profile connectors (ongoing program)** | The connector set keeps growing: LinkedIn (data-export upload only — no public profile API, and scraping breaks ToS, which is one of our four moats) and exports from AI assistants (ChatGPT/Claude/Gemini — a file the user exports and uploads, not OAuth; extraction-only: we keep the confirmed facts, never the raw conversations). Each connector = a project; the profile keeps getting richer for years | II → ongoing | Per-connector integrations | M each |
| Full inbox connect | Gmail/Outlook/IMAP, read-only, job-mail-only | II | Google restricted-scope review (start now — long lead) | L |
| Email event classifier | Turns mail into events: applied, viewed, assessment, interview, offer, rejection | II | New ML/LLM pipeline | L |
| Calendar hook | Detects interviews; powers interview-review timing | II | OAuth scope with inbox | M |
| One-tap manual logging | "Recruiter called" / "Referral sent" / "WhatsApp lead" in two taps — the India blind-spot fix | I | Design-critical, simple | S |
| Consent controls | Granular, legible, revocable; in Settings | I | DPDP counsel | M |

### M2 · The pipeline (tracker)
| Feature | What it does | Phase | Needs / Have | Size |
|---|---|---|---|---|
| Unified pipeline | All applications, all sources, one honest view | I (lite: Naukri imports + manual logging) | M1 | M |
| Auto status updates | Email/calendar events move cards without user effort. **VIEWED is source-labelled best-effort:** reliable for Naukri applications (recruiter activity flows through the family bridge, no email needed), occasional on LinkedIn, absent on career sites — and the UI never lets "no viewed signal" read as "not viewed" | II (Naukri-bridge VIEWED can land in I) | Classifier; Naukri bridge | M |
| Rounds as first-class records | An application holds a process; a process holds **rounds 1..n**, each with its own scheduled/done/review. Interview emails usually name the round ("Round 2 — Technical") so the classifier infers it; a one-tap confirm covers the rest. The same structure *is* Act 2's process-shape data ("typically 4 rounds, 3 weeks") — fixing the schema builds the moat | II (schema in ledger from day one) | Ledger schema | M |
| Reconciliation prompts | When an email implies a step we never saw ("congratulations on clearing the screening"), the agent asks: *"looks like there was a phone round I missed — add it?"* The inbox catches its own gaps — critical in India, where the highest-converting channels (calls, referrals, WhatsApp) leave no trail | II | Classifier | S |
| Silence & ghost detection | Flags no-response beyond company norms; names it plainly | II | Telemetry norms (bootstrap: defaults) | M |
| Follow-up nudges + drafts | "Day 11 of usually-9 — send this?" with an editable draft | II | Silence rules | M |
| 90-day multi-offer manager | In plain terms: one view to juggle several offers at once through an Indian notice period — who offered what, notice dates, buyout math, counter-offers | II | Offer events + manual inputs | M |
| Process insights per application | Rounds so far, typical gaps, expected next step | II | Telemetry (bootstrap: told data) | M |

**The architecture: events, not statuses.** Nothing about a job's state is stored. The lane, the status chip, the "2d ago", the tags, the dimming, the source chip — all of it is *derived* from what the agent noticed in the inbox. One authored line of history per company produces the whole board. This is the choice that makes "you never update it, it updates you" structurally true rather than a slogan: state is a function of events, and the user is not a writer. The prototype proved it out, and it should be the schema.

**Seven statuses across five lanes.** Seen and Shortlisted are tags inside Applied, not lanes of their own — a shortlisted application is still an application, and giving it its own column would tell the user their board is moving when it isn't.

| Lane | Statuses it holds |
|---|---|
| Applied | Applied · Seen · Shortlisted |
| Interviewing | Interviewing |
| Offer | Offer |
| Ghosted | Ghosted |
| Closed / Rejected | Closed |

**Ghosted is the only inferred state.** It is the *absence* of an email, measured against how fast that company actually replies. Every other status has a real message behind it. The asymmetry is deliberate: we infer only where the inference is the entire value.

**What the tracker gives the user at each stage** — the answer to "everyone has a tracker": *a tracker tells you where things are; ours tells you what to do next.* Self-maintaining is the mechanism, not the point. Every status owes the user a move:

| Status | What it noticed | The move it hands you |
|---|---|---|
| Applied | "Day 4 of about 6 — nothing's wrong yet" | Get referred and skip the wait |
| Seen | A recruiter opened your application, twice | Reply while you're top of mind |
| Shortlisted | The loop this company runs — four rounds | See the loop |
| Interviewing | "No date yet for Round 3" | Prep on real questions from that exact round |
| Offer | "₹46L is above their median of ₹40L, and there's still room" | See the negotiation draft |
| Ghosted | "You're past their window" | Nudge · referral · Void · close it out |
| Closed | "You did three rounds there" | Share your experience |

**Every other tracker stops at the middle column. The right-hand column is the product.**

**Where the old stage rows went.** Earlier drafts listed Viewed, Assessment, Silence, Interview-scheduled and Interview-done as tracker *stages*. They are events, not statuses: they fire moments (the T-48h prep push, the +2h interview-review ask, the day-11 follow-up draft — see §6 nudge triggers) and they move a card between lanes, but none of them is a place a card sits. Silence is a moment inside Applied, not a lane; only its terminal form, Ghosted, is one. The operational detail from those rows is preserved — the honest day-zero expectation ("this company replies to 12% of applicants, usually within 9 days"), the named silence with its norm, the closure-plus-perspective on a rejection ("not you — this posting interviewed 3%") — it just hangs off events and the per-status move, not off a stage list.

### M3 · The verdict engine (Best Fit)
| Feature | What it does | Phase | Needs / Have | Size |
|---|---|---|---|---|
| Job ingestion v1 | Naukri inventory via jobs API. **Differentiation note:** we consume Naukri's inventory but must never look like a second job feed — the product is the *verdict on top*, and the pitch must always lead with what Naukri doesn't do | I | Have: jobs API | S |
| Job ingestion v2 | Career sites/other boards for coverage | III | Scraping/partnerships | L |
| JD parser | Extracts role, level, skills, salary hints | I | LLM parsing | M |
| Fit computation v1 | Candidate truth × company truth, six dimensions | I | Have: corpus; weights §6 | L |
| Verdicts (Apply/Stretch/Skip) | Plain-language reasons, evidence, road-back on Skips | I | Fit v1 | M |
| **How-to-apply guidance** | With every Apply verdict, the agent also says *how*: best channel (referral first if one exists, direct portal vs job board), timing, what to lead with — the candidate applies, guided. (Anmol's addition; the bridge until assisted apply) | I | Verdicts + channel data | S |
| **Referral finder** | For any application, finds the people who could put in a word, across three sources: your contacts, your LinkedIn, and **Naukri's database — "even ones you'd never find on LinkedIn."** Ends in a WhatsApp or LinkedIn draft, not a list of names. In India referrals convert 10–20× better than cold applications, which makes this the hero action of the Applied stage rather than a nicety — and the third source is the leg no competitor can build, because it needs an employer graph the family already owns. **Dependency to flag honestly:** the Naukri-database leg is an unscoped family data-access ask, not an engineering task; the first two legs stand on their own if it doesn't land | III *(demoable today — see §8)* | Contacts permission; LinkedIn export; **Naukri DB access — family decision, not yet scoped** | L |
| Paste-a-link verdict | Any job URL → verdict; shareable | I | JD parser | S |
| Digest ("your matches") | **Daily, or whenever a real match appears** — a short finishable deck; volume varies honestly with the market; silence when nothing clears the bar | I | Fit v1 + §6 logic | M |
| Trades feedback loop | Every reaction and correction sharpens the model | I | Event capture | M |
| Assisted apply (future) | Approval-gated: the agent prepares and submits one application at a time, each with your explicit yes. Candidate for premium. **Never volume, never per-application pricing** | III+ (decision gate) | Trust + verdicts proven first | L |

### M4 · Contextual truth delivery
| Feature | What it does | Phase | Needs / Have | Size |
|---|---|---|---|---|
| Stage-triggered content | Reviews at decision, salaries at offer (interview questions join in Phase II with prep). **Delivery: pushed via notification/email at the moment; always visible in-app regardless** | I (reviews/salaries) · II (questions) | Have: corpus | M |
| Offer analyzer | Percentile vs real band, structure breakdown, negotiation intel | II | Have: salary corpus | M |
| Interruption quality metric | Explained simply: every time we ping you, we watch what happens next. Tapped it and did something? It helped. Ignored it or swiped it away? It annoyed you. We count this for every *type* of ping — and any type that mostly annoys people gets switched off. The app learns to interrupt only when it's worth it | I | Analytics | S |

### M5 · Interview intelligence *(Phase II — prep in Phase I clashes head-on with Naukri's own prep products; when it comes, it comes differentiated: company-specific, from our own question bank)*
| Feature | What it does | Phase | Needs / Have | Size |
|---|---|---|---|---|
| Interview detection | Calendar + email spot the loop and the round | II | M1 | S |
| **Interview review** (was "debrief") | Right after your interview, the agent asks two questions: how did it go, what did they ask. It's a review of the interview round — the same contribution DNA as AB reviews, captured at the perfect moment | II | Detection + prompt design | S |
| Question-bank refresh | Interview reviews feed the 4L+ bank in near-real time | II | Data pipeline | M |
| Company-specific AI mock | Practice with that company's actual questions; feedback | II | Have: question bank | M |

### M6 · Agent voice & engagement
| Feature | What it does | Phase | Needs / Have | Size |
|---|---|---|---|---|
| Notification strategy | Few, timed, useful; silence is a feature; everything mirrored in-app | I | Trigger rules §6 | M |
| Agent chat | Ask anything: "should I take this offer?" | II | LLM + context | M |
| Morale & progress | Progress framing, "not you, the market" stats, small wins | II | Design-led | M |
| WhatsApp channel | Digest ready, nudges, interview-review asks — opt-in | III | WhatsApp Business API | M |

### M7 · Contribution moments *(bridging to Void)*
| Feature | What it does | Phase | Needs / Have | Size |
|---|---|---|---|---|
| Timed contribution prompts, v1 | At the emotional moments (day-10 silence, rejection, post-interview, 30/60/90 days post-joining) the agent offers **our existing forms** — write the review, share the interview experience, update your salary — timed to when people actually have something to say | II | Have: all AB contribution forms | S |
| **The give-back moment** (offer accepted) | Accepting an offer ends the search, and the agent says so first: *"You're going to CRED. That's the search done — three rounds, and you never once updated a spreadsheet."* Then it asks for exactly two things: the interview experience at the company you're **joining**, and a review of the company you're **leaving**. Both anonymous, never tied to the profile. This is the single best moment AB will ever get to ask for content — the user has just won, they know precisely what helped, and both asks are about employers they now know cold. **And nobody else can find this moment:** it takes having watched the whole search to know it has arrived. This is the flywheel closing — the tracker paying the corpus back | II | Have: contribution forms; offer-accept event | S |
| Void doors + fragments | The same moments route to Void (vent doors in; curated whispers out at decision moments) once Void ships on its own track | III | Void live | S |

### M8 · Data backbone
| Feature | What it does | Phase | Needs / Have | Size |
|---|---|---|---|---|
| Outcome telemetry ledger | In plain terms: the database that records every application event (applied, reply, interview, offer, silence) with consent — it's what lets us compute company response rates, personalize verdicts, and later *prove* guided applications convert better | I (schema) → II (live) | Core schema work | M |
| Hiring-reality aggregates (internal) | Response rates, ghost rates, process shapes per company — internal first | II | Ledger | M |
| Proof-loop instrumentation | Guided vs unguided cohorts, within-person | II | Ledger + §6 definitions | M |
| Analytics events | Aha funnel, interruption quality, verdict agreement | I | Standard | S |

---

## 4. The aha chain

| # | Moment | When | What happens | Trust line |
|---|---|---|---|---|
| 0 | The doorway | Before signup | Company page: "This company replies to N% of applicants in ~X days" + "I'll watch this one for you" | Never fabricate; show nothing where data is thin |
| 1 | "It already knows" | 60 seconds | Naukri import → pipeline reconstructed + profile filled + instant verdicts on their own recent applications | Verdicts must cite real evidence |
| 2 | "My last 90 days, reconstructed" | The day the inbox connects (Phase II) | "23 applications found: 4 alive, 11 ghosted, 2 interviews next week" | Read-only, job-mail-only, visibly so |
| 3 | The first true red light | Week 1 | A Skip with a reason the user *knows* is right | Checkable against AB's public data |
| 4 | The agent noticed | Week 1–2 (Phase II) | "Day 11 — they usually reply by day 9. Want this follow-up draft?" | Nudge only when the norm is real |
| 5 | The interview review | First interview (Phase II) | Two hours after the loop: "How did it go? What did they ask?" — then a mock for round 2 | Asked once, gently |
| 6 | The offer reveal | First offer (Phase II) | "₹24L is the 38th percentile for this exact role. Here's your headroom." | Real percentiles or nothing |
| 7 | **The give-back** | Offer accepted (Phase II) | "That's the search done — three rounds, and you never once updated a spreadsheet." Then two asks: share the interview at the company you're joining, review the one you're leaving | Asked at the win, never before it; both anonymous |

Activation target: aha 1 in the first minute; one of 3–6 within two weeks; aha 2 on the day the inbox connects once Phase II ships.

Aha 7 is the only one that pays the company back rather than the user, which is exactly why it sits last and behind a win. It is also the measurable end of the loop: the search that started at aha 0 with someone else's review ends with this user writing one.

---

## 5. Roadmap — Phase I / II / III

**A standing rule, now that a prototype exists:** several Phase III items are demoable today (the referral finder, Void doors). *A demo does not move a ship date.* The prototype fakes its data, skips every permission grant, and answers to nobody's uptime — the distance between "it works in the demo" and "it works for 72 lakh people" is the actual project. Demoable items are marked below so the roadmap and the demo can't be read as contradicting each other. If any of them genuinely should move earlier, that's a product call taken on its own merits, not a consequence of having been prototyped.

### Phase I (months 0–3) — "the agent that already knows"
The smallest build that delivers ahas 0, 1, and 3, with no OAuth wait and no Naukri clash (aha 2 arrives with the inbox in Phase II):
- Naukri profile + applied-jobs import (aha 1)
- **Goals & preferences capture** — light, trade-based (the agent understands what you want, not just what you've done)
- **"Tell your agent"** — the open door for what no import contains (volunteered facts, confirmed, provenance-chipped)
- **GitHub + portfolio connect** — our first users are developers; LinkedIn deliberately waits (no public API; ToS-safety is the moat)
- **AB browsing intent as profile signal** — the 72L monthly visits stop being just a doorway
- One-tap manual logging — recruiter calls, referrals, WhatsApp leads; the India blind spot covered from day one
- Verdicts v1 on Naukri inventory + paste-a-link verdict (aha 3) + **how-to-apply guidance** on every Apply
- Digest v1 — daily / on-match, never padded
- Stage-triggered content v1 — reviews and salaries on pipeline cards (interview questions wait for Phase II with prep)
- Agent home, company-page entry (aha 0 with bootstrap data), consent controls in Settings
- **Started in parallel (long-lead):** Google restricted-scope OAuth, email classifier, telemetry ledger schema
- **Deliberately not in Phase I:** interview prep (head-on Naukri clash — enters Phase II differentiated as company-specific), WhatsApp (Phase III), Void (Phase III)

**Why this first:** proves the two riskiest bets cheaply — verdicts that feel *true*, and a company-page doorway that converts — while every long-lead item runs in parallel. Demoable in weeks.

### Phase II (months 3–9) — "the agent that sees everything"
- Full inbox connect + classifier at depth (aha 2 at scale); calendar hook
- Silence/ghost detection + follow-up nudges (aha 4)
- Interview intelligence: detection, **interview reviews**, question-bank refresh, company-specific mocks (aha 5) — differentiated prep, not generic
- Offer analyzer + 90-day multi-offer manager (aha 6)
- Profile connectors continue (LinkedIn export-upload, AI-assistant exports; GitHub + portfolio shipped in Phase I)
- Agent chat v1; morale & progress layer
- Timed contribution prompts via existing AB forms (M7 v1), including **the give-back moment at offer-accept** (aha 7) — the flywheel's closing beat
- Telemetry ledger live; internal hiring-reality aggregates accumulating

### Phase III (months 9–18) — "the agent that proves it"
- Job ingestion v2 (beyond Naukri inventory); fit search; freshness alerts
- WhatsApp voice channel
- Void doors and fragments (when Void ships) — *demoable in the prototype today*
- **Referral finder** — three sources, including Naukri's database — *demoable in the prototype today*; the Naukri-database leg additionally needs a family data-access decision before it can be scoped
- More profile connectors (AI-assistant exports at depth, others as they earn their build)
- Hiring-reality publication decision gate (leadership call); proof-loop first internal read
- **Assisted apply decision gate** (approval-gated, possibly premium) and **premium decision gate** — both only after the free core has earned trust

---

## 6. Core logics — deliberately shallow for now

*(Per Anmol: enough definition here to build honest demos; the deep specification of each logic is a later workstream, after prototypes. What follows is the demo-grade version.)*

- **Email event taxonomy:** APPLIED · VIEWED (source-labelled: Naukri bridge = reliable, LinkedIn = occasional, career sites = never — absence is never shown as "not viewed") · ASSESSMENT · INTERVIEW_SCHEDULED / INTERVIEW_DONE (each carries a round number — the schema is application → process → rounds 1..n) · OFFER · REJECTED · RECRUITER_REPLY · SILENCE (derived). Events carry confidence; low-confidence asks a one-tap confirm (which is also a trade); an event implying an unseen prior step fires a reconciliation prompt.
- **Events are not lanes.** The taxonomy above is the *input*; the seven statuses across five lanes (§M2) are the *projection*. ASSESSMENT and VIEWED fire moments and can move a card, but neither is a place a card sits — the prototype ingests assessment mail without giving it a lane, and that's the right call. Keep the two vocabularies separate in the code as well as the copy; conflating them is what produced the old stage list.
- **Fit score v1 (cold-start weights, telemetry re-weights later):** level/skill 30 · pay 25 · culture 15 · responsiveness 10 · interview readiness 10 · freshness/crowd 10. Hard fails override (pay beyond band p90, level mismatch 2+, responsiveness below floor). 70+ Apply · 45–69 Stretch · under 45 Skip. Always: top two reasons + biggest concern, never a bare number.
- **Silence rules:** company median when known, else defaults (14d application / 7d post-interview); SILENCE at window+2 → nudge; GHOSTED at 2× window — plain word, deliberately.
- **Digest selection:** daily or on-match; short and finishable; max 2 per company; fresh postings favored; include an honest Stretch; **never pad** — an empty day says nothing at all, and an empty week says "good week to prep."
- **Nudge triggers (short list, by design):** match found · silence window crossed · interview T-48h · interview +2h (review ask) · offer detected · consent events.
- **Proof cohorts:** guided = applied via digest or after viewing an Apply verdict; unguided = tracked, no verdict interaction. Interview-invite rate per application, within-person, pre-registered methodology.

---

## 7. Modules & monetization

### Build packaging
M1 + M8 are the spine. M2/M3 ride on M1; M4/M5 on M2/M3 + corpus; M6 wraps; M7 v1 uses existing forms (Void joins in Phase III). Phase I slices across M1 (light) + M2 (lite) + M3 (v1) + M4 (v1).

### Monetization — treated honestly
**The inviolable free core:** tracking, verdicts, the digest, basic contextual truth, consent controls. Free must stay genuinely great — that's the trust and data engine.

**Candidate premium — "Agent+" (decision gate in Phase III, not at launch):**
| Candidate | What it is | Guardrail check |
|---|---|---|
| Unlimited company-specific mocks | Free: 1 per company per round; premium: unlimited, deeper feedback | Prep depth, not truth — passes |
| Negotiation war-room | Guided live-offer negotiation: scripts, comparables, counter simulation | Advisory depth — passes |
| Priority watch + instant alerts | Continuous watch on target companies; fresh-posting alerts in minutes | Speed of service — passes |
| Multi-offer advisor | Deep comparison + notice/buyout planning | Advisory depth — passes |
| Application concierge | Tailored resume per application, user approves each | Convenience, never auto-sent — passes |
| **Assisted apply** | The agent submits for you — one job at a time, explicit approval each time | Passes **only** as approval-gated assistance; the moment it's priced or pitched on volume, it violates anti-goal 1 |

**Price hypotheses (to test):** ₹199/mo entry · ₹299–349/mo Agent+ · ₹99 "offer week" pass. Post-hire: Agent+ free for 30 days after accepting an offer (goodwill; seeds contributions and the next search).

**B2B SKUs (Acts 2–3, sketched):** Employer Branding 2.0 · Fit-Verified (the family SKU into Naukri recruiter products) · quality-of-hire analytics. All depend on the ledger existing from day one.

---

## 8. The prototype — **built, 17 July 2026**

*(In v4 this section was a shot list and the next step. It's now a record of what shipped.)* Coded, mobile-first, AB brand tokens, one persona — an engineer six years in, earning ₹15L at Razorpay — and realistic Indian data throughout. Source: `New Vision/scout_demo.html`.

**Against the six shots v4 called for:**

| v4 shot | State | What actually exists |
|---|---|---|
| 1. The doorway + first session | **Built** | Ten-screen onboarding: login → fork → industry → location → salary → what matters → what you've been reading → email scan → connect → the reveal. The inbox-connect ask is staged after value, as specified |
| 2. The digest deck + verdict card | **Built** | Three real cards — PhonePe **Apply** · Groww **Stretch** · Homerun **Skip** — with evidence, the road back, and a three-CTA row (Get referred · Apply · Skip) |
| 3. The pipeline | **Built, and it went deepest** | 20 companies, five lanes, seven statuses, every one of them derived from events (§M2). A four-tab detail screen: Next steps · Company · History · Job, with the hero action never behind a tap. Three scripted inbox events rearrange the board with nobody touching the phone |
| 4. Agent conversations | **Partial** | The three inbox events land as toasts and move cards live. There is no chat surface and no notification tray — the agent's voice arrives as *things happening* rather than as messages, which turned out to be the stronger demo and may be the better product |
| 5. The offer analyzer | **Built, but not where v4 put it** | It lives inside the tracker's Offer status rather than as its own surface: ₹46L against a ₹40L median, headroom to ₹52L, and a negotiation draft. The relocation is the better call — an analyzer is a place you have to go; a status is where you already are |
| 6. Profile & connectors + consent in Settings | **Half built** | The profile and its connectors exist. **Consent-in-Settings does not** — "More" is a button with no screen behind it. This is the one v4 commitment the prototype didn't honour, and for a trust product it's the one that matters most |

**Built beyond the shot list** — none of these were in v4, and the first two became the strongest parts of the demo:
- **The referral finder** (M3) — three sources, ending in a draft. The hero action of the Applied stage.
- **The give-back moment** (M7, aha 7) — offer-accept triggers the two asks. The flywheel closing.
- **Void doors** — reachable from a ghosted application.
- **Interview questions** — company-specific, per round.

**Known gaps in the prototype**, recorded so they aren't mistaken for product decisions:
1. **₹15L vs ₹18L.** The profile and all three match cards say the candidate earns ₹15L; all 20 tracker companies hardcode ₹18L, which is the profile's *pay floor*, not current salary. The tracker's "pays X% more than you earn now" maths runs off the wrong number.
2. **Six years vs seven.** Profile and onboarding say six years' experience; every match card says seven.
3. **Three different application counts.** Onboarding says 14 found, the board holds 20, the profile's Gmail card says 5.
4. **"Interview Qs" opens a screen titled "Community."** The nav label and the heading disagree.
5. **"More" has no screen** — the same gap as the missing consent surface above.
6. **Void's markup says "Day 6 of waiting on PayU" but renders Day 14.** The runtime number is the correct one.

None of these are visible on the paths the stakeholder deck walks, and none is hard to fix. They are demo bugs, not spec changes.

**What the prototype settled** — the parts that earned their way into this spec rather than staying demo trivia:
- The tracker's event-sourced architecture, and its projection into seven statuses across five lanes (§M2).
- That every status must hand the user a move. This is the change that turns a tracker into a product, and it is now the spec.
- That the offer analyzer belongs inside the tracker rather than beside it.
- That the agent's voice reads better as the board moving than as a message arriving.

## 9. Metrics

- **Activation:** % reaching aha 1 (<60s), any of 3–6 (two weeks); from Phase II, aha 2 on connect day. Inbox-connect rate is the most important input metric.
- **Engagement:** digest open + finish rate; verdict agreement rate; pipeline weekly return.
- **Trust:** consent retention, notification opt-out rate, interruption-quality scores.
- **North stars:** weekly active jobseekers, tracked applications → (Act 2) shortlist-rate lift, applications-per-offer.

---

*Source of record: this Markdown file in `New Vision/`. Google Doc copy for comments; agreed changes land here first. The §8 prototype is built; the next steps are the decisions it was made to provoke — the Naukri data-access ask behind the referral finder, the consent surface it skipped, and whether the Phase I scope this spec describes is still the right first slice now that there's something to tap.*
