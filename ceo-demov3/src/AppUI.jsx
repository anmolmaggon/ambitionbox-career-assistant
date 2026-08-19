import { motion } from 'framer-motion'
import {
  ArrowLeft, BriefcaseBusiness, ChevronRight, Compass, Home, Sparkles, X,
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

export function Logo({ small = false }) {
  return (
    <div className={`brand ${small ? 'brand--small' : ''}`} aria-label="AmbitionBox">
      <img className="brand-mark" src="/favicon.svg" alt="" aria-hidden="true" />
      {!small && <span>Ambition<span>Box</span></span>}
    </div>
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

export function AssistantDock({ onClick, label = 'Ask AmbitionBox' }) {
  return (
    <button className="assistant-dock" onClick={onClick}>
      <span className="assistant-orb"><Sparkles size={16} /></span>
      <span>{label}</span><ChevronRight size={18} />
    </button>
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
