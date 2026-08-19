# AmbitionBox Jobseeker Assistant — CEO Demo Blueprint

> Working strategy for the pitch-deck prototypes. This document defines the demo narrative and the prototype coverage required to prove it. It does not supersede locked screen decisions in `PROJECT_CONTEXT.md`.

## 1. The idea in one sentence

Connect your career once, and AmbitionBox continuously understands your opportunities, organises your job search, improves your chances, and helps you make the right career decision.

## 2. What the demo must prove

This is not a tour of seven unrelated AI features. The demo follows one candidate, Arjun Mehta, through one continuous story:

1. AmbitionBox understands the job search already happening outside AmbitionBox.
2. AmbitionBox decides what deserves attention now.
3. AmbitionBox explains both job desirability and candidate readiness.
4. AmbitionBox helps the candidate improve with confirmed evidence only.
5. AmbitionBox prepares the candidate for the actual interview.
6. AmbitionBox unifies opportunities from multiple sources.
7. AmbitionBox remains valuable at the highest-stakes moment: the offer.

The narrative arc is **chaos → clarity → improvement → outcome**.

## 3. Canonical demo character

### Candidate

- Arjun Mehta
- Software Engineer at Razorpay
- 6 years of backend experience
- Bengaluru
- ₹15L current CTC
- ₹22L target CTC
- Seeking SDE-2 / Senior Backend roles

### Anchor opportunity

- Senior Backend Engineer at Juspay
- Sourced through Naukri
- Bengaluru · Hybrid · Full-time · 6–9 years
- Estimated ₹24–30L
- AmbitionBox rating: 4.0 from 847 reviews
- Initial Preference Match: 89%
- Initial Profile Readiness: 10 of 15 requirements evidenced

## 4. The seven AHA moments

### AHA 1 — Connect email and reconstruct the job search

**User belief before:** “I will have to manually enter every application.”

**Reveal:** Arjun connects Gmail. AmbitionBox finds application confirmations, recruiter threads, interview invitations, rejections, and offers, then builds his tracker automatically.

**Demo sequence:**

1. A lightweight pre-onboarding promise: “Bring your job search together.”
2. Connect Gmail with a clear privacy explanation.
3. A short, credible import state: scanning job-related messages, not the entire inbox.
4. Results reveal: applications found, active conversations found, one action due today.
5. Continue to the populated Tracker or Home.

**Key line:** “No spreadsheets. No manual updates. Your job search is already here.”

**Required prototype states:**

- Connect-email pre-onboarding
- Permission/privacy explanation
- Import/progress state
- Import summary
- Populated tracker state

**Existing proof:** Home already contains an email-derived PhonePe recruiter reply and can rerank after the reply is handled.

**Missing:** The connection, import, summary, and populated tracker reveal.

---

### AHA 2 — Turn readiness gaps into confirmed evidence

**User belief before:** “A low match score is just another rejection.”

**Reveal:** AmbitionBox distinguishes a missing skill from missing evidence, interviews Arjun one question at a time, and improves his résumé using only details he confirms.

**Demo sequence:**

1. Open Juspay Job Detail.
2. Show 89% Preference Match separately from 10/15 Profile Readiness.
3. Open Career Assistant: four areas can potentially be strengthened.
4. Use one strong demo answer to show adaptive evidence capture.
5. Fast-forward to review, generate the résumé, and return to updated readiness.
6. Preserve Java as a confirmed mismatch unless Arjun explicitly corrects it.

**Key line:** “AmbitionBox does not merely judge fit. It helps the candidate become better prepared—and never invents evidence.”

**Required prototype states:** Already implemented in `prototype/job-detail-1b.html`.

**Existing proof:** Strong end-to-end prototype, including 10/15 → 14/15, résumé PDF, honest mismatch handling, and optional confirmed Java correction.

**Missing:** Formal review/lock and a shortened CEO-demo path that reaches the payoff quickly.

---

### AHA 3 — Connect Naukri and understand profile plus preferences

**User belief before:** “AmbitionBox will make me rebuild my profile from scratch.”

**Reveal:** Arjun connects or imports his Naukri profile. AmbitionBox extracts his career profile and asks only for preference information it cannot infer safely.

**Demo sequence:**

1. Choose “Import from Naukri.”
2. Show extracted profile facts: current role, experience, location, skills.
3. Show inferred preferences separately from confirmed preferences.
4. Ask Arjun to confirm target role, salary, location, and work mode.
5. Reveal: “Your matches are now personalised.”
6. Land on the multi-source Matches or Jobs Feed.

**Key line:** “Bring the profile you already have. AmbitionBox adds the intelligence layer.”

**Required prototype states:**

- Source connection/import chooser
- Naukri import state
- Profile extraction review
- Preference confirmation
- Personalisation complete

**Existing proof:** The canonical Job Detail already evaluates Naukri-sourced Juspay against Arjun’s preferences.

**Missing:** The explicit import and confirmation experience.

---

### AHA 4 — Home knows what matters today

**User belief before:** “This will be another generic content feed.”

**Reveal:** Home prioritises a recruiter response. After Arjun handles it, the next-best opportunity moves into focus automatically.

**Demo sequence:**

1. Open Home with PhonePe recruiter reply in the hero.
2. Review and send the reply in place.
3. Show the success transition.
4. Juspay reranks into the hero position.
5. Briefly expose recommended jobs/events and career momentum.

**Key line:** “AmbitionBox turns career data into the next best action.”

**Required prototype states:** Already implemented in Home 2A.

**Existing proof:** Locked working prototype with deterministic opening, review, transition, reranked, and loading states.

**Missing:** A direct entry from the email-import reveal and a final CEO-demo timing pass.

---

### AHA 5 — Prepare for this interview, not a generic interview

**User belief before:** “Interview prep means a list of generic questions.”

**Reveal:** AmbitionBox combines the job description, Arjun’s résumé, readiness gaps, and AmbitionBox interview intelligence to build a targeted preparation session.

**Demo sequence:**

1. Tracker detects “Technical interview scheduled — Juspay.”
2. Assistant creates a personalised prep plan.
3. Show three focus areas: system design, Java gap handling, payments-scale discussion.
4. Start one realistic question sourced from the role/company pattern.
5. Arjun answers by text or voice.
6. Assistant gives structured feedback grounded in his evidence.
7. Show improved answer and session readiness summary.

**Key line:** “The assistant knows the company, the role, the candidate, and what the candidate still needs to prove.”

**Required prototype states:**

- Interview-detected tracker/home card
- Personalised prep plan
- Live practice question
- Answer feedback
- Improved answer or coaching step
- Prep completion summary

**Existing proof:** Prep entry points and the conversational assistant pattern exist.

**Missing:** The working interview-prep experience.

---

### AHA 6 — One intelligent jobs feed across all sources

**User belief before:** “My opportunities are scattered across apps, email, and browser tabs.”

**Reveal:** AmbitionBox presents jobs from Naukri, AmbitionBox, recruiter email, and company sources in one feed, with the same candidate-specific intelligence applied to every item.

**Demo sequence:**

1. Open “All opportunities.”

2. Show visibly different sources:
   - Juspay via Naukri
   - Zeta via AmbitionBox
   - PhonePe via recruiter email
   - Razorpay or another role via company careers page

3. Each item consistently shows:
   - Preference Match
   - Profile Readiness
   - Salary intelligence
   - Company rating/culture
   - Recommended next action

4. Filter or sort by “Best for me,” not merely recency.
5. Save one job and open the Juspay detail.

**Key line:** “The source can be anywhere. The intelligence layer is AmbitionBox.”

**Required prototype states:**

- Multi-source feed
- Source-specific labels
- Candidate-specific scoring
- Best-for-me ordering/filter
- Saved state
- Route into Job Detail

**Existing proof:** Matches 2B has a working finite deck, Juspay and Zeta fixtures, Pay/Culture/Profile Fit highlights, saving, and navigation.

**Missing:** More sources and a clearer “unified feed” reveal. The current two-card deck alone does not yet prove aggregation.

---

### AHA 7 — The offer-letter OMG moment

**User belief before:** “The assistant’s job ends when I get selected.”

**Reveal:** AmbitionBox detects the Juspay offer, celebrates the outcome, decodes the compensation, benchmarks it, identifies negotiation room, and helps Arjun decide.

**Demo sequence:**

1. A high-emotion Home/Tracker state: “You got the offer.”
2. Reveal headline: ₹28L offer, 27% above Arjun’s ₹22L target.
3. Decode fixed, variable, joining bonus, ESOP, and benefits.
4. Compare against:
   - Arjun’s current ₹15L CTC
   - Original ₹22L target
   - Estimated ₹24–30L role range
   - Relevant AmbitionBox salary intelligence
5. Show one meaningful caveat or negotiation opportunity.
6. Offer three actions: understand the offer, prepare negotiation, compare opportunities.
7. Generate a calm, editable negotiation message—never auto-send.

**Key line:** “AmbitionBox helps at the moment when career intelligence matters most.”

**Required prototype states:**

- Offer detected celebration
- Offer summary
- Compensation breakdown
- Benchmark comparison
- Trade-off/negotiation insight
- Editable negotiation assistance

**Existing proof:** None beyond the established email-detection and assistant interaction patterns.

**Missing:** The entire working finale.

## 5. Recommended live-demo click path

The live path should be short enough for an executive room while still showing the system’s breadth.

### Primary path — approximately 5–7 minutes

1. **Email pre-onboarding** — connect and instantly reconstruct the job search.
2. **Home** — handle PhonePe reply; watch Juspay rerank.
3. **Unified Jobs Feed** — show opportunities from multiple sources.
4. **Juspay Job Detail** — distinguish Preference Match from Profile Readiness.
5. **Career Assistant** — provide one answer, then jump to résumé review and 14/15 completion.
6. **Interview Prep** — answer one targeted Juspay question and receive feedback.
7. **Offer** — reveal ₹28L, benchmark it, and open negotiation help.

### Optional side path

- Naukri import can be shown before the feed if the pitch needs to emphasise acquisition and cross-platform profile portability.
- The Java correction branch is valuable for trust/AI-safety discussion but is too detailed for the default live path.

## 6. Prototype build priority

Priority is based on CEO-demo impact, narrative continuity, and reuse of existing patterns—not product-development chronology.

### Priority 1 — Connect email + automatic tracker reveal

Why first: It creates the “zero manual work” opening and explains how Home knows about external applications.

### Priority 2 — Offer-letter finale

Why second: It gives the demo a memorable emotional and strategic ending. It also proves AmbitionBox value beyond job discovery.

### Priority 3 — Interview Prep

Why third: It completes the “improve my chances” middle act and can reuse the existing assistant conversation UI.

### Priority 4 — Expand Matches into a visibly multi-source feed

Why fourth: Most mechanics already exist. The remaining work is primarily information architecture, source diversity, and the “Best for me” framing.

### Priority 5 — Naukri import and preference confirmation

Why fifth: Strategically important, but it can be shown as a shorter supporting path rather than occupying the main emotional arc.

### Existing moments to polish, not rebuild

- Home 2A
- Job Detail Direction B v2
- Profile-gap fulfilment / résumé flow

## 7. Demo principles

- Optimise for visible cause and effect. Every interaction should produce an intelligible change.
- Use one continuous Arjun/Juspay narrative across all screens.
- Keep real candidate control visible: review, correct, confirm, then act.
- Never imply inbox surveillance. Explain the narrow job-search data scope and user permission.
- Never invent skills, metrics, achievements, interview questions, salary data, or offer terms without clearly marking a prototype fixture.
- Distinguish deterministic prototype behaviour from future production intelligence when presenting.
- Prefer one decisive reveal per screen.
- Do not expose every branch during the live demo; preserve depth for follow-up questions.

## 8. Pitch-deck framing

### Strategic thesis

AmbitionBox can own the candidate relationship across the full career decision journey—even when the job, application, recruiter conversation, interview, or offer originates outside AmbitionBox.

### Product loop

**Connect → Understand → Prioritise → Improve → Prepare → Win → Decide**

### Defensibility shown by the prototypes

- AmbitionBox company, salary, culture, and interview intelligence
- Candidate context accumulated across the journey
- Cross-source opportunity normalisation
- Evidence-aware assistance rather than generic generation
- A persistent action layer spanning discovery through offer decision

## 9. Current evidence and governance gap

- `prototype/home-2a.html` is approved and locked.
- `prototype/job-detail-1a-direction-b.html` is approved and locked.
- `prototype/matches-2b.html` is implemented but not yet formally locked in `PROJECT_CONTEXT.md`.
- `prototype/job-detail-1b.html` contains a substantial working assistant and résumé flow, but `PROJECT_CONTEXT.md` still describes Checkpoint 1B as deferred.
- Before final packaging, Matches 2B and Assistant 1B need formal review, and the project source of truth must be reconciled with the accepted demo flow.

## 10. Definition of done for the CEO demo

The demo is ready only when:

- All seven AHA moments have an intentional prototype representation.
- The primary path can be clicked from beginning to end without manual URL editing.
- Every transition uses the same Arjun/Juspay story and consistent data.
- Existing locked screens remain visually intact unless explicitly reopened.
- Each high-value reveal has a deterministic presentation state for pitch-deck capture.
- Mobile layouts are visually verified at the chosen presentation viewport.
- The pitch deck can use still images while the live demo uses the same underlying screens.
- A short presenter script explains the user problem, interaction, reveal, and strategic implication for every moment.
