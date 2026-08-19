import { useState } from 'react'
import {
  Home as HomeIcon, Building2, MessageCircle, Banknote, HelpCircle, Briefcase,
  ChevronDown, ChevronUp, Layers, Calculator, Scale, FileText, Percent, TrendingUp,
  Trophy, Building, PenLine, Reply, UserPlus, LayoutGrid, BookOpen, Info, Users,
  Mail, ArrowRight,
} from 'lucide-react'

const imgQrCode = '/qr-app.png'

// ── Primitives ──────────────────────────────────────────────────────────────

function NavItem({ icon: Icon, label, active }) {
  return (
    <div className="px-3 py-[2px] w-full">
      <div className={`flex gap-2 items-center px-[10px] py-2 rounded-[8px] w-full cursor-pointer transition-colors ${
        active ? 'bg-[#DEE2FC]' : 'hover:bg-[#F5F6FA]'
      }`}>
        {Icon && (
          <Icon
            size={20}
            strokeWidth={1.6}
            className={active ? 'text-[#495AC8] shrink-0' : 'text-[#414141] shrink-0'}
          />
        )}
        <span className={`text-[14px] font-semibold leading-5 truncate ${active ? 'text-[#495AC8]' : 'text-[#414141]'}`}>
          {label}
        </span>
      </div>
    </div>
  )
}

function SectionHeader({ label, expanded, onToggle }) {
  return (
    <div className="px-3 py-[2px] w-full">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-[10px] py-2 rounded-[8px] w-full cursor-pointer hover:bg-[#F5F6FA] transition-colors"
      >
        <span className="flex-1 text-[12px] font-semibold uppercase text-[#7C7C7C] tracking-[0.4px] leading-4 text-left">
          {label}
        </span>
        {expanded
          ? <ChevronUp   size={18} className="text-[#7C7C7C] shrink-0" strokeWidth={1.8} />
          : <ChevronDown size={18} className="text-[#7C7C7C] shrink-0" strokeWidth={1.8} />
        }
      </button>
    </div>
  )
}

function Divider() {
  return <div className="h-[1px] bg-[#E9E9E9] my-1" />
}

// ── Specialised items ────────────────────────────────────────────────────────

function CommunityItem({ color, initials, label, hasNew }) {
  return (
    <div className="px-3 py-[2px] w-full">
      <div className="flex gap-2 items-center px-[10px] py-2 rounded-[8px] w-full cursor-pointer hover:bg-[#F5F6FA] transition-colors">
        <div className={`w-5 h-5 rounded-[4px] ${color} flex items-center justify-center shrink-0 border border-white/20`}>
          <span className="text-white text-[9px] font-bold">{initials}</span>
        </div>
        <span className="text-[14px] font-semibold text-[#414141] flex-1 truncate">{label}</span>
        {hasNew && (
          <div className="relative w-4 h-4 shrink-0">
            <div className="absolute inset-0 rounded-full bg-blue-200 opacity-60 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-[4px] rounded-full bg-blue-500" />
          </div>
        )}
      </div>
    </div>
  )
}

function AbecaIcon({ digits }) {
  return (
    <div className="flex items-center justify-center shrink-0 p-[2px]">
      <div className="border-[1.5px] border-[#414141] rounded-[2px] w-4 h-4 flex items-center justify-center">
        <span className="text-[10px] font-bold italic text-[#414141] leading-none">{digits}</span>
      </div>
    </div>
  )
}

function ResultsSoonBadge() {
  return (
    <div
      className="flex items-center justify-center px-[4px] py-[2px] rounded-[4px] shrink-0 overflow-hidden relative"
      style={{ background: 'linear-gradient(93deg, #CB5BB2 2.1%, #F3747B 95.9%)' }}
    >
      {/* shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmerMove_2.5s_infinite]" />
      <span className="text-[9px] font-semibold text-white uppercase tracking-[0.4px] whitespace-nowrap relative z-10">
        Results soon
      </span>
    </div>
  )
}

function ShowMoreItem() {
  return (
    <div className="px-3 py-[2px] w-full">
      <div className="flex gap-2 items-center px-[10px] py-2 rounded-[8px] w-full cursor-pointer hover:bg-[#F5F6FA] transition-colors">
        <ChevronDown size={20} className="text-[#414141] shrink-0" strokeWidth={1.6} />
        <span className="text-[14px] font-semibold text-[#414141]">Show more</span>
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function ABLeftNav() {
  const [open, setOpen] = useState({
    communities: true,
    tools: true,
    awards: true,
    employers: true,
    more: true,
  })

  const toggle = key => setOpen(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <aside
      className="w-[256px] bg-white border-r border-[#E9E9E9] flex flex-col h-full shrink-0"
      style={{ fontFamily: "'Figtree', sans-serif" }}
    >
      {/* ── Scrollable nav content ── */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">

        {/* Main nav — no section header */}
        <div className="pt-3 pb-1">
          <NavItem icon={HomeIcon}    label="Home"               active />
          <NavItem icon={Building2}   label="Companies" />
          <NavItem icon={MessageCircle} label="Reviews" />
          <NavItem icon={Banknote}    label="Salaries" />
          <NavItem icon={HelpCircle}  label="Interview Questions" />
          <NavItem icon={Briefcase}   label="Jobs" />
        </div>

        <Divider />

        {/* Communities */}
        <SectionHeader label="Communities" expanded={open.communities} onToggle={() => toggle('communities')} />
        {open.communities && (
          <>
            <CommunityItem color="bg-[#E65C00]" initials="IE" label="InfoEdge" />
            <CommunityItem color="bg-[#2E7D32]" initials="D"  label="Design" />
            <CommunityItem color="bg-[#B71C1C]" initials="DO" label="Daily Office Life" />
            <ShowMoreItem />
          </>
        )}

        <Divider />

        {/* Tools */}
        <SectionHeader label="Tools" expanded={open.tools} onToggle={() => toggle('tools')} />
        {open.tools && (
          <>
            <NavItem icon={Layers}      label="Compare Companies" />
            <NavItem icon={Calculator}  label="Salary Calculator" />
            <NavItem icon={Scale}       label="Are you paid fairly?" />
            <NavItem icon={FileText}    label="Evaluate Offer Letter" />
            <NavItem icon={Percent}     label="Gratuity Calculator" />
            <NavItem icon={HomeIcon}    label="HRA Calculator" />
            <NavItem icon={TrendingUp}  label="Salary Hike Calculator" />
          </>
        )}

        <Divider />

        {/* Awards */}
        <SectionHeader label="Awards" expanded={open.awards} onToggle={() => toggle('awards')} />
        {open.awards && (
          <>
            {/* ABECA 2026 */}
            <div className="px-3 py-[2px] w-full">
              <div className="flex gap-2 items-center px-[10px] py-2 rounded-[8px] w-full cursor-pointer hover:bg-[#F5F6FA] transition-colors">
                <AbecaIcon digits="26" />
                <span className="text-[14px] font-semibold text-[#414141] flex-1 truncate">ABECA 2026</span>
                <ResultsSoonBadge />
              </div>
            </div>
            {/* ABECA 2025 */}
            <div className="px-3 py-[2px] w-full">
              <div className="flex gap-2 items-center px-[10px] py-2 rounded-[8px] w-full cursor-pointer hover:bg-[#F5F6FA] transition-colors">
                <AbecaIcon digits="25" />
                <span className="text-[14px] font-semibold text-[#414141]">ABECA 2025</span>
              </div>
            </div>
            {/* ABECA 2024 */}
            <div className="px-3 py-[2px] w-full">
              <div className="flex gap-2 items-center px-[10px] py-2 rounded-[8px] w-full cursor-pointer hover:bg-[#F5F6FA] transition-colors">
                <AbecaIcon digits="24" />
                <span className="text-[14px] font-semibold text-[#414141]">ABECA 2024</span>
              </div>
            </div>
            {/* Participate link */}
            <div className="pl-[22px] pr-[6px] py-3 w-full">
              <a href="#" className="flex items-center gap-1 text-[14px] font-semibold text-[#5670FB] whitespace-nowrap hover:underline">
                Participate in ABECA 2027
                <ArrowRight size={16} className="text-[#5670FB]" />
              </a>
            </div>
          </>
        )}

        <Divider />

        {/* For Employers */}
        <SectionHeader label="For Employers" expanded={open.employers} onToggle={() => toggle('employers')} />
        {open.employers && (
          <>
            <NavItem icon={Building}   label="Create Company Profile" />
            <NavItem icon={PenLine}    label="Edit Company Profile" />
            <NavItem icon={Reply}      label="Respond to reviews" />
            <NavItem icon={UserPlus}   label="Invite employees to review" />
            <NavItem icon={LayoutGrid} label="Employer Offerings" />
            <NavItem icon={BookOpen}   label="Employer Brochure" />
          </>
        )}

        <Divider />

        {/* More */}
        <SectionHeader label="More" expanded={open.more} onToggle={() => toggle('more')} />
        {open.more && (
          <>
            <NavItem icon={Info}  label="About Us" />
            <NavItem icon={Users} label="Our Team" />
            <NavItem icon={Mail}  label="Email Us" />
          </>
        )}

        <Divider />

        {/* Footer links */}
        <div className="flex flex-wrap gap-x-[10px] gap-y-2 px-[22px] py-3">
          {['Privacy','Grievances','Terms of Use','Community Guidelines','Credits','Summons/Notices','Blog','FAQ'].map(link => (
            <a key={link} href="#" className="text-[12px] font-semibold text-[#5E6B92] underline whitespace-nowrap hover:text-[#414141]">
              {link}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="px-[22px] pb-4">
          <p className="text-[12px] text-[#5E6B92] leading-4">
            All rights reserved © 2026 Info Edge (India) Ltd.
          </p>
        </div>

      </div>

      {/* ── Pinned bottom: QR card ── */}
      <div className="shrink-0 bg-white p-4 border-t border-[#E9E9E9]">
        <div
          className="flex gap-2 items-center border border-[#EBF0F6] rounded-[8px] p-[4px]"
          style={{ background: 'linear-gradient(-44deg, #fff 23.7%, rgba(255,255,255,0.6) 116.4%)' }}
        >
          <p className="flex-1 text-[13px] font-semibold text-[#1E223C] leading-5 pl-3 pr-1">
            Download the ambitionbox app to stay updated
          </p>
          <div className="bg-white rounded-[3.6px] w-[72px] h-[72px] shrink-0 overflow-hidden flex items-center justify-center">
            <img src={imgQrCode} alt="QR Code" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </aside>
  )
}
