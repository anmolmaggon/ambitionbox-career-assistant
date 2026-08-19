import { ArrowLeft, BriefcaseBusiness, CircleUserRound, Crosshair, Play } from 'lucide-react'
import { AppLink } from '../navigation'
import { candidate } from '../data'

export function Logo({ inverse = false }) {
  return <span className={`brand ${inverse ? 'brand--inverse' : ''}`} aria-label="AmbitionBox">
    <i aria-hidden="true"><b /><b /><b /></i>
    <strong>ambition<span>box</span></strong>
  </span>
}

export function Avatar() {
  return <span className="avatar" aria-label={candidate.name}>{candidate.initials}</span>
}

export function SourceLabel({ children, tone = '' }) {
  return <span className={`source-label ${tone ? `source-label--${tone}` : ''}`}>{children}</span>
}

export function Topbar({ title, eyebrow, back, action }) {
  return <header className="topbar">
    <div className="topbar__left">
      {back ? <AppLink className="icon-link" to={back} aria-label="Go back"><ArrowLeft size={21} /></AppLink> : <Logo />}
      {title && <div className="topbar__title">{eyebrow && <span>{eyebrow}</span>}<strong>{title}</strong></div>}
    </div>
    {action || <Avatar />}
  </header>
}

const nav = [
  { id: 'today', label: 'Today', path: '/today', icon: Crosshair },
  { id: 'applications', label: 'Applications', path: '/applications', icon: BriefcaseBusiness },
  { id: 'profile', label: 'Profile', path: '/profile', icon: CircleUserRound },
  { id: 'demo', label: 'Demo', path: '/demo', icon: Play },
]

export function BottomNav({ active }) {
  return <nav className="bottom-nav" aria-label="Primary navigation">
    {nav.map((item) => {
      const Icon = item.icon
      return <AppLink key={item.id} to={item.path} className={active === item.id ? 'is-active' : ''} aria-current={active === item.id ? 'page' : undefined}>
        <Icon size={19} />
        <span>{item.label}</span>
      </AppLink>
    })}
  </nav>
}

export function Screen({ children, active, className = '' }) {
  return <main id="main-content" className={`screen ${className}`}>
    {children}
    {active && <BottomNav active={active} />}
  </main>
}

export function CompanyMark({ compact = false }) {
  return <span className={`company-mark ${compact ? 'company-mark--compact' : ''}`} aria-hidden="true">JP</span>
}
