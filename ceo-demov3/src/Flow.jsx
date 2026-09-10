import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Check, Copy, Mic, Plus, Send } from 'lucide-react'
import { AppLink, NorthMark, go } from './AppUI'
import { useJourney } from './store'
import { answerQuestion, buildFlow, followUps } from './flows'

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

  /*
   * The slot the user already picked — either tapped on the Home card, which sends it in
   * the URL, or chosen in a previous run of this flow. Either way the flow opens on the
   * choice instead of asking for it again.
   */
  const slotParam = params.get('slot')
  const booked = slotParam || journey.bookedSlots?.[applicationId]

  /*
   * A choice made on the card is persisted the moment the flow opens, not when it closes.
   * Someone who taps a slot and then backs out has still chosen — and if Home showed them
   * the same three chips again tomorrow, the tap would have meant nothing.
   */
  useEffect(() => {
    if (!slotParam || !applicationId) return
    if (journey.bookedSlots?.[applicationId] === slotParam) return
    update({ bookedSlots: { ...(journey.bookedSlots || {}), [applicationId]: slotParam } })
  }, [slotParam, applicationId, journey.bookedSlots, update])
  const flow = useMemo(() => buildFlow(type, applicationId, booked), [type, applicationId, booked])

  const [answers, setAnswers] = useState({})
  const [turn, setTurn] = useState(0)      // how many script steps have been revealed
  const [draft, setDraft] = useState('')
  const [copied, setCopied] = useState(false)
  const [closing, setClosing] = useState(null)
  /*
   * Turns the user added by asking rather than by answering. The script and the
   * conversation live in one thread, so a flow that has said its piece does not dead-end
   * into a screen with nothing to do.
   */
  const [asides, setAsides] = useState([])
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
  }, [turn, asides.length, reduceMotion])

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

  /*
   * Asking is not answering. A question adds a pair of turns to the end of the thread and
   * leaves the script exactly where it was, so someone can ask what a company pays in the
   * middle of picking a slot and still be picking a slot afterwards.
   */
  const ask = (question) => {
    if (!question.trim()) return
    setAsides((current) => [
      ...current,
      { id: `q${current.length}`, from: 'you', text: question.trim() },
      { id: `a${current.length}`, from: 'north', ...answerQuestion(type, flow.app, question) },
    ])
  }

  const HANDOFF = {
    prep: '/prep/juspay',
    offer: '/offer/juspay?stage=decision',
    negotiate: '/offer/juspay?stage=decision',
    jobs: '/matches',
  }

  /*
   * A flow has to leave the same mark the screen it replaced did, or finishing one
   * changes nothing and Home offers the same card again tomorrow. These are the only
   * consequences: a reply the user says they sent, and a quiet application they close.
   * Nothing here sends, books or applies.
   */
  const effect = (option) => {
    if (type === 'reply' && option.result === 'sent') return { phonepeReplied: true }
    if (type === 'ghosted' && option.result === 'closed') {
      return { applicationStages: { ...(journey.applicationStages || {}), [applicationId]: 'rejected' } }
    }
    // Picking a slot is the one moment the interview story moves: the card that offered
    // slots has to come back tomorrow as the round you booked, not as the same offer.
    if (type === 'prep' && option.result === 'booked' && answers.slot) {
      return { bookedSlots: { ...(journey.bookedSlots || {}), [applicationId]: answers.slot } }
    }
    return {}
  }

  const finish = (option) => {
    setClosing(option)
    if (HANDOFF[option.result]) setTimeout(() => go(HANDOFF[option.result]), 900)
    // The flow's outcome is recorded on the journey so Home and Tracker can reflect it.
    // Nothing here sends, books, or applies — every result is a note about what the user
    // said they would do next.
    update({
      flowResults: { ...(journey.flowResults || {}), [`${type}:${applicationId || 'juspay'}`]: option.result },
      ...effect(option),
    })
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
            /*
             * The needle marks who is speaking, so it appears once per run rather than on
             * every turn. North talks for four or five turns at a stretch; repeating the
             * mark down all of them turns the speaker into a column of decoration.
             */
            /*
             * ...and after the user speaks, because a reply needs to show who is replying.
             * Without this, a thread that opens on the user's slot left North's first line
             * unattributed.
             */
            showAvatar={index === 0 || visible[index - 1]?.from === 'you' || answers[visible[index - 1]?.key] !== undefined}
            isLast={index === visible.length - 1}
            draft={draft}
            setDraft={setDraft}
            copied={copied}
            setCopied={setCopied}
          />
        ))}
        {asides.map((turn, index) => (
          turn.from === 'you'
            ? (
              <motion.div key={turn.id} className="flow-turn flow-turn--you" initial={reduceMotion ? false : { y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <span className="flow-said">{turn.text}</span>
              </motion.div>
            )
            : (
              <motion.div key={turn.id} className="flow-turn flow-turn--north" initial={reduceMotion ? false : { y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <span className="flow-avatar"><NorthMark state="arrive" /></span>
                <div className="flow-turn-body"><FlowElement step={turn} answers={answers} /></div>
              </motion.div>
            )
        ))}
        <div ref={endRef} />
      </div>

      {/*
        * The bottom stack: chips on top of the sheet, not inside it. They are things to
        * say; the sheet is where you say them. One fixed container rather than two, so
        * the rail can never overlap the sheet's own buttons — as a separately fixed
        * element it sat on top of "Back to Home" and ate the click.
        */}
      <div className="flow-bottom">
      <FlowChips
        step={waiting ? current : null}
        answers={answers}
        suggestions={followUps(type, flow.app)}
        onAnswer={answer}
        onAsk={ask}
      />

      <div className="flow-dock">
        {closing ? (
          <>
            <span className="flow-closed-line"><Check size={16} /> {closingLine(closing.result)}</span>
            {/* A finished flow still has to let go of the reader. The chips below stay
                live, so leaving is a choice rather than the only thing left. */}
            <div className="flow-dock-actions">
              <button className="ghost-button" onClick={() => go('/home')}>Back to Home</button>
            </div>
          </>
        ) : waiting && current.type === 'actions' ? (
          <div className="flow-dock-actions">
            {resolve(current.options, answers).map((option) => (
              <button
                key={option.label}
                className={option.primary ? 'primary-button' : 'ghost-button'}
                onClick={() => finish(option)}
              >{option.label}</button>
            ))}
          </div>
        ) : null}

        <FlowComposer
          step={waiting && current.type === 'input' ? current : null}
          onAnswer={answer}
          onAsk={ask}
        />
      </div>
      </div>

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

function FlowTurn({ step, answers, reduceMotion, isLast, showAvatar, draft, setDraft, copied, setCopied }) {
  const answered = step.key !== undefined && answers[step.key] !== undefined
  /*
   * A scripted turn that belongs to the user. Tapping a slot on the Home card is the user
   * saying something, and the thread should open with them saying it — North replying to
   * a choice reads as a conversation; North announcing the choice back reads as a receipt.
   */
  if (step.from === 'you') {
    return (
      <motion.div
        className="flow-turn flow-turn--you"
        initial={reduceMotion ? false : { y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: .3, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="flow-said">{resolve(step.text, answers)}</span>
      </motion.div>
    )
  }
  return (
    <>
      <motion.div
        className={`flow-turn flow-turn--north ${step.gap ? 'flow-turn--gap' : ''}`}
        initial={reduceMotion ? false : { y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: .34, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className={`flow-avatar ${showAvatar ? '' : 'is-hidden'}`}>
          {showAvatar && <NorthMark state={step.type === 'thinking' && isLast ? 'working' : 'arrive'} />}
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

/*
 * The chip rail.
 *
 * One row, scrolled horizontally, always showing something. What it shows depends on where
 * the thread is: at a question, the answers; everywhere else, the things worth asking next.
 *
 * The suggestions are only ever questions North can actually answer — a chip is a promise,
 * and one that lands on a shrug costs more trust than the chip was worth.
 */
function FlowChips({ step, answers, suggestions, onAnswer, onAsk }) {
  const [picked, setPicked] = useState([])
  const choosing = step && step.type === 'choice'
  const options = choosing ? resolve(step.options, answers) : []

  return (
    <div className="flow-rail flow-rail--floating" role="group" aria-label={choosing ? 'Answers' : 'Suggested questions'}>
      {choosing
        ? options.map((option) => {
          const on = picked.includes(option)
          return (
            <button
              key={option}
              className={`flow-chip ${on ? 'is-on' : ''}`}
              aria-pressed={step.multi ? on : undefined}
              onClick={() => {
                // A single choice answers on the tap. Asking someone to pick one thing and
                // then press Confirm is a tap of pure ceremony.
                if (!step.multi) return onAnswer(step.key, option)
                setPicked((current) => (on ? current.filter((entry) => entry !== option) : [...current, option]))
              }}
            >{option}</button>
          )
        })
        : suggestions.map((entry) => (
          <button key={entry.label} className="flow-chip flow-chip--ask" onClick={() => onAsk(entry.label)}>
            {entry.label}
          </button>
        ))}

      {choosing && step.multi && (
        <button
          className="flow-chip flow-chip--confirm"
          disabled={!picked.length}
          onClick={() => { onAnswer(step.key, picked); setPicked([]) }}
        >{picked.length ? `Add ${picked.length}` : 'Pick what came up'}</button>
      )}
    </div>
  )
}

/*
 * The composer, present at every point in the thread.
 *
 * When the script is waiting on a typed answer it submits that answer; otherwise it asks a
 * question and the script stays where it was. One field doing both is what stops the flow
 * being a wizard you can only walk forwards through.
 */
function FlowComposer({ step, onAnswer, onAsk }) {
  const [typed, setTyped] = useState('')
  const answering = Boolean(step)

  const submit = () => {
    if (!typed.trim()) return
    if (answering) onAnswer(step.key, typed.trim())
    else onAsk(typed)
    setTyped('')
  }

  return (
    <div className="flow-composer">
      {/* Attach is present because an assistant input is expected to have one. It is
          disabled and says so, rather than being drawn and then doing nothing — this
          prototype has nowhere to put a file. */}
      <button className="flow-attach" aria-label="Attach a file (not available in this demo)" disabled>
        <Plus size={19} />
      </button>
      <input
        value={typed}
        onChange={(event) => setTyped(event.target.value)}
        placeholder={answering ? (step.placeholder || 'Type your answer') : 'Ask North'}
        aria-label={answering ? resolve(step.text, {}) : 'Ask North about this'}
        onKeyDown={(event) => { if (event.key === 'Enter') submit() }}
      />
      {answering && (
        <button className="flow-skip" onClick={() => onAnswer(step.key, 'Nothing to add')}>Skip</button>
      )}
      {!typed.trim() && !answering && (
        <button className="flow-mic" aria-label="Dictate (not available in this demo)" disabled>
          <Mic size={18} />
        </button>
      )}
      <button className="flow-send" aria-label={answering ? 'Send answer' : 'Ask'} disabled={!typed.trim()} onClick={submit}>
        <NorthMark />
      </button>
    </div>
  )
}
