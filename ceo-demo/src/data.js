export const candidate = {
  name: 'Arjun Mehta',
  firstName: 'Arjun',
  initials: 'AM',
  title: 'Senior Backend Engineer',
  company: 'Razorpay',
  experience: '6 years',
  location: 'Bengaluru',
  currentPay: '₹15L',
  targetPay: '₹22L+',
  preferences: ['Senior backend', '₹22L+', 'Remote or light hybrid', 'Bengaluru'],
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
    { company: 'PhonePe', role: 'Backend Engineer III', action: 'Reply to recruiter', when: 'Today', color: '#5f259f' },
    { company: 'CRED', role: 'Senior Backend Engineer', action: 'Complete assessment', when: 'Due tomorrow', color: '#17192b' },
    { company: 'Google', role: 'Software Engineer III', action: 'Choose interview slots', when: 'Overdue', color: '#4285f4' },
  ],
  waiting: [
    { company: 'Amazon', role: 'SDE III', when: 'Applied 4d ago' },
    { company: 'Flipkart', role: 'Lead Software Engineer', when: 'Recruiter viewed' },
    { company: 'Swiggy', role: 'Backend Engineer', when: 'Applied 8d ago' },
    { company: 'Zeta', role: 'Senior Software Engineer', when: 'Interview completed' },
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

export const prepPlan = [
  { label: 'Juspay system design', detail: 'Payment reliability and idempotency', minutes: '25 min' },
  { label: 'Your evidence stories', detail: 'Scale, incidents, and ownership at Razorpay', minutes: '15 min' },
  { label: 'Company intelligence', detail: 'Culture themes from 847 employee reviews', minutes: '10 min' },
]

export const offer = {
  total: '₹28L',
  fixed: '₹23.5L',
  variable: '₹2.5L',
  joining: '₹2L',
  targetDelta: '27% above target',
  currentDelta: '87% above current',
  market: '₹24–30L',
}

export const initialJourney = {
  emailConnected: false,
  importComplete: false,
  phonepeReplied: false,
  naukriConnected: false,
  preferencesConfirmed: false,
  savedJobs: [],
  readiness: 10,
  resumeReady: false,
  javaConfirmed: null,
  interviewInvited: false,
  prepComplete: false,
  offerDetected: false,
  offerReviewed: false,
  negotiationSaved: false,
}

export const journeyPresets = {
  baseline: initialJourney,
  tracker: { ...initialJourney, emailConnected: true, importComplete: true },
  matches: { ...initialJourney, emailConnected: true, importComplete: true, phonepeReplied: true, naukriConnected: true, preferencesConfirmed: true },
  readiness: { ...initialJourney, emailConnected: true, importComplete: true, phonepeReplied: true, naukriConnected: true, preferencesConfirmed: true, savedJobs: ['juspay'] },
  resume: { ...initialJourney, emailConnected: true, importComplete: true, phonepeReplied: true, naukriConnected: true, preferencesConfirmed: true, savedJobs: ['juspay'], readiness: 14, resumeReady: true },
  interview: { ...initialJourney, emailConnected: true, importComplete: true, phonepeReplied: true, naukriConnected: true, preferencesConfirmed: true, savedJobs: ['juspay'], readiness: 14, resumeReady: true, interviewInvited: true },
  offer: { ...initialJourney, emailConnected: true, importComplete: true, phonepeReplied: true, naukriConnected: true, preferencesConfirmed: true, savedJobs: ['juspay'], readiness: 14, resumeReady: true, interviewInvited: true, prepComplete: true, offerDetected: true },
}

export const chapters = [
  { number: '01', title: 'The inbox becomes a tracker', path: '/tracker?flow=gmail', preset: 'baseline', duration: '1:15' },
  { number: '02', title: 'The right action rises to the top', path: '/home', preset: 'tracker', duration: '0:55' },
  { number: '03', title: 'Naukri becomes a transparent profile', path: '/matches?flow=naukri', preset: 'tracker', duration: '1:10' },
  { number: '04', title: 'One feed, every source explained', path: '/matches', preset: 'matches', duration: '1:05' },
  { number: '05', title: 'Evidence improves the résumé', path: '/jobs/juspay', preset: 'readiness', duration: '1:40' },
  { number: '06', title: 'Interview prep knows the whole story', path: '/prep/juspay', preset: 'interview', duration: '1:25' },
  { number: '07', title: 'The offer becomes a decision', path: '/offer/juspay', preset: 'offer', duration: '1:15' },
]
