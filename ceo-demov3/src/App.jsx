import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, Bell, Bookmark, BriefcaseBusiness, Building2, Check, CheckCircle2,
  ChevronDown, ChevronRight, CircleDollarSign, CircleUserRound, Clock3, Copy, ExternalLink,
  FileCheck2, Home, Info, Link2, Mail, MapPin, MessageCircle, MoreHorizontal, Pencil,
  Play, Plus, RefreshCcw, Search, Send, ShieldCheck, SlidersHorizontal, Sparkles, Star, Target,
  TrendingUp, UserRoundCheck, Users, X,
} from 'lucide-react'
import {
  applications, candidate, chapters, interviewIntel, jobs, juspay, offer, offerDecision, trackerStats,
} from './data'
import { useJourney } from './store'
import { OnboardingScreen, ProfileScreen } from './Onboarding'
import { HomeScreen } from './Home'
import {
  AssistantDock, CompanyLogo, Logo, Pill, ProgressRing, Screen, Sheet, Topbar, go,
} from './AppUI'

function useLocation() {
  const [location, setLocation] = useState(() => ({ pathname: window.location.pathname, search: window.location.search }))
  useEffect(() => {
    const onPop = () => setLocation({ pathname: window.location.pathname, search: window.location.search })
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  return location
}

function App() {
  const { pathname, search } = useLocation()
  const routes = {
    '/': DemoLauncher,
    '/demo': DemoLauncher,
    '/onboarding': OnboardingScreen,
    '/home': HomeScreen,
    '/profile': ProfileScreen,
    '/tracker': TrackerScreen,
    '/matches': MatchesScreen,
    '/jobs/juspay': JobDetailScreen,
    '/assistant/juspay': AssistantScreen,
    '/prep/juspay': PrepScreen,
    '/offer/juspay': OfferScreen,
  }
  const Component = routes[pathname] || DemoLauncher
  const openingStory = pathname === '/offer/juspay' && new URLSearchParams(search).get('story') === 'opening'
  return <div className={`stage ${openingStory ? 'stage--presenter' : ''}`}><div className="phone-shell"><a className="skip-link" href="#main-content">Skip to content</a><Component key={`${pathname}${search}`} /></div>{openingStory && <PresenterRail />}</div>
}

function PresenterRail() {
  const { reset } = useJourney()
  const rewind = () => { reset(); go('/onboarding?preset=baseline') }
  return <aside className="presenter-rail" aria-label="Presenter controls"><span>PRESENTER CONTROL</span><strong>Outcome shown. Start the story.</strong><button onClick={rewind}><RefreshCcw size={16} /> Rewind to the beginning</button></aside>
}

function DemoLauncher() {
  const { applyPreset, reset } = useJourney()
  const [resetDone, setResetDone] = useState(false)

  const openChapter = (chapter) => {
    applyPreset(chapter.preset)
    go(chapter.path)
  }
  const start = () => { applyPreset('offer'); go('/offer/juspay?stage=notification&story=opening') }
  const resetDemo = () => { reset(); setResetDone(true); setTimeout(() => setResetDone(false), 1800) }

  return (
    <main id="main-content" className="launcher">
      <div className="launcher-hero">
        <div className="launcher-top"><Logo /><button className="icon-button glass" aria-label="More options"><MoreHorizontal size={20} /></button></div>
        <Pill tone="inverted">CEO DEMO · 10 MIN</Pill>
        <h1>Your entire job search.<br /><em>Finally working together.</em></h1>
        <p>Follow Arjun from a scattered inbox to a confident ₹28L offer decision.</p>
        <button className="primary-button primary-button--light" onClick={start}><Play size={18} fill="currentColor" /> Start golden path</button>
      </div>

      <section className="launcher-body">
        <div className="section-heading"><div><span className="eyebrow">PRESENTER MODE</span><h2>Jump to a chapter</h2></div><span className="status-dot"><span /> Ready</span></div>
        <div className="chapter-list">
          {chapters.map((chapter) => (
            <button className="chapter-row" key={chapter.number} onClick={() => openChapter(chapter)}>
              <span className="chapter-number">{chapter.number}</span>
              <span><strong>{chapter.title}</strong><small>{chapter.duration}</small></span>
              <ChevronRight size={19} />
            </button>
          ))}
        </div>
        <button className="secondary-button reset-button" onClick={resetDemo}>
          {resetDone ? <Check size={18} /> : <RefreshCcw size={17} />}{resetDone ? 'Demo reset' : 'Reset all demo data'}
        </button>
        <p className="launcher-note"><ShieldCheck size={15} /> Deterministic simulation. No real email, application, or account access.</p>
      </section>
    </main>
  )
}

function TrackerScreen() {
  const { journey, update } = useJourney()
  const params = new URLSearchParams(window.location.search)
  const initialStep = params.get('step') || null
  const [step, setStep] = useState(initialStep)
  const [progress, setProgress] = useState(0)
  const [section, setSection] = useState('attention')
  const [viewMode, setViewMode] = useState(params.get('view') === 'board' ? 'board' : 'list')
  const [emailProvider, setEmailProvider] = useState('gmail')
  const [searchOpen, setSearchOpen] = useState(false)
  const [manualOpen, setManualOpen] = useState(false)
  const [actionNotice, setActionNotice] = useState('')
  const manualApplications = journey.manualApplications || []
  const hasTrackerContent = journey.emailConnected || manualApplications.length > 0
  const attentionCount = journey.emailConnected ? (journey.phonepeReplied ? 2 : 3) + (journey.interviewInvited ? 1 : 0) : 0
  const totalApplications = (journey.emailConnected ? 15 : 0) + manualApplications.length
  const visibleAttention = applications.attention
    .filter((item) => !(journey.phonepeReplied && item.company === 'PhonePe'))
    .slice(0, Math.max(0, attentionCount - 1))
  const displayStats = trackerStats.map((stat) => ({
    ...stat,
    value: !journey.emailConnected
      ? (stat.tone === 'waiting' ? manualApplications.length : 0)
      : stat.tone === 'attention'
        ? attentionCount
        : stat.tone === 'waiting'
          ? stat.value + manualApplications.length
          : stat.value,
  }))

  useEffect(() => {
    if (step !== 'scanning') return
    setProgress(8)
    const interval = setInterval(() => setProgress((p) => Math.min(p + 7, 94)), 420)
    const timer = setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      update({ emailConnected: true, importComplete: true })
      setStep('result')
    }, 5600)
    return () => { clearInterval(interval); clearTimeout(timer) }
  }, [step, update])

  const finishImport = () => {
    setProgress(100)
    update({ emailConnected: true, importComplete: true })
    setStep('result')
  }

  const connectEmail = (provider) => {
    setEmailProvider(provider)
    setStep('account')
  }

  const addManualApplication = (application) => {
    update({ manualApplications: [...manualApplications, application] })
    setManualOpen(false)
    setSection('waiting')
  }

  const openJuspayInterview = () => {
    if (!journey.interviewInvited) update({ interviewInvited: true })
    go('/prep/juspay?stage=invite&round=open')
  }

  return (
    <Screen active="tracker" className="tracker-screen">
      <Topbar title="AmbitionBox" right={<button className="icon-button" aria-label="Notifications"><Bell size={20} /></button>} />
      <div className="tracker-tools page-pad" aria-label="Tracker tools">
        <button className="tracker-search" onClick={() => setSearchOpen(true)}><Search size={17} /><span>Search applications</span></button>
        <button className="tracker-add" onClick={() => setManualOpen(true)} aria-label="Add an application"><Plus size={18} /><span>Add</span></button>
      </div>
      {!hasTrackerContent ? (
        <section className="empty-state tracker-onboarding page-pad">
          <div className="empty-illustration" aria-hidden="true">
            <span className="mail-card mail-card--one"><Mail size={22} /></span>
            <span className="mail-card mail-card--two"><BriefcaseBusiness size={22} /></span>
            <span className="empty-spark"><Sparkles size={18} /></span>
          </div>
          <h1>Every application. One smart Tracker.</h1>
          <p>Connect the email you use to apply. AmbitionBox will organise the last 90 days and keep your next move visible.</p>
          <div className="tracker-benefits">
            <div><span><Mail size={17} /></span><p><strong>Everything updates itself</strong><small>Applications and status changes stay organised.</small></p></div>
            <div><span><Clock3 size={17} /></span><p><strong>Important moments rise first</strong><small>Recruiter replies, deadlines, and interviews are prioritised.</small></p></div>
            <div><span><Sparkles size={17} /></span><p><strong>Know what to do next</strong><small>Get timely follow-ups, preparation, and company context.</small></p></div>
          </div>
          <div className="email-connect-label">Connect the email you use to apply</div>
          <button className="primary-button" onClick={() => connectEmail('gmail')}><span className="gmail-mini">G</span> Continue with Gmail</button>
          <button className="secondary-button email-secondary" onClick={() => connectEmail('other')}><Mail size={17} /> Connect another email</button>
          <div className="trust-line"><ShieldCheck size={16} /><span>Only job-search emails · Read only · Disconnect anytime</span></div>
        </section>
      ) : (
        <section className="page-pad tracker-content">
          <div className="tracker-summary">
            <div className="tracker-summary-top"><div><span className="tracker-period">Based on the last 90 days</span><h1>{totalApplications} application{totalApplications === 1 ? '' : 's'}</h1></div><span className="sync-badge"><span /> Synced</span></div>
            <div className="stat-row">
              {displayStats.map((stat) => <button key={stat.label} className={`stat ${section === stat.tone ? 'is-selected' : ''}`} onClick={() => setSection(stat.tone)}><strong>{stat.value}</strong><span>{stat.label}</span></button>)}
            </div>
          </div>
          <div className="content-heading tracker-view-heading"><div><span className="eyebrow">{viewMode === 'board' ? 'YOUR PIPELINE' : section === 'attention' ? 'DO NEXT' : section.toUpperCase()}</span><h2>{viewMode === 'board' ? 'Application board' : section === 'attention' ? `${attentionCount} thing${attentionCount === 1 ? '' : 's'} need you` : section === 'waiting' ? 'Waiting for an update' : 'Nothing left to do'}</h2></div><div className="tracker-view-toggle" role="group" aria-label="Tracker view"><button className={viewMode === 'list' ? 'is-active' : ''} aria-pressed={viewMode === 'list'} onClick={() => setViewMode('list')}>List</button><button className={viewMode === 'board' ? 'is-active' : ''} aria-pressed={viewMode === 'board'} onClick={() => setViewMode('board')}>Board</button></div></div>
          {viewMode === 'board' ? (
            <TrackerBoard journey={journey} attentionCount={attentionCount} visibleAttention={visibleAttention} manualApplications={manualApplications} onJuspay={openJuspayInterview} />
          ) : section === 'attention' ? (
            <div className="application-list">
              {journey.emailConnected && (
                <article className="application-card application-card--interview">
                  <div className="application-card-head"><CompanyLogo initials="JP" /><span className="application-copy"><span className="smart-label">Interview detected</span><strong>Juspay</strong><small>Senior Backend Engineer</small></span><span className="due due--interview">Tue 11:00</span></div>
                  <div className="application-signals"><span><b>89%</b> preference match</span><span><b>10/15</b> profile evidence</span></div>
                  <p className="application-insight">See what to expect and start tailored prep</p>
                  <button className="card-action card-action--primary" aria-label={`Juspay Senior Backend Engineer — ${journey.prepComplete ? 'Review interview prep' : 'Prepare for interview'}`} onClick={openJuspayInterview}>{journey.prepComplete ? 'Review interview prep' : 'Prepare for interview'} <ArrowRight size={14} /></button>
                </article>
              )}
              {visibleAttention.map((item) => (
                <article className="application-card" key={item.company}>
                  <div className="application-card-head"><CompanyLogo initials={item.company.slice(0, 2).toUpperCase()} color={item.color} /><span className="application-copy"><strong>{item.company}</strong><small>{item.role}</small></span><span className={`due ${item.when === 'Overdue' ? 'due--urgent' : ''}`}>{item.when}</span></div>
                  <div className="application-signals"><span><b>{item.preferenceMatch}%</b> preference match</span><span>{item.stage}</span></div>
                  <p className="application-insight">{item.insight}</p>
                  <button className="card-action" aria-label={`${item.company} ${item.role} — ${item.action}`} onClick={() => item.company === 'PhonePe' ? go('/home?action=phonepe') : setActionNotice(`${item.company} assessment details are ready in the connected email.`)}>{item.action} <ArrowRight size={14} /></button>
                </article>
              ))}
              {actionNotice && <div className="tracker-action-notice" role="status"><CheckCircle2 size={17} />{actionNotice}</div>}
              {journey.phonepeReplied && <div className="inline-success"><CheckCircle2 size={20} /><span><strong>PhonePe reply sent</strong><small>Moved to Waiting</small></span></div>}
            </div>
          ) : section === 'waiting' ? (
            <div className="application-list">
              {manualApplications.map((item, index) => <div className="application-card" key={`${item.company}-${index}`}><CompanyLogo initials={item.company.slice(0, 2).toUpperCase()} /><span className="application-copy"><strong>{item.company}</strong><small>{item.role}</small><span className="muted-line">Added manually · Tracking</span></span></div>)}
              {journey.emailConnected && applications.waiting.map((item) => <div className="application-card" key={item.company}><CompanyLogo initials={item.company.slice(0, 2).toUpperCase()} /><span className="application-copy"><strong>{item.company}</strong><small>{item.role}</small><span className="muted-line">{item.when}</span></span></div>)}
            </div>
          ) : (
            <div className="closed-state"><CheckCircle2 size={28} /><h3>{journey.emailConnected ? '8 applications closed' : 'Nothing closed yet'}</h3><p>Archived automatically from status emails. Nothing needs your attention here.</p></div>
          )}
        </section>
      )}

      <AnimatePresence>
        {step === 'account' && <EmailAccountSheet provider={emailProvider} onContinue={() => setStep('scanning')} onClose={() => setStep(null)} />}
        {step === 'scanning' && <GmailScanning progress={progress} onSkip={finishImport} />}
        {step === 'result' && <GmailResult onDone={() => setStep(null)} />}
        {searchOpen && <TrackerSearchSheet connected={journey.emailConnected} manualApplications={manualApplications} onClose={() => setSearchOpen(false)} onAdd={() => { setSearchOpen(false); setManualOpen(true) }} />}
        {manualOpen && <ManualApplicationSheet onClose={() => setManualOpen(false)} onAdd={addManualApplication} />}
      </AnimatePresence>
    </Screen>
  )
}

function TrackerBoard({ journey, manualApplications, onJuspay }) {
  const waitingItems = [...manualApplications.map((item) => ({ ...item, when: 'Added manually', preferenceMatch: null, outlook: 'Not assessed' })), ...(journey.emailConnected ? applications.waiting : [])]
  const offerCount = journey.offerDetected ? 1 : 0
  const stages = [
    { id: 'applied', label: 'Applied', count: journey.emailConnected ? 4 : manualApplications.length, items: waitingItems.filter((item) => !item.stage || item.stage === 'Applied').slice(0, 2) },
    { id: 'review', label: 'Recruiter review', count: journey.emailConnected ? 3 : 0, items: journey.emailConnected ? applications.attention.filter((item) => item.stage === 'Recruiter review').slice(0, 2) : [] },
    { id: 'interviewing', label: 'Interviewing', count: journey.emailConnected ? 2 : 0, items: journey.emailConnected ? [{ company: 'Juspay', role: 'Senior Backend Engineer', when: 'Tue · 11:00', preferenceMatch: 89, readiness: '10/15 evidence', priority: true }, ...waitingItems.filter((item) => item.stage === 'Interviewing').slice(0, 1)] : [] },
    { id: 'offer', label: 'Offer', count: offerCount, items: offerCount ? [{ company: 'Juspay', role: 'Senior Backend Engineer', when: '₹28L offer', preferenceMatch: 89, offer: true }] : [] },
    { id: 'closed', label: 'Closed', count: journey.emailConnected ? 6 - offerCount : 0, items: [] },
  ]
  return (
    <div className="kanban-board" aria-label="Application board">
      {stages.map((stage) => (
        <section className={`kanban-column kanban-column--${stage.id}`} key={stage.id}>
          <header><span><i /> {stage.label}</span><strong>{stage.count}</strong></header>
          <div className="kanban-cards">
            {stage.items.map((item, index) => {
              const card = <><span className="kanban-company"><CompanyLogo initials={item.company.slice(0, 2).toUpperCase()} color={item.color} /><span><strong>{item.company}</strong><small>{item.role}</small></span></span><div className="kanban-signals">{item.preferenceMatch && <span><b>{item.preferenceMatch}%</b> match</span>}{item.outlook && <span>Shortlist: <b>{item.outlook}</b></span>}{item.readiness && <span>{item.readiness}</span>}</div><b>{item.when}</b>{item.priority && <em>Prepare for interview <ArrowRight size={13} /></em>}{item.offer && <em>Understand this offer <ArrowRight size={13} /></em>}</>
              if (item.priority) return <button className="kanban-card kanban-card--priority" key={`${stage.id}-${item.company}-${index}`} onClick={onJuspay}>{card}</button>
              if (item.offer) return <button className="kanban-card kanban-card--offer" key={`${stage.id}-${item.company}-${index}`} onClick={() => go('/offer/juspay?stage=decision&story=finale')}>{card}</button>
              return <article className="kanban-card" key={`${stage.id}-${item.company}-${index}`}>{card}</article>
            })}
            {stage.id !== 'closed' && stage.count > stage.items.length && <div className="kanban-more">+{stage.count - stage.items.length} more application{stage.count - stage.items.length === 1 ? '' : 's'}</div>}
            {!stage.items.length && stage.id !== 'closed' && <div className="kanban-empty"><span>{stage.id === 'offer' ? 'No offers yet' : 'No applications here'}</span><small>New email updates will move applications automatically.</small></div>}
            {stage.id === 'closed' && <div className="kanban-closed-summary"><CheckCircle2 size={24} /><strong>{stage.count} applications archived</strong><p>Completed journeys stay here without competing for your attention.</p></div>}
          </div>
        </section>
      ))}
    </div>
  )
}

function EmailAccountSheet({ provider, onContinue, onClose }) {
  const isGmail = provider === 'gmail'
  return (
    <Sheet label={isGmail ? 'Connect Gmail' : 'Connect another email'} onClose={onClose} bottom className="email-account-sheet">
      <div className={isGmail ? 'google-g' : 'integration-icon email-provider-icon'}>{isGmail ? 'G' : <Mail size={23} />}</div>
      <h2>{isGmail ? 'Choose an account' : 'Connect another email'}</h2>
      <p className="sheet-lead">{isGmail ? 'Use the inbox where you apply for jobs.' : 'Choose the inbox you use for job applications.'}</p>
      {isGmail ? (
        <button className="account-row" onClick={onContinue}>
          <span className="account-avatar">A</span><span><strong>Arjun Mehta</strong><small>arjun.mehta@gmail.com</small></span><ChevronRight size={18} />
        </button>
      ) : (
        <div className="email-provider-list">
          <button className="account-row" onClick={onContinue}><span className="provider-avatar outlook">O</span><span><strong>Continue with Outlook</strong><small>Microsoft personal or work account</small></span><ChevronRight size={18} /></button>
          <button className="account-row" onClick={onContinue}><span className="provider-avatar work"><Mail size={17} /></span><span><strong>Connect a work email</strong><small>Other supported email provider</small></span><ChevronRight size={18} /></button>
        </div>
      )}
      <div className="google-note"><ShieldCheck size={16} /> Read-only scan of job-search emails from the last 90 days.</div>
      <p className="fine-print">Demo simulation—no email account is accessed.</p>
    </Sheet>
  )
}

function GmailScanning({ progress, onSkip }) {
  const scanSteps = [
    { title: 'Finding your applications', copy: 'Scanning job-search emails from the last 90 days', stat: '90 days', label: 'of job-search activity', icon: Search },
    { title: 'Reading status updates', copy: 'Recognising applications, rejections, and next steps', stat: '15', label: 'applications found', icon: Mail },
    { title: 'Identifying recruiter activity', copy: 'Matching replies, deadlines, and interview invites', stat: '3', label: 'need your attention', icon: UserRoundCheck },
    { title: 'Building your smart Tracker', copy: 'Prioritising the moments that can move you forward', stat: 'Ready', label: 'your next move is clear', icon: Sparkles },
  ]
  const activeStep = Math.min(Math.floor(progress / 25), scanSteps.length - 1)
  const current = scanSteps[activeStep]
  const ActiveIcon = current.icon
  return (
    <motion.div className="full-flow scan-flow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="scan-ambient scan-ambient--one" /><div className="scan-ambient scan-ambient--two" /><div className="scan-dot-field" />
      <div className="scan-brand"><Logo /></div>
      <div className="scan-stepper" aria-label={`Step ${activeStep + 1} of ${scanSteps.length}`}>
        {scanSteps.map((item, index) => <div className="scan-step-unit" key={item.title}><span className={`scan-step-dot ${index < activeStep ? 'is-done' : ''} ${index === activeStep ? 'is-current' : ''}`}>{index < activeStep ? <Check size={11} /> : index === activeStep ? <i /> : null}</span>{index < scanSteps.length - 1 && <span className={`scan-step-line ${index < activeStep ? 'is-done' : ''}`} />}</div>)}
      </div>
      <div className="scan-stage" aria-live="polite">
        <motion.div key={activeStep} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="scan-stage-icon"><ActiveIcon size={29} /></div>
          <h1>{current.title}</h1>
          <p>{current.copy}</p>
          <div className="scan-stage-stat"><strong>{current.stat}</strong><span>{current.label}</span></div>
          {activeStep === 3 && <div className="scan-ready-note"><Sparkles size={15} /> Interviews, replies, and deadlines will rise to the top.</div>}
        </motion.div>
      </div>
      <div className="scan-footer">
        <div className="scan-progress-label"><span>Scanning the last 90 days</span><strong>{progress}%</strong></div>
        <div className="progress-track"><motion.span animate={{ width: `${progress}%` }} /></div>
        <button className="text-button" onClick={onSkip}>Skip scan</button>
      </div>
    </motion.div>
  )
}

function GmailResult({ onDone }) {
  return (
    <Sheet label="Import complete" bottom className="gmail-result-sheet">
      <div className="success-burst"><Check size={28} /></div>
      <Pill tone="success">IMPORT COMPLETE</Pill>
      <h2>15 applications found</h2>
      <p className="sheet-lead">Your tracker is ready—and three conversations need your attention.</p>
      <div className="result-stats">{trackerStats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div>
      <button className="primary-button" onClick={onDone}>See what needs your attention <ArrowRight size={17} /></button>
    </Sheet>
  )
}

function TrackerSearchSheet({ connected, manualApplications, onClose, onAdd }) {
  const [query, setQuery] = useState('')
  const searchable = [
    ...(connected ? [{ company: 'Juspay', role: 'Senior Backend Engineer', action: 'Interview invite' }, ...applications.attention, ...applications.waiting] : []),
    ...manualApplications,
  ]
  const results = searchable.filter((item) => `${item.company} ${item.role}`.toLowerCase().includes(query.toLowerCase()))
  return <Sheet label="Search applications" onClose={onClose} bottom className="tracker-tool-sheet"><h2>Search your Tracker</h2><label className="tracker-search-field"><Search size={18} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Company or role" /></label>{searchable.length ? <div className="tracker-search-results">{results.map((item, index) => <button key={`${item.company}-${index}`} onClick={onClose}><CompanyLogo initials={item.company.slice(0, 2).toUpperCase()} /><span><strong>{item.company}</strong><small>{item.role}</small></span><ChevronRight size={17} /></button>)}</div> : <div className="tracker-tool-empty"><Search size={24} /><strong>No applications to search yet</strong><p>Connect your email for automatic tracking, or add an application yourself.</p><button className="secondary-button" onClick={onAdd}><Plus size={16} /> Add an application</button></div>}</Sheet>
}

function ManualApplicationSheet({ onClose, onAdd }) {
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  return <Sheet label="Add an application" onClose={onClose} bottom className="tracker-tool-sheet"><h2>Add an application</h2><p className="sheet-lead">Add the essentials now. You can update the status later.</p><form className="manual-application-form" onSubmit={(event) => { event.preventDefault(); onAdd({ company: company.trim(), role: role.trim() }) }}><label><span>Company</span><input value={company} onChange={(event) => setCompany(event.target.value)} placeholder="e.g. Atlassian" required /></label><label><span>Role</span><input value={role} onChange={(event) => setRole(event.target.value)} placeholder="e.g. Senior Backend Engineer" required /></label><button className="primary-button" type="submit">Add to Tracker <ArrowRight size={17} /></button></form></Sheet>
}

function MatchesScreen() {
  const { journey, update, toggleSaved } = useJourney()
  const params = new URLSearchParams(window.location.search)
  const [flow, setFlow] = useState(params.get('flow') === 'naukri' && !journey.naukriConnected ? 'trust' : null)
  const [sort, setSort] = useState('Best match')
  const [savedOpen, setSavedOpen] = useState(false)

  const visibleJobs = useMemo(() => {
    const available = journey.naukriConnected ? jobs : jobs.filter((job) => ['zeta', 'razorline'].includes(job.id))
    return available.map((job) => job.id === 'phonepe' && journey.phonepeReplied
      ? { ...job, posted: 'Reply sent', reason: 'Your recruiter conversation is active and now waiting on PhonePe.' }
      : job)
  }, [journey.naukriConnected, journey.phonepeReplied])

  const confirmPreferences = () => { update({ naukriConnected: true, preferencesConfirmed: true }); setFlow('success') }

  return (
    <Screen active="matches" className="matches-screen">
      <Topbar title="Matches" right={<button className="icon-button" onClick={() => setSavedOpen(true)} aria-label="Saved jobs"><Bookmark size={20} /></button>} />
      <section className="page-pad matches-intro"><span className="eyebrow">CURATED FOR ARJUN</span><h1>{journey.naukriConnected ? 'The roles worth your time.' : 'Better matches start with context.'}</h1><p>{journey.naukriConnected ? 'One ranked view across every place opportunities find you.' : 'Your AmbitionBox profile gives us a start. Connect Naukri to add skills and preferences.'}</p></section>

      {!journey.naukriConnected && <section className="page-pad"><div className="connect-card"><div className="connect-visual"><span className="naukri-logo">n</span><span className="link-line"><Link2 size={16} /></span><span className="ab-mini"><Logo small /></span></div><div><Pill tone="soft">FUTURE CONNECTION</Pill><h2>Bring your Naukri profile</h2><p>One tap imports your latest skills and job preferences. You review everything before it shapes matches.</p></div><button className="primary-button" onClick={() => setFlow('trust')}>Connect Naukri <ArrowRight size={17} /></button></div></section>}

      {journey.naukriConnected && <section className="page-pad source-strip"><div><span className="source-avatars"><i>N</i><i>AB</i><i>@</i><i>+</i></span><span><strong>4 sources connected</strong><small>Ranked to your preferences</small></span></div><button className="icon-button" onClick={() => setFlow('sources')} aria-label="Manage sources"><MoreHorizontal size={19} /></button></section>}

      <section className="page-pad feed-section">
        <div className="feed-toolbar"><span><strong>{visibleJobs.length} high-signal roles</strong><small>{journey.naukriConnected ? 'Across every connected source' : 'From AmbitionBox and company careers'}</small></span><button className="filter-button" onClick={() => setSort(sort === 'Best match' ? 'Newest' : 'Best match')}>{sort} <ChevronDown size={15} /></button></div>
        <div className="job-feed">
          {visibleJobs.map((job, index) => <JobCard key={job.id} job={job} index={index} saved={journey.savedJobs.includes(job.id)} onSave={() => toggleSaved(job.id)} onOpen={() => job.id === 'juspay' ? go('/jobs/juspay') : null} />)}
        </div>
      </section>
      <AssistantDock onClick={() => go('/assistant/juspay')} label="Help me compare these" />

      <AnimatePresence>
        {flow === 'trust' && <NaukriTrust onClose={() => setFlow(null)} onContinue={() => setFlow('profile')} />}
        {flow === 'profile' && <NaukriProfile onBack={() => setFlow('trust')} onContinue={() => setFlow('preferences')} />}
        {flow === 'preferences' && <NaukriPreferences onBack={() => setFlow('profile')} onContinue={confirmPreferences} />}
        {flow === 'success' && <NaukriSuccess onDone={() => setFlow(null)} />}
        {flow === 'sources' && <SourcesSheet onClose={() => setFlow(null)} />}
        {savedOpen && <SavedJobsSheet saved={journey.savedJobs} onClose={() => setSavedOpen(false)} />}
      </AnimatePresence>
    </Screen>
  )
}

function JobCard({ job, index, saved, onSave, onOpen }) {
  return (
    <motion.article className={`job-card ${index === 0 ? 'job-card--featured' : ''}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }}>
      <div className="job-source"><span>{job.sourceLabel}</span><span>{job.posted}</span></div>
      <div className="job-head"><CompanyLogo initials={job.initials} /><button className="job-title-button" onClick={onOpen} disabled={!onOpen}><h3>{job.role}</h3><p>{job.company} · {job.rating} <Star size={12} fill="currentColor" /> <span>{job.reviews}</span></p></button><button className="save-button" onClick={onSave} aria-label={saved ? `Unsave ${job.company}` : `Save ${job.company}`}><Bookmark size={19} fill={saved ? 'currentColor' : 'none'} /></button></div>
      <div className="job-meta"><span>{job.salary}</span><span>{job.location}</span><span>{job.mode}</span></div>
      <div className="match-row"><div className="match-score"><strong>{job.preferenceMatch}%</strong><span>Preference Match</span></div><div className="readiness-mini"><span>{job.readiness}</span><small>{job.readiness === 'Applied' ? 'status' : 'Profile Readiness'}</small></div></div>
      <p className="job-reason"><Sparkles size={15} /> {job.reason}</p>
      {onOpen ? <button className="culture-row culture-row--button" onClick={onOpen}><span>{job.culture}</span><ArrowRight size={17} /></button> : <div className="culture-row"><span>{job.culture}</span></div>}
    </motion.article>
  )
}

function NaukriTrust({ onClose, onContinue }) {
  return <Sheet label="Connect Naukri" onClose={onClose}><div className="integration-icon naukri-icon">n</div><Pill tone="soft">FUTURE NAUKRI CONNECTION</Pill><h2>Add the context your résumé misses</h2><p className="sheet-lead">Import your current profile and preferences to improve ranking. You’ll confirm every detail first.</p><div className="permission-list"><div><FileCheck2 size={18} /><span><strong>Profile details</strong><small>Skills, experience, education, and résumé.</small></span></div><div><Target size={18} /><span><strong>Job preferences</strong><small>Roles, salary, locations, and work mode.</small></span></div><div><ShieldCheck size={18} /><span><strong>No profile changes</strong><small>AmbitionBox cannot edit your Naukri profile.</small></span></div></div><button className="primary-button" onClick={onContinue}>Connect in one tap <ArrowRight size={17} /></button><p className="fine-print">Demo simulation—no Naukri account is accessed.</p></Sheet>
}

function NaukriProfile({ onBack, onContinue }) {
  return <Sheet label="Imported Naukri profile" onClose={onBack}><div className="sheet-step">1 OF 2 · IMPORTED PROFILE</div><div className="profile-head"><span className="large-avatar">AM</span><span><h2>Arjun Mehta</h2><p>Senior Backend Engineer at Razorpay</p></span></div><div className="profile-facts"><div><span>Experience</span><strong>6 years</strong></div><div><span>Current location</span><strong>{candidate.location}</strong></div><div><span>Current salary</span><strong>₹15L</strong></div><div><span>Profile updated</span><strong>12 days ago</strong></div></div><div className="tag-block"><span>Top skills</span><div><Pill>Java</Pill><Pill>Kafka</Pill><Pill>Distributed systems</Pill><Pill>Payments</Pill><Pill>AWS</Pill></div></div><button className="primary-button" onClick={onContinue}>Review and edit preferences <ArrowRight size={17} /></button></Sheet>
}

function NaukriPreferences({ onBack, onContinue }) {
  const [salary, setSalary] = useState('₹22L+')
  const [workModes, setWorkModes] = useState(['Remote', 'Light hybrid'])
  const toggleMode = (mode) => setWorkModes((current) => current.includes(mode) ? current.filter((item) => item !== mode) : [...current, mode])
  return <Sheet label="Confirm job preferences" onClose={onBack} wide><div className="sheet-step">2 OF 2 · YOUR PREFERENCES</div><h2>What should a great next move look like?</h2><p className="sheet-lead">These shape ranking—not eligibility. You can change them anytime.</p><div className="form-stack"><label><span>Target role</span><div className="input-shell">Senior Backend Engineer <Pencil size={15} /></div></label><label><span>Minimum target salary</span><input name="minimum-salary" autoComplete="off" inputMode="text" value={salary} onChange={(e) => setSalary(e.target.value)} /></label><fieldset><legend>Work mode</legend><div className="choice-row">{['Remote', 'Light hybrid', 'Office'].map((mode) => <button type="button" key={mode} className={workModes.includes(mode) ? 'is-selected' : ''} onClick={() => toggleMode(mode)}>{mode}</button>)}</div></fieldset><label><span>Preferred location</span><div className="input-shell">Bengaluru <Pill tone="soft">+ Remote</Pill></div></label><label><span>Home city <small>Used only for move estimates</small></span><div className="input-shell">{candidate.hometown} <Pill tone="soft">Provided by you</Pill></div></label></div><button className="primary-button" onClick={onContinue}><Check size={17} /> Confirm preferences</button></Sheet>
}

function SourcesSheet({ onClose }) {
  const sources = [
    ['Naukri', 'Profile + job listings', 'Connected'],
    ['AmbitionBox', 'Company intelligence + jobs', 'Always on'],
    ['Recruiter email', 'Application conversations', 'Via Gmail'],
    ['Company careers', 'Direct employer listings', 'Indexed'],
  ]
  return <Sheet label="Connected opportunity sources" onClose={onClose}><Pill tone="soft">SOURCE TRANSPARENCY</Pill><h2>Every match says where it came from.</h2><p className="sheet-lead">Sources add discovery context. AmbitionBox applies the same preference and readiness logic across them.</p><div className="source-list">{sources.map(([name, detail, status]) => <div key={name}><span className="source-check"><Check size={14} /></span><span><strong>{name}</strong><small>{detail}</small></span><Pill tone="success">{status}</Pill></div>)}</div><button className="primary-button" onClick={onClose}>Done</button></Sheet>
}

function SavedJobsSheet({ saved, onClose }) {
  const savedItems = jobs.filter((job) => saved.includes(job.id))
  return <Sheet label="Saved jobs" onClose={onClose}><Pill tone="soft">YOUR SHORTLIST</Pill><h2>{savedItems.length ? `${savedItems.length} saved ${savedItems.length === 1 ? 'role' : 'roles'}` : 'Nothing saved yet'}</h2><p className="sheet-lead">Save a match to keep it here while you compare.</p><div className="saved-list">{savedItems.length ? savedItems.map((job) => <button key={job.id} onClick={() => job.id === 'juspay' && go('/jobs/juspay')}><CompanyLogo initials={job.initials} /><span><strong>{job.company}</strong><small>{job.role} · {job.salary}</small></span><ChevronRight size={17} /></button>) : <div className="closed-state"><Bookmark size={26} /><p>Your saved roles will appear here.</p></div>}</div><button className="secondary-button" onClick={onClose}>Keep browsing</button></Sheet>
}

function NaukriSuccess({ onDone }) {
  return <Sheet label="Naukri connected"><div className="success-burst"><Check size={28} /></div><Pill tone="success">PROFILE CONNECTED</Pill><h2>Your matches just got sharper</h2><p className="sheet-lead">We reranked opportunities using your current skills, salary target, and work preferences.</p><div className="rerank-card"><div><span className="rank-arrow">↑3</span><CompanyLogo initials="JP" /><span><strong>Juspay</strong><small>Senior Backend Engineer</small></span></div><Pill tone="success">89% match</Pill></div><button className="primary-button" onClick={onDone}>See ranked matches <ArrowRight size={17} /></button></Sheet>
}

function JobDetailScreen() {
  const { journey, toggleSaved } = useJourney()
  const saved = journey.savedJobs.includes('juspay')
  const readiness = journey.readiness
  return (
    <main id="main-content" className="detail-screen screen">
      <Topbar back="/matches" title="Job details" right={<button className="icon-button" onClick={() => toggleSaved('juspay')} aria-label={saved ? 'Unsave job' : 'Save job'}><Bookmark size={20} fill={saved ? 'currentColor' : 'none'} /></button>} />
      <section className="job-hero page-pad"><div className="job-company-row"><CompanyLogo initials="JP" /><span><h1>Senior Backend Engineer</h1><p>Juspay · Bengaluru</p></span></div><div className="job-hero-meta"><span>₹24–30L</span><span>Hybrid</span><span>6–9 yrs</span></div><div className="job-source-line"><span className="naukri-dot">n</span> Found on Naukri · Posted 2 days ago</div></section>

      <section className="score-panel page-pad"><div className="score-card"><ProgressRing value={89} /><div><span className="eyebrow">PREFERENCE MATCH</span><h2>This role fits what you want.</h2><p>Pay, seniority, location, and domain align strongly.</p></div></div><div className="fit-chips"><Pill tone="success"><Check size={13} /> ₹24–30L</Pill><Pill tone="success"><Check size={13} /> Senior role</Pill><Pill tone="success"><Check size={13} /> Payments</Pill><Pill tone="attention">Hybrid · 3 days</Pill></div></section>

      <section className="page-pad readiness-section"><div className="readiness-card"><div className="readiness-head"><ProgressRing value={readiness} total={15} label={`${readiness}/15`} color="var(--teal)" /><div><span className="eyebrow">PROFILE READINESS</span><h2>{readiness >= 14 ? 'Your strongest evidence is now visible.' : 'The fit is strong. The proof can be stronger.'}</h2></div></div><div className="readiness-bar"><motion.span animate={{ width: `${(readiness / 15) * 100}%` }} /></div><p>{readiness >= 14 ? 'Your tailored résumé now covers scale, ownership, and payments impact.' : 'We found five requirements. Your résumé clearly proves ten of fifteen evidence signals.'}</p>{readiness < 14 ? <button className="secondary-button" onClick={() => go('/assistant/juspay')}>Close the evidence gap <Sparkles size={16} /></button> : <button className="secondary-button" onClick={() => go('/assistant/juspay?stage=resume')}>View tailored résumé <FileCheck2 size={16} /></button>}</div></section>

      <section className="page-pad insight-section"><div className="section-heading"><div><span className="eyebrow">WHY THIS ROLE</span><h2>The full picture</h2></div></div><div className="insight-list"><div><span className="insight-icon mint"><Check size={18} /></span><span><strong>Your advantage</strong><small>6 years in payments and distributed systems maps directly to the core team.</small></span></div><div><span className="insight-icon amber"><TrendingUp size={18} /></span><span><strong>Worth strengthening</strong><small>Show measurable ownership of reliability at high transaction volume.</small></span></div><div><span className="insight-icon lilac"><Info size={18} /></span><span><strong>Culture signal</strong><small>Employees praise learning and ownership; work-life balance is mixed.</small></span></div></div></section>

      <section className="page-pad company-intel"><div className="intel-head"><div><span className="eyebrow">AMBITIONBOX INTELLIGENCE</span><h2>Juspay at a glance</h2></div><span className="rating-box">4.0 <Star size={13} fill="currentColor" /></span></div><div className="intel-grid"><div><strong>4.2</strong><span>Skill development</span></div><div><strong>3.7</strong><span>Work-life balance</span></div><div><strong>4.0</strong><span>Company culture</span></div></div><p>Based on 847 employee reviews · Updated 3 days ago</p></section>

      <div className="sticky-cta"><button className="save-cta" onClick={() => toggleSaved('juspay')} aria-label={saved ? 'Unsave job' : 'Save job'}><Bookmark size={20} fill={saved ? 'currentColor' : 'none'} /></button><button className="primary-button" onClick={() => go(readiness < 14 ? '/assistant/juspay' : journey.interviewInvited ? '/prep/juspay' : '/home')}>{readiness < 14 ? 'Improve my application' : journey.interviewInvited ? 'Prepare for interview' : 'See my next move'} <ArrowRight size={17} /></button></div>
    </main>
  )
}

function AssistantScreen() {
  const { journey, update } = useJourney()
  const params = new URLSearchParams(window.location.search)
  const requested = params.get('stage')
  const [stage, setStage] = useState(['question', 'insight', 'resume'].includes(requested) ? requested : (journey.resumeReady ? 'resume' : 'question'))
  const [answer, setAnswer] = useState('')
  const [tailoring, setTailoring] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [javaChoice, setJavaChoice] = useState(journey.javaConfirmed)

  const submitEvidence = () => answer.trim() && setStage('insight')
  const tailor = () => {
    setTailoring(true)
    setTimeout(() => { update({ readiness: 14, resumeReady: true }); setTailoring(false); setStage('resume') }, 1700)
  }
  const confirmJava = (choice) => {
    setJavaChoice(choice)
    update({ javaConfirmed: choice, readiness: choice ? 15 : 14 })
  }
  const downloadResume = async () => {
    setDownloading(true)
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ unit: 'pt', format: 'a4' })
      doc.setTextColor(23, 25, 43)
      doc.setFont('helvetica', 'bold'); doc.setFontSize(22); doc.text('ARJUN MEHTA', 56, 68)
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(98, 105, 133); doc.text(`Senior Backend Engineer · ${candidate.location}`, 56, 88)
      doc.setDrawColor(63, 92, 251); doc.setLineWidth(1.5); doc.line(56, 106, 539, 106)
      doc.setTextColor(23, 25, 43); doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text('RAZORPAY · SENIOR BACKEND ENGINEER', 56, 134)
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10)
      const bullets = [
        'Designed idempotent payment workflows processing high-volume retries safely.',
        'Led reliability improvements that reduced payment callback failures by 31%.',
        'Built Kafka-based event processing with clear observability and ownership.',
      ]
      bullets.forEach((line, index) => doc.text(`• ${line}`, 66, 162 + index * 25, { maxWidth: 455 }))
      doc.setFillColor(239, 242, 255); doc.roundedRect(56, 250, 483, 58, 8, 8, 'F')
      doc.setTextColor(63, 92, 251); doc.setFont('helvetica', 'bold'); doc.text('TAILORED FOR JUSPAY', 70, 272)
      doc.setTextColor(73, 79, 105); doc.setFont('helvetica', 'normal'); doc.text('Evidence reviewed by Arjun · Profile Readiness 14/15', 70, 291)
      doc.save('Arjun-Mehta-Juspay-Resume.pdf')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <main id="main-content" className="assistant-screen screen">
      <Topbar back="/jobs/juspay" title="Career Copilot" eyebrow="JUSPAY APPLICATION" right={<span className="online-badge"><span /> Live context</span>} />
      <section className="assistant-thread page-pad">
        {stage === 'question' && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="copilot-intro"><span className="assistant-orb large"><Sparkles size={20} /></span><div><Pill tone="soft">EVIDENCE CHECK</Pill><h1>You match the role. Let’s make the proof unmistakable.</h1><p>Juspay repeatedly asks for ownership of reliable, high-volume systems. Your résumé mentions Kafka, but not the outcome.</p></div></div>
          <div className="evidence-compare"><div><span>JUSPAY NEEDS</span><strong>“Own reliable payment systems at scale”</strong></div><ArrowRight size={18} /><div><span>YOUR RÉSUMÉ SAYS</span><strong>“Worked on Kafka-based services”</strong></div></div>
          <label className="answer-field"><span>What changed because of your work?</span><textarea name="evidence-answer" autoComplete="off" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Describe the system, your ownership, and a measurable result…" /></label>
          <button className="demo-answer" onClick={() => setAnswer('I led a Kafka-based retry service for payment callbacks, added idempotency and observability, and reduced callback failures by 31% during peak volume.')}><Sparkles size={15} /> Use demo evidence</button>
          <button className="primary-button" disabled={!answer.trim()} onClick={submitEvidence}>Review my evidence <ArrowRight size={17} /></button>
        </motion.div>}

        {stage === 'insight' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="copilot-intro"><span className="assistant-orb large success"><Check size={20} /></span><div><Pill tone="success">STRONG EVIDENCE FOUND</Pill><h1>This is the story your résumé was missing.</h1><p>It proves system ownership, payment relevance, and measurable reliability impact.</p></div></div>
          <div className="evidence-receipt"><div className="receipt-row"><Check size={17} /><span><strong>System</strong><small>Kafka-based payment callback retry service</small></span></div><div className="receipt-row"><Check size={17} /><span><strong>Your ownership</strong><small>Led design, idempotency, and observability</small></span></div><div className="receipt-row"><Check size={17} /><span><strong>Outcome</strong><small>31% fewer callback failures at peak volume</small></span></div></div>
          <div className="honesty-note"><ShieldCheck size={17} /><p><strong>You control the evidence.</strong> We only use what you confirmed and never invent a metric.</p></div>
          <button className="primary-button" onClick={tailor} disabled={tailoring}>{tailoring ? <><span className="spinner" /> Tailoring résumé…</> : <>Tailor my résumé for Juspay <Sparkles size={17} /></>}</button>
        </motion.div>}

        {stage === 'resume' && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="copilot-intro"><span className="assistant-orb large success"><FileCheck2 size={20} /></span><div><Pill tone="success">RÉSUMÉ READY</Pill><h1>Profile Readiness is now {journey.readiness}/15.</h1><p>Your strongest evidence is where a Juspay recruiter will look for it.</p></div></div>
          <div className="resume-preview"><div className="resume-toolbar"><span><FileCheck2 size={17} /> Arjun_Mehta_Juspay.pdf</span><Pill tone="success">Tailored</Pill></div><div className="resume-paper"><div className="resume-name">ARJUN MEHTA</div><div className="resume-role">Senior Backend Engineer · {candidate.location}</div><div className="resume-rule" /><strong>RAZORPAY · SENIOR BACKEND ENGINEER</strong><p className="highlight-line">Designed idempotent payment workflows processing high-volume retries safely.</p><p className="highlight-line">Led reliability improvements that reduced payment callback failures by 31%.</p><p>Built Kafka-based event processing with clear observability and ownership.</p></div></div>
          <div className="correction-card"><div><span className="eyebrow">ONE HONEST CHECK</span><h3>Did you personally own production Java services for 3+ years?</h3><p>Juspay lists this explicitly. Confirm only if it’s accurate.</p></div><div className="choice-row"><button className={javaChoice === true ? 'is-selected' : ''} onClick={() => confirmJava(true)}>Yes, I did</button><button className={javaChoice === false ? 'is-selected' : ''} onClick={() => confirmJava(false)}>Not quite</button></div>{javaChoice === false && <p className="correction-result"><ShieldCheck size={15} /> Kept at 14/15. The gap stays visible—your résumé remains honest.</p>}{javaChoice === true && <p className="correction-result success"><Check size={15} /> Confirmed. Profile Readiness is now 15/15.</p>}</div>
          <div className="button-row"><button className="secondary-button" aria-live="polite" disabled={downloading} onClick={downloadResume}>{downloading ? 'Preparing PDF…' : 'Download PDF'}</button><button className="primary-button" onClick={() => go('/jobs/juspay')}>Return to job <ArrowRight size={17} /></button></div>
        </motion.div>}
      </section>
    </main>
  )
}

// Grades a practice answer against the decisions the question is actually testing.
// Deliberately dumb and deterministic: keyword lists live in data.js, so what the
// screen claims the candidate covered is derived from what they typed, never assumed.
function scorePrepAnswer(text) {
  const value = (text || '').toLowerCase()
  const covered = interviewIntel.practice.decisions.filter((item) => item.keywords.some((word) => value.includes(word)))
  const missed = interviewIntel.practice.decisions.filter((item) => !covered.includes(item))
  return { covered, missed, tone: covered.length === 0 ? 'empty' : covered.length >= 4 ? 'strong' : 'partial' }
}

function joinLabels(items) {
  const names = items.map((item) => item.label.toLowerCase())
  if (names.length < 2) return names.join('')
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}

function PrepStat({ value, label, detail }) {
  return <div className="prep-stat"><strong>{value}</strong><span>{label}</span>{detail && <small>{detail}</small>}</div>
}

function PrepInvite({ roundChoice, onConfirmRound, onContinue }) {
  const { invitation, roundInference } = interviewIntel
  const chosen = roundInference.options.find((item) => item.id === roundChoice)
  return (
    <motion.div className="prep-stage" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="prep-invite-head"><div className="mail-success"><Mail size={26} /><span><Check size={13} /></span></div><Pill tone="success">{invitation.detected}</Pill><h1>Juspay wants to interview you.</h1></div>
      <article className="prep-invite-card">
        <header><CompanyLogo initials="JP" /><span><strong>{invitation.subject}</strong><small>{invitation.sender}</small></span></header>
        <p className="prep-invite-body">{invitation.body}</p>
        <dl className="prep-invite-meta">
          <div><dt>When</dt><dd>{invitation.day} · {invitation.time}</dd></div>
          <div><dt>Length</dt><dd>{invitation.duration}</dd></div>
          <div><dt>Where</dt><dd>{invitation.mode}</dd></div>
          <div><dt>With</dt><dd>{invitation.with}</dd></div>
        </dl>
        <span className="prep-invite-link"><Link2 size={13} /> {invitation.link}</span>
      </article>
      <div className="prep-unknowns"><strong>{invitation.unknownsTitle}</strong><p>{invitation.unknownsLine}</p><ul>{invitation.unknowns.map((item) => <li key={item}><X size={12} /> {item}</li>)}</ul></div>
      <div className="prep-inference">
        <span className="eyebrow">{roundInference.kicker}</span>
        {roundInference.resolved.map((item, index) => <motion.div className="prep-inference-row" key={item.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }}><span className="prep-inference-label">{item.label}</span><strong>{item.value}</strong><em><Link2 size={11} /> {item.how}</em></motion.div>)}
        <p className="prep-inference-open"><Info size={14} /> Still unknown: {roundInference.unresolved}</p>
      </div>
      <div className="correction-card">
        <div><span className="eyebrow">ONE HONEST CHECK</span><h3>{roundInference.askTitle}</h3><p>{roundInference.askDetail}</p></div>
        <div className="choice-row">{roundInference.options.map((item) => <button key={item.id} className={roundChoice === item.id ? 'is-selected' : ''} onClick={() => onConfirmRound(item.id)}>{item.label}</button>)}</div>
        {chosen && <p className="correction-result success"><Check size={15} /> {chosen.result}</p>}
      </div>
      <button className="primary-button" disabled={!chosen} onClick={onContinue}>Decode this interview <Sparkles size={17} /></button>
      {!chosen && <p className="fine-print">Tell us which round this is first. We would rather ask than guess.</p>}
    </motion.div>
  )
}

function PrepInterviewerCard() {
  const { interviewer } = interviewIntel
  return (
    <article className="prep-interviewer">
      <header><CompanyLogo initials={interviewer.initials} color="#3f5cfb" /><span><strong>{interviewer.name}</strong><small>{interviewer.title} · {interviewer.team}</small></span></header>
      <p className="prep-interviewer-role"><UserRoundCheck size={13} /> {interviewer.relationship}</p>
      <dl className="prep-interviewer-meta"><div><dt>Owns</dt><dd>{interviewer.owns}</dd></div><div><dt>Experience</dt><dd>{interviewer.tenure}</dd></div></dl>
      <div className="prep-signal-block">
        <span className="prep-signal-title"><Search size={13} /> Publicly published</span>
        <ul className="prep-footprint">{interviewer.publicFootprint.map((item) => <li key={item.label}><strong>{item.label}</strong><small>{item.detail}</small><em>{item.where}</em></li>)}</ul>
      </div>
      <div className="prep-signal-block">
        <span className="prep-signal-title"><Sparkles size={13} /> How they run this round</span>
        <ul className="prep-report-signal">{interviewer.reportSignal.map((item) => <li key={item.count}><p>{item.text}</p><span>{item.count} reports</span></li>)}</ul>
        <small className="prep-signal-scope">{interviewer.reportSignalScope}</small>
      </div>
      <p className="prep-boundary"><ShieldCheck size={15} /> {interviewer.boundary}</p>
    </article>
  )
}

function PrepBriefing({ roundChoice, onOpenTheme, onContinue }) {
  const { evidence, loop, inversion, themes, outcomes, roundInference, themeScope } = interviewIntel
  const chosen = roundInference.options.find((item) => item.id === roundChoice)
  const nextRound = roundChoice === 'corrected' ? 3 : 1
  return (
    <motion.div className="prep-stage" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="prep-hero"><Pill tone="soft">ROUND {nextRound} OF {loop.total}</Pill><h1>What you’re walking into.</h1><p>The invite told you a time. This is the rest of it.</p></div>
      {chosen && chosen.id !== 'confirmed' && <p className="prep-banner"><Info size={15} /> {chosen.result}</p>}
      <div className="prep-intel-strip">
        <PrepStat value={evidence.reports} label="interview reports" />
        <PrepStat value={evidence.reviews} label="employee reviews" />
        <PrepStat value={evidence.freshness.replace('Updated ', '').replace(' ago', '')} label="since last update" />
      </div>
      <p className="prep-scope"><Target size={13} /> {evidence.scope}</p>

      <h2 className="prep-section-title">Who you’re meeting</h2>
      <PrepInterviewerCard />

      <h2 className="prep-section-title">Where this came from</h2>
      <div className="prep-sources">
        <article className="prep-source prep-source--findable"><span className="prep-source-head"><Search size={15} /> {evidence.findable.title}</span><p>{evidence.findable.detail}</p><ul>{evidence.findable.items.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article className="prep-source prep-source--exclusive"><span className="prep-source-head"><Sparkles size={15} /> {evidence.exclusive.title}</span><p>{evidence.exclusive.detail}</p><ul>{evidence.exclusive.items.map((item) => <li key={item}>{item}</li>)}</ul></article>
      </div>

      <div className="prep-inversion"><span className="eyebrow">{inversion.kicker}</span><h3>{inversion.headline}</h3><p>{inversion.detail}</p><p className="prep-inversion-counter"><Info size={13} /> {inversion.counter}</p></div>

      <h2 className="prep-section-title">The full loop</h2>
      <ol className="prep-loop">
        {loop.rounds.map((item, index) => <motion.li key={item.round} className={item.round === nextRound ? 'prep-loop-round prep-loop-round--next' : 'prep-loop-round'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }}>
          <span className="prep-round-badge">{item.round}</span>
          <span className="prep-round-copy"><strong>{item.label}</strong><small>{item.detail}</small>{item.round === nextRound && <em className="prep-round-weight">{item.weight || 'This is the one you were invited to'}</em>}</span>
          <span className="prep-round-meta"><span>{item.duration}</span><small>{item.reports} reports</small></span>
        </motion.li>)}
      </ol>
      <p className="prep-loop-caveat"><Info size={13} /> {loop.caveat}</p>

      <h2 className="prep-section-title">What actually comes up</h2>
      <div className="prep-theme-list">
        {themes.map((item, index) => <motion.button key={item.id} className="prep-theme" onClick={() => onOpenTheme(item)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }}>
          <span className="prep-theme-copy"><strong>{item.label}</strong><small>{item.summary}</small></span>
          <span className="prep-theme-count">{item.reports}<em>reports</em></span>
          <span className="prep-theme-bar"><motion.span initial={{ width: 0 }} animate={{ width: `${Math.round((item.reports / evidence.roundOneReports) * 100)}%` }} /></span>
          <ChevronRight size={16} />
        </motion.button>)}
      </div>
      <p className="prep-loop-caveat"><Info size={13} /> {themeScope} Tap any theme to read what candidates actually said.</p>

      <h2 className="prep-section-title">How this usually ends</h2>
      <div className="prep-intel-strip">
        <PrepStat value={outcomes.offerRate} label="get an offer" detail={outcomes.offerRateDetail} />
        <PrepStat value={outcomes.decisionMedian} label="to a decision" detail={outcomes.decisionDetail} />
        <PrepStat value={outcomes.loopMedian} label="whole loop" detail={outcomes.loopDetail} />
      </div>

      <div className="source-receipt"><ShieldCheck size={17} /><span><strong>{evidence.receiptTitle}</strong><small>{evidence.receiptDetail}</small></span></div>
      <div className="simulation-note"><Info size={15} /><span>{evidence.simulationNote}</span></div>
      <button className="primary-button" onClick={onContinue}>Where my evidence stands <ArrowRight size={17} /></button>
    </motion.div>
  )
}

function PrepThemeSheet({ theme, onClose }) {
  return (
    <Sheet label={`${theme.label} in interview reports`} onClose={onClose}>
      <div className="prep-theme-sheet">
        <div className="prep-theme-sheet-head"><Pill tone="soft">{theme.reports} REPORTS</Pill><h2>{theme.label}</h2><p>{theme.summary}</p></div>
        {theme.excerpts.map((item) => <blockquote className="prep-excerpt" key={item}>{item}</blockquote>)}
        <p className="prep-excerpt-note"><ShieldCheck size={14} /> Anonymised and lightly paraphrased. Candidates never appear by name, employer, or interview date.</p>
        <button className="primary-button" onClick={onClose}>Back to the briefing</button>
      </div>
    </Sheet>
  )
}

function PrepAnswers({ javaChoice, onConfirmJava, readiness, onContinue }) {
  const { savedAnswers, savedAnswersTitle, savedAnswersNote, newQuestions, newQuestionsTitle, javaBranch } = interviewIntel
  return (
    <motion.div className="prep-stage" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="prep-hero"><Pill tone="soft">YOUR EVIDENCE VS THIS ROUND</Pill><h1>Most of this, you already have.</h1><p>Nothing here was invented for you. Every answer below traces to something you confirmed.</p></div>

      <h2 className="prep-section-title">{savedAnswersTitle}</h2>
      <p className="prep-section-note">{savedAnswersNote}</p>
      {savedAnswers.map((item, index) => <motion.article key={item.id} className={`prep-answer prep-answer--${item.status}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }}>
        <header><Pill tone={item.status === 'ready' ? 'success' : 'attention'}>{item.status === 'ready' ? 'READY' : 'NEEDS FRAMING'}</Pill><h3>{item.question}</h3></header>
        <p>{item.answer}</p>
        {item.outcome && <span className="prep-answer-outcome"><TrendingUp size={13} /> {item.outcome}</span>}
        <em className="prep-answer-source"><Link2 size={11} /> {item.source}</em>
        <p className="prep-answer-note">{item.note}</p>
      </motion.article>)}

      <h2 className="prep-section-title">{newQuestionsTitle}</h2>
      {newQuestions.map((item, index) => <motion.article key={item.id} className="prep-answer prep-answer--new" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }}>
        <header><Pill tone="soft">NEW</Pill><h3>{item.question}</h3></header>
        <em className="prep-answer-source"><Link2 size={11} /> {item.why}</em>
        <p>{item.focus}</p>
        {item.caution && <p className="prep-answer-caution"><ShieldCheck size={14} /> {item.caution}</p>}
      </motion.article>)}

      <h2 className="prep-section-title">{javaBranch.headline}</h2>
      <div className="correction-card prep-java">
        <div><span className="eyebrow">{javaBranch.refusal}</span><h3>{javaBranch.question}</h3><p>{javaBranch.context}</p></div>
        <div className="choice-row"><button className={javaChoice === true ? 'is-selected' : ''} onClick={() => onConfirmJava(true)}>Yes, I did</button><button className={javaChoice === false ? 'is-selected' : ''} onClick={() => onConfirmJava(false)}>Not quite</button></div>
        {javaChoice === true && <div className="prep-strategy prep-strategy--success"><p className="correction-result success"><Check size={15} /> {javaBranch.yes.result}</p><strong>{javaBranch.yes.strategyTitle}</strong><p>{javaBranch.yes.strategy}</p></div>}
        {javaChoice === false && <div className="prep-strategy"><p className="correction-result"><ShieldCheck size={15} /> {javaBranch.no.result}</p><strong>{javaBranch.no.strategyTitle}</strong><p>{javaBranch.no.strategy}</p></div>}
      </div>
      <p className="prep-readiness-line"><Target size={14} /> Profile Readiness {readiness}/15</p>
      <button className="primary-button" onClick={onContinue}>Practise the most likely question <ArrowRight size={17} /></button>
    </motion.div>
  )
}

function PrepPractice({ answer, setAnswer, result, onEvaluate, onComplete }) {
  const { practice } = interviewIntel
  const { coaching } = practice
  const tone = result ? result.tone : null
  return (
    <motion.div className="prep-stage" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="practice-top"><Pill tone="attention">MOST REPORTED QUESTION</Pill><span>{practice.minutes}</span></div>
      <h1>{practice.question}</h1>
      <p className="prep-practice-origin"><Link2 size={13} /> {practice.origin}</p>
      <div className="prompt-card"><strong>{practice.promptTitle}</strong><span>{practice.decisions.map((item) => item.label).join(' · ')}</span></div>
      <label className="answer-field"><span>Your answer</span><textarea name="practice-answer" autoComplete="off" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Talk it through the way you would in the room…" /></label>
      <button className="demo-answer" onClick={() => setAnswer(practice.demoAnswer)}><Sparkles size={15} /> Use demo answer</button>
      {!result ? <button className="primary-button" disabled={!answer.trim()} onClick={onEvaluate}>Get coaching <ArrowRight size={17} /></button> : (
        <motion.div className={`coaching-card coaching-card--${tone}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} aria-live="polite">
          <div className="coaching-head"><span className={tone === 'empty' ? 'assistant-orb' : 'assistant-orb success'}>{tone === 'empty' ? <Info size={16} /> : <Sparkles size={16} />}</span><span><strong>{tone === 'strong' ? coaching.strongTitle : tone === 'partial' ? coaching.partialTitle : coaching.emptyTitle}</strong><small>{tone === 'empty' ? `0 of ${practice.decisions.length} covered` : coaching.grounded}</small></span></div>
          {tone === 'empty' ? <p>{coaching.emptyBody}</p> : <p>{coaching.coveredLead} {joinLabels(result.covered)}.{result.missed.length > 0 && ` ${coaching.missedLead} ${joinLabels(result.missed)}.`}</p>}
          <ul className="prep-coverage">{practice.decisions.map((item) => <li key={item.id} className={result.covered.includes(item) ? 'prep-coverage-item prep-coverage-item--hit' : 'prep-coverage-item prep-coverage-item--miss'}>{result.covered.includes(item) ? <Check size={13} /> : <X size={13} />} {item.label}</li>)}</ul>
          {tone === 'strong' && <><div className="improved-answer"><span>{coaching.addLineLabel}</span>{coaching.addLine}</div><p className="prep-add-why"><Link2 size={12} /> {coaching.addLineWhy}</p></>}
          <button className="primary-button" disabled={tone === 'empty'} onClick={onComplete}>Mark practice complete <Check size={17} /></button>
          {tone === 'empty' && <p className="fine-print">There is nothing here to mark complete yet.</p>}
        </motion.div>
      )}
    </motion.div>
  )
}

function PrepReady({ covered, readiness, onOffer }) {
  const { ready, practice, savedAnswers, questionsToAsk, questionsToAskTitle, questionsToAskNote, questionsToAskCaution } = interviewIntel
  return (
    <motion.div className="prep-stage prep-ready" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="completion-state"><div className="success-burst"><Check size={28} /></div><Pill tone="success">{ready.kicker}</Pill><h1>{ready.headline}</h1><p>{ready.detail}</p></div>
      <div className="prep-ready-metrics">
        <PrepStat value={covered > 0 ? `${covered}/${practice.decisions.length}` : '—'} label="points named in practice" />
        <PrepStat value={savedAnswers.length} label="answers already yours" />
        <PrepStat value={`${readiness}/15`} label="profile readiness" />
      </div>
      {covered === 0 && <p className="fine-print">{ready.noPracticeNote}</p>}

      <h2 className="prep-section-title">{questionsToAskTitle}</h2>
      <p className="prep-section-note">{questionsToAskNote}</p>
      <ol className="prep-ask-list">
        {questionsToAsk.map((item, index) => {
          const verifies = offerDecision.questionsToVerify.find((entry) => entry.id === item.verifies)
          return <motion.li key={item.verifies} className="prep-ask" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }}><strong>{item.ask}</strong>{verifies && <em className="prep-ask-verifies"><Link2 size={11} /> Verifies: {verifies.label}</em>}</motion.li>
        })}
      </ol>
      <p className="prep-loop-caveat"><Info size={13} /> {questionsToAskCaution}</p>

      <button className="primary-button" onClick={onOffer}>Jump to offer day <ArrowRight size={17} /></button>
      <button className="text-button" onClick={() => go('/home')}>Return home</button>
    </motion.div>
  )
}

function PrepScreen() {
  const { journey, update } = useJourney()
  const params = new URLSearchParams(window.location.search)
  const requestedStage = params.get('stage')
  const requestedRound = params.get('round')
  const requestedJava = params.get('java')
  const { practice, loop } = interviewIntel
  const [stage, setStage] = useState(requestedStage === 'coaching' ? 'practice' : (requestedStage || (journey.prepComplete ? 'ready' : 'invite')))
  const [answer, setAnswer] = useState(requestedStage === 'coaching' ? practice.demoAnswer : '')
  const [result, setResult] = useState(requestedStage === 'coaching' ? scorePrepAnswer(practice.demoAnswer) : null)
  const [roundChoice, setRoundChoice] = useState(requestedRound === 'open' ? null : (requestedRound || journey.roundConfirmed))
  const [javaChoice, setJavaChoice] = useState(requestedJava === 'open' ? null : (requestedJava ? requestedJava === 'yes' : journey.javaConfirmed))
  const [theme, setTheme] = useState(null)

  const confirmRound = (id) => { setRoundChoice(id); update({ roundConfirmed: id }) }
  const confirmJava = (value) => { setJavaChoice(value); update({ javaConfirmed: value, readiness: value ? 15 : 14 }) }
  const evaluate = () => answer.trim() && setResult(scorePrepAnswer(answer))
  const complete = () => { update({ prepComplete: true, prepDecisionsCovered: result ? result.covered.length : 0 }); setStage('ready') }
  const toOffer = () => { update({ offerDetected: true }); go('/offer/juspay?stage=notification&story=finale') }
  const covered = stage === 'ready' && result ? result.covered.length : journey.prepDecisionsCovered

  return (
    <main id="main-content" className="prep-screen screen">
      <Topbar back="/home" title="Interview prep" eyebrow={stage === 'invite' ? 'JUSPAY' : `JUSPAY · ROUND ${roundChoice === 'corrected' ? 3 : 1} OF ${loop.total}`} />
      <section className="page-pad prep-content">
        {stage === 'invite' && <PrepInvite roundChoice={roundChoice} onConfirmRound={confirmRound} onContinue={() => setStage('briefing')} />}
        {stage === 'briefing' && <PrepBriefing roundChoice={roundChoice} onOpenTheme={setTheme} onContinue={() => setStage('answers')} />}
        {stage === 'answers' && <PrepAnswers javaChoice={javaChoice} onConfirmJava={confirmJava} readiness={journey.readiness} onContinue={() => setStage('practice')} />}
        {stage === 'practice' && <PrepPractice answer={answer} setAnswer={setAnswer} result={result} onEvaluate={evaluate} onComplete={complete} />}
        {stage === 'ready' && <PrepReady covered={covered} readiness={journey.readiness} onOffer={toOffer} />}
      </section>
      <AnimatePresence>{theme && <PrepThemeSheet theme={theme} onClose={() => setTheme(null)} />}</AnimatePresence>
    </main>
  )
}

function OfferScreen() {
  const { journey, update } = useJourney()
  const params = new URLSearchParams(window.location.search)
  const requestedStage = params.get('stage')
  const story = params.get('story') || 'finale'
  const reduceMotion = useReducedMotion()
  const [stage, setStage] = useState(requestedStage || (journey.offerDetected ? (journey.offerReviewed ? 'decision' : 'reveal') : 'locked'))

  useEffect(() => {
    if (stage !== 'launch') return undefined
    const timer = setTimeout(() => setStage('reveal'), reduceMotion ? 50 : 720)
    return () => clearTimeout(timer)
  }, [stage, reduceMotion])

  if (stage === 'notification') return <OfferNotification onOpen={() => { update({ offerDetected: true }); setStage('launch') }} />
  if (stage === 'launch') return <OfferLaunch onSkip={() => setStage('reveal')} />
  if (stage === 'reveal') return <OfferReveal onClose={() => { update({ offerCelebrationDismissed: true }); go('/home') }} onUnderstand={() => { update({ offerReviewed: true }); go(`/offer/juspay?stage=decision&story=${story}`) }} />
  if (stage === 'employee') return <EmployeeConnectScreen story={story} />
  if (stage === 'negotiation') return <NegotiationScreen story={story} />

  return <main id="main-content" className={`offer-screen screen ${stage === 'locked' ? '' : 'offer-screen--decision'}`}><Topbar back="/home" title="Offer letter evaluation" right={<button className="icon-button" aria-label="More offer options"><MoreHorizontal size={20} /></button>} /><section className="page-pad offer-content">{stage === 'locked' ? <div className="time-jump"><div className="time-visual"><Clock3 size={30} /><span>12 days</span></div><Pill tone="soft">PRESENTER TIME JUMP</Pill><h1>Move forward to the email every jobseeker waits for.</h1><p>Simulate Gmail detecting Juspay’s offer after the interview loop.</p><button className="primary-button" onClick={() => { update({ offerDetected: true }); setStage('notification') }}>Jump to offer day <ArrowRight size={17} /></button></div> : <OfferDecisionScreen story={story} />}</section></main>
}

function OfferNotification({ onOpen }) {
  return <main id="main-content" className="notification-screen"><div className="lock-glow" aria-hidden="true" /><div className="lock-status"><span>9:41</span><span>Saturday, 8 August</span></div><button className="push-notification" onClick={onOpen} aria-label="Open AmbitionBox notification about Juspay"><span className="notification-app"><Logo small /></span><span><span className="notification-head"><strong>AmbitionBox</strong><small>now</small></span><b>Arjun, there’s a big update on your Juspay application.&nbsp;<span className="suspense-emoji" role="img" aria-label="Fingers crossed">🤞</span></b><small>Tap to see what changed.</small></span><ChevronRight size={20} /></button><p className="tap-hint">Tap the notification to open</p></main>
}

function OfferLaunch({ onSkip }) {
  return <main id="main-content" className="offer-launch"><motion.div className="launch-brand" initial={{ scale: .88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><div className="launch-official-logo" aria-label="AmbitionBox"><img src="/ambitionbox-launch-mark.svg" alt="" aria-hidden="true" /><span>AmbitionBox</span></div><span>Opening your update…</span></motion.div><button className="text-button" onClick={onSkip}>Skip animation</button></main>
}

function OfferReveal({ onClose, onUnderstand }) {
  const reduceMotion = useReducedMotion()
  const requestedMoment = new URLSearchParams(window.location.search).get('moment')
  const [moment, setMoment] = useState(requestedMoment === 'celebration' ? 'celebration' : 'anticipation')

  useEffect(() => {
    if (requestedMoment || moment !== 'anticipation') return undefined
    const timer = setTimeout(() => setMoment('celebration'), reduceMotion ? 900 : 1550)
    return () => clearTimeout(timer)
  }, [moment, reduceMotion, requestedMoment])

  return (
    <main id="main-content" className="offer-reveal-v3" role="dialog" aria-modal="true" aria-labelledby="offer-reveal-title">
      <button className="reveal-close" onClick={onClose} aria-label="Close offer celebration"><X size={22} /></button>
      <div className="reveal-light" aria-hidden="true" />
      {moment === 'celebration' && <div className="celebration-burst" aria-hidden="true">{Array.from({ length: 18 }).map((_, i) => <i key={i} style={{ '--i': i, '--x': `${(i * 43) % 94 + 3}%`, '--delay': `${i * .035}s` }} />)}</div>}
      <AnimatePresence mode="wait">
        {moment === 'anticipation' ? (
          <motion.section className="reveal-anticipation" key="anticipation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: reduceMotion ? 0 : .38 }}>
            <h1 id="offer-reveal-title">This is the moment you’ve been working towards.</h1>
          </motion.section>
        ) : (
          <motion.section className="reveal-celebration" key="celebration" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .5 }}>
            <div className="reveal-content">
              <h1 id="offer-reveal-title"><span>Congratulations, Arjun.</span><strong>You got the offer.</strong></h1>
              <motion.div className="reveal-offer-card" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: reduceMotion ? 0 : .22 }}>
                <div className="reveal-offer-top"><CompanyLogo initials="JP" /><span className="reveal-offer-identity"><strong>Senior Backend Engineer</strong><small>Juspay · Bengaluru</small></span><span className="reveal-offer-total"><small>Total</small><strong>{offer.total}</strong><em>per year</em></span></div>
                <div className="reveal-understand-list"><span className="reveal-understand-label">Before you decide, understand</span>{[
                  ['What working at Juspay feels like', 'Culture, growth and work-life signals'],
                  ['How strong your offer really is', 'Market range and negotiation room'],
                  ['What the move means for your money', 'Take-home, living costs and relocation'],
                  ['What to verify before accepting', 'Hybrid norms, variable pay and team reality'],
                ].map(([title, detail]) => <div key={title}><span className="reveal-check"><Check size={13} /></span><span><strong>{title}</strong><small>{detail}</small></span></div>)}</div>
              </motion.div>
            </div>
            <div className="reveal-actions"><button className="primary-button primary-button--light" onClick={onUnderstand}>Understand my offer <ArrowRight size={17} /></button><p><ShieldCheck size={14} /> Detected from your offer email. Nothing accepted automatically.</p></div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  )
}

function calculateMoveImpact(assumptions) {
  const housing = {
    solo: { label: '1 BHK on your own', living: 13, headroom: 39, relocation: 90 },
    shared: { label: 'Shared 2 BHK', living: 7, headroom: 45, relocation: 68 },
    nearOffice: { label: 'Live near the office', living: 16, headroom: 36, relocation: 96 },
  }[assumptions.housing] || { label: '1 BHK on your own', living: 13, headroom: 39, relocation: 90 }
  const officeAdjustment = (assumptions.officeDays - 3) * 1
  const travelAdjustment = (assumptions.homeTrips - 4) * .5
  return { ...housing, living: Math.round(housing.living + officeAdjustment + travelAdjustment), headroom: Math.round(housing.headroom - officeAdjustment - travelAdjustment) }
}

function OfferDecisionScreen({ story }) {
  const { journey, update } = useJourney()
  const requestedPanel = new URLSearchParams(window.location.search).get('panel')
  const [assumptionsOpen, setAssumptionsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [sourceDocument, setSourceDocument] = useState(['letter', 'email'].includes(requestedPanel) ? requestedPanel : null)
  const [assistantOpen, setAssistantOpen] = useState(requestedPanel === 'assistant')
  const [reviewsOpen, setReviewsOpen] = useState(requestedPanel === 'reviews')
  const [salaryInsightsOpen, setSalaryInsightsOpen] = useState(requestedPanel === 'salary')
  const assumptions = journey.relocationAssumptions || offerDecision.move
  const impact = calculateMoveImpact(assumptions)
  const topicQuestions = {
    'Can I negotiate this salary?': 'What gives me room to negotiate?',
    'Are ESOPs included?': 'Are ESOPs included in my Juspay offer?',
    'What should I verify?': 'What should I verify about working at Juspay?',
  }
  const answerQuestion = (value = question) => {
    const normalized = value.toLowerCase()
    if (/save|money|month|afford/.test(normalized)) setAnswer({ text: `Using your current assumptions, your estimated monthly headroom improves by about ₹${impact.headroom}k after tax and Bengaluru living costs.`, source: 'Offer letter + editable cost estimate' })
    else if (/move|pune|bengaluru|rent|city/.test(normalized)) setAnswer({ text: `Bengaluru is estimated to cost ₹${impact.living}k more per month, plus about ₹${impact.relocation}k once to relocate. Four Jaipur trips a year are included.`, source: 'Your profile + editable cost estimate' })
    else if (/esop|equity/.test(normalized)) setAnswer({ text: 'Your offer letter does not mention ESOPs. AmbitionBox data shows employees report ESOP options at Juspay, so confirm your eligibility and grant terms with the recruiter.', source: offerDecision.benefitSignals.esops.source, needsHuman: true })
    else if (/company|juspay|work|culture|hybrid|verify/.test(normalized)) setAnswer({ text: 'Reviews support strong learning and culture. Team-level hybrid practice, workload, and variable payout still need a human answer.', source: '847 AmbitionBox reviews · updated 3 days ago', needsHuman: true })
    else if (/people|employee|someone|anonymous/.test(normalized)) setAnswer({ text: 'A verified backend employee who also moved to Bengaluru is available for a mediated anonymous question.', source: 'Future anonymous employee connection', needsHuman: true })
    else if (/negotiat|ask|leverage|response/.test(normalized)) setAnswer({ text: 'Your strongest case combines the ₹30L market ceiling, confirmed payments experience, and relocation. Prioritise total or fixed pay before adding secondary asks.', source: 'Offer + market + confirmed profile evidence' })
    else setAnswer({ text: 'I can’t verify that from the offer, your profile, or AmbitionBox data. Ask a verified employee or prepare a precise recruiter question.', source: 'Evidence limit', unknown: true })
  }
  const chooseTopic = (topic) => { const next = topicQuestions[topic]; setQuestion(next); answerQuestion(next) }
  const offerFacts = [
    { id: 'salary', icon: CircleDollarSign, title: 'Salary', value: offer.total, insights: ['₹13L more than your current ₹15L compensation (+87%).', '₹6L above your ₹22L+ target.', '₹4.5L is variable or one-time; ₹23.5L is fixed.'], status: 'Matches you', tone: 'match', source: 'Offer letter · page 1 + your profile', parts: [['Fixed', offer.fixed], ['Variable', offer.variable], ['Joining bonus', offer.joining]] },
    { id: 'role', icon: BriefcaseBusiness, title: 'Designation', value: offer.letter.designation, detail: 'This matches your preference for senior backend roles.', status: 'Matches you', tone: 'match', source: 'Offer letter · page 1' },
    { id: 'location', icon: MapPin, title: 'Job location', value: offer.letter.location, detail: `You are open to Bengaluru. Moving from Pune adds about ₹${impact.living}k in monthly costs.`, status: 'Matches you', tone: 'match', source: 'Offer letter · page 1' },
    { id: 'policy', icon: Building2, title: 'Work policy', value: offer.letter.workPolicy, detail: 'You prefer remote or light hybrid. Three office days may be heavier than your preference.', status: 'Doesn’t fully match', tone: 'consider', source: 'Offer letter · page 2' },
    { id: 'terms', icon: FileCheck2, title: 'Important terms', value: `${offer.letter.probation} probation · ${offer.letter.noticePeriod} notice`, detail: `Join by ${offer.letter.joiningDate}. Accept by ${offer.letter.validUntil}.`, status: 'Review terms', tone: 'consider', source: 'Offer letter · page 2' },
    { id: 'esops', icon: TrendingUp, title: 'ESOPs', value: offerDecision.benefitSignals.esops.summary, detail: 'Your offer letter does not mention equity. Confirm your eligibility and grant details with the recruiter if you have not already.', status: 'Confirm once', tone: 'consider', source: offerDecision.benefitSignals.esops.source },
    { id: 'benefits', icon: ShieldCheck, title: 'Benefits', value: offer.letter.benefits, detail: 'Health cover, leave and other benefits need an itemised confirmation.', status: 'Ask recruiter', tone: 'missing', source: 'Offer letter · page 2' },
  ]

  return (
    <motion.div className="decision-room decision-room--source-led" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <section className="offer-carry-card" aria-labelledby="offer-role-title">
        <div className="offer-carry-top">
          <CompanyLogo initials="JP" />
          <span className="offer-carry-identity"><strong id="offer-role-title">Senior Backend Engineer</strong><small>Juspay · Bengaluru · Hybrid</small></span>
          <span className="offer-carry-total"><small>Total</small><strong>{offer.total}</strong><em>per year</em></span>
        </div>
        <div className="offer-source-meta"><Mail size={17} /><span><strong>Detected from your Juspay email</strong><small>{offer.source.received} · PDF attached</small></span></div>
        <div className="offer-source-actions">
          <button onClick={() => setSourceDocument('letter')}><FileCheck2 size={16} /> View offer letter</button>
          <button onClick={() => setSourceDocument('email')}><Mail size={16} /> Open source email</button>
        </div>
      </section>

      <section className="decision-section offer-breakdown-section" aria-labelledby="offer-breakdown-title">
        <div className="offer-breakdown-head"><h1 id="offer-breakdown-title">Offer breakdown</h1><p><strong>{offer.preferenceEvaluation.matched}/{offer.preferenceEvaluation.total}</strong> preference match</p></div>

        <div className="offer-fact-list">
          {offerFacts.map((fact) => {
            const FactIcon = fact.icon
            return <article className={`offer-fact offer-fact--${fact.tone} ${fact.id === 'salary' ? 'offer-fact--salary' : ''}`} key={fact.id}><span className="offer-fact-icon"><FactIcon size={18} /></span><div><span className="offer-fact-heading"><small>{fact.title}</small><b>{fact.status}</b></span><strong>{fact.value}</strong>{fact.parts && <div className="salary-fact-parts">{fact.parts.map(([label, value]) => <span key={label}><small>{label}</small><b>{value}</b></span>)}</div>}{fact.insights ? <ul className="salary-personal-insights">{fact.insights.map((insight, index) => <li className={index === fact.insights.length - 1 ? 'is-caution' : 'is-positive'} key={insight}><span aria-hidden="true" />{insight}</li>)}</ul> : <p className="offer-fact-personal">{fact.detail}</p>}<em><Link2 size={12} /> {fact.source}</em>{fact.id === 'location' && <button className="inline-edit" onClick={() => setAssumptionsOpen(true)}><SlidersHorizontal size={14} /> Edit move estimate</button>}</div></article>
          })}
        </div>
      </section>

      <section className="decision-section salary-intelligence" aria-labelledby="negotiation-scope-title">
        <h2 className="plain-section-title" id="negotiation-scope-title">Negotiation scope</h2>
        <div className="negotiation-action-list">
          <div className="negotiation-list-title"><span className="negotiation-verdict">Strong scope</span><h3>Your offer is above average and close to the top 10%.</h3></div>
          <div className="ab-salary-benchmarks ab-salary-benchmarks--embedded">
            <div className="ab-salary-range"><span>Typical salary range</span><strong>{offerDecision.salaryBenchmarks.range}</strong><small>{offerDecision.salaryBenchmarks.context}</small></div>
            <div className="salary-benchmark-grid">
              <div><span className="salary-medallion salary-medallion--average">₹</span><small>Average salary</small><strong>{offerDecision.salaryBenchmarks.average}</strong></div>
              <div><span className="salary-medallion salary-medallion--ten">₹</span><small>Top 10% earn</small><strong>{offerDecision.salaryBenchmarks.topTen}</strong></div>
              <div><span className="salary-medallion salary-medallion--one">₹</span><small>Top 1% earn</small><strong>{offerDecision.salaryBenchmarks.topOne}</strong></div>
            </div>
          </div>
          <div className="negotiation-evidence-source"><img src="/favicon.svg" alt="" aria-hidden="true" /><span>Based on AmbitionBox salary data for senior backend roles in Bengaluru · {offerDecision.salaryBenchmarks.freshness}</span></div>
          <button className="secondary-button salary-insights-button" onClick={() => setSalaryInsightsOpen(true)}>View detailed salary insights</button>
          <h4 className="negotiation-action-heading">What you can do next</h4>
          <div className="negotiation-list-item"><span>1</span><div><strong>Ask for total compensation closer to ₹30L</strong><small>Your offer is close to the top-10% threshold.</small></div></div>
          <div className="negotiation-list-item"><span>2</span><div><strong>If that isn’t possible, ask to shift ₹1–1.5L from variable to fixed</strong><small>₹4.5L of the offer is variable or one-time pay.</small></div></div>
          <div className="negotiation-list-item"><span>3</span><div><strong>Ask about relocation support and confirm hybrid expectations</strong><small>Both affect the real value of the offer for you.</small></div></div>
          {journey.negotiationSaved && <div className="draft-return-note"><Copy size={16} /> Response copied for your review. Nothing was sent.</div>}
          <button onClick={() => go(`/offer/juspay?stage=negotiation&story=${story}`)}>Prepare my response <ArrowRight size={18} /></button>
        </div>
      </section>

      <section className="decision-section company-comparison" aria-labelledby="company-comparison-title">
        <div className="decision-section-head"><span className="section-icon"><Building2 size={20} /></span><div><h2 id="company-comparison-title">How Juspay compares with Razorpay</h2></div></div>
        <p className="section-intro">Juspay scores higher on every directly comparable workplace signal, but your specific team can still differ.</p>
        <div className="company-score-pair"><article><span>Current company</span><strong>Razorpay</strong><b><Star size={16} fill="currentColor" /> 3.4</b><small>762 reviews</small></article><ArrowRight size={19} /><article className="company-score-pair--new"><span>Offer company</span><strong>Juspay</strong><b><Star size={16} fill="currentColor" /> 4.0</b><small>847 reviews</small></article></div>
        <div className="rating-comparison-widget">
          <div className="rating-comparison-head"><span>AmbitionBox rating</span><span>Razorpay</span><span>Juspay</span><span>Change</span></div>
          {offerDecision.comparisonSignals.map((signal) => <div className="rating-comparison-row" key={signal.label}><strong>{signal.label}</strong><span>{signal.current}</span><i><ArrowRight size={13} /></i><span>{signal.offered}</span><b>{signal.delta}</b></div>)}
          <div className="comparison-source"><Info size={14} /> Based on 762 Razorpay and 847 Juspay employee reviews. Company-wide ratings do not predict a specific team.</div>
        </div>
      </section>

      <section className="decision-section company-reality" aria-labelledby="company-reality-title">
        <div className="decision-section-head"><span className="section-icon"><MessageCircle size={20} /></span><div><h2 id="company-reality-title">What employees say about working at Juspay</h2></div></div>
        <div className="ab-review-summary"><div className="review-summary-title"><strong>Reviews summary</strong><span>Powered by AI</span></div><article className="review-summary-pro"><h3><span>●</span> LOOKS POSITIVE</h3>{offerDecision.verifiedSignals.map((item) => <p key={item}>{item}</p>)}</article><article className="review-summary-mixed"><h3><span>●</span> VERIFY FOR YOUR TEAM</h3>{offerDecision.questionsToVerify.map((item) => <p key={item.id}>{item.label}</p>)}</article></div>
        <button className="secondary-button read-reviews-button" onClick={() => setReviewsOpen(true)}>Read all 847 reviews</button>
      </section>

      <section className="decision-section what-more-section" aria-labelledby="what-more-title">
        <h2 className="plain-section-title" id="what-more-title">Still in doubt?</h2>
        <p className="section-intro">Ask someone who has worked there about the parts company-wide reviews cannot answer.</p>
        <article className="next-action-card"><div className="anonymous-profile-stack" role="img" aria-label="Anonymous verified employee profiles"><span><CircleUserRound size={25} /></span><span><CircleUserRound size={25} /></span><span><CircleUserRound size={25} /></span></div><div><strong>Ask a Juspay employee anonymously</strong><p>Send one mediated question to a verified backend employee about team culture, hybrid days, or workload.</p><small><ShieldCheck size={13} /> Your name, contact details, and résumé are not shared.</small>{journey.employeeResponseSaved && <em><Check size={13} /> Employee perspective added to your decision</em>}</div><button onClick={() => go(`/offer/juspay?stage=employee&story=${story}`)}>{journey.employeeResponseSaved ? 'View response' : 'Ask anonymously'} <ArrowRight size={16} /></button></article>
      </section>

      <button className="offer-assistant-dock" onClick={() => setAssistantOpen(true)} aria-label="Ask about this offer"><span className="assistant-dock-icon"><Sparkles size={16} /></span><span>Ask anything about this offer</span><span className="assistant-dock-send"><ArrowRight size={17} /></span></button>
      <AnimatePresence>
        {assumptionsOpen && <RelocationAssumptionsSheet current={assumptions} onClose={() => setAssumptionsOpen(false)} onSave={(next) => { update({ relocationAssumptions: next }); setAssumptionsOpen(false) }} />}
        {sourceDocument && <OfferSourceSheet type={sourceDocument} onClose={() => setSourceDocument(null)} onSwitch={setSourceDocument} />}
        {reviewsOpen && <JuspayReviewsSheet onClose={() => setReviewsOpen(false)} />}
        {salaryInsightsOpen && <SalaryInsightsSheet onClose={() => setSalaryInsightsOpen(false)} />}
        {assistantOpen && <Sheet label="Ask about your offer" onClose={() => setAssistantOpen(false)}><div className="offer-assistant-sheet"><div className="assistant-sheet-intro"><span className="assistant-orb"><Sparkles size={17} /></span><span><h2>Ask about your offer</h2><p>Grounded in your offer letter and AmbitionBox data.</p></span></div><div className="assistant-suggestions"><span>Try asking</span>{Object.keys(topicQuestions).map((topic) => <button key={topic} onClick={() => chooseTopic(topic)}>{topic}<ChevronRight size={15} /></button>)}</div>{answer && <motion.div className={`offer-answer ${answer.unknown ? 'unknown' : ''}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} aria-live="polite"><span className="assistant-orb"><Sparkles size={15} /></span><div><p>{answer.text}</p><small>{answer.source}</small>{(answer.needsHuman || answer.unknown) && <div className="answer-actions"><button onClick={() => go(`/offer/juspay?stage=employee&story=${story}`)}>Ask an employee</button><button onClick={() => go(`/offer/juspay?stage=negotiation&story=${story}`)}>Ask the recruiter</button></div>}</div></motion.div>}<label className="offer-chat-composer"><span className="sr-only">Your question</span><input name="offer-question" autoComplete="off" value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && question.trim()) { event.preventDefault(); answerQuestion() } }} placeholder="Ask anything about this offer" /><button type="button" aria-label="Send question" disabled={!question.trim()} onClick={() => answerQuestion()}><ArrowRight size={18} /></button></label></div></Sheet>}
      </AnimatePresence>
    </motion.div>
  )
}

function OfferSourceSheet({ type, onClose, onSwitch }) {
  const isLetter = type === 'letter'
  return <Sheet label={isLetter ? 'Offer letter' : 'Source email'} onClose={onClose} wide><div className="offer-source-sheet"><Pill tone="soft">{isLetter ? 'OFFER LETTER' : 'SOURCE EMAIL'}</Pill><h2>{isLetter ? 'Your Juspay offer letter' : offer.source.subject}</h2>{isLetter ? <><div className="offer-document-preview"><div className="offer-document-brand"><CompanyLogo initials="JP" /><span><strong>Juspay</strong><small>{offer.source.attachment}</small></span></div><h3>Offer of employment</h3><p>Dear Arjun, we are pleased to offer you the position of <strong>{offer.letter.designation}</strong> in {offer.letter.location}.</p><dl><div><dt>Total compensation</dt><dd>{offer.total}</dd></div><div><dt>Fixed pay</dt><dd>{offer.fixed}</dd></div><div><dt>Variable pay</dt><dd>{offer.variable}</dd></div><div><dt>Joining bonus</dt><dd>{offer.joining}</dd></div><div><dt>Work policy</dt><dd>{offer.letter.workPolicy}</dd></div><div><dt>Joining date</dt><dd>{offer.letter.joiningDate}</dd></div><div><dt>Probation</dt><dd>{offer.letter.probation}</dd></div><div><dt>Notice period</dt><dd>{offer.letter.noticePeriod}</dd></div><div><dt>ESOPs</dt><dd>Not mentioned</dd></div><div><dt>Relocation support</dt><dd>Not mentioned</dd></div></dl></div><button className="secondary-button" onClick={() => onSwitch('email')}><Mail size={17} /> Open source email</button></> : <><div className="offer-email-preview"><div className="email-preview-head"><span className="email-avatar">AS</span><span><strong>{offer.source.sender}</strong><small>to Arjun Mehta</small></span></div><div className="email-preview-meta"><span>{offer.source.received}</span><b>{offer.source.subject}</b></div><p>Hi Arjun,</p><p>We are delighted to offer you the role of Senior Backend Engineer at Juspay. Please review the attached letter and respond by {offer.letter.validUntil}.</p><button onClick={() => onSwitch('letter')}><FileCheck2 size={17} /><span><strong>{offer.source.attachment}</strong><small>PDF · offer attachment</small></span><ChevronRight size={17} /></button></div><button className="secondary-button" onClick={() => onSwitch('letter')}><FileCheck2 size={17} /> View offer letter</button></>}<div className="prototype-source-note"><Info size={15} /><span><strong>Prototype source</strong><small>This is deterministic demo content. No real inbox or document is opened.</small></span></div></div></Sheet>
}

function JuspayReviewsSheet({ onClose }) {
  return <Sheet label="Juspay reviews" onClose={onClose} wide><div className="reviews-sheet"><div className="reviews-sheet-heading"><span className="reviews-score"><Star size={17} fill="currentColor" /> 4.0</span><span><h2>Juspay reviews</h2><p>847 employee reviews on AmbitionBox</p></span></div><div className="review-filter-row" aria-label="Applied review filters"><span>Backend engineering</span><span>Bengaluru</span><span>Recent</span></div><div className="reviews-sheet-summary"><h3>Most relevant themes for your decision</h3>{offerDecision.verifiedSignals.map((item) => <div key={item}><CheckCircle2 size={16} /><p>{item}</p></div>)}{offerDecision.questionsToVerify.map((item) => <div className="review-theme-to-check" key={item.id}><Info size={16} /><p>{item.label}</p></div>)}</div><div className="prototype-source-note"><Info size={15} /><span><strong>Demo review explorer</strong><small>This prototype shows deterministic themes from AmbitionBox data rather than opening a live company page.</small></span></div><button className="primary-button" onClick={onClose}>Back to offer evaluation</button></div></Sheet>
}

function SalaryInsightsSheet({ onClose }) {
  return <Sheet label="Detailed salary insights" onClose={onClose} wide><div className="salary-detail-sheet"><div className="salary-detail-heading"><img src="/favicon.svg" alt="" aria-hidden="true" /><span><h2>Detailed salary insights</h2><p>Senior backend · 6 to 9 years · Bengaluru</p></span></div><div className="salary-offer-position"><span><small>Your Juspay offer</small><strong>{offer.total}</strong></span><b>Above average</b></div><div className="salary-detail-grid"><div><small>Typical range</small><strong>{offerDecision.salaryBenchmarks.range}</strong></div><div><small>Average salary</small><strong>{offerDecision.salaryBenchmarks.average}</strong></div><div><small>Top 10% earn</small><strong>{offerDecision.salaryBenchmarks.topTen}</strong></div><div><small>Top 1% earn</small><strong>{offerDecision.salaryBenchmarks.topOne}</strong></div></div><div className="salary-detail-guidance"><Target size={17} /><span><strong>How to use this</strong><p>Your offer has room to discuss ₹30L or a more favourable fixed-to-variable split.</p></span></div><div className="prototype-source-note"><Info size={15} /><span><strong>AmbitionBox salary data</strong><small>{offerDecision.salaryBenchmarks.freshness} · Deterministic CEO-demo benchmark for this role and location.</small></span></div><button className="primary-button" onClick={onClose}>Back to offer evaluation</button></div></Sheet>
}

function RelocationAssumptionsSheet({ current, onClose, onSave }) {
  const [draft, setDraft] = useState(current)
  return <Sheet label="Edit move assumptions" onClose={onClose} wide><Pill tone="soft">YOUR ESTIMATE</Pill><h2>Make the Bengaluru comparison yours</h2><p className="sheet-lead">These assumptions change only this estimate. They do not update your profile.</p><div className="assumption-form"><fieldset><legend>Housing</legend><div className="choice-row">{[['solo','1 BHK'],['shared','Shared'],['nearOffice','Near office']].map(([value,label]) => <button type="button" key={value} className={draft.housing === value ? 'is-selected' : ''} onClick={() => setDraft({ ...draft, housing: value })}>{label}</button>)}</div></fieldset><fieldset><legend>Office days each week</legend><div className="choice-row">{[2,3,4].map((value) => <button type="button" key={value} className={draft.officeDays === value ? 'is-selected' : ''} onClick={() => setDraft({ ...draft, officeDays: value })}>{value} days</button>)}</div></fieldset><fieldset><legend>Trips home to Jaipur each year</legend><div className="choice-row">{[2,4,6].map((value) => <button type="button" key={value} className={draft.homeTrips === value ? 'is-selected' : ''} onClick={() => setDraft({ ...draft, homeTrips: value })}>{value} trips</button>)}</div></fieldset></div><button className="primary-button" onClick={() => onSave(draft)}>Update my estimate <Check size={17} /></button><p className="fine-print">Cost and tax figures are transparent estimates, not financial advice.</p></Sheet>
}

function EmployeeConnectScreen({ story }) {
  const { journey, update } = useJourney()
  const params = new URLSearchParams(window.location.search)
  const reduceMotion = useReducedMotion()
  const [status, setStatus] = useState(params.get('status') || journey.employeeRequestStatus || 'idle')
  const [reviewing, setReviewing] = useState(false)
  const [question, setQuestion] = useState(offerDecision.anonymousEmployee.question)
  useEffect(() => {
    if (status !== 'waiting' || params.get('hold') === '1') return undefined
    const timer = setTimeout(() => { setStatus('responded'); update({ employeeRequestStatus: 'responded' }) }, reduceMotion ? 80 : 1500)
    return () => clearTimeout(timer)
  }, [status, reduceMotion, update])
  const send = () => { setReviewing(false); setStatus('waiting'); update({ employeeRequestStatus: 'waiting' }) }
  const useResponse = () => { update({ employeeResponseSaved: true }); go(`/offer/juspay?stage=decision&story=${story}`) }

  return <main id="main-content" className="employee-screen screen"><Topbar back={`/offer/juspay?stage=decision&story=${story}`} title="Anonymous employee Q&A" eyebrow="JUSPAY" />
    {status === 'waiting' ? <section className="employee-wait page-pad"><div className="anonymous-avatar"><Users size={28} /></div><span className="spinner dark" /><Pill tone="soft">REQUEST MATCHED</Pill><h1>Finding the right perspective…</h1><p>Your question is being matched to a verified backend employee. No names or contact details are shared.</p><div className="simulation-note"><Info size={15} /> Prototype simulation—no employee is contacted.</div></section> : status === 'responded' ? <section className="employee-response page-pad"><div className="employee-profile"><span className="anonymous-avatar small"><UserRoundCheck size={20} /></span><span><strong>Verified Juspay employee</strong><small>Backend engineering · Identity protected</small></span><Pill tone="success">REPLIED</Pill></div><div className="question-quote"><span>YOUR QUESTION</span>{question}</div><div className="response-bubble"><p>“{offerDecision.anonymousEmployee.response}”</p><span>Current employee experience · Not official company policy</span></div><div className="source-receipt"><ShieldCheck size={15} /><span><strong>Privacy protected</strong><small>Both identities remain hidden. Conversation expires after 7 days.</small></span></div><button className="primary-button" onClick={useResponse}>Use this in my decision <Check size={17} /></button><button className="secondary-button" onClick={() => go(`/offer/juspay?stage=negotiation&story=${story}`)}>Prepare recruiter clarification</button><p className="fine-print">Prototype simulation—no real employee was contacted.</p></section> : <section className="employee-connect page-pad"><div className="employee-intro"><span className="anonymous-avatar"><Users size={25} /></span><Pill tone="soft">MEDIATED · ANONYMOUS</Pill><h1>Ask someone who knows the team.</h1><p>AmbitionBox found a verified employee with context close to yours.</p></div><div className="employee-profile recommended"><span className="anonymous-avatar small"><UserRoundCheck size={20} /></span><span><strong>{offerDecision.anonymousEmployee.title}</strong><small>{offerDecision.anonymousEmployee.tenure} · {offerDecision.anonymousEmployee.context}</small></span><Pill tone="success">BEST MATCH</Pill></div><label className="offer-question employee-question"><span>Your anonymous question</span><textarea value={question} onChange={(event) => setQuestion(event.target.value)} /></label><div className="privacy-list"><div><ShieldCheck size={17} /><span><strong>Your name stays private</strong><small>Your profile and résumé are never shared.</small></span></div><div><UserRoundCheck size={17} /><span><strong>The employee is verified</strong><small>Their name and contact details stay private too.</small></span></div></div>{reviewing ? <div className="request-review"><Pill tone="attention">REVIEW BEFORE REQUESTING</Pill><h2>Ready to ask anonymously?</h2><p>“{question}”</p><button className="primary-button" onClick={send}><Send size={17} /> Send simulated request</button><button className="text-button" onClick={() => setReviewing(false)}>Edit question</button><small>Prototype simulation—no employee will be contacted.</small></div> : <button className="primary-button" disabled={!question.trim()} onClick={() => setReviewing(true)}>Review anonymous request <ArrowRight size={17} /></button>}</section>}
  </main>
}

function NegotiationScreen({ story }) {
  const { update } = useJourney()
  const [selected, setSelected] = useState(['compensation','relocation','hybrid'])
  const [message, setMessage] = useState('Hi Ananya, thank you again for the offer—I’m genuinely excited about the opportunity to join Juspay. Given the role scope, my payments experience, and the ₹24–30L market range, would you be open to moving the total compensation closer to ₹30L, or shifting ₹1–1.5L from variable to fixed? As I’ll be relocating from Pune, I’d also appreciate discussing relocation support. Finally, could you confirm how the backend team applies the three-day hybrid policy? I’d be happy to discuss.')
  const [copied, setCopied] = useState(false)
  const options = [
    ['compensation','₹30L or more fixed pay','Primary ask · strongest evidence'],
    ['relocation','Relocation support','Pune → Bengaluru'],
    ['hybrid','Confirm team hybrid norms','Employee experience suggests verifying'],
  ]
  const toggle = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const copyDraft = async () => { try { await navigator.clipboard.writeText(message) } catch {} setCopied(true); update({ negotiationSaved: true }); setTimeout(() => setCopied(false), 1600) }
  return <main id="main-content" className="negotiation-screen screen"><Topbar back={`/offer/juspay?stage=decision&story=${story}`} title="Negotiation plan" eyebrow="JUSPAY OFFER" /><section className="page-pad negotiation-content"><div className="negotiation-hero"><Pill tone="success">NEGOTIATION POWER · STRONG</Pill><h1>Ask confidently—without overreaching.</h1><p>Every recommendation below is tied to the offer, market, or your confirmed evidence.</p></div><div className="negotiation-options">{options.map(([id,title,detail]) => <button key={id} className={selected.includes(id) ? 'selected' : ''} onClick={() => toggle(id)}><span>{selected.includes(id) ? <Check size={15} /> : null}</span><span><strong>{title}</strong><small>{detail}</small></span></button>)}</div><div className="negotiation-rationale"><span className="eyebrow">WHY THIS IS REASONABLE</span><div><Check size={15} /> Role range reaches ₹30L</div><div><Check size={15} /> Confirmed payments-system experience</div><div><Check size={15} /> Offer requires relocation</div></div><label className="message-box negotiation-box"><span>Draft to recruiter <Pill tone="soft">Not sent</Pill></span><textarea name="negotiation-draft" autoComplete="off" value={message} onChange={(event) => setMessage(event.target.value)} /></label><div className="honesty-note"><ShieldCheck size={17} /><p>Review and send from your own email. AmbitionBox will never negotiate or accept an offer without you.</p></div><button className="primary-button" aria-live="polite" onClick={copyDraft}>{copied ? <><Check size={17} /> Copied—ready for review</> : <><Copy size={17} /> Copy reviewed response</>}</button><button className="secondary-button" onClick={() => go(`/offer/juspay?stage=decision&story=${story}`)}>Back to offer insights</button></section></main>
}

export default App
