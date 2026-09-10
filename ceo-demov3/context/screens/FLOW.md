# Flow

The thread a card opens into. Owner: Claude. All layers `draft`.

Implementation: `src/Flow.jsx` (engine), `src/flows.js` (scripts), `src/flow.css`.
Route: `/flow/:type?application=:id`.

## Job

Take one thing that needs the user, do the work that can be done without them, name the
one thing that cannot, and hand back something they can use.

## Why a thread and not a screen

The six flows differ in what they show, not in how they proceed. Every one of them finds
something, shows the artifact, asks the question only the user can answer, and produces a
draft, a plan or a verdict. That shape is the engine; the scripts are the content.

A form would ask everything up front, before the user has seen why any of it matters. A
chat with no UI elements would make someone type what a chip can answer, and would have
nowhere to put a ₹28L figure or an editable draft. This is neither.

## The visual grammar

**North's speech sits straight on the canvas. What North produces is a card.**

That is the whole rule. A message, a thinking line and a question are text on the page.
A quote, a plan, a draft, a figure, a timeline and a verdict are surfaces. If a new step
type is speech it must not gain a container, and if it is work it must not lose one.

The chevron marks who is speaking and appears **once per run**, not on every turn — North
talks for four or five turns at a stretch, and repeating the mark down all of them turns
the speaker into a column of decoration. The slot is kept but emptied, so every turn in a
run stays on one left edge. While North is working the mark rises rather than spins: a
bearing points, it does not search.

## The context gap

Every flow has exactly one turn where North says what it does not know and asks for it.

| Flow | The gap |
|---|---|
| `reply` | Notice period — not on the profile |
| `prep` | Which slot is free — the calendar is not connected |
| `debrief` | How the round went — no email reports that |
| `rejection` | Whether the reasoning matches what the user felt in the room |
| `ghosted` | Whether they still want it, and how direct to be |
| `offer` | What the user wants out of the move |

This is the honest version of an agent: it does the work it can and names the gap rather
than inventing across it. The gap turn takes a **rule, not a colour** — it is the honest
part of the conversation, not the alarming part.

Owner instruction 2026-09-10: "Assistant asks if anything/context is missing to fill
gaps", placed inside the flows rather than as a card on Home.

## The engine

- North's turns reveal on a timer (620ms; a `thinking` turn holds 1150ms) so the thread
  reads as it builds. The reader watches the work happen instead of arriving after it.
- The thread stops at any `choice`, `input` or `actions` step and waits.
- The answer is echoed into the thread as the user's own turn, so scrolling up reads as a
  conversation rather than a form someone filled in.
- `when` lets an answer make a later step irrelevant — choosing to close a ghosted
  application drops the draft step entirely, so the thread shortens mid-conversation.
- `text`, `title`, `items` and `options` may be functions of the answers so far. That is
  how the reply draft carries the notice period the user just picked.
- Under reduced motion every reveal is immediate.

## Step types

| Type | Renders | Blocks |
|---|---|---|
| `message` | speech | no |
| `thinking` | speech with dots, the chevron rising | no |
| `quote` | an email, with sender and source | no |
| `detail` | labelled rows | no |
| `list` | toned items with a source line | no |
| `timeline` | vertical steps, the quiet one drawn as an absence | no |
| `figure` | one number with its split | no |
| `draft` | editable text with Copy | no |
| `verdict` | the conclusion | no |
| `choice` | chips in the dock, single or multi | **yes** |
| `input` | one text line in the dock | **yes** |
| `actions` | the closing options | **yes** |

## The dock

Everything North is waiting for lives in one fixed surface at the bottom, so the answer is
always in the same place regardless of which flow or how long the thread has run. It holds
**controls only** — the thread already carries the question, and rendering it twice put
the same sentence on screen in two places.

Positioning follows the app-wide home dock exactly (fixed, bottom, capped at the shell
width). Centring it independently put it out of step with every other bottom surface.

## What a flow changes

A flow has to leave the same mark the screen it replaced did, or finishing one changes
nothing and Home offers the same card again tomorrow. Two consequences exist:

- `reply` + sent → `phonepeReplied: true`
- `ghosted` + closed → the application moves to `rejected`

Nothing sends, books, or applies. Every other result is a note about what the user said
they would do next.

## Handoffs

Prep and Offer go deeper than a thread can, so they survive as screens a flow hands you
to rather than as front doors: `prep` → `/prep/juspay`, `offer` and `negotiate` →
`/offer/juspay`, `jobs` → `/matches`.

## Evidence rule

Every claim inside a flow names where it came from. The rejection flow's reasoning is
**explicitly labelled as example reasoning** — it is placeholder content per the owner's
instruction 2026-09-10, and it says so on screen rather than passing itself off as a
finding North actually made.
