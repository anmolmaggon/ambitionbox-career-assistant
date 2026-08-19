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

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight, BriefcaseBusiness, Building2, Check, ChevronRight, CircleDollarSign,
  Clock3, FileCheck2, FileText, Info, Mail, MessageSquare, Search, Send, ShieldCheck, Sparkles, Target,
  UserRoundCheck, X,
} from 'lucide-react'
import { applications, candidate, interviewIntel, jobs, juspay, onboardingProfile } from './data'
import { useJourney } from './store'
import { BottomNav, CompanyLogo, Logo, Pill, Sheet, go } from './AppUI'

const EASE = [0.22, 1, 0.36, 1]

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
  const [sent, setSent] = useState(false)

  return {
    reply, addInterview, assistant, assistantQuestion, offerStart, sent,
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

  const action = nextBestAction({ journey, hasProfileContext, openReply: sheets.openReply })
  const aside = setAside({ journey, action })
  const cards = carouselCards({ action, aside, journey })

  return {
    journey,
    update,
    reduceMotion,
    firstArrival,
    attention,
    action,
    aside,
    cards,
    // Home claims to have seen everything, so it reads the profile the user actually
    // reviewed rather than hardcoding a name.
    firstName: (journey.onboardingProfile?.name || onboardingProfile.name).split(' ')[0],
    prompts: contextualPrompts(),
    // The email recommendation is a card only when it is not already the hero.
    showConnectNote: !journey.emailConnected && action.id !== 'connect',
    showTimeJump: journey.resumeReady && !journey.interviewInvited && !journey.offerDetected,
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
 * The greeting explains the screen it introduces, and it has to name everything the
 * screen actually drew on. Two corrections live here:
 *
 *   - A line claiming "one thing" above four cards is untrue, so the count comes from
 *     the sequence itself rather than being authored per state.
 *   - Crediting only the inbox was equally untrue: the sequence mixes email-derived
 *     moments with roles ranked against the reviewed preferences, so the line names
 *     both. Home is the screen that has seen everything; the greeting should say so.
 */
function introLine(journey, firstArrival, count) {
  if (journey.emailConnected) {
    if (count <= 1) {
      return firstArrival
        ? 'You’re all set up. I’ve been across your application email and your ranked roles — one thing needs you today.'
        : 'I looked across everything — one thing needs you.'
    }
    return firstArrival
      ? `You’re all set up. I’ve been across your application email and your ranked roles — ${count} things need you, most urgent first.`
      : `I looked across everything — ${count} things need a look.`
  }
  if (journey.emailSkipped) {
    return firstArrival
      ? 'You’re all set up. I’ve ranked everything against the preferences you just reviewed — your search starts with what actually fits.'
      : 'Your profile is ready. Bring your live search into focus next.'
  }
  return 'Your profile is ready. Bring your live search into focus next.'
}

// The hero is one adaptive surface. The first branch that matches owns the screen,
// and every ranked branch states why it outranks the rest. Designs present this
// differently; none of them may change the order.
function nextBestAction({ journey, hasProfileContext, openReply }) {
  if (journey.offerDetected) {
    return {
      id: 'offer',
      variant: 'priority-card--offer',
      tone: 'offer', icon: <CircleDollarSign size={14} />,
      kicker: 'OFFER RECEIVED',
      badge: <Pill tone="success">Today</Pill>,
      when: 'Today',
      company: { initials: 'JP', name: 'Juspay', detail: `${juspay.role} · ${juspay.location}` },
      headline: 'Your ₹28L offer is ready to understand.',
      support: 'See what employees report, what the move changes, and where you have room to negotiate.',
      why: 'A live decision outranks everything else in your search.',
      whyQuestion: 'Why is reviewing this offer my next move?',
      cta: { label: 'Review my offer', onClick: () => go('/offer/juspay?stage=decision&story=finale') },
    }
  }

  if (journey.interviewInvited) {
    return {
      id: 'interview',
      variant: 'priority-card--interview',
      tone: 'interview', icon: <Clock3 size={14} />,
      kicker: 'INTERVIEW SCHEDULED',
      badge: <Pill tone={journey.prepComplete ? 'success' : 'attention'}>{interviewIntel.invitation.day.split(',')[0]}</Pill>,
      when: interviewIntel.invitation.day.split(',')[0],
      company: { initials: 'JP', name: 'Juspay', detail: `${juspay.role} · Round 1 of ${interviewIntel.loop.total}` },
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
      kicker: 'RECRUITER REPLY NEEDED',
      badge: <span className="time-chip">2h ago</span>,
      when: '2h ago',
      company: { initials: 'PP', color: '#5f259f', name: 'PhonePe', detail: 'Backend Engineer III' },
      headline: '“Can you confirm your availability for a quick conversation?”',
      support: 'Replying today keeps a high-paying opportunity warm. Detected in Gmail.',
      why: 'A person is waiting, and a recruiter reply ages faster than an application.',
      whyQuestion: 'Why should I reply to PhonePe first?',
      cta: { label: 'Review reply', onClick: openReply },
    }
  }

  if (hasProfileContext || journey.emailConnected) {
    return {
      id: 'opportunity',
      variant: 'priority-card--juspay',
      tone: 'role', icon: <Target size={14} />,
      kicker: 'BEST NEXT OPPORTUNITY',
      when: juspay.posted,
      company: { initials: juspay.initials, name: juspay.company, detail: juspay.role },
      headline: 'Your payments experience makes this unusually relevant.',
      // Preference Match leads the evidence row rather than sitting in the kicker line,
      // so the term stays spelled out at 360px instead of being shortened to "match".
      facts: [`${juspay.preferenceMatch}% Preference Match`, juspay.salary, juspay.mode, `${juspay.rating} ★`],
      why: journey.emailConnected
        ? 'Nothing in your inbox is waiting on you, so preference ranking takes over.'
        : 'It sits closest to the preferences you just reviewed.',
      whyQuestion: 'Why is Juspay my next move?',
      cta: { label: 'See why it fits', onClick: () => go('/jobs/juspay') },
    }
  }

  return {
    id: 'connect',
    variant: 'priority-card--connect',
    tone: 'quiet', icon: <Mail size={14} />,
    kicker: 'NEXT USEFUL CONNECTION',
    headline: 'Know what needs you—before an opportunity goes cold.',
    support: 'Connect the email you use to apply. AmbitionBox will organise updates and bring the right recruiter moment here.',
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
        id: 'interview', initials: 'JP', company: 'Juspay', detail: `Round 1 of ${interviewIntel.loop.total}`,
        when: interviewIntel.invitation.day.split(',')[0], rank: 0,
        kicker: 'INTERVIEW SCHEDULED', ctaLabel: 'Review my prep', tone: 'interview', icon: <Clock3 size={14} />,
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
      kicker: 'RANKED ROLES', ctaLabel: 'See ranked roles', tone: 'role', icon: <Target size={14} />,
      reason: 'Nothing here beats an offer already in writing.',
      onSelect: () => go('/matches'),
    })
  } else if (journey.emailConnected) {
    if (journey.interviewInvited && !journey.phonepeReplied) {
      add({
        id: 'reply', initials: 'PP', color: '#5f259f', company: 'PhonePe', detail: 'Reply to recruiter',
        when: '2h ago', rank: 1,
        kicker: 'RECRUITER REPLY NEEDED', ctaLabel: 'Review reply', tone: 'reply', icon: <MessageSquare size={14} />,
        reason: 'A fixed date beats an open message.',
        onSelect: () => go('/home?action=phonepe'),
      })
    }
    for (const item of applications.attention) {
      if (item.company === 'PhonePe') continue
      add({
        id: item.company.toLowerCase(), initials: item.company.slice(0, 2).toUpperCase(), color: item.color,
        company: item.company, detail: item.action, when: item.when, rank: urgency(item.when),
        kicker: 'APPLICATION UPDATE', ctaLabel: 'Open in Tracker', tone: 'update', icon: <BriefcaseBusiness size={14} />,
        reason: item.when === 'Overdue'
          ? (dated
            ? 'Overdue, but it is their slot list — and Tuesday is the date you control least.'
            : 'Overdue, but it is their slot list — you cannot close it alone.')
          : (dated ? 'Tomorrow, and it keeps until the round is done.' : 'Tomorrow, not today.'),
        onSelect: () => go('/tracker'),
      })
    }
    add({
      id: 'opportunity', initials: juspay.initials, company: juspay.company, detail: `${juspay.preferenceMatch}% Preference Match`,
      when: juspay.posted, rank: 4,
      kicker: 'RANKED ROLE', ctaLabel: 'See why it fits', tone: 'role', icon: <Target size={14} />,
      reason: dated
        ? 'Strong fit, but a booked round outranks an open listing.'
        : 'Best fit you have, but nobody is waiting on you.',
      onSelect: () => go('/jobs/juspay'),
    })
  } else {
    // No inbox, so the queue is the rest of the ranked roles rather than live threads.
    for (const job of jobs.slice(1, 4)) {
      add({
        id: job.id, initials: job.initials, company: job.company, detail: `${job.preferenceMatch}% Preference Match`,
        when: job.salary, rank: 100 - job.preferenceMatch,
        kicker: 'RANKED ROLE', ctaLabel: 'See the match', tone: 'role', icon: <Target size={14} />,
        reason: job.reason,
        onSelect: () => go('/matches'),
      })
    }
  }

  rows.sort((a, b) => a.rank - b.rank)
  // Only the head of the queue can claim it goes next, which is what stops these
  // reasons from being interchangeable decoration.
  // Only the head of the queue can claim it goes next, which is what stops these
  // reasons from being interchangeable. It does not name the pick — the hero already
  // does, one card above.
  if (rows.length) rows[0] = { ...rows[0], reason: `Next in line. ${rows[0].reason}` }
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
 */
function carouselCards({ action, aside, journey }) {
  const cards = [{
    id: action.id,
    kind: 'pick',
    tone: action.tone,
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
    facts: action.facts,
    cta: action.cta,
    dismissable: action.id !== 'connect',
  }]

  for (const row of aside) {
    cards.push({
      id: row.id,
      kind: 'queued',
      tone: row.tone,
      icon: row.icon,
      kicker: row.kicker,
      when: row.when,
      company: { initials: row.initials, color: row.color, name: row.company },
      headline: row.detail,
      support: row.reason,
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
      icon: <Mail size={14} />,
      kicker: 'NEXT USEFUL CONNECTION',
      headline: 'Know what needs you—before an opportunity goes cold.',
      support: 'Connect the email you use to apply and AmbitionBox brings the recruiter moment that needs you here.',
      footnote: 'Job-search email only. Read only. Disconnect anytime.',
      cta: { label: 'Connect application email', onClick: () => go('/onboarding?step=email') },
      dismissable: false,
    })
  }

  return cards
}

function homeAnswer(journey, question) {
  const q = question.toLowerCase()

  if (q.includes('without my email') || q.includes('no email') || q.includes('what can you')) {
    return 'Plenty. Your reviewed profile and preferences already rank roles, explain pay and company reality, and show where your evidence is thin. What I cannot do is see the applications you send, so recruiter replies and interview invitations stay outside AmbitionBox until you connect that email.'
  }
  if (q.includes('in-hand') || q.includes('in hand') || q.includes('take home') || q.includes('take-home') || q.includes('monthly')) {
    // No take-home fixture exists anywhere in the prototype, and inventing tax maths
    // would be exactly the kind of confident wrong number this product exists to avoid.
    // Naming what is missing is the answer.
    return journey.offerDetected
      ? 'I will not invent a take-home figure. ₹28L is CTC, and ₹4.5L of it is not fixed pay—₹2.5L performance-linked and ₹2L a one-time joining bonus—so a monthly number depends on a fixed-pay split the letter does not give. Ask Juspay for that breakdown. What is already measurable: Bengaluru is estimated to cost about ₹13k more each month than Pune.'
      : 'No offer letter has arrived yet, so there is no CTC to break down. When one does, I separate fixed pay from variable and one-time components before any monthly figure—that split is usually where the number differs from what people expect.'
  }
  if (q.includes('paid fair') || q.includes('fairly') || q.includes('underpaid') || q.includes('paid enough')) {
    return journey.offerDetected
      ? `₹28L sits inside the published ${juspay.salary} band for this role and 87% above your current ${candidate.currentPay}. The honest caveat is that ₹4.5L of it is not fixed pay, so compare the fixed component before you call it settled.`
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
        <p>Connect the email you use to apply and AmbitionBox brings the recruiter moment that needs you here.</p>
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
        <strong>Ask AmbitionBox about your next move</strong>
        <small>{grounding}</small>
      </span>
      <Send size={16} />
    </button>
  )
}

function PromptChips({ prompts, onAsk, className = 'home-question-row' }) {
  return (
    <div className={className} aria-label="Suggested questions">
      {prompts.map(({ label, question }) => <button key={label} onClick={() => onAsk(question)}>{label}</button>)}
    </div>
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

/*
 * The assistant's mark is the AmbitionBox mark itself, not a sparkle. A sparkle is the
 * generic sign for "an AI did something", which context/UI.md rules out by name — and it
 * made the one permanent control on the screen look like every other product's.
 */
function AssistantMark({ className = 'assistant-mark' }) {
  return <img className={className} src="/favicon.svg" alt="" aria-hidden="true" />
}

// What the pill types out. Deliberately not the chip set — the chips sit right above it,
// and repeating them would show range twice instead of twice the range.
const ASK_EXAMPLES = [
  'What should I do first today?',
  'What will this interview cover?',
  'Is this offer worth taking?',
  'What is the pay range for this role?',
  'Where is my profile thin?',
]

function useTypewriter(phrases, enabled) {
  const [typed, setTyped] = useState('')
  const [phrase, setPhrase] = useState(0)
  const [erasing, setErasing] = useState(false)

  useEffect(() => {
    if (!enabled) return undefined
    const target = phrases[phrase % phrases.length]
    if (!erasing && typed === target) {
      const hold = setTimeout(() => setErasing(true), 2000)
      return () => clearTimeout(hold)
    }
    if (erasing && typed === '') {
      setErasing(false)
      setPhrase((current) => current + 1)
      return undefined
    }
    const step = setTimeout(
      () => setTyped(erasing ? target.slice(0, typed.length - 1) : target.slice(0, typed.length + 1)),
      erasing ? 20 : 48,
    )
    return () => clearTimeout(step)
  }, [typed, erasing, phrase, enabled, phrases])

  return typed
}

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
  const [dismissed, setDismissed] = useState([])
  const [menuFor, setMenuFor] = useState(null)

  const visible = cards.filter((card) => !dismissed.includes(card.id))

  // Local only, and deliberately so: nothing in `journey` records a dismissal, and
  // inventing persistence would claim a memory the prototype does not have.
  const dismiss = (id) => {
    setMenuFor(null)
    setDismissed((prev) => [...prev, id])
  }

  if (!visible.length) {
    return (
      <p className="carousel-empty page-pad">
        That is everything for now. Nothing in your search is waiting on you.
      </p>
    )
  }

  return (
    <>
      <div className="action-carousel" role="group" aria-label="What needs you, in order">
        <AnimatePresence initial={false}>
          {visible.map((card) => (
            <ActionCard
              key={card.id}
              card={card}
              reduceMotion={ctx.reduceMotion}
              menuOpen={menuFor === card.id}
              onMenu={() => setMenuFor(menuFor === card.id ? null : card.id)}
              onDismiss={() => dismiss(card.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}

/*
 * The pill types out example questions the way a search field cycles a placeholder. The
 * typed line is the placeholder and is hidden from assistive tech; the button keeps
 * "Ask AmbitionBox about your next move" as its accessible name, which is the contract
 * string and the thing a screen reader should hear. Under reduced motion the contract
 * string is what is drawn, immediately and without a caret.
 */
function AskPill({ ctx }) {
  const animate = !ctx.reduceMotion
  const typed = useTypewriter(ASK_EXAMPLES, animate)
  return (
    <button className="home-dock-ask" onClick={() => ctx.ask('')} aria-label="Ask AmbitionBox about your next move">
      <AssistantMark className="home-dock-mark" />
      {animate
        ? <span className="home-dock-typed" aria-hidden="true">{typed}<i /></span>
        : <span aria-hidden="true">Ask AmbitionBox about your next move</span>}
      <Send size={16} />
    </button>
  )
}

function ActionCard({ card, reduceMotion, menuOpen, onMenu, onDismiss }) {
  const duration = reduceMotion ? 0 : 0.32
  return (
    <motion.article
      className={`action-card action-card--${card.kind} action-card--${card.tone}`}
      layout={!reduceMotion}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration, ease: EASE }}
    >
      <div className="action-card-top">
        {/* Restrained category colour, kept inside the tile per context/UI.md. Coloured
            means something is happening to you; slate means it is yours to choose. */}
        <span className="action-card-mark">{card.icon}</span>
        <span className="action-card-kicker">{card.kicker}</span>
        {card.badge || (card.when && <span className="time-chip">{card.when}</span>)}
      </div>

      {card.company && (
        <div className="action-card-entity">
          <CompanyLogo initials={card.company.initials} color={card.company.color} />
          <span>
            <strong>{card.company.name}</strong>
            {card.company.detail && <small>{card.company.detail}</small>}
          </span>
        </div>
      )}

      <h2>{card.headline}</h2>
      {card.support && <p>{card.support}</p>}
      {card.facts && <div className="action-card-facts">{card.facts.map((fact) => <span key={fact}>{fact}</span>)}</div>}
      {card.footnote && <small className="action-card-note"><ShieldCheck size={12} /> {card.footnote}</small>}

      <div className="action-card-foot">
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
function capabilities({ journey }, sheets) {
  return [
    {
      id: 'roles', label: 'Find roles that fit me', hint: 'Ranked against the preferences you reviewed',
      icon: Search, onSelect: () => go('/matches'),
    },
    {
      id: 'company', label: 'Tell me what a company is really like', hint: 'Pay, ratings, work policy, and employee reviews',
      icon: Building2, onSelect: () => go('/jobs/juspay'),
    },
    {
      // "Close the evidence gap" would put "Close" in this row's accessible name,
      // colliding with every sheet's Close control.
      id: 'strengthen', label: 'Strengthen my application', hint: 'Fill the evidence gap and tailor your résumé',
      icon: FileText, onSelect: () => go('/assistant/juspay'),
    },
    {
      id: 'prep', label: 'Add or prepare an interview', hint: journey.interviewInvited ? 'Juspay · Tuesday 11:00' : 'Add an invite and I will decode the round',
      icon: UserRoundCheck, onSelect: () => (journey.interviewInvited ? go('/prep/juspay') : sheets.openAddInterview()),
    },
    {
      id: 'offer', label: 'Evaluate an offer', hint: journey.offerDetected ? '₹28L from Juspay' : 'Compare the letter with what is real',
      icon: CircleDollarSign, onSelect: () => (journey.offerDetected ? go('/offer/juspay?stage=decision&story=finale') : sheets.openOfferStart()),
    },
  ]
}

const DESIGNS = {
  current: HomeCurrent,
  answer: HomeAnswer,
  console: HomeConsole,
  composer: HomeComposer,
}


/*
 * The bottom cluster — MOB-HOME-001 (Cleo).
 *
 * The composer stopped being page content and became chrome: suggested questions,
 * the ask pill and the three tabs read as one quiet group sitting on the canvas,
 * rather than an input buried under the fold and a separate white shelf below it.
 * Ask is always reachable, from any scroll position and any state.
 *
 * The three legacy directions still render their own in-page composer, so the dock
 * carries the ask only when the design does not.
 */
function HomeChrome({ ctx, design }) {
  const askInPage = design !== 'current'
  return (
    <div className={`home-dock ${askInPage ? 'home-dock--nav-only' : ''}`}>
      {!askInPage && (
        <>
          {/* The grab handle is a real control, not a picture of one: it opens the
              assistant, the same place a swipe up would land. An affordance that does
              nothing is a lie the second someone tries it. */}
          <button className="home-dock-handle" onClick={() => ctx.ask('')} aria-label="Open AmbitionBox assistant">
            <i />
          </button>
          <PromptChips prompts={ctx.prompts} onAsk={ctx.ask} className="home-dock-chips" />
          <AskPill ctx={ctx} />
        </>
      )}
      <BottomNav active="home" />
    </div>
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
        {sheets.assistant && <HomeAssistantSheet journey={ctx.journey} grounding={ctx.grounding} prompts={ctx.prompts} initialQuestion={sheets.assistantQuestion} onClose={sheets.closeAssistant} index={capabilities(ctx, sheets)} />}
        {sheets.offerStart && <OfferStartSheet onClose={sheets.closeOfferStart} onUseDemo={sheets.useDemoOffer} />}
      </AnimatePresence>
    </main>
  )
}

// ---------------------------------------------------------------------------
// 6. SHEETS — shared by every design
// ---------------------------------------------------------------------------

function HomeAssistantSheet({ journey, grounding, prompts, initialQuestion, onClose, index }) {
  const [question, setQuestion] = useState(initialQuestion)
  const [asked, setAsked] = useState(Boolean(initialQuestion))
  const answer = useMemo(() => homeAnswer(journey, question), [journey, question])
  return <Sheet label="Ask AmbitionBox" onClose={onClose} wide className="home-assistant-sheet">
    <div className="home-assistant-mark"><AssistantMark className="home-assistant-mark-img" /></div>
    {/* The dock pill is one slim line, so the grounding — which changes with the state —
        is stated here, where the answer is actually about to be given. */}
    <h2>Ask AmbitionBox</h2><p className="sheet-lead">{grounding} Unknowns stay explicit.</p>
    <div className="home-assistant-suggestions">{prompts.map(({ question: item }) => <button key={item} onClick={() => { setQuestion(item); setAsked(true) }}>{item}</button>)}</div>
    <form className="home-assistant-composer" onSubmit={(event) => { event.preventDefault(); if (question.trim()) setAsked(true) }}><input aria-label="Ask AmbitionBox" value={question} onChange={(event) => { setQuestion(event.target.value); setAsked(false) }} placeholder="Ask about your next move" /><button aria-label="Send question" disabled={!question.trim()}><Send size={16} /></button></form>
    {index && !asked && (
      <div className="capability-index">
        <span className="composer-label">AmbitionBox can also</span>
        <div className="capability-list">
          {index.map(({ id, label, hint, icon: Icon, onSelect }) => (
            <button key={id} onClick={() => { onClose(); onSelect() }}>
              <span className="capability-icon"><Icon size={16} /></span>
              <span className="capability-copy"><strong>{label}</strong><small>{hint}</small></span>
              <ChevronRight size={15} />
            </button>
          ))}
        </div>
      </div>
    )}
    {asked && <motion.div className="home-assistant-answer" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><span>Based on your current context</span><p>{answer}</p><small><ShieldCheck size={13} /> Nothing is sent or changed automatically.</small></motion.div>}
  </Sheet>
}

function OfferStartSheet({ onClose, onUseDemo }) {
  return <Sheet label="Evaluate an offer" onClose={onClose} wide><Pill tone="soft">OFFER DECISION</Pill><h2>Bring an offer into context.</h2><p className="sheet-lead">AmbitionBox can compare the letter with salary evidence, employee reviews, your preferences, and what a move changes.</p><div className="permission-list"><div><FileCheck2 size={18} /><span><strong>Review the offer facts</strong><small>Pay, role, location, work policy, and unknowns.</small></span></div><div><ShieldCheck size={18} /><span><strong>You stay in control</strong><small>Nothing is accepted or sent automatically.</small></span></div></div><button className="primary-button" onClick={onUseDemo}>Use demo Juspay offer <ArrowRight size={17} /></button><p className="fine-print">Deterministic simulation—no real document is uploaded.</p></Sheet>
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
