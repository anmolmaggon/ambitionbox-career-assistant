import {
  Trophy, TrendingUp, ChevronRight, Sparkles,
  MessageCircle, Info,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const offers = [
  {
    id: 1, company: 'Swiggy', logo: '/logo-swiggy.png', role: 'Group Product Manager',
    rating: 4.3, location: 'Bengaluru', daysLeft: 5,
    total: 65, base: 42, esop: 15, bonus: 8,
    market: { p25: 52, p50: 62, p75: 72 },
    abReviews: { wlb: 3.8, growth: 4.2, culture: 4.0 },
    negotiated: { count: 8, avgIncrease: 12, message: 'You could push for ₹73L total comp.' },
  },
  {
    id: 2, company: 'Flipkart', logo: '/logo-flipkart.png', role: 'Senior Product Manager',
    rating: 4.1, location: 'Bengaluru', daysLeft: 12,
    total: 58, base: 38, esop: 12, bonus: 8,
    market: { p25: 48, p50: 56, p75: 65 },
    abReviews: { wlb: 3.6, growth: 4.0, culture: 3.9 },
    negotiated: { count: 12, avgIncrease: 8, message: 'You could push for ₹63L total comp.' },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Offer Card
// ─────────────────────────────────────────────────────────────────────────────

function OfferCard({ offer }) {
  // Compute where the offer sits on the p25-p75 distribution
  const range = offer.market.p75 - offer.market.p25
  const offerPercentile = Math.max(5, Math.min(95,
    25 + ((offer.total - offer.market.p25) / range) * 50
  ))

  return (
    <div className="bg-white rounded-3xl border border-[#E8ECF0] overflow-hidden">

      {/* Header */}
      <div className="p-5 bg-gradient-to-br from-emerald-50/60 to-emerald-100/30 border-b border-emerald-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center shrink-0 shadow-sm overflow-hidden p-1.5">
              <img src={offer.logo} alt={offer.company} className="w-full h-full object-contain"
                onError={e => { e.target.style.display='none'; e.target.parentNode.innerHTML=`<span class="text-emerald-600 text-[18px] font-bold">${offer.company.charAt(0)}</span>` }} />
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-bold text-gray-900">{offer.role}</p>
              <p className="text-[12px] text-gray-500">{offer.company} · {offer.location} · ★ {offer.rating}</p>
            </div>
          </div>
          {offer.daysLeft <= 7 && (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-full whitespace-nowrap">
              EXPIRES IN {offer.daysLeft}d
            </span>
          )}
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-[32px] font-bold text-gray-900 leading-none">₹{offer.total}L</span>
          <span className="text-[13px] text-gray-500">Total Comp</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="p-5 border-b border-[#E8ECF0]">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Compensation Breakdown</p>
        <div className="grid grid-cols-3 gap-3">
          <Breakdown label="Base"        value={offer.base}  total={offer.total} />
          <Breakdown label="ESOPs (4yr)" value={offer.esop}  total={offer.total} />
          <Breakdown label="Bonus"       value={offer.bonus} total={offer.total} />
        </div>
      </div>

      {/* Market Benchmark */}
      <div className="p-5 border-b border-[#E8ECF0]">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">vs Market (AmbitionBox)</p>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {Math.round(offerPercentile)}th percentile
          </span>
        </div>

        <div className="relative h-2 bg-gradient-to-r from-red-200 via-amber-200 to-emerald-200 rounded-full mb-2">
          <div
            className="absolute top-1/2 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-md"
            style={{ left: `${offerPercentile}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-500">
          <span>₹{offer.market.p25}L (25th)</span>
          <span>₹{offer.market.p50}L (median)</span>
          <span>₹{offer.market.p75}L (75th)</span>
        </div>
      </div>

      {/* Negotiation Insight */}
      <div className="p-5 bg-[#F0F3FF]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#5670FB] flex items-center justify-center shrink-0">
            <Sparkles size={14} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-gray-900 mb-1">AI Negotiation Insight</p>
            <p className="text-[12px] text-gray-700 leading-relaxed mb-3">
              <span className="font-bold">{offer.negotiated.count} {offer.role.includes('Group') ? 'GPMs' : 'PMs'}</span> at {offer.company} negotiated <span className="font-bold text-[#5670FB]">+{offer.negotiated.avgIncrease}%</span> on average. {offer.negotiated.message}
            </p>
            <div className="flex gap-2 flex-wrap">
              <button className="px-3 py-1.5 bg-[#5670FB] text-white text-[11px] font-bold rounded-xl hover:bg-[#4560ea] cursor-pointer flex items-center gap-1.5 transition-colors">
                <MessageCircle size={11} />
                Get negotiation script
              </button>
              <button className="px-3 py-1.5 bg-white text-[#5670FB] text-[11px] font-bold rounded-xl border border-[#DDE3FF] hover:bg-[#F8F9FF] cursor-pointer transition-colors">
                Counter playbook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Breakdown({ label, value, total }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-3">
      <p className="text-[10px] text-gray-500 mb-1">{label}</p>
      <p className="text-[18px] font-bold text-gray-900 leading-none">₹{value}L</p>
      <p className="text-[10px] text-gray-400 mt-1">{Math.round(value/total*100)}%</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

export default function OfferInsights() {
  return (
    <div className="min-h-full bg-[#F5F5F5] p-6">
      <div className="max-w-[1060px] mx-auto space-y-5">

        {/* ── Summary Stats ── */}
        <div className="grid grid-cols-3 gap-3">
          <SummaryStat icon={Trophy}     iconColor="text-amber-500"   label="Active Offers"        value={offers.length} hint="1 expires in 5 days"  hintColor="text-amber-600" />
          <SummaryStat icon={TrendingUp} iconColor="text-emerald-500" label="Highest TC"           value="₹65L"          hint="Top 24% in market"     hintColor="text-emerald-500" />
          <SummaryStat icon={Sparkles}   iconColor="text-[#5670FB]"   label="Negotiation Headroom" value="+₹8L"          hint="Combined potential"    hintColor="text-[#5670FB]" />
        </div>

        {/* ── Active Offers ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-bold text-gray-900">Your Active Offers</h3>
            <p className="text-[11px] text-gray-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Auto-detected from Gmail · Updated 2 hours ago
            </p>
          </div>
          <div className="space-y-4">
            {offers.map(o => <OfferCard key={o.id} offer={o} />)}
          </div>
        </div>

        {/* ── Compare ── */}
        <div className="bg-white rounded-3xl border border-[#E8ECF0] p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[15px] font-bold text-gray-900">Compare Side-by-Side</h3>
            <button className="text-[12px] font-semibold text-[#5670FB] hover:underline cursor-pointer flex items-center gap-1">
              Full comparison <ChevronRight size={13} />
            </button>
          </div>
          <p className="text-[12px] text-gray-400 mb-4">Beyond just salary — culture, growth, work-life balance from AmbitionBox</p>

          <div className="grid grid-cols-2 gap-3">
            {offers.map(o => (
              <div key={o.id} className="border border-[#E8ECF0] rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#F0F2F5]">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-1">
                    <img src={o.logo} alt={o.company} className="w-full h-full object-contain"
                      onError={e => { e.target.style.display='none'; e.target.parentNode.className='w-10 h-10 rounded-xl bg-[#5670FB] flex items-center justify-center shrink-0'; e.target.parentNode.innerHTML=`<span class="text-white text-[14px] font-bold">${o.company.charAt(0)}</span>` }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-gray-900 truncate">{o.company}</p>
                    <p className="text-[10px] text-gray-500 truncate">{o.role}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Row label="Total Comp"            value={`₹${o.total}L`}        bold />
                  <Row label="Base"                  value={`₹${o.base}L`} />
                  <Row label="ESOPs"                 value={`₹${o.esop}L`} />
                  <Row label="Work-life balance"     value={`${o.abReviews.wlb}★`} />
                  <Row label="Growth opportunities"  value={`${o.abReviews.growth}★`} />
                  <Row label="Culture"               value={`${o.abReviews.culture}★`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Negotiation Tips ── */}
        <div className="bg-white rounded-3xl border border-[#E8ECF0] p-5">
          <div className="flex items-center gap-2 mb-1">
            <Info size={13} className="text-[#5670FB]" />
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Negotiation Playbook</span>
          </div>
          <h3 className="text-[15px] font-bold text-gray-900 mb-4">What worked for PMs like you</h3>

          <div className="grid grid-cols-3 gap-3">
            <Tip
              metric="+18%"
              title="Stack competing offers"
              desc="PMs with 2+ active offers negotiated 18% higher than those with 1."
            />
            <Tip
              metric="62%"
              title="Asked for higher ESOPs"
              desc="62% of GPMs successfully traded base for ESOP grants 1.5× larger."
            />
            <Tip
              metric="3.2x"
              title="Counter joining bonus"
              desc="Joining bonus is the least sticky — counters succeed 3.2× more often than base."
            />
          </div>
        </div>

      </div>
    </div>
  )
}

function SummaryStat({ icon: Icon, iconColor, label, value, hint, hintColor }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E8ECF0]">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={13} className={iconColor} />
        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-[24px] font-bold text-gray-900 leading-none">{value}</p>
      <p className={`text-[11px] ${hintColor} font-semibold mt-1.5`}>{hint}</p>
    </div>
  )
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between items-baseline text-[12px]">
      <span className="text-gray-500">{label}</span>
      <span className={bold ? 'font-bold text-gray-900 text-[14px]' : 'font-semibold text-gray-700'}>{value}</span>
    </div>
  )
}

function Tip({ metric, title, desc }) {
  return (
    <div className="border border-[#E8ECF0] rounded-2xl p-4 hover:border-[#5670FB]/40 cursor-pointer transition-all">
      <div className="text-[24px] font-bold text-[#5670FB] leading-none mb-2">{metric}</div>
      <p className="text-[13px] font-bold text-gray-900 mb-1">{title}</p>
      <p className="text-[11px] text-gray-500 leading-relaxed">{desc}</p>
    </div>
  )
}
