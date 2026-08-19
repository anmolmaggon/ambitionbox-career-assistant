import { Plus, MoreHorizontal, ArrowRight, Sparkles, Filter, ChevronRight } from 'lucide-react'

const COLUMNS = [
  {
    id: 'applied', title: 'Applied', color: 'text-blue-600', dot: 'bg-blue-400', headerBg: 'bg-blue-50', count: 12,
    cards: [
      {
        logoUrl: 'https://logo.clearbit.com/google.com',
        role: 'Senior Product Manager', company: 'Google',
        status: 'Applied 3 days ago', aiText: 'Strong alignment with your SaaS background.',
        source: 'LinkedIn', resp: 4, prob: 68, cta: 'Follow up today', ctaColor: 'text-blue-600 bg-blue-50',
      },
      {
        logoUrl: 'https://logo.clearbit.com/zerodha.com',
        role: 'Product Lead', company: 'Zerodha',
        status: 'Applied yesterday', aiText: 'Referral applicants have 3× higher response rate.',
        source: 'Referral', resp: 3, prob: 55, cta: 'Wait for response', ctaColor: 'text-gray-500 bg-gray-50',
      },
    ],
  },
  {
    id: 'viewed', title: 'Recruiter Viewed', color: 'text-cyan-600', dot: 'bg-cyan-400', headerBg: 'bg-cyan-50', count: 8,
    cards: [
      {
        logoUrl: 'https://logo.clearbit.com/razorpay.com',
        role: 'Sr. Product Manager', company: 'Razorpay',
        status: 'Viewed 8 days ago', aiText: 'Fintech recruiters at Razorpay respond within 24h on avg.',
        source: 'Naukri', resp: 2, prob: 45, cta: 'Follow up now', ctaColor: 'text-amber-600 bg-amber-50',
        urgent: true,
      },
    ],
  },
  {
    id: 'shortlisted', title: 'Shortlisted', color: 'text-violet-600', dot: 'bg-violet-400', headerBg: 'bg-violet-50', count: 5,
    cards: [
      {
        logoUrl: 'https://logo.clearbit.com/swiggy.com',
        role: 'Group PM', company: 'Swiggy',
        status: 'Shortlisted 2 days ago', aiText: 'Great fit. Prepare for product thinking round.',
        source: 'Company Portal', resp: 5, prob: 74, cta: 'Prepare now', ctaColor: 'text-violet-600 bg-violet-50',
      },
    ],
  },
  {
    id: 'interviewing', title: 'Interviewing', color: 'text-amber-600', dot: 'bg-amber-400', headerBg: 'bg-amber-50', count: 3,
    cards: [
      {
        logoUrl: 'https://logo.clearbit.com/flipkart.com',
        role: 'Sr. Product Manager', company: 'Flipkart',
        status: 'Interview tomorrow · 2 PM', aiText: 'System design focus expected. Candidates with platform experience excel.',
        source: 'LinkedIn', resp: 5, prob: 71, cta: 'Start prep', ctaColor: 'text-amber-600 bg-amber-50',
        urgent: true,
      },
      {
        logoUrl: 'https://logo.clearbit.com/phonepe.com',
        role: 'Product Manager II', company: 'PhonePe',
        status: 'Round 2 · Thursday', aiText: 'Strong product sense shown in Round 1. Focus on metrics.',
        source: 'Recruiter', resp: 4, prob: 62, cta: 'Prepare Round 2', ctaColor: 'text-blue-600 bg-blue-50',
      },
    ],
  },
  {
    id: 'offer', title: 'Offer', color: 'text-emerald-600', dot: 'bg-emerald-400', headerBg: 'bg-emerald-50', count: 2,
    cards: [
      {
        logoUrl: 'https://logo.clearbit.com/swiggy.com',
        role: 'Group PM', company: 'Swiggy',
        status: 'Offer · ₹55 LPA · 92nd %ile', aiText: 'Consider negotiating. Market supports ₹58–62 LPA for your profile.',
        source: 'Direct', resp: 5, prob: 95, cta: 'Negotiate with AI', ctaColor: 'text-emerald-600 bg-emerald-50',
        isOffer: true,
      },
    ],
  },
]

function ResponsiveBar({ score }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <div key={s} className={`w-3 h-1 rounded-full ${s <= score ? 'bg-emerald-400' : 'bg-gray-100'}`} />
      ))}
    </div>
  )
}

function PipelineCard({ card }) {
  return (
    <div className={`bg-white rounded-2xl p-4 shadow-card border transition-all cursor-pointer hover:shadow-elevated hover:-translate-y-0.5 ${
      card.urgent ? 'border-amber-200/80' : card.isOffer ? 'border-emerald-200/80' : 'border-[#E8ECF0]'
    }`}>
      {card.urgent && (
        <div className="flex items-center gap-1 mb-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 anim-dot-pop" />
          <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide">Needs attention</span>
        </div>
      )}
      {card.isOffer && (
        <div className="flex items-center gap-1 mb-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 anim-glow" />
          <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide">Offer received</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0 overflow-hidden p-1">
          <img src={card.logoUrl} alt={card.company} className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-gray-800 truncate leading-tight">{card.role}</p>
          <p className="text-[11px] text-gray-400">{card.company}</p>
        </div>
        <button className="text-gray-300 hover:text-gray-500 transition-colors cursor-pointer mt-0.5">
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* Status */}
      <p className="text-[11px] text-gray-400 mb-2.5">{card.status}</p>

      {/* AI text */}
      <div className="flex items-start gap-1.5 bg-gray-50 rounded-xl p-2.5 mb-3">
        <Sparkles size={11} className="text-violet-400 mt-0.5 shrink-0" />
        <p className="text-[11px] text-gray-500 leading-relaxed">{card.aiText}</p>
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-gray-400 font-medium">Response</span>
          <ResponsiveBar score={card.resp} />
        </div>
        <div className="flex items-center gap-1">
          <Sparkles size={9} className="text-violet-400" />
          <span className={`text-[10px] font-semibold ${
            card.prob >= 70 ? 'text-emerald-500' : card.prob >= 50 ? 'text-amber-500' : 'text-gray-400'
          }`}>{card.prob}% match</span>
        </div>
      </div>

      {/* CTA */}
      <button className={`w-full py-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${card.ctaColor}`}>
        {card.cta} <ArrowRight size={11} />
      </button>
    </div>
  )
}

export default function Pipeline() {
  return (
    <div className="min-h-full bg-[#F7F8FA] p-8 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">Job Pipeline</h1>
          <p className="text-sm text-gray-400 mt-0.5">Track every opportunity — nothing falls through the cracks</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8ECF0] rounded-xl text-sm text-gray-500 hover:bg-gray-50 shadow-card cursor-pointer transition-all">
            <Filter size={13} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 grad-primary text-white text-sm font-semibold rounded-xl shadow-blue cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all">
            <Plus size={14} />
            Add Job
          </button>
        </div>
      </div>

      {/* Kanban */}
      <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin flex-1">
        {COLUMNS.map(col => (
          <div key={col.id} className="w-[268px] shrink-0 flex flex-col">

            {/* Column header */}
            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl ${col.headerBg} mb-3`}>
              <div className={`w-2 h-2 rounded-full ${col.dot}`} />
              <span className={`text-[12px] font-semibold ${col.color} flex-1`}>{col.title}</span>
              <span className={`text-[10px] font-bold ${col.color} opacity-60`}>{col.count}</span>
            </div>

            {/* Cards */}
            <div className="flex-1 space-y-3">
              {col.cards.map((card, i) => (
                <PipelineCard key={i} card={card} />
              ))}
              <button className="w-full py-3.5 rounded-2xl border-2 border-dashed border-[#E8ECF0] text-gray-300 hover:border-[#D0D5DD] hover:text-gray-400 text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1">
                <Plus size={12} /> Add job
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
