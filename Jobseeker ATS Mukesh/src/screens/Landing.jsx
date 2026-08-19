import { Eye, Lock, RotateCcw } from 'lucide-react'

const floatingCards = [
  {
    id: 1, pos: 'top-[14%] left-[5%]', anim: 'anim-float-1',
    dot: 'bg-blue-400', logo: '/logo-hdfc.png',
    company: 'HDFC Bank', text: 'Recruiter viewed your resume', time: '2 min ago',
  },
  {
    id: 2, pos: 'top-[10%] right-[5%]', anim: 'anim-float-2',
    dot: 'bg-emerald-400', logo: '/logo-flipkart.png',
    company: 'Flipkart', text: 'Interview tomorrow at 2 PM', time: '15 min ago',
  },
  {
    id: 3, pos: 'bottom-[20%] left-[4%]', anim: 'anim-float-3',
    dot: 'bg-purple-400', logo: null, icon: '✨', iconBg: 'bg-purple-50',
    company: 'AI Insight', text: 'Strong traction in fintech roles', time: 'Just now',
  },
  {
    id: 4, pos: 'bottom-[18%] right-[4%]', anim: 'anim-float-4',
    dot: 'bg-amber-400', logo: '/logo-swiggy.png',
    company: 'Swiggy', text: 'Offer letter detected · 45 LPA', time: '1 hour ago',
  },
]

function FloatingCard({ card }) {
  return (
    <div className={`absolute ${card.pos} ${card.anim} w-[240px] bg-white rounded-2xl p-3.5 z-10 shadow-elevated border border-[#F0F2F8]`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 overflow-hidden ${card.logo ? 'bg-white border border-gray-100 shadow-sm p-1' : card.iconBg + ' text-[17px]'}`}>
          {card.logo
            ? <img src={card.logo} alt={card.company} className="w-full h-full object-contain" onError={e => { e.target.parentNode.className = `w-9 h-9 rounded-xl ${card.iconBg || 'bg-gray-50'} flex items-center justify-center shrink-0 text-[17px]`; e.target.replaceWith(Object.assign(document.createTextNode('🏢'))) }} />
            : card.icon
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-gray-800 text-xs font-semibold">{card.company}</span>
            <div className={`w-1.5 h-1.5 rounded-full ${card.dot} anim-glow shrink-0`} />
          </div>
          <p className="text-gray-500 text-xs leading-relaxed">{card.text}</p>
          <p className="text-gray-400 text-[10px] mt-1">{card.time}</p>
        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" className="shrink-0">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.05 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-3.55-13.45-8.71l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

export default function Landing({ onContinue }) {
  return (
    <div className="h-full bg-[#F7F8FA] relative overflow-hidden flex flex-col items-center justify-center">

      {/* Background ambient orbs — concentrated at top so text area stays clean */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="anim-orb-1 absolute top-[-8%] left-[10%] w-[560px] h-[560px] rounded-full bg-blue-200/45 blur-[100px]" />
        <div className="anim-orb-2 absolute top-[-5%] right-[8%] w-[460px] h-[460px] rounded-full bg-indigo-200/40 blur-[90px]" />
        <div className="anim-orb-3 absolute top-[8%] left-[38%] w-[340px] h-[340px] rounded-full bg-cyan-200/30 blur-[80px]" />
      </div>

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid-light pointer-events-none" />

      {/* Floating activity cards */}
      {floatingCards.map(c => <FloatingCard key={c.id} card={c} />)}

      {/* Hero */}
      <div className="relative z-10 text-center max-w-[680px] px-6 flex flex-col items-center">

        {/* Live badge */}
        <div className="anim-fade-in inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#E8ECF0] rounded-full mb-7 shadow-card">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 anim-glow" />
          <span className="text-gray-500 text-xs font-medium">Completely Free · Trusted by 1cr+ people</span>
        </div>

        {/* Headline */}
        <h1 className="anim-fade-in-up-1 text-[42px] leading-[1.15] font-bold text-[#1E223C] mb-5 tracking-tight">
          Job hunting is already hard.<br />
          <span className="text-grad-blue">Keeping track of it shouldn't be.</span>
        </h1>

        {/* Sub */}
        <p className="anim-fade-in-up-2 text-gray-500 text-[17px] leading-relaxed mb-9 max-w-[500px]">
          Our system helps you track jobs from all the platforms, prepare smarter, negotiate better, and make confident career decisions.
        </p>

        {/* CTA */}
        <div className="anim-fade-in-up-3 flex flex-col items-center gap-4">
          <button
            onClick={onContinue}
            className="flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-2xl font-semibold text-[15px] shadow-deep cursor-pointer hover:bg-gray-50 active:scale-[0.98] transition-all duration-150 border border-gray-200"
          >
            <GoogleIcon />
            Continue with Gmail
          </button>
          <p className="text-gray-400 text-xs text-center max-w-[280px] leading-relaxed">
            Only job-related emails are analyzed. Fully encrypted. Never shared.
          </p>
        </div>

        {/* Trust indicators */}
        <div className="anim-fade-in-up-4 flex items-center gap-7 mt-9">
          {[
            { icon: <Eye size={13} />,        label: 'Read-only access' },
            { icon: <Lock size={13} />,       label: 'Never shared' },
            { icon: <RotateCcw size={13} />,  label: 'Revoke anytime' },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-1.5 text-gray-600">
              {t.icon}
              <span className="text-[12px] font-semibold">{t.label}</span>
            </div>
          ))}
        </div>
      </div>


    </div>
  )
}
