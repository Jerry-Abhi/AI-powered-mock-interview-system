import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  User, 
  Video, 
  FileText, 
  History, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';

const menuItems = [
  { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/profile', name: 'Profile', icon: User },
  { path: '/dashboard/interview', name: 'Interview', icon: Video },
  { path: '/dashboard/resume', name: 'Resume Analysis', icon: FileText },
  { path: '/dashboard/history', name: 'History', icon: History },
  { path: '/dashboard/analytics', name: 'Analytics', icon: BarChart3 },
  { path: '/dashboard/feedback', name: 'AI Feedback', icon: MessageSquare },
];

const bottomItems = [
  { path: '/dashboard/settings', name: 'Settings', icon: Settings },
  { path: '/signin', name: 'Logout', icon: LogOut, isDanger: true },
];

function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <motion.aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-slate-950/80 backdrop-blur-2xl border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Branding */}
        <div className="h-20 flex items-center justify-between px-8 border-b border-white/10 shrink-0">
          <div className="relative">
            <h2 className="text-3xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-white/50">
              ZIVA
            </h2>
            <div className="absolute inset-0 blur-xl bg-blue-500/30 -z-10 mix-blend-screen"></div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden
                ${isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  )}
                  <item.icon className={`w-5 h-5 relative z-10 transition-transform duration-300 ${isActive ? 'scale-110 text-blue-400' : 'group-hover:scale-110'}`} />
                  <span className="font-medium relative z-10">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 shrink-0 space-y-1 bg-slate-950/50">
          {bottomItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                ${item.isDanger 
                  ? 'text-red-400 hover:bg-red-500/10' 
                  : isActive 
                    ? 'bg-white/10 text-white' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }
              `}
            >
              <item.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </motion.aside>
    </>
  );
}

export default Sidebar;
