import { Check, Database, Mail, ShieldCheck, Target } from 'lucide-react'
import { candidate, juspay } from '../data'
import { Screen, SourceLabel, Topbar } from '../components/Shell'

export function ProfileScreen() {
  return <Screen active="profile" className="profile-screen">
    <Topbar />
    <section className="profile-hero page-pad">
      <span className="profile-avatar">AM</span>
      <div><p className="date-line">CAREER MEMORY</p><h1>{candidate.name}</h1><span>{candidate.title} at {candidate.company}</span></div>
    </section>

    <section className="memory-section page-pad">
      <div className="section-heading"><div><span>KNOWN CONTEXT</span><h2>Built once. Used everywhere.</h2></div><Database size={19} /></div>
      <dl className="fact-list">
        <div><dt>Experience</dt><dd>{candidate.experience}</dd></div>
        <div><dt>Location</dt><dd>{candidate.location}</dd></div>
        <div><dt>Current compensation</dt><dd>{candidate.currentPay}</dd></div>
        <div><dt>Target compensation</dt><dd>{candidate.targetPay}</dd></div>
        <div><dt>Notice period</dt><dd>{candidate.noticePeriod}</dd></div>
      </dl>
    </section>

    <section className="evidence-section page-pad">
      <div className="evidence-score"><span><strong>{juspay.verifiedReadiness}/{juspay.readinessTotal}</strong><small>verified signals for Juspay</small></span><SourceLabel>10/15 before review</SourceLabel></div>
      <div className="evidence-tags">{candidate.confirmedEvidence.map((item) => <span key={item}><Check size={13} />{item}</span>)}</div>
      <div className="gap-row"><ShieldCheck size={17} /><span><strong>One gap stays explicit</strong><small>3+ years owning production Java cannot be inferred.</small></span></div>
    </section>

    <section className="sources-section page-pad">
      <div className="section-heading"><div><span>SOURCES</span><h2>Where this context came from</h2></div></div>
      <div className="source-row"><Mail size={18} /><span><strong>Gmail</strong><small>Job-search threads · synced now</small></span><SourceLabel tone="monitoring">CONNECTED</SourceLabel></div>
      <div className="source-row"><Target size={18} /><span><strong>Arjun’s confirmations</strong><small>Preferences and evidence · user controlled</small></span><SourceLabel>VERIFIED</SourceLabel></div>
    </section>
  </Screen>
}
