export const candidate = {
  name: 'Arjun Mehta',
  firstName: 'Arjun',
  initials: 'AM',
  email: 'arjun.mehta@gmail.com',
  title: 'Senior Backend Engineer',
  company: 'Razorpay',
  experience: '6 years',
  location: 'Pune',
  hometown: 'Jaipur',
  currentPay: '₹15L',
  targetPay: '₹22L+',
  preferences: ['Senior backend', '₹22L+', 'Remote or hybrid', 'Bengaluru'],
}

export const onboardingProfile = {
  name: candidate.name,
  email: candidate.email,
  title: candidate.title,
  company: candidate.company,
  experience: candidate.experience,
  location: candidate.location,
  hometown: candidate.hometown,
  currentPay: candidate.currentPay,
  profileHeadline: 'Senior Backend Engineer | Distributed Systems | Payments',
  profileSummary: 'Backend engineer with 6 years of experience building reliable payment systems. Currently leading services across transaction processing, retries, and reconciliation at Razorpay.',
  industry: 'Fintech and payments',
  department: 'Engineering - Software and QA',
  employmentType: 'Full time',
  noticePeriod: '',
  skills: ['Java', 'Kafka', 'Distributed systems', 'Payments', 'AWS', 'Spring Boot', 'Redis', 'PostgreSQL', 'Microservices'],
  employmentHistory: [
    {
      role: 'Senior Backend Engineer',
      company: 'Razorpay',
      period: 'July 2022 - Present',
      summary: 'Leads backend services for payment processing, retries, and reconciliation.',
    },
    {
      role: 'Backend Engineer',
      company: 'Paytm',
      period: 'August 2020 - June 2022',
      summary: 'Built transaction services and event-driven payment workflows.',
    },
  ],
  education: [
    {
      degree: 'B.Tech in Computer Science',
      institute: 'JECRC University, Jaipur',
      period: '2016 - 2020',
    },
  ],
  recognitions: [
    {
      title: 'Spot Award for Payment Reliability',
      issuer: 'Razorpay',
      year: '2025',
    },
    {
      title: 'AWS Certified Developer - Associate',
      issuer: 'Amazon Web Services',
      year: '2024',
    },
  ],
  projects: [
    {
      title: 'Payment Retry Orchestrator',
      detail: 'Designed an idempotent retry workflow for delayed payment callbacks.',
    },
  ],
  resume: 'Arjun_Mehta_Backend.pdf',
  resumeFreshness: 'Updated 12 days ago',
  profileFreshness: 'Updated 12 days ago',
}

export const onboardingPreferences = {
  targetRole: 'Senior Backend Engineer',
  targetPay: candidate.targetPay,
  locations: ['Bengaluru', 'Remote'],
  workModes: ['Remote', 'Hybrid'],
  employmentType: 'Full time',
  preferredCompanies: [],
  techStacks: [],
  roleLevels: [],
  industries: [],
}

export const juspay = {
  slug: 'juspay',
  company: 'Juspay',
  initials: 'JP',
  role: 'Senior Backend Engineer',
  location: 'Bengaluru',
  mode: 'Hybrid',
  type: 'Full time',
  experience: '6–9 yrs',
  salary: '₹24–30L',
  rating: '4.0',
  reviews: '847 reviews',
  source: 'Naukri',
  posted: '2d ago',
  preferenceMatch: 89,
  readinessTotal: 15,
  initialReadiness: 10,
}

export const trackerStats = [
  { value: 3, label: 'Need attention', tone: 'attention' },
  { value: 4, label: 'Waiting', tone: 'waiting' },
  { value: 8, label: 'Closed', tone: 'closed' },
]

export const applications = {
  attention: [
    { company: 'PhonePe', role: 'Backend Engineer III', action: 'Reply to recruiter', when: 'Today', color: '#5f259f', preferenceMatch: 83, stage: 'Recruiter review', insight: 'Your fintech experience is relevant. A reply today keeps the conversation moving.' },
    { company: 'CRED', role: 'Senior Backend Engineer', action: 'Review assessment', when: 'Due tomorrow', color: '#17192b', preferenceMatch: 81, stage: 'Recruiter review', insight: 'The role fits your backend preference. The assessment is the next shortlist step.' },
    { company: 'Google', role: 'Software Engineer III', action: 'Choose interview slots', when: 'Overdue', color: '#4285f4', preferenceMatch: 78, stage: 'Interviewing', insight: 'The role is a stretch on level, but your distributed-systems experience is relevant.' },
  ],
  waiting: [
    { company: 'Amazon', role: 'SDE III', when: 'Applied 4d ago', preferenceMatch: 84, outlook: 'Promising', stage: 'Applied' },
    { company: 'Flipkart', role: 'Lead Software Engineer', when: 'Recruiter viewed', preferenceMatch: 74, outlook: 'Competitive', stage: 'Recruiter review' },
    { company: 'Swiggy', role: 'Backend Engineer', when: 'Applied 8d ago', preferenceMatch: 80, outlook: 'Promising', stage: 'Applied' },
    { company: 'Zeta', role: 'Senior Software Engineer', when: 'Interview completed', preferenceMatch: 86, stage: 'Interviewing' },
  ],
}

export const jobs = [
  {
    ...juspay,
    id: 'juspay',
    readiness: '10/15',
    sourceLabel: 'From Naukri',
    reason: 'Strong fit for your payments and distributed-systems background.',
    culture: 'High learning · Fast paced',
  },
  {
    id: 'zeta', company: 'Zeta', initials: 'ZE', role: 'Senior Backend Engineer', location: 'Bengaluru', mode: 'Hybrid',
    salary: '₹25–32L', rating: '3.8', reviews: '1.2k reviews', preferenceMatch: 86, readiness: '9/14',
    sourceLabel: 'From AmbitionBox', posted: '1d ago', reason: 'Your fintech domain depth stands out.', culture: 'Strong tech · Mixed WLB',
  },
  {
    id: 'phonepe', company: 'PhonePe', initials: 'PP', role: 'Backend Engineer III', location: 'Bengaluru', mode: 'Office',
    salary: '₹28–36L', rating: '4.1', reviews: '3.4k reviews', preferenceMatch: 83, readiness: 'Applied',
    sourceLabel: 'Recruiter email', posted: 'Needs reply', reason: 'Already in conversation—replying is your highest-leverage move.', culture: 'Great pay · High intensity',
  },
  {
    id: 'razorline', company: 'Groww', initials: 'GR', role: 'Staff Backend Engineer', location: 'Bengaluru', mode: 'Hybrid',
    salary: '₹32–42L', rating: '3.7', reviews: '891 reviews', preferenceMatch: 76, readiness: '8/16',
    sourceLabel: 'Company careers', posted: 'Today', reason: 'Compelling stretch role; stronger leadership evidence would help.', culture: 'Ownership · Rapid growth',
  },
]

// Interview intelligence for the Juspay round-1 hiring-manager conversation.
// Counts are internally consistent: 63 reports total for this role and level; 51 of those
// describe round 1, and every theme count is scoped to those 51. Interviewer style signals
// are scoped to the 19 reports that characterise the round in enough detail.
// Everything here is either publicly findable or first-party AmbitionBox aggregate —
// no private profile or job-search data. See `interviewer.boundary`.
export const interviewIntel = {
  invitation: {
    sender: 'Ananya Sharma · Juspay Talent Team',
    subject: 'Interview · Senior Backend Engineer',
    detected: 'DETECTED IN GMAIL · JUST NOW',
    received: '25 July 2026 · 4:12 PM',
    day: 'Tuesday, 28 July',
    time: '11:00 AM',
    duration: '60 minutes',
    mode: 'Google Meet',
    link: 'meet.google.com/xkq-hrvd-pnb',
    with: 'Nikhil Rao',
    body: 'Hi Arjun, thanks for your application. We’d like to set up a 60-minute conversation with Nikhil Rao. Let us know if the slot below works for you.',
    unknownsTitle: 'That’s the entire email.',
    unknownsLine: 'It doesn’t say what this round covers, how many there are, or what they weigh most. Almost no invitation does.',
    unknowns: ['What this round covers', 'How many rounds there are', 'Who else you meet', 'What they weigh most'],
  },

  roundInference: {
    kicker: 'WHAT WE WORKED OUT',
    resolved: [
      { label: 'Who you’re meeting', value: 'Nikhil Rao · Engineering Manager, Payments Core', how: 'Public Juspay engineering pages and a conference listing' },
      { label: 'Where this sits', value: 'Round 1 of 4', how: '51 of 63 interview reports for this role and level' },
      { label: 'Most likely round type', value: 'Hiring manager conversation', how: 'Juspay opens with the manager for senior backend — 51 of 63 reports' },
    ],
    unresolved: 'Whether they add a live technical exercise. 12 of 63 reports describe one inside round 1.',
    askTitle: 'Does this look right?',
    askDetail: 'We inferred this — we didn’t read it anywhere. You may know something we don’t: the recruiter call, a previous round, or what a friend told you.',
    options: [
      { id: 'confirmed', label: 'That matches', result: 'Prep is built for a hiring-manager conversation with Nikhil.' },
      { id: 'corrected', label: 'It’s technical', result: 'Switched. Technical depth leads, and the interviewer research still applies — Nikhil runs Payments Core either way.' },
      { id: 'unsure', label: 'I’m not sure', result: 'We’ll prepare you for both. Manager questions come first because that’s the likelier round; the technical themes sit underneath.' },
    ],
  },

  interviewer: {
    name: 'Nikhil Rao',
    title: 'Engineering Manager',
    team: 'Payments Core',
    initials: 'NR',
    relationship: 'The person you’d report to',
    tenure: '4 years at Juspay · 11 years in payments',
    owns: 'Payment orchestration, callback delivery, and settlement reliability',
    publicFootprint: [
      { label: 'Talk · “Retrying money safely”', detail: 'On idempotency and reconciliation at scale', where: 'Public conference listing, 2025' },
      { label: 'Juspay engineering blog', detail: 'Two posts on callback delivery guarantees', where: 'juspay.io/blog' },
      { label: 'Public profile headline', detail: 'Engineering Manager, Payments Core at Juspay', where: 'Publicly visible headline only' },
    ],
    reportSignal: [
      { text: 'Runs it as a conversation, not a question list — expect follow-ups that go deeper rather than a new topic.', count: '14 of 19' },
      { text: 'Probes the first ten minutes of an incident far more than the eventual fix.', count: '12 of 19' },
      { text: 'Asks for one system end to end rather than several at summary level.', count: '11 of 19' },
    ],
    reportSignalScope: 'From 19 reports that describe this round in enough detail to characterise it.',
    boundary: 'Everything here is either publicly published or aggregated from AmbitionBox reports. We never use anyone’s private profile or job-search activity.',
  },

  evidence: {
    reports: 63,
    reviews: 847,
    roundOneReports: 51,
    scope: 'Senior backend · Bengaluru · last 12 months',
    freshness: 'Updated 3 days ago',
    findable: {
      title: 'What you could find yourself',
      detail: 'About three hours of searching. This took four seconds.',
      items: ['Public Juspay engineering pages', 'A conference listing and talk abstract', 'Two engineering blog posts', 'A publicly visible profile headline'],
    },
    exclusive: {
      title: 'What only AmbitionBox knows',
      detail: 'No amount of searching reaches this.',
      items: ['63 interview reports for this role and level', '847 employee reviews, filtered to this org', 'Naukri company and team data', 'The evidence you confirmed yourself'],
    },
    receiptTitle: 'Where this comes from',
    receiptDetail: '63 AmbitionBox interview reports and 847 employee reviews, filtered to senior backend roles in Bengaluru over the last 12 months.',
    simulationNote: 'Prototype intelligence. The interviewer, report counts, round patterns and outcome rates are deterministic demo figures, not live AmbitionBox data.',
  },

  loop: {
    total: 4,
    caveat: 'Later rounds have fewer reports because fewer candidates reach them. Round 1 is the strongest signal.',
    rounds: [
      { round: 1, label: 'Hiring manager conversation', detail: 'One system end to end, ownership, and how you work', reports: 51, duration: '60 min', weight: 'Reported as the round that decides it' },
      { round: 2, label: 'Coding and problem solving', detail: 'Data structures applied to a payments scenario', reports: 44, duration: '60 min' },
      { round: 3, label: 'System design deep dive', detail: 'Reliability, idempotency, and reconciliation at scale', reports: 39, duration: '60 min' },
      { round: 4, label: 'Leadership and fit', detail: 'Motivation, direction, and the compensation conversation', reports: 28, duration: '30 min' },
    ],
  },

  inversion: {
    kicker: 'THE PART MOST CANDIDATES GET WRONG',
    headline: 'Most companies screen with coding first. Juspay doesn’t.',
    detail: '51 of 63 reports put the hiring manager at round 1 for senior backend. Coding comes second.',
    counter: '12 of 63 describe something else first. Prepare for the conversation — but don’t be thrown if it opens with code.',
  },

  themeScope: 'Across the 51 reports describing round 1.',
  themes: [
    {
      id: 'incidents', label: 'Incident ownership', reports: 34,
      summary: 'Whether you’ve carried a live payment system, not only built one.',
      excerpts: [
        'Asked about the worst production issue I’d been responsible for, then kept pulling on what I did before I understood the cause.',
        'Less about the fix, more about the first ten minutes. He wanted to know what I chose not to do.',
        'Wanted to know how I found out it was broken before a customer told me.',
      ],
    },
    {
      id: 'one-system', label: 'One system end to end', reports: 29,
      summary: 'One thing you built, all the way through — not a tour of your résumé.',
      excerpts: [
        'He picked one line off my CV and we stayed there for thirty-five minutes.',
        'Asked me to draw the whole path a callback takes, then asked where it breaks.',
        'Stopped me when I started listing projects. He wanted depth on one.',
      ],
    },
    {
      id: 'tradeoffs', label: 'Trade-off framing', reports: 22,
      summary: 'Not how big — why you accepted the cost you accepted.',
      excerpts: [
        'Every number I gave, he asked what it cost me. Latency for consistency, and so on.',
        'Wanted the trade-off stated before the mechanism.',
        'Asked me to argue against my own design. That was the whole test.',
      ],
    },
    {
      id: 'people', label: 'How you work with others', reports: 15,
      summary: 'A manager round tests how you operate, not only what you shipped.',
      excerpts: [
        'Asked about a technical decision I lost, and what I did afterwards.',
        'Wanted a specific disagreement, not a philosophy of teamwork.',
        'Asked who I’d go to when I was stuck, and what that says about how I work.',
      ],
    },
    {
      id: 'java', label: 'Java and JVM depth', reports: 9,
      summary: 'Asked less often in this round, but asked deeply when it comes up.',
      excerpts: [
        'Went into GC pauses and how I’d diagnose them in production.',
        'Asked about thread pools and where I’d personally tuned one.',
        'Didn’t come up in my round at all.',
      ],
    },
  ],

  outcomes: {
    offerRate: '22%',
    offerRateDetail: '14 of 63 reports ended in an offer',
    decisionMedian: '11 days',
    decisionDetail: 'Median from final round to a decision',
    loopMedian: '16 days',
    loopDetail: 'Median across all four rounds',
  },

  savedAnswersTitle: 'You already have these answers',
  savedAnswersNote: 'These came from the evidence you confirmed yourself. Reread them — don’t rewrite them.',
  savedAnswers: [
    {
      id: 'system', themeId: 'one-system', status: 'ready',
      question: '“Walk me through a system you owned end to end.”',
      answer: 'The Kafka-based payment callback retry service. You led the design, and added idempotency and observability.',
      outcome: '31% fewer callback failures at peak volume',
      source: 'Confirmed by you in the evidence check',
      note: 'Reports say this round opens here — 29 of 51. It’s already yours.',
    },
    {
      id: 'tradeoff', themeId: 'tradeoffs', status: 'partial',
      question: '“Why that design over the alternative?”',
      answer: 'You have the numbers. You haven’t framed them as a choice you made.',
      source: 'Derived from your confirmed evidence',
      note: 'Nothing new to learn. Say the trade-off before the mechanism.',
    },
  ],

  newQuestionsTitle: 'These are new for this round',
  newQuestions: [
    {
      id: 'incident', themeId: 'incidents',
      question: '“Tell me about the worst incident you were responsible for.”',
      why: 'The most reported question in this round — 34 of 51.',
      focus: 'Reports say Nikhil probes the first ten minutes, not the eventual fix. Prepare how you found out, and what you changed afterwards.',
      caution: 'Your confirmed evidence covers designing and observing this system. It does not cover an on-call rotation — don’t claim one.',
    },
    {
      id: 'people', themeId: 'people',
      question: '“Tell me about a technical disagreement you lost.”',
      why: '15 of 51 reports mention it in this round.',
      focus: 'One concrete disagreement and what you did afterwards. Not a philosophy of teamwork.',
    },
  ],

  javaBranch: {
    themeId: 'java',
    headline: 'The one you can’t prove yet',
    refusal: 'We won’t write a Java story for you.',
    question: 'Have you personally owned production Java services for 3+ years?',
    context: 'Juspay lists it explicitly, and 9 of 51 round-1 reports go into JVM behaviour. Confirm only if it’s accurate.',
    yes: {
      result: 'Confirmed. Profile Readiness is now 15/15.',
      strategyTitle: 'How to lead with it',
      strategy: 'Start with the service you owned, then a GC or thread-pool behaviour you tuned yourself. Specifics, not familiarity.',
    },
    no: {
      result: 'Kept at 14/15. The gap stays named.',
      strategyTitle: 'How to answer it truthfully and still be credible',
      strategy: '“I’ve worked in a JVM stack but I haven’t owned JVM tuning. Here’s how I actually debug latency in production…” Then move to what you do own. It came up in 9 of 51 reports — it isn’t the round.',
    },
  },

  practice: {
    fromThemeId: 'incidents',
    origin: 'From the 34 reports on incident ownership — the most reported question in this round',
    question: 'Tell me about the worst incident you were responsible for.',
    minutes: '~8 min',
    promptTitle: 'Cover these five things',
    decisions: [
      { id: 'detection', label: 'How you found out', keywords: ['alert', 'monitor', 'metric', 'dashboard', 'lag', 'noticed', 'paged', 'observab'] },
      { id: 'firstmoves', label: 'Your first ten minutes', keywords: ['first ten', 'immediately', 'paused', 'stopped', 'contained', 'rolled back', 'rollback', 'triage'] },
      { id: 'blast', label: 'Who was affected', keywords: ['merchant', 'customer', 'impact', 'affected', 'transaction'] },
      { id: 'fix', label: 'What you actually changed', keywords: ['idempoten', 'retry', 'retri', 'dedup', 'replay', 'state transition'] },
      { id: 'after', label: 'What stopped it recurring', keywords: ['afterwards', 'postmortem', 'post-mortem', 'since then', 'runbook', 'prevent', 'added alerting'] },
    ],
    demoAnswer: 'Our callback lag alert fired before any merchant noticed — the dashboard showed duplicate settlement events climbing. In the first ten minutes I paused the retry consumer and contained it rather than chasing the cause. Around 400 merchant transactions were affected and none double-settled. What I actually changed was the idempotency key: we persisted the state transition before the external call instead of after. Afterwards I added alerting on duplicate rate and wrote the runbook, and callback failures dropped 31% at peak.',
    coaching: {
      strongTitle: 'Strong foundation',
      partialTitle: 'A start — not yet an answer',
      emptyTitle: 'I can’t score that yet',
      emptyBody: 'You haven’t named any of the five things this question tests. Write the actual answer and I’ll grade it — I won’t praise an answer that isn’t there.',
      grounded: 'Grounded in your Razorpay evidence',
      coveredLead: 'You covered',
      missedLead: 'You didn’t mention',
      addLineLabel: 'ADD THIS LINE',
      addLine: '“I paused the consumer before I understood the cause — containing it mattered more than being right quickly.”',
      addLineWhy: 'In 17 of the 51 reports, the candidates who advanced showed judgement under pressure rather than a clean root-cause narrative.',
    },
  },

  questionsToAskTitle: 'What to ask them',
  questionsToAskNote: 'These are the same three things you’d have to verify before accepting an offer. Asking now makes you an evaluator, not an examinee.',
  questionsToAskCaution: 'The pay question is fair in a manager round, but it lands better at the end. Ask the first two first.',
  questionsToAsk: [
    { verifies: 'hybrid', ask: 'How does the backend team actually run the three office days in a release week?' },
    { verifies: 'manager', ask: 'Who owns a payment incident at 2 AM, and what does the rotation look like?' },
    { verifies: 'variable', ask: 'What did variable pay actually look like at this level last cycle?' },
  ],

  ready: {
    kicker: 'PREP COMPLETE',
    headline: 'You walk in knowing what they ask and what you can prove.',
    detail: 'Juspay prep is saved. Your tracker now shows Tuesday, 28 July at 11:00 AM.',
    noPracticeNote: 'Practice wasn’t recorded in this session.',
  },
}

export const offer = {
  total: '₹28L',
  fixed: '₹23.5L',
  variable: '₹2.5L',
  joining: '₹2L',
  preferenceEvaluation: { matched: 3, total: 7 },
  targetDelta: '27% above target',
  currentDelta: '87% above current',
  market: '₹24–30L',
  source: {
    sender: 'Ananya Sharma · Juspay Talent Team',
    subject: 'Offer of employment · Senior Backend Engineer',
    received: '8 August 2026 · 9:41 AM',
    attachment: 'Juspay_Offer_Arjun_Mehta.pdf',
  },
  letter: {
    designation: 'Senior Backend Engineer',
    employmentType: 'Full time',
    location: 'Bengaluru',
    workPolicy: 'Hybrid · 3 office days each week',
    joiningDate: '16 September 2026',
    validUntil: '14 August 2026',
    probation: '6 months',
    noticePeriod: '60 days',
    esops: 'Not mentioned',
    benefits: 'Standard benefits referenced; details not attached',
    relocationSupport: 'Not mentioned',
  },
}

export const offerDecision = {
  verdict: 'A strong offer. You have leverage—and a few things to verify.',
  summaryVerdict: 'A meaningful upgrade in pay and growth. Verify the team experience before you say yes.',
  goodSignals: [
    { title: '₹13L higher total compensation', detail: '₹28L is 87% above Arjun’s current ₹15L and above his ₹22L+ target.' },
    { title: 'Close to the top of the role’s range', detail: 'The offer sits at ₹28L inside a published ₹24–30L band.' },
    { title: 'Stronger learning and culture signals', detail: 'Juspay leads Razorpay on every directly comparable review dimension.' },
  ],
  watchSignals: [
    { title: '₹4.5L is not fixed pay', detail: '₹2.5L is performance-linked and ₹2L is a one-time joining bonus.' },
    { title: 'The move changes the real gain', detail: 'Bengaluru is estimated to cost ₹13k more each month, plus relocation.' },
    { title: 'Team reality still needs a human answer', detail: 'Confirm hybrid days, workload, manager style and typical variable payout.' },
  ],
  currentCompany: {
    company: 'Razorpay',
    overall: '3.4',
    reviews: '762 reviews',
    industryComparison: '6% below industry average',
    signals: [
      { label: 'Skill development', value: '3.4' },
      { label: 'Company culture', value: '3.3' },
      { label: 'Salary', value: '3.2' },
      { label: 'Work-life balance', value: '3.2' },
      { label: 'Job security', value: '3.1' },
      { label: 'Work satisfaction', value: '3.0' },
      { label: 'Promotions', value: '2.7' },
    ],
    reviewThemes: [
      { label: 'Work culture', detail: 'Independent work and open communication are balanced by concerns about micromanagement and rigid protocols.', mentions: 'Mentioned in 22 reviews' },
      { label: 'Salary', detail: 'Some employees describe compensation and increments as lagging market standards.', mentions: 'Mentioned in 12 reviews' },
      { label: 'Team members', detail: 'Supportive colleagues are a positive, though experiences vary significantly by team.', mentions: 'Mentioned in 9 reviews' },
      { label: 'Job security', detail: 'Some reviews describe uncertainty around role continuity and performance expectations.', mentions: 'Mentioned in 6 reviews', tone: 'watch' },
    ],
    benefits: [
      { label: 'Free meal', reportedBy: '44 employees' },
      { label: 'Health & wellness', reportedBy: '39 employees' },
      { label: 'Learning & development', reportedBy: '29 employees' },
    ],
    policies: [
      { label: 'Hybrid', value: '53% report it' },
      { label: 'Five-day work week', value: '81% report it' },
      { label: 'Flexible timing', value: '75% report it' },
    ],
  },
  comparisonSignals: [
    { label: 'Overall rating', current: '3.4', offered: '4.0', delta: '+0.6' },
    { label: 'Skill development', current: '3.4', offered: '4.2', delta: '+0.8' },
    { label: 'Company culture', current: '3.3', offered: '4.0', delta: '+0.7' },
    { label: 'Work-life balance', current: '3.2', offered: '3.7', delta: '+0.5' },
  ],
  move: {
    from: 'Pune',
    to: 'Bengaluru',
    hometown: 'Jaipur',
    officeDays: 3,
    homeTrips: 4,
    housing: 'solo',
  },
  companySignals: [
    { label: 'Skill development', value: '4.2', tone: 'strong' },
    { label: 'Company culture', value: '4.0', tone: 'strong' },
    { label: 'Work-life balance', value: '3.7', tone: 'watch' },
  ],
  verifiedSignals: [
    'Employees consistently value learning and technical ownership.',
    'Culture scores positively across 847 AmbitionBox reviews.',
  ],
  // Ids are shared with interviewIntel.questionsToAsk so prep and the offer beat
  // speak about the same three unknowns rather than index-zipping two lists.
  questionsToVerify: [
    { id: 'hybrid', label: 'How the backend team applies the three-day hybrid policy' },
    { id: 'variable', label: 'Typical variable-pay outcomes for this level' },
    { id: 'manager', label: 'Manager expectations, workload, and growth path' },
  ],
  benefitSignals: {
    esops: {
      summary: 'Employees report ESOP options',
      source: 'AmbitionBox benefits data · Employee reported',
    },
  },
  salaryBenchmarks: {
    range: '₹24–30L',
    average: '₹26.1L',
    topTen: '₹29.5L+',
    topOne: '₹34L+',
    context: 'Senior backend · 6 to 9 years · Bengaluru',
    freshness: 'Updated 4 days ago',
  },
  anonymousEmployee: {
    title: 'Senior backend engineer',
    tenure: '3 years at Juspay',
    context: 'Moved to Bengaluru',
    question: 'How consistently does your backend team work from the office three days a week, and which days?',
    response: 'My backend team is usually in Tuesday to Thursday. It can vary around releases, so I would confirm the exact norm with the hiring manager before deciding.',
  },
}

export const initialJourney = {
  onboardingComplete: false,
  authProvider: null,
  profileSource: null,
  onboardingNaukriImported: false,
  onboardingProfileConfirmed: false,
  onboardingPreferencesConfirmed: false,
  onboardingProfile: null,
  onboardingPreferences: null,
  emailSkipped: false,
  firstHomeArrival: false,
  emailConnected: false,
  importComplete: false,
  manualApplications: [],
  phonepeReplied: false,
  naukriConnected: false,
  preferencesConfirmed: false,
  savedJobs: [],
  readiness: 10,
  resumeReady: false,
  javaConfirmed: null,
  interviewInvited: false,
  roundConfirmed: null,
  prepDecisionsCovered: 0,
  prepComplete: false,
  offerDetected: false,
  offerReviewed: false,
  offerCelebrationDismissed: false,
  relocationAssumptions: { housing: 'solo', officeDays: 3, homeTrips: 4 },
  employeeRequestStatus: 'idle',
  employeeResponseSaved: false,
  negotiationSaved: false,
}

export const journeyPresets = {
  baseline: initialJourney,
  tracker: { ...initialJourney, emailConnected: true, importComplete: true },
  matches: { ...initialJourney, emailConnected: true, importComplete: true, phonepeReplied: true, naukriConnected: true, preferencesConfirmed: true },
  readiness: { ...initialJourney, emailConnected: true, importComplete: true, phonepeReplied: true, naukriConnected: true, preferencesConfirmed: true, savedJobs: ['juspay'] },
  resume: { ...initialJourney, emailConnected: true, importComplete: true, phonepeReplied: true, naukriConnected: true, preferencesConfirmed: true, savedJobs: ['juspay'], readiness: 14, resumeReady: true },
  interview: { ...initialJourney, emailConnected: true, importComplete: true, phonepeReplied: true, naukriConnected: true, preferencesConfirmed: true, savedJobs: ['juspay'], readiness: 14, resumeReady: true, javaConfirmed: false, interviewInvited: true },
  offer: { ...initialJourney, emailConnected: true, importComplete: true, phonepeReplied: true, naukriConnected: true, preferencesConfirmed: true, savedJobs: ['juspay'], readiness: 14, resumeReady: true, javaConfirmed: false, interviewInvited: true, roundConfirmed: 'confirmed', prepDecisionsCovered: 5, prepComplete: true, offerDetected: true },
}

export const chapters = [
  { number: '01', title: 'A detected profile makes the promise personal', path: '/onboarding?step=welcome', preset: 'baseline', duration: '1:35' },
  { number: '01B', title: 'Build a profile from scratch', path: '/onboarding?step=profile-start&branch=google', preset: 'baseline', duration: '1:20' },
  { number: '02', title: 'The inbox becomes a tracker', path: '/tracker?flow=gmail', preset: 'baseline', duration: '1:15' },
  { number: '03', title: 'The right action rises to the top', path: '/home', preset: 'tracker', duration: '0:55' },
  { number: '04', title: 'Naukri becomes a transparent profile', path: '/matches?flow=naukri', preset: 'tracker', duration: '1:10' },
  { number: '05', title: 'One feed, every source explained', path: '/matches', preset: 'matches', duration: '1:05' },
  { number: '06', title: 'Evidence improves the résumé', path: '/jobs/juspay', preset: 'readiness', duration: '1:40' },
  { number: '07', title: 'The invite says nothing. We decode it.', path: '/home', preset: 'resume', duration: '2:10' },
  { number: '08', title: 'The offer becomes a life decision', path: '/offer/juspay?stage=notification&story=finale', preset: 'offer', duration: '1:40' },
]
