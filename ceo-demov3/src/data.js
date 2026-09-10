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

/*
 * The pipeline, rebuilt 2026-09-10 on Pranoy's instruction.
 *
 * Five stages, down from seven. `shortlisted` left the pipeline — a role you saved but
 * never applied to is a Jobs concept, and it was the one column holding things that were
 * not applications. `review` and `recruiter-shortlist` folded back into `applied`: a
 * recruiter reading you is a signal on the card, not a place the application moved to.
 * `closed` split by cause, because its two halves need opposite things from the user —
 * a rejection is over, silence is not.
 *
 * GHOSTED IS NOT A STEP. It cuts across the pipeline: an application can fall silent
 * after you apply, after an invite, or after you interview. A ghosted card therefore
 * keeps `ghostedFrom`, says on its face where it fell from, and offers a follow-up
 * written for that origin. Offer and Rejected never ghost — one has its own clock
 * inside the offer flow, the other is finished.
 */
export const applicationStages = [
  { id: 'applied', label: 'Applied', hint: 'Sent, or a recruiter is reading you' },
  { id: 'interview', label: 'Interview scheduled', hint: 'A round is booked, or just happened' },
  { id: 'offer', label: 'Offer', hint: 'A number is on the table' },
  { id: 'ghosted', label: 'Ghosted', hint: 'Quiet past the point of waiting' },
  { id: 'rejected', label: 'Rejected', hint: 'Finished' },
]

/*
 * When silence becomes ghosting. The clock resets on any signal — an email, a recruiter
 * view, a calendar change, or the user editing the card — so these count days of nothing
 * at all, not days since applying.
 *
 * 45 days from Applied is Pranoy's number. The other two are shorter because the other
 * side has already spent effort on you: an unanswered invite and a round that already
 * happened both mean someone owes you a reply, and six weeks of either is not patience.
 */
export const ghostRules = {
  applied: { days: 45, label: 'no reply since you applied' },
  invited: { days: 7, label: 'no slot confirmed since the invite' },
  interviewed: { days: 10, label: 'no update since the round' },
}

/* A follow-up buys this many more days before North offers to close the application. */
export const ghostFollowUpGrace = 14

/*
 * What the import screen reports. These are the three shapes a scanned application can
 * be in at the moment it lands — needing the user, waiting on someone else, or finished.
 * The pipeline stages are the finer model; this is the receipt.
 */
export const trackerStats = [
  { value: 4, label: 'Need you', tone: 'attention' },
  { value: 7, label: 'Waiting', tone: 'waiting' },
  { value: 4, label: 'Closed', tone: 'closed' },
]

export const stageLabel = (id) => (applicationStages.find((stage) => stage.id === id) || {}).label || id

/*
 * The fourteen applications the Gmail scan reports. Juspay is the fifteenth and is
 * assembled in TrackerScreen — it is the golden path's interview and has never lived
 * in the fixture.
 *
 * Flat, since 2026-09-10. The old shape split them three ways (attention / waiting /
 * closed), which was the stat model Tracker dropped; a second grouping alongside the
 * pipeline is exactly the disagreement that model caused. Stage is the only grouping.
 *
 * `movedBy` is the Gmail promise made visible. North reads the inbox and moves cards,
 * and until a card says so on its face, that claim lives only in the pitch. `north`
 * means North moved it and the card offers an undo; `you` means the user did, and
 * nothing rewrites it afterwards.
 */
export const applications = [
  /* ---- Applied: sent, or someone is reading you ------------------------------- */
  {
    id: 'phonepe-app', company: 'PhonePe', role: 'Backend Engineer III', initials: 'PP', color: '#5f259f',
    stage: 'applied', source: 'Gmail', preferenceMatch: 83, appliedAgo: '11d ago',
    when: 'Recruiter replied · 2h ago', action: 'Reply to recruiter', flow: 'reply', urgency: 'today',
    insight: 'Your fintech experience is relevant. A reply today keeps the conversation moving.',
    quote: 'Can you confirm your availability for a quick conversation?',
    recruiter: 'Sneha Rao · Talent, PhonePe',
    movedBy: 'north', movedFrom: 'applied', movedAgo: '2h ago', movedVia: 'Gmail',
    movedNote: 'Recruiter reply detected',
  },
  {
    id: 'cred-app', company: 'CRED', role: 'Senior Backend Engineer', initials: 'CR', color: '#17192b',
    stage: 'applied', source: 'Gmail', preferenceMatch: 81, appliedAgo: '9d ago',
    when: 'Assessment due tomorrow', action: 'Review assessment', flow: 'reply', urgency: 'tomorrow',
    insight: 'Shortlisted for the take-home assessment. Finishing it is what moves you to a round.',
    movedBy: 'north', movedFrom: 'applied', movedAgo: '1d ago', movedVia: 'Gmail',
    movedNote: 'Assessment link detected',
  },
  {
    id: 'amazon-app', company: 'Amazon', role: 'SDE III', initials: 'AM', color: '#232f3e',
    stage: 'applied', source: 'Naukri', preferenceMatch: 84, appliedAgo: '4d ago',
    when: 'Applied 4d ago', movedBy: 'north', movedFrom: null, movedAgo: '4d ago', movedVia: 'Naukri',
    movedNote: 'Application confirmed',
  },
  {
    id: 'flipkart-app', company: 'Flipkart', role: 'Lead Software Engineer', initials: 'FK', color: '#2874f0',
    stage: 'applied', source: 'Naukri', preferenceMatch: 74, appliedAgo: '16d ago',
    when: 'Recruiter viewed · 2d ago', movedBy: 'north', movedFrom: null, movedAgo: '2d ago', movedVia: 'Naukri',
    movedNote: 'Recruiter view detected',
  },
  {
    id: 'swiggy-app', company: 'Swiggy', role: 'Backend Engineer', initials: 'SW', color: '#fc8019',
    stage: 'applied', source: 'Gmail', preferenceMatch: 80, appliedAgo: '8d ago',
    when: 'Applied 8d ago', movedBy: 'north', movedFrom: null, movedAgo: '8d ago', movedVia: 'Gmail',
    movedNote: 'Application confirmed',
  },

  /* ---- Interview scheduled: one booked round, one already sat ------------------ */
  {
    id: 'google-app', company: 'Google', role: 'Software Engineer III', initials: 'GO', color: '#4285f4',
    stage: 'interview', phase: 'pre', source: 'Gmail', preferenceMatch: 78, appliedAgo: '21d ago',
    when: 'Slots offered 3d ago', action: 'Choose interview slots', flow: 'prep', urgency: 'overdue',
    insight: 'The role is a stretch on level, but your distributed-systems work is relevant.',
    interview: { round: 'Round 1 of 5', mode: 'Google Meet', duration: '45 min', interviewer: 'Not named yet' },
    invitedAgo: 3,
    movedBy: 'north', movedFrom: 'applied', movedAgo: '3d ago', movedVia: 'Gmail',
    movedNote: 'Interview invite detected',
  },
  {
    id: 'paytm-app', company: 'Paytm', role: 'Senior Backend Engineer', initials: 'PA', color: '#00baf2',
    stage: 'interview', phase: 'post', source: 'Gmail', preferenceMatch: 79, appliedAgo: '27d ago',
    when: 'Interviewed 2d ago', action: 'Tell North how it went', flow: 'debrief', urgency: 'today',
    insight: 'Nothing in an inbox reports how a round actually went. Two days is when it is still fresh.',
    interview: { round: 'Round 2 of 4', mode: 'On site, Noida', duration: '60 min', interviewer: 'Vikram Sethi · Engineering Manager' },
    interviewedAgo: 2,
    movedBy: 'north', movedFrom: 'applied', movedAgo: '9d ago', movedVia: 'Gmail',
    movedNote: 'Calendar invite detected',
  },

  /* ---- Ghosted: three origins, three different follow-ups --------------------- */
  {
    id: 'ola-app', company: 'Ola', role: 'Backend Engineer III', initials: 'OL', color: '#1c1c1c',
    stage: 'ghosted', ghostedFrom: 'applied', source: 'Gmail', preferenceMatch: 72,
    appliedAgo: '52d ago', silentDays: 52,
    when: 'Applied 52d ago · no reply', action: 'Send a follow-up', flow: 'ghosted',
    insight: 'Fifty-two days with nothing back. One note either restarts it or lets you close it.',
    movedBy: 'north', movedFrom: 'applied', movedAgo: '7d ago', movedVia: 'the 45-day rule',
    movedNote: 'Passed 45 days of silence',
  },
  {
    id: 'pinelabs-app', company: 'Pine Labs', role: 'Lead Backend Engineer', initials: 'PL', color: '#0d3f67',
    stage: 'ghosted', ghostedFrom: 'interviewed', source: 'Gmail', preferenceMatch: 77,
    appliedAgo: '34d ago', silentDays: 14,
    when: 'Interviewed 14d ago · no update', action: 'Ask for an update', flow: 'ghosted',
    insight: 'You sat a round and heard nothing. Asking where it stands is normal and expected.',
    interview: { round: 'Round 2 of 3', mode: 'Video', duration: '60 min', interviewer: 'Anita Desai · Director' },
    movedBy: 'north', movedFrom: 'interview', movedAgo: '4d ago', movedVia: 'the 10-day rule',
    movedNote: 'Passed 10 days after the round',
  },
  {
    id: 'bharatpe-app', company: 'BharatPe', role: 'Senior Backend Engineer', initials: 'BP', color: '#123c2b',
    stage: 'ghosted', ghostedFrom: 'applied', source: 'Gmail', preferenceMatch: 70,
    appliedAgo: '61d ago', silentDays: 61, followedUpAgo: 9,
    when: 'Followed up 9d ago · still nothing', action: 'Close this one', flow: 'ghosted',
    insight: 'You have already sent one note. Nine days on, closing it clears the board.',
    movedBy: 'you', movedFrom: 'applied', movedAgo: '9d ago', movedVia: 'you',
    movedNote: 'You followed up',
  },

  /* ---- Rejected: finished, and the only stage that explains itself ------------- */
  {
    id: 'navi-app', company: 'Navi', role: 'Senior Backend Engineer', initials: 'NV', color: '#2c3e8f',
    stage: 'rejected', source: 'Gmail', appliedAgo: '41d ago', when: '6d ago',
    outcome: 'Not selected after the final round', action: 'See what to take from it', flow: 'rejection',
    reachedRound: 'Round 4 of 4',
    movedBy: 'north', movedFrom: 'interview', movedAgo: '6d ago', movedVia: 'Gmail',
    movedNote: 'Rejection detected',
  },
  {
    id: 'dream11-app', company: 'Dream11', role: 'Senior Backend Engineer', initials: 'D11', color: '#d6202f',
    stage: 'rejected', source: 'Gmail', appliedAgo: '30d ago', when: '12d ago',
    outcome: 'Not selected after the assessment', reachedRound: 'Assessment',
    movedBy: 'north', movedFrom: 'applied', movedAgo: '12d ago', movedVia: 'Gmail',
    movedNote: 'Rejection detected',
  },
  {
    id: 'uber-app', company: 'Uber', role: 'Senior Software Engineer', initials: 'UB', color: '#111111',
    stage: 'rejected', source: 'Gmail', appliedAgo: '35d ago', when: '18d ago',
    outcome: 'Role put on hold by the company', reachedRound: 'Round 1 of 4',
    movedBy: 'north', movedFrom: 'applied', movedAgo: '18d ago', movedVia: 'Gmail',
    movedNote: 'Role withdrawn by the company',
  },
  {
    id: 'myntra-app', company: 'Myntra', role: 'Backend Engineer III', initials: 'MY', color: '#ff3f6c',
    stage: 'rejected', source: 'Naukri', appliedAgo: '44d ago', when: '31d ago',
    outcome: 'Not selected after screening', reachedRound: 'Screening',
    movedBy: 'north', movedFrom: 'applied', movedAgo: '31d ago', movedVia: 'Naukri',
    movedNote: 'Rejection detected',
  },
]

/*
 * `salary` is what the employer advertised. `estSalary` is what AmbitionBox estimates the
 * role actually pays, from employee-reported salaries — they are different claims from
 * different sources, so the card labels both rather than blending them into one number.
 * `estBasis` is the sample behind the estimate; an estimate without its n is an opinion.
 *
 * The three Highlights (pay / culture / profile fit) follow prototype/matches-2b.js. Each is a
 * title plus a meta line that names where the claim came from. Nothing here asserts company
 * news, funding or anything attributed to a publication — every line traces to a field in this
 * file, which is the boundary agreed on 2026-08-19.
 */
export const jobs = [
  {
    ...juspay,
    id: 'juspay',
    readiness: '10/15',
    sourceLabel: 'From Naukri',
    reason: 'Strong fit for your payments and distributed-systems background.',
    culture: 'High learning · Fast paced',
    estSalary: '₹26.5L', estBasis: '212 employee-reported salaries',
    cultureTitle: 'Ownership culture, strong stack',
    cultureMeta: 'Pace can be demanding',
    fitTitle: '10 of 15 requirements evidenced',
    fitMeta: 'Based on your current profile',
  },
  {
    id: 'zeta', company: 'Zeta', initials: 'ZE', role: 'Senior Backend Engineer', location: 'Bengaluru', mode: 'Hybrid',
    salary: '₹25–32L', rating: '3.8', reviews: '1.2k reviews', preferenceMatch: 86, readiness: '9/14',
    experience: '5–8 yrs', estSalary: '₹27L', estBasis: '96 employee-reported salaries',
    sourceLabel: 'From AmbitionBox', posted: '1d ago', reason: 'Your fintech domain depth stands out.', culture: 'Strong tech · Mixed WLB',
    cultureTitle: 'High ownership, focused teams',
    cultureMeta: 'Execution pace can be intense',
    fitTitle: '9 of 14 requirements evidenced',
    fitMeta: 'Based on your current profile',
  },
  {
    id: 'phonepe', company: 'PhonePe', initials: 'PP', role: 'Backend Engineer III', location: 'Bengaluru', mode: 'Office',
    salary: '₹28–36L', rating: '4.1', reviews: '3.4k reviews', preferenceMatch: 83, readiness: 'Applied',
    experience: '6–10 yrs', estSalary: '₹31L', estBasis: '540 employee-reported salaries',
    cultureTitle: 'Strong pay, high intensity',
    cultureMeta: 'Long hours reported by some teams',
    fitTitle: 'Application already in progress',
    fitMeta: 'A recruiter is waiting on your reply',
    sourceLabel: 'Recruiter email', posted: 'Needs reply', reason: 'Already in conversation—replying is your highest-leverage move.', culture: 'Great pay · High intensity',
  },
  {
    id: 'razorline', company: 'Groww', initials: 'GR', role: 'Staff Backend Engineer', location: 'Bengaluru', mode: 'Hybrid',
    salary: '₹32–42L', rating: '3.7', reviews: '891 reviews', preferenceMatch: 76, readiness: '8/16',
    experience: '8–12 yrs', estSalary: '₹34L', estBasis: '134 employee-reported salaries',
    cultureTitle: 'High ownership, fast growth',
    cultureMeta: 'Process still forming in places',
    fitTitle: '8 of 16 requirements evidenced',
    fitMeta: 'Based on your current profile',
    sourceLabel: 'Company careers', posted: 'Today', reason: 'Compelling stretch role; stronger leadership evidence would help.', culture: 'Ownership · Rapid growth',
  },
]

/*
 * Ten more listings, added 2026-08-19 so the feed is long enough to browse and — more
 * usefully — so it carries the edge cases. AmbitionBox does not have depth on every
 * company, and a card that pretends otherwise is worse than one that says so:
 *
 *   · no `estSalary`     → the pay row shows the employer's posted range alone
 *   · no `cultureTitle`  → the culture row is left out rather than filled with a placeholder
 *   · neither, and no posted range → the pay row disappears too
 *
 * Every rating and salary here is prototype fixture data, consistent with the four above.
 */
export const moreJobs = [
  {
    id: 'swiggy', company: 'Swiggy', initials: 'SW', role: 'Senior Backend Engineer', location: 'Bengaluru', mode: 'Hybrid',
    salary: '₹26–34L', rating: '3.9', reviews: '2.1k reviews', preferenceMatch: 81, readiness: '9/15', experience: '5–9 yrs',
    sourceLabel: 'From Naukri', posted: '3d ago', culture: 'Scale problems · Fast shipping',
    estSalary: '₹29L', estBasis: '310 reported salaries',
    cultureTitle: 'Real scale, quick decisions', cultureMeta: 'On-call load is frequently mentioned',
    fitTitle: '9 of 15 requirements evidenced', fitMeta: 'Based on your current profile',
  },
  {
    id: 'zerodha', company: 'Zerodha', initials: 'ZR', role: 'Backend Engineer II', location: 'Bengaluru', mode: 'Office',
    salary: '₹22–30L', rating: '4.3', reviews: '640 reviews', preferenceMatch: 79, readiness: '10/13', experience: '4–8 yrs',
    sourceLabel: 'Company careers', posted: '5d ago', culture: 'Calm pace · Long tenure',
    estSalary: '₹25L', estBasis: '88 reported salaries',
    cultureTitle: 'Unusually calm for fintech', cultureMeta: 'Small teams, little process',
    fitTitle: '10 of 13 requirements evidenced', fitMeta: 'Based on your current profile',
  },
  {
    id: 'meesho', company: 'Meesho', initials: 'ME', role: 'Senior Software Engineer', location: 'Bengaluru', mode: 'Hybrid',
    salary: '₹28–38L', rating: '3.6', reviews: '1.1k reviews', preferenceMatch: 77, readiness: '8/15', experience: '5–9 yrs',
    sourceLabel: 'From AmbitionBox', posted: '1d ago', culture: 'High growth · Mixed WLB',
    estSalary: '₹32L', estBasis: '274 reported salaries',
    cultureTitle: 'Fast growth, shifting priorities', cultureMeta: 'Work-life balance reviews are mixed',
    fitTitle: '8 of 15 requirements evidenced', fitMeta: 'Based on your current profile',
  },
  {
    id: 'setu', company: 'Setu', initials: 'ST', role: 'Backend Engineer · Payments', location: 'Bengaluru', mode: 'Remote',
    salary: '₹24–32L', rating: '4.0', reviews: '120 reviews', preferenceMatch: 84, readiness: '11/14', experience: '4–8 yrs',
    sourceLabel: 'Company careers', posted: '2d ago', culture: 'Deep payments work',
    estSalary: '₹27L', estBasis: '41 reported salaries',
    cultureTitle: 'Deep payments work, small team', cultureMeta: 'Few reviews — read them yourself',
    fitTitle: '11 of 14 requirements evidenced', fitMeta: 'Based on your current profile',
  },
  // No salary estimate: too few reported salaries to publish one.
  {
    id: 'jupiter', company: 'Jupiter', initials: 'JU', role: 'Senior Backend Engineer', location: 'Bengaluru', mode: 'Hybrid',
    salary: '₹25–33L', rating: '3.8', reviews: '210 reviews', preferenceMatch: 78, readiness: '9/15', experience: '5–8 yrs',
    sourceLabel: 'From Naukri', posted: '4d ago', culture: 'Product-led · Small pods',
    cultureTitle: 'Product-led, small pods', cultureMeta: 'Reviewers mention flat structure',
    fitTitle: '9 of 15 requirements evidenced', fitMeta: 'Based on your current profile',
  },
  {
    id: 'khatabook', company: 'Khatabook', initials: 'KH', role: 'Backend Engineer III', location: 'Bengaluru', mode: 'Office',
    salary: '₹20–28L', rating: '3.5', reviews: '380 reviews', preferenceMatch: 72, readiness: '8/14', experience: '4–7 yrs',
    sourceLabel: 'From AmbitionBox', posted: '6d ago', culture: 'Bharat-scale problems',
    cultureTitle: 'Bharat-scale problems', cultureMeta: 'Reviews note frequent re-prioritisation',
    fitTitle: '8 of 14 requirements evidenced', fitMeta: 'Based on your current profile',
  },
  {
    id: 'slice', company: 'Slice', initials: 'SL', role: 'Senior Backend Engineer', location: 'Bengaluru', mode: 'Hybrid',
    salary: '₹27–35L', rating: '3.7', reviews: '450 reviews', preferenceMatch: 75, readiness: '9/15', experience: '5–9 yrs',
    sourceLabel: 'Company careers', posted: 'Today', culture: 'Consumer fintech pace',
    cultureTitle: 'Consumer fintech pace', cultureMeta: 'Reviews split on management',
    fitTitle: '9 of 15 requirements evidenced', fitMeta: 'Based on your current profile',
  },
  // No culture read: not enough reviews to summarise.
  {
    id: 'perfios', company: 'Perfios', initials: 'PE', role: 'Lead Backend Engineer', location: 'Bengaluru', mode: 'Office',
    salary: '₹30–40L', rating: '3.9', reviews: '58 reviews', preferenceMatch: 74, readiness: '10/16', experience: '7–11 yrs',
    sourceLabel: 'From Naukri', posted: '2d ago',
    estSalary: '₹33L', estBasis: '62 reported salaries',
    fitTitle: '10 of 16 requirements evidenced', fitMeta: 'Based on your current profile',
  },
  {
    id: 'decentro', company: 'Decentro', initials: 'DE', role: 'Backend Engineer · APIs', location: 'Remote', mode: 'Remote',
    salary: '₹22–29L', rating: '4.1', reviews: '34 reviews', preferenceMatch: 73, readiness: '9/13', experience: '4–7 yrs',
    sourceLabel: 'Company careers', posted: '1d ago',
    estSalary: '₹25L', estBasis: '19 reported salaries',
    fitTitle: '9 of 13 requirements evidenced', fitMeta: 'Based on your current profile',
  },
  // Neither: a company AmbitionBox has no depth on yet.
  {
    // Neither a posted range nor an estimate, so this card carries no pay row at all.
    id: 'nimbus', company: 'Nimbus Pay', initials: 'NP', role: 'Senior Backend Engineer', location: 'Pune', mode: 'Hybrid',
    salary: null, rating: null, reviews: 'No reviews yet', preferenceMatch: 70, readiness: '8/15', experience: '5–8 yrs',
    sourceLabel: 'Company careers', posted: 'Today',
    fitTitle: '8 of 15 requirements evidenced', fitMeta: 'Based on your current profile',
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
  applicationStages: {},
  phonepeReplied: false,
  naukriConnected: false,
  preferencesConfirmed: false,
  savedJobs: [],
  readiness: 10,
  resumeReady: false,
  javaConfirmed: null,
  interviewInvited: false,
  // The round has happened. Separate from `interviewInvited` because the screen's job
  // flips at that point: before it, prepare; after it, tell us how it went.
  interviewDone: false,
  interviewLogged: false,
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
  tracker: { ...initialJourney, emailConnected: true, importComplete: true, savedJobs: ['zerodha', 'setu'] },
  matches: { ...initialJourney, emailConnected: true, importComplete: true, phonepeReplied: true, naukriConnected: true, preferencesConfirmed: true, savedJobs: ['zerodha', 'setu'] },
  readiness: { ...initialJourney, emailConnected: true, importComplete: true, phonepeReplied: true, naukriConnected: true, preferencesConfirmed: true, savedJobs: ['juspay'] },
  resume: { ...initialJourney, emailConnected: true, importComplete: true, phonepeReplied: true, naukriConnected: true, preferencesConfirmed: true, savedJobs: ['juspay'], readiness: 14, resumeReady: true },
  interview: { ...initialJourney, emailConnected: true, importComplete: true, phonepeReplied: true, naukriConnected: true, preferencesConfirmed: true, savedJobs: ['juspay'], readiness: 14, resumeReady: true, javaConfirmed: false, interviewInvited: true },
  // Additive, for the states board: the onboarding handoff is otherwise unreachable by
  // URL, because `?preset=` bypasses session storage and every other preset ships
  // firstHomeArrival: false. Nothing else reads it.
  firstopen: { ...initialJourney, emailConnected: true, importComplete: true, firstHomeArrival: true, onboardingProfileConfirmed: true, onboardingPreferencesConfirmed: true, onboardingComplete: true },
  // The morning after the round. Prep is complete, the interview has happened, and
  // nothing has been logged about it yet.
  postinterview: { ...initialJourney, emailConnected: true, importComplete: true, phonepeReplied: true, naukriConnected: true, preferencesConfirmed: true, savedJobs: ['juspay'], readiness: 14, resumeReady: true, javaConfirmed: false, interviewInvited: true, roundConfirmed: 'confirmed', prepDecisionsCovered: 5, prepComplete: true, interviewDone: true },
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

/*
 * Readiness for the roles beyond the golden path, added 2026-09-10 so more than one job
 * opens. These are lighter than Juspay's on purpose: Juspay's readiness moves with the
 * journey — it is the role the résumé and prep flows act on — while these are a static
 * read of the same profile against a different requirement list.
 *
 * Groww carries no readiness at all. AmbitionBox does not have depth on every company,
 * and a role with nothing behind it is drawn as an absence with a line saying why, never
 * as a finding. That case has to exist here or the feed only ever shows the happy path.
 */
export const jobDetails = {
  zeta: {
    total: 14,
    fits: [
      '6 years of backend engineering', 'Payments and fintech systems', 'REST and gRPC API design',
      'Microservices architecture', 'PostgreSQL and data modelling', 'Redis and caching',
      'AWS production systems', 'Monitoring and incident response', 'Code reviews and mentoring',
    ],
    strengthen: ['Kafka at Zeta\u2019s volume', 'Ledger and reconciliation depth', 'On-call leadership'],
    missing: ['Kubernetes ownership', 'Formal system-design ownership'],
  },
  phonepe: {
    total: 16,
    fits: [
      '6 years of backend engineering', 'Payments and fintech systems', 'REST and gRPC API design',
      'Microservices architecture', 'PostgreSQL and data modelling', 'Redis and caching',
      'Kafka and event-driven systems', 'AWS production systems', 'Monitoring and incident response',
      'Code reviews and mentoring', 'UPI domain exposure',
    ],
    strengthen: ['Scale and throughput numbers', 'Cross-team technical leadership', 'Cost and capacity planning'],
    missing: ['Production Java', 'Kubernetes ownership'],
  },
  razorline: null,
}
