# AmbitionBox — Prototype + Deck
**Stakeholder handover · 17 July 2026**

## The two links

| Artifact | Link | Notes |
|---|---|---|
| **Interactive prototype** | https://claude.ai/code/artifact/caac7ff7-15ce-4bfa-8f0b-12e9a7c4c447 | Tap through it live. Fonts embedded, no network needed. |
| **Stakeholder deck** | https://claude.ai/code/artifact/c4331d48-2fc9-4616-8c2a-2c6040900311 | 18 slides. Arrow keys or the dots on the right. |

Both are private until you share them from the page's share menu. Source files: `New Vision/scout_demo.html` and `New Vision/scout_stakeholder_deck.html`.

**One presenter tip:** on the Tracker, the board moves on its own about 4 seconds after you land there. Uber jumps to Round 3, Meesho gets shortlisted, CRED's offer lands. If you need to replay it, press **`n`** while the Tracker is open. A card moving while nobody is touching the phone is the argument — let it happen and say nothing.

---

## Part 1 — What's new in the prototype since the deck was last built (14 → 17 Jul)

The old deck was built on 14 July. Almost all of the tracker work landed after it, which is why the deck needed this pass.

### The tracker was rebuilt on events, not statuses
Nothing about a job's state is stored any more. The lane, the status chip, the "2d ago", the tags, the dimming and the source chip are all **derived** from what AmbitionBox noticed in the inbox. One authored line per company produces the whole board. This is what makes "you never update it, it updates you" structurally true rather than a slogan.

- **Five lanes:** Applied · Interviewing · Offer · Ghosted · Closed/Rejected (Seen and Shortlisted are tags inside Applied, so 7 statuses across 5 lanes).
- **Ghosted is the only inferred state** — it is the *absence* of an email, measured against how fast that company actually replies. Everything else has a real message behind it.
- **20 companies** on the board, each with a real round sequence and a company-specific question bank.

### The board moves itself
Three scripted inbox events fire on a timer with no interaction, animating cards between lanes: Uber → Round 3, Meesho shortlisted, CRED offer ₹46L. Presenter hotkey `n` replays.

### Every stage now hands you a move — the big one
This is the change your reframe is about. All 7 statuses answer "what now?":

| Stage | What it noticed | The move |
|---|---|---|
| Applied | "Day 4 of about 6, nothing's wrong yet" | Get referred and skip the wait |
| Seen | A recruiter opened your application, twice | Reply while you're top of mind |
| Shortlisted | The loop this company runs, 4 rounds | See the loop |
| Interviewing | "No date yet for Round 3" | Prep on real questions from that exact round |
| Offer | "₹46L is above CRED's median of ₹40L, and there's still room" | See the negotiation draft |
| Ghosted | "You're past their window" | Nudge · referral · Void · close it out |
| Closed | "You did 3 rounds at Swiggy" | Share your experience |

### Job detail screen: 4 tabs
**Next steps · Company · History · Job** — running act → the data behind the act → the record → raw reference. "Next steps" is always the default; the hero action is never behind a tap. Cut worst-case scroll from 3.3 to 1.6 screens.

### Referral finder (new)
Three sources: your contacts, your LinkedIn, and **Naukri's database — "even ones you'd never find on LinkedIn."** That last leg is a family asset no competitor can copy. Ends in a WhatsApp or LinkedIn draft. It's the hero action of the Applied stage.

### The give-back moment (new)
Accepting an offer triggers the flywheel: *"You're going to CRED. That's the search done — 3 rounds, and you never once updated a spreadsheet."* Then two asks: share your CRED interview, and **review Razorpay — the company you're leaving.** This is the single best moment AmbitionBox will ever get to ask for content, and because the tracker watched the whole search, we're the only ones who know it has arrived.

### Also
- Naming reversed: the agent is **AmbitionBox**, no Scout sub-brand. Zero "Scout" in product copy.
- Match cards gained a 3-CTA row (Get referred · Apply · Skip).
- Honest absence: companies with no reviews render "Not enough reviews yet for this team" rather than guessing.

---

## Part 2 — What changed in the deck

**Your two calls:** AmbitionBox naming only, and fix-the-facts + add the new work, with the marketing framed around **making people intentional** about job search and the tracker as **assisted help at every stage**.

### The narrative reframe (intentionality)
- **Title** is now *"Job search, on purpose."* — the search stopped being a decision and became a numbers game; AmbitionBox makes it a decision again.
- **Problem slide** reframed from "Nobody works for the person looking for the job" to **"Every platform is built to make you apply more. None of them help you decide where."** Same empty-seat visual, now pointed at intentionality. Added: *"Applying more is not a strategy. It is what people fall back on when nobody will tell them which jobs are worth the effort."*
- **Verdict slide** is now **"A verdict is only worth something if it is allowed to say no."**
- **Product slide** is now **"1,840 postings. Three worth your time."**

### The competitive map (slide 13) — the 2×2 that was missing
This was Task 4 in the 14 July plan and had never been built. It's now in, Fuld-style: brand wordmarks on a 2×2, AmbitionBox highlighted and ringed, a callout in the empty quadrant, and a dotted arrow from where we are to where we're going.

**The axes are not the ones the plan specified,** and that's deliberate. "Penetration vs Differentiation" fails in this room for two reasons: on penetration, LinkedIn and Indeed beat us, and "differentiation" is a self-flattering label a sharp CEO will read as us grading our own homework. Instead the axes come straight out of your own research doc's synthesis:

- **X — what the fit judgment is built on:** the employer's *ad* (resume vs job post) → the employer's *record* (what they really pay, really ask, really do). This is §5's matrix row "Fit grounded in company truth", which is ✗ for Standout, TalentPluto, Sprout and Apuphi, and ◐ for Wobo, whose Glassdoor star the doc itself calls a "veneer".
- **Y — the candidate relationship:** a library you visit (episodic) → an agent that carries the search (continuous). This is the doc's own line: *"The startups have the relationship without the audience; we have the audience without the relationship."*

**Why it works:** it puts our weakness on an axis. AmbitionBox today sits bottom-right — hard against the right edge on data we own, on the floor on relationship we don't have. That concession is what buys the chart credibility. And it produces the punchline: **every rival's path to the empty corner is horizontal (manufacture a decade of company truth from a standing start, on ~$500K); ours is vertical (ship a product to an audience we already have).**

**The Glassdoor beat:** Glassdoor is plotted as our twin in the bottom-right, labelled "folded into Indeed, Sep 2025". Only two companies ever held an employer record like this, and the other one now belongs to a company that earns on application volume. Your doc's words: *"The neutral seat has been vacated."*

**Naukri is deliberately not plotted,** and the receipt line says so. Every Naukri mention in this deck is collaborative ("Naukri opens the doors", "via Naukri", "the Naukri bridge"). Putting Naukri in a losing quadrant would be the first Naukri-tension content in the deck and would break the forwardable rule. Your research doc sets the same precedent, excluding Naukri's Neo as family-internal. The receipt turns the omission into the argument: *"Naukri is family, not competition. Naukri opens the doors; this map is about who helps you choose which one to walk through."*

### The tracker reframe
- Headline changed from *"A tracker is a board you maintain. Ours maintains itself"* to **"A tracker tells you where things are. Ours tells you what to do next."** Self-maintaining is the mechanism; the help is the point.
- **New slide (08): "Seven stages. Every one answers the same question: what now?"** — the full stage table above, with the closing line *"Every other tracker stops at the left-hand column. The right-hand column is the product."* This is the slide that carries your reframe.
- **New slide (11): "Nobody else knows this moment is happening."** — the give-back flywheel, with the celebration and the two asks.
- Slide 10 reframed to **"Nobody touched the phone"** — the three real inbox toasts, which is also the self-moving board argument.

### Facts corrected against the live prototype
Every one of these would have been caught in the room:

| Was | Now |
|---|---|
| PhonePe ₹37–49L, median ₹43L, 27 reported | **₹22–28L, median ₹25L, you ₹15L, 847 engineering reviews** |
| "SCORE 86 / 64 / 56 / 52" | **Match % (92 / 68 / 35)** — the deck's own refusals slide bans a public candidate score |
| 5 spectrum cards incl. Razorpay as a match | **3 real cards: PhonePe Apply · Groww Stretch · Homerun Skip.** Razorpay is the candidate's *current employer* in the demo, the one they're asked to review |
| Tracker columns Applied / Seen | **5 real lanes,** with the real horizontal-lane layout |
| Cards for Freshworks and Google | **Neither exists in the demo.** Replaced with real ones |
| "14 applications" on the board | **20** |
| "5 applications found in your inbox" | **"14 applications found across 6 platforms," 847 emails scanned, 1 Swiggy duplicate merged** |
| "Postman offered ₹31L," 84th percentile | **Postman is ghosted.** The offer is **CRED ₹46L** vs median ₹40L, band to ₹52L |
| Navi "ASSESSMENT" | Not an event kind. Navi is **Applied** |
| Nav: Home · Tracker · Void · Alerts · Profile | **Matches · Tracker · Interview Qs · Profile · More,** with Void as a separate dark circle outside the divider |
| "A demo in weeks. Proof in months." | **"The demo is built. Now the proof."** |

### Other deck changes
- All 11 "Scout" references gone. The **binoculars mark is replaced by the real AmbitionBox glyph** — the binoculars were Scout's logo, and the demo uses no such mark. *Flagging this: if you want the binoculars back, it's a one-line revert.*
- Competitor matrix: the AmbitionBox column no longer claims "the plan" for things already running. **Solid blue = in the prototype today; dashed = Acts 2–3** (employers-approach and published-proof).
- Roadmap bullets that the prototype already demonstrates carry a green **IN THE DEMO** chip. The receipt notes explicitly that being demoable doesn't move a ship date.
- All 17 slides verified to fit 720p with zero console errors.

---

## Part 3 — Things to know before you present

**Deliberate calls I made, easy to revert:**
1. **The binoculars mark is gone** (see above).
2. **Em dashes survive inside quoted product strings only.** Your rule was no em dashes deck-wide; but those strings are quotes of what the prototype actually renders, and the title slide now claims every mockup matches the live prototype. Deck prose is clean.
3. **Referral finder and Void doors stay Phase III** in the roadmap even though both are demoable now. A prototype demoing something doesn't move its ship date — but if you want them pulled into Phase II, that's a product call, not a deck fix.

**The competitive map will draw the sharpest questions in the room. The five most likely, and the honest answers:**

1. **"You drew the X axis around the asset you happen to own."** The fair hit, and it lands on any incumbent-drawn map. Don't get defensive: the market picked this axis, not us. Two YC-backed firms independently built our thesis and the doc records their gap in their own shape ("they must infer company truth from conversations"). Wobo *pays* to display a Glassdoor star next to its score because it knows the score is naked without one. That's a competitor conceding the axis.
2. **"Indeed owns Glassdoor now, so they're already in your right half."** The best question on the slide. Indeed's own product is plotted where its product actually is: keyword fit, earns on volume. But the honest answer is that Indeed is the single biggest threat on this map — it is the one player that already holds the record and could move up, and doesn't, because volume pays. If Indeed ever chooses to, the chart changes overnight.
3. **"Owning the data isn't using it. You've had this corpus ten years and the verdict engine is still a slide."** Correct, and the chart concedes it by putting us on the floor. The answer this time is the demo: it isn't a slide any more, and you're about to run it.
4. **"That corner may be empty because it's a graveyard, not a white space."** The strongest intellectual attack, and your own §4.8 is a list of seven companies that died in it. The reply is real but it's an argument, not a proof: we're the only entrant that doesn't need the corner to pay for itself, because it feeds the flywheel.
5. **"72 lakh is a vanity number. SEO pit-stops aren't agent demand."** No chart resolves this. It is the bet. The doc says it plainly: *"we have the audience without the relationship. The moonshot is precisely the machine that converts one into the other."*

**Real inconsistencies in the prototype** (none are visible on the paths the deck shows, but a stakeholder tapping around could hit them):
1. **₹15L vs ₹18L.** The profile and all three match cards say current CTC **₹15L**. But all 20 tracker companies hardcode `you: '₹18L'` — which is the profile's *pay floor*, not current salary. So the tracker's "pays X% more than your current salary" maths runs off the wrong number. The deck only ever quotes ₹15L, so it's consistent; the demo isn't internally.
2. **6 yrs vs 7 yrs.** Profile and onboarding say 6 years of experience; every match card says 7.
3. **Three different application counts:** the onboarding theater says 14 found, the board holds 20, the profile's Gmail card says 5.
4. **"Interview Qs" opens a screen titled "Community."** The nav label and the heading disagree.
5. **"More" does nothing** — the button exists, the screen doesn't. Avoid tapping it.
6. **Void:** the static markup says "Day 6 of waiting on PayU" but it renders **Day 14** at runtime. The runtime number is the correct one.

None of these are hard to fix — they just weren't worth spending your remaining time on before the meeting. Flagging so nothing surprises you in the room.
</content>
