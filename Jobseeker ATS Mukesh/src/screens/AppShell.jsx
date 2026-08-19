import { useState } from 'react'
import ABHeader from '../components/ABHeader'
import ABLeftNav from '../components/ABLeftNav'
import Dashboard from './Dashboard'
import Pipeline from './Pipeline'
import InterviewPrep from './InterviewPrep'
import OfferInsights from './OfferInsights'
import AICopilot from './AICopilot'
import {
  GraduationCap, Trophy, MessageCircle, LayoutDashboard, Kanban, X,
} from 'lucide-react'

// ── Tabs ────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'home',      label: 'Dashboard',      icon: LayoutDashboard },
  { id: 'pipeline',  label: 'Pipeline',        icon: Kanban },
  { id: 'interview', label: 'Interview Prep',  icon: GraduationCap },
  { id: 'offers',    label: 'Offer Insights',  icon: Trophy },
  { id: 'copilot',   label: 'AI Copilot',      icon: MessageCircle },
]

// ── Activities data + modal (lives here so the greeting bar can own the button) ──

const activities = [
  { logo: 'https://logo.clearbit.com/amazon.com',  msg: 'Amazon recruiter opened your profile',  sub: 'Backend Engineering Manager · 12 views total',       time: '2 min ago'  },
  { logo: '/logo-swiggy.png',                      msg: 'Swiggy moved you to shortlisted',        sub: 'Senior Product Manager · Applied 6 days ago',        time: '1 hour ago' },
  { logo: 'https://logo.clearbit.com/zomato.com',  msg: 'Interview with Zomato confirmed',        sub: 'Product Lead · System Design Round · Thursday 3 PM', time: 'Yesterday'  },
  { logo: '/logo-flipkart.png',                    msg: 'Offer letter received from Flipkart',    sub: 'Senior PM · ₹45 LPA · Expires in 5 days',            time: '2 days ago' },
  { logo: 'https://logo.clearbit.com/meesho.com',  msg: 'Applied to Meesho',                      sub: 'Sr. Product Manager · Via LinkedIn',                  time: '3 days ago' },
]

function ActivitiesModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(6,11,24,0.45)' }}>
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-[480px] shadow-deep overflow-hidden anim-fade-in-up">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0F2F5]">
          <h3 className="text-[15px] font-bold text-gray-900">Recent Activities</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 cursor-pointer transition-colors">
            <X size={13} />
          </button>
        </div>
        <div className="divide-y divide-[#F5F6F8] max-h-[420px] overflow-y-auto">
          {activities.map((a, i) => (
            <div key={i} className="flex items-start gap-3.5 px-6 py-4 hover:bg-[#FAFBFC] cursor-pointer transition-colors">
              <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-1">
                <img src={a.logo} alt="" className="w-full h-full object-contain"
                  onError={e => { e.target.style.display = 'none' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-gray-800 mb-0.5">{a.msg}</p>
                <p className="text-[11px] text-gray-400 truncate">{a.sub}</p>
              </div>
              <span className="text-[10px] text-gray-300 shrink-0 mt-0.5">{a.time}</span>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-[#F0F2F5]">
          <p className="text-[12px] text-gray-400 text-center">Showing latest {activities.length} activities</p>
        </div>
      </div>
    </div>
  )
}

// ── Per-tab subtitles ────────────────────────────────────────────────────────

const subtitles = {
  pipeline:  '47 applications across 6 stages.',
  interview: '1 interview tomorrow · Focus on System Design.',
  offers:    '2 active offers · ₹8L negotiation headroom.',
  copilot:   '4 priorities ready · I save you 4 hours every week.',
}

// ── Main shell ───────────────────────────────────────────────────────────────

export default function AppShell() {
  const [activeTab, setActiveTab] = useState('home')
  const [navContext, setNavContext] = useState({})
  const [showActivities, setShowActivities] = useState(false)

  // navigate(tab) or navigate(tab, { interviewId: 1 })
  const navigate = (tab, ctx = {}) => {
    setActiveTab(tab)
    setNavContext(ctx)
  }

  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const emoji    = hour < 12 ? '☀️' : hour < 17 ? '👋' : '🌙'

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ fontFamily: "'Figtree', sans-serif" }}>

      {/* AmbitionBox top header */}
      <ABHeader />

      {/* Body: left nav + main content */}
      <div className="flex flex-1 overflow-hidden">

        {/* AmbitionBox left navigation */}
        <ABLeftNav />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* ── Greeting + Tabs — fixed, shown on every screen ── */}
          <div className="shrink-0 bg-white border-b border-[#E9E9E9]">

            {/* Greeting row */}
            <div className="flex items-center justify-between px-6 pt-4 pb-3">
              <div>
                <h1 className="text-[22px] font-bold text-gray-900">{greeting}, Mukesh {emoji}</h1>
                <p className="text-[13px] text-gray-500 mt-0.5">
                  {activeTab === 'home' ? (
                    <>You have <span className="font-semibold text-gray-700">3 urgent actions</span> and <span className="font-semibold text-gray-700">1 upcoming interview</span> today.</>
                  ) : (
                    subtitles[activeTab]
                  )}
                </p>
              </div>
              {activeTab === 'home' && (
                <button
                  onClick={() => setShowActivities(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8ECF0] rounded-xl text-[12px] font-semibold text-gray-600 hover:bg-gray-50 shadow-sm cursor-pointer transition-all"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {activities.length} New Activities
                </button>
              )}
            </div>

            {/* Underline tabs */}
            <div className="flex items-center px-2">
              {TABS.map(tab => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigate(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-[13px] font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'border-[#5670FB] text-[#5670FB]'
                        : 'border-transparent text-[#7C7C7C] hover:text-[#414141] hover:border-[#D0D5DD]'
                    }`}
                  >
                    <Icon size={14} strokeWidth={isActive ? 2.2 : 1.8} />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active screen */}
          <div className="flex-1 overflow-y-auto scrollbar-thin bg-[#F5F5F5]">
            {activeTab === 'home'      && <Dashboard navigate={navigate} />}
            {activeTab === 'pipeline'  && <Pipeline />}
            {activeTab === 'interview' && <InterviewPrep initialInterviewId={navContext.interviewId} />}
            {activeTab === 'offers'    && <OfferInsights />}
            {activeTab === 'copilot'   && <AICopilot />}
          </div>

        </div>
      </div>

      {showActivities && <ActivitiesModal onClose={() => setShowActivities(false)} />}
    </div>
  )
}
