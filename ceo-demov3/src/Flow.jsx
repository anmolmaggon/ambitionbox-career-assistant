import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Check, Copy, Send } from 'lucide-react'
import { AppLink, Needle, go } from './AppUI'
import { useJourney } from './store'
import { buildFlow } from './flows'

/*
 * The flow screen.
 *
 * One engine, six scripts. A flow is a thread that builds itself: North's turns reveal on
 * a timer so the reader watches the work happen, and the thread stops at the turn that
 * needs an answer. The answer comes from the dock at the bottom — chips, a text line, or
 * the closing actions — and is echoed back into the thread as the user's own turn, so
 * scrolling up reads as a conversation rather than a form someone filled in.
 *
 * Why not a screen per flow: the six differ in what they show, not in how they proceed.
 * Every one of them finds something, shows the artifact, names the gap it cannot fill,
 * and hands back something usable. That shape is the engine; the scripts are the content.
 */

const BLOCKING = new Set(['choice', 'input', 'actions'])
const REVEAL_MS = 620
const THINKING_MS = 1150

const resolve = (value, answers) => (typeof value === 'function' ? value(answers) : value)

export function FlowScreen() {
  const { journey, update } = useJourney()
  const reduceMotion = useReducedMotion()
  const params = new URLSearchParams(window.location.search)
  const type = window.location.pathname.split('/')[2]
  const applicationId = params.get('application')

  const flow = useMemo(() => buildFlow(type, applicationId), [type, applicationId])

  const [answers, setAnswers] = useState({})
  const [turn, setTurn] = useState(0)      // how many script steps have been revealed
  const [draft, setDraft] = useState('')
  const [copied, setCopied] = useState(false)
  const [closing, setClosing] = useState(null)
  const endRef = useRef(null)

  /*
   * `when` lets an answer make a later step irrelevant — the ghosted flow drops its draft
   * entirely when the user chooses to close the application instead of chasing it. The
   * filter runs against the current answers, so the visible script can shorten mid-thread.
   */
  const steps = useMemo(
    () => (flow ? flow.steps.filter((step) => (step.when ? step.when(answers) : true)) : []),
    [flow, answers],
  )

  const visible = steps.slice(0, turn)
  const current = steps[turn - 1]
  const waiting = current && BLOCKING.has(current.type)

  /*
   * The thread advances itself while North is talking and stops when it needs the user.
   * A `thinking` step holds longer than the rest — it is the needle settling, and cutting
   * it short makes the work look like it never happened.
   */
  useEffect(() => {
    if (!flow) return undefined
    if (turn === 0) { setTurn(1); return undefined }
    if (turn >= steps.length) return undefined
    if (waiting) return undefined
    const delay = reduceMotion ? 0 : (current?.type === 'thinking' ? THINKING_MS : REVEAL_MS)
    const timer = setTimeout(() => setTurn((value) => value + 1), delay)
    return () => clearTimeout(timer)
  }, [flow, turn, steps.length, waiting, current, reduceMotion])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'end' })
  }, [turn, reduceMotion])

  if (!flow) {
    return (
      <main className="screen flow-screen">
        <FlowHeader meta={{ kicker: 'NOT FOUND', title: 'Nothing to open here' }} />
        <p className="flow-empty">This flow needs an application from your Tracker.</p>
        <AppLink className="primary-button" to="/home">Back to Home</AppLink>
      </main>
    )
  }

  const answer = (key, value) => {
    setAnswers((current) => ({ ...current, [key]: value }))
    setTurn((value) => value + 1)
  }

  const HANDOFF = {
    prep: '/prep/juspay',
    offer: '/offer/juspay?stage=decision',
    negotiate: '/offer/juspay?stage=decision',
    jobs: '/matches',
  }

  const finish = (option) => {
    setClosing(option)
    if (HANDOFF[option.result]) setTimeout(() => go(HANDOFF[option.result]), 900)
    // The flow's outcome is recorded on the journey so Home and Tracker can reflect it.
    // Nothing here sends, books, or applies — every result is a note about what the user
    // said they would do next.
    update({ flowResults: { ...(journey.flowResults || {}), [`${type}:${applicationId || 'juspay'}`]: option.result } })
  }

  return (
    <main className="screen flow-screen">
      <FlowHeader meta={flow.meta} app={flow.app} />

      <div className="flow-thread">
        {visible.map((step, index) => (
          <FlowTurn
            key={step.id}
            step={step}
            answers={answers}
            reduceMotion={reduceMotion}
            isLast={index === visible.length - 1}
            draft={draft}
            setDraft={setDraft}
            copied={copied}
            setCopied={setCopied}
          />
        ))}
        <div ref={endRef} />
      </div>

      <AnimatePresence mode="wait">
        {closing ? (
          <motion.div
            key="closed"
            className="flow-dock flow-dock--closed"
            initial={reduceMotion ? false : { y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <span className="flow-closed-line"><Check size={16} /> {closingLine(closing.result)}</span>
            <button className="primary-button" onClick={() => go('/home')}>Back to Home</button>
          </motion.div>
        ) : waiting ? (
          <motion.div
            key={current.id}
            className="flow-dock"
            initial={reduceMotion ? false : { y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduceMotion ? undefined : { y: 12, opacity: 0 }}
            transition={{ duration: .28, ease: [0.22, 1, 0.36, 1] }}
          >
            <FlowInput step={current} answers={answers} onAnswer={answer} onFinish={finish} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  )
}

function closingLine(result) {
  return {
    sent: 'Marked as sent. North is watching the thread.',
    later: 'Left open. It will be back on Home tomorrow.',
    prep: 'Prep is saved against the round.',
    booked: 'Booked. Nothing else needed today.',
    closed: 'Closed. It sits in Rejected as a record.',
    done: 'Logged.',
    jobs: 'Ranked and ready in Jobs.',
    negotiate: 'Draft saved. You send it.',
    offer: 'Opening the full breakdown.',
  }[result] || 'Logged.'
}

function FlowHeader({ meta, app }) {
  return (
    <header className="flow-header">
      <AppLink className="icon-button" to="/home" aria-label="Back to Home"><ArrowLeft size={20} /></AppLink>
      <div className="flow-header-copy">
        <span className="eyebrow">{meta.kicker}</span>
        <h1>{app?.company ? `${app.company} · ${app.role}` : meta.title}</h1>
      </div>
    </header>
  )
}

/* --------------------------------------------------------------------------- */

function FlowTurn({ step, answers, reduceMotion, isLast, draft, setDraft, copied, setCopied }) {
  const answered = step.key !== undefined && answers[step.key] !== undefined
  return (
    <>
      <motion.div
        className={`flow-turn flow-turn--north ${step.gap ? 'flow-turn--gap' : ''}`}
        initial={reduceMotion ? false : { y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: .34, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="flow-avatar">
          <Needle size={16} state={step.type === 'thinking' && isLast ? 'settling' : 'settled'} />
        </span>
        <div className="flow-turn-body">
          <FlowElement step={step} answers={answers} draft={draft} setDraft={setDraft} copied={copied} setCopied={setCopied} />
        </div>
      </motion.div>

      {/* The user's answer, echoed back so scrolling up reads as a conversation. */}
      {answered && (
        <motion.div
          className="flow-turn flow-turn--you"
          initial={reduceMotion ? false : { y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <span className="flow-said">
            {Array.isArray(answers[step.key]) ? answers[step.key].join(' · ') : answers[step.key]}
          </span>
        </motion.div>
      )}
    </>
  )
}

function FlowElement({ step, answers, draft, setDraft, copied, setCopied }) {
  const text = resolve(step.text, answers)
  const title = resolve(step.title, answers)

  switch (step.type) {
    case 'thinking':
      return <p className="flow-thinking">{text}<i /><i /><i /></p>

    case 'quote':
      return (
        <blockquote className="flow-quote">
          <p>“{step.quote}”</p>
          <footer><strong>{step.sender}</strong><span>{step.meta}</span></footer>
        </blockquote>
      )

    case 'detail':
      return (
        <div className="flow-card">
          {title && <h2 className="flow-card-title">{title}</h2>}
          <dl className="flow-rows">
            {step.rows.map(([label, value]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </div>
      )

    case 'list':
      return (
        <div className="flow-card">
          {title && <h2 className="flow-card-title">{title}</h2>}
          <ul className="flow-list">
            {step.items.map((item) => (
              <li key={item.label} className={`flow-list-item flow-list-item--${item.tone || 'neutral'}`}>
                <span className="flow-list-dot" />
                <span><strong>{item.label}</strong><small>{item.meta}</small></span>
              </li>
            ))}
          </ul>
          {/* Every claim names where it came from. A list of findings with no source is
              the thing this product exists not to be. */}
          {step.source && <p className="flow-source">{step.source}</p>}
        </div>
      )

    case 'timeline':
      return (
        <ol className="flow-timeline">
          {step.items.map((item) => (
            <li key={item.label} className={item.quiet ? 'is-quiet' : 'is-done'}>
              <span className="flow-timeline-mark" />
              <span><strong>{item.label}</strong><small>{item.meta}</small></span>
            </li>
          ))}
        </ol>
      )

    case 'figure':
      return (
        <div className="flow-figure">
          <span className="flow-figure-label">{step.label}</span>
          <strong>{step.value}</strong>
          <dl className="flow-rows">
            {step.rows.map(([label, value]) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </div>
      )

    case 'draft': {
      const body = draft || text
      return (
        <div className="flow-card flow-draft">
          <header className="flow-draft-top">
            <h2 className="flow-card-title">{title}</h2>
            <button
              className="flow-copy"
              onClick={() => { navigator.clipboard?.writeText(body); setCopied(true); setTimeout(() => setCopied(false), 1800) }}
            >{copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}</button>
          </header>
          {/* Editable in place. A draft you cannot change is a draft you have to retype
              somewhere else, which is where the agent stops being useful. */}
          <textarea
            className="flow-draft-body"
            value={body}
            onChange={(event) => setDraft(event.target.value)}
            aria-label="Draft, editable"
            rows={Math.min(14, body.split('\n').length + 1)}
          />
          {step.note && <p className="flow-source">{step.note}</p>}
        </div>
      )
    }

    case 'verdict':
      return (
        <div className="flow-verdict">
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
      )

    default:
      return <p className="flow-message">{text}</p>
  }
}

/* --------------------------------------------------------------------------- */

function FlowInput({ step, answers, onAnswer, onFinish }) {
  const [picked, setPicked] = useState([])
  const [typed, setTyped] = useState('')
  const options = resolve(step.options, answers)

  if (step.type === 'actions') {
    return (
      <div className="flow-dock-actions">
          {options.map((option) => (
            <button
              key={option.label}
              className={option.primary ? 'primary-button' : 'ghost-button'}
              onClick={() => onFinish(option)}
            >{option.label}</button>
          ))}
      </div>
    )
  }

  if (step.type === 'input') {
    return (
      <>
        <div className="flow-dock-field">
          <input
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            placeholder={step.placeholder}
            aria-label={resolve(step.text, answers)}
            onKeyDown={(event) => { if (event.key === 'Enter' && typed.trim()) onAnswer(step.key, typed.trim()) }}
          />
          <button
            className="flow-send"
            aria-label="Send"
            disabled={!typed.trim()}
            onClick={() => onAnswer(step.key, typed.trim())}
          ><Send size={16} /></button>
        </div>
        <button className="flow-skip" onClick={() => onAnswer(step.key, 'Nothing to add')}>Skip</button>
      </>
    )
  }

  // A multi-select collects, then confirms. A single choice answers on the tap — asking
  // someone to pick one thing and then press Confirm is one tap of pure ceremony.
  return (
    <>
      <div className="flow-chips">
        {options.map((option) => {
          const on = picked.includes(option)
          return (
            <button
              key={option}
              className={`flow-chip ${on ? 'is-on' : ''}`}
              aria-pressed={step.multi ? on : undefined}
              onClick={() => {
                if (!step.multi) return onAnswer(step.key, option)
                setPicked((current) => (on ? current.filter((entry) => entry !== option) : [...current, option]))
              }}
            >{option}</button>
          )
        })}
      </div>
      {step.multi && (
        <button
          className="primary-button"
          disabled={!picked.length}
          onClick={() => onAnswer(step.key, picked)}
        >{picked.length ? `Add ${picked.length}` : 'Pick what came up'}</button>
      )}
    </>
  )
}
