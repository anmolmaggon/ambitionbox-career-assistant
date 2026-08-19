import { useState } from 'react'
import {
  Briefcase, MessageSquare, Calendar, Gift, TrendingUp, UserX,
  MapPin, Sparkles, CheckCircle, AlertTriangle, Info, BarChart3,
  X, Star, ChevronRight, Trophy, ArrowUpRight, Target,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const stats = [
  { icon: Briefcase,     label: 'Applications',     value: '47',   sub: '+12% this week',  pos: true  },
  { icon: MessageSquare, label: 'Recruiter Replies', value: '18',   sub: '38% reply rate',  pos: true  },
  { icon: Calendar,      label: 'Interview Rate',    value: '17%',  sub: '2× industry avg', pos: true  },
  { icon: UserX,         label: 'Ghosted',           value: '14',   sub: '−3 this week',    pos: true  },
  { icon: Gift,          label: 'Offers',            value: '3',    sub: '2 need decision', pos: null  },
  { icon: TrendingUp,    label: 'Avg Offered CTC',   value: '₹52L', sub: '+8% vs market',   pos: true  },
]

const insights = [
  {
    strip: 'bg-emerald-400', icon: CheckCircle,
    title: 'Strong fintech traction',
    desc: '8 of your last 12 applications are in fintech — recruiters are opening your profile 3× faster than average.',
  },
  {
    strip: 'bg-amber-400', icon: AlertTriangle,
    title: '3 applications need follow-up',
    desc: 'Razorpay, Meesho, and CRED viewed your profile 8+ days ago. Reach out before they move on.',
  },
  {
    strip: 'bg-[#5670FB]', icon: Info,
    title: 'Above-average reply rate',
    desc: 'Your 38% response rate beats the 24% industry average — your resume and profile are working well.',
  },
  {
    strip: 'bg-gray-300', icon: BarChart3,
    title: 'Best days to apply: Tue & Thu',
    desc: 'Applications sent Tuesday–Thursday in your domain get 40% more recruiter responses.',
  },
]

const allActions = [
  { icon: Calendar,      iconColor: 'text-red-500',     iconBg: 'bg-red-50',     dot: 'bg-red-400',     title: 'Prepare for Razorpay Interview', sub: 'Backend Engineering Manager · Tomorrow at 2 PM',    time: '1 day left',  timeBadge: 'text-red-500 bg-red-50',         navigate: 'interview', navigateCtx: { interviewId: 1 } },
  { icon: MessageSquare, iconColor: 'text-amber-600',   iconBg: 'bg-amber-50',   dot: 'bg-amber-400',   title: 'Send follow-up to CRED',          sub: 'Profile viewed 8 days ago · No response yet',       time: 'Overdue',     timeBadge: 'text-red-500 bg-red-50',         navigate: 'copilot'   },
  { icon: MessageSquare, iconColor: 'text-amber-600',   iconBg: 'bg-amber-50',   dot: 'bg-amber-400',   title: 'Follow up with Meesho',            sub: 'Sr. Product Manager · Viewed 9 days ago',           time: 'Overdue',     timeBadge: 'text-red-500 bg-red-50',         navigate: 'copilot'   },
  { icon: Gift,          iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50', dot: 'bg-emerald-400', title: 'Review Swiggy offer',              sub: '₹55 LPA · Offer expires in 5 days',                 time: '5 days left', timeBadge: 'text-emerald-600 bg-emerald-50', navigate: 'offers'    },
  { icon: Sparkles,      iconColor: 'text-[#5670FB]',   iconBg: 'bg-[#EEF0FF]',  dot: 'bg-[#5670FB]',   title: 'Complete Zomato interview prep',   sub: 'Product Lead · System Design Round · Thursday 3 PM', time: '2 days left', timeBadge: 'text-[#5670FB] bg-[#EEF0FF]',    navigate: 'interview' },
]

const pipeline = [
  {
    id: 'applied', title: 'Applied', count: 12,
    cards: [
      { company: 'Google',  logo: '/logo-google.svg',  rating: 4.5, role: 'Senior Product Manager', salary: '₹42–58L', location: 'Bengaluru', time: '3d', cta: 'Follow up today',   ctaStyle: 'text-[#5670FB] bg-[#EEF0FF] hover:bg-[#E0E6FF]' },
      { company: 'Zerodha', logo: 'https://logo.clearbit.com/zerodha.com', rating: 4.2, role: 'Product Lead',           salary: '₹35–50L', location: 'Bengaluru', time: '1d', cta: 'Wait for response', ctaStyle: 'text-gray-500 bg-gray-50 hover:bg-gray-100' },
      { company: 'Zomato',  logo: '/logo-zomato.svg',  rating: 4.1, role: 'Product Manager',        salary: '₹38–52L', location: 'Bengaluru', time: '5d', cta: 'Check status',      ctaStyle: 'text-gray-500 bg-gray-50 hover:bg-gray-100' },
    ],
  },
  {
    id: 'viewed', title: 'Recruiter Viewed', count: 8,
    cards: [
      { company: 'Razorpay', logo: '/logo-razorpay.svg', rating: 4.4, role: 'Sr. Product Manager', salary: '₹38–52L', location: 'Bengaluru', time: '8d' },
      { company: 'Meesho',   logo: '/logo-meesho.svg',   rating: 4.0, role: 'Senior PM',           salary: '₹30–45L', location: 'Bengaluru', time: '9d' },
    ],
  },
  {
    id: 'shortlisted', title: 'Shortlisted', count: 5,
    cards: [
      { company: 'Swiggy', logo: '/logo-swiggy.png', rating: 4.3, role: 'Group Product Manager', salary: '₹45–65L', location: 'Bengaluru', time: '2d' },
    ],
  },
  {
    id: 'interviewing', title: 'Interviewing', count: 3,
    cards: [
      { company: 'Flipkart', logo: '/logo-flipkart.png',  rating: 4.1, role: 'Sr. Product Manager', salary: '₹40–55L', location: 'Bengaluru', time: 'Tomorrow' },
      { company: 'PhonePe',  logo: '/logo-phonepe.svg',   rating: 4.2, role: 'Product Manager II',  salary: '₹35–48L', location: 'Bengaluru', time: 'Thu 3 PM' },
    ],
  },
  {
    id: 'offer', title: 'Offer', count: 2,
    cards: [
      { company: 'Swiggy', logo: '/logo-swiggy.png', rating: 4.3, role: 'Group PM', salary: '₹55 LPA · 92nd %ile', location: 'Bengaluru', time: '3d' },
    ],
  },
  {
    id: 'rejected', title: 'Rejected', count: 3,
    cards: [
      { company: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com', rating: 4.5, role: 'Senior Product Manager', salary: '₹60–80L', location: 'Bengaluru', time: '2w' },
      { company: 'Uber',   logo: '/logo-uber.svg',   rating: 4.1, role: 'Product Manager III',    salary: '₹50–70L', location: 'Bengaluru', time: '1mo' },
    ],
  },
]

const trajectory = [
  { company: 'Razorpay', logo: '/logo-razorpay.svg', percent: 32, role: 'Sr. PM → Director' },
  { company: 'PhonePe',  logo: '/logo-phonepe.svg',  percent: 28, role: 'Sr. PM → Group PM' },
  { company: 'CRED',     logo: 'https://logo.clearbit.com/cred.club',    percent: 18, role: 'Sr. PM → VP Product' },
  { company: 'Stripe',   logo: 'https://logo.clearbit.com/stripe.com',   percent: 12, role: 'Sr. PM → PMM' },
]

const missingSkills = [
  { skill: 'Product Analytics', severity: 'high'   },
  { skill: 'SQL',               severity: 'high'   },
  { skill: 'A/B Testing',       severity: 'medium' },
  { skill: 'Growth Loops',      severity: 'medium' },
  { skill: 'System Design',     severity: 'low'    },
]

const discoverCompanies = [
  { name: 'PhonePe',  logo: '/logo-phonepe.svg',  rating: 4.2, openRoles: 8,  match: 91, tag: 'Fintech'        },
  { name: 'CRED',     logo: 'https://logo.clearbit.com/cred.club',    rating: 4.1, openRoles: 5,  match: 87, tag: 'Fintech'        },
  { name: 'Groww',    logo: 'https://logo.clearbit.com/groww.in',     rating: 4.3, openRoles: 6,  match: 84, tag: 'Fintech'        },
  { name: 'Zepto',    logo: 'https://logo.clearbit.com/zeptonow.com', rating: 3.9, openRoles: 4,  match: 79, tag: 'Quick Commerce' },
  { name: 'Meesho',   logo: '/logo-meesho.svg',   rating: 4.0, openRoles: 7,  match: 76, tag: 'E-commerce'     },
  { name: 'Navi',     logo: 'https://logo.clearbit.com/navi.com',     rating: 3.8, openRoles: 3,  match: 73, tag: 'Fintech'        },
]

const rankSalaryInsights = [
  { icon: TrendingUp, text: 'Add "Director" to target titles — GPMs earn +₹22L on average at Tier-1 startups', color: 'text-emerald-600', bg: 'bg-emerald-50 border border-emerald-100' },
  { icon: Target,     text: 'B2B SaaS experience commands ₹8–12L premium over consumer product roles',          color: 'text-[#5670FB]',  bg: 'bg-[#EEF0FF] border border-[#DDE3FF]'   },
  { icon: Sparkles,   text: 'Candidates with AI product experience earned ₹6L more on average this year',       color: 'text-amber-600',  bg: 'bg-amber-50 border border-amber-100'   },
]

const rankSkillGaps = [
  { skill: 'Product Analytics',         impact: 'High',   desc: "Required in 60% of PM JDs you've viewed. Companies expect Mixpanel or Amplitude proficiency.", action: 'Take a course' },
  { skill: 'AI/ML Product Management',  impact: 'High',   desc: 'AI features are now expected in most PM roles. Build or ship an AI-first product to stand out.', action: 'Build a project' },
  { skill: 'Growth Product Management', impact: 'Medium', desc: 'Growth loops and viral mechanics are key skills for consumer-facing roles at scale-ups.', action: 'Study case studies' },
  { skill: 'B2B SaaS Experience',       impact: 'Medium', desc: "Most Bengaluru PM roles are B2B-focused. Highlight enterprise features you've shipped.", action: 'Update resume' },
]

const rankNextMoves = [
  { icon: TrendingUp, title: 'Move to Tier-1 Startup',  desc: 'Razorpay, PhonePe, CRED — ranked higher in the AmbitionBox PM index',               rankImprovement: '+8 ranks'  },
  { icon: Trophy,     title: 'Target Group PM Role',     desc: 'GPMs rank 40% higher on average. Start applying to Group PM titles at target companies', rankImprovement: '+12 ranks' },
]

const rankTrends = [
  { topic: 'AI-First Products', trend: '+245%', percent: 97 },
  { topic: '0-to-1 Experience', trend: '+178%', percent: 78 },
  { topic: 'Platform Thinking', trend: '+134%', percent: 65 },
]

// ─────────────────────────────────────────────────────────────────────────────
// Pipeline card
// ─────────────────────────────────────────────────────────────────────────────

function PipelineCard({ card, colId }) {
  const initial  = card.company.charAt(0).toUpperCase()
  const showCta  = colId === 'applied' && card.cta
  const fallbackBg = colId === 'rejected' ? 'bg-gray-100' : 'bg-[#EEF0FF]'
  const fallbackText = colId === 'rejected' ? 'text-gray-500' : 'text-[#5670FB]'

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E8ECF0] cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-1">
          <img
            src={card.logo}
            alt={card.company}
            className="w-full h-full object-contain"
            onError={e => {
              e.target.style.display = 'none'
              e.target.parentNode.className = `w-9 h-9 rounded-xl ${fallbackBg} flex items-center justify-center shrink-0`
              e.target.parentNode.innerHTML = `<span class="${fallbackText} text-[14px] font-bold">${initial}</span>`
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <p className="text-[14px] font-bold text-gray-900 leading-snug">{card.role}</p>
            <span className="text-[11px] text-gray-400 shrink-0 mt-0.5 whitespace-nowrap">{card.time}</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[12px] text-gray-500 font-medium">{card.company}</span>
            <Star size={10} className="text-amber-400 fill-amber-400 shrink-0" />
            <span className="text-[11px] text-gray-400">{card.rating}</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] text-gray-400 font-medium">₹</span>
          <span className="text-[13px] font-semibold text-gray-800">{card.salary}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={11} className="text-gray-400 shrink-0" />
          <span className="text-[12px] text-gray-500">{card.location}</span>
        </div>
      </div>

      {showCta && (
        <button className={`w-full py-2 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${card.ctaStyle}`}>
          <Sparkles size={11} />
          {card.cta}
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// All Actions Modal
// ─────────────────────────────────────────────────────────────────────────────

function AllActionsModal({ onClose, onNavigate }) {
  const groups = [
    { label: 'Urgent',    items: allActions.filter(a => a.dot === 'bg-red-400')   },
    { label: 'Follow Up', items: allActions.filter(a => a.dot === 'bg-amber-400') },
    { label: 'This Week', items: allActions.filter(a => !['bg-red-400', 'bg-amber-400'].includes(a.dot)) },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(6,11,24,0.45)' }}>
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-[480px] shadow-deep overflow-hidden anim-fade-in-up">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0F2F5]">
          <h3 className="text-[15px] font-bold text-gray-900">All Pending Actions</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 cursor-pointer transition-colors">
            <X size={13} />
          </button>
        </div>
        <div className="max-h-[440px] overflow-y-auto">
          {groups.filter(g => g.items.length).map(g => (
            <div key={g.label}>
              <p className="px-6 pt-4 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{g.label}</p>
              {g.items.map((a, i) => {
                const ActionIcon = a.icon
                return (
                  <button key={i} onClick={() => { onNavigate(a.navigate, a.navigateCtx); onClose() }}
                    className="w-full flex items-start gap-3.5 px-6 py-3.5 hover:bg-[#FAFBFC] cursor-pointer transition-colors text-left"
                  >
                    <div className={`w-8 h-8 rounded-xl ${a.iconBg} flex items-center justify-center shrink-0`}>
                      <ActionIcon size={14} className={a.iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-gray-800 leading-tight mb-0.5">{a.title}</p>
                      <p className="text-[11px] text-gray-400">{a.sub}</p>
                    </div>
                    <span className={`text-[10px] font-bold shrink-0 mt-0.5 px-2 py-0.5 rounded-full whitespace-nowrap ${a.timeBadge}`}>{a.time}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-[#F0F2F5]">
          <p className="text-[12px] text-gray-400 text-center">{allActions.length} total actions pending</p>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Rank Improvement Modal
// ─────────────────────────────────────────────────────────────────────────────

function RankModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(6,11,24,0.5)' }}>
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-[780px] shadow-deep overflow-hidden anim-fade-in-up flex flex-col max-h-[90vh]">

        {/* Sticky Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#F0F2F5] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EEF0FF] flex items-center justify-center">
              <Trophy size={16} className="text-[#5670FB]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-gray-900">How to Improve Your Rank</h3>
              <p className="text-[12px] text-gray-500 mt-0.5">Currently <span className="font-bold text-gray-700">#847</span> · Top 14% PMs in India</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 cursor-pointer transition-colors">
            <X size={13} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">
          <div className="px-7 py-6 space-y-7">

            {/* ── a. Salary Intelligence ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={14} className="text-emerald-500" />
                <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Salary Intelligence</span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-50 rounded-2xl p-4 border border-[#E8ECF0] text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Your Expected Range</p>
                  <p className="text-[28px] font-bold text-gray-900 leading-none">₹52L</p>
                  <p className="text-[11px] text-gray-400 mt-1.5">Based on your profile</p>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Market Average</p>
                  <p className="text-[28px] font-bold text-emerald-600 leading-none">₹68L</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1.5">+31% above your range</p>
                </div>
                <div className="bg-[#EEF0FF] rounded-2xl p-4 border border-[#DDE3FF] text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">Top 10% Earners</p>
                  <p className="text-[28px] font-bold text-[#5670FB] leading-none">₹95L</p>
                  <p className="text-[11px] text-[#5670FB] font-semibold mt-1.5">GPMs at Tier-1 companies</p>
                </div>
              </div>

              <div className="space-y-2">
                {rankSalaryInsights.map((ins, i) => {
                  const Icon = ins.icon
                  return (
                    <div key={i} className={`flex items-start gap-3 px-4 py-3 rounded-xl ${ins.bg}`}>
                      <Icon size={13} className={`${ins.color} shrink-0 mt-0.5`} />
                      <p className="text-[12px] text-gray-700 leading-relaxed">{ins.text}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="border-t border-[#F0F2F5]" />

            {/* ── b. Critical Skill Gaps ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target size={14} className="text-amber-500" />
                <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Critical Skill Gaps</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {rankSkillGaps.map((sg, i) => (
                  <div key={i} className="border border-[#E8ECF0] rounded-2xl p-4 hover:border-[#C8D0FF] transition-all">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-[13px] font-bold text-gray-900 leading-tight">{sg.skill}</p>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 uppercase tracking-wide ${sg.impact === 'High' ? 'text-red-500 bg-red-50' : 'text-amber-600 bg-amber-50'}`}>
                        {sg.impact} Impact
                      </span>
                    </div>
                    <p className="text-[12px] text-gray-500 leading-relaxed mb-3">{sg.desc}</p>
                    <button className="px-3 py-1.5 bg-[#EEF0FF] border border-[#DDE3FF] text-[11px] font-bold text-[#5670FB] rounded-xl hover:bg-[#E0E6FF] cursor-pointer transition-all flex items-center gap-1.5">
                      <ArrowUpRight size={11} />
                      {sg.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#F0F2F5]" />

            {/* ── c. Recommended Next Move ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ArrowUpRight size={14} className="text-[#5670FB]" />
                <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Recommended Next Move</span>
              </div>

              <div className="space-y-3">
                {rankNextMoves.map((m, i) => {
                  const MIcon = m.icon
                  return (
                    <div key={i} className="flex items-center gap-4 p-4 bg-[#F7F8FF] rounded-2xl border border-[#E8ECF0] hover:border-[#C8D0FF] cursor-pointer transition-all">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#E8ECF0] flex items-center justify-center shrink-0 shadow-sm">
                        <MIcon size={16} className="text-[#5670FB]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-bold text-gray-900 mb-0.5">{m.title}</p>
                        <p className="text-[12px] text-gray-500">{m.desc}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[22px] font-bold text-[#5670FB] leading-none">{m.rankImprovement}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">rank improvement</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="border-t border-[#F0F2F5]" />

            {/* ── d. What's Trending ── */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={14} className="text-[#5670FB]" />
                <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">What's Trending</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {rankTrends.map((t, i) => (
                  <div key={i} className="border border-[#E8ECF0] rounded-2xl p-4 hover:border-[#5670FB]/40 hover:bg-[#FAFBFF] cursor-pointer transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-[13px] font-bold text-gray-900 leading-tight">{t.topic}</p>
                      <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap">{t.trend}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-700"
                        style={{ width: `${t.percent}%` }} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1.5">Growth in PM job postings</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export default function Dashboard({ navigate }) {
  const [showAllActions, setShowAllActions] = useState(false)
  const [showRankModal, setShowRankModal] = useState(false)

  const handleNav = (tab, ctx = {}) => navigate && navigate(tab, ctx)

  return (
    <div className="min-h-full bg-[#F5F5F5] p-6">
      <div className="max-w-[1060px] mx-auto space-y-5">

        {/* ── 1. PM Rank Banner ── */}
        <div className="relative bg-gradient-to-br from-[#F0F3FF] via-[#EEF1FF] to-[#E4EAFF] rounded-2xl px-5 py-4 flex items-center justify-between gap-5 border border-[#D5DDFF]">
          {/* Orbs — own overflow-hidden so they don't clip the tooltip */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute top-[-50px] right-[25%] w-[200px] h-[200px] rounded-full bg-[#5670FB]/10 blur-[70px]" />
            <div className="absolute bottom-[-30px] left-[-20px] w-[150px] h-[150px] rounded-full bg-indigo-300/15 blur-[50px]" />
          </div>

          {/* Inline rank row — single line, no wrapping */}
          <div className="relative z-10 flex items-center gap-2.5 flex-1 min-w-0">
            <span className="text-[#1E223C] text-[15px] font-bold whitespace-nowrap shrink-0">#430 rank out of 6.2k Product Managers in India</span>

            {/* Info icon + tooltip */}
            <div className="relative group shrink-0">
              <Info size={14} className="text-gray-400 cursor-pointer hover:text-[#5670FB] transition-colors" />
              <div className="absolute left-0 top-[calc(100%+8px)] w-[320px] bg-[#1E223C] text-white text-[12px] leading-relaxed rounded-2xl px-4 py-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-2xl z-50">
                Rank is calculated using role, skills, salary benchmarks, interview performance signals, recruiter engagement, and career progression patterns based on AmbitionBox's proprietary algorithm.
                <div className="absolute left-4 bottom-full w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-[#1E223C]" />
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowRankModal(true)}
            className="relative z-10 shrink-0 flex items-center gap-1 text-[13px] font-semibold text-[#5670FB] hover:text-[#4560ea] cursor-pointer transition-colors"
          >
            Want to improve rank?
            <ArrowUpRight size={13} />
          </button>
        </div>

        {/* ── 2. AI Insights + Upcoming Actions ── */}
        <div className="grid grid-cols-5 gap-4">

          {/* AI Insights */}
          <div className="col-span-3 bg-white rounded-3xl border border-[#E8ECF0] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-gray-900 leading-snug">
                Profile Performance this week
              </h2>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F0F3FF] rounded-full shrink-0">
                <Sparkles size={11} className="text-[#5670FB]" />
                <span className="text-[11px] font-semibold text-[#5670FB]">AI-Powered Insights</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {insights.map((ins, i) => {
                const Icon = ins.icon
                return (
                  <div key={i} className="rounded-2xl border border-[#E8ECF0] overflow-hidden flex bg-white hover:border-gray-300 transition-colors">
                    <div className={`w-1 ${ins.strip} shrink-0`} />
                    <div className="p-3.5 flex-1">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Icon size={13} className="text-gray-400 shrink-0" />
                        <p className="text-[13px] font-bold text-gray-800 leading-tight">{ins.title}</p>
                      </div>
                      <p className="text-[12px] text-gray-500 leading-relaxed">{ins.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Upcoming Actions */}
          <div className="col-span-2 bg-white rounded-3xl border border-[#E8ECF0] p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-bold text-gray-900">Upcoming Actions</h3>
              <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{allActions.length} pending</span>
            </div>

            <div className="flex-1 space-y-2">
              {allActions.slice(0, 3).map((a, i) => {
                const ActionIcon = a.icon
                const timeColor = a.timeBadge.split(' ').find(c => c.startsWith('text-')) || 'text-gray-400'
                return (
                  <button key={i} onClick={() => handleNav(a.navigate, a.navigateCtx)}
                    className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border border-[#EBEBEB] bg-white hover:border-[#C8D0FF] hover:bg-[#FAFBFF] cursor-pointer transition-all text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#EEF0FF] flex items-center justify-center shrink-0">
                      <ActionIcon size={15} className="text-[#5670FB]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-gray-900 leading-tight">{a.title}</p>
                      <p className="text-[12px] text-gray-400 mt-0.5 truncate">{a.sub}</p>
                    </div>
                    <span className={`text-[12px] font-semibold whitespace-nowrap shrink-0 ${timeColor}`}>{a.time}</span>
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setShowAllActions(true)}
              className="mt-4 w-full py-2.5 rounded-2xl bg-[#F0F3FF] text-[13px] font-bold text-[#5670FB] hover:bg-[#E0E6FF] transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-[#DDE3FF]"
            >
              View all {allActions.length} actions
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* ── 3. Stats Row ── */}
        <div className="grid grid-cols-6 gap-3">
          {stats.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="bg-white rounded-2xl p-4 border border-[#E8ECF0]">
                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center mb-3">
                  <Icon size={16} className="text-gray-400" />
                </div>
                <p className="text-[12px] text-gray-500 font-medium leading-tight mb-1">{s.label}</p>
                <p className="text-[24px] font-bold text-gray-900 leading-none mb-1.5">{s.value}</p>
                <p className={`text-[11px] font-semibold ${s.pos ? 'text-emerald-500' : s.pos === false ? 'text-red-400' : 'text-amber-500'}`}>{s.sub}</p>
              </div>
            )
          })}
        </div>

        {/* ── 4. Job Pipeline ── */}
        <div className="bg-white rounded-3xl border border-[#E8ECF0] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[17px] font-bold text-gray-900">Job Pipeline</h3>
              <p className="text-[13px] text-gray-500 mt-0.5">47 applications across 6 stages</p>
            </div>
            <button onClick={() => handleNav('pipeline')}
              className="flex items-center gap-1 text-[13px] font-semibold text-[#5670FB] hover:underline cursor-pointer">
              Full view <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {pipeline.map(col => (
              <div key={col.id} className="w-[220px] shrink-0">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#F7F8FA] border border-[#E8ECF0] mb-3">
                  <span className="text-[12px] font-bold text-gray-700 flex-1 truncate">{col.title}</span>
                  <span className="text-[11px] font-semibold text-gray-400 bg-white border border-[#E8ECF0] rounded-full w-5 h-5 flex items-center justify-center">{col.count}</span>
                </div>
                <div className="space-y-3 overflow-y-auto scrollbar-thin" style={{ maxHeight: col.cards.length >= 3 ? '330px' : 'none' }}>
                  {col.cards.map((card, i) => (
                    <PipelineCard key={i} card={card} colId={col.id} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. Skills You're Missing (chips) ── */}
        <div className="bg-white rounded-2xl border border-[#E8ECF0] px-5 py-3.5 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 shrink-0">
            <Target size={13} className="text-amber-500" />
            <span className="text-[12px] font-bold text-gray-600 whitespace-nowrap">Skills you're missing</span>
          </div>
          <div className="w-px h-4 bg-gray-200 shrink-0" />
          <div className="flex items-center gap-2 flex-wrap flex-1">
            {missingSkills.map(s => (
              <span key={s.skill}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold border cursor-pointer transition-all hover:opacity-80
                  ${s.severity === 'high'   ? 'text-red-600 bg-red-50 border-red-200'     :
                    s.severity === 'medium' ? 'text-amber-600 bg-amber-50 border-amber-200' :
                                              'text-gray-600 bg-gray-50 border-gray-200'}`}>
                {s.skill}
              </span>
            ))}
          </div>
          <button onClick={() => handleNav('copilot')}
            className="text-[11px] font-semibold text-[#5670FB] hover:underline cursor-pointer flex items-center gap-1 shrink-0">
            Full analysis <ChevronRight size={11} />
          </button>
        </div>

        {/* ── 6. Career Trajectory + Discover Companies ── */}
        <div className="grid grid-cols-2 gap-4">

          {/* Career Trajectory */}
          <div className="bg-white rounded-3xl border border-[#E8ECF0] p-5">
            <div className="flex items-start justify-between mb-1">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={14} className="text-[#5670FB]" />
                  <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">Career Trajectory</span>
                </div>
                <h3 className="text-[16px] font-bold text-gray-900">Where PMs like you go next</h3>
                <p className="text-[12px] text-gray-500">Based on 3,400 similar profiles</p>
              </div>
              <button onClick={() => handleNav('copilot')}
                className="text-[13px] font-semibold text-[#5670FB] hover:underline cursor-pointer flex items-center gap-1">
                Deep dive <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-3 mt-4">
              {trajectory.map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 p-1 overflow-hidden">
                    <img src={t.logo} alt={t.company} className="w-full h-full object-contain"
                      onError={e => { e.target.style.display = 'none' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[13px] font-bold text-gray-800">{t.company}</p>
                      <span className="text-[12px] font-bold text-[#5670FB]">{t.percent}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-0.5">
                      <div className="h-full bg-[#5670FB] rounded-full" style={{ width: `${t.percent * 2.8}%` }} />
                    </div>
                    <p className="text-[11px] text-gray-400">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discover Companies */}
          <div className="bg-white rounded-3xl border border-[#E8ECF0] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[16px] font-bold text-gray-900">Discover Companies</h3>
                <p className="text-[12px] text-gray-500 mt-0.5">Matching your PM profile · Fintech &amp; SaaS</p>
              </div>
              <button className="flex items-center gap-1 text-[13px] font-semibold text-[#5670FB] hover:underline cursor-pointer">
                See all <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {discoverCompanies.map(c => {
                const initial = c.name.charAt(0)
                return (
                  <div key={c.name} className="border border-[#E8ECF0] rounded-2xl p-3 hover:border-[#C8D0FF] hover:bg-[#FAFBFF] cursor-pointer transition-all">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center shrink-0 p-1">
                        <img
                          src={c.logo}
                          alt={c.name}
                          className="w-full h-full object-contain"
                          onError={e => {
                            e.target.style.display = 'none'
                            const el = document.createElement('span')
                            el.className = 'text-gray-600 font-bold text-[14px]'
                            el.textContent = initial
                            e.target.parentNode.appendChild(el)
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-gray-800 truncate">{c.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star size={10} className="text-amber-400 fill-amber-400 shrink-0" />
                          <span className="text-[11px] text-gray-400">{c.rating}</span>
                        </div>
                      </div>
                      <span className="text-[12px] font-bold text-[#5670FB] shrink-0">{c.match}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100 font-medium">{c.tag}</span>
                      <span className="text-[11px] text-gray-500 font-medium">{c.openRoles} roles</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>

      {showAllActions && <AllActionsModal onClose={() => setShowAllActions(false)} onNavigate={handleNav} />}
      {showRankModal && <RankModal onClose={() => setShowRankModal(false)} />}
    </div>
  )
}
