import { useState } from 'react'
import {
  Sparkles, Send, ChevronRight, Target,
  TrendingUp, Brain, ArrowUpRight, Users,
  FileText, Mail, Plus,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const quickActions = [
  { icon: Mail,     label: 'Follow up with CRED',     color: 'text-amber-600 bg-amber-50'   },
  { icon: Target,   label: 'Negotiate Swiggy offer',  color: 'text-emerald-600 bg-emerald-50' },
  { icon: FileText, label: 'Update resume',           color: 'text-[#5670FB] bg-[#EEF0FF]'  },
  { icon: Brain,    label: 'Practice interview',      color: 'text-violet-600 bg-violet-50' },
]

const recommendations = [
  {
    priority: 'urgent', icon: Mail,
    title: 'Follow up with Razorpay',
    desc: 'Profile viewed 8 days ago. They haven\'t replied since.',
    suggestedAction: 'AI-drafted email ready · 2 min',
  },
  {
    priority: 'high', icon: FileText,
    title: 'Add "Product Analytics" to your profile',
    desc: '60% of PM roles you\'re applying to require this skill.',
    suggestedAction: 'Add to Naukri · 30 sec',
  },
  {
    priority: 'medium', icon: Target,
    title: 'Counter Swiggy\'s offer',
    desc: '8 GPMs at Swiggy negotiated +12%. Worth ₹8L for you.',
    suggestedAction: 'See negotiation script',
  },
  {
    priority: 'medium', icon: Brain,
    title: 'Practice System Design',
    desc: 'Razorpay interview tomorrow. Current readiness: 78%.',
    suggestedAction: 'Start 20-min mock',
  },
]

const trajectory = [
  { company: 'Razorpay', logo: '/logo-razorpay.svg', percent: 32, role: 'Sr. PM → Director' },
  { company: 'PhonePe',  logo: '/logo-phonepe.svg',  percent: 28, role: 'Sr. PM → Group PM' },
  { company: 'CRED',     logo: 'https://logo.clearbit.com/cred.club',    percent: 18, role: 'Sr. PM → VP Product' },
  { company: 'Stripe',   logo: 'https://logo.clearbit.com/stripe.com',   percent: 12, role: 'Sr. PM → PMM' },
]

const skillGaps = [
  { skill: 'Product Analytics', match: 60, demand: 'High'   },
  { skill: 'SQL',               match: 45, demand: 'High'   },
  { skill: 'A/B Testing',       match: 70, demand: 'High'   },
  { skill: 'Growth Strategy',   match: 80, demand: 'Medium' },
]

const recruiterIntel = [
  { name: 'Priya M.', company: 'Razorpay', responseRate: 92, avgReplyTime: '2 days', engagement: 'High'   },
  { name: 'Arjun K.', company: 'Flipkart', responseRate: 75, avgReplyTime: '4 days', engagement: 'Medium' },
  { name: 'Sneha R.', company: 'Swiggy',   responseRate: 88, avgReplyTime: '1 day',  engagement: 'High'   },
]

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

export default function AICopilot() {
  const [message, setMessage] = useState('')

  return (
    <div className="min-h-full bg-[#F5F5F5] p-6">
      <div className="max-w-[1060px] mx-auto space-y-5">

        {/* ── 1. Hero with chat input ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1E223C] via-[#252B52] to-[#1E223C] rounded-3xl p-6">
          <div className="absolute top-[-50px] left-[10%] w-[280px] h-[280px] rounded-full bg-blue-500/15 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-[-40px] right-[10%] w-[220px] h-[220px] rounded-full bg-violet-500/15 blur-[70px] pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5670FB] to-violet-500 flex items-center justify-center">
                <Sparkles size={13} className="text-white" />
              </div>
              <span className="text-blue-200 text-[11px] font-semibold uppercase tracking-wide">AI Career Copilot</span>
            </div>
            <h2 className="text-white text-[22px] font-bold mb-2">
              Mukesh, here's what I'd do next.
            </h2>
            <p className="text-blue-200/70 text-[13px] leading-relaxed mb-4 max-w-[600px]">
              Personalized guidance built from your Gmail activity, Naukri profile, and 1.2L+ AmbitionBox data points. I save you ~4 hours every week.
            </p>

            <div className="relative max-w-[560px]">
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Ask anything — career advice, negotiation, interview prep…"
                className="w-full pl-4 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-[13px] text-white placeholder-blue-200/50 focus:outline-none focus:border-white/40 transition-colors"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-white text-[#1E223C] flex items-center justify-center hover:bg-blue-50 cursor-pointer transition-colors">
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* ── 2. Quick Actions ── */}
        <div>
          <h3 className="text-[14px] font-bold text-gray-900 mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((a, i) => {
              const Icon = a.icon
              return (
                <button key={i} className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E8ECF0] bg-white hover:shadow-sm hover:border-[#5670FB]/40 cursor-pointer transition-all">
                  <div className={`w-6 h-6 rounded-lg ${a.color} flex items-center justify-center`}>
                    <Icon size={12} />
                  </div>
                  <span className="text-[12px] font-semibold text-gray-700">{a.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── 3. Today's Priorities ── */}
        <div className="bg-white rounded-3xl border border-[#E8ECF0] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">Today's Priorities</h3>
              <p className="text-[12px] text-gray-400 mt-0.5">Ranked by impact on your job search</p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              4 of 5 done this week
            </span>
          </div>

          <div className="space-y-2.5">
            {recommendations.map((r, i) => {
              const Icon = r.icon
              const priorityColor =
                r.priority === 'urgent' ? 'border-red-200 bg-red-50/30' :
                r.priority === 'high'   ? 'border-amber-200 bg-amber-50/30' :
                                          'border-[#E8ECF0]'
              const priorityBadge =
                r.priority === 'urgent' ? 'text-red-500 bg-red-50' :
                r.priority === 'high'   ? 'text-amber-600 bg-amber-50' :
                                          'text-gray-500 bg-gray-50'

              return (
                <div key={i} className={`flex items-start gap-3 p-3.5 rounded-2xl border ${priorityColor} hover:shadow-sm cursor-pointer transition-all group`}>
                  <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[13px] font-bold text-gray-900">{r.title}</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${priorityBadge}`}>
                        {r.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mb-2">{r.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#5670FB]">{r.suggestedAction}</span>
                      <ArrowUpRight size={12} className="text-gray-400 group-hover:text-[#5670FB] transition-colors" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── 4. Trajectory + Skill Gaps ── */}
        <div className="grid grid-cols-2 gap-4">

          {/* Trajectory */}
          <div className="bg-white rounded-3xl border border-[#E8ECF0] p-5">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={13} className="text-[#5670FB]" />
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Career Trajectory</span>
            </div>
            <h3 className="text-[15px] font-bold text-gray-900 mb-1">Where PMs like you go</h3>
            <p className="text-[11px] text-gray-400 mb-4">Based on 3,400 similar profiles</p>

            <div className="space-y-3">
              {trajectory.map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 p-1 overflow-hidden">
                    <img src={t.logo} alt={t.company} className="w-full h-full object-contain"
                      onError={e => { e.target.style.display = 'none' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[12px] font-bold text-gray-800">{t.company}</p>
                      <span className="text-[11px] font-bold text-[#5670FB]">{t.percent}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-0.5">
                      <div className="h-full bg-[#5670FB] rounded-full" style={{ width: `${t.percent * 2.8}%` }} />
                    </div>
                    <p className="text-[10px] text-gray-400">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Gaps */}
          <div className="bg-white rounded-3xl border border-[#E8ECF0] p-5">
            <div className="flex items-center gap-2 mb-1">
              <Target size={13} className="text-amber-500" />
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Skill Gap Analysis</span>
            </div>
            <h3 className="text-[15px] font-bold text-gray-900 mb-1">Skills you're missing</h3>
            <p className="text-[11px] text-gray-400 mb-4">Compared to PM JDs you've viewed</p>

            <div className="space-y-3">
              {skillGaps.map((s, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-[12px] font-bold text-gray-800 truncate">{s.skill}</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${s.demand === 'High' ? 'text-red-500 bg-red-50' : 'text-amber-500 bg-amber-50'}`}>
                        {s.demand}
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold shrink-0 ${s.match >= 70 ? 'text-emerald-500' : s.match >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                      {s.match}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.match >= 70 ? 'bg-emerald-400' : s.match >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                      style={{ width: `${s.match}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-4 w-full py-2 bg-[#F0F3FF] border border-[#DDE3FF] text-[11px] font-bold text-[#5670FB] rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#E0E6FF] cursor-pointer transition-colors">
              <Plus size={11} />
              Add missing skills to profile
            </button>
          </div>
        </div>

        {/* ── 5. Recruiter Intelligence ── */}
        <div className="bg-white rounded-3xl border border-[#E8ECF0] p-5">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">Recruiter Intelligence</h3>
              <p className="text-[12px] text-gray-400 mt-0.5">Who's engaging with you and how fast they reply</p>
            </div>
            <Users size={16} className="text-gray-300" />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            {recruiterIntel.map((r, i) => (
              <div key={i} className="border border-[#E8ECF0] rounded-2xl p-4 hover:border-[#5670FB]/40 hover:shadow-sm cursor-pointer transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-full bg-[#5670FB] flex items-center justify-center shrink-0">
                    <span className="text-white text-[13px] font-bold">{r.name.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-gray-900 truncate">{r.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{r.company}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Metric label="Response rate" value={`${r.responseRate}%`} valueClass="text-emerald-500" />
                  <Metric label="Avg reply"     value={r.avgReplyTime}        valueClass="text-gray-700" />
                  <Metric label="Engagement"    value={r.engagement}          valueClass={r.engagement === 'High' ? 'text-emerald-500' : 'text-amber-500'} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

function Metric({ label, value, valueClass }) {
  return (
    <div className="flex justify-between text-[10px]">
      <span className="text-gray-500">{label}</span>
      <span className={`font-bold ${valueClass}`}>{value}</span>
    </div>
  )
}
