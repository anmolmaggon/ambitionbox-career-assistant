import { applications, candidate, interviewIntel, juspay, offer, offeredSlots, roundHistory, roundIntel } from './data'

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

/*
 * The golden path's interview is Juspay's, and it has never lived in `applications` — it
 * is assembled in TrackerScreen from `interviewIntel`. A flow opened on it builds the same
 * record from the same fixture rather than duplicating one into the applications list.
 */
function juspayInterview() {
  return {
    id: 'juspay', company: juspay.company, role: juspay.role, initials: juspay.initials,
    stage: 'interview', phase: 'post', source: 'Gmail',
    when: `Interviewed ${interviewIntel.invitation.day.split(',')[0]}`,
    appliedAgo: '18d ago',
    interview: {
      round: `Round 1 of ${interviewIntel.loop.total}`,
      mode: interviewIntel.invitation.mode,
      duration: interviewIntel.invitation.duration,
      interviewer: `${interviewIntel.invitation.with} · Engineering`,
    },
    interviewedAgo: 1,
  }
}

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

/* ---- 2 · Before the round ---------------------------------------------------
 *
 * The holistic version, rebuilt 2026-09-10 on Pranoy's instruction. The order is the point:
 * North shows the invitation, then says what the invitation does not say, then fills that
 * gap from reports, then names where the user actually stands. Booking the slot sits in
 * the middle rather than at the start, because nobody picks a time well before they know
 * what they are picking a time for.
 */

function prepFlow(app, booked) {
  const intel = roundIntel[app.id]
  const slots = offeredSlots
  const named = app.interview?.interviewer && !/not named/i.test(app.interview.interviewer)

  /*
   * WHICH ROUND IS THIS — the fallback chain, owner's instruction 2026-09-11.
   *
   * Three sources, in descending confidence, and the flow says which one it used:
   *
   *   1. `interview.round` — we know it. North states it and attributes it, because the
   *      invitation itself never numbers the round; knowing it is inference, not reading.
   *   2. the interview reports — the email is silent and so is the record, so North works
   *      from what the reports have in common and says the round is unnumbered.
   *   3. nothing — North asks. A guess dressed as a finding is the one thing this flow
   *      cannot afford, because everything after it is built on which round this is.
   *
   * This also removes a contradiction that was live until today: `unknowns` claimed
   * "Which of the five rounds this one is" while the two steps below it printed
   * "Round 1 of 5" twice. North cannot say it does not know a thing and then say it.
   */
  const knownRound = app.interview?.round
  const roundSource = knownRound ? 'known' : (intel ? 'inferred' : 'ask')
  // Drop any "which round" unknown the application actually answers.
  const unknowns = (intel?.unknowns || ['What this round covers'])
    .filter((label) => !(knownRound && /which .*round/i.test(label)))
  return [
    /*
     * The user speaks first when the slot came from the Home card — they chose it, so the
     * thread opens with them saying so and North answering. North announcing the choice
     * back to the person who made it reads as a receipt, not a conversation.
     */
    {
      id: 'you-slot', from: 'you', type: 'said', text: booked,
      when: () => Boolean(booked),
    },
    {
      id: 'found', from: 'north', type: 'message',
      /*
       * Path A — the user tapped a slot on the Home card. North acknowledges the choice
       * and nothing more: it has not booked anything and says so, because it cannot. The
       * calendar is not connected, which is the same reason the slot had to be offered as
       * a question rather than read off a calendar in the first place.
       */
      text: booked
        // The user's own bubble states the slot directly above this, so North does not
        // repeat it — the one thing COPY.md rules out is the same context twice in
        // adjacent elements.
        ? `Noted. I cannot see your calendar, so you confirm it with ${app.company} yourself.`
        : `${app.when} by ${app.company}, and none is picked yet. Before you choose, here is everything I have on this round.`,
    },
    /*
     * Committing in one tap is only fair if one tap can undo it. Without this the other
     * two slots are gone for good, because the flow skips the question it would have
     * asked. Answering "Pick a different slot" puts that question back, below.
     */
    {
      id: 'confirm', from: 'north', type: 'choice', gap: true,
      text: 'Before I build your prep around it, is that the one you want?',
      key: 'confirm',
      options: ['That is the one', 'Pick a different slot'],
      when: () => Boolean(booked),
    },
    {
      id: 'invite', from: 'north', type: 'quote',
      when: (answers) => !booked || answers.confirm === 'Pick a different slot',
      quote: `We would like to invite you to a ${app.interview?.duration || '45 minute'} conversation for the ${app.role} role. Please pick a slot that works for you.`,
      sender: `Talent team · ${app.company}`,
      // `app.when` is the card's line ("Slots offered 3d ago"); lowercased into a byline it
      // read as "Gmail · slots offered 3d ago". The byline only owes the channel and when.
      meta: `Gmail · ${(app.when.match(/\d+[dhm] ago/) || ['recently'])[0]}`,
    },
    {
      /*
       * The most useful thing North can say here, and the least flattering to the sender:
       * the invitation is almost content-free. Naming that is what earns the next step,
       * because everything after it is North filling a gap the user can see for themselves.
       */
      id: 'unknowns', from: 'north', type: 'list',
      // "That is the whole email" only works directly under the quoted email. On a booked
      // round the quote is gone, so the line has to stand on its own.
      /*
       * "That is the whole email" only works directly under the quoted email. The quote is
       * hidden on a booked round — but it comes back when the user reopens the choice, so
       * this title has to follow the same condition the quote does, not `booked` alone.
       */
      title: (answers) => (booked && answers.confirm !== 'Pick a different slot'
        ? 'What their email still does not tell you.'
        : 'That is the whole email. Here is what it does not tell you.'),
      items: unknowns.map((label) => ({ label, meta: 'Not stated anywhere in the thread', tone: 'neutral' })),
      when: () => unknowns.length > 0,
    },
    /*
     * How North knows which round this is. It sits between the unknowns and the briefing
     * because everything below is built on the answer, and a reader who has just been told
     * what the email does not say deserves to know where the next claim came from.
     */
    {
      id: 'round-source', from: 'north', type: 'message',
      text: roundSource === 'known'
        ? `Their email does not number the round. From the loop ${app.company} runs for this role, this is ${knownRound}.`
        : 'Their email does not number the round, and I cannot pin it down from the thread. I will work from what every round in this loop has in common.',
      when: () => roundSource !== 'ask',
    },
    /*
     * Source three: ask. Reached only when there is no round on the application and no
     * reports to reason from, and it is the honest end of the chain rather than a failure.
     */
    {
      id: 'round-ask', from: 'north', type: 'choice', gap: true,
      text: 'One thing I cannot work out, and it changes everything below: which round is this?',
      key: 'round',
      options: ['The first one', 'A middle round', 'The final round', 'I do not know either'],
      when: () => roundSource === 'ask',
    },
    {
      id: 'reading', from: 'north', type: 'thinking',
      text: intel ? `Reading ${intel.reports} interview reports for this role` : 'Reading what candidates reported',
      when: () => Boolean(intel),
    },
    {
      id: 'covers', from: 'north', type: 'list',
      title: (answers) => {
        if (knownRound) return `What ${knownRound.split(' of ')[0]} actually covers here.`
        const said = answers.round
        if (said === 'The first one') return 'What a first round covers here.'
        if (said === 'The final round') return 'What a final round covers here.'
        return 'What these rounds cover here.'
      },
      items: intel?.covers || [],
      source: intel ? `From ${intel.reports} reports · ${intel.scope}` : undefined,
      when: () => Boolean(intel?.covers?.length),
    },
    {
      id: 'who', from: 'north', type: 'detail',
      title: named ? 'Who you are meeting' : 'The round itself',
      rows: [
        ['Round', app.interview?.round],
        ['Format', app.interview?.mode],
        ['Length', app.interview?.duration],
        // Naming an unknown as unknown, rather than leaving the row out, is what stops the
        // absence reading as an oversight.
        ['Interviewer', named ? app.interview.interviewer : 'Not named in the invitation'],
      ].filter(([, value]) => value),
    },
    {
      id: 'gap', from: 'north', type: 'choice', gap: true,
      when: (answers) => !booked || answers.confirm === 'Pick a different slot',
      text: 'Your calendar is not connected, so the one thing I cannot work out is which of these is free. Which works?',
      key: 'slot',
      options: slots,
    },
    {
      id: 'building', from: 'north', type: 'thinking',
      text: 'Putting your prep against it',
    },
    {
      id: 'stand', from: 'north', type: 'list',
      title: 'Where you stand against it.',
      items: intel?.stand?.length ? intel.stand : [
        { label: 'Payments and distributed systems', meta: 'Six years, and your strongest ground', tone: 'ok' },
        { label: 'Scale and throughput numbers', meta: 'Nothing in your profile puts figures to it', tone: 'warn' },
      ],
      source: 'Against your reviewed profile',
    },
    {
      id: 'verdict', from: 'north', type: 'verdict',
      title: (answers) => `Booked for ${answers.slot || booked}.`,
      text: (answers) => {
        const weak = (intel?.stand || []).find((row) => row.tone === 'warn')
        return weak
          ? `Two hours on ${weak.label.toLowerCase()} buys you more than anything else here. I will put the rest in front of you the evening before.`
          : 'I will put the whole briefing in front of you the evening before, and ask how it went the day after.'
      },
    },
    /*
     * The briefing option is Juspay's alone, because the briefing screen is. `/prep/juspay`
     * is the only prep route in App.jsx and `PrepScreen` reads Juspay's `interviewIntel`
     * directly, so offering it on the Google card sent the user to another company's
     * interview prep. Offering a door that opens onto the wrong room is worse than not
     * offering it: everything this flow has just said about Google is contradicted by the
     * screen behind the button.
     */
    {
      id: 'done', from: 'north', type: 'actions',
      text: 'Nothing is on your calendar yet — you confirm the slot with them.',
      options: booked
        ? [{ label: 'Got it', primary: true, result: 'booked' }]
        : app.id === 'juspay'
        ? [
            { label: 'Open the full briefing', primary: true, result: 'prep' },
            { label: 'Just save the slot', result: 'booked' },
          ]
        : [{ label: 'Save the slot', primary: true, result: 'booked' }],
    },
  ]
}

/* ---- 3 · After the round ----------------------------------------------------
 *
 * Rebuilt 2026-09-10. The old version was three questions in a row, which is a form with
 * speech bubbles around it. This one answers back: every question North asks is followed
 * by North reacting to what it just heard, and the question after that is built from the
 * answer before it. That is the difference between a conversation and a survey.
 *
 * The order is deliberate. The outcome comes first because it is the part that serves the
 * user — their Tracker is stale until they say. What North wants, the questions that came
 * up, is second. A contribution is never the price of entry.
 */

function debriefFlow(app) {
  const intel = roundIntel[app.id]
  const who = app.interview?.interviewer?.split(' · ')[0]
  const round = app.interview?.round || 'your round'

  /* How often a topic has come up across the rounds the user has already logged. This is
   * the only way North can say "three of your last four" without inventing the count. */
  const seenBefore = (topic) => roundHistory.filter((entry) => entry.topics.includes(topic)).length

  return [
    {
      id: 'found', from: 'north', type: 'message',
      text: `${round} at ${app.company} was two days ago${who ? `, with ${who}` : ''}. Nothing in your inbox says how it went, so this part is yours.`,
    },
    {
      id: 'outcome', from: 'north', type: 'choice', gap: true,
      text: 'Start with the honest version. How did it go?',
      key: 'outcome',
      options: ['Went well', 'Hard to read', 'Did not go well'],
    },
    {
      /* North answers before it asks again. Without this the thread is a form. */
      id: 'react-outcome', from: 'north', type: 'message',
      text: (answers) => ({
        'Went well': 'Good. Let me get the details down while they are still sharp.',
        'Hard to read': 'That is the most common answer I get, and it usually means less than it feels like. Interviewers are trained not to give it away.',
        'Did not go well': 'Noted, and it is worth capturing properly. A round that went badly is the one you learn most from, as long as you write it down while you still remember it.',
      }[answers.outcome] || 'Noted.'),
    },
    {
      id: 'topics', from: 'north', type: 'choice', multi: true,
      text: 'What did they actually spend time on?',
      key: 'topics',
      options: ['System design', 'Coding', 'Scale and throughput', 'Payments domain', 'Past projects', 'Team and ownership'],
    },
    {
      id: 'react-topics', from: 'north', type: 'message',
      text: (answers) => {
        const picked = answers.topics || []
        const repeat = picked.find((topic) => seenBefore(topic) >= 2)
        if (repeat) {
          return `${repeat} again. That is ${seenBefore(repeat) + 1} of your last ${roundHistory.length + 1} rounds — it is the thing standing between you and the next level, not a coincidence.`
        }
        if (intel?.covers?.length && picked.length) {
          return `That lines up with what ${app.company} candidates reported, so nothing here surprised the room.`
        }
        return 'Logged against the role.'
      },
    },
    {
      /*
       * Built from the previous answer. Asking "what did you struggle with" in the
       * abstract gets a shrug; asking it against the three things they just named gets a
       * real answer, and it is one tap.
       */
      id: 'stuck', from: 'north', type: 'choice',
      text: 'Anything you would want back?',
      key: 'stuck',
      options: (answers) => [...(answers.topics || []).slice(0, 4), 'Nothing I would change'],
    },
    {
      id: 'react-stuck', from: 'north', type: 'message',
      text: (answers) => (answers.stuck === 'Nothing I would change'
        ? 'Then you have nothing to fix and everything to wait for.'
        : `Then ${answers.stuck.toLowerCase()} is what we work on before the next one. I will build the prep around it rather than around the whole role.`),
    },
    {
      id: 'note', from: 'north', type: 'input',
      text: 'Anything you want to remember, in your own words? One line is plenty.',
      key: 'note',
      placeholder: 'e.g. Went deep on idempotency. Should have led with the ledger rewrite.',
    },
    {
      /*
       * The timing question does real work: the answer sets when this application starts
       * counting as ghosted. Without it the 14-day rule runs off a date nobody agreed to.
       */
      id: 'timing', from: 'north', type: 'choice',
      text: 'Last one. Did they say when you would hear back?',
      key: 'timing',
      options: ['This week', 'Next week', 'They did not say'],
    },
    {
      id: 'filing', from: 'north', type: 'thinking',
      text: 'Filing it against the role',
    },
    {
      id: 'verdict', from: 'north', type: 'verdict',
      title: (answers) => ({
        'Went well': `Logged. ${app.company} is now the furthest along in your search.`,
        'Hard to read': 'Logged. Hard to read is not a bad sign at this stage.',
        'Did not go well': 'Logged. Useful, not fatal.',
      }[answers.outcome] || 'Logged.'),
      text: (answers) => {
        const chase = {
          'This week': 'If Friday passes with nothing, I will bring it back with a note already written.',
          'Next week': 'I will hold it quietly and raise it if next week ends in silence.',
          'They did not say': 'No date means the 14-day clock starts today. If it runs out I will bring it back with a note already written.',
        }[answers.timing] || 'I will watch the thread.'
        const prep = answers.stuck && answers.stuck !== 'Nothing I would change'
          ? ` Your next round's prep now leads with ${answers.stuck.toLowerCase()}.`
          : ''
        return chase + prep
      },
    },
    {
      id: 'done', from: 'north', type: 'actions',
      text: 'What you wrote stays yours. The topics join the reports the next candidate reads.',
      options: [
        { label: 'See what changes next', primary: true, result: 'prep' },
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
      // Matches the card, which stopped saying "closed" on 2026-09-11. The thread opens
      // where the card left off, and "further than most people who applied" stays because
      // it is the one comfort here that is a fact rather than a sentiment.
      text: `${app.company} went with someone else, ${app.when}. You made it to ${app.reachedRound?.toLowerCase() || 'the final round'} — further than most people who applied.`,
    },
    {
      id: 'quote', from: 'north', type: 'quote',
      quote: 'After careful consideration we have decided to move forward with another candidate for this role.',
      sender: `Talent team · ${app.company}`,
      meta: `Gmail · ${app.when}`,
    },
    {
      id: 'reasons', from: 'north', type: 'list',
      title: 'Their email will not say why. Here is what I can line up against it.',
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
      title: 'Three roles where this matters less — and one live decision.',
      text: (answers) => answers.agree === 'Not it at all'
        ? 'I have dropped that reasoning. On level alone, these three sit inside your band rather than above it.'
        : 'All three are Go-heavy payments teams inside your experience band, so the Java gap and the level stretch both stop applying.',
    },
    {
      id: 'done', from: 'north', type: 'actions',
      text: 'Navi stays in your Tracker as a record. The useful part is what it changes about Paytm.',
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

/*
 * Follow-ups: what the user can ask once North has said its piece, and what it answers.
 *
 * THE CHIPS ARE THE QUESTIONS NORTH CAN ACTUALLY ANSWER. That is the whole selection
 * rule. A suggestion chip is a promise, and one that lands on a shrug is worse than no
 * chip at all — so every one of these resolves against a real fixture, and anything
 * outside the set gets an honest miss rather than a guess.
 *
 * `match` is what a typed question has to contain for the same answer to fire, so
 * tapping and typing reach the same place.
 */
const FOLLOW_UPS = {
  prep: (app) => {
    const intel = roundIntel[app.id]
    const weak = (intel?.stand || []).find((row) => row.tone === 'warn')
    return [
      {
        label: 'What do I revise first?',
        match: ['revise', 'study', 'prepare first', 'focus'],
        answer: {
          type: 'verdict',
          title: weak ? weak.label : 'Start with the round, not the role.',
          text: weak
            ? `${weak.meta}. Everything else on this list you can already evidence, so it is the only one where two hours changes the outcome.`
            : 'Prepare for what this round covers rather than the whole job description. The reports are specific and the posting is not.',
        },
      },
      {
        label: 'How long should I spend?',
        match: ['how long', 'time', 'hours'],
        answer: {
          type: 'message',
          text: `You have until ${'the slot you picked'} — realistically two evenings. One on the weak ground, one reading back your own projects so the examples come out clean. More than that and you start rehearsing rather than remembering.`,
        },
      },
      {
        label: 'What do they pay?',
        match: ['pay', 'salary', 'ctc', 'compensation'],
        answer: {
          type: 'list',
          title: `What ${app.company} pays for this level.`,
          items: [
            { label: 'AmbitionBox estimate: ₹32–41L', meta: 'From employee-reported salaries at this level', tone: 'ok' },
            { label: 'Above your ₹22L target', meta: 'And well above your current ₹15L', tone: 'ok' },
          ],
          source: 'AmbitionBox salary data. The posting itself does not state a range.',
        },
      },
      {
        label: 'Who else is in the loop?',
        match: ['who else', 'loop', 'panel', 'interviewer'],
        answer: {
          type: 'message',
          text: 'I do not know. The invitation names nobody, and nothing in the thread says who follows. If you ask the recruiter directly they will usually tell you, and it is a normal thing to ask.',
        },
      },
    ]
  },

  debrief: (app) => [
    {
      label: 'What happens next?',
      match: ['what happens', 'next', 'after this'],
      answer: {
        type: 'message',
        text: `Nothing you control. ${app.company} decides, and I watch the thread. If it goes quiet past fourteen days I will bring it back with a note already written.`,
      },
    },
    {
      label: 'Should I follow up?',
      match: ['follow up', 'chase', 'nudge'],
      answer: {
        type: 'verdict',
        title: 'Not yet.',
        text: 'Two days after a round is too early — it reads as anxious rather than keen. Give it the week they implied, and if nothing lands I will write the note for you.',
      },
    },
    {
      label: 'How did this compare to my other rounds?',
      match: ['compare', 'other rounds', 'last time'],
      answer: {
        type: 'list',
        title: 'Your logged rounds.',
        items: roundHistory.map((entry) => ({
          label: `${entry.company} · ${entry.round}`,
          meta: `${entry.topics.join(', ')} · ${entry.outcome.toLowerCase()}`,
          tone: entry.outcome === 'Went well' ? 'ok' : entry.outcome === 'Hard to read' ? 'neutral' : 'warn',
        })),
        source: 'From the debriefs you have logged, not from any email',
      },
    },
    {
      label: 'What do I prepare for the next round?',
      match: ['next round', 'prepare', 'round 3'],
      answer: {
        type: 'verdict',
        title: 'Whatever you said you would want back.',
        text: 'That answer is worth more than the reports, because it came from the room. I build the next briefing around it and leave the rest as background.',
      },
    },
  ],

  rejection: (app) => [
    {
      label: 'How do I get past this next time?',
      match: ['next time', 'get past', 'improve', 'fix'],
      answer: {
        type: 'verdict',
        title: 'Evidence, not effort.',
        text: 'Two of the three reasons are things your profile does not prove rather than things you cannot do. Closing that gap is a writing job, and I can do most of it with you in twenty minutes.',
      },
    },
    {
      label: 'Show me roles where this matters less',
      match: ['roles', 'show me', 'other jobs', 'matters less'],
      answer: {
        type: 'message',
        text: 'Three of them are in your Jobs tab already, ranked. All Go-heavy payments teams inside your experience band, so the level stretch and the Java gap both stop applying.',
      },
    },
    {
      label: 'Was the level the problem?',
      match: ['level', 'seniority', 'band'],
      answer: {
        type: 'message',
        text: `I cannot know, and neither can you from that email. What I can see is that ${app.company} posted a 7–10 year band and you are at six. That is not disqualifying on its own — it just means everything else had to carry more weight.`,
      },
    },
  ],

  ghosted: (app) => [
    {
      label: 'How long should I wait?',
      match: ['how long', 'wait', 'when'],
      answer: {
        type: 'message',
        text: `You already have. ${app.silentDays} days is past the point where waiting is a strategy — this is why the card came back rather than sitting in Tracker.`,
      },
    },
    {
      label: 'Does following up actually work?',
      match: ['work', 'worth it', 'point', 'useful'],
      answer: {
        type: 'verdict',
        title: 'Sometimes, and it costs you nothing.',
        text: 'A follow-up either restarts the conversation or gives you permission to close it. Both are better than an application sitting open in your head for another month.',
      },
    },
    {
      label: 'Should I just close it?',
      match: ['close', 'give up', 'move on'],
      answer: {
        type: 'message',
        text: 'Your call, and there is no wrong answer. Closing it moves the card to Rejected with a note that you closed it, not them — which matters when you look back at this search.',
      },
    },
  ],

  reply: () => [
    {
      label: 'Make it shorter',
      match: ['shorter', 'brief', 'cut'],
      answer: { type: 'message', text: 'Edit it directly in the draft above — it is a live field, and whatever you leave there is what gets copied.' },
    },
    {
      label: 'What does PhonePe pay?',
      match: ['pay', 'salary', 'ctc'],
      answer: {
        type: 'list',
        title: 'PhonePe, Backend Engineer III.',
        items: [
          { label: 'AmbitionBox estimate: ₹31L', meta: 'From 540 employee-reported salaries', tone: 'ok' },
          { label: 'Posted range ₹28–36L', meta: 'What PhonePe advertised', tone: 'neutral' },
        ],
        source: 'AmbitionBox salary data',
      },
    },
    {
      label: 'Should I name a number yet?',
      match: ['number', 'expectation', 'how much'],
      answer: {
        type: 'verdict',
        title: 'No.',
        text: 'Not in the first reply. Whoever names a figure first anchors the conversation, and you have nothing to gain from anchoring it before you know what the role is.',
      },
    },
  ],

  offer: () => [
    {
      label: 'What is my monthly take-home?',
      match: ['take home', 'in hand', 'monthly'],
      answer: {
        type: 'message',
        text: `Fixed pay is ${offer.fixed}, and that is the part that recurs monthly. I will not put a take-home figure on it — that turns on the tax regime and deductions I do not hold, and a confident wrong number here is worse than none.`,
      },
    },
    {
      label: 'Is this fair for my experience?',
      match: ['fair', 'experience', 'worth', 'market'],
      answer: {
        type: 'list',
        title: 'Against the market.',
        items: [
          { label: `Band for this role: ${offer.market}`, meta: 'From 212 employee-reported salaries at Juspay', tone: 'ok' },
          { label: `Your offer: ${offer.total}, below the midpoint`, meta: 'Fair, and not the top of what they pay', tone: 'neutral' },
        ],
        source: 'AmbitionBox salary data',
      },
    },
    {
      label: 'How do I ask for more?',
      match: ['ask for more', 'negotiate', 'counter'],
      answer: {
        type: 'verdict',
        title: 'One number, one reason, once.',
        text: 'Ask for the fixed component at ₹26L, cite the band and your payments depth, and leave the variable alone. Arguing the variable is standard here and reads as inexperience.',
      },
    },
  ],
}

/*
 * The honest miss. A fallback that pretends to answer is how an assistant loses the
 * trust every grounded answer above earns.
 */
const NO_ANSWER = {
  type: 'message',
  text: 'I do not have that. Everything I say here traces back to your inbox, your profile, or reported data, and that question falls outside all three — so I would be guessing, and you would not be able to tell.',
}

export function followUps(type, app) {
  const build = FOLLOW_UPS[type]
  return build ? build(app || {}) : []
}

export function answerQuestion(type, app, question) {
  const asked = question.trim().toLowerCase()
  const hit = followUps(type, app).find((entry) => entry.match.some((word) => asked.includes(word)))
  return hit ? hit.answer : NO_ANSWER
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
export function buildFlow(type, applicationId, booked) {
  const build = BUILDERS[type]
  if (!build) return null
  const app = applicationId === 'juspay' ? juspayInterview() : (applicationId ? byId(applicationId) : {})
  if (type !== 'offer' && !app.id) return null
  return { steps: build(app, booked), app, meta: flowMeta[type] }
}

export { interviewIntel }
