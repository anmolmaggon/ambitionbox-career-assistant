import { Check, Clock3, Eye, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { SourceLabel } from './Shell'

const statusMeta = {
  done: { label: 'Handled', icon: Check },
  needs: { label: 'Needs you', icon: Sparkles },
  active: { label: 'Ready', icon: Sparkles },
  monitoring: { label: 'Monitoring', icon: Eye },
  pending: { label: 'Watching', icon: Clock3 },
}

export function ActivitySpine({ events, compact = false }) {
  return <ol className={`activity-spine ${compact ? 'activity-spine--compact' : ''}`} aria-label="Career Assistant activity">
    {events.map((event, index) => {
      const meta = statusMeta[event.status] || statusMeta.done
      const Icon = meta.icon
      return <motion.li key={event.id} className={`activity-event activity-event--${event.status}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * .05, .25) }}>
        <div className="activity-event__time"><span>{event.day}</span><strong>{event.time}</strong></div>
        <span className="activity-event__node"><Icon size={13} /></span>
        <div className="activity-event__body">
          <div className="activity-event__heading"><strong>{event.title}</strong><span>{meta.label}</span></div>
          <p>{event.detail}</p>
          <SourceLabel tone={event.status}>{event.source}</SourceLabel>
        </div>
      </motion.li>
    })}
  </ol>
}
