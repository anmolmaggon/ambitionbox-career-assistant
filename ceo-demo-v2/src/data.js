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
  noticePeriod: '30 days',
  preferences: ['Senior backend', '₹22L+', 'Remote or light hybrid', 'Bengaluru'],
  confirmedEvidence: ['Kafka', 'Distributed systems', 'Payments', 'AWS', '31% fewer callback failures'],
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
  preferenceMatch: 89,
  readinessTotal: 15,
  initialReadiness: 10,
  verifiedReadiness: 14,
  applied: '5 days ago',
}

export const trackerStats = [
  { value: 3, label: 'Need you' },
  { value: 4, label: 'Monitored' },
  { value: 8, label: 'Closed' },
]

export const otherApplications = [
  { company: 'PhonePe', role: 'Backend Engineer III', status: 'Recruiter replied', tone: 'needs' },
  { company: 'CRED', role: 'Senior Backend Engineer', status: 'Assessment due tomorrow', tone: 'needs' },
  { company: 'Google', role: 'Software Engineer III', status: 'Choose interview slots', tone: 'needs' },
  { company: 'Amazon', role: 'SDE III', status: 'Monitoring inbox', tone: 'monitoring' },
]

export const followupDraft = `Hi Ananya,

I wanted to follow up on my application for the Senior Backend Engineer role. The opportunity to work on payment reliability at Juspay feels closely aligned with the systems I’ve owned at Razorpay.

I’d be glad to share any additional context that would be useful. Thank you for your time.

Best,
Arjun`

export const javaReplies = {
  yes: `Hi Ananya,

Yes — I have owned production Java services for more than three years, alongside Kafka-based payment systems and reliability work at Razorpay. I’d be happy to go deeper on that experience in the interview.

Best,
Arjun`,
  not_quite: `Hi Ananya,

I want to be precise: I’ve worked with Java in production, but I haven’t personally owned Java services for three full years. My strongest evidence is owning Kafka-based payment callback systems at Razorpay, including work that reduced peak-volume failures by 31%.

I’d be glad to discuss how that experience transfers to this role.

Best,
Arjun`,
}

export const interview = {
  title: 'System Design Interview',
  when: 'Tuesday, 11:00 AM',
  duration: '60 minutes',
  prepMinutes: 45,
  plan: [
    { label: 'Payment reliability', detail: 'Idempotency, retries, and ordering', minutes: '20 min' },
    { label: 'Your strongest evidence', detail: 'Scale, ownership, and the 31% result', minutes: '15 min' },
    { label: 'Juspay context', detail: 'Themes from 847 reviews and interview reports', minutes: '10 min' },
  ],
  prompt: 'Design an idempotent payment callback service.',
  promptContext: 'Juspay interview reports repeatedly surface payment reliability, retries, and trade-off depth.',
  demoAnswer: 'I’d assign an idempotency key at the payment-event boundary, persist processing state before side effects, and use Kafka partitions for per-payment ordering. Retries use exponential backoff with a DLQ; metrics cover lag, duplicate rate, and terminal failures.',
  coaching: 'You covered idempotency, ordering, retries, and observability. Make the safety boundary explicit: persist the state transition before publishing the callback, so a retry cannot repeat the external side effect.',
}

export const offer = {
  total: '₹28L',
  fixed: '₹23.5L',
  variable: '₹2.5L',
  joining: '₹2L',
  recurring: '₹26L',
  targetDelta: '27% above target',
  currentDelta: '87% above current',
  market: '₹24–30L',
}

export const negotiationDraft = `Hi Ananya,

Thank you again for the offer — I’m genuinely excited about the opportunity to join Juspay. Based on the role scope, my payments experience, and the ₹24–30L market range, would you be open to moving the total compensation closer to ₹30L, or shifting ₹1.5L from variable to fixed pay?

I’d be happy to discuss.

Best,
Arjun`

export const STAGES = [
  'post_import',
  'followup_review',
  'followup_sent',
  'recruiter_question',
  'reply_sent',
  'interview_ready',
  'practice_complete',
  'offer_detected',
  'negotiation_sent',
]

export const stageIndex = (stage) => STAGES.indexOf(stage)
export const stageAtLeast = (stage, target) => stageIndex(stage) >= stageIndex(target)

export const initialJourney = {
  stage: 'post_import',
  sendPermissionGranted: false,
  javaOwnership: null,
  followupDraft,
  replyDraft: '',
  practiceComplete: false,
  offerDecision: null,
  negotiationDraft,
}

export function stateForStage(stage) {
  const safeStage = STAGES.includes(stage) ? stage : 'post_import'
  return {
    ...initialJourney,
    stage: safeStage,
    sendPermissionGranted: stageAtLeast(safeStage, 'followup_sent'),
    javaOwnership: stageAtLeast(safeStage, 'reply_sent') ? 'not_quite' : null,
    replyDraft: stageAtLeast(safeStage, 'reply_sent') ? javaReplies.not_quite : '',
    practiceComplete: stageAtLeast(safeStage, 'practice_complete'),
    offerDecision: stageAtLeast(safeStage, 'negotiation_sent') ? 'negotiate' : null,
  }
}

export const journeyPresets = {
  post_import: stateForStage('post_import'),
  followup: stateForStage('followup_review'),
  question: { ...stateForStage('recruiter_question'), sendPermissionGranted: true },
  interview: stateForStage('interview_ready'),
  offer: stateForStage('offer_detected'),
  finale: stateForStage('negotiation_sent'),
}

export const chapters = [
  { number: '01', title: 'AmbitionBox is already working', detail: 'The tracker becomes active monitoring.', path: '/today', preset: 'post_import', duration: '0:45' },
  { number: '02', title: 'The chasing is handled', detail: 'Review one prepared follow-up.', path: '/applications/juspay', preset: 'followup', duration: '1:20' },
  { number: '03', title: 'Only one thing needs Arjun', detail: 'Confirm what the system cannot know.', path: '/applications/juspay', preset: 'question', duration: '1:05' },
  { number: '04', title: 'Interview prep is waiting', detail: 'The work arrives before the task.', path: '/applications/juspay', preset: 'interview', duration: '1:15' },
  { number: '05', title: 'The offer becomes a decision', detail: 'Decode, decide, and approve.', path: '/applications/juspay', preset: 'offer', duration: '1:20' },
]

export function activityForJourney(journey) {
  const events = [
    { id: 'gmail', time: '09:41', day: 'THU', title: 'Gmail connected', detail: 'Only job-search emails · read only', source: 'GMAIL', status: 'done' },
    { id: 'mapped', time: '09:42', day: 'THU', title: '15 applications organised', detail: '3 need you · 4 monitored · 8 closed', source: 'CAREER ASSISTANT', status: 'done' },
    { id: 'juspay', time: '09:43', day: 'THU', title: 'Juspay follow-up prepared', detail: 'No reply for 5 days. Nothing sent.', source: 'GMAIL + PROFILE', status: stageAtLeast(journey.stage, 'followup_sent') ? 'done' : 'needs' },
  ]

  if (stageAtLeast(journey.stage, 'followup_sent')) events.push({ id: 'sent', time: '09:47', day: 'THU', title: 'Follow-up sent with approval', detail: 'Monitoring the recruiter thread now', source: 'APPROVED BY ARJUN', status: 'done' })
  if (stageAtLeast(journey.stage, 'recruiter_question')) events.push({ id: 'question', time: '10:16', day: 'MON', title: 'Recruiter replied', detail: 'One experience detail needs Arjun', source: 'GMAIL · JUST NOW', status: stageAtLeast(journey.stage, 'reply_sent') ? 'done' : 'needs' })
  if (stageAtLeast(journey.stage, 'reply_sent')) events.push({ id: 'honest', time: '10:21', day: 'MON', title: 'Honest context sent', detail: 'Java gap visible; confirmed evidence included', source: 'APPROVED BY ARJUN', status: 'done' })
  if (stageAtLeast(journey.stage, 'interview_ready')) events.push({ id: 'interview', time: '16:04', day: 'TUE', title: 'Interview detected and prep completed', detail: 'A focused 45-minute plan is ready', source: 'GMAIL + AMBITIONBOX', status: stageAtLeast(journey.stage, 'practice_complete') ? 'done' : 'active' })
  if (stageAtLeast(journey.stage, 'practice_complete')) events.push({ id: 'practice', time: '18:32', day: 'TUE', title: 'Highest-impact practice saved', detail: 'Monitoring resumes automatically', source: 'CAREER ASSISTANT', status: 'done' })
  if (stageAtLeast(journey.stage, 'offer_detected')) events.push({ id: 'offer', time: '11:08', day: 'FRI', title: '₹28L offer detected and decoded', detail: 'A decision and negotiation are ready', source: 'GMAIL + SALARY DATA', status: stageAtLeast(journey.stage, 'negotiation_sent') ? 'done' : 'needs' })
  if (stageAtLeast(journey.stage, 'negotiation_sent')) events.push({ id: 'negotiation', time: '11:14', day: 'FRI', title: 'Negotiation sent with approval', detail: 'Watching the thread for the next reply', source: 'APPROVED BY ARJUN', status: 'monitoring' })
  return events
}
