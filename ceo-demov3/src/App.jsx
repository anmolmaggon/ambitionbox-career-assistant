import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft, ArrowLeftRight, ArrowRight, Bookmark, BriefcaseBusiness, Building2, Check, CheckCircle2,
  ChevronDown, ChevronRight, CircleDollarSign, CircleUserRound, Clock3, Copy, ExternalLink,
  FileCheck2, Home, IndianRupee, Info, Link2, Mail, MapPin, MessageCircle, MoreHorizontal, Pencil,
  LayoutGrid, Play, Plus, RefreshCcw, Search, Send, ShieldCheck, SlidersHorizontal, Sparkles, Star, Target,
  TrendingUp, UserRoundCheck, Users, X,
} from 'lucide-react'
import {
  applicationStages, applications, candidate, chapters, interviewIntel, jobs, journeyPresets, juspay, moreJobs, offer,
  jobDetails, offerDecision, stageLabel, trackerStats,
} from './data'
import { useJourney } from './store'
// Exported from Home rather than moved: the sheet is wired to Home's answer engine, and
// relocating that to serve two more screens would put the most contract-bound screen in
// the app at risk for no gain.
import { HomeAssistantSheet, contextualCapabilities } from './Home'
import { OnboardingScreen, ProfileScreen } from './Onboarding'
import { HomeScreen } from './Home'
import { FlowScreen } from './Flow'
import {
  AppLink, AssistantDock, AssistantMark, CompanyLogo, Logo, NorthMark, Pill, ProgressRing, Sheet, Topbar, go,
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
    '/states': StatesBoard,
    '/onboarding': OnboardingScreen,
    '/home': HomeScreen,
    '/flow': FlowScreen,
    '/profile': ProfileScreen,
    '/tracker': TrackerScreen,
    '/matches': MatchesScreen,
    '/jobs/juspay': JobDetailScreen,
    '/assistant/juspay': AssistantScreen,
    '/prep/juspay': PrepScreen,
    '/offer/juspay': OfferScreen,
  }
  // `/flow/reply`, `/flow/ghosted` … all resolve to the one flow screen, which reads the
  // type off the path and the application off the query.
  const Component = (pathname.startsWith('/flow/') ? FlowScreen
    : pathname.startsWith('/jobs/') ? JobDetailScreen
    : routes[pathname]) || DemoLauncher
  const openingStory = pathname === '/offer/juspay' && new URLSearchParams(search).get('story') === 'opening'
  // The states board is a wall of phones, so it is the one route that renders outside
  // the phone shell rather than inside it.
  if (pathname === '/states') return <StatesBoard />
  return <div className={`stage ${openingStory ? 'stage--presenter' : ''}`}><div className="phone-shell"><a className="skip-link" href="#main-content">Skip to content</a><Component key={`${pathname}${search}`} /></div>{openingStory && <PresenterRail />}</div>
}

/*
 * Every Home state, side by side — for showing the screen to a room.
 *
 * Live iframes rather than screenshots, on purpose: the board cannot go stale, and
 * during a presentation any tile can be opened full-size and driven for real. Each
 * tile is the actual app at 390x844, scaled down by transform so the layout inside is
 * identical to a phone rather than a squeezed desktop rendering.
 */
const HOME_STATES = [
  {
    id: 'baseline', name: 'No inbox yet', flags: 'emailConnected: false',
    note: 'Useful before a single integration. The card that leads is the connection that unlocks the rest — and the only one that cannot be set aside.',
  },
  {
    id: 'firstopen', name: 'The first open', query: '&arrival=first', flags: 'firstHomeArrival: true',
    note: 'The handoff out of onboarding is its own moment. The greeting answers the promise onboarding just made.',
  },
  {
    id: 'tracker', name: 'A recruiter is waiting', flags: 'emailConnected: true',
    note: 'A person waiting outranks everything not on a clock. The message leads the card — quote first, then who sent it.',
  },
  {
    id: 'matches', name: 'Replied, nothing urgent', flags: 'phonepeReplied: true',
    note: 'The ranking is real: with nothing happening to you, a browsable role leads, and it is white.',
  },
  {
    id: 'resume', name: 'Résumé ready', flags: 'resumeReady: true · readiness: 14',
    note: 'Evidence closed to 14/15, so the screen offers the next move in time. The only state showing the time jump.',
  },
  {
    id: 'interview', name: 'Interview booked', flags: 'interviewInvited: true',
    note: 'A fixed date outranks an open message, and the card is drawn as a date.',
  },
  {
    id: 'postinterview', name: 'The morning after', flags: 'interviewDone: true',
    note: 'The round has happened and only Arjun knows how it went, so the Tracker is stale until he says. Answering opens the ask for the questions that came up.',
  },
  {
    id: 'offer', name: 'An offer on the table', flags: 'offerDetected: true',
    note: 'A decision window outranks everything. The figure leads, but the split sits with it.',
  },
]

const FIELD_LEGEND = [
  ['#126655', 'Green', 'money on the table'],
  ['#533ba0', 'Violet', 'a date booked'],
  ['#2a3675', 'Indigo', 'a person waiting'],
  ['#8f4410', 'Terracotta', "someone else's clock"],
  ['#ffffff', 'White', 'yours to choose'],
]

function StatesBoard() {
  const [zoom, setZoom] = useState(null)
  const url = (state) => `/home?preset=${state.id}${state.query || ''}`

  return (
    <main id="main-content" className="states-board">
      <header className="states-head">
        <div>
          <span className="eyebrow">PRESENTER MODE</span>
          <h1>Home, every state.</h1>
          <p>The same screen reading a different day. Nothing here is a screenshot — every tile is the live app, so the board cannot go stale. Open any one to drive it full size.</p>
        </div>
        <AppLink className="secondary-button" to="/demo"><ArrowLeft size={17} /> Back to chapters</AppLink>
      </header>

      <div className="states-legend" aria-label="What the card colours mean">
        {FIELD_LEGEND.map(([hex, name, meaning]) => (
          <span key={name}><i style={{ background: hex, boxShadow: hex === '#ffffff' ? 'inset 0 0 0 1px #d7dbe8' : 'none' }} /><b>{name}</b> {meaning}</span>
        ))}
      </div>

      <div className="states-grid">
        {HOME_STATES.map((state, index) => (
          <article className="state-tile" key={state.id}>
            <div className="state-tile-frame">
              <iframe src={url(state)} title={state.name} loading={index < 3 ? 'eager' : 'lazy'} />
              <button className="state-tile-open" onClick={() => setZoom(state)} aria-label={`Open ${state.name} full size`} />
            </div>
            <div className="state-tile-copy">
              <span className="state-tile-num">{String(index + 1).padStart(2, '0')}</span>
              <strong>{state.name}</strong>
              <code>?preset={state.id}</code>
              <small>{state.flags}</small>
              <p>{state.note}</p>
              <button className="light-button" onClick={() => { applyPresetAndGo(state) }}>Open in the demo <ArrowRight size={15} /></button>
            </div>
          </article>
        ))}
      </div>

      {zoom && (
        <div className="states-zoom" role="dialog" aria-modal="true" aria-label={zoom.name}>
          <button className="states-zoom-scrim" onClick={() => setZoom(null)} aria-label="Close" />
          <div className="states-zoom-phone">
            <iframe src={url(zoom)} title={zoom.name} />
          </div>
          <div className="states-zoom-side">
            <strong>{zoom.name}</strong>
            <small>{zoom.flags}</small>
            <p>{zoom.note}</p>
            <button className="light-button" onClick={() => applyPresetAndGo(zoom)}>Open in the demo <ArrowRight size={15} /></button>
            <button className="secondary-button" onClick={() => setZoom(null)}>Close</button>
          </div>
        </div>
      )}
    </main>
  )
}

// The board runs outside the JourneyProvider's screens, so opening a state seeds the
// same session storage the app reads on load rather than relying on the iframe's copy.
function applyPresetAndGo(state) {
  try {
    sessionStorage.setItem('ambitionbox-ceo-demov3-journey-v1', JSON.stringify(journeyPresets[state.id]))
  } catch { /* private mode */ }
  go(`/home?preset=${state.id}${state.query || ''}`)
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
        {/* The board is presenter chrome, so it sits with the chapters rather than
            behind a URL only the person who built it knows. */}
        <AppLink className="secondary-button states-link" to="/states"><LayoutGrid size={17} /> See every Home state side by side</AppLink>
        <button className="secondary-button reset-button" onClick={resetDemo}>
          {resetDone ? <Check size={18} /> : <RefreshCcw size={17} />}{resetDone ? 'Demo reset' : 'Reset all demo data'}
        </button>
        <p className="launcher-note"><ShieldCheck size={15} /> Deterministic simulation. No real email, application, or account access.</p>
      </section>
    </main>
  )
}

/*
 * Tracker rebuilt 2026-08-19 on owner feedback. The screen used to carry three organising
 * models at once — a stat row that filtered, a Do Next section, and a kanban behind a
 * toggle — and they disagreed with each other. There is now one model: the pipeline.
 * List renders it vertically, Board renders the same stages horizontally, and an
 * application sits in exactly one stage that the user can change by hand.
 */
function TrackerScreen() {
  const { journey, update } = useJourney()
  const reduceMotion = useReducedMotion()
  const params = new URLSearchParams(window.location.search)
  const initialStep = params.get('step') || null
  const [step, setStep] = useState(initialStep)
  const [progress, setProgress] = useState(0)
  const [viewMode, setViewMode] = useState(params.get('view') === 'board' ? 'board' : 'list')
  const [emailProvider, setEmailProvider] = useState('gmail')
  const [query, setQuery] = useState('')
  const [manualOpen, setManualOpen] = useState(false)
  const [moving, setMoving] = useState(null)
  // Rejected lands collapsed — finished applications should not stand between the user
  // and the stages that still need them. Everything else opens, Ghosted included: those
  // are the ones most likely to be forgotten, which is the reason they have a stage.
  const [collapsed, setCollapsed] = useState(() => ({ rejected: true }))
  const [stageFilter, setStageFilter] = useState(null)
  const [actionNotice, setActionNotice] = useState('')
  const [assistant, setAssistant] = useState(null)
  const manualApplications = journey.manualApplications || []
  const hasTrackerContent = journey.emailConnected || manualApplications.length > 0
  const moved = journey.applicationStages || {}

  /*
   * One list, built once. Juspay is synthetic — it is the golden path's interview and
   * has never lived in the fixture — so it is assembled here rather than in `data.js`.
   * A user move wins over the imported stage; nothing else rewrites it.
   */
  const allApplications = useMemo(() => {
    if (!hasTrackerContent) return []
    const fromEmail = journey.emailConnected ? [
      {
        company: 'Juspay', role: 'Senior Backend Engineer', initials: 'JP', color: '#183f44',
        preferenceMatch: 89, stage: journey.offerDetected ? 'offer' : 'interview', phase: 'pre', source: 'Gmail',
        when: journey.offerDetected ? '₹28L offer' : 'Tue 11:00', flag: 'Interview detected',
        readiness: '10/15 profile evidence',
        insight: journey.offerDetected ? 'The offer is in. See what it means before you answer.' : 'See what to expect and start tailored prep',
      },
      ...applications,
    ] : []
    const manual = manualApplications.map((item, index) => ({
      ...item, id: `manual-${index}`, stage: item.stage || 'applied', source: 'Added by you', when: 'Added by you',
    }))
    return [...fromEmail, ...manual].map((item) => ({
      ...item,
      id: item.id || item.company.toLowerCase().replace(/\s+/g, '-'),
      initials: item.initials || item.company.slice(0, 2).toUpperCase(),
    })).map((item) => ({ ...item, stage: moved[item.id] || item.stage }))
  }, [hasTrackerContent, journey.emailConnected, journey.offerDetected, manualApplications, moved])

  /*
   * Saved roles left Tracker on 2026-09-10 with the `shortlisted` stage. A role you saved
   * but never applied to is a Jobs concept — it has no source to trace and nothing to
   * track — and it was the one column here holding something that was not an application.
   * Jobs owns it now, behind the bookmark.
   */

  const everything = allApplications
  const ghostedCount = useMemo(
    () => everything.filter((item) => (moved[item.id] || item.stage) === 'ghosted').length,
    [everything, moved],
  )

  const sourceCounts = useMemo(() => {
    const counts = new Map()
    allApplications.forEach((item) => counts.set(item.source, (counts.get(item.source) || 0) + 1))
    return [...counts.entries()].map(([name, count]) => ({ name, count }))
  }, [allApplications])
  const toggleStage = (id) => setCollapsed((current) => ({ ...current, [id]: !current[id] }))

  // Search runs across the whole pipeline, not one stage — finding a half-remembered
  // application should not depend on guessing which stage it ended up in.
  const searching = query.trim().length > 0
  const searchResults = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return []
    return everything.filter((item) => `${item.company} ${item.role}`.toLowerCase().includes(needle))
  }, [query, everything])

  const grouped = useMemo(() => applicationStages.map((stage) => ({
    ...stage, items: everything.filter((item) => item.stage === stage.id),
  })), [everything])
  const shownGroups = stageFilter ? grouped.filter((stage) => stage.id === stageFilter) : grouped

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
  }

  const moveApplication = (item, stage) => {
    update({ applicationStages: { ...moved, [item.id]: stage } })
    setMoving(null)
    setActionNotice(`${item.company} moved to ${stageLabel(stage)}.`)
  }

  const openJuspayInterview = () => {
    if (!journey.interviewInvited) update({ interviewInvited: true })
    go('/prep/juspay?stage=invite&round=open')
  }

  const cardAction = (item) => {
    if (item.jobId) {
      return item.jobId === 'juspay' ? { label: 'View role', onClick: () => go('/jobs/juspay') } : null
    }
    if (item.company === 'Juspay') {
      return { label: journey.prepComplete ? 'Review interview prep' : 'Prepare for interview', onClick: openJuspayInterview, primary: true }
    }
    if (!item.action) return null
    // Tracker and Home open the same thread for the same card. A second way of handling a
    // recruiter reply, written differently, is how two screens start disagreeing.
    return {
      label: item.action,
      primary: true,
      onClick: () => (item.flow
        ? go(`/flow/${item.flow}?application=${item.id}`)
        : setActionNotice(`${item.company} details are ready in the connected email.`)),
    }
  }

  const renderCard = (item) => (
    <ApplicationCard key={item.id} item={item} action={cardAction(item)} onMove={() => setMoving(item)} />
  )

  return (
    <main id="main-content" className="screen tracker-screen">
      {/* The same header Home and Jobs use — wordmark on the canvas, the avatar as the
          door to Profile. */}
      <div className="app-header page-pad">
        <Logo />
        <span className="app-header-tools">
          <button className="app-avatar-button" onClick={() => go('/profile')} aria-label="Your profile">
            <span className="avatar" aria-hidden="true">{candidate.initials}</span>
          </button>
        </span>
      </div>
      {!hasTrackerContent ? (
        <section className="empty-state tracker-onboarding page-pad">
          <div className="empty-illustration" aria-hidden="true">
            <span className="mail-card mail-card--one"><Mail size={22} /></span>
            <span className="mail-card mail-card--two"><BriefcaseBusiness size={22} /></span>
          </div>
          <h1>Every application. One smart Tracker.</h1>
          <p>Connect the email you use to apply. North will organise the last 90 days and keep your next move visible.</p>
          <div className="tracker-benefits">
            <div><span><Mail size={17} /></span><p><strong>Everything updates itself</strong><small>Applications and status changes stay organised.</small></p></div>
            <div><span><Clock3 size={17} /></span><p><strong>Important moments rise first</strong><small>Recruiter replies, deadlines, and interviews are prioritised.</small></p></div>
            <div><span><Target size={17} /></span><p><strong>Know what to do next</strong><small>Get timely follow-ups, preparation, and company context.</small></p></div>
          </div>
          <div className="email-connect-label">Connect the email you use to apply</div>
          <button className="primary-button" onClick={() => connectEmail('gmail')}><span className="gmail-mini">G</span> Continue with Gmail</button>
          <button className="secondary-button email-secondary" onClick={() => connectEmail('other')}><Mail size={17} /> Connect another email</button>
          <div className="trust-line"><ShieldCheck size={16} /><span>Only job-search emails · Read only · Disconnect anytime</span></div>
          {/* The manual path has to survive the empty state — it is the only way in for
              someone who never connects an inbox. */}
          <button className="tracker-add-link" onClick={() => setManualOpen(true)}><Plus size={16} /> Add an application yourself</button>
        </section>
      ) : (
        <section className="page-pad tracker-content">
          {/* One surface: the count, and directly beneath it where the count came from.
              Provenance shares the border rather than floating in a second card. */}
          <div className="tracker-summary">
            <div className="tracker-summary-top">
              <div>
                <span className="tracker-period">Based on the last 90 days</span>
                <h1>{allApplications.length} application{allApplications.length === 1 ? '' : 's'}</h1>
                {ghostedCount > 0 && <span className="tracker-shortlist-line">{ghostedCount} have gone quiet · North is watching them</span>}
              </div>
              <span className="sync-badge"><span /> Synced</span>
            </div>
            <div className="tracker-sources">
              <span className="tracker-sources__label">Tracked from</span>
              <span className="tracker-sources__list">
                {sourceCounts.map(({ name, count }) => (
                  <span className="tracker-source" key={name}>
                    <i className={`tracker-source__mark tracker-source__mark--${name === 'Naukri' ? 'naukri' : name === 'Gmail' ? 'gmail' : 'manual'}`} aria-hidden="true">
                      {name === 'Naukri' ? 'n' : name === 'Gmail' ? 'G' : <Plus size={11} />}
                    </i>
                    {name} <b>{count}</b>
                  </span>
                ))}
              </span>
            </div>
          </div>

          <div className="tracker-tools" aria-label="Tracker tools">
            <label className="job-search">
              <Search size={18} />
              <input name="tracker-search" autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search company or role" aria-label="Search applications" />
              {query && <button className="job-search__clear" onClick={() => setQuery('')} aria-label="Clear search"><X size={16} /></button>}
            </label>
            <button className="tracker-add" onClick={() => setManualOpen(true)} aria-label="Add an application"><Plus size={18} /><span>Add</span></button>
          </div>

          {actionNotice && <div className="tracker-action-notice" role="status"><CheckCircle2 size={17} />{actionNotice}</div>}

          {searching ? (
            <>
              <div className="content-heading"><div><span className="eyebrow">SEARCH</span><h2>{searchResults.length} result{searchResults.length === 1 ? '' : 's'} for “{query.trim()}”</h2></div></div>
              <div className="application-list">
                {searchResults.map(renderCard)}
                {!searchResults.length && <p className="job-feed__empty">No application matches that. Check the spelling, or add it yourself.</p>}
              </div>
            </>
          ) : (
            <>
              <div className="content-heading tracker-view-heading">
                <div><span className="eyebrow">YOUR PIPELINE</span><h2>From applied to offer</h2></div>
                <div className="tracker-view-toggle" role="group" aria-label="Tracker view">
                  <button className={viewMode === 'list' ? 'is-active' : ''} aria-pressed={viewMode === 'list'} onClick={() => setViewMode('list')}>List</button>
                  <button className={viewMode === 'board' ? 'is-active' : ''} aria-pressed={viewMode === 'board'} onClick={() => setViewMode('board')}>Board</button>
                </div>
              </div>
              {/* Every stage is reachable from the top without scrolling the whole
                  pipeline, using the Jobs feed's chip shape. */}
              {viewMode === 'list' && (
                <div className="stage-chips" aria-label="Jump to a stage">
                  <button className={stageFilter ? '' : 'is-on'} aria-pressed={!stageFilter} onClick={() => setStageFilter(null)}>All <b>{everything.length}</b></button>
                  {grouped.map((stage) => (
                    <button key={stage.id} className={stageFilter === stage.id ? 'is-on' : ''} aria-pressed={stageFilter === stage.id}
                      onClick={() => { setStageFilter(stageFilter === stage.id ? null : stage.id); setCollapsed((current) => ({ ...current, [stage.id]: false })) }}>
                      <i className={`stage-dot stage-dot--${stage.id}`} aria-hidden="true" />{stage.label} <b>{stage.items.length}</b>
                    </button>
                  ))}
                </div>
              )}
              {viewMode === 'board' ? (
                <TrackerBoard grouped={grouped} onMove={setMoving} action={cardAction} />
              ) : (
                <div className="stage-list">
                  {shownGroups.map((stage) => (
                    <section className={`stage-group ${collapsed[stage.id] ? 'is-collapsed' : ''}`} key={stage.id} aria-label={stage.label}>
                      <button className={`stage-head stage-head--${stage.id}`} aria-expanded={!collapsed[stage.id]} onClick={() => toggleStage(stage.id)}>
                        <span className="stage-head__title"><i className={`stage-dot stage-dot--${stage.id}`} />{stage.label}</span>
                        <span className="stage-head__count">{stage.items.length}</span>
                        <ChevronDown className="stage-head__chevron" size={18} />
                      </button>
                      {!collapsed[stage.id] && (stage.items.length
                        ? <div className="application-list">{stage.items.map(renderCard)}</div>
                        : <p className="stage-empty">Nothing at this stage yet. {stage.hint}.</p>)}
                    </section>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      )}

      <AnimatePresence>
        {step === 'account' && <EmailAccountSheet provider={emailProvider} onContinue={() => setStep('scanning')} onClose={() => setStep(null)} />}
        {step === 'scanning' && <GmailScanning progress={progress} onSkip={finishImport} />}
        {step === 'result' && <GmailResult onDone={() => setStep(null)} />}
        {manualOpen && <ManualApplicationSheet onClose={() => setManualOpen(false)} onAdd={addManualApplication} />}
        {moving && <MoveStageSheet item={moving} onClose={() => setMoving(null)} onMove={(stage) => moveApplication(moving, stage)} />}
        {assistant !== null && <HomeAssistantSheet journey={journey} initialQuestion={assistant} onClose={() => setAssistant(null)} index={contextualCapabilities({ journey }, { openAddInterview: () => go('/home?action=add-interview'), openOfferStart: () => go('/home') }, 'tracker')} />}
      </AnimatePresence>

      {/* Same chrome as Home and Jobs. Tracker is where the questions are most concrete —
          what a status means, what to say back, who has gone quiet. */}
      <AssistantDock
        active="tracker"
        label="Ask North about your applications"
        examples={['What should I do first today?', 'Has anyone gone quiet on me?', 'What does “shortlisted” mean here?', 'Draft a follow-up to PhonePe']}
        reduceMotion={reduceMotion}
        onOpen={(question) => setAssistant(question || '')}
      />
    </main>
  )
}

/*
 * One card shape for every application at every stage, typeset to match the Jobs feed's
 * `JobCard`: company at 13px, the role as the 15px line that carries the eye, metadata at
 * 11px, and a full-pill 44px action. The old Tracker card ran a 14px company over an 11px
 * role with a 38px rounded-rectangle button, which is why the two tabs read as two products.
 */
function ApplicationCard({ item, action, onMove, onUndoMove }) {
  // Rejected is the only finished stage: flat, muted, and carrying no match score, because
  // a percentage beside a rejection invites a second look at something already over.
  const finished = item.stage === 'rejected'
  return (
    <article className={`application-card ${finished ? 'application-card--closed' : ''} ${item.flag ? 'application-card--flagged' : ''}`}>
      <div className="application-card__id">
        <CompanyLogo initials={item.initials} color={item.color} />
        <span className="application-card__copy">
          {item.flag && <span className="smart-label">{item.flag}</span>}
          <span className="application-card__company">{item.company}</span>
          <h3 className="application-card__role">{item.role}</h3>
          <span className="application-card__meta">{item.outcome || item.when} · {item.source}</span>
        </span>
        {!finished && item.preferenceMatch
          ? <span className="job-score"><b>{item.preferenceMatch}%</b><i>Match</i></span>
          : null}
      </div>
      {/* Only signals that trace to something. `readiness` is `journey.readiness`; the
          match % is the confirmed preferences; the meta line is the scanned email. An
          "outlook" chip used to sit here reading "Promising" / "Competitive" — three
          hardcoded adjectives with no derivation behind them, removed 2026-08-19. */}
      {item.readiness && <div className="application-signals"><span>{item.readiness}</span></div>}

      {/*
        * The Gmail promise, made visible. North reads the inbox and moves cards, and until
        * a card says so on its face that claim lives only in the pitch. North's own moves
        * carry an undo; a move the user made says so and is never rewritten.
        */}
      {item.movedNote && (
        <p className={`application-moved ${item.movedBy === 'you' ? 'application-moved--you' : ''}`}>
          <NorthMark />
          <span className="application-moved__text">
            <strong>{item.movedBy === 'you' ? 'You moved this' : item.movedNote}</strong>
            {' · '}{item.movedVia === 'you' ? item.movedAgo : `${item.movedVia} · ${item.movedAgo}`}
          </span>
          {item.movedBy === 'north' && item.movedFrom && (
            <button className="application-moved__undo" onClick={onMove}>Undo</button>
          )}
        </p>
      )}

      {item.insight && <p className="application-insight">{item.insight}</p>}
      <div className="application-card__actions">
        {/* The answer to "how do I move this?" is on every card, at every stage. */}
        <button className="job-action job-action--move" onClick={onMove} aria-label={`Move ${item.company} ${item.role} to another stage`}>
          <ArrowLeftRight size={15} /> Move
        </button>
        {action && (
          <button
            className={`job-action ${action.primary ? 'job-action--view' : 'job-action--secondary'}`}
            aria-label={`${item.company} ${item.role} — ${action.label}`}
            onClick={action.onClick}
          >{action.label} <ArrowRight size={15} /></button>
        )}
      </div>
    </article>
  )
}

/*
 * Board is the same `grouped` pipeline List renders, laid out horizontally — and it now
 * renders the same `ApplicationCard`. It used to have a card of its own, which is how the
 * two views drifted: the match score was a `.job-score` block in List and a small grey
 * chip in Board. Sharing the component makes that class of drift impossible, the same way
 * sharing `grouped` made the counts impossible to disagree.
 */
function TrackerBoard({ grouped, onMove, action }) {
  return (
    <div className="kanban-board" aria-label="Application board">
      {grouped.map((stage) => (
        <section className={`kanban-column kanban-column--${stage.id}`} key={stage.id}>
          <header><span><i /> {stage.label}</span><strong>{stage.items.length}</strong></header>
          <div className="kanban-cards">
            {stage.items.map((item) => (
              <ApplicationCard key={item.id} item={item} action={action(item)} onMove={() => onMove(item)} />
            ))}
            {!stage.items.length && <div className="kanban-empty"><span>Nothing here</span><small>{stage.hint}.</small></div>}
          </div>
        </section>
      ))}
    </div>
  )
}

/*
 * Moving an application is a deliberate act, so it gets a sheet rather than a drag: a
 * five-column kanban on a 430px phone has no honest drop target, and the user told us
 * they could not find the affordance at all.
 */
function MoveStageSheet({ item, onClose, onMove }) {
  return (
    <Sheet label={`Move ${item.company}`} onClose={onClose} bottom className="tracker-tool-sheet">
      <h2>Move {item.company}</h2>
      <p className="sheet-lead">{item.role} — currently in {stageLabel(item.stage)}.</p>
      <div className="stage-picker">
        {applicationStages.map((stage) => (
          <button
            key={stage.id}
            className={stage.id === item.stage ? 'is-current' : ''}
            aria-current={stage.id === item.stage}
            disabled={stage.id === item.stage}
            onClick={() => onMove(stage.id)}
          >
            <span><strong>{stage.label}</strong><small>{stage.hint}</small></span>
            {stage.id === item.stage ? <Check size={17} /> : <ArrowRight size={16} />}
          </button>
        ))}
      </div>
    </Sheet>
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

function ManualApplicationSheet({ onClose, onAdd }) {
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  return <Sheet label="Add an application" onClose={onClose} bottom className="tracker-tool-sheet"><h2>Add an application</h2><p className="sheet-lead">Add the essentials now. You can update the status later.</p><form className="manual-application-form" onSubmit={(event) => { event.preventDefault(); onAdd({ company: company.trim(), role: role.trim() }) }}><label><span>Company</span><input value={company} onChange={(event) => setCompany(event.target.value)} placeholder="e.g. Atlassian" required /></label><label><span>Role</span><input value={role} onChange={(event) => setRole(event.target.value)} placeholder="e.g. Senior Backend Engineer" required /></label><button className="primary-button" type="submit">Add to Tracker <ArrowRight size={17} /></button></form></Sheet>
}

function MatchesScreen() {
  const { journey, update, toggleSaved } = useJourney()
  /*
   * `naukriConnected` is only ever set by the connect flow on this screen. Onboarding's
   * Naukri path sets `onboardingNaukriImported` instead, so anyone who imported their
   * profile during sign-up arrived here being told Naukri was not connected and offered
   * a flow they had already completed. One source of truth for the whole screen.
   */
  const naukriConnected = journey.naukriConnected || journey.onboardingNaukriImported
  const reduceMotion = useReducedMotion()
  const params = new URLSearchParams(window.location.search)
  const [flow, setFlow] = useState(params.get('flow') === 'naukri' && !journey.naukriConnected ? 'trust' : null)
  const [sort, setSort] = useState('Best match')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState(null)
  const [assistant, setAssistant] = useState(null)
  const [savedOpen, setSavedOpen] = useState(false)

  const visibleJobs = useMemo(() => {
    // A role you have already applied to is not a job to find — it is an application to
    // track, and Tracker owns it. Showing it here asks the user to do something they have
    // already done, so anything with a live application drops out of the feed entirely.
    // A role you have already applied to is not a job to find. Ghosted and rejected count
    // as applied too — resurfacing a company that went quiet on you, or turned you down, as
    // a fresh role to try is the feed forgetting what Tracker knows.
    const applied = new Set(applications.map((item) => item.company))
    const full = [...jobs, ...moreJobs].filter((job) => !applied.has(job.company))
    // Before Naukri is connected the feed is not two hand-picked rows — it is everything
    // AmbitionBox and company careers already know about. What Naukri actually adds is the
    // listings sourced from it, so those are what appear when it connects. Arriving here
    // from Home used to show a near-empty screen, which read as the tab being broken.
    return naukriConnected ? full : full.filter((job) => job.sourceLabel !== 'From Naukri')
  }, [naukriConnected])

  // The filters do real work — a chip that only looks like a filter is worse than none.
  const shownJobs = useMemo(() => {
    const needle = query.trim().toLowerCase()
    let list = visibleJobs
    if (needle) list = list.filter((job) => `${job.role} ${job.company} ${job.location}`.toLowerCase().includes(needle))
    if (filter === 'Remote') list = list.filter((job) => job.mode === 'Remote')
    if (filter === 'Hybrid') list = list.filter((job) => job.mode === 'Hybrid')
    if (filter === '₹30L+') list = list.filter((job) => Number(String(job.estSalary || job.salary || '').replace(/[^0-9.]/g, '').slice(0, 2)) >= 30)
    if (filter === 'Saved') list = list.filter((job) => journey.savedJobs.includes(job.id))
    return sort === 'Newest' ? [...list].reverse() : list
  }, [visibleJobs, query, filter, sort, journey.savedJobs])

  const confirmPreferences = () => { update({ naukriConnected: true, preferencesConfirmed: true }); setFlow('success') }

  return (
    <main id="main-content" className="screen matches-screen">
      {/* The wordmark alone, with saved jobs and the profile door on the right — the same
          header Home uses, so the two tabs read as one product. */}
      <div className="app-header page-pad">
        <Logo />
        <span className="app-header-tools">
          <button className="icon-button" onClick={() => setSavedOpen(true)} aria-label="Saved jobs"><Bookmark size={20} /></button>
          <button className="app-avatar-button" onClick={() => go('/profile')} aria-label="Your profile">
            <span className="avatar" aria-hidden="true">{candidate.initials}</span>
          </button>
        </span>
      </div>
      {/* The whole strip is the control, not a ⋯ button hiding at the end of it. Always
          present, and counted rather than asserted — the tab used to become a
          different screen depending on which preset you arrived with. */}
      <div className="page-pad">
        <button className="source-strip" onClick={() => setFlow('sources')}>
          <span className="source-avatars">{naukriConnected && <i>N</i>}<i>+</i></span>
          <span className="source-strip__copy">
            <strong>{naukriConnected ? 2 : 1} job board{naukriConnected ? 's' : ''} connected</strong>
            <small>{naukriConnected ? 3 : 4} more you can add</small>
          </span>
          <ChevronRight size={18} />
        </button>
      </div>

      <section className="page-pad feed-section">
        <label className="job-search">
          <Search size={18} />
          <input name="job-search" autoComplete="off" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search role, company or city" aria-label="Search jobs" />
          {query && <button className="job-search__clear" onClick={() => setQuery('')} aria-label="Clear search"><X size={16} /></button>}
        </label>
        <div className="job-filters" aria-label="Filter jobs">
          {['Remote', 'Hybrid', '₹30L+', 'Saved'].map((name) => (
            <button key={name} className={filter === name ? 'is-on' : ''} aria-pressed={filter === name} onClick={() => setFilter(filter === name ? null : name)}>{name}</button>
          ))}
        </div>
        {/* The count was a label nobody acts on. The row now says what the control does. */}
        <div className="feed-toolbar"><span className="feed-toolbar__label">Sort jobs by</span><button className="filter-button" onClick={() => setSort(sort === 'Best match' ? 'Newest' : 'Best match')}>{sort} <ChevronDown size={15} /></button></div>
        <div className="job-feed">
          {shownJobs.length
            ? shownJobs.map((job, index) => <JobCard key={job.id} job={job} index={index} saved={journey.savedJobs.includes(job.id)} onSave={() => toggleSaved(job.id)} onOpen={OPENABLE.has(job.id) ? () => go(`/jobs/${job.id}`) : null} />)
            : <p className="job-feed__empty">No roles match that yet. Try a different search or clear the filter.</p>}
        </div>
      </section>
      {/* Same chrome as Home. The pill names the role in view, which is what
          prototype/matches-2b does, and it opens the assistant that is actually about it. */}
      <AssistantDock
        active="matches"
        label="Ask North about Juspay"
        examples={['Show me remote roles only', 'Which of these pays above ₹30L?', 'Who is hiring for payments?', 'Which role fits me best?']}
        reduceMotion={reduceMotion}
        onOpen={(question) => setAssistant(question || '')}
      />

      <AnimatePresence>
        {flow === 'trust' && <NaukriTrust onClose={() => setFlow(null)} onContinue={() => setFlow('profile')} />}
        {flow === 'profile' && <NaukriProfile onBack={() => setFlow('trust')} onContinue={() => setFlow('preferences')} />}
        {flow === 'preferences' && <NaukriPreferences onBack={() => setFlow('profile')} onContinue={confirmPreferences} />}
        {flow === 'success' && <NaukriSuccess onDone={() => setFlow(null)} />}
        {flow === 'sources' && <SourcesSheet onClose={() => setFlow(null)} naukriConnected={naukriConnected} onConnectNaukri={() => setFlow('trust')} />}
        {assistant !== null && <HomeAssistantSheet journey={journey} initialQuestion={assistant} onClose={() => setAssistant(null)} index={contextualCapabilities({ journey }, { openAddInterview: () => go('/home?action=add-interview'), openOfferStart: () => go('/home') }, 'jobs')} />}
        {savedOpen && <SavedJobsSheet saved={journey.savedJobs} onClose={() => setSavedOpen(false)} />}
      </AnimatePresence>
    </main>
  )
}

/*
 * The job card — ported from prototype/matches-2b.html on 2026-08-19.
 *
 * The card's spine is the Highlights list: pay, culture and profile fit, each a title plus
 * a meta line naming where the claim came from. That is the AmbitionBox core — a job board
 * can list a role; only this can tell you what it actually pays, what it is like inside,
 * and how much of it you can already evidence.
 *
 * AmbitionBox does not have depth on every company. A highlight with no data is left out
 * rather than filled with a placeholder — an empty row still occupies the reader's
 * attention and teaches them nothing.
 *
 * Pay is one figure with its source attached. AmbitionBox's own estimate wears the badge,
 * which is what makes it legible as an estimate rather than a quoted fact; the employer's
 * posted range sits underneath as the other side of the claim. Where the employer posted
 * nothing, the estimate stands alone and says so. Where neither exists, there is no row.
 */
function payHighlight(job) {
  const posted = job.salary
  const estimate = job.estSalary
  if (estimate) {
    return {
      kind: 'pay', label: 'Pay', icon: IndianRupee, title: estimate, badge: 'AmbitionBox estimate',
      meta: posted ? `${job.company} posted ${posted}${job.estBasis ? ` · from ${job.estBasis}` : ''}` : `No range posted by ${job.company}${job.estBasis ? ` · from ${job.estBasis}` : ''}`,
    }
  }
  if (posted) return { kind: 'pay', label: 'Pay', icon: IndianRupee, title: posted, meta: `Posted by ${job.company}` }
  return null
}

function jobHighlights(job) {
  return [
    payHighlight(job),
    job.cultureTitle ? { kind: 'culture', label: 'Culture', icon: Building2, title: job.cultureTitle, meta: job.cultureMeta } : null,
    job.fitTitle ? { kind: 'fit', label: 'Profile fit', icon: Target, title: job.fitTitle, meta: job.fitMeta } : null,
  ].filter(Boolean)
}

function JobCard({ job, index, saved, onSave, onOpen }) {
  return (
    <motion.article
      className={`match-card ${onOpen ? 'match-card--open' : ''}`}
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index, 6) * .04 }}
      /* The whole card is the target. The inner controls stop propagation so Save and the
         explicit CTA still do their own thing. */
      onClick={onOpen || undefined}
      role={onOpen ? 'link' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onKeyDown={onOpen ? (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onOpen() } } : undefined}
    >
      <div className="match-card__strip">
        <span className="match-card__source">{job.sourceLabel} · {job.posted}</span>
      </div>

      <div className="match-card__body">
        <div className="job-id">
          <CompanyLogo initials={job.initials} color={job.color} />
          <span className="job-id__copy">
            <span className="job-id__companyline">
              <span className="job-id__company">{job.company}</span>
              {job.rating
                ? <span className="job-id__rating">
                    <span className="job-id__star"><Star size={10} fill="currentColor" strokeWidth={0} />{job.rating}</span>
                    <span>{job.reviews}</span>
                  </span>
                : <span className="job-id__rating"><span>{job.reviews}</span></span>}
            </span>
            <h3 className="job-id__role">{job.role}</h3>
            <span className="job-id__meta">{job.location} · {job.mode}{job.experience ? ` · ${job.experience}` : ''}</span>
          </span>
          {/* The score was a line of white text in the strip and read as a caption. It is
              the card's verdict, so it is set as a figure and given the brand colour. */}
          <span className="job-score"><b>{job.preferenceMatch}%</b><i>Match</i></span>
        </div>

        <h4 className="highlights-title">Highlights</h4>
        <ul className="highlights">
          {jobHighlights(job).map(({ kind, label, icon: Icon, title, badge, meta }) => (
            <li key={kind} className={`highlight highlight--${kind}`}>
              <span className="highlight__icon"><Icon size={17} /></span>
              <span className="highlight__content">
                <span className="highlight__label">{label}</span>
                <span className="highlight__title">{title}{badge && <em className="highlight__badge">{badge}</em>}</span>
                <span className="highlight__meta">{meta}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="match-card__actions">
          <button className="job-action job-action--save" onClick={(event) => { event.stopPropagation(); onSave() }} aria-pressed={saved} aria-label={saved ? `Unsave ${job.company}` : `Save ${job.company}`}>
            <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
          </button>
          {/* Same CTA on every card, and never drawn as disabled — a greyed-out button on
              ten of eleven cards makes the feed look broken rather than unfinished. Only
              Juspay has a detail screen in this prototype, so only Juspay responds. */}
          <button className="job-action job-action--view" onClick={(event) => { event.stopPropagation(); onOpen?.() }}>
            View job <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </motion.article>
  )
}

function NaukriTrust({ onClose, onContinue }) {
  return <Sheet label="Connect Naukri" onClose={onClose}><div className="integration-icon naukri-icon">n</div><Pill tone="soft">FUTURE NAUKRI CONNECTION</Pill><h2>Add the context your résumé misses</h2><p className="sheet-lead">Import your current profile and preferences to improve ranking. You’ll confirm every detail first.</p><div className="permission-list"><div><FileCheck2 size={18} /><span><strong>Profile details</strong><small>Skills, experience, education, and résumé.</small></span></div><div><Target size={18} /><span><strong>Job preferences</strong><small>Roles, salary, locations, and work mode.</small></span></div><div><ShieldCheck size={18} /><span><strong>No profile changes</strong><small>North cannot edit your Naukri profile.</small></span></div></div><button className="primary-button" onClick={onContinue}>Connect in one tap <ArrowRight size={17} /></button><p className="fine-print">Demo simulation—no Naukri account is accessed.</p></Sheet>
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

/*
 * Job boards, reshaped 2026-08-19.
 *
 * Only things that actually list jobs belong here. AmbitionBox is not a job board — it is
 * the intelligence layer applied on top of them — and recruiter email is an inbox, not a
 * source of listings; both were making the list mean less. Boards that are not connected
 * are named with the action to connect them, because that is the question the sheet is
 * opened to answer: what is this watching, and what could it watch.
 *
 * `bottom` matters: without it the shared Sheet centres itself on wide viewports and
 * reads as a modal rather than something you pulled up from the bottom edge.
 */
function SourcesSheet({ onClose, naukriConnected, onConnectNaukri }) {
  const boards = [
    naukriConnected
      ? { name: 'Naukri', detail: 'Profile, preferences and job listings', state: 'on', status: 'Connected', mark: 'n', color: '#2769dd' }
      : { name: 'Naukri', detail: 'Profile, preferences and job listings', state: 'off', mark: 'n', color: '#2769dd', onConnect: onConnectNaukri },
    { name: 'Company careers', detail: 'Listings taken straight from employers', state: 'on', status: 'Indexed', mark: '+', color: '#4c6075' },
    { name: 'iimjobs', detail: 'Mid and senior roles', state: 'off', mark: 'ii', color: '#00457c' },
    { name: 'Hirist', detail: 'Technology roles', state: 'off', mark: 'H', color: '#e8502e' },
    { name: 'Instahyre', detail: 'Curated product and startup roles', state: 'off', mark: 'In', color: '#0a9c8c' },
  ]
  return (
    <Sheet label="Job boards" onClose={onClose} bottom>
      <h2>Job boards</h2>
      <p className="sheet-lead">Every board you connect adds listings. North applies the same preference and readiness logic across all of them.</p>
      <div className="board-list">
        {boards.map(({ name, detail, state, status, mark, color, onConnect }) => (
          <div key={name} className={`board-row board-row--${state}`}>
            <span className="board-mark" style={{ background: color }}>{mark}</span>
            <span className="board-copy"><strong>{name}</strong><small>{detail}</small></span>
            {state === 'on'
              ? <span className="board-status board-status--on">{status}</span>
              : <button className="board-connect" onClick={onConnect}>Connect</button>}
          </div>
        ))}
      </div>
    </Sheet>
  )
}

function SavedJobsSheet({ saved, onClose }) {
  const savedItems = jobs.filter((job) => saved.includes(job.id))
  return <Sheet label="Saved jobs" onClose={onClose}><Pill tone="soft">YOUR SHORTLIST</Pill><h2>{savedItems.length ? `${savedItems.length} saved ${savedItems.length === 1 ? 'role' : 'roles'}` : 'Nothing saved yet'}</h2><p className="sheet-lead">Save a match to keep it here while you compare.</p><div className="saved-list">{savedItems.length ? savedItems.map((job) => <button key={job.id} onClick={() => OPENABLE.has(job.id) && go(`/jobs/${job.id}`)}><CompanyLogo initials={job.initials} /><span><strong>{job.company}</strong><small>{job.role}{job.salary ? ` · ${job.salary}` : ''}</small></span><ChevronRight size={17} /></button>) : <div className="closed-state"><Bookmark size={26} /><p>Your saved roles will appear here.</p></div>}</div><button className="secondary-button" onClick={onClose}>Keep browsing</button></Sheet>
}

function NaukriSuccess({ onDone }) {
  return <Sheet label="Naukri connected"><div className="success-burst"><Check size={28} /></div><Pill tone="success">PROFILE CONNECTED</Pill><h2>Your matches just got sharper</h2><p className="sheet-lead">We reranked opportunities using your current skills, salary target, and work preferences.</p><div className="rerank-card"><div><span className="rank-arrow">↑3</span><CompanyLogo initials="JP" /><span><strong>Juspay</strong><small>Senior Backend Engineer</small></span></div><Pill tone="success">89% match</Pill></div><button className="primary-button" onClick={onDone}>See ranked matches <ArrowRight size={17} /></button></Sheet>
}

/*
 * Job detail — ported from prototype/job-detail-1b.html on 2026-08-19.
 *
 * The 1B composition, in order: identity, the two actions, the Preference match card, and
 * Profile Readiness. Readiness is the screen's real content — a segmented meter over the
 * fifteen requirements, then three groups you can open: what already fits, what to
 * strengthen, and what may hold you back. A flat bar said "10/15" and stopped; this says
 * which ten, which four, and which one, which is the whole point of the screen.
 *
 * Requirement lists are 1B's verbatim. Readiness moves 10 → 14 on tailoring and 15 only
 * when Java is confirmed in prep, which is the existing journey contract.
 */
const FITS_BASE = [
  '6 years backend engineering', 'Payments & fintech systems', 'REST & gRPC API design',
  'Microservices architecture', 'PostgreSQL & data modelling', 'Redis & caching',
  'Kafka & event-driven systems', 'AWS production systems', 'Monitoring & incident response',
  'Code reviews & mentoring',
]
const FITS_ADDED = [
  'System-design ownership', 'Scale & throughput metrics', 'Cross-team technical leadership',
  'Hands-on Kubernetes ownership',
]

function ReadinessGroup({ tone, count, name, sub, rows, defaultOpen }) {
  const [open, setOpen] = useState(Boolean(defaultOpen))
  const disabled = !rows.length
  return (
    <div className={`b-grp b-grp--${tone} ${open ? 'is-open' : ''}`}>
      <button className="b-grp__head" aria-expanded={open} disabled={disabled} onClick={() => setOpen((v) => !v)}>
        <span className="b-grp__count">{count}</span>
        <span className="b-grp__title"><span className="b-grp__name">{name}</span><span className="b-grp__sub">{sub}</span></span>
        <ChevronDown className="b-grp__chev" size={18} />
      </button>
      {open && !disabled && (
        <div className="b-grp__panel">
          {rows.map((row) => (
            <div className="row" key={row}><span className={`row__ind row__ind--${tone}`} /><span className="row__title">{row}</span></div>
          ))}
        </div>
      )}
    </div>
  )
}

/*
 * Preference Match chips, derived rather than authored. Every chip is one of the user's
 * stated preferences checked against the posting: green matches, amber is a real trade-off,
 * grey means no preference was captured so nothing is being judged. The rule from
 * PROJECT_CONTEXT holds — this is role-to-preference alignment, never profile evidence.
 */
function preferenceChips(job) {
  const target = 22
  const floor = Number((job.salary.match(/\u20b9(\d+)/) || [])[1] || 0)
  return [
    { tone: floor >= target ? 'ok' : 'warn', label: floor >= target ? `${job.salary} · above \u20b922L target` : `${job.salary} · below your \u20b922L target` },
    { tone: job.location === 'Bengaluru' || job.location === 'Remote' ? 'ok' : 'warn', label: job.location },
    { tone: 'ok', label: 'Fintech' },
    { tone: 'ok', label: 'Senior' },
    { tone: job.mode === 'Office' ? 'warn' : 'ok', label: job.mode === 'Hybrid' ? 'Hybrid · 3 days' : job.mode },
    { tone: 'neutral', label: job.experience || job.type },
  ]
}

/*
 * One detail screen for every role that has one. Juspay is still the only job whose
 * readiness moves — the résumé and prep flows act on it — so it keeps the journey-driven
 * path. The others read a static requirement list, and a role with no readiness data at
 * all says so rather than inventing a number.
 */
/*
 * Which roles have a detail screen. Juspay is the golden path and its readiness moves
 * with the journey; Zeta reads a static requirement list; Groww opens and says it has
 * none. Everything else in the feed stays closed and does not pretend otherwise — no
 * arrow, no tap target — because a detail screen with nothing behind it would have to
 * invent the evidence it shows.
 */
const OPENABLE = new Set(['juspay', 'zeta', 'razorline'])

function JobDetailScreen() {
  const { journey, toggleSaved } = useJourney()
  const id = window.location.pathname.split('/')[2]
  const job = [...jobs, ...moreJobs].find((entry) => entry.id === id) || juspay
  const isJuspay = job.id === 'juspay' || !job.id

  const [assistant, setAssistant] = useState(null)
  const [applyOpen, setApplyOpen] = useState(false)
  const assistantSheets = {
    openAddInterview: () => go('/home?action=add-interview'),
    openOfferStart: () => go('/home'),
  }
  const saved = journey.savedJobs.includes(job.id)
  const readiness = journey.readiness
  const javaConfirmed = readiness >= 15
  const tailored = readiness >= 14

  const detail = isJuspay ? undefined : jobDetails[job.id]
  const fits = isJuspay
    ? (javaConfirmed ? [...FITS_BASE, ...FITS_ADDED, 'Production Java ownership'] : (tailored ? [...FITS_BASE, ...FITS_ADDED] : FITS_BASE))
    : (detail?.fits || [])
  const strengthen = isJuspay ? (tailored ? [] : FITS_ADDED) : (detail?.strengthen || [])
  const missing = isJuspay ? (javaConfirmed ? [] : ['Java production experience']) : (detail?.missing || [])
  const total = isJuspay ? 15 : (detail?.total || 0)
  const evidenced = isJuspay ? readiness : fits.length
  const meter = [
    ...Array(fits.length).fill('ok'),
    ...Array(strengthen.length).fill('need'),
    ...Array(missing.length).fill('miss'),
  ]

  return (
    <main id="main-content" className="detail-screen screen">
      <Topbar back="/matches" title="Job details" right={<button className="icon-button" onClick={() => toggleSaved(job.id)} aria-label={saved ? 'Unsave job' : 'Save job'}><Bookmark size={20} fill={saved ? 'currentColor' : 'none'} /></button>} />

      <section className="identity page-pad">
        <div className="id-row">
          <span className="id-logo">{job.initials}</span>
          <div className="id-titlewrap">
            <h1 className="id-title">{job.role}</h1>
            <div className="id-companyline">
              <span className="id-company">{job.company}</span>
              <span className="rating" aria-label={`AmbitionBox rating ${job.rating} out of 5, based on ${job.reviews}`}>
                <span className="rating__tile"><Star size={12} fill="currentColor" strokeWidth={0} /></span>
                <span className="rating__num">{job.rating}</span>
                <span className="rating__meta">· {job.reviews}</span>
              </span>
            </div>
          </div>
        </div>
        <p className="id-meta"><span className="src">{job.sourceLabel || 'via Naukri'}</span> · Posted {job.posted || '2 days ago'}</p>
      </section>

      <div className="actions page-pad">
        <button className="act-save" onClick={() => toggleSaved(job.id)} aria-pressed={saved}>
          <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}
        </button>
        {/* Applying happens on Naukri, not here. The sheet says so rather than the button
            quietly leading somewhere else. */}
        <button className="act-apply" onClick={() => setApplyOpen(true)}>
          <ExternalLink size={16} /> Apply on Naukri
        </button>
      </div>

      <section className="b-pref" aria-label={`Preference match ${job.preferenceMatch} percent`}>
        <div className="b-pref__head">
          <span className="b-pref__title">PREFERENCE MATCH</span>
          <span className="b-pref__score">{job.preferenceMatch}%</span>
        </div>
        <div className="b-chips">
          {preferenceChips(job).map((chip) => (
            <span key={chip.label} className={`b-chip b-chip--${chip.tone}`}>
              {chip.tone === 'ok' && <Check size={14} />} {chip.label}
            </span>
          ))}
        </div>
        <button className="b-cta" onClick={() => setAssistant(`Why is ${job.company} a good match for me?`)}>
          See match breakdown <ChevronRight size={18} />
        </button>
      </section>

      {total ? (
        <section className="b-ready">
          <div className="b-ready__top">
            <h2 className="ready__title">Profile Readiness</h2>
            <p className="ready__count"><b>{evidenced} of {total}</b> requirements evidenced</p>
            <div className="seg" role="img" aria-label={`Of ${total} requirements: ${fits.length} confirmed matches, ${strengthen.length} need evidence, ${missing.length} mismatch`}>
              {meter.map((tone, index) => <span key={index} className={`seg__b seg__b--${tone}`} />)}
            </div>
          </div>
          <div className="b-groups">
            <ReadinessGroup tone="ok" count={fits.length} name="What already fits" sub="Clear, relevant evidence" rows={fits} />
            <ReadinessGroup tone="need" count={strengthen.length} name="What to strengthen" sub={strengthen.length ? `${strengthen.length} need stronger proof` : 'No unresolved evidence'} rows={strengthen} defaultOpen={Boolean(strengthen.length)} />
            <ReadinessGroup tone="miss" count={missing.length} name="What may hold you back" sub={missing.length ? 'Confirmed gaps against the role' : 'No confirmed gaps'} rows={missing} defaultOpen={Boolean(missing.length)} />
          </div>
          <button className="b-ready__cta" onClick={() => go(isJuspay ? (!tailored ? '/assistant/juspay' : journey.interviewInvited ? '/prep/juspay' : '/home') : '/assistant/juspay')}>
            <span className="b-ready__cta-lead"><AssistantMark className="b-ready__cta-orb" /> {isJuspay && tailored ? (journey.interviewInvited ? 'Prepare for interview' : 'See my next move') : 'Close gaps · tailor your résumé'}</span>
            <ChevronRight size={18} />
          </button>
        </section>
      ) : (
        /* No readiness data for this company. Drawn as an absence with the reason, never
           as a finding — an empty meter would read as "you match nothing". */
        <section className="b-ready b-ready--empty">
          <h2 className="ready__title">Profile Readiness</h2>
          <p className="ready__count">Not available for this role</p>
          <p className="ready__empty">{job.company} has not published a requirement list AmbitionBox can read, and nobody has reported one. Preference Match above still applies — it checks the posting against what you asked for.</p>
        </section>
      )}

      <div className="detail-dock">
        <button className="detail-dock-ask" onClick={() => setAssistant('')}>
          <AssistantMark className="detail-dock-mark" />
          <span>Ask about this role</span>
          <span className="detail-dock-send"><NorthMark /></span>
        </button>
      </div>

      <AnimatePresence>
        {assistant !== null && <HomeAssistantSheet journey={journey} initialQuestion={assistant} onClose={() => setAssistant(null)} index={contextualCapabilities({ journey }, assistantSheets, 'job')} />}
        {applyOpen && <Sheet label="Apply on Naukri" onClose={() => setApplyOpen(false)} bottom>
          <h2>Applying happens on Naukri</h2>
          <p className="sheet-lead">This listing came from Naukri, so the application is submitted there. North never applies on your behalf.</p>
          <div className="permission-list">
            <div><FileCheck2 size={18} /><span><strong>Take your tailored résumé</strong><small>Download it here first — it is the version written against this role.</small></span></div>
            <div><ShieldCheck size={18} /><span><strong>Nothing is sent from here</strong><small>No application, message or document leaves North without you.</small></span></div>
          </div>
        </Sheet>}
      </AnimatePresence>
    </main>
  )
}

/*
 * The evidence conversation — ported from prototype/job-detail-1b.html on 2026-08-19.
 *
 * Four requirements, one question at a time. Each answer is classified before anything is
 * claimed, and the order of the checks is the whole point:
 *
 *   negation first → a "never used it in production" can never become confirmed evidence
 *   then complete  → clear personal ownership, so a receipt is issued and we move on
 *   then on-topic  → mixed or unclear, so one counter-question rather than an assumption
 *   otherwise      → restate the question; nothing is recorded
 *
 * The receipts describe only what the user actually said. Nothing is inferred, and an
 * explicit "no" leaves the requirement unclaimed rather than quietly softened.
 */
const FP_NEG = /\b(i|we)\s+never\b|\b(i|we)\s+(did|do|does|had|have|was|were|am|are)\s*n[o’']?t\b|\b(i|we)\s+(did|do|does|had|have|was|were|am|are)\s+not\b|\b(i|we)\s+(have|had)\s+no\b|\b(did|do|does|had|have)\s*n[o’']?t\s+(own|use|used|build|built|manage|managed|run|ran|handle|handled|operate|operated|work|worked|deploy|deployed)\b|\bno\s+(?:\w+\s+){0,2}(experience|exposure|background|involvement|ownership)\b|\bnot\s+(really\s+)?(hands[-\s]?on|responsible|the\s+owner|an?\s+owner|involved|mine)\b|\b(only|just)\s+(observed|watched|assisted|helped|supported|shadowed|monitored|reviewed|saw)\b|\bnever\s+(used|owned|worked|touched|ran|managed|operated|deployed|built)\b/i

const wordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length

const EVIDENCE_QUESTIONS = [
  {
    id: 'system-design',
    requirement: 'System-design ownership',
    from: 'Evidence needed',
    ask: 'What backend system did you personally own from design through production?',
    hint: 'Tell me what it was, which design decisions were yours, and how far you took it.',
    sample: 'At Razorpay, I led the end-to-end redesign of our payment webhook delivery platform. I wrote the design RFC, chose the service boundaries and Kafka-based retry model, aligned the rollout plan with dependent teams, and owned the production rollout.',
    receiptTitle: 'System-design ownership evidenced',
    receiptDetail: 'End-to-end ownership is now clear: RFC, architecture decisions, cross-team alignment, and production rollout.',
    counter: 'Which design decision was personally yours, and did you own the production rollout?',
    restate: 'I don’t think that covers this one yet. I’m asking about a backend system you owned from design through production — what was it, and which decisions were yours?',
    no: 'Understood — I won’t claim end-to-end system ownership you didn’t have. If there’s a smaller piece you did own from design to production, tell me and I’ll use only that.',
    topic: /(system|service|platform|backend|design|architect|rebuild|redesign|rewrote|rewrite|api|pipeline|feature|module|rfc|built|build|migration|infrastructure)/i,
    complete: (s) => wordCount(s) >= 12
      && /(design|redesign|architect|rfc|boundaries|retry model|data model|owned|own\b|built|led|drove|chose|defined|wrote)/.test(s)
      && /(production|rollout|roll out|launch|deploy|shipped|went live|in prod|end.?to.?end|end to end)/.test(s),
  },
  {
    id: 'scale',
    requirement: 'Scale & throughput metrics',
    from: 'Evidence needed',
    ask: 'What scale did that system run at, and what changed after your work?',
    hint: 'Volume it handled, plus any change in delivery success, latency, or reliability — with numbers.',
    sample: 'It handled about 12 million webhook events a day. The redesign improved successful delivery from 98.8% to 99.95% and cut p99 processing latency from 420 ms to 240 ms.',
    receiptTitle: 'Scale and throughput evidenced',
    receiptDetail: 'I’ll use the volume, delivery-success, and latency figures exactly as you provided them.',
    counter: 'What changed after the redesign — delivery success, latency, or reliability?',
    restate: 'That doesn’t give me the scale yet. Roughly what volume did it handle, and did delivery, latency, or reliability change — with numbers?',
    no: 'Understood — I won’t invent scale or reliability numbers. If you have figures you can stand behind, share them; otherwise I’ll leave this unquantified.',
    topic: /(\d|scale|volume|throughput|traffic|latenc|reliab|uptime|users?|requests?|events?|per day|a day|per second|rps|qps|million|thousand|percent|%|\bms\b|p9|delivery|success)/i,
    complete: (s) => wordCount(s) >= 10 && (s.match(/\d[\d,.]*/g) || []).length >= 2,
  },
  {
    id: 'leadership',
    requirement: 'Cross-team technical leadership',
    from: 'Evidence needed',
    ask: 'Who did you lead beyond your own team to make it happen?',
    hint: 'The teams outside yours you aligned, and the decision or rollout you drove.',
    sample: 'I coordinated the rollout across Payments, Risk, Reconciliation, and Developer Experience. I ran design reviews, tracked migration risks with the tech leads, and mentored three engineers who implemented the new services.',
    receiptTitle: 'Cross-team technical leadership evidenced',
    receiptDetail: 'Your evidence covers four teams, design and migration leadership, and mentoring three engineers.',
    counter: 'Which teams outside your own did you align, and what technical decision or rollout did you drive?',
    restate: 'I still need the cross-team picture. Which teams beyond your own did you lead, and what did you coordinate across them?',
    no: 'Understood — I won’t imply cross-team leadership you didn’t have. If you led even one team beyond your own, tell me and I’ll use just that.',
    topic: /(team|teams|led|lead|coordinat|mentor|align|stakeholder|engineers?|people|rollout|cross|manage|guided|drove|ran|reviews?)/i,
    complete: (s) => wordCount(s) >= 10
      && /(led|lead|coordinat|mentor|drove|ran|aligned|managed|guided|owned)/.test(s)
      && ((s.match(/payments|risk|reconciliation|developer experience|devex|platform|infrastructure|infra|sre|frontend|data|qa|security/g) || []).length >= 2
        || /(cross.?team|several teams|multiple teams|other teams|two teams|three teams|four teams|\bteams\b)/.test(s)),
  },
  {
    id: 'kubernetes',
    requirement: 'Hands-on Kubernetes ownership',
    from: 'Needs confirmation',
    ask: 'How hands-on were you with Kubernetes in production?',
    hint: 'What you personally operated — and what stayed with the platform team.',
    sample: 'I owned Kubernetes deployment and runtime operations for six payment services on EKS. I maintained Helm charts, configured probes, resource limits and autoscaling, ran rollouts and rollbacks, and debugged pods during incidents. The platform team owned control-plane upgrades and cluster networking.',
    receiptTitle: 'Hands-on Kubernetes ownership evidenced',
    receiptDetail: 'I’ll describe your service-workload ownership precisely — not cluster administration or the control plane.',
    counter: 'What did you personally handle — Helm, rollouts, scaling, or incident debugging?',
    restate: 'I want to be precise about Kubernetes. What did you personally operate in production, versus what the platform team owned?',
    no: 'Understood. I won’t add Kubernetes ownership to your résumé or imply experience you don’t have.',
    topic: /(kubernetes|k8s|eks|helm|kubectl|pod|container|cluster|deploy|orchestrat|docker|node|namespace|autoscal|rollout)/i,
    complete: (s) => wordCount(s) >= 10
      && /(kubernetes|k8s|eks|helm|kubectl)/.test(s)
      && /(deploy|rollout|roll out|rollback|roll back|probe|autoscal|scaling|resource limit|\bpod|runtime|operat|incident|debug|helm chart)/.test(s),
  },
]

function classifyEvidence(question, text) {
  const s = text.toLowerCase()
  if (FP_NEG.test(s)) return 'no'
  if (question.complete(s)) return 'complete'
  if (question.topic.test(s)) return 'partial'
  return 'offtopic'
}

function AssistantScreen() {
  const { journey, update } = useJourney()
  const params = new URLSearchParams(window.location.search)
  const requested = params.get('stage')
  const [stage, setStage] = useState(['question', 'insight', 'resume'].includes(requested) ? requested : (journey.resumeReady ? 'resume' : 'question'))
  const [answer, setAnswer] = useState('')
  const [step, setStep] = useState(0)
  const [receipts, setReceipts] = useState([])
  const [done, setDone] = useState(false)
  // The thread is the screen. Every turn appends; nothing is ever rewritten, so what the
  // assistant said earlier stays on the record exactly as it was said.
  const [thread, setThread] = useState(() => [
    { kind: 'findings' },
    { kind: 'question', index: 0, question: EVIDENCE_QUESTIONS[0] },
  ])
  const threadRef = useRef(null)
  // A thread that does not follow itself makes the user hunt for the reply they just got.
  useEffect(() => {
    const node = threadRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [thread])
  const [tailoring, setTailoring] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [javaChoice, setJavaChoice] = useState(journey.javaConfirmed)

  /*
   * One answer, one classification. A negative keeps the requirement unclaimed and still
   * moves on — the user has told us something true and being asked again would be nagging.
   * Anything unclear asks once more rather than assuming.
   */
  const question = EVIDENCE_QUESTIONS[step]
  const submitEvidence = () => {
    const text = answer.trim()
    if (!text || done) return
    const verdict = classifyEvidence(question, text)
    const turns = [{ kind: 'user', text }]
    setAnswer('')

    // Unclear or off-topic asks once more. The question stays live, nothing is recorded,
    // and the user's own words remain on the thread above the follow-up.
    if (verdict === 'partial' || verdict === 'offtopic') {
      setThread((current) => [...current, ...turns, { kind: 'note', text: verdict === 'partial' ? question.counter : question.restate }])
      return
    }

    const receipt = verdict === 'complete'
      ? { kind: 'receipt', id: question.id, claimed: true, title: question.receiptTitle, detail: question.receiptDetail }
      : { kind: 'receipt', id: question.id, claimed: false, title: `${question.requirement} — left unclaimed`, detail: question.no }
    setReceipts((current) => [...current, receipt])
    turns.push(receipt)

    if (step + 1 < EVIDENCE_QUESTIONS.length) {
      const next = step + 1
      setStep(next)
      turns.push({ kind: 'question', index: next, question: EVIDENCE_QUESTIONS[next] })
    } else {
      setDone(true)
      turns.push({ kind: 'done' })
    }
    setThread((current) => [...current, ...turns])
  }
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
    stage === 'resume' ? (
    <main id="main-content" className="assistant-screen screen">
      <Topbar back="/jobs/juspay" title="Career Assistant" eyebrow="JUSPAY APPLICATION" right={<span className="online-badge"><span /> Live context</span>} />
      <section className="assistant-thread page-pad">
        {stage === 'resume' && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* The screen's job is to hand over a file, so Download is the only primary and
              everything above it exists to justify pressing it: what the number moved to,
              which requirements moved it, and what the document now says. */}
          <div className="copilot-intro"><span className="assistant-orb large success"><FileCheck2 size={20} /></span><div><Pill tone="success">RÉSUMÉ READY</Pill><h1>Profile Readiness is now {journey.readiness}/15.</h1><p>Your strongest evidence is where a Juspay recruiter will look for it.</p></div></div>

          <div className="r-score">
            <div className="r-score__row"><b>{journey.readiness} of 15</b><span>requirements evidenced</span><em>+{journey.readiness - 10} since you started</em></div>
            <div className="seg" role="img" aria-label={`${journey.readiness} of 15 requirements evidenced`}>
              {Array.from({ length: 15 }, (_, index) => <span key={index} className={`seg__b seg__b--${index < journey.readiness ? 'ok' : 'miss'}`} />)}
            </div>
          </div>

          <h2 className="r-heading">Changes in this version</h2>
          <div className="r-changes">
            {FITS_ADDED.map((item) => (
              <div className="r-change" key={item}><Check size={15} /><span>{item}</span></div>
            ))}
          </div>

          <div className="resume-preview"><div className="resume-toolbar"><span><FileCheck2 size={17} /> Arjun_Mehta_Juspay.pdf</span><Pill tone="success">Tailored</Pill></div><div className="resume-paper"><div className="resume-name">ARJUN MEHTA</div><div className="resume-role">Senior Backend Engineer · {candidate.location}</div><div className="resume-rule" /><strong>RAZORPAY · SENIOR BACKEND ENGINEER</strong><p className="highlight-line">Designed idempotent payment workflows processing high-volume retries safely.</p><p className="highlight-line">Led reliability improvements that reduced payment callback failures by 31%.</p><p>Built Kafka-based event processing with clear observability and ownership.</p></div></div>

          <div className="correction-card"><div><span className="eyebrow">ONE HONEST CHECK</span><h3>Did you personally own production Java services for 3+ years?</h3><p>Juspay lists this explicitly. Confirm only if it’s accurate.</p></div><div className="choice-row"><button className={javaChoice === true ? 'is-selected' : ''} onClick={() => confirmJava(true)}>Yes, I did</button><button className={javaChoice === false ? 'is-selected' : ''} onClick={() => confirmJava(false)}>Not quite</button></div>{javaChoice === false && <p className="correction-result"><ShieldCheck size={15} /> Kept at 14/15. The gap stays visible—your résumé remains honest.</p>}{javaChoice === true && <p className="correction-result success"><Check size={15} /> Confirmed. Profile Readiness is now 15/15.</p>}</div>

          <div className="r-actions">
            <button className="primary-button" aria-live="polite" disabled={downloading} onClick={downloadResume}>{downloading ? 'Preparing PDF…' : <>Download PDF <FileCheck2 size={17} /></>}</button>
            <button className="text-button" onClick={() => go('/jobs/juspay')}>Return to job</button>
          </div>
        </motion.div>}
      </section>
    </main>
    ) : (
    /*
     * The evidence conversation is a chat, not a form — prototype/job-detail-1b.html.
     * A thread the assistant is speaking in, a progress bar over the four requirements,
     * and a composer pinned at the foot. The findings card opens it so the user knows
     * what is being asked and why before the first question arrives.
     */
    <main id="main-content" className="chat-screen">
      <div className="c-top">
        <button className="iconbtn" onClick={() => go('/jobs/juspay')} aria-label="Back to job detail"><ArrowLeft size={20} /></button>
        <div className="c-top__id">
          <AssistantMark className="c-top__orb" />
          <span className="c-top__txt">
            <span className="c-top__name">Career Assistant</span>
            <span className="c-top__sub">{juspay.role} · {juspay.company}</span>
          </span>
        </div>
      </div>

      <div className="c-prog">
        <div className="c-prog__bar">
          {EVIDENCE_QUESTIONS.map((q, index) => (
            <span key={q.id} className={`c-prog__seg ${index < step ? 'is-done' : index === step ? 'is-current' : ''}`} />
          ))}
        </div>
        <span className="c-prog__label">Question {Math.min(step + 1, EVIDENCE_QUESTIONS.length)} of {EVIDENCE_QUESTIONS.length}</span>
      </div>

      <div className="c-thread" ref={threadRef} role="log" aria-live="polite" aria-label="Conversation">
        <div className="c-thread__in">
          {thread.map((item, index) => {
            if (item.kind === 'user') return <div className="c-user" key={index}>{item.text}</div>
            return (
              <div className="c-asst" key={index}>
                <div className="c-asst__ident"><AssistantMark className="c-mini-orb" /><b>Career Assistant</b></div>
                {item.kind === 'findings' && (
                  <>
                    <div className="c-findings">
                      <div className="c-findings__hd">Here’s what I found</div>
                      <div className="c-findings__score"><b>10 of 15</b> evidenced</div>
                      <ul className="c-fsum">
                        <li><span className="c-fdot c-fdot--need" /><b>3 need proof</b><span className="c-fsum__v">System design · Scale · Cross-team leadership</span></li>
                        <li><span className="c-fdot c-fdot--need" /><b>1 to confirm</b><span className="c-fsum__v">Kubernetes ownership</span></li>
                        <li><span className="c-fdot c-fdot--miss" /><b>1 confirmed gap</b><span className="c-fsum__v">Production Java</span></li>
                      </ul>
                    </div>
                    <p>I can strengthen the first four from what you tell me. I’ll keep Java off unless you correct it with production evidence.</p>
                  </>
                )}
                {item.kind === 'question' && (
                  <>
                    <div className="c-qcard">
                      <span className="c-qcard__label">Question {item.index + 1} of {EVIDENCE_QUESTIONS.length}</span>
                      <h2 className="c-qcard__q">{item.question.ask}</h2>
                      <p className="c-qcard__hint">{item.question.hint}</p>
                    </div>
                    {index === thread.length - 1 && <p className="c-qguide">Explain it in your own words — rough is fine. I’ll refine it and ask a follow-up if anything important is missing.</p>}
                  </>
                )}
                {item.kind === 'receipt' && (
                  <div className={`c-receipt ${item.claimed ? '' : 'c-receipt--open'}`}>
                    {item.claimed ? <Check size={16} /> : <Info size={16} />}
                    <span><strong>{item.title}</strong><small>{item.detail}</small></span>
                  </div>
                )}
                {item.kind === 'note' && <p>{item.text}</p>}
                {item.kind === 'done' && (
                  <>
                    <p>{receipts.filter((r) => r.claimed).length} of {EVIDENCE_QUESTIONS.length} requirements are now evidenced in your own words. Nothing here is anything you didn’t say.</p>
                    <button className="primary-button" onClick={tailor} disabled={tailoring}>{tailoring ? <><span className="spinner" /> Tailoring résumé…</> : <>Tailor my résumé for Juspay <ArrowRight size={17} /></>}</button>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <form className="c-composer" onSubmit={(event) => { event.preventDefault(); submitEvidence() }}>
        <div className="c-composer__field">
          <label className="sr-only" htmlFor="evidence-answer">Type your answer</label>
          <textarea id="evidence-answer" name="evidence-answer" autoComplete="off" rows={1} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer…" disabled={done} />
          <button type="submit" className="c-send" disabled={!answer.trim()} aria-label="Send answer"><ArrowRight size={18} /></button>
        </div>
        <div className="c-composer__foot">
          <span className="c-composer__note">One question at a time · I only use details you confirm</span>
          {!done && <button type="button" className="c-demohint" onClick={() => setAnswer(question.sample)}><span className="c-demohint__tag">Demo</span> Use Arjun’s demo answer</button>}
        </div>
      </form>
    </main>
    )
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
  return <main id="main-content" className="notification-screen"><div className="lock-glow" aria-hidden="true" /><div className="lock-status"><span>9:41</span><span>Saturday, 8 August</span></div><button className="push-notification" onClick={onOpen} aria-label="Open AmbitionBox notification about Juspay"><span className="notification-app"><Logo small /></span><span><span className="notification-head"><strong>North</strong><small>now</small></span><b>Arjun, there’s a big update on your Juspay application.&nbsp;<span className="suspense-emoji" role="img" aria-label="Fingers crossed">🤞</span></b><small>Tap to see what changed.</small></span><ChevronRight size={20} /></button><p className="tap-hint">Tap the notification to open</p></main>
}

function OfferLaunch({ onSkip }) {
  return <main id="main-content" className="offer-launch"><motion.div className="launch-brand" initial={{ scale: .88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><div className="launch-official-logo" aria-label="AmbitionBox"><img src="/ambitionbox-launch-mark.svg" alt="" aria-hidden="true" /><span>North</span></div><span>Opening your update…</span></motion.div><button className="text-button" onClick={onSkip}>Skip animation</button></main>
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
          <div className="negotiation-evidence-source"><img src="/north-mark.svg" alt="" aria-hidden="true" /><span>Based on AmbitionBox salary data for senior backend roles in Bengaluru · {offerDecision.salaryBenchmarks.freshness}</span></div>
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
  return <Sheet label="Detailed salary insights" onClose={onClose} wide><div className="salary-detail-sheet"><div className="salary-detail-heading"><img src="/north-mark.svg" alt="" aria-hidden="true" /><span><h2>Detailed salary insights</h2><p>Senior backend · 6 to 9 years · Bengaluru</p></span></div><div className="salary-offer-position"><span><small>Your Juspay offer</small><strong>{offer.total}</strong></span><b>Above average</b></div><div className="salary-detail-grid"><div><small>Typical range</small><strong>{offerDecision.salaryBenchmarks.range}</strong></div><div><small>Average salary</small><strong>{offerDecision.salaryBenchmarks.average}</strong></div><div><small>Top 10% earn</small><strong>{offerDecision.salaryBenchmarks.topTen}</strong></div><div><small>Top 1% earn</small><strong>{offerDecision.salaryBenchmarks.topOne}</strong></div></div><div className="salary-detail-guidance"><Target size={17} /><span><strong>How to use this</strong><p>Your offer has room to discuss ₹30L or a more favourable fixed-to-variable split.</p></span></div><div className="prototype-source-note"><Info size={15} /><span><strong>AmbitionBox salary data</strong><small>{offerDecision.salaryBenchmarks.freshness} · Deterministic CEO-demo benchmark for this role and location.</small></span></div><button className="primary-button" onClick={onClose}>Back to offer evaluation</button></div></Sheet>
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
    {status === 'waiting' ? <section className="employee-wait page-pad"><div className="anonymous-avatar"><Users size={28} /></div><span className="spinner dark" /><Pill tone="soft">REQUEST MATCHED</Pill><h1>Finding the right perspective…</h1><p>Your question is being matched to a verified backend employee. No names or contact details are shared.</p><div className="simulation-note"><Info size={15} /> Prototype simulation—no employee is contacted.</div></section> : status === 'responded' ? <section className="employee-response page-pad"><div className="employee-profile"><span className="anonymous-avatar small"><UserRoundCheck size={20} /></span><span><strong>Verified Juspay employee</strong><small>Backend engineering · Identity protected</small></span><Pill tone="success">REPLIED</Pill></div><div className="question-quote"><span>YOUR QUESTION</span>{question}</div><div className="response-bubble"><p>“{offerDecision.anonymousEmployee.response}”</p><span>Current employee experience · Not official company policy</span></div><div className="source-receipt"><ShieldCheck size={15} /><span><strong>Privacy protected</strong><small>Both identities remain hidden. Conversation expires after 7 days.</small></span></div><button className="primary-button" onClick={useResponse}>Use this in my decision <Check size={17} /></button><button className="secondary-button" onClick={() => go(`/offer/juspay?stage=negotiation&story=${story}`)}>Prepare recruiter clarification</button><p className="fine-print">Prototype simulation—no real employee was contacted.</p></section> : <section className="employee-connect page-pad"><div className="employee-intro"><span className="anonymous-avatar"><Users size={25} /></span><Pill tone="soft">MEDIATED · ANONYMOUS</Pill><h1>Ask someone who knows the team.</h1><p>North found a verified employee with context close to yours.</p></div><div className="employee-profile recommended"><span className="anonymous-avatar small"><UserRoundCheck size={20} /></span><span><strong>{offerDecision.anonymousEmployee.title}</strong><small>{offerDecision.anonymousEmployee.tenure} · {offerDecision.anonymousEmployee.context}</small></span><Pill tone="success">BEST MATCH</Pill></div><label className="offer-question employee-question"><span>Your anonymous question</span><textarea value={question} onChange={(event) => setQuestion(event.target.value)} /></label><div className="privacy-list"><div><ShieldCheck size={17} /><span><strong>Your name stays private</strong><small>Your profile and résumé are never shared.</small></span></div><div><UserRoundCheck size={17} /><span><strong>The employee is verified</strong><small>Their name and contact details stay private too.</small></span></div></div>{reviewing ? <div className="request-review"><Pill tone="attention">REVIEW BEFORE REQUESTING</Pill><h2>Ready to ask anonymously?</h2><p>“{question}”</p><button className="primary-button" onClick={send}><Send size={17} /> Send simulated request</button><button className="text-button" onClick={() => setReviewing(false)}>Edit question</button><small>Prototype simulation—no employee will be contacted.</small></div> : <button className="primary-button" disabled={!question.trim()} onClick={() => setReviewing(true)}>Review anonymous request <ArrowRight size={17} /></button>}</section>}
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
  return <main id="main-content" className="negotiation-screen screen"><Topbar back={`/offer/juspay?stage=decision&story=${story}`} title="Negotiation plan" eyebrow="JUSPAY OFFER" /><section className="page-pad negotiation-content"><div className="negotiation-hero"><Pill tone="success">NEGOTIATION POWER · STRONG</Pill><h1>Ask confidently—without overreaching.</h1><p>Every recommendation below is tied to the offer, market, or your confirmed evidence.</p></div><div className="negotiation-options">{options.map(([id,title,detail]) => <button key={id} className={selected.includes(id) ? 'selected' : ''} onClick={() => toggle(id)}><span>{selected.includes(id) ? <Check size={15} /> : null}</span><span><strong>{title}</strong><small>{detail}</small></span></button>)}</div><div className="negotiation-rationale"><span className="eyebrow">WHY THIS IS REASONABLE</span><div><Check size={15} /> Role range reaches ₹30L</div><div><Check size={15} /> Confirmed payments-system experience</div><div><Check size={15} /> Offer requires relocation</div></div><label className="message-box negotiation-box"><span>Draft to recruiter <Pill tone="soft">Not sent</Pill></span><textarea name="negotiation-draft" autoComplete="off" value={message} onChange={(event) => setMessage(event.target.value)} /></label><div className="honesty-note"><ShieldCheck size={17} /><p>Review and send from your own email. North will never negotiate or accept an offer without you.</p></div><button className="primary-button" aria-live="polite" onClick={copyDraft}>{copied ? <><Check size={17} /> Copied—ready for review</> : <><Copy size={17} /> Copy reviewed response</>}</button><button className="secondary-button" onClick={() => go(`/offer/juspay?stage=decision&story=${story}`)}>Back to offer insights</button></section></main>
}

export default App
