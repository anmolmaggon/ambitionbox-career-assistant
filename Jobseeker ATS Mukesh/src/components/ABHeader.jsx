import { Search, Bell, Plus, ChevronDown } from 'lucide-react'

export default function ABHeader() {
  return (
    <header
      className="shrink-0 bg-white border-b border-[#E9E9E9] flex items-center justify-between pl-4 pr-[43px] h-[60px] z-40"
      style={{ fontFamily: "'Figtree', sans-serif" }}
    >
      {/* AmbitionBox logo */}
      <div className="shrink-0 flex items-center h-8">
        <img src="/ambitionbox-logo.svg" alt="AmbitionBox" className="h-7 w-auto object-contain" />
      </div>

      {/* Search bar */}
      <div className="flex items-center bg-white border border-[#7C7C7C] rounded-full h-9 w-[560px] px-3 gap-2"
           style={{ boxShadow: '0 0 12px rgba(95,95,95,0.1)' }}>
        {/* Search area */}
        <div className="flex flex-1 items-center gap-3 min-w-0">
          <Search size={16} className="text-[#4E597B] shrink-0" strokeWidth={1.8} />
          <span className="text-[14px] text-[#4E597B] font-normal truncate">Search Company</span>
        </div>
        {/* Divider + product dropdown */}
        <div className="border-l border-[#E9E9E9] pl-4 flex items-center gap-2 shrink-0 w-[162px]">
          <span className="text-[14px] text-[#4E597B] font-normal flex-1">Review</span>
          <ChevronDown size={14} className="text-[#4E597B] shrink-0" strokeWidth={1.8} />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Contribute */}
        <button className="flex items-center gap-1.5 bg-[#5670FB] text-white rounded-full px-4 py-2 text-[14px] font-bold cursor-pointer hover:bg-[#4560ea] transition-colors">
          <Plus size={16} strokeWidth={2.5} />
          Contribute
        </button>

        {/* Notification bell */}
        <button className="border border-[#E9E9E9] rounded-2xl p-2 cursor-pointer hover:bg-[#F5F6FA] transition-colors">
          <Bell size={16} className="text-[#414141]" strokeWidth={1.5} />
        </button>

        {/* User avatar — Mukesh Bisht */}
        <button className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-[#1a73e8] flex items-center justify-center shrink-0">
            <span className="text-white font-semibold text-[15px]">M</span>
          </div>
          <div className="text-left">
            <p className="text-[12px] font-semibold text-[#414141] leading-tight">Mukesh Bisht</p>
            <p className="text-[10px] text-[#7C7C7C] leading-tight">Product Manager</p>
          </div>
          <ChevronDown size={14} className="text-[#7C7C7C] shrink-0" />
        </button>
      </div>
    </header>
  )
}
