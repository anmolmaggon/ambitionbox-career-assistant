import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'

const STEPS = [
  {
    id: 0,
    title: 'Finding your applications',
    sub: 'Scanning job-related emails across Gmail',
    stat: null,
    icon: '📨',
    pills: [],
    insight: null,
  },
  {
    id: 1,
    title: 'Identifying recruiter activity',
    sub: 'Matching interview invites and responses',
    stat: { value: '47', label: 'applications found' },
    icon: '👥',
    pills: [],
    insight: 'Fintech recruiters respond 2.4× faster',
  },
  {
    id: 2,
    title: 'Understanding your patterns',
    sub: 'Analyzing companies, roles and response rates',
    stat: { value: '8', label: 'recruiter conversations' },
    icon: '🧠',
    pills: [],
    insight: 'Your profile is in the top 32% for PM roles',
  },
  {
    id: 3,
    title: 'Preparing your workspace',
    sub: 'Building your career pipeline automatically',
    stat: { value: '3', label: 'interviews tracked' },
    icon: '⚡',
    pills: [],
    insight: 'Your pipeline is 3× more complete than average',
  },
  {
    id: 4,
    title: 'Almost ready, Mukesh ✨',
    sub: 'Your career workspace is assembled',
    stat: null,
    icon: '🎯',
    pills: [],
    insight: 'You\'re already ahead of 68% of similar candidates this week.',
    isFinal: true,
  },
]

export default function AIProcessing({ onComplete }) {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (step >= STEPS.length - 1) {
      const t = setTimeout(() => { setDone(true); setTimeout(onComplete, 1000) }, 2200)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setStep(s => s + 1), 2400)
    return () => clearTimeout(t)
  }, [step])

  const progress = ((step + 1) / STEPS.length) * 100
  const current = STEPS[step]

  return (
    <div className="min-h-screen bg-[#F7F8FA] relative overflow-hidden flex flex-col items-center justify-center px-8">

      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="anim-orb-1 absolute top-[20%] left-[15%] w-[400px] h-[400px] rounded-full bg-blue-200/50 blur-[80px]" />
        <div className="anim-orb-2 absolute bottom-[20%] right-[15%] w-[350px] h-[350px] rounded-full bg-indigo-200/40 blur-[70px]" />
      </div>
      <div className="absolute inset-0 dot-grid-light pointer-events-none" />

      {/* AmbitionBox logo */}
      <div className="absolute top-5 left-8">
        <img src="/ambitionbox-logo.svg" alt="AmbitionBox" className="h-6 w-auto" />
      </div>

      <div className="relative z-10 w-full max-w-[680px]">

        {/* Step progress dots */}
        <div className="flex items-center justify-center gap-3 mb-14">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`transition-all duration-500 flex items-center justify-center rounded-full ${
                i < step
                  ? 'w-6 h-6 bg-[#5670FB] shadow-blue'
                  : i === step
                  ? 'w-6 h-6 bg-[#5670FB] shadow-blue anim-pulse-ring'
                  : 'w-3 h-3 bg-[#D0D5DD]'
              }`}>
                {i < step && <Check size={12} className="text-white" strokeWidth={2.5} />}
                {i === step && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px transition-all duration-700 ${i < step ? 'w-12 bg-[#5670FB]' : 'w-12 bg-[#D0D5DD]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div key={step} className="text-center anim-fade-in-up">

          {/* Icon */}
          <div className="text-5xl mb-5">{current.icon}</div>

          {/* Title */}
          <h2 className="text-[32px] font-bold text-[#1E223C] mb-2 tracking-tight">
            {current.title}
          </h2>
          <p className="text-gray-500 text-base mb-8">{current.sub}</p>

          {/* Stat counter */}
          {current.stat && (
            <div className="anim-count-up inline-flex items-baseline gap-2 mb-8">
              <span className="text-[52px] font-bold text-[#1E223C] leading-none">{current.stat.value}</span>
              <span className="text-gray-400 text-lg">{current.stat.label}</span>
            </div>
          )}

          {/* Email subject pills */}
          {current.pills && current.pills.length > 0 && (
            <div className="anim-fade-in-3 flex flex-wrap justify-center gap-2 mb-4">
              {current.pills.map((p, i) => (
                <span key={i} className="px-3.5 py-1.5 bg-white border border-[#E8ECF0] rounded-full text-[12px] text-gray-500 shadow-sm">
                  {p}
                </span>
              ))}
            </div>
          )}

          {/* Final insight */}
          {current.isFinal && (
            <div className="anim-scale-in-2 bg-blue-50 border border-blue-100 rounded-2xl px-8 py-5 inline-block mt-4">
              <p className="text-[#5670FB] text-[13px] font-semibold uppercase tracking-wider mb-2">AI Insight</p>
              <p className="text-[#1E223C] text-lg font-medium leading-relaxed">{current.insight}</p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs">Analyzing your career history</span>
            <span className="text-gray-500 text-xs font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

      </div>
    </div>
  )
}
