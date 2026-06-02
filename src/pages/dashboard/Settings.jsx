import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Moon, Trash2, Key } from 'lucide-react';

function Settings() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Settings</h1>
        <p className="text-slate-400">Manage your account preferences and configurations.</p>
      </div>

      <div className="space-y-6">
        
        {/* Appearance Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Moon className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Appearance</h3>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5">
            <div>
              <p className="text-white font-medium">Dark Mode</p>
              <p className="text-sm text-slate-400">ZIVA currently only supports an optimized dark mode for the best AI experience.</p>
            </div>
            <div className="w-12 h-6 rounded-full bg-blue-600 relative cursor-not-allowed opacity-80">
              <div className="w-4 h-4 rounded-full bg-white absolute right-1 top-1"></div>
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Bell className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-sm text-slate-400">Receive alerts about your interview scores.</p>
              </div>
              <button 
                onClick={() => setEmailNotif(!emailNotif)}
                className={`w-12 h-6 rounded-full relative transition-colors ${emailNotif ? 'bg-purple-600' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${emailNotif ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5">
              <div>
                <p className="text-white font-medium">Push Notifications</p>
                <p className="text-sm text-slate-400">In-app notifications for feedback generation.</p>
              </div>
              <button 
                onClick={() => setPushNotif(!pushNotif)}
                className={`w-12 h-6 rounded-full relative transition-colors ${pushNotif ? 'bg-purple-600' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${pushNotif ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5">
              <div>
                <p className="text-white font-medium">Weekly Progress Report</p>
                <p className="text-sm text-slate-400">Receive a weekly summary of your improvement.</p>
              </div>
              <button 
                onClick={() => setWeeklyReport(!weeklyReport)}
                className={`w-12 h-6 rounded-full relative transition-colors ${weeklyReport ? 'bg-purple-600' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${weeklyReport ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Security</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5 gap-4">
              <div>
                <p className="text-white font-medium">Change Password</p>
                <p className="text-sm text-slate-400">Update your password to keep your account secure.</p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-white transition-colors flex items-center gap-2 whitespace-nowrap">
                <Key className="w-4 h-4" /> Update Password
              </button>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-red-400">Danger Zone</h3>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/10 gap-4">
            <div>
              <p className="text-white font-medium">Delete Account</p>
              <p className="text-sm text-slate-400">Permanently delete your account and all interview history. This action cannot be undone.</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors whitespace-nowrap font-medium">
              Delete Account
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default Settings;
