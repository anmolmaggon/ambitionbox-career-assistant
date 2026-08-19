import { LayoutDashboard, Kanban, GraduationCap, Trophy, MessageCircle, Bell, Settings, ChevronRight } from 'lucide-react'

const NAV = [
  { id: 'home',      label: 'Home',          icon: LayoutDashboard },
  { id: 'pipeline',  label: 'Pipeline',       icon: Kanban },
  { id: 'interview', label: 'Interview Prep', icon: GraduationCap },
  { id: 'offers',    label: 'Offer Insights', icon: Trophy },
  { id: 'copilot',   label: 'AI Copilot',     icon: MessageCircle },
]

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="w-[240px] bg-white border-r border-[#E8ECF0] flex flex-col h-full shrink-0">

      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl grad-primary flex items-center justify-center shadow-blue">
            <span className="text-white font-bold text-[11px]">JM</span>
          </div>
          <div>
            <p className="text-[14px] font-semibold text-gray-800 leading-none">JobMate</p>
            <p className="text-[10px] text-gray-400 mt-0.5">by AmbitionBox</p>
          </div>
        </div>
      </div>

      {/* AI status */}
      <div className="px-3 pb-3">
        <div className="bg-blue-50/70 rounded-xl px-3.5 py-3 border border-blue-100/60">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 anim-glow" />
            <span className="text-[11px] font-semibold text-blue-700">JobMate is watching</span>
          </div>
          <p className="text-[11px] text-blue-600/70 leading-relaxed">3 new signals detected today</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-1">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-wider px-3 mb-2">Workspace</p>
        {NAV.map(item => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#1A3C6E] text-white shadow-blue'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <Icon size={16} strokeWidth={isActive ? 2 : 1.6} />
              <span className="text-[13px] font-medium flex-1">{item.label}</span>
              {isActive && <ChevronRight size={13} className="opacity-50" />}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-3 space-y-0.5">
        <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all text-left cursor-pointer">
          <Bell size={15} strokeWidth={1.5} />
          <span className="text-[13px] font-medium flex-1">Notifications</span>
          <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">3</span>
        </button>
        <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all text-left cursor-pointer">
          <Settings size={15} strokeWidth={1.5} />
          <span className="text-[13px] font-medium">Settings</span>
        </button>
      </div>

      {/* User */}
      <div className="px-4 py-3.5 border-t border-[#E8ECF0]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full grad-primary flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-semibold">M</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-gray-700 truncate">Mukesh Bisht</p>
            <p className="text-[10px] text-gray-400 truncate">Product Manager</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
