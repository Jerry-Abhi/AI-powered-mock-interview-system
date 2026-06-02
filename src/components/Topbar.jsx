import React, { useState } from 'react';
import { Menu, Search, Bell, ChevronDown, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Topbar({ setIsOpen }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const getInitials = (name) => {
    return name ? name.split(' ')[0][0].toUpperCase() : 'U';
  };

  return (
    <header className="h-20 bg-slate-950/50 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => setIsOpen(true)}
          className="lg:hidden p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Search Bar */}
        <div className="hidden md:flex items-center relative max-w-md w-full">
          <div className="absolute left-4 text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search interviews, feedback, or settings..." 
            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {/* Notifications */}
        <button className="relative p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors group">
          <Bell className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-slate-950 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 cursor-pointer group pl-2 md:pl-4 md:border-l border-white/10 hover:text-white transition-colors"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-slate-900 border-2 border-slate-950 overflow-hidden flex items-center justify-center font-bold text-white">
                  {user ? getInitials(user.name) : 'U'}
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full"></div>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-slate-400">Pro Plan</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-white transition-all ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-lg z-50"
            >
              <div className="p-4 border-b border-white/10">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
