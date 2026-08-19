import { ArrowRight, Eye, MailCheck, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { activityForJourney, candidate, juspay, stageAtLeast, trackerStats } from '../data'
import { ActivitySpine } from '../components/ActivitySpine'
import { CompanyMark, Screen, SourceLabel, Topbar } from '../components/Shell'
import { go } from '../navigation'
import { useJourney } from '../store'

function actionForStage(stage) {
  if (stage === 'post_import' || stage === 'followup_review') return { eyebrow: 'ONE REVIEW READY', title: 'Juspay has been quiet for 5 days.', body: 'I checked the thread, matched it to your profile, and prepared a follow-up. Nothing has been sent.', cta: 'Review the follow-up', next: 'followup_review' }
  if (stage === 'followup_sent') return { eyebrow: 'MONITORING', title: 'The follow-up is sent. I’m watching the thread.', body: 'There’s nothing for you to manage right now.', cta: 'See what happened 3 days later', next: 'recruiter_question' }
  if (stage === 'recruiter_question') return { eyebrow: 'ONE THING NEEDS YOU', title: 'The recruiter asked something I can’t verify.', body: 'Everything else is handled. Confirm one detail about your Java ownership.', cta: 'Answer one thing', next: null }
  if (stage === 'reply_sent') return { eyebrow: 'MONITORING', title: 'Your honest reply is sent.', body: 'I kept the Java gap visible and used your confirmed payments evidence.', cta: 'Open interview update', next: 'interview_ready' }
  if (stage === 'interview_ready') return { eyebrow: 'PREP ALREADY READY', title: 'Juspay wants to interview you.', body: 'I built a 45-minute plan from the role, company patterns, and your strongest evidence.', cta: 'Open my prepared plan', next: null }
  if (stage === 'practice_complete') return { eyebrow: 'MONITORING', title: 'You’re prepared. I’m watching what comes next.', body: 'Your practice is saved and the application timeline is current.', cta: 'Jump to offer day', next: 'offer_detected' }
  if (stage === 'offer_detected') return { eyebrow: 'DECISION READY', title: 'Juspay offered ₹28L.', body: 'I decoded every component, checked the market range, and prepared a credible negotiation.', cta: 'Understand my offer', next: null }
  return { eyebrow: 'MONITORING', title: 'Negotiation sent. I’m watching the thread.', body: 'You approved every word. I’ll surface the next reply when it arrives.', cta: 'View the full journey', next: null }
}

export function TodayScreen() {
  const { journey, advance } = useJourney()
  const action = actionForStage(journey.stage)
  const events = activityForJourney(journey)

  const openAction = () => {
    if (action.next) advance(action.next)
    go('/applications/juspay')
  }

  return <Screen active="today" className="today-screen">
    <Topbar />
    <section className="today-intro page-pad">
      <div className="monitoring-line"><span className="monitoring-dot" /><strong>Career monitoring is on</strong><small>Gmail synced now</small></div>
      <p className="date-line">THURSDAY · YOUR SEARCH</p>
      <h1>Good morning, {candidate.firstName}.</h1>
      <p>While you were away, your job search kept moving.</p>
    </section>

    <section className="search-strip page-pad" aria-label="Application summary">
      <div><strong>15</strong><span>applications organised</span></div>
      {trackerStats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
    </section>

    <motion.section className="decision-hero" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="decision-hero__top"><SourceLabel tone={action.eyebrow.includes('MONITORING') ? 'monitoring' : 'needs'}>{action.eyebrow}</SourceLabel><span>{stageAtLeast(journey.stage, 'recruiter_question') ? 'Updated now' : 'Prepared 2m ago'}</span></div>
      <div className="opportunity-line"><CompanyMark /><span><strong>{juspay.company}</strong><small>{juspay.role}</small></span><span className="match-score">{juspay.preferenceMatch}% fit</span></div>
      <h2>{action.title}</h2>
      <p>{action.body}</p>
      <button className="primary-button primary-button--ink" onClick={openAction}>{action.cta} <ArrowRight size={17} /></button>
    </motion.section>

    <section className="activity-section page-pad">
      <div className="section-heading"><div><span>WORK LOG</span><h2>What AmbitionBox handled</h2></div><Eye size={19} /></div>
      <ActivitySpine events={events.slice(-5)} />
    </section>

    <section className="quiet-note page-pad"><MailCheck size={18} /><span><strong>No inbox to manage.</strong><small>I’ll bring back the one decision that needs you.</small></span><Sparkles size={16} /></section>
  </Screen>
}
