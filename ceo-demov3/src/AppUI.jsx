import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, BriefcaseBusiness, ChevronRight, Compass, Home, Send, X,
} from 'lucide-react'
import { candidate } from './data'

const spring = { type: 'spring', stiffness: 330, damping: 30 }

export function go(path) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0, behavior: 'instant' })
}

export function AppLink({ to, children, onNavigate, ...props }) {
  return <a href={to} onClick={(event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onNavigate?.()
    go(to)
  }} {...props}>{children}</a>
}

/*
 * NORTH — the needle.
 *
 * The mark is a compass needle: the north half lit, the south half in brand blue,
 * a pivot punched through the waist. The concept is "the needle settles" — NORTH
 * reads every scattered signal in a job hunt and comes to rest pointing at one
 * thing. That settle is the app's signature motion (see `.needle` in north.css):
 * it plays on the splash and stands in for every thinking state inside a flow.
 *
 * Renamed from AmbitionBox on Pranoy's instruction 2026-09-10. This reverses the
 * standing FEEDBACK.md rule "brand the experience simply as AmbitionBox"; the
 * parent brand survives as the `byline` under the wordmark rather than vanishing.
 */
export function Logo({ small = false, byline = false }) {
  return (
    <div className={`brand ${small ? 'brand--small' : ''}`} aria-label="North">
      <img className="brand-mark" src="/north-mark.svg" alt="" aria-hidden="true" />
      {!small && (
        <span className="brand-word">
          NORTH
          {byline && <small>by AmbitionBox</small>}
        </span>
      )}
    </div>
  )
}

/*
 * The settling needle. `state` is 'settling' while NORTH is working something out
 * and 'settled' once it has. Under reduced motion the needle is simply drawn at
 * rest — the information is "NORTH is thinking", and a caption carries that.
 */
export function Needle({ size = 28, state = 'settled', className = '' }) {
  return (
    <span className={`needle needle--${state} ${className}`} style={{ '--needle-size': `${size}px` }} aria-hidden="true">
      <svg viewBox="0 0 240 240">
        <path d="M120 40 C124 84 131 116 141 137 L99 137 C109 116 116 84 120 40 Z" fill="currentColor" />
        <path className="needle-south" d="M99 137 L141 137 C131 153 124 172 120 197 C116 172 109 153 99 137 Z" />
      </svg>
    </span>
  )
}

export function Avatar() {
  return <button className="avatar" aria-label="Arjun’s profile">{candidate.initials}</button>
}

export function Topbar({ title, back, right, eyebrow }) {
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

/*
 * Three tabs, settled 2026-08-18. Profile left the tab bar and lives behind the
 * header avatar: it is a reference screen, not a returning destination, and the
 * two screens that hold browsable content of their own keep their tabs.
 * Treatment follows MOB-HOME-001 (Cleo) — icons with labels, sitting quietly on
 * the canvas, active expressed as a filled glyph rather than a coloured chip.
 */
export function BottomNav({ active }) {
  const items = [
    { id: 'home', label: 'Home', path: '/home', icon: Home },
    { id: 'tracker', label: 'Tracker', path: '/tracker', icon: BriefcaseBusiness },
    // Labelled Jobs, not Matches: the tab is the roles feed, and "matches" was product
    // vocabulary rather than the user's. The route stays /matches.
    { id: 'matches', label: 'Jobs', path: '/matches', icon: Compass },
  ]
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map(({ id, label, path, icon: Icon }) => (
        <AppLink key={id} className={active === id ? 'is-active' : ''} to={path}>
          <Icon size={21} strokeWidth={active === id ? 2.5 : 2} /><span>{label}</span>
        </AppLink>
      ))}
    </nav>
  )
}

/*
 * The assistant's mark, one glyph everywhere it speaks — the dock pill, the assistant
 * sheet, the job-detail dock. It is the orb from prototype/job-detail-1b.html rather
 * than a sparkle: a sparkle is the generic sign for "an AI did something", which
 * context/UI.md rules out by name, and the orb is this product's own mark.
 */
export function AssistantMark({ className = 'assistant-mark' }) {
  return <img className={className} src="/ai-orb.svg" alt="" aria-hidden="true" />
}

export function useTypewriter(phrases, enabled) {
  const [typed, setTyped] = useState('')
  const [phrase, setPhrase] = useState(0)
  const [erasing, setErasing] = useState(false)

  useEffect(() => {
    if (!enabled) return undefined
    const target = phrases[phrase % phrases.length]
    if (!erasing && typed === target) {
      const hold = setTimeout(() => setErasing(true), 2000)
      return () => clearTimeout(hold)
    }
    if (erasing && typed === '') {
      setErasing(false)
      setPhrase((current) => current + 1)
      return undefined
    }
    const step = setTimeout(
      () => setTyped(erasing ? target.slice(0, typed.length - 1) : target.slice(0, typed.length + 1)),
      erasing ? 20 : 48,
    )
    return () => clearTimeout(step)
  }, [typed, erasing, phrase, enabled, phrases])

  return typed
}

/*
 * The pill types out example questions the way a search field cycles a placeholder. The
 * typed line is the placeholder and is hidden from assistive tech; the button keeps its
 * `label` as the accessible name, which is the contract string a screen reader should
 * hear. Under reduced motion the label is what is drawn, immediately and without a caret.
 */
export function AskPill({ label, examples, reduceMotion, onOpen }) {
  const animate = !reduceMotion && examples?.length
  const typed = useTypewriter(examples || [], Boolean(animate))
  return (
    <button className="home-dock-ask" onClick={onOpen} aria-label={label}>
      <AssistantMark className="home-dock-mark" />
      {animate
        ? <span className="home-dock-typed" aria-hidden="true">{typed}<i /></span>
        : <span aria-hidden="true">{label}</span>}
      <Send size={16} />
    </button>
  )
}

export function PromptChips({ prompts, onAsk, className = 'home-dock-chips' }) {
  if (!prompts?.length) return null
  return (
    <div className={className} aria-label="Suggested questions">
      {prompts.map(({ label, question }) => <button key={label} onClick={() => onAsk(question)}>{label}</button>)}
    </div>
  )
}

/*
 * The bottom cluster — MOB-HOME-001 (Cleo) — promoted to app-wide chrome on 2026-08-19.
 *
 * The ask pill and the tabs read as one sheet resting over the canvas, so Ask is
 * reachable from any scroll position on any screen that renders it. The grab handle is a
 * real control: it opens the assistant, where a swipe up would land.
 * Explore is deliberately absent — the capability index lives inside the assistant sheet.
 *
 * The suggested-question chips were removed on 2026-08-19, after the same chips had
 * already been cut from the assistant sheet. Two rows of chrome were standing between
 * the canvas and the tabs to offer questions nobody had asked for yet, and the pill they
 * sat above already types an example on its own. The dock is now handle, pill, tabs.
 * `PromptChips` itself survives — the three legacy directions still render it in-page.
 */
export function AssistantDock({ active, label, examples, reduceMotion, onOpen }) {
  return (
    <div className="home-dock">
      <button className="home-dock-handle" onClick={() => onOpen('')} aria-label="Open North"><i /></button>
      <AskPill label={label} examples={examples} reduceMotion={reduceMotion} onOpen={() => onOpen('')} />
      <BottomNav active={active} />
    </div>
  )
}

export function Screen({ children, active, className = '' }) {
  return <main id="main-content" className={`screen ${className}`}>{children}<BottomNav active={active} /></main>
}

export function Sheet({ children, onClose, label, wide = false, bottom = false, className = '' }) {
  return (
    <motion.div className={`sheet-backdrop ${bottom ? 'sheet-backdrop--bottom' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.section className={`sheet ${wide ? 'sheet--wide' : ''} ${className}`} role="dialog" aria-modal="true" aria-label={label}
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={spring}>
        <div className="sheet-handle" />
        {onClose && <button className="sheet-close icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button>}
        {children}
      </motion.section>
    </motion.div>
  )
}

export function Pill({ children, tone = '' }) {
  return <span className={`pill ${tone ? `pill--${tone}` : ''}`}>{children}</span>
}

export function CompanyLogo({ initials, color }) {
  return <span className="company-logo" style={color ? { background: color } : undefined}>{initials}</span>
}

export function ProgressRing({ value, total = 100, label, color = 'var(--primary)' }) {
  const pct = Math.round((value / total) * 100)
  return (
    <div className="progress-ring" style={{ '--progress': `${pct * 3.6}deg`, '--ring-color': color }}>
      <div><strong>{label || `${value}%`}</strong><span>{total === 100 ? 'match' : 'ready'}</span></div>
    </div>
  )
}
