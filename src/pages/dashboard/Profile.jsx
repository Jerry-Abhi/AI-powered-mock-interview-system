import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Briefcase, MapPin, Edit3, Upload, Award, Globe, Link2, Star, Loader2, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

function Profile() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }

    const fetchResumes = async () => {
      try {
        const res = await API.get('/resume');
        if (res.data.success && res.data.resumes.length > 0) {
          setResume(res.data.resumes[res.data.resumes.length - 1]);
        }
      } catch (err) {
        console.error("Failed to fetch resumes", err);
      }
    };
    fetchResumes();
  }, [user]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await API.put('/user/profile', formData);
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Profile Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-1 relative z-10">
              <div className="w-full h-full rounded-full bg-slate-900 border-4 border-slate-950 overflow-hidden relative">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=transparent`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl z-0 group-hover:bg-blue-500/40 transition-colors"></div>
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              {isEditing ? (
                <div className="flex-1 space-y-3">
                  <input 
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <input 
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleUpdate}
                      disabled={isUpdating}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-all"
                    >
                      {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Save
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-all"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">{user.name}</h1>
                    <p className="text-lg text-blue-400 font-medium">Candidate</p>
                  </div>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </>
              )}
            </div>
            
            {!isEditing && (
              <div className="flex flex-wrap items-center gap-4 text-slate-400 mt-4">
                <div className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user.email}</div>
                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Not Specified</div>
                <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> Verified Candidate</div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button className="p-2 rounded-lg bg-slate-900/50 hover:bg-white/10 border border-white/5 transition-colors text-slate-400 hover:text-white">
                <Globe className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-slate-900/50 hover:bg-white/10 border border-white/5 transition-colors text-slate-400 hover:text-blue-400">
                <Link2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Skills & Info */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" />
              Top Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'Node.js', 'TypeScript', 'AWS', 'System Design', 'Next.js', 'GraphQL'].map(skill => (
                <span key={skill} className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Profile Completeness</h3>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-3xl font-bold text-white">85%</span>
              <span className="text-slate-400 mb-1">Excellent</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '85%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>
            <p className="text-sm text-slate-400 mt-4 flex items-start gap-2">
              <Star className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              Add your portfolio link to reach 100% and unlock better AI matching.
            </p>
          </motion.div>
        </div>

        {/* Right Column: Resume & Goals */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Resume</h3>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Verified by AI
              </span>
            </div>
            
            <div className="border-2 border-dashed border-slate-700/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/[0.02] transition-colors group cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="text-white font-medium mb-1">{resume ? resume.fileName : 'No Resume Uploaded'}</h4>
              <p className="text-sm text-slate-400 mb-6">
                {resume ? `Last updated ${new Date(resume.uploadedAt).toLocaleDateString()}` : 'Upload your resume to start AI interviews'}
              </p>
              
              <div className="flex gap-4">
                <button onClick={() => navigate('/dashboard')} className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors">
                  {resume ? 'Update New' : 'Upload Resume'}
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-6">Career Goals</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                <h4 className="text-white font-medium mb-1">Target Roles</h4>
                <p className="text-sm text-slate-400">Senior Frontend Engineer, Full Stack Developer</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                <h4 className="text-white font-medium mb-1">Target Companies</h4>
                <p className="text-sm text-slate-400">FAANG, High-growth Startups</p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

export default Profile;
