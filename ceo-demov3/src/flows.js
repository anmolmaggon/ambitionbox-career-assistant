import { applications, candidate, interviewIntel, juspay, offer } from './data'

/*
 * The flow scripts.
 *
 * Every Home card opens one of these. They are threads rather than screens because the
 * work is a conversation with a shape: North says what it found, shows the artifact,
 * asks the one thing it cannot know, and hands back something the user can use. A form
 * would ask everything up front; a chat with no UI elements would make the user type
 * what a chip can answer. These are neither.
 *
 * A step is one turn. `from: 'north'` is the agent speaking, `from: 'you'` is the user's
 * answer echoed back into the thread. Steps whose `type` needs an answer stop the thread
 * until one arrives; everything else reveals on a timer so the thread reads as it builds.
 *
 * `text` and `items` may be functions of the answers so far, which is how a later turn
 * quotes an earlier one. `when` skips a step the answers made irrelevant.
 *
 * THE CONTEXT GAP. Every flow has exactly one moment where North says what it does not
 * know and asks for it — the notice period, the slot, how the round actually went. That
 * is the honest version of an agent: it does the work it can and names the gap rather
 * than inventing across it. Pranoy's instruction 2026-09-10, "assistant asks if anything
 * is missing to fill gaps", inside the flows rather than as a card on Home.
 */

const byId = (id) => applications.find((item) => item.id === id) || {}

/* ---- 1 · A recruiter is waiting on a reply --------------------------------- */

function replyFlow(app) {
  return [
    {
      id: 'found', from: 'north', type: 'message',
      text: `${app.company} replied ${app.movedAgo}. I moved it up because a warm thread cools fast.`,
    },
    {
      id: 'quote', from: 'north', type: 'quote',
      quote: app.quote,
      sender: app.recruiter,
      meta: 'Gmail · 2 hours ago',
    },
    {
      id: 'gap', from: 'north', type: 'choice', gap: true,
      text: 'I can draft the reply. One thing I do not have from your profile — what notice period should I say?',
      key: 'notice',
      options: ['30 days', '60 days', '90 days', 'Leave it out'],
    },
    {
      id: 'drafting', from: 'north', type: 'thinking',
      text: 'Writing it against the thread and your profile',
    },
    {
      id: 'draft', from: 'north', type: 'draft',
      title: 'Ready to send',
      text: (answers) => [
        'Hi Sneha,',
        '',
        `Thanks for reaching out — I would be glad to talk. I am a backend engineer at ${candidate.company} with six years on payments infrastructure, which lines up closely with the role.`,
        '',
        answers.notice && answers.notice !== 'Leave it out'
          ? `I am available for a call Tuesday or Wednesday afternoon this week. My notice period is ${answers.notice.toLowerCase()}.`
          : 'I am available for a call Tuesday or Wednesday afternoon this week.',
        '',
        'Best,',
        candidate.firstName,
      ].filter((line) => line !== undefined).join('\n'),
      note: 'Review it before you send. North never sends on your behalf.',
    },
    {
      id: 'done', from: 'north', type: 'actions',
      text: 'Once it goes out I will watch the thread and move the card when they answer.',
      options: [
        { label: 'Copy and open Gmail', primary: true, result: 'sent' },
        { label: 'I will do it later', result: 'later' },
      ],
    },
  ]
}

/* ---- 2 · A round is booked, or the slot still is not ----------------------- */

function prepFlow(app) {
  const slots = ['Mon 15 Sep · 11:00', 'Tue 16 Sep · 15:30', 'Thu 18 Sep · 10:00']
  return [
    {
      id: 'found', from: 'north', type: 'message',
      text: `${app.when} by ${app.company}, and none is picked yet. That is the only thing standing between you and a booked round.`,
    },
    {
      id: 'detail', from: 'north', type: 'detail',
      title: `${app.company} · ${app.role}`,
      rows: [
        ['Round', app.interview?.round],
        ['Format', app.interview?.mode],
        ['Length', app.interview?.duration],
        ['Interviewer', app.interview?.interviewer],
      ].filter(([, value]) => value),
    },
    {
      id: 'gap', from: 'north', type: 'choice', gap: true,
      text: 'Your calendar is not connected, so I cannot tell which of these is free. Which one works?',
      key: 'slot',
      options: slots,
    },
    {
      id: 'confirming', from: 'north', type: 'thinking',
      text: 'Building your prep against the role',
    },
    {
      id: 'plan', from: 'north', type: 'list',
      title: (answers) => `Booked for ${answers.slot}. Here is what to expect.`,
      items: [
        { label: 'Distributed systems design', meta: 'Named in 11 of 14 reports for this role', tone: 'warn' },
        { label: 'Scale and throughput numbers', meta: 'Your weakest evidence — no volume figures in your profile', tone: 'warn' },
        { label: 'Payments domain depth', meta: 'Your strongest ground. Six years of it', tone: 'ok' },
        { label: 'Code review and mentoring', meta: 'Evidenced in your profile', tone: 'ok' },
      ],
      source: 'From 63 interview reports on AmbitionBox and your reviewed profile',
    },
    {
      id: 'done', from: 'north', type: 'actions',
      text: 'I will remind you the evening before, and ask how it went the day after.',
      options: [
        { label: 'Start prep', primary: true, result: 'prep' },
        { label: 'Just book it for now', result: 'booked' },
      ],
    },
  ]
}

/* ---- 3 · The round happened and nothing in an inbox reports how it went ---- */

function debriefFlow(app) {
  return [
    {
      id: 'found', from: 'north', type: 'message',
      text: `Your ${app.company} round was ${app.when.replace('Interviewed ', '')}. ${app.interview?.round} with ${app.interview?.interviewer?.split(' · ')[0]}.`,
    },
    {
      id: 'outcome', from: 'north', type: 'choice', gap: true,
      text: 'No email reports how a round actually went, so this part only you can tell me. How did it go?',
      key: 'outcome',
      options: ['Went well', 'Hard to read', 'Did not go well'],
    },
    {
      id: 'topics', from: 'north', type: 'choice', multi: true,
      text: 'Which of these came up? I will prepare you on them before the next round.',
      key: 'topics',
      options: ['System design', 'Scale and throughput', 'Payments domain', 'Behavioural', 'Live coding', 'Team fit'],
    },
    {
      id: 'note', from: 'north', type: 'input',
      text: 'Anything you want to remember about it? One line is plenty.',
      key: 'note',
      placeholder: 'e.g. Went deep on idempotency. Should have led with the ledger rewrite.',
    },
    {
      id: 'filing', from: 'north', type: 'thinking',
      text: 'Filing it against the role',
    },
    {
      id: 'verdict', from: 'north', type: 'verdict',
      title: (answers) => ({
        'Went well': 'Logged. Round 3 is where this gets decided.',
        'Hard to read': 'Logged. Hard to read is normal at this stage.',
        'Did not go well': 'Logged. That is useful, not fatal.',
      }[answers.outcome] || 'Logged.'),
      text: (answers) => {
        const topics = (answers.topics || []).length
          ? (answers.topics || []).slice(0, 2).join(' and ').toLowerCase()
          : 'the areas from your last round'
        return `I have added ${topics} to your prep for the next round, and to the 63 reports other candidates read before this interview.`
      },
    },
    {
      id: 'done', from: 'north', type: 'actions',
      text: 'The card stays where it is until Paytm say something. If they go quiet for ten days I will bring it back.',
      options: [
        { label: 'Prepare me for Round 3', primary: true, result: 'prep' },
        { label: 'Done for now', result: 'done' },
      ],
    },
  ]
}

/* ---- 4 · A rejection, and what is worth taking from it --------------------- */

function rejectionFlow(app) {
  return [
    {
      id: 'found', from: 'north', type: 'message',
      text: `${app.company} closed ${app.when}. You reached ${app.reachedRound?.toLowerCase() || 'the final round'}, which is further than most.`,
    },
    {
      id: 'quote', from: 'north', type: 'quote',
      quote: 'After careful consideration we have decided to move forward with another candidate for this role.',
      sender: `Talent team · ${app.company}`,
      meta: `Gmail · ${app.when}`,
    },
    {
      id: 'reasons', from: 'north', type: 'list',
      title: 'Rejection emails never say why. Here is what I can line up against it.',
      items: [
        { label: 'System-design ownership', meta: 'Named in your debrief as the hard part. Also the gap on your profile', tone: 'warn' },
        { label: 'Java in production', meta: 'The role asked for 3+ years. You confirmed you have none', tone: 'bad' },
        { label: 'Level', meta: 'You were the only candidate at 6 years for a 7–10 band', tone: 'neutral' },
      ],
      source: 'Example reasoning — the real version reads your debrief, the role requirements, and your profile gaps',
    },
    {
      id: 'gap', from: 'north', type: 'choice', gap: true,
      text: 'You were in the room and I was not. Does that match what you felt?',
      key: 'agree',
      options: ['That tracks', 'Partly', 'Not it at all'],
    },
    {
      id: 'thinking', from: 'north', type: 'thinking',
      text: 'Re-ranking your roles against that',
    },
    {
      id: 'verdict', from: 'north', type: 'verdict',
      title: 'Three roles where this matters less.',
      text: (answers) => answers.agree === 'Not it at all'
        ? 'I have dropped that reasoning. On level alone, these three sit inside your band rather than above it.'
        : 'All three are Go-heavy payments teams inside your experience band, so the Java gap and the level stretch both stop applying.',
    },
    {
      id: 'done', from: 'north', type: 'actions',
      text: 'Navi stays in your Tracker as a record. Nothing else to do here.',
      options: [
        { label: 'Show me those three', primary: true, result: 'jobs' },
        { label: 'Close', result: 'done' },
      ],
    },
  ]
}

/* ---- 5 · An application that has gone quiet -------------------------------- */

function ghostedFlow(app) {
  const fromInterview = app.ghostedFrom === 'interviewed'
  const alreadyChased = Boolean(app.followedUpAgo)
  return [
    {
      id: 'found', from: 'north', type: 'message',
      text: alreadyChased
        ? `You followed up with ${app.company} ${app.followedUpAgo} days ago and it is still quiet. That is ${app.silentDays} days in total.`
        : fromInterview
          ? `You sat ${app.interview?.round?.toLowerCase()} with ${app.company} ${app.silentDays} days ago and heard nothing since. Ten days is where I stop calling it normal.`
          : `${app.company} has been quiet for ${app.silentDays} days. Past forty-five, waiting is not a strategy.`,
    },
    {
      id: 'timeline', from: 'north', type: 'timeline',
      items: fromInterview
        ? [
          { label: 'Applied', meta: app.appliedAgo, done: true },
          { label: app.interview?.round || 'Interview', meta: `${app.silentDays}d ago`, done: true },
          { label: 'Nothing since', meta: `${app.silentDays} days`, quiet: true },
        ]
        : [
          { label: 'Applied', meta: app.appliedAgo, done: true },
          ...(alreadyChased ? [{ label: 'You followed up', meta: `${app.followedUpAgo}d ago`, done: true }] : []),
          { label: 'No reply', meta: `${app.silentDays} days`, quiet: true },
        ],
    },
    {
      id: 'gap', from: 'north', type: 'choice', gap: true,
      text: alreadyChased
        ? 'Your call on this one. Do you still want it?'
        : 'How do you want this to read?',
      key: 'tone',
      options: alreadyChased
        ? ['Still want it', 'Close it', 'Give it two more weeks']
        : ['Warm and short', 'Direct', 'Ask for a decision'],
    },
    {
      id: 'writing', from: 'north', type: 'thinking',
      text: 'Writing it',
      when: (answers) => answers.tone !== 'Close it',
    },
    {
      id: 'draft', from: 'north', type: 'draft',
      title: 'A note you can send',
      when: (answers) => answers.tone !== 'Close it',
      text: (answers) => {
        const direct = answers.tone === 'Direct' || answers.tone === 'Ask for a decision'
        if (fromInterview) {
          return [
            'Hi Anita,',
            '',
            `Following up on my ${app.interview?.round?.toLowerCase()} on ${app.silentDays === 14 ? '27 August' : 'the date we spoke'}. I enjoyed the conversation about the ledger design and I remain very interested in the role.`,
            '',
            direct
              ? 'Could you let me know where the process stands, and whether a decision is likely this month?'
              : 'Is there an update you can share on where things stand?',
            '',
            'Best,',
            candidate.firstName,
          ].join('\n')
        }
        return [
          'Hi there,',
          '',
          `I applied for the ${app.role} role ${app.appliedAgo.replace(' ago', '')} back and wanted to check in. I am still very interested — my background is six years of backend work on payments systems, which maps closely to the role.`,
          '',
          direct
            ? 'Is the position still open, and is my application still under consideration?'
            : 'Happy to share anything else that would help.',
          '',
          'Best,',
          candidate.firstName,
        ].join('\n')
      },
      note: 'Review it before you send. North never sends on your behalf.',
    },
    {
      id: 'done', from: 'north', type: 'actions',
      text: (answers) => answers.tone === 'Close it'
        ? 'Closing it moves the card to Rejected with a note that you closed it, not them.'
        : 'Send it and I will reset the clock. Fourteen more days of nothing and I will offer to close it.',
      options: (answers) => answers.tone === 'Close it'
        ? [{ label: 'Close the application', primary: true, result: 'closed' }, { label: 'Keep it open', result: 'done' }]
        : [
          { label: 'Copy and mark as sent', primary: true, result: 'sent' },
          { label: 'Close this one instead', result: 'closed' },
        ],
    },
  ]
}

/* ---- 6 · An offer, and what it is actually worth --------------------------- */

function offerFlow() {
  return [
    {
      id: 'found', from: 'north', type: 'message',
      text: `${juspay.company} sent the letter this morning. Before you answer anything, here is what is in it.`,
    },
    {
      id: 'figure', from: 'north', type: 'figure',
      value: offer.total,
      label: 'Total compensation',
      rows: [
        ['Fixed', offer.fixed],
        ['Variable', offer.variable],
        ['Against your current', offer.currentDelta],
      ],
    },
    {
      id: 'market', from: 'north', type: 'list',
      title: 'How it sits against the market.',
      items: [
        { label: `Market band for this role: ${offer.market}`, meta: 'From 212 employee-reported salaries at Juspay', tone: 'ok' },
        { label: 'Your offer is inside the band, below the midpoint', meta: 'There is room, and it is in the fixed component', tone: 'warn' },
      ],
      source: 'AmbitionBox salary data',
    },
    {
      id: 'gap', from: 'north', type: 'choice', gap: true,
      text: 'I can read the numbers but not what you want from the move. What matters most here?',
      key: 'priority',
      options: ['The money', 'The work', 'Speed of joining', 'Stability'],
    },
    {
      id: 'thinking', from: 'north', type: 'thinking',
      text: 'Putting the case together',
    },
    {
      id: 'verdict', from: 'north', type: 'verdict',
      title: (answers) => answers.priority === 'The money'
        ? 'There is a case for asking, and it is a narrow one.'
        : 'Worth asking, but not worth risking.',
      text: (answers) => answers.priority === 'The money'
        ? 'Ask for the fixed component to move to ₹26L, citing the band and your payments depth. Leave the variable alone — it is standard here and arguing it reads as inexperience.'
        : `Take the offer. On ${(answers.priority || 'the work').toLowerCase()} this is the strongest thing in your pipeline, and a fixed-pay ask risks two weeks you do not need to spend.`,
    },
    {
      id: 'done', from: 'north', type: 'actions',
      text: 'Whatever you decide, you send it. North will never negotiate or accept on your behalf.',
      options: [
        { label: 'Draft the negotiation note', primary: true, result: 'negotiate' },
        { label: 'Open the full breakdown', result: 'offer' },
      ],
    },
  ]
}

/* --------------------------------------------------------------------------- */

const BUILDERS = {
  reply: replyFlow,
  prep: prepFlow,
  debrief: debriefFlow,
  rejection: rejectionFlow,
  ghosted: ghostedFlow,
  offer: offerFlow,
}

export const flowMeta = {
  reply: { kicker: 'RECRUITER REPLY', title: 'Reply to the recruiter' },
  prep: { kicker: 'INTERVIEW', title: 'Book it and prepare' },
  debrief: { kicker: 'AFTER THE ROUND', title: 'How did it go?' },
  rejection: { kicker: 'NOT SELECTED', title: 'What to take from it' },
  ghosted: { kicker: 'GONE QUIET', title: 'Chase it, or close it' },
  offer: { kicker: 'OFFER', title: 'What the letter is worth' },
}

/*
 * `application` is the id from the Home card. The offer flow is the golden path's and
 * runs off the Juspay fixtures rather than a Tracker row, so it takes no application.
 */
export function buildFlow(type, applicationId) {
  const build = BUILDERS[type]
  if (!build) return null
  const app = applicationId ? byId(applicationId) : {}
  if (type !== 'offer' && !app.id) return null
  return { steps: build(app), app, meta: flowMeta[type] }
}

export { interviewIntel }
