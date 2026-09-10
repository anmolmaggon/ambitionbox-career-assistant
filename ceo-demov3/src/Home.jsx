/*
 * Home — owned by Claude. Every layer is draft.
 *
 * Home is the only screen that has seen everything. Tracker knows the applications,
 * Matches the roles, Prep the interview, Offer the offer — each confident inside its
 * box and blind outside it. Home looks across all of it, says "today, this one," and
 * shows what it weighed and set aside. The proof is not that the pick is clever; it is
 * that the pick moves when the user's life moves.
 *
 * Structure:
 *   1. KERNEL   — ranking, state derivation, sheet wiring. Authored once.
 *   2. PARTS    — shared components. A design may re-arrange and re-style these.
 *                 A design may never re-author the strings inside them.
 *   3. DESIGNS  — one function per material direction, selected by ?design=.
 *   4. SWITCHER — review-only, appears once a ?design= has been seen this session.
 *   5. SHEETS   — shared by every design.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, BriefcaseBusiness, Building2, Calculator, Check, ChevronRight, CircleDollarSign,
  Clock3, FileCheck2, FileText, Info, Mail, Menu, MessageSquare, PiggyBank, Scale, Search, Send, ShieldCheck, Sparkles, Target,
  UserRoundCheck, X,
} from 'lucide-react'
import { applications, candidate, interviewIntel, jobs, juspay, offer, offerDecision, offeredSlots, onboardingProfile, stageLabel } from './data'
import { useJourney } from './store'
import { AssistantDock, AssistantMark, BottomNav, CompanyLogo, Logo, Pill, PromptChips, Sheet, go } from './AppUI'

const EASE = [0.22, 1, 0.36, 1]
// Kept in step with `.action-card.is-leaving` in home.css — the timer removes the card,
// the CSS fades it, and the two have to agree.
const LEAVE_MS = 300

// ---------------------------------------------------------------------------
// 1. KERNEL
// ---------------------------------------------------------------------------

// Flipping this is how the Playwright suite is pointed at a variant: the tests all
// hit bare /home, so a variant is only covered while it is the default.
const DEFAULT_DESIGN = 'current'
const DESIGN_KEY = 'ambitionbox-home-design'

function useHomeDesign() {
  const params = new URLSearchParams(window.location.search)
  const requested = params.get('design')
  if (requested) {
    try { sessionStorage.setItem(DESIGN_KEY, requested) } catch { /* private mode */ }
    return { design: requested, reviewing: true }
  }
  let stored = null
  try { stored = sessionStorage.getItem(DESIGN_KEY) } catch { /* private mode */ }
  // Incoming links from Tracker, Prep, Offer and the bottom nav all use bare /home,
  // so the review choice is remembered rather than lost on every round trip.
  return { design: stored || DEFAULT_DESIGN, reviewing: Boolean(stored) }
}

function useHomeSheets() {
  const { journey, update } = useJourney()
  const params = new URLSearchParams(window.location.search)
  const [reply, setReply] = useState(params.get('action') === 'phonepe')
  const [addInterview, setAddInterview] = useState(params.get('action') === 'add-interview')
  const [assistant, setAssistant] = useState(false)
  const [assistantQuestion, setAssistantQuestion] = useState('')
  const [offerStart, setOfferStart] = useState(false)
  const [debrief, setDebrief] = useState(false)
  const [sent, setSent] = useState(false)

  return {
    reply, addInterview, assistant, assistantQuestion, offerStart, debrief, sent,
    openReply: () => setReply(true),
    closeReply: () => setReply(false),
    sendReply: () => {
      update({ phonepeReplied: true })
      setSent(true)
      setTimeout(() => setReply(false), 1100)
    },
    openAddInterview: () => setAddInterview(true),
    closeAddInterview: () => setAddInterview(false),
    ask: (question) => { setAssistantQuestion(question); setAssistant(true) },
    closeAssistant: () => setAssistant(false),
    openDebrief: () => setDebrief(true),
    closeDebrief: () => setDebrief(false),
    logInterview: () => { update({ interviewLogged: true }); setDebrief(false) },
    openOfferStart: () => setOfferStart(true),
    closeOfferStart: () => setOfferStart(false),
    useDemoOffer: () => {
      update({ offerDetected: true })
      setOfferStart(false)
      go('/offer/juspay?stage=decision&story=finale')
    },
    journey,
    update,
  }
}

function useHomeContext(sheets) {
  const { journey, update } = sheets
  const params = new URLSearchParams(window.location.search)
  const reduceMotion = useReducedMotion()

  // The onboarding contract sets firstHomeArrival and routes to /home?arrival=first.
  // Home reads both and never clears the flag, so the handoff stays inspectable.
  const firstArrival = params.get('arrival') === 'first' && journey.firstHomeArrival
  const attention = journey.phonepeReplied ? 2 : 3
  const hasProfileContext = Boolean(
    journey.onboardingProfileConfirmed || journey.onboardingPreferencesConfirmed
    || journey.preferencesConfirmed || journey.naukriConnected || journey.emailSkipped,
  )

  const action = nextBestAction({ journey, hasProfileContext, openReply: sheets.openReply, sheets })
  const aside = setAside({ journey, action })
  const built = carouselCards({ action, aside, journey, sheets })

  // Dismissal lives here rather than inside the carousel because the greeting counts
  // what the carousel is showing. While it was carousel-local, setting every card aside
  // left "3 things need a look" sitting above an empty rail — the screen contradicting
  // itself in the one state that is supposed to read as calm.
  //
  // Local only, and deliberately so: nothing in `journey` records a dismissal, and
  // inventing persistence would claim a memory the prototype does not have.
  const [dismissed, setDismissed] = useState([])
  const cards = built.filter((card) => !dismissed.includes(card.id))

  return {
    journey,
    update,
    reduceMotion,
    firstArrival,
    attention,
    action,
    aside,
    cards,
    dismiss: (id) => setDismissed((prev) => (prev.includes(id) ? prev : [...prev, id])),
    // Home claims to have seen everything, so it reads the profile the user actually
    // reviewed rather than hardcoding a name.
    firstName: (journey.onboardingProfile?.name || onboardingProfile.name).split(' ')[0],
    prompts: contextualPrompts(),
    // The email recommendation is a card only when it is not already the hero.
    showConnectNote: !journey.emailConnected && action.id !== 'connect',
    showTimeJump: journey.resumeReady && !journey.interviewInvited && !journey.offerDetected,
    // The contribution card is deliberately not counted: it is not a thing that needs
    // the user, and counting it would have the greeting claim four things need you when
    // one of them is AmbitionBox asking for a favour.
    intro: introLine(journey, firstArrival, cards.length),
    grounding: journey.emailConnected
      ? 'Uses your profile, preferences, and live applications.'
      : 'Uses your reviewed profile and preferences.',
    ask: sheets.ask,
    // One orchestrated arrival, only on the handoff route, never at the cost of information.
    rise: (index) => (firstArrival && !reduceMotion
      ? {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.42, delay: 0.05 * index, ease: EASE },
      }
      : {}),
  }
}

/*
 * The greeting explains the screen it introduces.
 *
 * The count comes from the sequence itself — a line claiming "one thing" above four
 * cards is untrue. The first-arrival wording went through two rejected drafts, both of
 * which described what the system had done ("your profile is reviewed", "I've been
 * across your application email"). Neither is what the person cares about on arrival.
 * The line now states what changes for them: they can stop going and checking. That
 * covers every source at once without reciting an inventory of them.
 *
 * Relief belongs to arrival only. A returning visit gets the plain line — being told
 * the same good news every morning is how a promise turns into noise.
 */
function introLine(journey, firstArrival, count) {
  if (journey.emailConnected) {
    // Nothing left is a real state, not an error, so it is stated plainly and without
    // the count the other branches carry — there is no number worth printing.
    if (count === 0) {
      return firstArrival
        ? 'You won’t have to go looking any more. Nothing needs you right now.'
        : 'Nothing needs you today. That is not nothing.'
    }
    if (count <= 1) {
      return firstArrival
        ? 'You won’t have to go looking any more. One thing needs you today.'
        : 'One thing needs you.'
    }
    return firstArrival
      ? `You won’t have to go looking any more. ${count} things need you today.`
      : `${count} things need you. Most urgent first.`
  }
  if (journey.emailSkipped) {
    return firstArrival
      ? 'You won’t have to go hunting for roles any more. Your search starts with what actually fits you.'
      : 'Your profile is ready. Bring your live search into focus next.'
  }
  return 'Your profile is ready. Bring your live search into focus next.'
}

/*
 * The invitation, reduced to the parts a date block can show. Everything here is read
 * from the fixture — the day string is "Tuesday, 28 July", so the block splits it rather
 * than restating it, and nothing is formatted that the invitation did not contain.
 */
/*
 * Three columns of evidence for a role. "Preference Match" is written out in the label
 * rather than abbreviated — the contract is explicit that it is never shortened to
 * "match", and a column label is still the term appearing on screen.
 */
function roleStats(role) {
  return [
    { value: `${role.preferenceMatch}%`, label: 'Preference Match' },
    { value: role.salary, label: 'Range' },
    { value: `${role.rating}★`, label: 'Rating' },
  ]
}

function interviewSchedule() {
  const [weekday, date] = interviewIntel.invitation.day.split(', ')
  return {
    weekday: weekday.slice(0, 3).toUpperCase(),
    date: date.split(' ')[0],
    month: date.split(' ')[1],
    time: interviewIntel.invitation.time,
    duration: interviewIntel.invitation.duration.replace(' minutes', ' min'),
    mode: interviewIntel.invitation.mode,
    with: interviewIntel.invitation.with,
    round: `Round 1 of ${interviewIntel.loop.total}`,
  }
}

// The hero is one adaptive surface. The first branch that matches owns the screen,
// and every ranked branch states why it outranks the rest. Designs present this
// differently; none of them may change the order.
function nextBestAction({ journey, hasProfileContext, openReply, sheets }) {
  if (journey.offerDetected) {
    return {
      id: 'offer',
      variant: 'priority-card--offer',
      tone: 'offer', icon: <CircleDollarSign size={14} />,
      shape: 'offer',
      kicker: 'OFFER IN',
      badge: <Pill tone="success">Today</Pill>,
      when: 'Today',
      company: { initials: 'JP', name: 'Juspay', role: juspay.role, detail: `${juspay.role} · ${juspay.location}` },
      // The number is the fact this card exists to deliver, so the card leads with it
      // and splits it — a CTC headline with the variable folded in flatters the offer.
      money: { total: offer.total, fixed: offer.fixed, variable: offer.variable, market: offer.market, delta: offer.currentDelta },
      headline: 'Below the midpoint of the band.',
      support: `Inside ${offer.market}. The room is in the fixed pay, not the variable.`,
      why: 'A live decision outranks everything else in your search.',
      whyQuestion: 'Why is reviewing this offer my next move?',
      foot: offer.total,
      cta: { label: 'See what it is worth', onClick: () => go('/flow/offer') },
    }
  }

  /*
   * The morning after the round. This outranks a booked future round because the
   * Tracker is genuinely stale until Arjun says what happened — nothing in the inbox
   * tells us the outcome of a call.
   *
   * It is a normal solid card, not the dotted ask, because it is a real task: the user
   * gets something from answering. What AmbitionBox wants — the questions that came up —
   * is the second step, inside the flow this opens, never on the card face.
   *
   * The copy names the company and the round. "How did Tuesday go?" was the first draft
   * and it is meaningless on a screen that can hold several interviews: a day of the
   * week is not an interview.
   */
  if (journey.interviewDone && !journey.interviewLogged) {
    const round = interviewIntel.loop.rounds[0]
    return {
      id: 'debrief',
      variant: 'priority-card--interview',
      tone: 'interview', icon: <UserRoundCheck size={14} />,
      shape: 'debrief',
      kicker: 'HOW DID IT GO',
      badge: <Pill tone="attention">Yesterday</Pill>,
      when: 'Yesterday',
      company: { initials: 'JP', name: 'Juspay', role: juspay.role, detail: `${juspay.role} · Round 1 of 4` },
      headline: `You sat ${round ? round.label.toLowerCase() : 'your round'} at ${juspay.company} yesterday.`,
      support: 'No email reports how a round actually went. Thirty seconds, and your next round gets sharper.',
      why: 'Nothing else in your search can move until this one is settled.',
      whyQuestion: 'Why does logging this interview matter?',
      foot: interviewIntel.invitation.day.split(',')[0],
      cta: { label: 'Tell me how it went', onClick: () => go('/flow/debrief?application=juspay') },
    }
  }

  if (journey.interviewInvited) {
    return {
      id: 'interview',
      variant: 'priority-card--interview',
      tone: 'interview', icon: <Clock3 size={14} />,
      shape: 'interview',
      kicker: 'INTERVIEW BOOKED',
      badge: <Pill tone={journey.prepComplete ? 'success' : 'attention'}>{interviewIntel.invitation.day.split(',')[0]}</Pill>,
      when: interviewIntel.invitation.day.split(',')[0],
      // "Round 1 of 4" moves out of company.detail and into the schedule block so the
      // string still appears exactly once on the screen, which prep-intel.spec asserts.
      schedule: interviewSchedule(),
      company: { initials: 'JP', name: 'Juspay', role: juspay.role, detail: juspay.role },
      headline: journey.prepComplete
        ? `You’re ready for ${interviewIntel.invitation.time} on Tuesday.`
        : 'The invite doesn’t say what this round covers.',
      support: journey.prepComplete
        ? `Your answers, the open Java gap, and three questions to ask ${interviewIntel.interviewer.name.split(' ')[0]} are saved.`
        : `${interviewIntel.evidence.reports} interview reports say what happens inside that hour.`,
      why: journey.prepComplete
        ? 'Tuesday is the nearest fixed date in your search.'
        : 'Tuesday is fixed, and the invitation explains none of it.',
      whyQuestion: 'Why is this interview my next move?',
      cta: { label: journey.prepComplete ? 'Review my prep' : 'See what to expect', onClick: () => go('/prep/juspay') },
    }
  }

  if (journey.emailConnected && !journey.phonepeReplied) {
    return {
      id: 'reply',
      variant: '',
      tone: 'reply', icon: <MessageSquare size={14} />,
      shape: 'reply',
      kicker: 'THEY REPLIED',
      badge: <span className="time-chip">2h ago</span>,
      when: '2h ago',
      company: { initials: 'PP', color: '#5f259f', name: 'PhonePe', role: 'Backend Engineer III', detail: 'Backend Engineer III' },
      headline: '“Can you confirm your availability for a quick conversation?”',
      support: 'Sneha at PhonePe, waiting since 7:40. Your draft is written.',
      // Split out of `support` so the byline can sit under the quote where a message
      // puts its sender. The full stop stays — onboarding.spec matches the string.
      source: 'Detected in Gmail.',
      why: 'A person is waiting, and a recruiter reply ages faster than an application.',
      whyQuestion: 'Why should I reply to PhonePe first?',
      foot: '2h waiting',
      cta: { label: 'Review the draft', onClick: () => go('/flow/reply?application=phonepe-app') },
    }
  }

  if (hasProfileContext || journey.emailConnected) {
    return {
      id: 'opportunity',
      variant: 'priority-card--juspay',
      tone: 'role', icon: <Target size={14} />,
      shape: 'role',
      kicker: `NEW MATCH · ${juspay.preferenceMatch}%`,
      when: juspay.posted,
      company: { initials: juspay.initials, name: juspay.company, role: juspay.role, detail: juspay.role },
      headline: `${juspay.role} at ${juspay.company}.`,
      // `facts` is still what the three legacy directions render. `stats` is the same
      // evidence given columns, which is what stops it wrapping into a grey sentence.
      facts: [`${juspay.preferenceMatch}% Preference Match`, juspay.salary, juspay.mode, `${juspay.rating} ★`],
      stats: roleStats(juspay),
      support: `Your CV is missing ${juspay.readinessTotal - juspay.initialReadiness} of their ${juspay.readinessTotal} requirements. I can close them before you apply.`,
      why: journey.emailConnected
        ? 'Nothing in your inbox is waiting on you, so preference ranking takes over.'
        : 'It sits closest to the preferences you just reviewed.',
      whyQuestion: 'Why is Juspay my next move?',
      cta: { label: 'Tailor my CV', onClick: () => go('/jobs/juspay') },
    }
  }

  return {
    id: 'connect',
    variant: 'priority-card--connect',
    tone: 'quiet', icon: <Mail size={14} />,
    shape: 'connect',
    kicker: 'NEXT USEFUL CONNECTION',
    headline: 'Know what needs you—before an opportunity goes cold.',
    support: 'Connect the email you use to apply. North will organise updates and bring the right recruiter moment here.',
    cta: { label: 'Connect application email', onClick: () => go('/onboarding?step=email') },
  }
}

/*
 * The suggested questions are pitches for what the assistant is for, not a read of the
 * current state. The carousel already proves Home adapts — it visibly reorders when the
 * user's life moves — so the chips stopped competing with it and went back to their real
 * job: showing someone who has never asked anything what is worth asking.
 *
 * They name AmbitionBox's own territory — pay fairness, take-home, company comparison —
 * rather than asking vague planning questions, because that is the range nobody discovers
 * cold. Every one of them lands on a real `homeAnswer()` branch backed by real fixtures;
 * a chip that produces a shrug is worse than no chip.
 *
 * Chip labels stay short; the sheet uses the full question, so the two never collide as
 * duplicate controls.
 */
function contextualPrompts() {
  return [
    { label: 'Am I being paid fairly?', question: 'Am I being paid fairly?' },
    { label: 'What’s my monthly in-hand?', question: 'What is my monthly in-hand?' },
    { label: 'Juspay vs Razorpay', question: 'How does Juspay compare with Razorpay?' },
    { label: 'Which roles actually fit me?', question: 'Which roles actually fit me right now?' },
    { label: 'How ready am I to interview?', question: 'How ready am I for my next interview?' },
  ]
}

/*
 * What Home considered and did not pick — the ordered queue behind today's call.
 *
 * This is arbitration evidence, not navigation. It replaced the four-stage journey
 * rail, whose first two rows went to Matches and Tracker, i.e. the bottom-nav tabs
 * drawn larger.
 *
 * The rule that keeps it honest: every reason must be state-derived and specific.
 * If a reason line could be moved to another row and stay true, it is decoration
 * and the row should be cut. The first row says when it gets its turn, which makes
 * this a queue rather than a list.
 */
function journeyProgress(journey) {
  return [true, journey.emailConnected, journey.interviewInvited, journey.offerDetected]
}

/*
 * How each flow presents itself on Home, and where it sits in the queue.
 *
 * Rank is by who is waiting on whom. An offer has money and a deadline on it. A booked
 * round is a fixed date. A recruiter holding an open thread is a person waiting. A
 * debrief decays — two days out it is still fresh, two weeks out it is invention. Quiet
 * applications and rejections wait on nobody, and a ranked role waits on nobody at all.
 */
const FLOW_RANK = { offer: 0, prep: 1, reply: 2, debrief: 3, ghosted: 4, rejection: 5, job: 6 }

/*
 * The kicker is the news, not the category. "APPLICATION UPDATE" named the system that
 * spoke; "NOT THIS ONE" and "THEY REPLIED" name what happened. Someone reading only the
 * kickers down the carousel should come away knowing their week.
 *
 * Rejection sits on `quiet`, not on a warning tone. Red and amber mean you broke
 * something or something is broken, and a rejection is neither. Colouring it that way
 * teaches people to flinch at their own Home screen.
 */
const FLOW_PRESENTATION = {
  reply: { kicker: 'THEY REPLIED', tone: 'reply', shape: 'reply', icon: <MessageSquare size={14} /> },
  prep: { kicker: 'SLOTS OFFERED', tone: 'interview', shape: 'task', icon: <Clock3 size={14} /> },
  debrief: { kicker: 'HOW DID IT GO', tone: 'interview', shape: 'task', icon: <MessageSquare size={14} /> },
  ghosted: { kicker: 'GONE QUIET', tone: 'update', shape: 'task', icon: <BriefcaseBusiness size={14} /> },
  rejection: { kicker: 'NOT THIS ONE', tone: 'quiet', shape: 'task', icon: <BriefcaseBusiness size={14} /> },
  offer: { kicker: 'OFFER IN', tone: 'offer', shape: 'offer', icon: <Target size={14} /> },
  job: { kicker: 'NEW MATCH', tone: 'role', shape: 'role', icon: <Target size={14} /> },
}

/*
 * The line under the claim. Its job changed on 2026-09-10: it used to argue why this card
 * sits where it sits, which the order already shows. It now names something North has
 * already done or seen — a draft written, eleven of fourteen reports, two of fifteen
 * requirements — because that is what makes tapping feel like collecting something rather
 * than starting work.
 *
 * The old rule survives in a stronger form: if a line could move to another card and stay
 * true, it is decoration. Every one of these names a number or a name only its own card
 * has.
 */
function cardSupport(item, meta) {
  // The meta row states the round now, so the sentence beneath it must not open by
  // repeating it — "Round 1 of 5. Round 1 of 5 · 45 min · Google Meet" on one card.
  if (meta && item.interview?.round && item.insight?.startsWith(`${item.interview.round}.`)) {
    return item.insight.slice(item.interview.round.length + 2)
  }
  return item.insight
}

/*
 * The figure a card leads its footer with. Elapsed time where nothing is moving, a fixed
 * date where a clock is running — the same field pointing in opposite directions, which
 * is the honest difference between a ghosting and a booked round.
 */
function cardFigure(item) {
  if (item.stage === 'ghosted') return `${item.silentDays}d quiet`
  if (item.stage === 'rejected') return item.reachedRound
  if (item.phase === 'post') return 'Debrief due'
  if (item.invitedAgo) return `${item.invitedAgo}d to pick`
  if (item.interview?.round) return item.interview.round
  return item.appliedAgo || item.when
}

/* The pipeline line a card carries: for a ghosted card, where it fell from. */
function stageNote(item) {
  if (item.stage !== 'ghosted') return stageLabel(item.stage)
  const origin = item.ghostedFrom === 'interviewed' ? 'Interview' : 'Applied'
  return `Ghosted · from ${origin}`
}

/*
 * `booked` is the slot the user picked in the prep flow, or undefined. It turns card 2
 * (PICK A SLOT) into card 3 (INTERVIEW BOOKED) — the same application, one event later.
 * Everything the booked card says is derived: the claim names the round and the slot, the
 * figure is the slot itself rather than a countdown to a decision already made, and the
 * action becomes preparation because choosing is behind you.
 */
function applicationCard(item, booked) {
  const presentation = booked
    ? { kicker: 'INTERVIEW BOOKED', tone: 'interview', shape: 'task', icon: <Clock3 size={14} /> }
    : (FLOW_PRESENTATION[item.flow] || FLOW_PRESENTATION.job)
  /*
   * Slots on the card face, owner's instruction 2026-09-11. The card measured 288px of
   * content in a 359px shell — 71px of dead space on the one card whose whole claim is
   * "nobody can pick one but you". The chips spend that space on the choice itself.
   *
   * Once a slot exists the chips go, because the card has become a booked round.
   */
  const slots = !booked && item.flow === 'prep' ? offeredSlots : null
  /*
   * The CTA stops saying "Pick a slot" the moment the chips do that job better. Two
   * controls with one purpose, one of them slower, is a choice the reader has to make
   * before they can make the real one. The fork is now genuine: chips for someone who
   * knows their calendar, the CTA for someone who wants to know what they are walking
   * into first.
   */
  const action = booked ? 'Start prep' : (slots ? 'See what this round covers' : item.action)
  /*
   * Round, length and format, structured. The length is the fact this card was missing:
   * you cannot sensibly choose between 11:00 and 15:30 without knowing whether it takes a
   * quarter of an hour or most of an afternoon.
   */
  const meta = item.interview
    ? [item.interview.round, item.interview.duration, item.interview.mode].filter(Boolean).join(' · ')
    : null
  return {
    id: item.id,
    initials: item.initials,
    color: item.color,
    company: item.company,
    detail: action,
    claim: booked
      ? `${item.interview?.round || 'Your round'} at ${item.company} is booked for ${booked}.`
      : item.claim,
    when: item.when,
    // A booked round outranks an open invitation: it has a fixed date, and the whole
    // point of ranking by who is waiting on whom is that a date waits for nobody.
    rank: booked ? 1 : (FLOW_RANK[item.flow] ?? 9),
    ctaLabel: action,
    role: item.role,
    stage: stageNote(item),
    quote: item.quote,
    sender: item.recruiter,
    flow: item.flow,
    source: item.source,
    /*
     * The one number this card is about, shown in the footer band beside the action.
     * Every card type has exactly one: money for an offer, a date for a round, elapsed
     * silence for a ghosting, how far you got for a rejection. Picking it per type is
     * what stops the band from being a slot that sometimes has nothing in it.
     */
    // A booked round's one number is the slot itself. `cardFigure` would return the round
    // ("Round 1 of 5"), which the claim above already names.
    slots,
    meta,
    foot: booked || cardFigure(item),
    reason: booked
      ? 'Prep is built from what this round covers, not the whole job description.'
      : cardSupport(item, meta),
    onSelect: () => go(`/flow/${item.flow}?application=${item.id}`),
    ...presentation,
    // A quote is what makes the reply shape a message rather than a task; without one
    // the shape has nothing to lead with, so it falls back to the task composition.
    shape: presentation.shape === 'reply' && !item.quote ? 'task' : presentation.shape,
  }
}

function setAside({ journey, action }) {
  const rows = []
  const add = (row) => { if (row.id !== action.id) rows.push(row) }
  // Overdue outranks today outranks tomorrow. The queue is ordered the same way the
  // pick was, so the row that says it goes next actually goes next.
  const urgency = (when) => ({ Overdue: 0, Today: 1, 'Due tomorrow': 2 }[when] ?? 3)
  // A pick with a fixed date changes why everything else waits.
  const dated = action.id === 'interview' || action.id === 'offer'

  if (journey.offerDetected) {
    if (journey.interviewInvited) {
      add({
        // The schedule block now carries "Round 1 of 4", so the headline says something
        // else rather than printing the same string twice on one card.
        id: 'interview', initials: 'JP', company: 'Juspay', detail: 'The round is still ahead of you.',
        when: interviewIntel.invitation.day.split(',')[0], rank: 0,
        kicker: 'INTERVIEW BOOKED', ctaLabel: 'Review my prep', tone: 'interview', icon: <Clock3 size={14} />,
        shape: 'interview', schedule: interviewSchedule(),
        reason: 'Prep is saved. The decision lands before the round does.',
        onSelect: () => go('/prep/juspay'),
      })
    }
    add({
      // "closest match" put the substring "Close" into this card's CTA accessible name,
      // which collides with every sheet's Close control — the exact trap HOME.md records
      // against the capability index. Preference Match written in full avoids it and is
      // what the contract asks for anyway.
      id: 'roles', initials: juspay.initials, company: 'Your ranked roles', detail: `${juspay.preferenceMatch}% Preference Match`,
      when: 'Open', rank: 1,
      kicker: 'RANKED ROLES', ctaLabel: 'See my roles', tone: 'role', icon: <Target size={14} />,
      // `detail` stays the Preference Match string because the CTA's accessible name is
      // built from it, and that is what the email-skip test matches. `title` is what the
      // card actually shows, so the stat row below is not the same words twice.
      shape: 'role', title: 'Ranked against the preferences you reviewed.', stats: roleStats(juspay),
      reason: 'Nothing here beats an offer already in writing.',
      onSelect: () => go('/matches'),
    })
  } else if (journey.emailConnected) {
    if (journey.interviewInvited && !journey.phonepeReplied) {
      add({
        id: 'reply', initials: 'PP', color: '#5f259f', company: 'PhonePe', detail: 'Reply to recruiter',
        when: '2h ago', rank: 1,
        kicker: 'THEY REPLIED', ctaLabel: 'Review reply', tone: 'reply', icon: <MessageSquare size={14} />,
        // A demoted reply is a task, not a message: the quote belongs to the card that
        // is actually asking you to read it, and repeating it here would just be noise.
        shape: 'task',
        reason: 'A fixed date beats an open message.',
        onSelect: () => go('/flow/reply?application=phonepe-app'),
      })
    }
    /*
     * Everything Home surfaces, driven off the pipeline rather than authored per state.
     *
     * Seven flows, settled 2026-09-10: a ranked role, a reply that is owed, prep before a
     * round, a debrief after one, a rejection worth reading, an offer to weigh, and an
     * application that has gone quiet. `FLOW_RANK` is the only place their order lives, and
     * it is ordered by who is waiting on whom — money on the table first, then a booked
     * date, then a person holding a thread, then things only the user can close.
     */
    for (const item of applications.filter((entry) => entry.action)) {
      if (item.company === 'PhonePe') continue
      add(applicationCard(item, journey.bookedSlots?.[item.id]))
    }
    add({
      id: 'opportunity', initials: juspay.initials, company: juspay.company, detail: `${juspay.preferenceMatch}% Preference Match`,
      when: juspay.posted, rank: 4,
      kicker: `NEW MATCH · ${juspay.preferenceMatch}%`, ctaLabel: 'Tailor my CV', tone: 'role', icon: <Target size={14} />,
      shape: 'role', title: juspay.role, stats: roleStats(juspay),
      reason: `Your CV is missing ${juspay.readinessTotal - juspay.initialReadiness} of their ${juspay.readinessTotal} requirements. I can close them before you apply.`,
      onSelect: () => go('/jobs/juspay'),
    })
  } else {
    // No inbox, so the queue is the rest of the ranked roles rather than live threads.
    for (const job of jobs.slice(1, 4)) {
      add({
        id: job.id, initials: job.initials, company: job.company, detail: `${job.preferenceMatch}% Preference Match`,
        when: job.salary, rank: 100 - job.preferenceMatch,
        kicker: 'NEW MATCH', ctaLabel: 'See the match', tone: 'role', icon: <Target size={14} />,
        shape: 'role', title: job.role, stats: roleStats(job),
        reason: job.reason,
        onSelect: () => go('/matches'),
      })
    }
  }

  rows.sort((a, b) => a.rank - b.rank)

  /*
   * One card per flow. Home is what needs you today, not an inventory — three ghosted
   * cards in a row taught the reader that this stage is a list, and a list belongs in
   * Tracker. Keeping the best-ranked of each kind means Home shows the shape of the
   * whole search in one screen: a reply, a round, a debrief, a quiet one, a rejection,
   * a role. Everything it drops is one tap away on the tab below it.
   */
  // The pick counts as its flow. It is on screen as card one, so a queue card of the
  // same kind directly beneath it is the duplicate this rule exists to remove.
  const PICK_FLOW = { reply: 'reply', interview: 'prep', debrief: 'debrief', offer: 'offer', opportunity: 'job', roles: 'job' }
  const seen = new Set(PICK_FLOW[action.id] ? [PICK_FLOW[action.id]] : [])
  const deduped = rows.filter((row) => {
    if (!row.flow) return true
    if (seen.has(row.flow)) return false
    seen.add(row.flow)
    return true
  })
  rows.length = 0
  rows.push(...deduped)
  /*
   * The "Next in line." prefix went with the reasons it used to qualify. The support line
   * is a sentence about what North found, and a prefix announcing queue position cut
   * across it. Position is already visible: the card is second.
   */
  return rows
}

/*
 * The carousel's ordered sequence: today's pick, then everything the ranking set
 * aside, then the email connection when it is still missing.
 *
 * This is a rendering change only. `nextBestAction()` still decides what leads and
 * `setAside()` still decides what follows and why; the carousel merely stops drawing
 * the first one larger than the rest. Dominance comes from position in the viewport
 * instead of size, which is why every card is the same width.
 *
 * `shape` is how a card composes its middle — a message, a date, a figure, a stat row,
 * a task, a setup step. The shell around it never varies: same width, same radius, same
 * elevation, one action pinned to the floor. Six middles, one family.
 */
/*
 * A day is calm when nothing on it is dated — no offer window, no booked round, no
 * recruiter waiting. Application updates do not disqualify it: those run on someone
 * else's clock, which is the whole reason they are drawn the way they are and why the
 * copy on them says you cannot close them alone.
 */
const DATED_TONES = new Set(['offer', 'interview', 'reply'])

function carouselCards({ action, aside, journey, sheets }) {
  const cards = [{
    id: action.id,
    kind: 'pick',
    tone: action.tone,
    shape: action.shape,
    // The hero's field colours (the prep-v3 violet, the offer green) are deliberately
    // not carried over: a sequence of equals cannot have one card wearing a different
    // field without re-introducing the hero this rebuild removed. The beat is still
    // distinguishable — by its eyebrow, its badge and its position.
    kicker: action.kicker,
    icon: action.icon,
    badge: action.badge,
    company: action.company,
    headline: action.headline,
    support: action.support,
    source: action.source,
    schedule: action.schedule,
    money: action.money,
    stats: action.stats,
    foot: action.foot,
    cta: action.cta,
    dismissable: action.id !== 'connect',
  }]

  for (const row of aside) {
    cards.push({
      id: row.id,
      kind: 'queued',
      tone: row.tone,
      shape: row.shape,
      icon: row.icon,
      kicker: row.kicker,
      when: row.when,
      company: { initials: row.initials, color: row.color, name: row.company, role: row.role, detail: row.role },
      headline: row.claim || row.detail,
      title: row.title,
      support: row.reason,
      schedule: row.schedule,
      stats: row.stats,
      stage: row.stage,
      slots: row.slots,
      meta: row.meta,
      applicationId: row.id,
      source: row.source,
      foot: row.foot,
      // The queued cards all reach the same few destinations, so each CTA names the
      // card it belongs to. Two "Open in Tracker" buttons on one screen would be
      // ambiguous to a screen reader, and the visible label stays inside the name.
      cta: { label: row.ctaLabel, onClick: row.onSelect, name: `${row.company} ${row.detail} · ${row.ctaLabel}` },
      dismissable: true,
    })
  }

  // The email recommendation is the last card rather than a separate section below
  // the carousel: two surfaces answering "what should I do next" was the shape that
  // made Home read as a dashboard.
  if (!journey.emailConnected && action.id !== 'connect') {
    cards.push({
      id: 'connect',
      kind: 'connect',
      tone: 'quiet',
      shape: 'connect',
      icon: <Mail size={14} />,
      kicker: 'NEXT USEFUL CONNECTION',
      headline: 'Know what needs you—before an opportunity goes cold.',
      support: 'Connect the email you use to apply and North brings the recruiter moment that needs you here.',
      footnote: 'Job-search email only. Read only. Disconnect anytime.',
      cta: { label: 'Connect application email', onClick: () => go('/onboarding?step=email') },
      dismissable: false,
    })
  }

  /*
   * The contribution card was removed on 2026-09-10. It asked the user to review their
   * current employer, which is not one of the seven things Home surfaces, and it could
   * no longer appear in any case: a post-interview debrief is a dated card, so no day
   * with one on it was ever calm again. Left in, it would have been a rule that never
   * fired. `ContributeSheet` went with it rather than sitting unreachable.
   */

  return cards
}

function homeAnswer(journey, question) {
  const q = question.toLowerCase()

  if (q.includes('without my email') || q.includes('no email') || q.includes('what can you')) {
    return 'Plenty. Your reviewed profile and preferences already rank roles, explain pay and company reality, and show where your evidence is thin. What I cannot do is see the applications you send, so recruiter replies and interview invitations stay outside AmbitionBox until you connect that email.'
  }
  // Gratuity turns on two numbers North does not hold — basic pay, and tenure at
  // one employer rather than total experience. Both are stated rather than guessed at:
  // a gratuity figure derived from CTC would be exactly the confident wrong number this
  // product exists to avoid. The vesting cliff is the part that changes a job decision,
  // so that is what the answer leads with.
  if (q.includes('gratuity')) {
    return `Gratuity is 15 days of your last drawn basic pay for every completed year, and it only vests after five continuous years with one employer. I know your total experience is ${candidate.experience} and your current pay is ${candidate.currentPay}, but not your basic component or how long you have been at ${candidate.company} specifically — and those are the only two numbers this turns on. If you are close to five years at ${candidate.company}, the timing of a move is worth checking before you accept anything.`
  }
  if (q.includes('in-hand') || q.includes('in hand') || q.includes('take home') || q.includes('take-home') || q.includes('monthly')) {
    // The letter does give the split, so use it. What is genuinely missing is the tax
    // regime and deductions, and inventing those would be exactly the confident wrong
    // number this product exists to avoid. Name the boundary, do not fake past it.
    return journey.offerDetected
      ? `Of the ${offer.total}, ${offer.fixed} is fixed pay—that is the part that recurs every month. ${offer.variable} is performance-linked and ${offer.joining} is a one-time joining bonus, so neither belongs in a monthly figure. I stop short of a take-home number because I do not have your tax regime or deductions. What is already measurable: Bengaluru is estimated to cost about ₹13k more each month than Pune.`
      : 'No offer letter has arrived yet, so there is no pay to break down. When one does, I separate fixed pay from variable and one-time components first—that split is usually where the monthly number differs from what people expect.'
  }
  if (q.includes('paid fair') || q.includes('fairly') || q.includes('underpaid') || q.includes('paid enough')) {
    return journey.offerDetected
      ? `${offer.total} sits inside the published ${offer.market} band for this role and ${offer.currentDelta.replace('above current', 'above your current pay')}. The honest caveat is that only ${offer.fixed} of it is fixed, so compare the fixed component before you call it settled.`
      : `Your current ${candidate.currentPay} sits below the published ${juspay.salary} band for the role you are targeting. That gap is the case for moving, and it is why your ₹22L+ target reads as realistic rather than ambitious.`
  }
  if (q.includes('compare') || q.includes('versus') || q.includes(' vs ')) {
    return `Across the seven review dimensions both are rated on, Juspay leads Razorpay on every one—${juspay.rating} overall from ${juspay.reviews} against 3.4 from 762 reviews. The widest gaps are promotions and work satisfaction. What reviews cannot tell you is the specific team you would join, which is worth asking a person.`
  }
  if (q.includes('offer') || q.includes('₹28l')) {
    return journey.offerDetected
      ? `₹28L sits above the ${juspay.salary} employees report for this role, so the number is strong. The unknowns are the variable split and the team you would join—both are worth confirming before you accept.`
      : 'No offer has arrived yet. When one does, I compare the letter against reported pay, employee reviews, your preferences, and what the move actually changes.'
  }
  if (q.includes('why') && (q.includes('next move') || q.includes('first'))) {
    if (journey.offerDetected) return 'A decision window is open. Everything else in your search can wait a day; an offer response cannot, and the letter is only one part of the picture.'
    if (journey.interviewInvited) return `Tuesday at ${interviewIntel.invitation.time} is the only fixed date in your search, and the invitation does not name the round. ${interviewIntel.evidence.reports} interview reports do.`
    if (journey.emailConnected && !journey.phonepeReplied) return 'A recruiter wrote two hours ago and asked a direct question. Replies age faster than applications, so answering today costs you ten minutes and keeps a high-paying conversation alive.'
    return `Juspay is the closest match to the preferences you reviewed—${juspay.preferenceMatch}% Preference Match at ${juspay.salary}. Nothing else in your search is waiting on you right now.`
  }
  if (q.includes('₹22') || q.includes('role') || q.includes('fit') || q.includes('move for')) {
    return `Start with senior backend roles in the ${juspay.salary} range. Juspay is the strongest current signal at ${juspay.preferenceMatch}% Preference Match, but your profile evidence is still ${journey.readiness}/${juspay.readinessTotal} until you review it.`
  }
  if (q.includes('profile') || q.includes('weak') || q.includes('evidence') || q.includes('stand out')) {
    return `Your profile evidence sits at ${journey.readiness}/${juspay.readinessTotal}. What is thin is proof rather than experience—the claims a recruiter cannot verify from your profile alone. Closing that gap is worth more than another application.`
  }
  if (q.includes('interview') || q.includes('ready') || q.includes('tuesday')) {
    return journey.interviewInvited
      ? `Your Juspay invite is for Tuesday at ${interviewIntel.invitation.time}. We can infer the likely round from ${interviewIntel.evidence.reports} reports, but the invitation itself does not name the round.`
      : 'I do not have an interview invitation yet. Add one or connect your application email, and I can ground preparation in the role, company, and your confirmed evidence.'
  }
  if (journey.emailConnected && !journey.phonepeReplied) {
    return 'Reply to PhonePe first. The recruiter wrote two hours ago, and answering today keeps an active, high-paying opportunity warm. Nothing sends without your review.'
  }
  if (!journey.emailConnected) {
    return `Review Juspay first—it fits your senior-backend direction and ${juspay.salary} sits above your ₹22L+ target. Connecting your application email is the one thing that would let me watch the rest of your search for you.`
  }
  return 'Your strongest next move is to review Juspay. It fits your senior-backend direction and ₹22L+ target, while keeping the evidence gap visible.'
}

// ---------------------------------------------------------------------------
// 2. PARTS — shared. Re-arrangeable and re-styleable; never re-authorable.
// ---------------------------------------------------------------------------

function HomeHeader() {
  return (
    <div className="home-header page-pad">
      <Logo />
      {/* AppUI's <Avatar /> is itself a button, and nesting one inside this one put two
          controls in the same 36px square. Home renders the mark and owns the control. */}
      <button className="home-avatar-button" onClick={() => go('/profile')} aria-label="Your profile">
        <span className="avatar" aria-hidden="true">{candidate.initials}</span>
      </button>
    </div>
  )
}

function LiveSummary({ attention }) {
  return (
    <button className="home-live-summary" onClick={() => go('/tracker')}>
      <i />
      <span>
        <small>Live from your application email</small>
        <strong>15 organised · {attention} need you</strong>
      </span>
      <ChevronRight size={16} />
    </button>
  )
}

/*
 * The hero owns its own AnimatePresence so a change of action reads as a replacement
 * rather than an instant swap. AnimatePresence's `initial` is false on a plain mount,
 * so screenshots and tests stay static, while a mid-session rerank animates.
 */
function HeroCard({ ctx, className = '' }) {
  const { action, firstArrival, reduceMotion, ask } = ctx
  const duration = reduceMotion ? 0 : 0.42
  return (
    <AnimatePresence mode="wait" initial={Boolean(firstArrival && !reduceMotion)}>
      <motion.article
        key={action.id}
        className={`priority-card home-action-hero ${action.variant} ${className}`}
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration, ease: EASE }}
      >
        <div className="priority-top">
          <div className="priority-kicker">{action.icon} {action.kicker}</div>
          {action.badge}
        </div>
        {action.company && (
          <div className="priority-company">
            <CompanyLogo initials={action.company.initials} color={action.company.color} />
            <span><strong>{action.company.name}</strong><small>{action.company.detail}</small></span>
          </div>
        )}
        <h2>{action.headline}</h2>
        {action.support && <p>{action.support}</p>}
        {action.facts && <div className="priority-facts">{action.facts.map((fact) => <span key={fact}>{fact}</span>)}</div>}
        {action.why && <WhyRow action={action} ask={ask} />}
        <button className="light-button" onClick={action.cta.onClick}>{action.cta.label} <ArrowRight size={17} /></button>
      </motion.article>
    </AnimatePresence>
  )
}

function WhyRow({ action, ask, className = 'home-why' }) {
  return (
    <button className={className} onClick={() => ask(action.whyQuestion)}>
      <span><small>Why this is first</small><b>{action.why}</b></span>
      <ChevronRight size={15} />
    </button>
  )
}

function ConnectNote() {
  return (
    <div className="home-connect-note">
      <span className="home-connect-icon"><Mail size={16} /></span>
      <div>
        <span className="home-connect-kicker">NEXT USEFUL CONNECTION</span>
        <h3>Know what needs you—before an opportunity goes cold.</h3>
        <p>Connect the email you use to apply and North brings the recruiter moment that needs you here.</p>
        <button className="home-connect-action" onClick={() => go('/onboarding?step=email')}>Connect application email <ArrowRight size={14} /></button>
        <small><ShieldCheck size={12} /> Job-search email only. Read only. Disconnect anytime.</small>
      </div>
    </div>
  )
}

function TimeJump({ update }) {
  return (
    <div className="home-timejump">
      <span><strong>Presenter time jump</strong><small>Simulate Gmail detecting a Juspay interview invitation three days after Arjun applies.</small></span>
      <button onClick={() => update({ interviewInvited: true })}><Clock3 size={15} /> Jump ahead 3 days</button>
    </div>
  )
}

function Composer({ grounding, onOpen }) {
  return (
    <button className="home-composer" onClick={() => onOpen('')}>
      <span className="home-composer-orb"><Sparkles size={17} /></span>
      <span className="home-composer-label">
        <strong>Ask North about your next move</strong>
        <small>{grounding}</small>
      </span>
      <Send size={16} />
    </button>
  )
}

function SetAside({ rows }) {
  if (!rows.length) return null
  return (
    <>
      <div className="setaside-head">
        <h2>What I set aside</h2>
        <small>{rows.length} {rows.length === 1 ? 'thing' : 'things'}</small>
      </div>
      <div className="setaside-list">
        {rows.map(({ id, initials, color, company, detail, when, reason, onSelect }) => (
          <button key={id} onClick={onSelect}>
            <CompanyLogo initials={initials} color={color} />
            <span className="setaside-copy">
              <span className="setaside-top"><strong>{company}</strong><em>{when}</em></span>
              <small>{detail}</small>
              <b>{reason}</b>
            </span>
            <ChevronRight size={15} />
          </button>
        ))}
      </div>
    </>
  )
}

/*
 * One line under the sequence, changing with the day.
 *
 * Deliberately not a card: Home already stacks white surfaces, and another one would
 * read as a fifth thing needing attention. This is the opposite — the screen exhaling
 * after the work. Its weight comes from the mark and the whitespace, not a container.
 *
 * Attributions are checked. Nothing here is a paraphrase passed off as a quotation, and
 * nothing widely misattributed on the internet is included.
 */
const QUOTES = [
  { line: 'Chance favours the prepared mind.', who: 'Louis Pasteur' },
  { line: 'Nothing in life is to be feared, it is only to be understood.', who: 'Marie Curie' },
  { line: 'A ship in harbour is safe — but that is not what ships are built for.', who: 'John A. Shedd' },
  { line: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', who: 'Will Durant' },
  { line: 'Amateurs sit and wait for inspiration. The rest of us just get up and go to work.', who: 'Stephen King' },
]

// What the pill types out. Deliberately not the chip set — the chips sit right above it,
// and repeating them would show range twice instead of twice the range.
const ASK_EXAMPLES = [
  'What should I do first today?',
  'What will this interview cover?',
  'Is this offer worth taking?',
  'What is the pay range for this role?',
  'Where is my profile thin?',
]

function QuoteOfTheDay() {
  // Keyed to the day so it is genuinely a quote *of the day*, and stable for anyone
  // opening the demo twice in one sitting.
  const quote = QUOTES[new Date().getDay() % QUOTES.length]
  return (
    <figure className="home-quote page-pad">
      <span className="home-quote-label">Quote of the day</span>
      <span className="home-quote-mark" aria-hidden="true">&ldquo;</span>
      <blockquote>{quote.line}</blockquote>
      <figcaption>{quote.who}</figcaption>
    </figure>
  )
}

/*
 * The actionable carousel — MOB-HOME-006 (Klarna) for the peeking mechanic,
 * MOB-HOME-005 (Monzo) for dismissal living on the card, MOB-HOME-003 (Bond) for
 * the widget grammar inside it: eyebrow, bold claim, evidence, one pill action.
 *
 * One in view at a time with the next one peeking, which is what makes this read as
 * an ordered queue rather than a gallery. The neighbour card is the affordance.
 */
function ActionCarousel({ ctx, cards }) {
  // Two pieces of local state, both presentation-only: which card's set-aside menu is
  // open, and which card is currently playing its leave animation. What has actually
  // been set aside lives in Home, because the greeting counts it.
  const [menuFor, setMenuFor] = useState(null)
  const [leaving, setLeaving] = useState(null)
  const leaveTimer = useRef(null)
  useEffect(() => () => clearTimeout(leaveTimer.current), [])

  /*
   * Why the leave is a CSS class and a timer rather than AnimatePresence.
   *
   * AnimatePresence removes a child when the child disappears from *its own* render.
   * That held while the dismissed list was local to this component. Once the list moved
   * up to Home — which it had to, so the greeting could stop contradicting the rail —
   * the removal arrives as a new `cards` prop from a parent re-render, and presence
   * tracking silently desynced: React rendered `interview,roles` while the DOM still
   * held all three, the old node mounted at full opacity with exit never firing.
   * Driving the same fade through framer's `animate` did not run either.
   *
   * A class and a timeout do run, always, and cost one CSS rule. The card fades, then it
   * leaves Home's list. Home stays the single source of truth for what has been set
   * aside; this component owns nothing but the transition.
   */
  const dismiss = (id) => {
    setMenuFor(null)
    if (ctx.reduceMotion) { ctx.dismiss(id); return }
    setLeaving(id)
    clearTimeout(leaveTimer.current)
    leaveTimer.current = setTimeout(() => { setLeaving(null); ctx.dismiss(id) }, LEAVE_MS)
  }

  // No empty message here any more. The greeting owns the only count on Home, so when
  // everything has been set aside it is the greeting that says so — a second line
  // underneath restating it was the duplication HOME.md rules out. What is left is the
  // greeting and the day's quote, which is the composition this state should have.
  if (!cards.length) return null

  return (
    <>
      <div className="action-carousel" role="group" aria-label="What needs you, in order">
        {cards.map((card) => (
          <ActionCard
            key={card.id}
            card={card}
            reduceMotion={ctx.reduceMotion}
            leaving={leaving === card.id}
            menuOpen={menuFor === card.id}
            onMenu={() => setMenuFor(menuFor === card.id ? null : card.id)}
            onDismiss={() => dismiss(card.id)}
          />
        ))}
      </div>
    </>
  )
}

/*
 * The six middles.
 *
 * Everything outside this component is identical on every card — width, radius,
 * elevation, the mark-and-kicker row, the dismiss, the pill pinned to the floor. What
 * changes is how the middle composes, because the content is genuinely different in
 * kind: a message wants to look like a message, a booked date wants a date block, an
 * offer wants its number set large, a role wants columns of evidence.
 *
 * The leash: no shape may introduce a size, radius or elevation the others do not have.
 * If one needs that to work, the treatment is wrong, not the shell.
 */

// Shapes whose middle already states the timing — a date block, a due chip, a stat row.
// A chip in the header on top of that just says the same thing twice.
const TIMING_IN_MIDDLE = new Set(['interview', 'task', 'role'])

/*
 * Shapes whose middle already leads with the number this card is about. Their footer
 * carries the action alone — a ₹28L figure set at 34px and then repeated in the floor
 * beneath it is the same count twice on one card, which is the rule Home already keeps
 * for its greeting.
 */
const FIGURE_IN_MIDDLE = new Set(['offer', 'interview'])

/*
 * Which tones wear a coloured field — MOB-HOME-004 (Strava).
 *
 * The line is the one `.action-card-mark` already drew: a coloured card is something
 * happening to you — money on the table, a date booked, a person waiting, a clock
 * running — and a white card is something sitting there for you to choose. Ranked roles
 * and the email connection stay white, which is what stops the carousel becoming a
 * rainbow and keeps the colour meaning something.
 *
 * This is a promotion, not an invention: the same green and violet already existed as
 * `priority-card--offer` and `priority-card--interview`, and the marks already carried
 * this exact mapping at 28px.
 *
 * The carousel rebuild dropped these fields for a real reason — "a sequence of equals
 * cannot have one card wearing a different field without re-introducing the hero this
 * rebuild removed". Colouring *by category* answers that: nothing is privileged, because
 * the field says what kind of thing the card is rather than which one is most important.
 * Order is still the only thing that ranks them.
 */
const FIELD_TONES = new Set(['offer', 'interview', 'reply', 'update'])

function Entity({ company, className = 'action-card-entity' }) {
  if (!company) return null
  return (
    <div className={className}>
      <CompanyLogo initials={company.initials} color={company.color} />
      <span>
        <strong>{company.name}</strong>
        {company.detail && <small>{company.detail}</small>}
      </span>
    </div>
  )
}

/*
 * The kicker, under the claim. It used to sit beside the company in the masthead, which
 * cost the role about 90px and pushed every role onto two lines. Below the claim it also
 * says something truer: it labels the news, and the news is the sentence above it.
 */
function CardKicker({ card }) {
  if (!card.kicker) return null
  return <span className="action-card-kicker card-kicker">{card.kicker}</span>
}

function CardMiddle({ card }) {
  // A message: the quote leads behind a rule, and the sender signs it underneath —
  // the order an email actually arrives in.
  if (card.shape === 'reply') {
    return (
      <div className="card-mid">
        <blockquote className="card-quote">{card.headline}</blockquote>
        <CardKicker card={card} />
        {card.source && <small className="card-source">{card.source}</small>}
        {card.support && <p>{card.support}</p>}
      </div>
    )
  }

  // A booked date: the one hard fact in the whole search, so it is drawn as one.
  if (card.shape === 'interview' && card.schedule) {
    const { weekday, date, time, duration, mode, with: who, round } = card.schedule
    return (
      <div className="card-mid">
        <div className="card-when">
          <span className="card-datebox"><b>{weekday}</b><i>{date}</i></span>
          <span className="card-when-detail">
            <strong>{time} · {duration}</strong>
            <small>{mode} · {who}</small>
          </span>
        </div>
        <h2>{card.headline}</h2>
        <CardKicker card={card} />
        <p className="card-entity-line">{card.company?.name} · {round}</p>
        {card.support && <p>{card.support}</p>}
      </div>
    )
  }

  // A number: leading with CTC alone flatters the offer, so the split sits with it.
  if (card.shape === 'offer' && card.money) {
    return (
      <div className="card-mid">
        <div className="card-figure">
          <b>{card.money.total}</b>
          <small>{card.money.fixed} fixed · {card.money.variable} variable</small>
        </div>
        <h2>{card.headline}</h2>
        <CardKicker card={card} />
        <div className="card-band">
          <span>Inside the {card.money.market} market band</span>
          <span>{card.money.delta.replace('above current', 'above your current pay')}</span>
        </div>
      </div>
    )
  }

  // A role: the evidence gets columns instead of wrapping into a grey sentence.
  if (card.shape === 'role') {
    return (
      <div className="card-mid">
        {/* `title` on a queued role, because its `headline` is the Preference Match
            string that the stat row below already carries. */}
        <h2>{card.title || card.headline}</h2>
        <CardKicker card={card} />
        {card.support && <p>{card.support}</p>}
        {card.stats && (
          <div className="card-stats">
            {card.stats.map(({ value, label }) => (
              <span key={label}><b>{value}</b><i>{label}</i></span>
            ))}
          </div>
        )}
      </div>
    )
  }

  // A task: the action is the claim, and the pipeline stage says where it sits.
  if (card.shape === 'task') {
    return (
      <div className="card-mid">
        <h2>{card.headline}</h2>
        <CardKicker card={card} />
        {card.meta && <p className="card-meta">{card.meta}</p>}
        {card.stage && card.stage.startsWith('Ghosted') && (
          <div className="card-taskmeta"><span className="card-stage">{card.stage}</span></div>
        )}
        {card.support && <p>{card.support}</p>}
        {/*
          * The three slots, tappable. The weekday and the time are split across two lines
          * because "Mon 15 Sep · 11:00" is ~110px and three of those do not fit the 272px
          * of usable card width; "Mon 15" over "11:00" is ~62px and three do.
          *
          * The slot travels in the URL rather than being written here, so the card stays
          * a pure render and the flow owns every consequence of the choice.
          */}
        {card.slots && (
          <div className="card-slots" role="group" aria-label="Slots this recruiter offered">
            {card.slots.map((slot) => {
              const [day, time] = slot.split(' · ')
              return (
                <button
                  key={slot}
                  className="card-slot"
                  aria-label={`Choose ${slot}`}
                  onClick={() => go(`/flow/prep?application=${card.applicationId}&slot=${encodeURIComponent(slot)}`)}
                >
                  <b>{day.replace(/ [A-Za-z]{3}$/, '')}</b>
                  <i>{time}</i>
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // A finished round: the interview is named on the card, because a day of the week is
  // not an interview and this screen can hold more than one.
  if (card.shape === 'debrief') {
    return (
      <div className="card-mid">
        <Entity company={card.company} />
        <h2>{card.headline}</h2>
        <CardKicker card={card} />
        {card.support && <p>{card.support}</p>}
      </div>
    )
  }

  // A contribution: no entity row, because the subject is the user's own workplace
  // rather than a company being reported on, and the reciprocity is the claim.

  // A setup step: no entity to name, and a trust boundary that belongs beside the action.
  return (
    <div className="card-mid">
      <Entity company={card.company} />
      <h2>{card.headline}</h2>
      <CardKicker card={card} />
      {card.support && <p>{card.support}</p>}
      {card.footnote && <small className="action-card-note"><ShieldCheck size={12} /> {card.footnote}</small>}
    </div>
  )
}

function ActionCard({ card, reduceMotion, leaving, menuOpen, onMenu, onDismiss }) {
  const duration = reduceMotion ? 0 : 0.32
  return (
    <motion.article
      className={`action-card action-card--${card.kind} action-card--${card.tone}${FIELD_TONES.has(card.tone) ? ' action-card--field' : ''}${leaving ? ' is-leaving' : ''}`}
      layout={!reduceMotion}
      transition={{ duration, ease: EASE }}
    >
      {/*
        * The masthead: whose news this is on the left, what kind of news on the right.
        * Splitting them is the point — the subject and the event are two different facts,
        * and a kicker sitting under a company name reads as a description of the company.
        */}
      <div className="action-card-head">
        {card.company
          ? <CompanyLogo initials={card.company.initials} color={card.company.color} />
          : <span className="action-card-mark">{card.icon}</span>}
        <span className="action-card-org">
          <strong>{card.company?.name || 'North'}</strong>
          {card.company?.role && <small>{card.company.role}</small>}
        </span>
      </div>

      <CardMiddle card={card} />

      {/*
        * The footer band: the one number this card is about, and the one thing to do
        * about it. Pinned to the floor so a row of cards holding different amounts of
        * evidence still lines its actions up.
        */}
      <div className="action-card-foot">
        {card.foot && !FIGURE_IN_MIDDLE.has(card.shape) && <span className="action-card-figure">{card.foot}</span>}
        <button className="action-card-cta" onClick={card.cta.onClick} aria-label={card.cta.name}>
          {card.cta.label} <ArrowRight size={16} />
        </button>
      </div>

      {card.dismissable && (
        <button
          className="action-card-dismiss"
          aria-label={`Set aside ${card.company?.name || card.headline}`}
          aria-expanded={menuOpen}
          onClick={onMenu}
        >
          <X size={15} />
        </button>
      )}

      {menuOpen && (
        <>
          {/* A menu that only closes by choosing something is a trap. The scrim covers
              the whole screen so a tap anywhere outside dismisses it, and Escape does
              the same for a keyboard. */}
          <button className="action-card-scrim" aria-label="Close menu" onClick={onMenu} />
          <div className="action-card-menu" role="menu" aria-label="Set this aside" onKeyDown={(event) => event.key === 'Escape' && onMenu()}>
          {/* Three outcomes, because the third is the honest one: plenty of this
              happens off the platform and nothing can detect that it did. */}
            <button role="menuitem" onClick={onDismiss}>Ignore</button>
            <button role="menuitem" onClick={onDismiss}>Remind me later</button>
            <button role="menuitem" onClick={onDismiss}>Mark as done — I handled it</button>
          </div>
        </>
      )}
    </motion.article>
  )
}

// ---------------------------------------------------------------------------
// 3. DESIGNS
// ---------------------------------------------------------------------------

/*
 * CURRENT — one unified carousel, Bond material.
 *
 * The hero and "What I set aside" merged on 2026-08-18: Home stopped being the screen
 * that picks one thing and files the rest away, and became the screen that lays
 * everything out in order. The arbitration claim is unchanged and still falsifiable —
 * the order moves when the user's life moves — it is just no longer told through one
 * card being bigger than the others.
 */
function HomeCurrent({ ctx, sheets }) {
  const { journey, update, intro, rise } = ctx
  return (
    <>
      <HomeHeader />

      <motion.section className="page-pad home-intro home-intro--adaptive" {...rise(0)}>
        {/* A fixture time, not a clock: it agrees with the greeting and stays inside the
            Thursday the rest of the data assumes (2h ago, Overdue, Tuesday's round). */}
        <span>Thursday · 9:41 am</span>
        <h1>Good morning, {ctx.firstName}.</h1>
        <p>{intro}</p>
        {/* The live-email row was removed on 2026-08-19. It restated what the sequence
            below it already shows, and Tracker owns the organised-inbox count. */}
      </motion.section>

      <motion.section className="home-carousel-section" {...rise(1)}>
        <ActionCarousel ctx={ctx} cards={ctx.cards} />
        {/* "Why this is first" was removed on 2026-08-19: each card already carries the
            reason it sits where it sits, so a separate row restated the sequence. */}
        <QuoteOfTheDay />
        {ctx.showTimeJump && <div className="page-pad"><TimeJump update={update} /></div>}
      </motion.section>

      {/* The composer and the prompt chips are no longer page content — they sit in
          the dock with the tabs, as one bottom cluster (MOB-HOME-001, Cleo).
          "Add an interview manually" was removed on 2026-08-19: it had become a lone
          link floating under the carousel, and the capability index in the assistant
          sheet already offers the same sheet. One entry point, not two. */}
    </>
  )
}

/*
 * A · THE ANSWER — reference MOB-ONB-014 (Places)
 *
 * The screen is the assistant's answer to the question the user would have asked.
 * A stated question, a prose verdict with inline links into the app, a rule, the
 * authored answer block, then the rail as the answer's scope of consideration.
 * Credibility comes from reading like a considered reply rather than a widget.
 *
 * Learned: one clear recommendation, evidence adjacent, follow-up always available.
 * Not copied: editorial warmth, serif display, five-item navigation.
 */
function HomeAnswer({ ctx, sheets }) {
  const { journey, update, attention, prompts, rise, ask, grounding } = ctx
  return (
    <>
      <HomeHeader />

      <motion.section className="page-pad answer-question" {...rise(0)}>
        <span className="answer-eyebrow">Thursday · Your job search</span>
        <p className="answer-asked">{askedQuestion(ctx)}</p>
      </motion.section>

      <motion.section className="page-pad answer-reply" {...rise(1)}>
        <h1>Good morning, {ctx.firstName}.</h1>
        <p className="answer-prose">{answerLead(ctx)}</p>
        {journey.emailConnected && <LiveSummary attention={attention} />}
      </motion.section>

      <motion.section className="page-pad answer-block" {...rise(2)}>
        <HeroCard ctx={ctx} />
        {ctx.showConnectNote && <ConnectNote />}
        {ctx.showTimeJump && <TimeJump update={update} />}
      </motion.section>

      <motion.section className="page-pad answer-scope" {...rise(3)}>
        <SetAside rows={ctx.aside} />
      </motion.section>

      <motion.section className="page-pad answer-followup" data-composer {...rise(4)}>
        <Composer grounding={grounding} onOpen={ask} />
        <PromptChips prompts={prompts} onAsk={ask} />
      </motion.section>
    </>
  )
}

function askedQuestion(ctx) {
  if (ctx.journey.offerDetected) return 'I have an offer. What should I be looking at?'
  if (ctx.journey.interviewInvited) return 'What should I do about Tuesday?'
  return 'What should I do today?'
}

/*
 * The prose verdict. Inline links go where a real answer would point, so the
 * recommendation and the way into it are the same sentence.
 *
 * The prose never names the company the answer block below is about: the setup
 * belongs here, the reveal belongs there. Naming it twice is the adjacent
 * repetition COPY.md rules out — and it also made getByText ambiguous.
 */
function answerLead({ journey, action }) {
  const link = (label, to) => <button className="answer-link" onClick={() => go(to)}>{label}</button>

  if (action.id === 'offer') {
    return <>A live decision is open, and it is the only thing in your search with a clock on it. The {link('₹28L in writing', '/offer/juspay?stage=decision&story=finale')} is one part of what you are actually deciding.</>
  }
  if (action.id === 'interview') {
    return <>Tuesday is the only fixed date anywhere in your search, and the invitation does not say what the round covers. {link(`${interviewIntel.evidence.reports} interview reports`, '/prep/juspay')} do.</>
  }
  if (action.id === 'reply') {
    return <>I looked across all of it. Nothing in {link('your roles', '/matches')} is time-sensitive and no interview is booked — but a recruiter wrote two hours ago and asked you a direct question.</>
  }
  if (action.id === 'opportunity') {
    return journey.emailConnected
      ? <>Nothing in {link('your applications', '/tracker')} is waiting on you right now, so this comes down to fit. One role sits closer to what you told me you wanted than anything else.</>
      : <>I can only see your profile and preferences — no applications yet. Even so, one role in {link('your roles', '/matches')} sits closest to what you said you wanted.</>
  }
  return <>I can rank roles from the profile you reviewed, but I cannot see what you have already applied to.</>
}

/*
 * B · THE CONSOLE — references MOB-ONB-011 / 013 / 010 (Lovi, Quizlet, Oportun)
 *
 * The search is a plan with a state. A greeting, a progress meter, one promoted
 * resumable task, then grouped surfaces of lower-commitment context. Credibility
 * comes from coverage: seeing that nothing was dropped is what makes the one
 * action feel earned rather than asserted.
 *
 * Learned: a visible short path; one resumable thing made dominant; a gap gets one
 * obvious action inside the same grouped surface (Oportun) — which is why the email
 * recommendation sits inside the search group rather than floating above it.
 * Not copied: day gamification, frosted glow, mascot, carousel, premium upsell.
 */
function HomeConsole({ ctx, sheets }) {
  const { journey, update, attention, intro, grounding, prompts, rise, ask } = ctx
  const milestones = journeyProgress(journey)
  const reached = milestones.filter(Boolean).length

  return (
    <>
      <HomeHeader />

      <motion.section className="page-pad console-head" {...rise(0)}>
        <span className="console-eyebrow">Thursday · Your job search</span>
        <h1>Good morning, {ctx.firstName}.</h1>
        <p className="console-intro">{intro}</p>
        <div className="console-meter" role="img" aria-label={`${reached} of ${milestones.length} stages active`}>
          {milestones.map((on, index) => <i key={index} className={on ? 'is-on' : ''} />)}
        </div>
        <span className="console-meter-caption">{reached} of {milestones.length} stages active</span>
        {journey.emailConnected && <LiveSummary attention={attention} />}
      </motion.section>

      <motion.section className="page-pad console-group" {...rise(1)}>
        <h2 className="console-group-label">Today</h2>
        <HeroCard ctx={ctx} />
        {ctx.showTimeJump && <TimeJump update={update} />}
      </motion.section>

      <motion.section className="page-pad console-group" {...rise(2)}>
        <SetAside rows={ctx.aside} />
        {ctx.showConnectNote && <ConnectNote />}
      </motion.section>

      <motion.section className="page-pad console-group" {...rise(3)}>
        <h2 className="console-group-label">Ask</h2>
        <Composer grounding={grounding} onOpen={ask} />
        <PromptChips prompts={prompts} onAsk={ask} />
      </motion.section>
    </>
  )
}

/*
 * C · THE COMPOSER — reference MOB-ONB-012 (Natural AI)
 *
 * Input-first. The composer is the dominant element and the ranked action becomes
 * the first pre-filled suggestion beneath it. Its real argument is the one thing no
 * other surface can make: the bottom nav covers places, but most of what AmbitionBox
 * offers are capabilities, and capabilities have no tab. Résumé work lives inside a
 * job, negotiation inside an offer, decoding inside an invite. The capability list
 * is how you reach them without already knowing where they are.
 *
 * Learned: an input can open straight into concrete suggested actions.
 * Not copied: pastel haze, translucent AI wash, generic assistant welcome.
 */
function HomeComposer({ ctx, sheets }) {
  const { journey, update, attention, intro, grounding, prompts, rise, ask } = ctx
  return (
    <>
      <HomeHeader />

      <motion.section className="page-pad composer-head" {...rise(0)}>
        <span className="composer-eyebrow">Thursday · Your job search</span>
        <h1>Good morning, {ctx.firstName}.</h1>
        <p className="composer-intro">{intro}</p>
        {journey.emailConnected && <LiveSummary attention={attention} />}
      </motion.section>

      <motion.section className="page-pad composer-input" data-composer {...rise(1)}>
        <Composer grounding={grounding} onOpen={ask} />
        <PromptChips prompts={prompts} onAsk={ask} />
      </motion.section>

      <motion.section className="page-pad composer-suggested" {...rise(2)}>
        <h2 className="composer-label">Start here</h2>
        <HeroCard ctx={ctx} />
        {ctx.showConnectNote && <ConnectNote />}
        {ctx.showTimeJump && <TimeJump update={update} />}
      </motion.section>

      <motion.section className="page-pad composer-search" {...rise(4)}>
        <SetAside rows={ctx.aside} />
      </motion.section>
    </>
  )
}

// Every row goes somewhere that exists. Nothing here claims a capability the
// prototype cannot actually show.
//
// Permanent as of 2026-08-18, in every direction rather than the Composer only.
// An Explore tab was considered and dropped: it would have been this same list
// packaged as tiles, and the composer that opens this sheet is permanent chrome,
// so the list is already reachable from any state without spending a tab on it.
/*
 * Rows the screen you opened from makes most likely, lifted to the top.
 *
 * The baseline order is the search as it actually runs. Context re-ranks it rather than
 * rewriting it: nothing is added, nothing is hidden, and the row a person came looking
 * for is not four items down. Journey state outranks screen, because a live offer is a
 * bigger fact about where you are than which tab you happen to be on.
 *
 * Everything below the lifted rows keeps its baseline order, so the menu never feels
 * reshuffled between visits.
 */
const CONTEXT_PRIORITY = {
  home: [],
  jobs: ['roles', 'company'],
  job: ['strengthen', 'company'],
  assistant: ['strengthen', 'knows'],
  tracker: ['track', 'prep'],
  offer: ['offer', 'company'],
  prep: ['prep', 'company'],
}

function orderByContext(rows, context, journey) {
  const lifted = [
    // A booked round and a live offer are the strongest signals there are, whatever
    // screen the sheet was opened from.
    ...(journey.offerDetected ? ['offer'] : []),
    ...(journey.interviewInvited ? ['prep'] : []),
    ...(CONTEXT_PRIORITY[context] || []),
  ]
  const rank = (row) => {
    const index = lifted.indexOf(row.id)
    return index === -1 ? lifted.length : index
  }
  return rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => rank(a.row) - rank(b.row) || a.index - b.index)
    .map((item) => item.row)
}

export function capabilities({ journey }, sheets, context = 'home') {
  // Ordered as the search actually runs — discover, evaluate, apply, track, interview,
  // offer — because that is the order the rest of the demo is built in. Track had been
  // sitting after Offer, which put the everyday screen behind the once-a-search one.
  // `orderByContext` then lifts what the current screen and journey make likely.
  //
  // A row is a label and a destination, nothing else. Two attempts at a second value
  // were both cut: the original `hint` described what each destination was, which the
  // label already says, and the live-state suffix that replaced it ("Tuesday 11:00",
  // "₹28L") put facts the cards already carry into a menu, where they read as clutter.
  return [
    {
      id: 'roles', label: 'Find roles that fit me',
      icon: Search, onSelect: () => go('/matches'),
    },
    {
      id: 'company', label: 'Tell me what a company is really like',
      icon: Building2, onSelect: () => go('/jobs/juspay'),
    },
    {
      // Was "Strengthen my application", which named the outcome and hid the artifact.
      // The destination produces a tailored résumé, so the row says résumé.
      // "Close the evidence gap" would put "Close" in this row's accessible name,
      // colliding with every sheet's Close control.
      id: 'strengthen', label: 'Tailor my résumé',
      icon: FileText, onSelect: () => go('/assistant/juspay'),
    },
    {
      id: 'track', label: 'Track every application',
      icon: BriefcaseBusiness, onSelect: () => go('/tracker'),
    },
    {
      id: 'prep', label: 'Add or prepare an interview',
      icon: UserRoundCheck, onSelect: () => (journey.interviewInvited ? go('/prep/juspay') : sheets.openAddInterview()),
    },
    {
      id: 'offer', label: 'Evaluate an offer',
      icon: CircleDollarSign, onSelect: () => (journey.offerDetected ? go('/offer/juspay?stage=decision&story=finale') : sheets.openOfferStart()),
    },
    {
      // The assistant's own memory is a destination too, and the one row that answers
      // "how do you know any of this" without the user having to ask it. Last, because
      // it is about the assistant rather than about the search.
      // Matches the heading on /profile, and a noun phrase reads as a destination —
      // which also keeps the longest row in the menu to one line at 360px.
      id: 'knows', label: 'What North knows about me',
      icon: ShieldCheck, onSelect: () => go('/profile'),
    },
  ].map((row) => row)
}

// The index the sheet actually renders: the baseline list, re-ranked for where you are.
export function contextualCapabilities(ctx, sheets, context) {
  return orderByContext(capabilities(ctx, sheets), context, ctx.journey)
}

/*
 * Tools answer in place rather than navigating — that is the whole reason they are a
 * separate group. AmbitionBox's calculators are a real part of the product, and each
 * row here routes through `homeAnswer` against the same fixtures every other answer
 * uses, so a tool returns Arjun's numbers rather than an empty form.
 *
 * The label is what the tool is called; the question is what gets asked. Keeping them
 * separate means the row can read as a tool while the thread still reads as a question
 * someone asked.
 */
function assistantTools() {
  return [
    { id: 'fair', label: 'Am I being paid fairly?', question: 'Am I being paid fairly?', icon: Scale },
    { id: 'inhand', label: 'In-hand salary calculator', question: 'What is my monthly in-hand?', icon: Calculator },
    { id: 'gratuity', label: 'Gratuity calculator', question: 'How much gratuity am I owed?', icon: PiggyBank },
  ]
}

/*
 * Past chats. Deterministic, and every entry routes back through `homeAnswer` rather
 * than storing a reply — opening one shows the real answer, so history cannot drift
 * from what the assistant would say today. Anything asked this session joins the top
 * of the list, which is why the seed is short: it is context, not the feature.
 */
const pastChats = [
  { question: 'How does Juspay compare with Razorpay?', when: 'Yesterday' },
  { question: 'What is thin in my profile?', when: 'Tuesday' },
  { question: 'Which roles actually fit me right now?', when: 'Last week' },
]

const DESIGNS = {
  current: HomeCurrent,
  answer: HomeAnswer,
  console: HomeConsole,
  composer: HomeComposer,
}


/*
 * Home's chrome is now the shared dock from AppUI, so Home and Jobs cannot drift apart.
 * The three legacy directions still render their own in-page composer, so the dock
 * carries the ask only when the design does not.
 */
function HomeChrome({ ctx, design }) {
  const askInPage = design !== 'current'
  if (askInPage) return <div className="home-dock home-dock--nav-only"><BottomNav active="home" /></div>
  return (
    <AssistantDock
      active="home"
      label="Ask North about your next move"
      examples={ASK_EXAMPLES}
      reduceMotion={ctx.reduceMotion}
      onOpen={ctx.ask}
    />
  )
}

// ---------------------------------------------------------------------------
// 4. SWITCHER — review-only
// ---------------------------------------------------------------------------

const DESIGN_LABELS = [
  ['current', 'Current'],
  ['answer', 'Answer'],
  ['console', 'Console'],
  ['composer', 'Composer'],
]

function DesignSwitcher({ design }) {
  // Appends to the existing query so ?preset= and the other axis both survive.
  const select = (key, next) => {
    const params = new URLSearchParams(window.location.search)
    params.set(key, next)
    go(`/home?${params.toString()}`)
  }
  return (
    <div className="home-design-switcher">
      <div role="group" aria-label="Home design direction">
        {DESIGN_LABELS.map(([id, label]) => (
          <button key={id} className={design === id ? 'is-active' : ''} aria-pressed={design === id} onClick={() => select('design', id)}>{label}</button>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 5. SCREEN
// ---------------------------------------------------------------------------

export function HomeScreen() {
  const { design, reviewing } = useHomeDesign()
  const sheets = useHomeSheets()
  const ctx = useHomeContext(sheets)
  const Design = DESIGNS[design] || DESIGNS[DEFAULT_DESIGN]
  const resolved = DESIGNS[design] ? design : DEFAULT_DESIGN

  return (
    // Home renders its own screen wrapper rather than AppUI's, so a navigation
    // direction can be reviewed without editing AppUI.jsx. The nav therefore changes
    // on Home only until a direction is chosen and promoted.
    <main id="main-content" className={`screen home-screen home--${resolved}`}>
      <Design ctx={ctx} sheets={sheets} />
      {reviewing && <DesignSwitcher design={design} />}
      <HomeChrome ctx={ctx} design={resolved} />

      <AnimatePresence>
        {sheets.reply && <ReplySheet sent={sheets.sent} onClose={sheets.closeReply} onSend={sheets.sendReply} />}
        {sheets.addInterview && <AddInterviewSheet onClose={sheets.closeAddInterview} />}
        {sheets.assistant && <HomeAssistantSheet journey={ctx.journey} initialQuestion={sheets.assistantQuestion} onClose={sheets.closeAssistant} index={contextualCapabilities(ctx, sheets, 'home')} />}
        {sheets.offerStart && <OfferStartSheet onClose={sheets.closeOfferStart} onUseDemo={sheets.useDemoOffer} />}
        {sheets.debrief && <DebriefSheet onClose={sheets.closeDebrief} onDone={sheets.logInterview} />}
      </AnimatePresence>
    </main>
  )
}

// ---------------------------------------------------------------------------
// 6. SHEETS — shared by every design
// ---------------------------------------------------------------------------

export function HomeAssistantSheet({ journey, initialQuestion, onClose, index }) {
  // The draft and the asked question are separate: once a question is answered it moves
  // into the thread as a bubble, and the field goes back to empty so the next question
  // starts clean rather than the same sentence appearing twice on screen.
  const [draft, setDraft] = useState('')
  const [asked, setAsked] = useState(initialQuestion || '')
  const [history, setHistory] = useState(initialQuestion ? [initialQuestion] : [])
  const [view, setView] = useState(initialQuestion ? 'thread' : 'menu')
  const answer = useMemo(() => homeAnswer(journey, asked), [journey, asked])
  const tools = assistantTools()

  // A fade drawn when nothing is hidden is a lie about the content, so whether the list
  // runs past the fold is measured rather than assumed. It re-measures whenever the view
  // or the history changes, because each one swaps the whole stage out.
  const scrollRef = useRef(null)
  const [more, setMore] = useState(false)
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return undefined
    const measure = () => setMore(el.scrollHeight - el.scrollTop - el.clientHeight > 8)
    measure()
    el.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => { el.removeEventListener('scroll', measure); window.removeEventListener('resize', measure) }
  }, [view, asked, history.length])

  const ask = (item) => {
    setAsked(item)
    setDraft('')
    setView('thread')
    setHistory((rows) => (rows.includes(item) ? rows : [item, ...rows]))
  }
  // Back is a real back, not a second close: from a thread or from history it returns to
  // the menu, and only leaves the assistant when the menu is already what you are on.
  const back = () => (view === 'menu' ? onClose() : setView('menu'))

  const threads = [
    ...history.map((question) => ({ question, when: 'This session' })),
    ...pastChats.filter((row) => !history.includes(row.question)),
  ]

  // Full page, not a partial sheet: this is the assistant's own surface, and at partial
  // height the menu and the composer were fighting over the same few hundred pixels.
  // No `onClose` passed to Sheet — this sheet carries its own header instead of the
  // floating Close every other sheet uses.
  return <Sheet label="Ask North" className="home-assistant-sheet">
    <header className="assistant-bar">
      <button onClick={back} aria-label={view === 'menu' ? 'Close assistant' : 'Back'}><ArrowLeft size={20} /></button>
      <button onClick={() => setView(view === 'chats' ? 'menu' : 'chats')} aria-label="Past chats" aria-expanded={view === 'chats'}><Menu size={20} /></button>
    </header>

    {/* Two halves, not one stack — MOB-HOME-002 (Natural AI). The top half is where you
        go, the bottom half is where you type. Mixing them was the old sheet's problem:
        navigation rows sat in the same contained list as chat suggestions, so neither
        read as itself. The menu floats uncontained because it is a set of destinations,
        and the composer takes a real field at the bottom because it is an input. */}
    <div className="assistant-stage">
      <div className="assistant-scroll" ref={scrollRef}>
      {view === 'thread' && <motion.div className="assistant-thread" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="assistant-asked">{asked}</p>
        <div className="home-assistant-answer"><span>Based on your current context</span><p>{answer}</p><small><ShieldCheck size={13} /> Nothing is sent or changed automatically.</small></div>
      </motion.div>}

      {view === 'chats' && <div className="assistant-chats">
        <span className="assistant-group">Past chats</span>
        {threads.map(({ question, when }) => (
          <button key={question} onClick={() => ask(question)}>
            <MessageSquare size={18} />
            <span><strong>{question}</strong><small>{when}</small></span>
          </button>
        ))}
      </div>}

      {view === 'menu' && <>
        {/* Two groups because the rows behave differently, not for decoration: the first
            set leaves the sheet, the second answers inside it. */}
        {index && <nav className="assistant-menu" aria-label="What North can do">
          {index.map(({ id, label, icon: Icon, onSelect }) => (
            <button key={id} onClick={() => { onClose(); onSelect() }}>
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>}
        <span className="assistant-group">Tools</span>
        <nav className="assistant-menu" aria-label="North tools">
          {tools.map(({ id, label, question, icon: Icon }) => (
            <button key={id} onClick={() => ask(question)}>
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        </>}
      </div>
      {/* Tall enough to start around the middle of the last visible row, so the cut-off
          row itself is the signal rather than a hairline at the very bottom edge. */}
      {more && <span className="assistant-fade" aria-hidden="true" />}
    </div>

    {/* Browsing history is not asking, so the composer steps out of the way for it. */}
    {view !== 'chats' && <div className="assistant-composer-shell">
      <form className="assistant-composer" onSubmit={(event) => { event.preventDefault(); if (draft.trim()) ask(draft.trim()) }}>
        <input aria-label="Ask North" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={view === 'thread' ? 'Ask something else' : 'What do you want to know?'} />
        <div className="assistant-composer-foot">
          <AssistantMark className="assistant-composer-mark" />
          {/* The assistant signs the field it answers from. The state-dependent grounding
              line that used to sit here restated what the answer already qualifies. */}
          <small>North Career Intelligence</small>
          <button aria-label="Send question" disabled={!draft.trim()}><Send size={16} /></button>
        </div>
      </form>
    </div>}
  </Sheet>
}

function OfferStartSheet({ onClose, onUseDemo }) {
  return <Sheet label="Evaluate an offer" onClose={onClose} wide><Pill tone="soft">OFFER DECISION</Pill><h2>Bring an offer into context.</h2><p className="sheet-lead">North can compare the letter with salary evidence, employee reviews, your preferences, and what a move changes.</p><div className="permission-list"><div><FileCheck2 size={18} /><span><strong>Review the offer facts</strong><small>Pay, role, location, work policy, and unknowns.</small></span></div><div><ShieldCheck size={18} /><span><strong>You stay in control</strong><small>Nothing is accepted or sent automatically.</small></span></div></div><button className="primary-button" onClick={onUseDemo}>Use demo Juspay offer <ArrowRight size={17} /></button><p className="fine-print">Deterministic simulation—no real document is uploaded.</p></Sheet>
}

function ReplySheet({ sent, onClose, onSend }) {
  const [message, setMessage] = useState('Hi Rhea, thanks for reaching out. I’d be happy to connect. I’m available tomorrow between 11:00 AM and 1:00 PM, or Friday after 3:00 PM. Let me know what works best.')
  return (
    <Sheet label="Review recruiter reply" onClose={onClose} wide>
      {sent ? <div className="sent-state"><div className="success-burst"><Check size={28} /></div><h2>Reply sent</h2><p>PhonePe moved to Waiting. Your next best action is ready.</p></div> : <>
        <Pill tone="attention">PHONEPE · RECRUITER EMAIL</Pill><h2>Review before sending</h2><p className="sheet-lead">We drafted a concise response using the recruiter’s request. Nothing sends without you.</p>
        <label className="message-box"><span>Reply</span><textarea name="phonepe-reply" autoComplete="off" value={message} onChange={(e) => setMessage(e.target.value)} /></label>
        <div className="draft-note"><Sparkles size={16} /> Availability is the only personal detail included.</div>
        <button className="primary-button" onClick={onSend}><Send size={17} /> Send reply</button>
      </>}
    </Sheet>
  )
}

/*
 * The post-interview debrief — two steps, in that order for a reason.
 *
 * Step one serves the user: the outcome is the thing only they know, and it is what
 * unsticks their Tracker. Step two is what AmbitionBox wants — the questions that came
 * up — and it is only reachable after step one, so the ask is never the price of entry.
 *
 * The pitch on step two is the user's own: logged questions are their weak-spot map, and
 * they feed the same evidence model that already grades their practice answers. The
 * database filling up is the by-product, which is why the copy says so plainly rather
 * than appealing to altruism.
 */
function DebriefSheet({ onClose, onDone }) {
  const round = interviewIntel.loop.rounds[0]
  const [outcome, setOutcome] = useState(null)
  const [questions, setQuestions] = useState('')
  const outcomes = [
    { id: 'well', label: 'It went well' },
    { id: 'mixed', label: 'Hard to read' },
    { id: 'badly', label: 'It did not go well' },
  ]
  return (
    <Sheet label={`How the ${juspay.company} interview went`} onClose={onClose} wide>
      <div className="sheet-body">
        <span className="eyebrow">INTERVIEW DONE</span>
        <h2>How did your {juspay.company} interview go?</h2>
        <p>{round.label} with {interviewIntel.invitation.with}, {interviewIntel.invitation.day} at {interviewIntel.invitation.time}.</p>

        <div className="debrief-outcomes" role="group" aria-label="How it went">
          {outcomes.map(({ id, label }) => (
            <button key={id} className={outcome === id ? 'is-chosen' : ''} aria-pressed={outcome === id} onClick={() => setOutcome(id)}>{label}</button>
          ))}
        </div>

        {outcome && (
          <motion.div className="debrief-questions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {/* The reciprocity is the whole pitch, and it is literal rather than a
                goodwill appeal: these become the questions we prepare him on next. */}
            <h3>What did they actually ask?</h3>
            <p>Whatever you remember. North prepares you on these before your next round, and adds them to the {interviewIntel.evidence.reports} reports that told you what to expect for this one.</p>
            <label className="message-box">
              <span>Questions they asked</span>
              <textarea name="interview-questions" autoComplete="off" rows={4} value={questions} onChange={(e) => setQuestions(e.target.value)} placeholder="How would you make a retry safe to run twice?" />
            </label>
            <p className="add-interview-note"><Info size={15} /> Submitting isn’t wired up in this prototype. In the product these post anonymously, and the outcome stays private to you either way.</p>
            <button className="primary-button" onClick={onDone}>Save how it went <ArrowRight size={17} /></button>
          </motion.div>
        )}
      </div>
    </Sheet>
  )
}


function AddInterviewSheet({ onClose }) {
  return (
    <Sheet label="Add an interview manually" onClose={onClose}>
      <div className="sheet-body">
        <span className="eyebrow">NOT ONLY GMAIL</span>
        <h2>Add an interview yourself.</h2>
        <p>Interviews arrive by phone, WhatsApp, or a portal as often as they arrive by email. Nothing here depends on your inbox.</p>
        <ul className="add-interview-fields">
          <li>Company and role</li>
          <li>Date, time, and how you’re meeting</li>
          <li>Who you’re meeting, if you know</li>
          <li>Paste the invitation, if you have one</li>
        </ul>
        <p className="add-interview-note"><Info size={15} /> Manual entry isn’t wired up in this prototype — the demo interview arrives through Gmail. Everything after this point, the briefing and the coaching, works the same either way.</p>
        <button className="primary-button" onClick={onClose}>Got it</button>
      </div>
    </Sheet>
  )
}
