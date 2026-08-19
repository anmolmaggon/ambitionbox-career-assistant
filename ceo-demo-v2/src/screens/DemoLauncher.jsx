import { ArrowRight, Check, Play, RotateCcw, ShieldCheck } from 'lucide-react'
import { chapters } from '../data'
import { Logo } from '../components/Shell'
import { go } from '../navigation'
import { useJourney } from '../store'

export function DemoLauncher() {
  const { applyPreset, reset } = useJourney()

  const start = () => {
    reset()
    go('/today')
  }

  const openChapter = (chapter) => {
    applyPreset(chapter.preset)
    go(chapter.path)
  }

  return <main className="demo-launcher">
    <section className="demo-hero">
      <Logo inverse />
      <div className="demo-hero__status"><span /><strong>CEO DEMO V2</strong><span>5–6 MIN</span></div>
      <h1>Your job search<br />keeps moving.</h1>
      <p>Gmail built the tracker. Now watch AmbitionBox own the monitoring, chasing, preparation, and decisions—while Arjun only supplies judgment.</p>
      <button className="primary-button primary-button--light" onClick={start}><Play size={18} fill="currentColor" /> Start golden path</button>
      <div className="demo-principle"><ShieldCheck size={17} /><span><strong>Works first. Asks only when needed.</strong><small>Nothing external happens without Arjun’s exact approval.</small></span></div>
    </section>

    <section className="demo-chapters">
      <div className="section-intro"><span>DETERMINISTIC CHAPTERS</span><h2>Five moments, one application.</h2></div>
      <div className="chapter-list">
        {chapters.map((chapter) => <button key={chapter.number} className="chapter-row" onClick={() => openChapter(chapter)}>
          <span className="chapter-row__number">{chapter.number}</span>
          <span className="chapter-row__copy"><strong>{chapter.title}</strong><small>{chapter.detail}</small></span>
          <span className="chapter-row__time">{chapter.duration}</span>
          <ArrowRight size={17} />
        </button>)}
      </div>
      <button className="secondary-button" onClick={start}><RotateCcw size={16} /> Reset to post-import</button>
      <p className="demo-footnote"><Check size={14} /> Simulated Gmail · No real account accessed</p>
    </section>
  </main>
}
