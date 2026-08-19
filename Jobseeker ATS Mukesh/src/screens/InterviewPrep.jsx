import { useState } from 'react'
import {
  ChevronLeft, ChevronRight, Play, BookOpen, MessageSquare,
  Star, TrendingUp, AlertCircle, CheckCircle, Users, Brain,
  Video, Mic, Filter, Sparkles, Info, Lightbulb,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const INTERVIEWS = [
  {
    id: 1,
    company: 'Razorpay',
    logo: '/logo-razorpay.svg',
    role: 'Senior Product Manager',
    dateDetail: 'May 23, 2026 · 2:00 PM IST',
    duration: '60 min',
    round: 2,
    totalRounds: 4,
    roundName: 'Product Design',
    format: 'Virtual · Google Meet',
    daysLeft: 1,
    prepStatus: 'in_progress',
    prepProgress: 65,
    readiness: 78,
    abRating: 4.4,
    interviewer: 'Shashank Kumar (VP Product)',
    interviewDifficulty: 'High',
    avgDuration: '3–4 weeks total',
    passRate: 64,
    roadmap: [
      { title: 'Prepare case study on UPI ecosystem',      sub: 'Razorpay heavily focuses on UPI payments',      priority: 'high'   },
      { title: 'Review your B2B product experience',       sub: 'The role primarily serves business customers',  priority: 'high'   },
      { title: 'Brush up on payment gateway architecture', sub: 'Technical depth expected for senior roles',     priority: 'medium' },
      { title: 'Prepare questions about team structure',   sub: 'Shows leadership interest',                    priority: 'medium' },
    ],
    questions: [
      { q: "How would you improve Razorpay's payment success rate?",       asked: 92, tag: 'Product Strategy', difficulty: 'Hard'   },
      { q: 'Design a feature to reduce payment failures for SMBs',          asked: 85, tag: 'Product Design',   difficulty: 'Medium' },
      { q: 'How do you prioritize features in a B2B payment product?',      asked: 78, tag: 'Prioritization',   difficulty: 'Medium' },
      { q: 'Walk me through a time you launched a successful product',       asked: 88, tag: 'Behavioral',       difficulty: 'Medium' },
      { q: 'How would you measure success for a new payment method?',        asked: 81, tag: 'Metrics',          difficulty: 'Medium' },
    ],
    peerExperiences: [
      { name: 'Priya S.',  role: 'Product Manager', rating: 4, review: 'Very collaborative interview. Focus on product thinking and metrics. System design round was challenging.', helpful: 127 },
      { name: 'Rahul M.',  role: 'Senior PM',        rating: 4, review: 'Interviewers were friendly. Expect deep-dive into payment domain knowledge and past product launches.',     helpful: 93  },
    ],
    resumeGaps: [
      {
        type: 'warning',
        title: 'Limited payment domain experience mentioned',
        sub: 'Razorpay typically expects 2–3 years of fintech or payment experience',
        suggestion: 'Highlight your work on transaction flows in previous roles',
      },
      {
        type: 'positive',
        title: 'Strong B2B product background',
        sub: "Your SaaS experience aligns well with Razorpay's business model",
        suggestion: null,
      },
    ],
  },
  {
    id: 2,
    company: 'Zomato',
    logo: 'https://logo.clearbit.com/zomato.com',
    role: 'Product Lead',
    dateDetail: 'May 26, 2026 · 3:00 PM IST',
    duration: '45 min',
    round: 3,
    totalRounds: 4,
    roundName: 'Product Sense',
    format: 'Virtual · Zoom',
    daysLeft: 4,
    prepStatus: 'in_progress',
    prepProgress: 35,
    readiness: 65,
    abRating: 4.0,
    interviewer: null,
    interviewDifficulty: 'Medium',
    avgDuration: '2–3 weeks total',
    passRate: 58,
    roadmap: [
      { title: 'Study Zomato\'s core product metrics',     sub: 'Focus on GMV, DAU, and restaurant retention',  priority: 'high'   },
      { title: 'Practice product sense frameworks',         sub: 'Problem → User → Solution → Metrics',          priority: 'high'   },
      { title: 'Research quick commerce vs food delivery',  sub: 'Blinkit integration is a key talking point',    priority: 'medium' },
      { title: 'Prepare case study on retention',           sub: 'Zomato prioritizes long-term user engagement',  priority: 'medium' },
    ],
    questions: [
      { q: 'How would you improve Zomato\'s retention for tier-2 cities?', asked: 88, tag: 'Product Strategy', difficulty: 'Hard'   },
      { q: 'Design a loyalty program for frequent food orderers',            asked: 82, tag: 'Product Design',   difficulty: 'Medium' },
      { q: 'How would you reduce cancellations by 20%?',                    asked: 75, tag: 'Metrics',          difficulty: 'Medium' },
    ],
    peerExperiences: [
      { name: 'Ankit S.', role: 'Product Manager', rating: 4, review: 'Interviewers ask a lot about user empathy. Focus on "why" behind product decisions. Case study round was tricky.', helpful: 84 },
      { name: 'Meera R.', role: 'Senior PM',        rating: 3, review: 'Round 3 was product sense heavy. Practice CIRCLES method and have metrics-driven answers ready.', helpful: 61 },
    ],
    resumeGaps: [
      { type: 'warning',  title: 'Consumer product experience not highlighted', sub: 'Zomato prefers candidates with B2C product background', suggestion: 'Add consumer-facing features you\'ve shipped' },
      { type: 'positive', title: 'Strong growth metrics in resume',             sub: 'Your experience with growth funnels is highly relevant', suggestion: null },
    ],
  },
  {
    id: 3,
    company: 'PhonePe',
    logo: '/logo-phonepe.svg',
    role: 'Product Manager II',
    dateDetail: 'May 30, 2026 · 11:00 AM IST',
    duration: '90 min',
    round: 1,
    totalRounds: 5,
    roundName: 'Screening',
    format: 'Virtual · Microsoft Teams',
    daysLeft: 8,
    prepStatus: 'not_started',
    prepProgress: 0,
    readiness: 0,
    abRating: 4.2,
    interviewer: null,
    interviewDifficulty: 'Medium',
    avgDuration: '4–5 weeks total',
    passRate: 72,
    roadmap: [
      { title: 'Research PhonePe\'s product portfolio',     sub: 'UPI, insurance, mutual funds, lending',         priority: 'high'   },
      { title: 'Prepare your 2-minute intro pitch',          sub: 'Highlight fintech and PM experience',           priority: 'high'   },
      { title: 'Review fintech regulatory landscape',        sub: 'RBI guidelines relevant for this role',         priority: 'medium' },
      { title: 'Prepare STAR stories',                       sub: 'Screening rounds test communication skills',    priority: 'medium' },
    ],
    questions: [
      { q: 'Tell me about yourself and why PhonePe?',               asked: 95, tag: 'Introduction', difficulty: 'Easy'   },
      { q: 'Describe your most impactful product decision',          asked: 88, tag: 'Behavioral',   difficulty: 'Medium' },
      { q: 'How do you handle disagreements with stakeholders?',     asked: 76, tag: 'Behavioral',   difficulty: 'Easy'   },
    ],
    peerExperiences: [
      { name: 'Sanjay K.', role: 'PM II',         rating: 4, review: 'Screening was mostly about fit and background. HR was friendly. Be prepared to explain your career transition clearly.', helpful: 52 },
      { name: 'Divya P.',  role: 'Product Manager', rating: 5, review: 'Very structured process. First round is easy — just walk them through your story and show enthusiasm for fintech.', helpful: 39 },
    ],
    resumeGaps: [
      { type: 'positive', title: 'PM experience matches level II requirements', sub: 'Your 4 years of PM experience fits the expected profile', suggestion: null },
      { type: 'warning',  title: 'No fintech domain experience listed',         sub: 'PhonePe strongly prefers fintech domain knowledge',        suggestion: 'Mention any payments-adjacent projects you\'ve led' },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Interview List View
// ─────────────────────────────────────────────────────────────────────────────

function InterviewListView({ onSelect }) {
  return (
    <div className="min-h-full bg-[#F5F5F5] p-6">
      <div className="max-w-[1060px] mx-auto space-y-4">

        {/* Summary row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: '3',   label: 'Upcoming Interviews', sub: 'Next: Tomorrow',           subColor: 'text-red-500'     },
            { value: '78%', label: 'Highest Readiness',   sub: 'Razorpay · System Design', subColor: 'text-emerald-500' },
            { value: '12',  label: 'Mocks Completed',     sub: '+3 this week',             subColor: 'text-[#5670FB]'   },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E8ECF0] px-4 py-3.5">
              <p className="text-[22px] font-bold text-gray-900">{s.value}</p>
              <p className="text-[12px] text-gray-500 font-medium">{s.label}</p>
              <p className={`text-[11px] font-semibold mt-0.5 ${s.subColor}`}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Interview cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-bold text-gray-900">Upcoming Interviews</h3>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E8ECF0] rounded-lg text-[12px] font-medium text-gray-500 hover:border-gray-300 cursor-pointer transition-all">
              <Filter size={11} /> Filter
            </button>
          </div>
          <div className="space-y-3">
            {INTERVIEWS.map(iv => (
              <ListCard key={iv.id} iv={iv} onSelect={onSelect} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

function ListCard({ iv, onSelect }) {
  const urgencyBorder = iv.daysLeft <= 2 ? 'border-red-200'   : iv.daysLeft <= 6 ? 'border-amber-200'  : 'border-[#E8ECF0]'
  const urgencyBg     = iv.daysLeft <= 2 ? 'bg-red-50/30'     : iv.daysLeft <= 6 ? 'bg-amber-50/20'    : 'bg-white'
  const daysColor     = iv.daysLeft <= 2 ? 'text-red-500 bg-red-50' : iv.daysLeft <= 6 ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50'
  const ctaLabel      = iv.prepStatus === 'not_started' ? 'Start Preparing' : 'Continue Prep'
  const progressColor = iv.prepProgress >= 70 ? 'bg-emerald-400' : iv.prepProgress >= 30 ? 'bg-[#5670FB]' : 'bg-gray-300'

  return (
    <div className={`rounded-2xl border ${urgencyBorder} ${urgencyBg} p-4 hover:shadow-md transition-all cursor-pointer`}
      onClick={() => onSelect(iv)}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center shrink-0 p-1.5">
          <img src={iv.logo} alt={iv.company} className="w-full h-full object-contain"
            onError={e => { e.target.style.display = 'none' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-[15px] font-bold text-gray-900">{iv.company}</p>
                <Star size={11} className="text-amber-400 fill-amber-400" />
                <span className="text-[11px] text-gray-500">{iv.abRating}</span>
              </div>
              <p className="text-[13px] text-gray-500 font-medium">{iv.role}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${daysColor}`}>
              {iv.daysLeft === 1 ? 'Tomorrow' : `In ${iv.daysLeft} days`}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-2.5">
            <span>{iv.dateDetail}</span>
            <span>·</span>
            <span className="font-semibold text-[#5670FB]">Round {iv.round}/{iv.totalRounds} · {iv.roundName}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${iv.prepProgress}%` }} />
            </div>
            <span className="text-[11px] font-bold text-gray-500 shrink-0">{iv.prepProgress}% prepared</span>
          </div>
        </div>
        <button
          className="px-4 py-2 bg-[#5670FB] text-white text-[12px] font-bold rounded-xl hover:bg-[#4560ea] transition-colors flex items-center gap-1.5 shrink-0 self-center"
          onClick={e => { e.stopPropagation(); onSelect(iv) }}
        >
          {ctaLabel} <ChevronRight size={12} />
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Single Prep Page
// ─────────────────────────────────────────────────────────────────────────────

function SinglePrepPage({ iv, onBack }) {
  return (
    <div className="min-h-full bg-[#F5F5F5] p-6">
      <div className="max-w-[1060px] mx-auto space-y-4">

        {/* Back */}
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 hover:text-gray-800 cursor-pointer transition-colors">
          <ChevronLeft size={16} /> Back to interviews
        </button>

        {/* ── 1. Blue header ── */}
        <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: '#1741C6' }}>
          <div className="p-6">
            {/* Company + badge */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 p-1.5 overflow-hidden">
                  <img src={iv.logo} alt={iv.company} className="w-full h-full object-contain"
                    onError={e => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = `<span style="color:white;font-size:20px;font-weight:700">${iv.company[0]}</span>` }} />
                </div>
                <div>
                  <h2 className="text-white text-[22px] font-bold leading-tight">{iv.company}</h2>
                  <p className="text-blue-200/80 text-[14px] font-medium">{iv.role}</p>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-full text-[12px] font-bold text-white bg-white/20 whitespace-nowrap">
                {iv.daysLeft === 1 ? 'Tomorrow' : `In ${iv.daysLeft} days`}
              </span>
            </div>

            {/* 4-col info grid */}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-blue-200/60 text-[10px] uppercase tracking-widest font-semibold mb-1">Round</p>
                <p className="text-white text-[14px] font-bold leading-snug">Round {iv.round} – {iv.roundName}</p>
              </div>
              <div>
                <p className="text-blue-200/60 text-[10px] uppercase tracking-widest font-semibold mb-1">Date & Time</p>
                <p className="text-white text-[14px] font-bold leading-snug">{iv.dateDetail.split(' · ')[0]}</p>
                <p className="text-blue-200/70 text-[12px]">{iv.dateDetail.split(' · ')[1]}</p>
              </div>
              <div>
                <p className="text-blue-200/60 text-[10px] uppercase tracking-widest font-semibold mb-1">Total Rounds</p>
                <p className="text-white text-[14px] font-bold">{iv.totalRounds} rounds</p>
                <p className="text-blue-200/70 text-[12px]">Based on AmbitionBox data</p>
              </div>
              <div>
                <p className="text-blue-200/60 text-[10px] uppercase tracking-widest font-semibold mb-1">Time to Prepare</p>
                <p className="text-white text-[14px] font-bold">48 hours</p>
                <p className="text-blue-200/70 text-[12px]">6–8 hours study time</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Footer row */}
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-[13px] text-blue-100/80">
                <Info size={14} />
                Difficulty: <span className="font-bold text-white ml-1">{iv.interviewDifficulty}</span>
              </span>
              {iv.interviewer && (
                <span className="flex items-center gap-1.5 text-[13px] text-blue-100/80">
                  <Users size={14} />
                  Interviewer: <span className="font-bold text-white ml-1">{iv.interviewer}</span>
                </span>
              )}
              <span className="flex items-center gap-1.5 text-[13px] text-blue-100/80">
                <Video size={14} />
                <span className="font-bold text-white">{iv.format}</span>
              </span>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#1741C6] rounded-2xl text-[13px] font-bold cursor-pointer hover:bg-blue-50 transition-colors">
              <Play size={12} fill="#1741C6" /> Start Mock Interview
            </button>
          </div>
        </div>

        {/* ── 2 & 3. Roadmap + Questions — side by side ── */}
        <div className="grid grid-cols-2 gap-4">

          {/* AI Preparation Roadmap */}
          <div className="bg-white rounded-3xl border border-[#E8ECF0] p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#EEF0FF] flex items-center justify-center shrink-0">
                <Sparkles size={16} className="text-[#5670FB]" />
              </div>
              <h3 className="text-[16px] font-bold text-gray-900">AI-Suggested Preparation Roadmap</h3>
            </div>
            <div className="space-y-2.5">
              {iv.roadmap.map((item, i) => (
                <RoadmapItem key={i} item={item} />
              ))}
            </div>
          </div>

          {/* Most Asked Questions */}
          <div className="bg-white rounded-3xl border border-[#E8ECF0] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EEF0FF] flex items-center justify-center shrink-0">
                  <MessageSquare size={16} className="text-[#5670FB]" />
                </div>
                <h3 className="text-[16px] font-bold text-gray-900">Most Asked Questions</h3>
              </div>
              <button className="text-[12px] font-semibold text-[#5670FB] hover:underline cursor-pointer flex items-center gap-1">
                View all <ChevronRight size={13} />
              </button>
            </div>
            <div className="space-y-2.5">
              {iv.questions.map((q, i) => (
                <QuestionItem key={i} q={q} />
              ))}
            </div>
          </div>
        </div>

        {/* ── 4. Take AI Mock Interview (green banner) ── */}
        <div className="bg-emerald-500 rounded-3xl p-6">
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Play size={18} className="text-white" fill="white" />
                </div>
                <h3 className="text-white text-[19px] font-bold">Take AI Mock Interview</h3>
              </div>
              <p className="text-emerald-50/90 text-[13px] mb-3">
                Practice with our AI interviewer and get instant feedback on your answers
              </p>
              <div className="space-y-1.5">
                {['Real-time answer analysis', 'Communication score & suggestions', 'Personalized improvement tips'].map((point, i) => (
                  <div key={i} className="flex items-center gap-2 text-[12px] text-white/90">
                    <CheckCircle size={13} className="text-white shrink-0" />
                    {point}
                  </div>
                ))}
              </div>
            </div>
            <button className="shrink-0 flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-2xl text-[13px] font-bold cursor-pointer hover:bg-emerald-50 transition-colors">
              <Play size={12} fill="#059669" className="text-emerald-600" /> Start Mock Interview
            </button>
          </div>
        </div>

        {/* ── 5 & 6. Peer Experiences + Resume Gap — side by side ── */}
        <div className="grid grid-cols-2 gap-4">

          {/* Peer Interview Experiences */}
          <div className="bg-white rounded-3xl border border-[#E8ECF0] p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#EEF0FF] flex items-center justify-center shrink-0">
                <Users size={16} className="text-[#5670FB]" />
              </div>
              <h3 className="text-[16px] font-bold text-gray-900">Peer Interview Experiences</h3>
            </div>
            <div className="space-y-3">
              {iv.peerExperiences.map((p, i) => (
                <div key={i} className="bg-white border border-[#EBEBEB] rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#EEF0FF] flex items-center justify-center shrink-0">
                      <span className="text-[#5670FB] text-[12px] font-bold">{p.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-gray-900 leading-tight">{p.name}</p>
                      <p className="text-[11px] text-gray-400">{p.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 mb-2.5">
                    {Array.from({ length: 5 }, (_, si) => (
                      <Star key={si} size={12} className={si < p.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                    ))}
                  </div>
                  <p className="text-[12px] text-gray-600 leading-relaxed mb-2.5">{p.review}</p>
                  <p className="text-[11px] text-gray-400">{p.helpful} people found this helpful</p>
                </div>
              ))}
            </div>
          </div>

          {/* Resume Gap Analysis */}
          <div className="bg-white rounded-3xl border border-[#E8ECF0] p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <Lightbulb size={16} className="text-amber-500" />
              </div>
              <h3 className="text-[16px] font-bold text-gray-900">Resume Gap Analysis</h3>
            </div>
            <div className="space-y-3">
              {iv.resumeGaps.map((gap, i) => (
                <div key={i} className="bg-white border border-[#EBEBEB] rounded-2xl overflow-hidden">
                  <div className="flex items-start gap-3 p-4">
                    <div className={`w-1 self-stretch rounded-full shrink-0 ${gap.type === 'warning' ? 'bg-amber-400' : 'bg-[#5670FB]'}`} style={{ minHeight: '100%' }} />
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${gap.type === 'warning' ? 'bg-amber-50' : 'bg-[#EEF0FF]'}`}>
                      {gap.type === 'warning'
                        ? <AlertCircle size={15} className="text-amber-500" />
                        : <CheckCircle size={15} className="text-[#5670FB]" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-gray-900 mb-0.5">{gap.title}</p>
                      <p className="text-[12px] text-gray-500 leading-relaxed">{gap.sub}</p>
                      {gap.suggestion && (
                        <p className="text-[12px] font-semibold text-[#5670FB] mt-2">
                          Suggestion: {gap.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared item components
// ─────────────────────────────────────────────────────────────────────────────

function RoadmapItem({ item }) {
  return (
    <div className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#EBEBEB] bg-white hover:border-[#C8D0FF] hover:bg-[#FAFBFF] cursor-pointer transition-all">
      <div className="w-9 h-9 rounded-xl bg-[#EEF0FF] flex items-center justify-center shrink-0">
        <BookOpen size={15} className="text-[#5670FB]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-gray-900 leading-tight">{item.title}</p>
        <p className="text-[12px] text-gray-400 mt-0.5">{item.sub}</p>
      </div>
      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${item.priority === 'high' ? 'text-red-500 bg-red-50' : 'text-amber-500 bg-amber-50'}`}>
        {item.priority}
      </span>
    </div>
  )
}

function QuestionItem({ q }) {
  return (
    <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-[#EBEBEB] bg-white hover:border-[#C8D0FF] hover:bg-[#FAFBFF] cursor-pointer transition-all group">
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-gray-900 leading-snug mb-1.5">{q.q}</p>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <TrendingUp size={11} className="text-emerald-400" />
            Asked {q.asked}% of time
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">{q.tag}</span>
        </div>
      </div>
      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 whitespace-nowrap ${q.difficulty === 'Hard' ? 'text-red-500 bg-red-50' : q.difficulty === 'Medium' ? 'text-amber-500 bg-amber-50' : 'text-emerald-500 bg-emerald-50'}`}>
        {q.difficulty}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

export default function InterviewPrep({ initialInterviewId }) {
  const initial = initialInterviewId ? INTERVIEWS.find(iv => iv.id === initialInterviewId) ?? null : null
  const [selected, setSelected] = useState(initial)

  return selected
    ? <SinglePrepPage iv={selected} onBack={() => setSelected(null)} />
    : <InterviewListView onSelect={setSelected} />
}
