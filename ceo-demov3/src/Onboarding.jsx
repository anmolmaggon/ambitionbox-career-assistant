import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, Award, BriefcaseBusiness, Building2, Check, CheckCircle2,
  ChevronDown, ChevronRight, CircleUserRound, Code2, Factory, FileCheck2, FileText, GraduationCap,
  IndianRupee, Info, Laptop, Layers3, Mail, MapPin, Package, Pencil, Plus, ShieldCheck,
  Search, Sparkles, Target, UserRoundCheck, X,
} from 'lucide-react'
import {
  candidate, onboardingPreferences as canonicalPreferences,
  onboardingProfile as canonicalProfile, trackerStats,
} from './data'
import { useJourney } from './store'
import { BottomNav } from './AppUI'

const spring = { type: 'spring', stiffness: 330, damping: 30 }

function navigate(path) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0, behavior: 'instant' })
}

function OnboardingLogo({ compact = false }) {
  return <div className={`onboarding-brand ${compact ? 'is-compact' : ''}`} aria-label="AmbitionBox"><img src="/favicon.svg" alt="" /><span>Ambition<span>Box</span></span></div>
}

const onboardingProgressPlans = {
  imported: [
    { id: 'profile', label: 'Build profile' },
    { id: 'review', label: 'Review profile' },
    { id: 'preferences', label: 'Job preferences' },
    { id: 'applications', label: 'Application tracking' },
  ],
  manual: [
    { id: 'manual-role', label: 'Current role' },
    { id: 'manual-experience', label: 'Experience' },
    { id: 'manual-location', label: 'Location' },
    { id: 'manual-pay', label: 'Compensation' },
    { id: 'manual-skills', label: 'Skills' },
    { id: 'review', label: 'Review profile' },
    { id: 'preferences', label: 'Job preferences' },
    { id: 'applications', label: 'Application tracking' },
  ],
}

function FlowHeader({ plan, stage, onBack, onClose, onSkip, label = 'Setting up AmbitionBox' }) {
  const steps = plan ? onboardingProgressPlans[plan] : null
  const currentMarker = steps ? Math.max(0, steps.findIndex((item) => item.id === stage)) : -1
  const currentStep = steps?.[currentMarker]
  return <header className={`onboarding-flow-header ${onSkip ? 'has-end-action' : ''}`} aria-label={label}>
    {onBack ? <button onClick={onBack} aria-label="Go back"><ArrowLeft size={21} /></button> : <span className="flow-header-spacer" />}
    {steps ? <div
      className="onboarding-progress"
      role="progressbar"
      aria-label={`${currentStep.label}, step ${currentMarker + 1} of ${steps.length}`}
      aria-valuemin="1"
      aria-valuemax={steps.length}
      aria-valuenow={currentMarker + 1}
      data-progress-plan={plan}
    >{steps.map((item, index) => <i aria-hidden="true" className={index < currentMarker ? 'is-complete' : index === currentMarker ? 'is-current' : ''} key={item.id} />)}</div> : <span className="flow-header-context">{label}</span>}
    {onSkip
      ? <button className="flow-header-skip" onClick={onSkip}>Skip</button>
      : onClose
        ? <button className="flow-header-close" onClick={onClose} aria-label="Close setup"><X size={20} /></button>
        : <span className="flow-header-spacer" />}
  </header>
}

function FlowSheet({ label, onClose, children }) {
  return <motion.div className="onboarding-sheet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <motion.section className="onboarding-sheet" role="dialog" aria-modal="true" aria-label={label} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={spring}>
      <span className="onboarding-sheet-handle" />
      {onClose && <button className="onboarding-sheet-close" onClick={onClose} aria-label="Close"><X size={19} /></button>}
      {children}
    </motion.section>
  </motion.div>
}

function BrandOpening({ onDone, hold = false }) {
  const reducedMotion = useReducedMotion()
  const [leaving, setLeaving] = useState(false)
  useEffect(() => {
    if (hold) return undefined
    if (reducedMotion) {
      const timer = setTimeout(onDone, 80)
      return () => clearTimeout(timer)
    }
    const leaveTimer = setTimeout(() => setLeaving(true), 620)
    const doneTimer = setTimeout(onDone, 960)
    return () => { clearTimeout(leaveTimer); clearTimeout(doneTimer) }
  }, [hold, onDone, reducedMotion])
  return <main className="onboarding-splash" id="main-content"><motion.div
    initial={{ opacity: 0, scale: reducedMotion ? 1 : .92 }}
    animate={leaving ? { opacity: 1, scale: .72, y: '-45vh' } : { opacity: 1, scale: 1, y: 0 }}
    transition={leaving ? { duration: .32, ease: [0.22, 1, 0.36, 1] } : { duration: reducedMotion ? 0 : .42, ease: [0.22, 1, 0.36, 1] }}
  ><OnboardingLogo /></motion.div></main>
}

const firstOpenBenefits = [
  { icon: Target, tone: 'sky', text: 'See the roles worth your time' },
  { icon: ShieldCheck, tone: 'amber', text: 'Know the pay, culture, and reality inside' },
  { icon: FileCheck2, tone: 'violet', text: 'Get guidance from résumé to negotiation' },
]

function GoogleMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.87h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.35Z" />
    <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.42l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.76-5.6-4.13H3.05v2.59A10 10 0 0 0 12 22Z" />
    <path fill="#FBBC05" d="M6.4 13.9A6 6 0 0 1 6.09 12c0-.66.11-1.3.31-1.9V7.51H3.05A10 10 0 0 0 2 12c0 1.61.39 3.14 1.05 4.49L6.4 13.9Z" />
    <path fill="#EA4335" d="M12 5.97c1.47 0 2.79.51 3.82 1.5l2.87-2.87A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.95 5.51L6.4 10.1C7.19 7.73 9.4 5.97 12 5.97Z" />
  </svg>
}

function GmailMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M3.7 19.5H7V9.1L2.3 5.6v12.2c0 .94.64 1.7 1.4 1.7Z" />
    <path fill="#34A853" d="M17 19.5h3.3c.77 0 1.4-.76 1.4-1.7V5.6L17 9.1v10.4Z" />
    <path fill="#EA4335" d="M17 9.1 12 12.85 7 9.1 6.5 5.25 12 9.37l5.5-4.12L17 9.1Z" />
    <path fill="#FBBC04" d="M21.7 5.6v-.85c0-2.1-1.97-3.3-3.45-2.18L17.5 3.13 17 9.1l4.7-3.5Z" />
    <path fill="#C5221F" d="m2.3 5.6 4.7 3.5V3.13l-.75-.56C4.77 1.46 2.3 2.65 2.3 4.75v.85Z" />
  </svg>
}

function AppleMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.32.03-1.75-.79-3.27-.79-1.53 0-2 .77-3.25.82-1.3.05-2.3-1.32-3.14-2.53C4.29 17 2.98 12.45 4.73 9.39A4.87 4.87 0 0 1 8.85 6.88c1.28-.02 2.49.87 3.27.87.77 0 2.22-1.07 3.74-.91.64.03 2.43.26 3.58 1.94-.09.06-2.14 1.26-2.12 3.75.03 2.98 2.62 3.97 2.65 3.98-.02.07-.41 1.42-1.36 2.82M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11Z" /></svg>
}

function FirstOpenScreen({ onAuth }) {
  const reducedMotion = useReducedMotion()
  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: reducedMotion ? 0 : 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reducedMotion ? 0 : .38, delay: reducedMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  })
  return <main className="first-open-screen" id="main-content">
    <motion.section className="first-open-pitch" {...reveal(0)}>
      <header><OnboardingLogo /></header>
      <div className="first-open-hero">
        <h1>A smarter job search with AmbitionBox</h1>
        <ul>
          <motion.i className="first-open-flow-line" aria-hidden="true" initial={reducedMotion ? false : { scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ duration: reducedMotion ? 0 : .72, delay: reducedMotion ? 0 : .12, ease: [0.22, 1, 0.36, 1] }} />
          {firstOpenBenefits.map(({ icon: Icon, tone, text }, index) => <motion.li
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : .42, delay: reducedMotion ? 0 : .14 + (index * .17), ease: [0.22, 1, 0.36, 1] }}
            key={text}
          ><motion.span className={`is-${tone}`} initial={reducedMotion ? false : { scale: .78 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 360, damping: 24, delay: reducedMotion ? 0 : .14 + (index * .17) }}><Icon size={21} /></motion.span><strong>{text}</strong></motion.li>)}
        </ul>
      </div>
    </motion.section>
    <motion.footer className="first-open-auth" {...reveal(.13)}>
      <section className="detected-naukri-card" aria-label="Recognised Naukri profile">
        <div className="detected-naukri-profile"><span>{candidate.initials}</span><span><strong>{candidate.name}</strong><small>{candidate.email}</small></span></div>
        <button className="detected-naukri-button" onClick={() => onAuth('naukri')}><span className="auth-mark naukri"><img src="/naukri-symbol.png" alt="" /></span><strong>Continue with Naukri</strong><ChevronRight size={18} /></button>
        <p className="detected-naukri-autofill"><span aria-hidden="true">⚡</span><strong>Autofill your profile, résumé, and preferences.</strong></p>
      </section>
      <div className="first-open-divider"><span>Or continue with</span></div>
      <div className="first-open-alternatives">
        <button onClick={() => onAuth('google')} aria-label="Continue with Google"><span className="auth-mark google"><GoogleMark /></span><strong>Continue with Google</strong></button>
        <button onClick={() => onAuth('apple')} aria-label="Continue with Apple"><span className="auth-mark apple"><AppleMark /></span><strong>Continue with Apple</strong></button>
      </div>
      <p className="first-open-legal">By continuing, you agree to our <u>Terms of use</u> and <u>Privacy policy</u>.</p>
    </motion.footer>
  </main>
}

function ImportingProfile({ source, onDone, onBack, hold = false }) {
  const [active, setActive] = useState(0)
  const steps = source === 'resume' ? ['Reading your résumé', 'Finding role and skills', 'Building your starting profile'] : ['Bringing your profile', 'Adding your résumé', 'Adding job preferences']
  useEffect(() => {
    const interval = setInterval(() => setActive((value) => Math.min(value + 1, steps.length - 1)), 900)
    const timer = hold ? null : setTimeout(onDone, 3100)
    return () => { clearInterval(interval); clearTimeout(timer) }
  }, [hold, onDone, steps.length])
  return <main className="onboarding-flow onboarding-import" id="main-content">
    <FlowHeader plan="imported" stage="profile" onBack={onBack} onClose={onBack} label="Setting up AmbitionBox" />
    <section>
      <div className="import-transfer-hero">
        <div className="import-transfer" aria-label={source === 'resume' ? 'Résumé moving into AmbitionBox' : 'Naukri profile moving into AmbitionBox'}>
          <div className={`import-endpoint ${source === 'resume' ? 'resume' : 'naukri'}`}><span>{source === 'resume' ? <FileCheck2 size={27} /> : <img src="/naukri-symbol.png" alt="" />}</span><small>{source === 'resume' ? 'Résumé' : 'Naukri'}</small></div>
          <div className="import-transfer-track" aria-hidden="true"><i /></div>
          <div className="import-endpoint ambitionbox"><span><img src="/favicon.svg" alt="" /></span><small>AmbitionBox</small></div>
        </div>
        <h1>{source === 'resume' ? 'Building your profile from your résumé' : 'Bringing your Naukri profile to AmbitionBox'}</h1>
      </div>
      <div className="import-progress-card">
        <header><span>Import progress</span><strong>Step {active + 1} of {steps.length}</strong></header>
        <div className="import-step-list" aria-live="polite">{steps.map((step, index) => <div className={index < active ? 'is-complete' : index === active ? 'is-current' : ''} key={step}><span>{index < active ? <Check size={13} /> : index === active ? <i /> : null}</span><strong>{step}</strong><small>{index < active ? 'Done' : index === active ? 'In progress' : 'Next'}</small></div>)}</div>
      </div>
    </section>
  </main>
}

function ProfileStart({ provider, onImport, onResume, onManual, onBack }) {
  return <main className="onboarding-flow profile-start" id="main-content">
    <FlowHeader onBack={onBack} label="Choose a starting point" />
    <section className="onboarding-flow-body">
      <div className="context-icon"><CircleUserRound size={25} /></div>
      <h1>Better guidance starts with your real career context.</h1>
      <p>Signed in with {provider === 'apple' ? 'Apple' : 'Google'}. Choose the quickest way to build a profile you can review.</p>
      <div className="profile-source-list">
        <button onClick={onImport}><span className="source-mark naukri">n</span><span><strong>Import from Naukri</strong><small>Profile, résumé, and preferences in one tap</small></span><ChevronRight size={18} /></button>
        <button onClick={onResume}><span className="source-mark"><FileCheck2 size={19} /></span><span><strong>Use my résumé</strong><small>Use Arjun’s demo résumé for this simulation</small></span><ChevronRight size={18} /></button>
        <button onClick={onManual}><span className="source-mark"><Sparkles size={19} /></span><span><strong>Answer a few questions</strong><small>A guided conversation with editable answers</small></span><ChevronRight size={18} /></button>
      </div>
      <p className="simulation-note"><ShieldCheck size={14} /> You review every detail before it shapes recommendations.</p>
    </section>
  </main>
}

const manualQuestions = [
  { id: 'role', title: 'What do you do today?', detail: 'Your current role helps us understand the right level and opportunities.', fields: [['title', 'Current role'], ['company', 'Current company']] },
  { id: 'experience', title: 'How much experience should we account for?', detail: 'We use this to compare roles and salary evidence at the right level.', choices: ['4 years', '5 years', '6 years', '7+ years'], key: 'experience' },
  { id: 'location', title: 'Where are you based?', detail: 'Hometown is optional and used only when you ask about a move.', fields: [['location', 'Current city'], ['hometown', 'Hometown · optional']] },
  { id: 'pay', title: 'What is your current compensation?', detail: 'Optional. It makes salary comparisons more useful and stays under your control.', fields: [['currentPay', 'Current compensation · optional']] },
  { id: 'skills', title: 'Which skills should your next role value?', detail: 'Choose what you can genuinely stand behind. You can edit this later.', skills: true },
]

function ManualProfile({ initial, onDone, onBack }) {
  const [index, setIndex] = useState(0)
  const [draft, setDraft] = useState(initial)
  const question = manualQuestions[index]
  const toggleSkill = (skill) => setDraft((current) => ({ ...current, skills: current.skills.includes(skill) ? current.skills.filter((item) => item !== skill) : [...current.skills, skill] }))
  const next = () => { if (index === manualQuestions.length - 1) onDone(draft); else setIndex(index + 1) }
  return <main className="onboarding-flow manual-profile" id="main-content">
    <FlowHeader plan="manual" stage={`manual-${question.id}`} onBack={index ? () => setIndex(index - 1) : onBack} />
    <section className="onboarding-flow-body">
      <div className="answer-memory"><span>Signed in</span>{index > 0 && <span>{draft.title}</span>}{index > 1 && <span>{draft.experience}</span>}{index > 2 && <span>{draft.location}</span>}</div>
      <div className="assistant-question"><span><Sparkles size={16} /></span><h1>{question.title}</h1><p>{question.detail}</p></div>
      {question.fields && <div className="guided-fields">{question.fields.map(([key, label]) => <label key={key}><span>{label}</span><input name={key} autoComplete={{ title: 'organization-title', company: 'organization', location: 'address-level2', hometown: 'address-level2', currentPay: 'off' }[key] || 'off'} value={draft[key] || ''} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} /></label>)}</div>}
      {question.choices && <div className="guided-choices">{question.choices.map((choice) => <button className={draft[question.key] === choice ? 'is-selected' : ''} onClick={() => setDraft({ ...draft, [question.key]: choice })} key={choice}>{choice}</button>)}</div>}
      {question.skills && <div className="guided-choices guided-skills">{['Java', 'Kafka', 'Distributed systems', 'Payments', 'AWS'].map((skill) => <button className={draft.skills.includes(skill) ? 'is-selected' : ''} onClick={() => toggleSkill(skill)} key={skill}>{draft.skills.includes(skill) && <Check size={13} />} {skill}</button>)}</div>}
      <button className="primary-button onboarding-continue" onClick={next}>{index === manualQuestions.length - 1 ? 'Review my profile' : 'Continue'} <ArrowRight size={17} /></button>
      {question.id === 'pay' && <button className="text-button onboarding-skip-question" onClick={next}>Skip for now</button>}
    </section>
  </main>
}

function ProfileEditSheet({ field, value, onSave, onClose }) {
  const [nextValue, setNextValue] = useState(Array.isArray(value) ? value.join(', ') : value)
  const label = field === 'titleCompany' ? 'Role and company' : field === 'skills' ? 'Skills' : field
  return <FlowSheet label={`Edit ${label}`} onClose={onClose}><h2>Edit {label}</h2><p>Keep this accurate. AmbitionBox will use it across recommendations.</p><label className="sheet-edit-field"><span>{label}</span><input autoFocus name={`edit-${field}`} autoComplete="off" value={nextValue} onChange={(event) => setNextValue(event.target.value)} /></label><button className="primary-button" onClick={() => onSave(nextValue)}>Save changes</button></FlowSheet>
}

const richProfileSectionLabels = {
  about: 'Profile summary',
  professional: 'Professional details',
  experience: 'Experience',
  skills: 'Skills',
  education: 'Education',
  recognition: 'Recognition and projects',
  resume: 'Latest résumé',
}

function RichProfileEditSheet({ section, value, onSave, onClose }) {
  const [next, setNext] = useState(() => JSON.parse(JSON.stringify(value)))
  const setField = (field, fieldValue) => setNext((current) => ({ ...current, [field]: fieldValue }))
  const setListField = (list, index, field, fieldValue) => setNext((current) => ({
    ...current,
    [list]: current[list].map((item, itemIndex) => itemIndex === index ? { ...item, [field]: fieldValue } : item),
  }))
  const save = () => {
    const synced = section === 'professional' && next.employmentHistory?.length
      ? { ...next, employmentHistory: next.employmentHistory.map((item, index) => index === 0 ? { ...item, role: next.title, company: next.company } : item) }
      : next
    onSave(synced)
  }
  const field = (name, label, options = {}) => <label className="profile-sheet-field" key={name}><span>{label}</span>{options.multiline
    ? <textarea name={`edit-${name}`} value={next[name] || ''} onChange={(event) => setField(name, event.target.value)} />
    : <input name={`edit-${name}`} autoComplete="off" value={next[name] || ''} onChange={(event) => setField(name, event.target.value)} />}</label>
  return <FlowSheet label={`Edit ${richProfileSectionLabels[section]}`} onClose={onClose}>
    <h2>Edit {richProfileSectionLabels[section]}</h2>
    <p>These details came from Naukri. Changes here will be used by AmbitionBox.</p>
    <div className="profile-sheet-fields">
      {section === 'about' && <>{field('name', 'Name')}{field('profileHeadline', 'Profile headline')}{field('profileSummary', 'Profile summary', { multiline: true })}</>}
      {section === 'professional' && <>{field('title', 'Current role')}{field('company', 'Current employer')}{field('experience', 'Total experience')}{field('location', 'Current location')}{field('currentPay', 'Current compensation')}{field('noticePeriod', 'Notice period')}{field('industry', 'Industry')}{field('department', 'Department')}</>}
      {section === 'experience' && next.employmentHistory.map((item, index) => <fieldset className="profile-sheet-group" key={`${item.company}-${index}`}><legend>{index === 0 ? 'Current role' : `Previous role ${index}`}</legend>{['role', 'company', 'period', 'summary'].map((name) => <label className="profile-sheet-field" key={name}><span>{{ role: 'Role', company: 'Company', period: 'Period', summary: 'What you worked on' }[name]}</span>{name === 'summary' ? <textarea value={item[name]} onChange={(event) => setListField('employmentHistory', index, name, event.target.value)} /> : <input value={item[name]} onChange={(event) => setListField('employmentHistory', index, name, event.target.value)} />}</label>)}</fieldset>)}
      {section === 'skills' && <label className="profile-sheet-field"><span>Skills</span><textarea value={next.skills.join(', ')} onChange={(event) => setField('skills', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} /></label>}
      {section === 'education' && next.education.map((item, index) => <fieldset className="profile-sheet-group" key={`${item.institute}-${index}`}><legend>Education {index + 1}</legend>{['degree', 'institute', 'period'].map((name) => <label className="profile-sheet-field" key={name}><span>{{ degree: 'Degree', institute: 'Institute', period: 'Period' }[name]}</span><input value={item[name]} onChange={(event) => setListField('education', index, name, event.target.value)} /></label>)}</fieldset>)}
      {section === 'recognition' && <>
        {next.recognitions.map((item, index) => <fieldset className="profile-sheet-group" key={`${item.title}-${index}`}><legend>Recognition {index + 1}</legend>{['title', 'issuer', 'year'].map((name) => <label className="profile-sheet-field" key={name}><span>{{ title: 'Title', issuer: 'Issuer', year: 'Year' }[name]}</span><input value={item[name]} onChange={(event) => setListField('recognitions', index, name, event.target.value)} /></label>)}</fieldset>)}
        {next.projects.map((item, index) => <fieldset className="profile-sheet-group" key={`${item.title}-${index}`}><legend>Project {index + 1}</legend>{['title', 'detail'].map((name) => <label className="profile-sheet-field" key={name}><span>{name === 'title' ? 'Project name' : 'Project detail'}</span>{name === 'detail' ? <textarea value={item[name]} onChange={(event) => setListField('projects', index, name, event.target.value)} /> : <input value={item[name]} onChange={(event) => setListField('projects', index, name, event.target.value)} />}</label>)}</fieldset>)}
      </>}
      {section === 'resume' && <>{field('resume', 'Résumé file')}{field('resumeFreshness', 'Last updated')}</>}
    </div>
    <button className="primary-button" onClick={save}>Save changes</button>
  </FlowSheet>
}

function NaukriProfileSection({ icon: Icon, tone, title, summary, missing, onMissing, expanded, onToggle, onEdit, children }) {
  return <section className={`profile-detail-section ${expanded ? 'is-expanded' : ''}`}>
    <button className="profile-detail-toggle" onClick={onToggle} aria-expanded={expanded}>
      <span className={`profile-detail-icon is-${tone}`}><Icon size={17} /></span>
      <span><strong>{title}</strong><small>{summary}</small></span>
      <ChevronDown size={17} />
    </button>
    {missing && <button className="profile-detail-missing" onClick={onMissing} aria-label={`Add ${missing.label.toLowerCase()}`}>
      <span><strong>{missing.label}</strong><small>{missing.detail}</small></span><b>{missing.action}</b>
    </button>}
    {expanded && <div className="profile-detail-expanded">
      {children}
      <button className="profile-detail-edit" onClick={onEdit}><Pencil size={14} /> Edit {title.toLowerCase()}</button>
    </div>}
  </section>
}

function ProfileReview({ draft, source, onChange, onContinue, onBack }) {
  const [editing, setEditing] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const editValue = editing === 'titleCompany' ? `${draft.title} at ${draft.company}` : draft[editing]
  const save = (value) => {
    if (editing === 'titleCompany') {
      const [title, company = draft.company] = value.split(/\s+at\s+/i)
      onChange({ ...draft, title: title.trim(), company: company.trim() })
    } else if (editing === 'skills') onChange({ ...draft, skills: value.split(',').map((item) => item.trim()).filter(Boolean) })
    else onChange({ ...draft, [editing]: value })
    setEditing(null)
  }
  if (source === 'naukri') {
    const toggleSection = (section) => setExpanded((current) => current === section ? null : section)
    const openEditor = (section) => setEditing(section)
    return <main className="onboarding-flow profile-review profile-review-rich" id="main-content">
      <FlowHeader plan="imported" stage="review" onBack={onBack} />
      <section className="onboarding-flow-body">
        <h1>Review your profile.</h1>
        <p>Review what we brought from Naukri—it powers better matches, gap checks, and guidance tailored to you.</p>

        <section className="profile-review-surface profile-review-complete">
          <section className="profile-transfer-receipt" aria-label="Naukri autofill summary">
            <header><span className="profile-transfer-brands" role="img" aria-label="AmbitionBox and Naukri"><img src="/favicon.svg" alt="" /><b>×</b><img src="/naukri-symbol.png" alt="" /></span><div><strong>Your profile, autofilled in seconds</strong><small>From Naukri · {draft.profileFreshness}</small></div></header>
          </section>
          <div className="profile-review-person profile-review-about">
            <span>AM</span>
            <div><strong>{draft.name}</strong><small>{draft.title} at {draft.company}</small></div>
          </div>
          <div className="profile-detail-list">
            <NaukriProfileSection icon={FileText} tone="indigo" title="Profile summary" summary={draft.profileHeadline} expanded={expanded === 'summary'} onToggle={() => toggleSection('summary')} onEdit={() => openEditor('about')}>
              <div className="profile-summary-detail"><p>{draft.profileSummary}</p><span>{draft.profileHeadline}</span></div>
            </NaukriProfileSection>

            <NaukriProfileSection icon={Building2} tone="blue" title="Professional details" summary={`${draft.experience}, ${draft.location}, ${draft.currentPay}`} missing={!draft.noticePeriod ? { label: 'Notice period', detail: 'Not added on Naukri', action: 'Add' } : null} onMissing={() => openEditor('professional')} expanded={expanded === 'professional'} onToggle={() => toggleSection('professional')} onEdit={() => openEditor('professional')}>
              <dl className="profile-professional-grid">
                <div><dt>Current role</dt><dd>{draft.title}</dd></div>
                <div><dt>Employer</dt><dd>{draft.company}</dd></div>
                <div><dt>Industry</dt><dd>{draft.industry}</dd></div>
                <div><dt>Department</dt><dd>{draft.department}</dd></div>
                {draft.noticePeriod && <div><dt>Notice period</dt><dd>{draft.noticePeriod}</dd></div>}
                <div><dt>Employment</dt><dd>{draft.employmentType}</dd></div>
              </dl>
            </NaukriProfileSection>

            <NaukriProfileSection icon={BriefcaseBusiness} tone="purple" title="Experience" summary={`${draft.employmentHistory.length} roles across ${draft.experience}`} expanded={expanded === 'experience'} onToggle={() => toggleSection('experience')} onEdit={() => openEditor('experience')}>
              <div className="profile-history">{draft.employmentHistory.map((item) => <article key={`${item.company}-${item.role}`}><i /><div><strong>{item.role}</strong><span>{item.company}</span><small>{item.period}</small><p>{item.summary}</p></div></article>)}</div>
            </NaukriProfileSection>

            <NaukriProfileSection icon={Sparkles} tone="cyan" title="Skills" summary={`${draft.skills.length} skills from your profile and résumé`} expanded={expanded === 'skills'} onToggle={() => toggleSection('skills')} onEdit={() => openEditor('skills')}>
              <div className="profile-skill-list">{draft.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
            </NaukriProfileSection>

            <NaukriProfileSection icon={GraduationCap} tone="green" title="Education" summary={draft.education[0].degree} expanded={expanded === 'education'} onToggle={() => toggleSection('education')} onEdit={() => openEditor('education')}>
              <div className="profile-education-list">{draft.education.map((item) => <article key={`${item.institute}-${item.degree}`}><strong>{item.degree}</strong><span>{item.institute}</span><small>{item.period}</small></article>)}</div>
            </NaukriProfileSection>

            <NaukriProfileSection icon={Award} tone="pink" title="Recognition and projects" summary={`${draft.recognitions.length} recognitions, ${draft.projects.length} project`} expanded={expanded === 'recognition'} onToggle={() => toggleSection('recognition')} onEdit={() => openEditor('recognition')}>
              <div className="profile-recognition-list">{draft.recognitions.map((item) => <article key={item.title}><CheckCircle2 size={15} /><div><strong>{item.title}</strong><span>{item.issuer}, {item.year}</span></div></article>)}{draft.projects.map((item) => <article key={item.title}><BriefcaseBusiness size={15} /><div><strong>{item.title}</strong><span>{item.detail}</span></div></article>)}</div>
            </NaukriProfileSection>

            <NaukriProfileSection icon={FileCheck2} tone="orange" title="Latest résumé" summary={`${draft.resume}, ${draft.resumeFreshness.toLowerCase()}`} expanded={expanded === 'resume'} onToggle={() => toggleSection('resume')} onEdit={() => openEditor('resume')}>
              <div className="profile-resume-detail"><FileCheck2 size={20} /><div><strong>{draft.resume}</strong><span>{draft.resumeFreshness}</span></div><CheckCircle2 size={17} /></div>
            </NaukriProfileSection>
          </div>
        </section>

        <div className="profile-review-fixed-action"><button className="primary-button onboarding-continue" onClick={onContinue}>Confirm profile <ArrowRight size={17} /></button></div>
      </section>
      <AnimatePresence>{editing && <RichProfileEditSheet section={editing} value={draft} onSave={(next) => { onChange(next); setEditing(null) }} onClose={() => setEditing(null)} />}</AnimatePresence>
    </main>
  }
  return <main className="onboarding-flow profile-review" id="main-content">
    <FlowHeader plan={source === 'manual' ? 'manual' : 'imported'} stage="review" onBack={onBack} />
    <section className="onboarding-flow-body">
      <h1>Here’s the profile we’ll start with.</h1>
      <p>Review what AmbitionBox will use. Every detail stays editable.</p>
      <div className="profile-review-surface">
        <div className={`profile-review-source is-${source}`}>
          <span>{source === 'naukri' ? <img src="/naukri-symbol.png" alt="" /> : source === 'resume' ? <FileCheck2 size={18} /> : <Check size={17} />}</span>
          <strong>{source === 'naukri' ? 'Imported from Naukri' : source === 'resume' ? 'From demo résumé' : 'Confirmed by you'}</strong>
          <CheckCircle2 size={17} />
        </div>
        <div className="profile-review-person"><span>AM</span><div><strong>{draft.name}</strong><small>{draft.title} at {draft.company}</small></div><button onClick={() => setEditing('titleCompany')} aria-label="Edit current role"><Pencil size={16} /></button></div>
        <div className="profile-review-facts">
          <button onClick={() => setEditing('experience')}><span>Experience</span><strong>{draft.experience}</strong><Pencil size={14} /></button>
          <button onClick={() => setEditing('location')}><span>Current city</span><strong>{draft.location}</strong><Pencil size={14} /></button>
          <button onClick={() => setEditing('hometown')}><span>Hometown</span><strong>{draft.hometown || 'Not added'}</strong><Pencil size={14} /></button>
          <button onClick={() => setEditing('currentPay')}><span>Current compensation</span><strong>{draft.currentPay || 'Not added'}</strong><Pencil size={14} /></button>
        </div>
        <button className="profile-review-skills" onClick={() => setEditing('skills')}><span><small>Skills</small><strong>{draft.skills.join(' · ')}</strong></span><Pencil size={14} /></button>
        {source !== 'manual' && <div className="profile-review-resume"><FileCheck2 size={17} /><span><strong>{draft.resume}</strong><small>{draft.resumeFreshness}</small></span><CheckCircle2 size={16} /></div>}
      </div>
      <button className="primary-button onboarding-continue" onClick={onContinue}>Review job preferences <ArrowRight size={17} /></button>
    </section>
    <AnimatePresence>{editing && <ProfileEditSheet field={editing} value={editValue} onSave={save} onClose={() => setEditing(null)} />}</AnimatePresence>
  </main>
}

function PreferencesScreen({ initial, profileSource, onDone, onBack }) {
  const [draft, setDraft] = useState(initial)
  const [editing, setEditing] = useState(null)
  const toggle = (key, value) => setDraft((current) => ({ ...current, [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value] }))
  if (profileSource === 'naukri') {
    const importedPreferences = [
      { key: 'targetRole', label: 'Target role', value: draft.targetRole, icon: Target, tone: 'blue' },
      { key: 'targetPay', label: 'Minimum compensation', value: draft.targetPay, icon: IndianRupee, tone: 'green' },
      { key: 'locations', label: 'Preferred locations', value: draft.locations.join(' · '), icon: MapPin, tone: 'pink' },
      { key: 'workModes', label: 'Work mode', value: draft.workModes.join(' · '), icon: Laptop, tone: 'purple' },
      { key: 'employmentType', label: 'Employment type', value: draft.employmentType, icon: BriefcaseBusiness, tone: 'orange' },
    ]
    const optionalPreferences = [
      { key: 'preferredCompanies', label: 'Preferred companies', value: draft.preferredCompanies, icon: Building2, tone: 'blue' },
      { key: 'techStacks', label: 'Tech stacks', value: draft.techStacks, icon: Code2, tone: 'cyan' },
      { key: 'roleLevels', label: 'Role level', value: draft.roleLevels, icon: Layers3, tone: 'purple' },
      { key: 'industries', label: 'Industries', value: draft.industries, icon: Factory, tone: 'green' },
    ]
    return <main className="onboarding-flow preferences-screen preference-review-screen" id="main-content">
      <FlowHeader plan="imported" stage="preferences" onBack={onBack} />
      <section className="onboarding-flow-body">
        <h1>Let’s make sure the right jobs rise first.</h1>
        <p>These preferences shape what rises first—not what you can explore or apply to.</p>

        <section className="preference-review-surface" aria-label="Imported job preferences">
          <header className="preference-source-header">
            <span className="profile-transfer-brands" role="img" aria-label="AmbitionBox and Naukri"><img src="/favicon.svg" alt="" /><b>×</b><img src="/naukri-symbol.png" alt="" /></span>
            <span><strong>Your job preferences from Naukri</strong><small>Review or change them anytime</small></span>
          </header>
          <div className="preference-review-list">
            {importedPreferences.map(({ key, label, value, icon: Icon, tone }) => <button type="button" onClick={() => setEditing(key)} aria-label={`Edit ${label}, ${value}`} key={key}>
              <span className={`preference-review-icon is-${tone}`}><Icon size={18} /></span>
              <span><small>{label}</small><strong>{value}</strong></span>
              <Pencil size={16} />
            </button>)}
          </div>
          <section className="preference-optional-group" aria-labelledby="optional-preferences-title">
            <header><strong id="optional-preferences-title">Add more signal</strong><small>Optional · only if it matters to you</small></header>
            <div className="preference-review-list">
              {optionalPreferences.map(({ key, label, value, icon: Icon, tone }) => {
                const displayValue = value.length ? value.join(' · ') : 'Not added'
                return <button className={!value.length ? 'is-empty' : ''} type="button" onClick={() => setEditing(key)} aria-label={`${value.length ? 'Edit' : 'Add'} ${label}, ${displayValue}`} key={key}>
                  <span className={`preference-review-icon is-${tone}`}><Icon size={18} /></span>
                  <span><small>{label}</small><strong>{displayValue}</strong></span>
                  {value.length ? <Pencil size={16} /> : <Plus size={17} />}
                </button>
              })}
            </div>
          </section>
        </section>

        <div className="preference-review-fixed-action"><button className="primary-button onboarding-continue" onClick={() => onDone(draft)}>Confirm preferences <ArrowRight size={17} /></button></div>
      </section>
      <AnimatePresence>{editing && <PreferenceEditSheet field={editing} value={draft[editing]} onSave={(nextValue) => { setDraft((current) => ({ ...current, [editing]: nextValue })); setEditing(null) }} onClose={() => setEditing(null)} />}</AnimatePresence>
    </main>
  }
  return <main className="onboarding-flow preferences-screen" id="main-content">
    <FlowHeader plan={profileSource === 'manual' ? 'manual' : 'imported'} stage="preferences" onBack={onBack} />
    <section className="onboarding-flow-body">
      <span className="onboarding-source-receipt">Your preferences</span>
      <h1>What should a great next move look like?</h1>
      <p>These shape ranking, not eligibility. You can change them anytime.</p>
      <div className="preference-form">
        <label><span>Target role</span><input name="targetRole" autoComplete="organization-title" value={draft.targetRole} onChange={(event) => setDraft({ ...draft, targetRole: event.target.value })} /></label>
        <label><span>Minimum target compensation</span><input name="targetPay" autoComplete="off" value={draft.targetPay} onChange={(event) => setDraft({ ...draft, targetPay: event.target.value })} /></label>
        <fieldset><legend>Preferred locations</legend><div className="guided-choices">{['Pune', 'Bengaluru', 'Remote'].map((item) => <button type="button" className={draft.locations.includes(item) ? 'is-selected' : ''} onClick={() => toggle('locations', item)} key={item}>{draft.locations.includes(item) && <Check size={13} />} {item}</button>)}</div></fieldset>
        <fieldset><legend>Work mode</legend><div className="guided-choices">{['Remote', 'Hybrid', 'Office'].map((item) => <button type="button" className={draft.workModes.includes(item) ? 'is-selected' : ''} onClick={() => toggle('workModes', item)} key={item}>{draft.workModes.includes(item) && <Check size={13} />} {item}</button>)}</div></fieldset>
        <label><span>Employment type</span><input name="employmentType" autoComplete="off" value={draft.employmentType} onChange={(event) => setDraft({ ...draft, employmentType: event.target.value })} /></label>
      </div>
      <button className="primary-button onboarding-continue" onClick={() => onDone(draft)}>Confirm and continue <ArrowRight size={17} /></button>
    </section>
  </main>
}

const preferenceEditOptions = {
  locations: ['Pune', 'Bengaluru', 'Mumbai', 'Hyderabad', 'Remote'],
  workModes: ['Remote', 'Hybrid', 'Office'],
  employmentType: ['Full time', 'Contract', 'Internship'],
  preferredCompanies: ['PhonePe', 'Juspay', 'Atlassian', 'Groww', 'Flipkart'],
  techStacks: ['Java', 'Kafka', 'AWS', 'Kubernetes', 'Go'],
  roleLevels: ['Senior', 'Lead', 'Staff', 'Engineering Manager'],
  industries: ['Fintech', 'Payments', 'SaaS', 'E-commerce', 'Consumer Internet'],
}

const preferenceEditLabels = {
  targetRole: 'Target role',
  targetPay: 'Minimum compensation',
  locations: 'Preferred locations',
  workModes: 'Work mode',
  employmentType: 'Employment type',
  preferredCompanies: 'Preferred companies',
  techStacks: 'Tech stacks',
  roleLevels: 'Role level',
  industries: 'Industries',
}

function PreferenceEditSheet({ field, value, onSave, onClose }) {
  const [nextValue, setNextValue] = useState(value)
  const options = preferenceEditOptions[field]
  const isMultiple = Array.isArray(value)
  const isOptional = ['preferredCompanies', 'techStacks', 'roleLevels', 'industries'].includes(field)
  const action = isOptional && value.length === 0 ? 'Add' : 'Edit'
  const choose = (option) => {
    if (isMultiple) setNextValue((current) => current.includes(option) ? current.filter((item) => item !== option) : [...current, option])
    else setNextValue(option)
  }
  return <FlowSheet label={`${action} ${preferenceEditLabels[field]}`} onClose={onClose}>
    <h2>{action} {preferenceEditLabels[field]}</h2>
    <p>{isOptional ? 'Add only what should sharpen your matches. You can leave this empty.' : 'AmbitionBox uses this to decide which roles should rise first.'}</p>
    {options ? <fieldset className="preference-sheet-options">
      <legend>{isMultiple ? 'Choose all that apply' : 'Choose one'}</legend>
      <div>{options.map((option) => {
        const selected = isMultiple ? nextValue.includes(option) : nextValue === option
        return <button type="button" className={selected ? 'is-selected' : ''} aria-pressed={selected} onClick={() => choose(option)} key={option}>{selected && <Check size={14} />} {option}</button>
      })}</div>
    </fieldset> : <label className="profile-sheet-field preference-sheet-field"><span>{preferenceEditLabels[field]}</span><input autoFocus name={`edit-${field}`} autoComplete={field === 'targetRole' ? 'organization-title' : 'off'} value={nextValue} onChange={(event) => setNextValue(event.target.value)} /></label>}
    <button className="primary-button" disabled={Array.isArray(nextValue) ? !isOptional && nextValue.length === 0 : !nextValue.trim()} onClick={() => onSave(nextValue)}>Save changes</button>
  </FlowSheet>
}

const curationMessages = [
  {
    title: 'Curating jobs worth your time.',
    detail: 'Across Naukri, LinkedIn, company career pages, and leading job boards.',
  },
  {
    title: 'Checking what actually fits you.',
    detail: 'Role, pay, location, work mode, and the preferences you just reviewed.',
  },
  {
    title: 'Bringing your strongest matches together.',
    detail: 'So you can focus your time where you have the best shot.',
  },
]

const curationSources = [
  { id: 'naukri', label: 'Naukri' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'companies', label: 'Company sites' },
  { id: 'boards', label: 'Job boards' },
]

function JobCurationTransition({ onDone, hold = false }) {
  const reducedMotion = useReducedMotion()
  const [messageIndex, setMessageIndex] = useState(0)
  useEffect(() => {
    if (hold) return undefined
    if (reducedMotion) {
      const done = setTimeout(onDone, 2600)
      return () => clearTimeout(done)
    }
    const secondMessage = setTimeout(() => setMessageIndex(1), 2200)
    const thirdMessage = setTimeout(() => setMessageIndex(2), 4400)
    const done = setTimeout(onDone, 6600)
    return () => { clearTimeout(secondMessage); clearTimeout(thirdMessage); clearTimeout(done) }
  }, [hold, onDone, reducedMotion])
  const message = reducedMotion
    ? { title: curationMessages[0].title, detail: 'Across Naukri, LinkedIn, company career pages, and job boards, matched against the preferences you just reviewed.' }
    : curationMessages[messageIndex]

  return <motion.main
    className="job-curation-screen"
    id="main-content"
    exit={reducedMotion ? { opacity: 0 } : { y: -84, scale: .86, opacity: .68, borderRadius: 34 }}
    transition={{ duration: reducedMotion ? .18 : .78, ease: [0.22, 1, 0.36, 1] }}
  >
    <section className="job-curation-content">
      <div className="job-curation-copy" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={message.title}
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: reducedMotion ? 0 : .34, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1>{message.title}</h1>
            <p>{message.detail}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="job-curation-network" aria-label="Bringing jobs from multiple sources into AmbitionBox">
        <div className="job-curation-orbit" aria-hidden="true">
          {curationSources.map((source, index) => <span className={`job-source-slot is-${source.id}`} key={source.id}>
            <span className="job-source-upright"><motion.span
              className={`job-source-node is-${source.id}`}
              initial={reducedMotion ? false : { opacity: 0, scale: .86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reducedMotion ? 0 : .34, delay: reducedMotion ? 0 : .12 + (index * .12) }}
            ><strong>{source.label}</strong></motion.span></span>
          </span>)}
          {['north-west', 'north-east', 'south-west', 'south-east'].map((direction, index) => <motion.i
            className={`job-curation-link is-${direction}`}
            initial={reducedMotion ? false : { scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: reducedMotion ? 0 : .42, delay: reducedMotion ? 0 : .24 + (index * .08), ease: [0.22, 1, 0.36, 1] }}
            key={direction}
          />)}
        </div>
        <motion.span className="job-curation-hub" initial={reducedMotion ? false : { opacity: 0, scale: .7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 22, delay: reducedMotion ? 0 : .54 }}><img src="/favicon.svg" alt="" /></motion.span>
      </div>
    </section>
  </motion.main>
}

const emailAssistanceMoments = [
  { icon: Search, tone: 'sky', label: 'Application tracking across every source' },
  { icon: Mail, tone: 'violet', label: 'Smart follow-ups when things go quiet' },
  { icon: BriefcaseBusiness, tone: 'sky', label: 'Recruiter replies handled for you' },
  { icon: Target, tone: 'amber', label: 'Interview prep tailored to the role' },
  { icon: Award, tone: 'green', label: 'Offer analysis with verified pay data' },
  { icon: Sparkles, tone: 'violet', label: 'Negotiation guidance when it counts' },
]

function EmailConnect({ profileSource, onConnect, onSkip, onBack }) {
  const reducedMotion = useReducedMotion()
  return <main className="onboarding-flow email-assistance-screen" id="main-content">
    <FlowHeader plan={profileSource === 'manual' ? 'manual' : 'imported'} stage="applications" onBack={onBack} onSkip={onSkip} />
    <section className="email-assistance-body">
      <motion.div
        className="email-assistance-copy"
        initial={reducedMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0 : .46, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1><em>Connect your inbox.</em> We'll take it from there.</h1>
        <p>The inbox where your job updates already land.</p>
      </motion.div>

      <section className="email-assistance-theatre" aria-label="Unmatched assistance across your job search">
        <ol>{emailAssistanceMoments.map(({ icon: Icon, tone, label }, index) => <motion.li
          initial={reducedMotion ? false : { opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reducedMotion ? 0 : .38, delay: reducedMotion ? 0 : .18 + (index * .12), ease: [0.22, 1, 0.36, 1] }}
          key={label}
        >
          <span className={`is-${tone}`}><Icon size={18} /></span>
          <strong>{label}</strong>
        </motion.li>)}</ol>
      </section>

      <div className="email-connect-actions">
        <button className="primary-button" onClick={() => onConnect('gmail')}><span className="auth-mark gmail"><GmailMark /></span> Connect Gmail</button>
        <button className="secondary-button onboarding-email-secondary" onClick={() => onConnect('other')}><Mail size={17} /> Connect another email</button>
      </div>
      <p className="email-control-note">Read-only access. You’re in control.</p>
    </section>
  </main>
}

function CurationEmailStage({ stage, profileSource, emailProvider, onCurationDone, onConnect, onAccountContinue, onAccountClose, onSkip, onBack, hold }) {
  const reducedMotion = useReducedMotion()
  return <div className="curation-email-stage">
    <AnimatePresence initial={false}>
      {stage === 'curation'
        ? <JobCurationTransition key="curation" onDone={onCurationDone} hold={hold} />
        : <motion.div
            className="email-connect-transition"
            key="email"
            initial={reducedMotion ? { opacity: 0 } : { y: '100%' }}
            animate={reducedMotion ? { opacity: 1 } : { y: 0 }}
            transition={{ duration: reducedMotion ? .18 : .78, ease: [0.22, 1, 0.36, 1] }}
          >
            <EmailConnect profileSource={profileSource} onConnect={onConnect} onSkip={onSkip} onBack={onBack} />
            <AnimatePresence>{emailProvider && <AccountSheet provider={emailProvider} onContinue={onAccountContinue} onClose={onAccountClose} />}</AnimatePresence>
          </motion.div>}
    </AnimatePresence>
  </div>
}

function AccountSheet({ provider, onContinue, onClose }) {
  const gmail = provider === 'gmail'
  return <FlowSheet label={gmail ? 'Connect Gmail' : 'Connect another email'} onClose={onClose}>
    <div className={`sheet-provider-mark ${gmail ? 'gmail' : ''}`}>{gmail ? <GmailMark /> : <Mail size={22} />}</div>
    <h2>{gmail ? 'Choose an account' : 'Connect another email'}</h2>
    <p>Use the inbox where your job updates already land.</p>
    {gmail ? <button className="sheet-account-row" onClick={onContinue}><span>AM</span><span><strong>Arjun Mehta</strong><small>arjun.mehta@gmail.com</small></span><ChevronRight size={18} /></button> : <><button className="sheet-account-row" onClick={onContinue}><span className="outlook">O</span><span><strong>Continue with Outlook</strong><small>Personal or work account</small></span><ChevronRight size={18} /></button><button className="sheet-account-row" onClick={onContinue}><span><Mail size={17} /></span><span><strong>Connect a work email</strong><small>Other supported provider</small></span><ChevronRight size={18} /></button></>}
    <p className="onboarding-trust"><ShieldCheck size={14} /> Read-only scan of the last 90 days.</p>
  </FlowSheet>
}

const scanTasks = [
  { label: 'Looking for roles across all job boards' },
  { label: 'Matching them to your preferences' },
  { label: 'Reading your job mail from the last 90 days' },
  { label: 'Setting up your assistance' },
]

function SecureScan({ onDone, hold = false }) {
  const reducedMotion = useReducedMotion()
  const [progress, setProgress] = useState(6)
  useEffect(() => {
    const interval = setInterval(() => setProgress((value) => Math.min(value + 4, 97)), 300)
    const timer = hold ? null : setTimeout(onDone, 7500)
    return () => { clearInterval(interval); clearTimeout(timer) }
  }, [hold, onDone])
  const active = Math.min(Math.floor(progress / 25), scanTasks.length - 1)
  const sealed = progress > 88
  const { label: activeLabel } = scanTasks[active]
  return <main className="onboarding-secure-scan" id="main-content">
    <section>
      <div className={`scan-box-hero${sealed ? ' is-sealed' : ''}`} aria-hidden="true">
        <span className="scan-box-item is-layers"><Layers3 size={17} /></span>
        <span className="scan-box-item is-file"><FileText size={17} /></span>
        <span className="scan-box-item is-mail"><Mail size={17} /></span>
        <span className="scan-box-item is-sparkle"><Sparkles size={17} /></span>
        <span className="scan-box-core">{sealed ? <Check size={34} strokeWidth={2.5} /> : <Package size={34} />}</span>
      </div>
      <h1>Putting your search together...</h1>
      <div className="scan-task-single" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            className="scan-task-card"
            key={active}
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -16 }}
            transition={{ duration: reducedMotion ? 0 : .32, ease: [0.22, 1, 0.36, 1] }}
          >
            <strong>{activeLabel}</strong>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
    <footer><i role="progressbar" aria-label="Setup progress" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><b style={{ width: `${progress}%` }} /></i></footer>
  </main>
}

export function OnboardingScreen() {
  const { journey, update } = useJourney()
  const params = new URLSearchParams(window.location.search)
  const requested = params.get('step')
  const requestedBranch = params.get('branch')
  const hold = params.get('hold') === '1'
  const requestedEmail = ['gmail', 'other'].includes(params.get('email')) ? params.get('email') : null
  const [step, setStep] = useState(requested || 'brand')
  const [provider, setProvider] = useState(requestedBranch || journey.authProvider || null)
  const [profileSource, setProfileSource] = useState(journey.profileSource || 'naukri')
  const [profile, setProfile] = useState(journey.onboardingProfile || { ...canonicalProfile })
  const [preferences, setPreferences] = useState({ ...canonicalPreferences, ...(journey.onboardingPreferences || {}) })
  const [emailProvider, setEmailProvider] = useState(requestedEmail)

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [step])

  useEffect(() => {
    if (requested || !journey.onboardingComplete) return undefined
    const timer = setTimeout(() => navigate('/home'), 0)
    return () => clearTimeout(timer)
  }, [journey.onboardingComplete, requested])

  const startAuth = (nextProvider) => {
    setProvider(nextProvider)
    update({ authProvider: nextProvider })
    if (nextProvider === 'naukri') {
      setProfileSource('naukri')
      setProfile({ ...canonicalProfile })
      update({ profileSource: 'naukri', onboardingNaukriImported: true })
      setStep('import')
    } else setStep('profile-start')
  }
  const startImport = (source) => {
    setProfileSource(source)
    setProfile({ ...canonicalProfile })
    update({ profileSource: source, onboardingNaukriImported: source === 'naukri' })
    setStep(source === 'resume' ? 'resume-import' : 'import')
  }
  const finishProfile = (nextProfile) => {
    setProfile(nextProfile)
    update({ onboardingProfile: nextProfile, onboardingProfileConfirmed: true, profileSource })
    setStep('preferences')
  }
  const finishPreferences = (nextPreferences) => {
    setPreferences(nextPreferences)
    update({ onboardingPreferences: nextPreferences, onboardingPreferencesConfirmed: true })
    setStep('email')
  }
  const finishScan = () => finishOnboarding(false)
  const finishOnboarding = (emailSkipped = false) => {
    update({
      onboardingComplete: true,
      firstHomeArrival: true,
      emailSkipped,
      emailConnected: !emailSkipped,
      importComplete: !emailSkipped,
    })
    navigate('/home?arrival=first')
  }

  if (!requested && journey.onboardingComplete) return null
  if (step === 'brand') return <BrandOpening onDone={() => setStep('welcome')} hold={hold} />
  if (step === 'welcome' || step === 'education' || step === 'naukri-account') return <FirstOpenScreen onAuth={startAuth} />
  if (step === 'profile-start') return <ProfileStart provider={provider || requestedBranch || 'google'} onImport={() => startImport('naukri')} onResume={() => startImport('resume')} onManual={() => { setProfileSource('manual'); update({ profileSource: 'manual' }); setStep('manual') }} onBack={() => setStep('welcome')} />
  if (step === 'import' || step === 'resume-import') return <ImportingProfile source={step === 'resume-import' ? 'resume' : 'naukri'} onDone={() => setStep('profile-review')} onBack={() => setStep(step === 'import' ? 'welcome' : 'profile-start')} hold={hold} />
  if (step === 'manual') return <ManualProfile initial={profile} onDone={(next) => { setProfile(next); setStep('profile-review') }} onBack={() => setStep('profile-start')} />
  if (step === 'profile-review') return <ProfileReview draft={profile} source={profileSource} onChange={setProfile} onContinue={() => finishProfile(profile)} onBack={() => setStep(provider === 'naukri' ? 'welcome' : 'profile-start')} />
  if (step === 'preferences') return <PreferencesScreen initial={preferences} profileSource={profileSource} onDone={finishPreferences} onBack={() => setStep('profile-review')} />
  if (step === 'curation' || step === 'email-pitch' || step === 'email') return <CurationEmailStage stage={step} profileSource={profileSource} emailProvider={emailProvider} onCurationDone={() => setStep('email')} onConnect={setEmailProvider} onAccountContinue={() => { setEmailProvider(null); setStep('scan') }} onAccountClose={() => setEmailProvider(null)} onSkip={() => finishOnboarding(true)} onBack={() => setStep('preferences')} hold={hold} />
  if (step === 'scan' || step === 'complete') return <SecureScan onDone={finishScan} hold={hold} />
  return <FirstOpenScreen onAuth={startAuth} />
}

export function ProfileScreen() {
  const { journey } = useJourney()
  const profile = journey.onboardingProfile || canonicalProfile
  const preferences = journey.onboardingPreferences || canonicalPreferences
  return <main className="screen profile-memory-screen" id="main-content">
    <header className="profile-memory-header"><OnboardingLogo /><button className="profile-memory-avatar">AM</button></header>
    <section className="profile-memory-hero"><span className="profile-memory-avatar large">AM</span><div><span>Your career context</span><h1>{profile.name}</h1><p>{profile.title} at {profile.company}</p></div></section>
    <section className="profile-memory-section"><h2>What AmbitionBox knows</h2><div className="profile-memory-list"><div><span>Experience</span><strong>{profile.experience}</strong></div><div><span>Current city</span><strong>{profile.location}</strong></div><div><span>Current compensation</span><strong>{profile.currentPay || 'Not added'}</strong></div><div><span>Target compensation</span><strong>{preferences.targetPay}</strong></div></div></section>
    <section className="profile-memory-section"><h2>Your next move</h2><div className="profile-memory-list"><div><span>Target role</span><strong>{preferences.targetRole}</strong></div><div><span>Location</span><strong>{preferences.locations.join(' · ')}</strong></div><div><span>Work mode</span><strong>{preferences.workModes.join(' · ')}</strong></div></div></section>
    <section className="profile-memory-section profile-memory-source"><ShieldCheck size={18} /><span><strong>You stay in control</strong><small>{journey.profileSource === 'naukri' ? 'Profile imported from Naukri and reviewed by you.' : journey.profileSource === 'resume' ? 'Profile created from a demo résumé and reviewed by you.' : 'Profile details confirmed by you.'}</small></span></section>
    {/* The nav is no longer hand-rolled here. The copy referenced an unimported `Home`
        icon and had been blanking this route entirely; sharing AppUI's component is
        what stops the two from diverging again. Profile left the tab bar and is
        reached from the avatar, so no tab is active on this screen. */}
    <BottomNav />
  </main>
}
