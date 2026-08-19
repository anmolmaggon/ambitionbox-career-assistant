import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight, CalendarDays, Check, CheckCircle2, Clock3, Eye, Mail,
  MessageSquareText, ShieldCheck, Sparkles, Target, TrendingUp,
} from 'lucide-react'
import {
  activityForJourney, interview, javaReplies, juspay, offer, stageAtLeast,
} from '../data'
import { go } from '../navigation'
import { useJourney } from '../store'
import { ActivitySpine } from '../components/ActivitySpine'
import { EmailReview } from '../components/EmailReview'
import { CompanyMark, Screen, SourceLabel, Topbar } from '../components/Shell'

function WorkspaceHeader({ stage }) {
  let status = 'Follow-up ready'
  if (stageAtLeast(stage, 'negotiation_sent')) status = 'Negotiation sent · Monitoring'
  else if (stageAtLeast(stage, 'offer_detected')) status = 'Offer received'
  else if (stageAtLeast(stage, 'interview_ready')) status = 'Interview scheduled'
  else if (stageAtLeast(stage, 'recruiter_question')) status = 'Recruiter replied'
  else if (stageAtLeast(stage, 'followup_sent')) status = 'Follow-up sent · Monitoring'

  return <section className="workspace-head page-pad">
    <CompanyMark />
    <div><span className="date-line">JUSPAY · APPLICATION</span><h1>{juspay.role}</h1><p>{juspay.location} · {juspay.mode} · {juspay.salary}</p></div>
    <span className="workspace-status"><i />{status}</span>
  </section>
}

function SentMoment({ label, title, body, nextLabel, onNext, icon = Mail }) {
  const Icon = icon
  return <motion.section className="moment-state page-pad" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
    <span className="moment-icon"><Icon size={25} /><i><Check size={13} /></i></span>
    <SourceLabel tone="monitoring">{label}</SourceLabel>
    <h2>{title}</h2>
    <p>{body}</p>
    <div className="monitoring-card"><Eye size={19} /><span><strong>Monitoring is active</strong><small>The next recruiter email will update this journey automatically.</small></span><i /></div>
    <button className="primary-button" onClick={onNext}>{nextLabel} <ArrowRight size={17} /></button>
    <button className="text-button" onClick={() => go('/today')}>Return to Today</button>
  </motion.section>
}

function FollowupReview({ journey, save, advance }) {
  const [permission, setPermission] = useState(journey.sendPermissionGranted)
  return <motion.section className="workspace-section page-pad" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="context-heading"><SourceLabel tone="needs">REVIEW READY</SourceLabel><span>Prepared 2 min ago</span></div>
    <h2>The chasing is already handled.</h2>
    <p className="lead-copy">Juspay has been quiet for five days. I checked the recruiter thread, matched it to your profile, and wrote the next move.</p>
    <div className="reasoning-strip">
      <div><Clock3 size={17} /><span><strong>5 days quiet</strong><small>Since application confirmation</small></span></div>
      <div><Target size={17} /><span><strong>Strong reason to follow up</strong><small>89% Preference Match</small></span></div>
      <div><ShieldCheck size={17} /><span><strong>Your evidence only</strong><small>No invented claims</small></span></div>
    </div>
    <EmailReview
      label="Follow-up to Ananya · Juspay recruiting"
      value={journey.followupDraft}
      onChange={(value) => save({ followupDraft: value })}
      permissionRequired
      permissionGranted={permission}
      onPermissionChange={setPermission}
      onSend={() => advance('followup_sent', { sendPermissionGranted: true })}
      onKeepDraft={() => go('/today')}
    />
  </motion.section>
}

function RecruiterQuestion({ journey, save, advance }) {
  const choose = (choice) => save({ javaOwnership: choice, replyDraft: javaReplies[choice] })
  return <motion.section className="workspace-section page-pad" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="context-heading"><SourceLabel tone="needs">GMAIL · JUST NOW</SourceLabel><span>1 unread</span></div>
    <h2>The recruiter replied.<br />Only one thing needs you.</h2>
    <blockquote className="email-quote"><Mail size={18} /><p>“Could you confirm whether you’ve personally owned production Java services for 3+ years?”</p><cite>Ananya · Juspay recruiting</cite></blockquote>
    <div className="known-context">
      <span className="known-context__icon"><Sparkles size={18} /></span>
      <span><strong>I handled everything I could verify.</strong><small>Your availability, notice period, payments experience, and Kafka evidence are already known. This ownership claim is not.</small></span>
    </div>
    <fieldset className="honest-choice">
      <legend>Did you personally own production Java services for 3+ years?</legend>
      <button type="button" className={journey.javaOwnership === 'yes' ? 'is-selected' : ''} onClick={() => choose('yes')}><CheckCircle2 size={18} /> Yes, I did</button>
      <button type="button" className={journey.javaOwnership === 'not_quite' ? 'is-selected' : ''} onClick={() => choose('not_quite')}><ShieldCheck size={18} /> Not quite</button>
    </fieldset>
    {journey.javaOwnership && <AnimatePresence mode="wait"><motion.div key={journey.javaOwnership} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      {journey.javaOwnership === 'not_quite' && <div className="honesty-result"><ShieldCheck size={17} /><span><strong>The gap stays visible.</strong><small>I repositioned the reply around confirmed Kafka, payments, and reliability evidence.</small></span></div>}
      <EmailReview
        label="Reply to Ananya · Juspay recruiting"
        value={journey.replyDraft}
        onChange={(value) => save({ replyDraft: value })}
        onSend={() => advance('reply_sent')}
      />
    </motion.div></AnimatePresence>}
  </motion.section>
}

function InterviewReady({ advance }) {
  const [panel, setPanel] = useState(() => new URLSearchParams(window.location.search).get('view') === 'practice' ? 'practice' : 'plan')
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(false)

  if (panel === 'practice') return <motion.section className="workspace-section page-pad practice-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="practice-meta"><SourceLabel tone="needs">SYSTEM DESIGN · 1 OF 3</SourceLabel><span>~8 min</span></div>
    <h2>{interview.prompt}</h2>
    <p className="lead-copy">{interview.promptContext}</p>
    <div className="decision-list"><strong>Cover these decisions</strong><span>Duplicate callbacks · Retry strategy · Ordering · Failure recovery · Observability</span></div>
    <label className="answer-box"><span>Your approach</span><textarea value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Talk through the architecture and trade-offs…" /></label>
    <button className="assist-button" onClick={() => setAnswer(interview.demoAnswer)}><Sparkles size={16} /> Use demo answer</button>
    {!feedback ? <button className="primary-button" disabled={!answer.trim()} onClick={() => setFeedback(true)}>Get coaching <ArrowRight size={17} /></button> : <motion.div className="coaching-panel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div><span className="moment-icon moment-icon--small"><Check size={17} /></span><span><strong>Strong foundation</strong><small>Grounded in your Razorpay evidence</small></span></div>
      <p>{interview.coaching}</p>
      <div className="add-line"><span>MAKE THIS EXPLICIT</span>“Persist the state transition before the external side effect.”</div>
      <button className="primary-button" onClick={() => advance('practice_complete', { practiceComplete: true })}>Save practice <Check size={17} /></button>
    </motion.div>}
  </motion.section>

  return <motion.section className="workspace-section page-pad" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="context-heading"><SourceLabel tone="monitoring">GMAIL DETECTED</SourceLabel><span>Tuesday · 11:00 AM</span></div>
    <h2>Your interview prep<br />is already waiting.</h2>
    <p className="lead-copy">The invitation arrived. I combined Juspay’s role, interview patterns, company reviews, and your confirmed evidence into one focused plan.</p>
    <div className="interview-invite"><CalendarDays size={22} /><span><strong>{interview.title}</strong><small>{interview.when} · {interview.duration}</small></span><SourceLabel>JUSPAY</SourceLabel></div>
    <div className="plan-heading"><span>{interview.prepMinutes} MINUTE PLAN</span><strong>Already prepared</strong></div>
    <div className="prep-plan">{interview.plan.map((item, index) => <div key={item.label}><span>0{index + 1}</span><span><strong>{item.label}</strong><small>{item.detail}</small></span><time>{item.minutes}</time></div>)}</div>
    <div className="grounded-note"><ShieldCheck size={16} /> Grounded in the job, 847 reviews, interview reports, and Arjun’s confirmed evidence.</div>
    <button className="primary-button" onClick={() => setPanel('practice')}>Start highest-impact practice <ArrowRight size={17} /></button>
  </motion.section>
}

function OfferDecision({ journey, save, advance }) {
  const [panel, setPanel] = useState(() => new URLSearchParams(window.location.search).get('view') === 'negotiate' ? 'negotiate' : 'details')
  if (panel === 'negotiate') return <motion.section className="workspace-section page-pad" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="context-heading"><SourceLabel tone="needs">RECOMMENDATION READY</SourceLabel><span>Nothing sent</span></div>
    <h2>Ask for ₹30L—or move ₹1.5L into fixed pay.</h2>
    <p className="lead-copy">The role’s market ceiling and your confirmed payments experience support a calm, specific ask.</p>
    <EmailReview
      label="Negotiation to Ananya · Juspay recruiting"
      value={journey.negotiationDraft}
      onChange={(value) => save({ negotiationDraft: value })}
      onSend={() => advance('negotiation_sent', { offerDecision: 'negotiate' })}
      sendLabel="Approve and send negotiation"
    />
  </motion.section>

  return <motion.section className="workspace-section page-pad offer-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="context-heading"><SourceLabel tone="monitoring">GMAIL DETECTED · OFFER</SourceLabel><span>Received today</span></div>
    <div className="offer-celebration"><span className="moment-icon"><Check size={23} /></span><h2>You got the offer, Arjun.</h2><p>Juspay would like you to join as Senior Backend Engineer.</p></div>
    <div className="offer-amount"><span>TOTAL COMPENSATION</span><strong>{offer.total}</strong><small>per year</small></div>
    <div className="offer-verdict"><TrendingUp size={19} /><span><strong>Strong offer. Still room to improve it.</strong><small>{offer.currentDelta} · {offer.targetDelta}</small></span></div>
    <div className="comparison-list">
      <div><span>Current pay</span><i><b style={{ width: '50%' }} /></i><strong>{candidatePay()}</strong></div>
      <div><span>Your target</span><i><b style={{ width: '73%' }} /></i><strong>₹22L</strong></div>
      <div className="is-active"><span>Juspay offer</span><i><b style={{ width: '93%' }} /></i><strong>{offer.total}</strong></div>
      <div><span>Market range</span><i className="range"><b /></i><strong>{offer.market}</strong></div>
    </div>
    <div className="offer-breakdown"><div><span>Fixed pay</span><strong>{offer.fixed}</strong></div><div><span>Performance variable</span><strong>{offer.variable}</strong></div><div><span>One-time joining bonus</span><strong>{offer.joining}</strong></div><p>Recurring annual compensation is {offer.recurring}.</p></div>
    <button className="primary-button" onClick={() => setPanel('negotiate')}>Review negotiation strategy <ArrowRight size={17} /></button>
  </motion.section>
}

function candidatePay() { return '₹15L' }

function Finale({ journey }) {
  return <motion.section className="workspace-section page-pad finale-section" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
    <span className="finale-pulse"><Check size={24} /></span>
    <SourceLabel tone="monitoring">APPROVED BY ARJUN</SourceLabel>
    <h2>Negotiation sent.<br />I’m watching the thread.</h2>
    <p>You approved every word. AmbitionBox will surface the next reply—not another inbox to manage.</p>
    <ActivitySpine events={activityForJourney(journey)} compact />
    <button className="primary-button" onClick={() => go('/today')}>Return to Today <ArrowRight size={17} /></button>
    <button className="secondary-button" onClick={() => go('/demo')}>Back to presenter</button>
  </motion.section>
}

export function ApplicationScreen() {
  const { journey, advance, save } = useJourney()

  useEffect(() => {
    document.title = `Juspay application · AmbitionBox`
    return () => { document.title = 'AmbitionBox Career Assistant — CEO Demo V2' }
  }, [])

  const renderStage = () => {
    if (journey.stage === 'post_import') return <motion.section className="workspace-section page-pad" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><SourceLabel tone="needs">FOLLOW-UP READY</SourceLabel><h2>This application already has a next move.</h2><p className="lead-copy">AmbitionBox checked the thread, your profile, and the role context. Nothing has been sent.</p><button className="primary-button" onClick={() => advance('followup_review')}>Review the follow-up <ArrowRight size={17} /></button></motion.section>
    if (journey.stage === 'followup_review') return <FollowupReview journey={journey} save={save} advance={advance} />
    if (journey.stage === 'followup_sent') return <SentMoment label="SENT WITH YOUR APPROVAL" title="Follow-up sent. The chasing stays with me." body="The exact message you reviewed is now in the recruiter thread. I’ll keep watching for the reply." nextLabel="See what happened 3 days later" onNext={() => advance('recruiter_question')} />
    if (journey.stage === 'recruiter_question') return <RecruiterQuestion journey={journey} save={save} advance={advance} />
    if (journey.stage === 'reply_sent') return <SentMoment label="HONEST REPLY SENT" title="The gap stayed visible. Your strongest evidence moved forward." body="Your reply uses only confirmed experience. Monitoring resumed the moment it was sent." nextLabel="Open interview update" onNext={() => advance('interview_ready')} icon={MessageSquareText} />
    if (journey.stage === 'interview_ready') return <InterviewReady advance={advance} />
    if (journey.stage === 'practice_complete') return <SentMoment label="PREP SAVED" title="You’re prepared. I’m watching what comes next." body="Your sharper system-design answer is saved with the Juspay journey. There’s nothing else to manage right now." nextLabel="Jump to offer day" onNext={() => advance('offer_detected')} icon={Sparkles} />
    if (journey.stage === 'offer_detected') return <OfferDecision journey={journey} save={save} advance={advance} />
    return <Finale journey={journey} />
  }

  return <Screen className="application-screen">
    <Topbar back="/today" title="Application journey" eyebrow="JUSPAY" />
    <WorkspaceHeader stage={journey.stage} />
    <AnimatePresence mode="wait">{renderStage()}</AnimatePresence>
  </Screen>
}
