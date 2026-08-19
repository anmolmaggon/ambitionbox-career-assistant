import { useState } from 'react'
import { X, Eye, Lock, RotateCcw, ChevronRight, UserPlus } from 'lucide-react'

// ── Google brand assets ──────────────────────────────────────────────────────

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" className="shrink-0">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.05 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-3.55-13.45-8.71l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

function GoogleWordmark() {
  return (
    <svg width="66" height="22" viewBox="0 0 66 22" aria-label="Google">
      <text y="18" fontSize="20" fontWeight="500" fontFamily="Arial, Helvetica, sans-serif">
        <tspan fill="#4285F4">G</tspan>
        <tspan fill="#EA4335">o</tspan>
        <tspan fill="#FBBC05">o</tspan>
        <tspan fill="#4285F4">g</tspan>
        <tspan fill="#34A853">l</tspan>
        <tspan fill="#EA4335">e</tspan>
      </text>
    </svg>
  )
}

const trust = [
  { icon: Eye,        label: 'Read-only access' },
  { icon: Lock,       label: 'Never shared' },
  { icon: RotateCcw,  label: 'Revoke anytime' },
]

// ── Step 2: Google account picker ────────────────────────────────────────────

function GoogleAccountPicker({ onSelect, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 anim-fade-in"
      style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[380px] overflow-hidden anim-fade-in-up"
        style={{ fontFamily: "'Inter', Arial, sans-serif" }}
      >
        {/* Google header */}
        <div className="flex flex-col items-center pt-8 pb-5 px-8 border-b border-[#E8EAED]">
          <GoogleWordmark />
          <h2 className="text-[22px] font-normal text-[#202124] mt-5 mb-0.5">Sign in</h2>
          <p className="text-[14px] text-[#202124]">to continue to AmbitionBox</p>
        </div>

        {/* Accounts */}
        <div className="px-3 py-2">

          {/* Primary account */}
          <button
            onClick={onSelect}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#F8F9FA] transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#1a73e8] flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-white font-medium text-[16px]">M</span>
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-[14px] font-medium text-[#202124] leading-tight">Mukesh Bisht</p>
              <p className="text-[12px] text-[#5F6368]">mukesh.bisht@gmail.com</p>
            </div>
            <ChevronRight size={17} className="text-[#5F6368] shrink-0 group-hover:text-[#202124] transition-colors" />
          </button>

          {/* Use another account */}
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#F8F9FA] transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-[#F1F3F4] border border-[#E8EAED] flex items-center justify-center shrink-0">
              <UserPlus size={17} className="text-[#5F6368]" />
            </div>
            <p className="text-[14px] text-[#202124]">Use another account</p>
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F8F9FA] border-t border-[#E8EAED]">
          <p className="text-[11.5px] text-[#5F6368] text-center leading-relaxed">
            To continue, Google will share your name, email address, and profile picture with AmbitionBox. See AmbitionBox's{' '}
            <a href="#" className="text-[#1a73e8] hover:underline">Privacy Policy</a>
            {' '}and{' '}
            <a href="#" className="text-[#1a73e8] hover:underline">Terms of Service</a>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Step 1: Consent modal ────────────────────────────────────────────────────

export default function GmailConnect({ onConnect, onClose, skipConsent = false }) {
  const [step, setStep] = useState(skipConsent ? 'google' : 'consent')

  if (step === 'google') {
    return <GoogleAccountPicker onSelect={onConnect} onClose={onClose} />
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 anim-fade-in"
      style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(6, 11, 24, 0.55)' }}
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-3xl w-full max-w-[420px] anim-fade-in-up shadow-deep overflow-hidden">

        {/* Orbs — top gradient matching landing page */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-70px] left-[-50px]  w-[300px] h-[300px] bg-blue-200/65   rounded-full blur-[75px]" />
          <div className="absolute top-[-60px] right-[-40px] w-[260px] h-[260px] bg-indigo-200/60 rounded-full blur-[70px]" />
          <div className="absolute top-[0px]   left-[28%]    w-[220px] h-[220px] bg-cyan-200/45   rounded-full blur-[65px]" />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-600 transition-all cursor-pointer shadow-sm"
        >
          <X size={13} />
        </button>

        {/* Content */}
        <div className="relative z-10 px-8 pt-9 pb-7 flex flex-col items-center text-center">

          <img src="/ambitionbox-logo.svg" alt="AmbitionBox" className="h-7 w-auto mb-5" />

          <h2 className="text-[21px] font-bold text-gray-900 leading-tight mb-2.5">
            We'll organise the hard part for you.
          </h2>

          <p className="text-[14px] text-gray-500 leading-relaxed mb-7 max-w-[310px]">
            We securely identify job-related emails like applications, recruiter replies, interviews, and offer letters — so you never lose track again.
          </p>

          {/* CTA */}
          <button
            onClick={() => setStep('google')}
            className="flex items-center justify-center gap-3 px-8 py-3.5 text-white rounded-2xl font-semibold text-[14px] w-full mb-6 cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-deep"
            style={{ backgroundColor: '#1e40af' }}
          >
            <div className="w-[22px] h-[22px] bg-white rounded-full flex items-center justify-center shrink-0">
              <GoogleG />
            </div>
            Securely Connect Gmail
          </button>

          {/* Trust strip */}
          <div className="flex items-center justify-center gap-5 pt-4 border-t border-gray-100 w-full">
            {trust.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon size={11} className="text-[#1e40af] shrink-0" />
                <span className="text-[11px] text-gray-400 font-medium">{label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
