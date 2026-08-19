import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, Bell, Bookmark, BriefcaseBusiness, Check, CheckCircle2,
  ChevronDown, ChevronRight, CircleUserRound, Clock3, Copy, ExternalLink, FileCheck2,
  Home, Info, Link2, Mail, MessageCircle, MoreHorizontal, Pencil, Play, RefreshCcw,
  Search, Send, ShieldCheck, Sparkles, Star, Target, TrendingUp, UserRoundCheck, X,
} from 'lucide-react'
import {
  applications, candidate, chapters, jobs, juspay, offer, prepPlan, trackerStats,
} from './data'
import { useJourney } from './store'

const spring = { type: 'spring', stiffness: 330, damping: 30 }

function useLocation() {
  const [location, setLocation] = useState(() => ({ pathname: window.location.pathname, search: window.location.search }))
  useEffect(() => {
    const onPop = () => setLocation({ pathname: window.location.pathname, search: window.location.search })
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  return location
}

function go(path) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0, behavior: 'instant' })
}

function AppLink({ to, children, onNavigate, ...props }) {
  return <a href={to} onClick={(event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onNavigate?.()
    go(to)
  }} {...props}>{children}</a>
}

function Logo({ small = false }) {
  return (
    <div className={`brand ${small ? 'brand--small' : ''}`} aria-label="AmbitionBox">
      <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
      {!small && <span>ambition<span>box</span></span>}
    </div>
  )
}

function Avatar() {
  return <button className="avatar" aria-label="Arjun’s profile">{candidate.initials}</button>
}

function Topbar({ title, back, right, eyebrow }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        {back ? <AppLink className="icon-button" to={back} aria-label="Go back"><ArrowLeft size={20} /></AppLink> : <Logo small />}
        <div>{eyebrow && <div className="eyebrow topbar-eyebrow">{eyebrow}</div>}<div className="topbar-title">{title}</div></div>
      </div>
      {right || <Avatar />}
    </header>
  )
}

function BottomNav({ active }) {
  const items = [
    { id: 'home', label: 'Home', path: '/home', icon: Home },
    { id: 'tracker', label: 'Tracker', path: '/tracker', icon: BriefcaseBusiness },
    { id: 'matches', label: 'Matches', path: '/matches', icon: Search },
  ]
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map(({ id, label, path, icon: Icon }) => (
        <AppLink key={id} className={active === id ? 'is-active' : ''} to={path}>
          <Icon size={21} strokeWidth={active === id ? 2.5 : 2} /><span>{label}</span>
        </AppLink>
      ))}
      <AppLink to="/demo"><Play size={20} /><span>Demo</span></AppLink>
    </nav>
  )
}

function AssistantDock({ onClick, label = 'Ask Career Copilot' }) {
  return (
    <button className="assistant-dock" onClick={onClick}>
      <span className="assistant-orb"><Sparkles size={16} /></span>
      <span>{label}</span><ChevronRight size={18} />
    </button>
  )
}

function Screen({ children, active, className = '' }) {
  return <main id="main-content" className={`screen ${className}`}>{children}<BottomNav active={active} /></main>
}

function Sheet({ children, onClose, label, wide = false }) {
  return (
    <motion.div className="sheet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.section className={`sheet ${wide ? 'sheet--wide' : ''}`} role="dialog" aria-modal="true" aria-label={label}
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={spring}>
        <div className="sheet-handle" />
        {onClose && <button className="sheet-close icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button>}
        {children}
      </motion.section>
    </motion.div>
  )
}

function Pill({ children, tone = '' }) { return <span className={`pill ${tone ? `pill--${tone}` : ''}`}>{children}</span> }

function CompanyLogo({ initials, color }) {
  return <span className="company-logo" style={color ? { background: color } : undefined}>{initials}</span>
}

function ProgressRing({ value, total = 100, label, color = 'var(--primary)' }) {
  const pct = Math.round((value / total) * 100)
  return (
    <div className="progress-ring" style={{ '--progress': `${pct * 3.6}deg`, '--ring-color': color }}>
      <div><strong>{label || `${value}%`}</strong><span>{total === 100 ? 'match' : 'ready'}</span></div>
    </div>
  )
}

function App() {
  const { pathname } = useLocation()
  const routes = {
    '/': DemoLauncher,
    '/demo': DemoLauncher,
    '/home': HomeScreen,
    '/tracker': TrackerScreen,
    '/matches': MatchesScreen,
    '/jobs/juspay': JobDetailScreen,
    '/assistant/juspay': AssistantScreen,
    '/prep/juspay': PrepScreen,
    '/offer/juspay': OfferScreen,
  }
  const Component = routes[pathname] || DemoLauncher
  return <div className="stage"><div className="phone-shell"><a className="skip-link" href="#main-content">Skip to content</a><Component /></div></div>
}

function DemoLauncher() {
  const { applyPreset, reset } = useJourney()
  const [resetDone, setResetDone] = useState(false)

  const openChapter = (chapter) => {
    applyPreset(chapter.preset)
    go(chapter.path)
  }
  const start = () => { reset(); go('/tracker?flow=gmail') }
  const resetDemo = () => { reset(); setResetDone(true); setTimeout(() => setResetDone(false), 1800) }

  return (
    <main id="main-content" className="launcher">
      <div className="launcher-hero">
        <div className="launcher-top"><Logo /><button className="icon-button glass" aria-label="More options"><MoreHorizontal size={20} /></button></div>
        <Pill tone="inverted">CEO DEMO · 8 MIN</Pill>
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
  const initialStep = params.get('step') || (params.get('flow') === 'gmail' ? 'trust' : null)
  const [step, setStep] = useState(initialStep)
  const [progress, setProgress] = useState(0)
  const [section, setSection] = useState('attention')

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

  return (
    <Screen active="tracker" className="tracker-screen">
      <Topbar title="Application tracker" right={<button className="icon-button" aria-label="Notifications"><Bell size={20} /></button>} />
      {!journey.emailConnected ? (
        <section className="empty-state page-pad">
          <div className="empty-illustration" aria-hidden="true">
            <span className="mail-card mail-card--one"><Mail size={22} /></span>
            <span className="mail-card mail-card--two"><BriefcaseBusiness size={22} /></span>
            <span className="empty-spark"><Sparkles size={18} /></span>
          </div>
          <Pill tone="soft">APPLICATIONS, ON AUTOPILOT</Pill>
          <h1>Your job search is probably already in your inbox.</h1>
          <p>Connect Gmail and we’ll organise applications, deadlines, and recruiter replies automatically.</p>
          <button className="primary-button" onClick={() => setStep('trust')}><Mail size={18} /> Connect Gmail</button>
          <button className="text-button" onClick={() => go('/home')}>Explore without connecting <ArrowRight size={16} /></button>
          <div className="trust-line"><ShieldCheck size={16} /><span>Read-only job emails. Disconnect anytime.</span></div>
        </section>
      ) : (
        <section className="page-pad tracker-content">
          <div className="tracker-summary">
            <div className="tracker-summary-top"><div><span className="eyebrow">YOUR SEARCH</span><h1>15 applications</h1></div><span className="sync-badge"><span /> Synced now</span></div>
            <div className="stat-row">
              {trackerStats.map((stat) => <button key={stat.label} className={`stat ${section === stat.tone ? 'is-selected' : ''}`} onClick={() => setSection(stat.tone === 'attention' ? 'attention' : stat.tone)}><strong>{stat.value}</strong><span>{stat.label}</span></button>)}
            </div>
          </div>
          <div className="content-heading"><div><span className="eyebrow">DO NEXT</span><h2>{journey.phonepeReplied ? '2 things need you' : '3 things need you'}</h2></div><button className="filter-button">All <ChevronDown size={15} /></button></div>
          {section === 'attention' ? (
            <div className="application-list">
              {applications.attention.filter((item) => !(journey.phonepeReplied && item.company === 'PhonePe')).map((item) => (
                <button className="application-card" key={item.company} onClick={() => item.company === 'PhonePe' ? go('/home?action=phonepe') : null}>
                  <CompanyLogo initials={item.company.slice(0, 2).toUpperCase()} color={item.color} />
                  <span className="application-copy"><strong>{item.company}</strong><small>{item.role}</small><span className="application-action">{item.action} <ArrowRight size={13} /></span></span>
                  <span className={`due ${item.when === 'Overdue' ? 'due--urgent' : ''}`}>{item.when}</span>
                </button>
              ))}
              {journey.phonepeReplied && <div className="inline-success"><CheckCircle2 size={20} /><span><strong>PhonePe reply sent</strong><small>Moved to Waiting</small></span></div>}
            </div>
          ) : section === 'waiting' ? (
            <div className="application-list">{applications.waiting.map((item) => <div className="application-card" key={item.company}><CompanyLogo initials={item.company.slice(0, 2).toUpperCase()} /><span className="application-copy"><strong>{item.company}</strong><small>{item.role}</small><span className="muted-line">{item.when}</span></span></div>)}</div>
          ) : (
            <div className="closed-state"><CheckCircle2 size={28} /><h3>8 applications closed</h3><p>Archived automatically from status emails. Nothing needs your attention here.</p></div>
          )}
          <AssistantDock onClick={() => go('/home')} label="What should I do next?" />
        </section>
      )}

      <AnimatePresence>
        {step === 'trust' && <GmailTrust onContinue={() => setStep('account')} onClose={() => setStep(null)} />}
        {step === 'account' && <GmailAccount onContinue={() => setStep('scanning')} onClose={() => setStep(null)} />}
        {step === 'scanning' && <GmailScanning progress={progress} onSkip={finishImport} />}
        {step === 'result' && <GmailResult onDone={() => setStep(null)} />}
      </AnimatePresence>
    </Screen>
  )
}

function GmailTrust({ onContinue, onClose }) {
  return (
    <Sheet label="Connect Gmail" onClose={onClose}>
      <div className="integration-icon gmail-icon"><Mail size={25} /></div>
      <Pill tone="soft">FUTURE GMAIL CONNECTION</Pill>
      <h2>Turn job emails into a live tracker</h2>
      <p className="sheet-lead">AmbitionBox will find application updates, recruiter messages, and deadlines—then organise them for you.</p>
      <div className="permission-list">
        <div><Search size={18} /><span><strong>Only job-search emails</strong><small>We look for known hiring signals and companies.</small></span></div>
        <div><ShieldCheck size={18} /><span><strong>Read only</strong><small>We can’t send, delete, or change your email.</small></span></div>
        <div><UserRoundCheck size={18} /><span><strong>You stay in control</strong><small>Review everything and disconnect anytime.</small></span></div>
      </div>
      <button className="primary-button" onClick={onContinue}>Choose Google account <ArrowRight size={17} /></button>
      <p className="fine-print">Demo simulation—no Google account is accessed.</p>
    </Sheet>
  )
}

function GmailAccount({ onContinue, onClose }) {
  return (
    <Sheet label="Choose Google account" onClose={onClose}>
      <div className="google-g">G</div>
      <h2>Choose an account</h2>
      <p className="sheet-lead">Continue to AmbitionBox Career Copilot</p>
      <button className="account-row" onClick={onContinue}>
        <span className="account-avatar">A</span><span><strong>Arjun Mehta</strong><small>arjun.mehta@gmail.com</small></span><ChevronRight size={18} />
      </button>
      <div className="google-note"><ShieldCheck size={16} /> Google permissions are simulated for this demo.</div>
    </Sheet>
  )
}

function GmailScanning({ progress, onSkip }) {
  const messages = progress < 35 ? 'Finding application emails…' : progress < 70 ? 'Reading status updates…' : 'Building your tracker…'
  return (
    <motion.div className="full-flow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Logo />
      <div className="scan-visual"><div className="scan-orbit"><Mail size={28} /></div><span className="scan-item scan-item--1">Juspay</span><span className="scan-item scan-item--2">CRED</span><span className="scan-item scan-item--3">PhonePe</span></div>
      <div><Pill tone="soft">SECURE, READ-ONLY SCAN</Pill><h1>Organising your job search</h1><p>{messages}</p></div>
      <div className="progress-track"><motion.span animate={{ width: `${progress}%` }} /></div>
      <div className="scan-meta"><span>{progress}%</span><span>Usually takes 5–6 seconds</span></div>
      <button className="text-button" onClick={onSkip}>Skip scan</button>
    </motion.div>
  )
}

function GmailResult({ onDone }) {
  return (
    <Sheet label="Import complete">
      <div className="success-burst"><Check size={28} /></div>
      <Pill tone="success">IMPORT COMPLETE</Pill>
      <h2>15 applications found</h2>
      <p className="sheet-lead">Your tracker is ready—and three conversations need your attention.</p>
      <div className="result-stats">{trackerStats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div>
      <div className="discovery-card"><CompanyLogo initials="PP" color="#5f259f" /><span><strong>PhonePe is waiting for your reply</strong><small>Recruiter emailed 2 hours ago</small></span></div>
      <button className="primary-button" onClick={onDone}>Open my tracker <ArrowRight size={17} /></button>
    </Sheet>
  )
}

function HomeScreen() {
  const { journey, update } = useJourney()
  const params = new URLSearchParams(window.location.search)
  const [actionOpen, setActionOpen] = useState(params.get('action') === 'phonepe')
  const [sent, setSent] = useState(false)
  const sendReply = () => {
    update({ phonepeReplied: true })
    setSent(true)
    setTimeout(() => setActionOpen(false), 1100)
  }

  return (
    <Screen active="home" className="home-screen">
      <div className="home-header page-pad"><Logo /><div className="home-header-actions"><button className="icon-button" aria-label="Notifications"><Bell size={20} /></button><Avatar /></div></div>
      <section className="page-pad home-intro"><span className="eyebrow">THURSDAY · YOUR CAREER</span><h1>Good morning, Arjun.</h1><p>{journey.emailConnected ? 'Here’s the one move that will create momentum today.' : 'Let’s make your next career move a little clearer.'}</p></section>

      <section className="page-pad">
        {!journey.emailConnected ? (
          <div className="priority-card priority-card--connect">
            <div className="priority-kicker"><span className="pulse-dot" /> UNLOCK YOUR LIVE JOURNEY</div>
            <h2>Know what needs you—before an opportunity goes cold.</h2>
            <p>Connect Gmail to organise applications and surface recruiter actions.</p>
            <button className="light-button" onClick={() => go('/tracker?flow=gmail')}><Mail size={17} /> Connect Gmail</button>
          </div>
        ) : !journey.phonepeReplied ? (
          <motion.div className="priority-card" layout>
            <div className="priority-top"><div className="priority-kicker"><span className="pulse-dot" /> RECRUITER REPLY NEEDED</div><span className="time-chip">2h ago</span></div>
            <div className="priority-company"><CompanyLogo initials="PP" color="#5f259f" /><span><strong>PhonePe</strong><small>Backend Engineer III</small></span></div>
            <h2>“Can you confirm your availability for a quick conversation?”</h2>
            <p>Replying today keeps a high-paying opportunity warm.</p>
            <button className="light-button" onClick={() => setActionOpen(true)}>Review reply <ArrowRight size={17} /></button>
          </motion.div>
        ) : (
          <motion.div className="priority-card priority-card--juspay" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <div className="priority-top"><div className="priority-kicker"><Sparkles size={13} /> BEST NEXT OPPORTUNITY</div><Pill tone="success">89% match</Pill></div>
            <div className="priority-company"><CompanyLogo initials="JP" /><span><strong>Juspay</strong><small>Senior Backend Engineer</small></span></div>
            <h2>Your payments experience makes this unusually relevant.</h2>
            <div className="priority-facts"><span>₹24–30L</span><span>Hybrid</span><span>4.0 ★</span></div>
            <button className="light-button" onClick={() => go('/jobs/juspay')}>See why it fits <ArrowRight size={17} /></button>
          </motion.div>
        )}
      </section>

      <section className="page-pad home-section">
        <div className="section-heading"><div><span className="eyebrow">FOR YOU</span><h2>Keep moving</h2></div><button className="text-button compact" onClick={() => go('/matches')}>See all</button></div>
        <div className="action-grid">
          <button onClick={() => go('/matches')}><span className="action-icon lilac"><Search size={20} /></span><strong>{journey.naukriConnected ? '4 ranked matches' : 'Fresh job matches'}</strong><small>{journey.naukriConnected ? 'Across four sources' : 'Based on your profile'}</small><ArrowRight size={17} /></button>
          <button onClick={() => go('/tracker')}><span className="action-icon mint"><BriefcaseBusiness size={20} /></span><strong>{journey.emailConnected ? '15 applications' : 'Application tracker'}</strong><small>{journey.emailConnected ? '3 need attention' : 'Organise your search'}</small><ArrowRight size={17} /></button>
        </div>
      </section>

      <section className="page-pad momentum-section">
        <div className="momentum-card"><div><span className="eyebrow">YOUR MOMENTUM</span><h3>Small actions. Compounding progress.</h3></div><div className="week-dots">{['M','T','W','T','F'].map((day, index) => <span className={index < (journey.phonepeReplied ? 4 : 3) ? 'done' : ''} key={`${day}-${index}`}><i>{index < (journey.phonepeReplied ? 4 : 3) && <Check size={12} />}</i>{day}</span>)}</div><blockquote>“A career grows when preparation meets the right moment.”</blockquote></div>
        <AssistantDock onClick={() => go('/assistant/juspay')} />
      </section>

      <AnimatePresence>{actionOpen && <ReplySheet sent={sent} onClose={() => setActionOpen(false)} onSend={sendReply} />}</AnimatePresence>
    </Screen>
  )
}

function ReplySheet({ sent, onClose, onSend }) {
  const [message, setMessage] = useState('Hi Rhea, thanks for reaching out. I’d be happy to connect. I’m available tomorrow between 11:00 AM and 1:00 PM, or Friday after 3:00 PM. Let me know what works best.')
  return (
    <Sheet label="Review recruiter reply" onClose={onClose} wide>
      {sent ? <div className="sent-state"><div className="success-burst"><Check size={28} /></div><h2>Reply sent</h2><p>PhonePe moved to Waiting. Your next best action is ready.</p></div> : <>
        <Pill tone="attention">PHONEPE · RECRUITER EMAIL</Pill><h2>Review before sending</h2><p className="sheet-lead">We drafted a concise response using the recruiter’s request. Nothing sends without you.</p>
        <label className="message-box"><span>Reply</span><textarea name="phonepe-reply" autoComplete="off" value={message} onChange={(e) => setMessage(e.target.value)} /></label>
        <div className="draft-note"><Sparkles size={16} /> Availability is the only personal detail included.</div>
        <button className="primary-button" onClick={onSend}><Send size={17} /> Send reply</button>
      </>}
    </Sheet>
  )
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
  return <Sheet label="Imported Naukri profile" onClose={onBack}><div className="sheet-step">1 OF 2 · IMPORTED PROFILE</div><div className="profile-head"><span className="large-avatar">AM</span><span><h2>Arjun Mehta</h2><p>Senior Backend Engineer at Razorpay</p></span></div><div className="profile-facts"><div><span>Experience</span><strong>6 years</strong></div><div><span>Location</span><strong>Bengaluru</strong></div><div><span>Current salary</span><strong>₹15L</strong></div><div><span>Profile updated</span><strong>12 days ago</strong></div></div><div className="tag-block"><span>Top skills</span><div><Pill>Java</Pill><Pill>Kafka</Pill><Pill>Distributed systems</Pill><Pill>Payments</Pill><Pill>AWS</Pill></div></div><button className="primary-button" onClick={onContinue}>Review and edit preferences <ArrowRight size={17} /></button></Sheet>
}

function NaukriPreferences({ onBack, onContinue }) {
  const [salary, setSalary] = useState('₹22L+')
  const [workModes, setWorkModes] = useState(['Remote', 'Light hybrid'])
  const toggleMode = (mode) => setWorkModes((current) => current.includes(mode) ? current.filter((item) => item !== mode) : [...current, mode])
  return <Sheet label="Confirm job preferences" onClose={onBack} wide><div className="sheet-step">2 OF 2 · YOUR PREFERENCES</div><h2>What should a great next move look like?</h2><p className="sheet-lead">These shape ranking—not eligibility. You can change them anytime.</p><div className="form-stack"><label><span>Target role</span><div className="input-shell">Senior Backend Engineer <Pencil size={15} /></div></label><label><span>Minimum target salary</span><input name="minimum-salary" autoComplete="off" inputMode="text" value={salary} onChange={(e) => setSalary(e.target.value)} /></label><fieldset><legend>Work mode</legend><div className="choice-row">{['Remote', 'Light hybrid', 'Office'].map((mode) => <button type="button" key={mode} className={workModes.includes(mode) ? 'is-selected' : ''} onClick={() => toggleMode(mode)}>{mode}</button>)}</div></fieldset><label><span>Preferred location</span><div className="input-shell">Bengaluru <Pill tone="soft">+ Remote</Pill></div></label></div><button className="primary-button" onClick={onContinue}><Check size={17} /> Confirm preferences</button></Sheet>
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

      <div className="sticky-cta"><button className="save-cta" onClick={() => toggleSaved('juspay')} aria-label={saved ? 'Unsave job' : 'Save job'}><Bookmark size={20} fill={saved ? 'currentColor' : 'none'} /></button><button className="primary-button" onClick={() => go(readiness >= 14 ? '/prep/juspay' : '/assistant/juspay')}>{readiness >= 14 ? 'Prepare for interview' : 'Improve my application'} <ArrowRight size={17} /></button></div>
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
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(98, 105, 133); doc.text('Senior Backend Engineer · Bengaluru', 56, 88)
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
          <div className="resume-preview"><div className="resume-toolbar"><span><FileCheck2 size={17} /> Arjun_Mehta_Juspay.pdf</span><Pill tone="success">Tailored</Pill></div><div className="resume-paper"><div className="resume-name">ARJUN MEHTA</div><div className="resume-role">Senior Backend Engineer · Bengaluru</div><div className="resume-rule" /><strong>RAZORPAY · SENIOR BACKEND ENGINEER</strong><p className="highlight-line">Designed idempotent payment workflows processing high-volume retries safely.</p><p className="highlight-line">Led reliability improvements that reduced payment callback failures by 31%.</p><p>Built Kafka-based event processing with clear observability and ownership.</p></div></div>
          <div className="correction-card"><div><span className="eyebrow">ONE HONEST CHECK</span><h3>Did you personally own production Java services for 3+ years?</h3><p>Juspay lists this explicitly. Confirm only if it’s accurate.</p></div><div className="choice-row"><button className={javaChoice === true ? 'is-selected' : ''} onClick={() => confirmJava(true)}>Yes, I did</button><button className={javaChoice === false ? 'is-selected' : ''} onClick={() => confirmJava(false)}>Not quite</button></div>{javaChoice === false && <p className="correction-result"><ShieldCheck size={15} /> Kept at 14/15. The gap stays visible—your résumé remains honest.</p>}{javaChoice === true && <p className="correction-result success"><Check size={15} /> Confirmed. Profile Readiness is now 15/15.</p>}</div>
          <div className="button-row"><button className="secondary-button" aria-live="polite" disabled={downloading} onClick={downloadResume}>{downloading ? 'Preparing PDF…' : 'Download PDF'}</button><button className="primary-button" onClick={() => go('/jobs/juspay')}>Return to job <ArrowRight size={17} /></button></div>
        </motion.div>}
      </section>
    </main>
  )
}

function PrepScreen() {
  const { journey, update } = useJourney()
  const requestedStage = new URLSearchParams(window.location.search).get('stage')
  const demoPrepAnswer = 'I’d assign an idempotency key at the payment-event boundary, persist processing state before side effects, and use Kafka partitions for per-payment ordering. Retries use exponential backoff with a DLQ; metrics cover lag, duplicate rate, and terminal failures.'
  const [stage, setStage] = useState(requestedStage === 'coaching' ? 'practice' : (requestedStage || (journey.interviewInvited ? (journey.prepComplete ? 'complete' : 'plan') : 'locked')))
  const [answer, setAnswer] = useState(requestedStage === 'coaching' ? demoPrepAnswer : '')
  const [feedback, setFeedback] = useState(requestedStage === 'coaching')
  const jump = () => { update({ interviewInvited: true }); setStage('invitation') }
  const evaluate = () => answer.trim() && setFeedback(true)
  const complete = () => { update({ prepComplete: true }); setStage('complete') }

  return (
    <main id="main-content" className="prep-screen screen">
      <Topbar back="/home" title="Interview prep" eyebrow="JUSPAY" />
      <section className="page-pad prep-content">
        {stage === 'locked' && <div className="time-jump"><div className="time-visual"><Clock3 size={30} /><span>3 days</span></div><Pill tone="soft">PRESENTER TIME JUMP</Pill><h1>Move forward to the moment that changes the journey.</h1><p>Simulate Gmail detecting a Juspay interview invitation three days after Arjun applies.</p><button className="primary-button" onClick={jump}>Jump ahead 3 days <ArrowRight size={17} /></button></div>}
        {stage === 'invitation' && <motion.div className="invitation-state" initial={{ scale: .96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><div className="mail-success"><Mail size={26} /><span><Check size={13} /></span></div><Pill tone="success">GMAIL DETECTED · JUST NOW</Pill><h1>Juspay wants to interview you.</h1><p>Your tracker and Home have already moved this to the top.</p><div className="invitation-card"><CompanyLogo initials="JP" /><span><strong>System Design Interview</strong><small>Tuesday, 11:00 AM · 60 minutes</small></span></div><button className="primary-button" onClick={() => setStage('plan')}>Build my prep plan <Sparkles size={17} /></button></motion.div>}
        {stage === 'plan' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><div className="prep-hero"><Pill tone="soft">PERSONALISED FOR THIS INTERVIEW</Pill><h1>One focused hour to feel ready.</h1><p>Built from Juspay’s role, interview patterns, company reviews, and the evidence in your résumé.</p></div><div className="prep-plan">{prepPlan.map((item, index) => <div key={item.label}><span className="plan-number">0{index + 1}</span><span><strong>{item.label}</strong><small>{item.detail}</small></span><span className="plan-time">{item.minutes}</span></div>)}</div><div className="source-note"><ShieldCheck size={16} /> Grounded in the job, 847 reviews, interview reports, and Arjun’s confirmed evidence.</div><button className="primary-button" onClick={() => setStage('practice')}>Start highest-impact practice <ArrowRight size={17} /></button></motion.div>}
        {stage === 'practice' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><div className="practice-top"><Pill tone="attention">SYSTEM DESIGN · 1 OF 3</Pill><span>~8 min</span></div><h1>Design an idempotent payment callback service.</h1><p className="question-context">Juspay signal: interview reports frequently mention payment reliability, retries, and trade-off depth.</p><div className="prompt-card"><strong>Cover these decisions</strong><span>Duplicate callbacks · Retry strategy · Ordering · Failure recovery · Observability</span></div><label className="answer-field"><span>Your approach</span><textarea name="practice-answer" autoComplete="off" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Talk through the architecture and trade-offs…" /></label><button className="demo-answer" onClick={() => setAnswer(demoPrepAnswer)}><Sparkles size={15} /> Use demo answer</button>{!feedback ? <button className="primary-button" disabled={!answer.trim()} onClick={evaluate}>Get coaching <ArrowRight size={17} /></button> : <div className="coaching-card"><div className="coaching-head"><span className="assistant-orb success"><Sparkles size={16} /></span><span><strong>Strong foundation</strong><small>Grounded in your Razorpay evidence</small></span></div><p>You covered idempotency, ordering, retries, and observability. Make the trade-off crisper: say why you’d persist state before publishing the callback.</p><div className="improved-answer"><span>ADD THIS LINE</span>“Persisting the state transition before the external side effect prevents a retry from paying the cost twice.”</div><button className="primary-button" onClick={complete}>Mark practice complete <Check size={17} /></button></div>}</motion.div>}
        {stage === 'complete' && <motion.div className="completion-state" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><div className="success-burst"><Check size={28} /></div><Pill tone="success">PREP COMPLETE</Pill><h1>You now have a sharper answer—and the reason behind it.</h1><p>Juspay prep is saved. The tracker will remind you 30 minutes before the interview.</p><div className="completion-metrics"><div><strong>1</strong><span>answer improved</span></div><div><strong>5</strong><span>trade-offs covered</span></div><div><strong>10m</strong><span>focused practice</span></div></div><button className="primary-button" onClick={() => { update({ offerDetected: true }); go('/offer/juspay') }}>Jump to offer day <ArrowRight size={17} /></button><button className="text-button" onClick={() => go('/home')}>Return home</button></motion.div>}
      </section>
    </main>
  )
}

function OfferScreen() {
  const { journey, update } = useJourney()
  const requestedStage = new URLSearchParams(window.location.search).get('stage')
  const [stage, setStage] = useState(requestedStage || (journey.offerDetected ? (journey.offerReviewed ? 'details' : 'reveal') : 'locked'))
  const [message, setMessage] = useState('Hi Ananya, thank you again for the offer—I’m genuinely excited about the opportunity to join Juspay. Based on the role scope, my payments experience, and the market range for this position, would you be open to moving the total compensation closer to ₹30L, with more of the variable component shifted to fixed pay? I’d be happy to discuss.')
  const [copied, setCopied] = useState(false)
  const revealDetails = () => { update({ offerReviewed: true }); setStage('details') }
  const copyDraft = async () => { try { await navigator.clipboard.writeText(message) } catch {} setCopied(true); update({ negotiationSaved: true }); setTimeout(() => setCopied(false), 1600) }

  return (
    <main id="main-content" className="offer-screen screen">
      <Topbar back="/home" title="Offer" eyebrow="JUSPAY" right={<button className="icon-button" aria-label="More offer options"><MoreHorizontal size={20} /></button>} />
      <section className="page-pad offer-content">
        {stage === 'locked' && <div className="time-jump"><div className="time-visual"><Clock3 size={30} /><span>12 days</span></div><Pill tone="soft">PRESENTER TIME JUMP</Pill><h1>Move forward to the email every jobseeker waits for.</h1><p>Simulate Gmail detecting Juspay’s offer after the interview loop.</p><button className="primary-button" onClick={() => { update({ offerDetected: true }); setStage('reveal') }}>Jump to offer day <ArrowRight size={17} /></button></div>}
        {stage === 'reveal' && <motion.div className="offer-reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><div className="confetti" aria-hidden="true">{Array.from({ length: 14 }).map((_, i) => <i key={i} style={{ '--i': i, left: `${(i * 37) % 92 + 3}%`, top: `${(i * 23) % 48 + 4}%` }} />)}</div><div className="offer-logo"><CompanyLogo initials="JP" /><span className="offer-check"><Check size={16} /></span></div><Pill tone="success">GMAIL DETECTED · OFFER LETTER</Pill><h1>You got the offer, Arjun.</h1><p>Juspay would like you to join as Senior Backend Engineer.</p><div className="offer-number"><span>TOTAL COMPENSATION</span><strong>{offer.total}</strong><small>per year</small></div><button className="primary-button" onClick={revealDetails}>Understand my offer <Sparkles size={17} /></button><p className="fine-print">Nothing is accepted or sent from AmbitionBox.</p></motion.div>}
        {stage === 'details' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><div className="offer-title"><Pill tone="success">JUSPAY OFFER · RECEIVED TODAY</Pill><h1>{offer.total} is a strong offer.<br />There’s still room to improve it.</h1></div><div className="offer-comparison"><div className="offer-primary"><span>Your offer</span><strong>₹28L</strong><Pill tone="success">Within market range</Pill></div><div className="comparison-bars"><div><span>Current pay</span><i><b style={{ width: '50%' }} /></i><strong>₹15L</strong></div><div><span>Your target</span><i><b style={{ width: '73%' }} /></i><strong>₹22L</strong></div><div className="active"><span>Juspay offer</span><i><b style={{ width: '93%' }} /></i><strong>₹28L</strong></div><div><span>Market range</span><i className="range"><b style={{ left: '80%', width: '20%' }} /></i><strong>₹24–30L</strong></div></div><div className="offer-deltas"><span><TrendingUp size={15} /> {offer.currentDelta}</span><span><Target size={15} /> {offer.targetDelta}</span></div></div>
          <div className="breakdown-card"><div className="section-heading"><div><span className="eyebrow">COMPENSATION BREAKDOWN</span><h2>What ₹28L contains</h2></div></div><div className="breakdown-row"><span><i className="fixed" /> Fixed pay</span><strong>{offer.fixed}</strong></div><div className="breakdown-row"><span><i className="variable" /> Performance variable</span><strong>{offer.variable}</strong></div><div className="breakdown-row"><span><i className="joining" /> One-time joining bonus</span><strong>{offer.joining}</strong></div><div className="stacked-bar"><i /><i /><i /></div><p>₹2L is one-time. Your recurring annual compensation is ₹26L.</p></div>
          <div className="negotiation-insight"><span className="assistant-orb"><Sparkles size={17} /></span><div><Pill tone="attention">NEGOTIATION OPPORTUNITY</Pill><h2>Ask for ₹30L—or shift ₹1.5L from variable to fixed.</h2><p>The role’s market ceiling and your payments experience support a respectful ask.</p></div></div>
          <label className="message-box negotiation-box"><span>Draft to recruiter <Pill tone="soft">Not sent</Pill></span><textarea name="negotiation-draft" autoComplete="off" value={message} onChange={(e) => setMessage(e.target.value)} /></label><div className="honesty-note"><ShieldCheck size={17} /><p>Review and send from your own email. AmbitionBox will never negotiate without you.</p></div><button className="primary-button" aria-live="polite" onClick={copyDraft}>{copied ? <><Check size={17} /> Copied—ready for review</> : <><Copy size={17} /> Copy negotiation draft</>}</button><button className="secondary-button" onClick={() => go('/demo')}>Back to presenter <Play size={16} /></button></motion.div>}
      </section>
    </main>
  )
}

export default App
