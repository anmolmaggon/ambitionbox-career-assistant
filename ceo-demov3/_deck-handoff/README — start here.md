# Pitch deck handoff pack

Everything needed to finalise the AmbitionBox pitch deck, packaged for a fresh session.
Assembled 19 August 2026 from the "New Vision" workstream.

**The product:** AmbitionBox as the candidate's agent. It watches the whole job market
for you, gives an honest verdict on the few jobs worth your effort (including "skip
this one"), and stays with you at every stage after you apply.

---

## What is in here

### /decks

**1 - Stakeholder deck v4 (17 Jul, current).html** — 18 slides. This is the live one.
Shown to the CEO, Business Head and Manager on 17 July. Built on the "Job search, on
purpose." spine. Open it in a browser and scroll or arrow through.

**2 - CEO pitch earlier cut (14 Jul, superseded).html** — 16 slides. The previous
version, kept only for reference. **Do not lift numbers from it.** It was built before
the tracker was rebuilt and quotes figures that exist nowhere in the product: PhonePe
at 37 to 49 lakhs when the real range is 22 to 28, a "SCORE 86" that is now a match
percentage, a Postman offer of 31 lakhs when Postman is ghosted and the real offer is
CRED at 46 lakhs, and cards for Freshworks and Google which are not in the demo at all.

### /research

**Vision — AmbitionBox, the Candidate's Agent.md** (draft v6) — the narrative. Why the
candidate's seat is empty worldwide and why AmbitionBox takes it.

**Product Blueprint — The Candidate's Agent.md** (draft v5) — the build-facing spec.
Surfaces, features, the three-phase roadmap, tracker logic, monetisation.

**Competitive Landscape — Candidate-Side Job Platforms.md** — ten platform teardowns
plus India market data. This is where the competitive 2x2 map on slide 13 comes from.
Figures are marked [vendor] for self-reported or [verified] for third-party sourced.

**CHANGELOG — Prototype + Deck (17 Jul 2026).md** — the handover doc. Most useful
section is the prep for the five likely CEO attacks and the answers to each.

**AmbitionBox_Naukri_Product_Boundary.docx** — where AmbitionBox ends and Naukri
begins. Relevant because the Naukri relationship is a live question in any pitch.

---

## Things to know before editing the deck

**The research is newer than the deck.** The deck footer cites Vision v5.2 and
Blueprint v4. The documents in this pack have since moved to v6 and v5. If the deck
and a document disagree, the document is more current. The main change: the "Scout"
sub-brand was dropped, and the agent now ships as AmbitionBox itself.

**Never write a number into the deck without checking it against the product first.**
This is the rule that came out of the v4 rebuild, after the earlier deck was found to
be quoting figures that existed nowhere. The source of truth is the interactive demo
at `New Vision/scout_demo.html` in the main working directory.

**Naming.** It is AmbitionBox, never Scout, in anything user-facing or stakeholder-
facing. The old binoculars mark went with the name.

### Standing rules for this deck

- Sell the dream. **No ask slide.**
- **No Naukri-tension content.** Every Naukri mention stays collaborative, because the
  deck has to be safely forwardable. Naukri is family, not competition.
- **No em dashes in deck prose.** One deliberate exception: em dashes survive inside
  quoted product strings and phone mockups, because the title slide claims every
  mockup matches the live prototype, and rewriting them would make the deck misquote
  the product.
- Every slide must fit a 720p screen.
- Visual bar is Standout.com restraint: whitespace, large serif display type, very
  little ornament. Real AmbitionBox design system throughout (Figtree, blue #4E68F4,
  JetBrains Mono for the small receipt lines).

### The competitive 2x2 (slide 13), and why its axes are what they are

An earlier plan proposed "Penetration vs Differentiation" as the axes. **Those were
rejected.** On penetration LinkedIn and Indeed beat us, and "differentiation" reads as
grading our own homework. The axes that survived:

- **Horizontal:** what the fit judgment is built on, running from the employer's *ad*
  to the employer's *record*.
- **Vertical:** the candidate relationship, running from a library you visit
  occasionally to an agent that carries the search continuously.

This works because it puts our own weakness on an axis. AmbitionBox today sits bottom
right: strong on company truth, on the floor on relationship. The punchline is
geometric. Every rival's path to the empty corner is horizontal, meaning they must
manufacture a decade of company truth on roughly half a million dollars. Ours is
vertical, meaning we ship a product to an audience we already have. Hence the
headline: everyone else has to move sideways, we only have to move up.

Glassdoor is plotted as our twin in the bottom right, labelled "folded into Indeed,
September 2025". Naukri is deliberately not plotted at all, and the slide says so
outright, turning the omission into part of the argument.

---

## Known inconsistencies in the underlying demo

These were raised on 17 July and left as open calls. They have not been fixed, so
watch for them if you pull numbers from the demo.

1. **Salary mismatch.** The profile and all three match cards say a current salary of
   15 lakhs, but every job block hardcodes 18 lakhs, which is actually the pay floor.
   This makes the tracker's "percent more than your current salary" maths wrong. The
   deck only ever quotes 15 lakhs, which is the correct figure.
2. Experience shows as 6 years on the profile and onboarding, 7 years on every match card.
3. Three different application counts appear: 14 in onboarding, 20 on the board, 5 on
   the profile card.
4. Navigation says "Interview Qs" but opens a screen titled "Community".
5. A "More" tab button exists with no screen behind it, so tapping does nothing.
6. Static markup says "Day 6 of waiting on PayU" but the running app renders Day 14,
   which is the correct one.
7. The referral finder and the VOID doors are demoable but still sit in Phase III on
   the roadmap. The deck marks them "IN THE DEMO" with a note that demoable does not
   mean shipped. Moving them into Phase II is a product decision, not a deck fix.
