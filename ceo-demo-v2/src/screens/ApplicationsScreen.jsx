import { ArrowRight, Check, Search } from 'lucide-react'
import { activityForJourney, juspay, otherApplications, stageAtLeast } from '../data'
import { AppLink } from '../navigation'
import { CompanyMark, Screen, SourceLabel, Topbar } from '../components/Shell'
import { useJourney } from '../store'

function juspayStatus(stage) {
  if (stageAtLeast(stage, 'negotiation_sent')) return 'Negotiation sent · Monitoring'
  if (stageAtLeast(stage, 'offer_detected')) return 'Offer received · Needs decision'
  if (stageAtLeast(stage, 'interview_ready')) return 'Interview · Prep ready'
  if (stageAtLeast(stage, 'recruiter_question')) return 'Recruiter replied'
  if (stageAtLeast(stage, 'followup_sent')) return 'Follow-up sent · Monitoring'
  return 'Follow-up ready for review'
}

export function ApplicationsScreen() {
  const { journey } = useJourney()
  const eventCount = activityForJourney(journey).length
  return <Screen active="applications" className="applications-screen">
    <Topbar />
    <section className="page-pad applications-head">
      <p className="date-line">APPLICATIONS</p>
      <h1>Every thread,<br />kept current.</h1>
      <p>Statuses come from the evidence already in your inbox.</p>
      <label className="search-field"><Search size={17} /><span>Search 15 applications</span></label>
    </section>

    <section className="application-list page-pad">
      <SourceLabel tone="needs">FOCUS APPLICATION</SourceLabel>
      <AppLink to="/applications/juspay" className="application-row application-row--focus">
        <CompanyMark />
        <span className="application-row__copy"><strong>{juspay.company}</strong><small>{juspay.role}</small><span>{juspayStatus(journey.stage)}</span></span>
        <span className="event-count">{eventCount}<small>events</small></span>
        <ArrowRight size={17} />
      </AppLink>
      <div className="list-divider"><span>OTHER ACTIVE THREADS</span><strong>4</strong></div>
      {otherApplications.map((item) => <div className="application-row" key={item.company}>
        <span className="letter-mark">{item.company.slice(0, 2).toUpperCase()}</span>
        <span className="application-row__copy"><strong>{item.company}</strong><small>{item.role}</small><span>{item.status}</span></span>
        {item.tone === 'monitoring' ? <span className="monitor-tick"><i /> Watching</span> : <span className="needs-tick">Needs you</span>}
      </div>)}
      <div className="list-complete"><Check size={16} /><span>8 closed applications are filed and searchable.</span></div>
    </section>
  </Screen>
}
