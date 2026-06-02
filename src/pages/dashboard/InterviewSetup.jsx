import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Settings, User, FileText, Upload, BrainCircuit, Clock, CheckCircle2, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const types = ['Technical', 'HR', 'Behavioral', 'Mixed'];
const roles = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Analyst', 'AI Engineer'];
const difficulties = ['Beginner', 'Intermediate', 'Expert'];

function InterviewSetup() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('Mixed');
  const [selectedRole, setSelectedRole] = useState('Frontend Developer');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Intermediate');
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await API.get('/resume');
        if (res.data.success && res.data.resumes.length > 0) {
          setResume(res.data.resumes[res.data.resumes.length - 1]);
        }
      } catch (err) {
        console.error("Failed to fetch resumes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const [status, setStatus] = useState('idle'); // idle, checking, starting

  const handleStartInterview = async () => {
    if (!resume) {
      setError('Please upload a resume on the dashboard first!');
      return;
    }

    setStarting(true);
    setStatus('starting');
    setError('');

    try {
      // 1. Create interview session first
      const res = await API.post('/interview/start', {
        role: selectedRole,
        difficulty: selectedDifficulty,
        resumeId: resume._id
      });

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to initialize interview");
      }

      const interviewId = res.data.interviewId;
      setStatus('checking');

      // 2. Request Camera/Mic Permissions
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      // Stop preview tracks immediately as requested
      stream.getTracks().forEach(track => track.stop());

      // 3. Redirect AFTER permission success
      navigate(`/interview/${interviewId}`);

    } catch (err) {
      console.error("Setup error:", err);
      setStatus('idle');
      if (err.name === 'NotAllowedError' || err.message === 'Permission denied') {
        setError('Camera and Microphone permission is required to start the interview.');
        alert("Camera & Microphone permission is required");
      } else {
        setError(err.message || 'Failed to initialize session. Please try again.');
      }
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Setup Interview</h1>
        <p className="text-slate-400">Configure your AI mock interview to match your exact needs.</p>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm"
        >
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Configuration Form */}
        <div className="flex-1 space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden"
          >
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="space-y-8 relative z-10">
              {/* Type Selection */}
              <div>
                <label className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-400" /> Interview Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {types.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${
                        selectedType === type 
                          ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' 
                          : 'bg-slate-900/50 border-white/5 text-slate-300 hover:bg-white/5 hover:border-white/10'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-400" /> Target Role
                </label>
                <div className="relative">
                  <select 
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <ChevronRight className="w-5 h-5 text-slate-400 rotate-90" />
                  </div>
                </div>
              </div>

              {/* Difficulty Selection */}
              <div>
                <label className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-emerald-400" /> Difficulty Level
                </label>
                <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10">
                  {difficulties.map(diff => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                        selectedDifficulty === diff 
                          ? 'bg-white/10 text-white shadow-md' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resume Context */}
              <div>
                <label className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-400" /> Interview Context
                </label>
                <div className="border border-white/10 bg-slate-900/50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      {loading ? (
                        <div className="animate-pulse bg-white/10 h-4 w-32 rounded"></div>
                      ) : resume ? (
                        <>
                          <p className="text-sm font-medium text-white">{resume.fileName}</p>
                          <p className="text-xs text-slate-400">Using currently active resume</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-red-400">No Resume Found</p>
                          <p className="text-xs text-slate-400">Upload on dashboard to continue</p>
                        </>
                      )}
                    </div>
                  </div>
                  <button onClick={() => navigate('/dashboard')} className="p-2 text-slate-400 hover:text-white transition-colors">
                    <Upload className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Preview Card */}
        <div className="lg:w-[400px]">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="sticky top-28"
          >
            <div className="bg-gradient-to-b from-blue-900/20 to-purple-900/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              
              <h3 className="text-xl font-bold text-white mb-6">Interview Preview</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <BrainCircuit className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">AI Interviewer</p>
                    <p className="font-medium text-white">ZIVA Engine v2.4</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/10">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Expected Duration</p>
                    <p className="text-lg font-semibold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-400" /> 30 Mins
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Questions</p>
                    <p className="text-lg font-semibold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" /> 12 - 15
                    </p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {['Real-time video processing', 'Dynamic AI questioning', 'Sentiment & tone analysis', 'Comprehensive score report'].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={handleStartInterview}
                  disabled={starting}
                  className="w-full relative py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold overflow-hidden group hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 mt-8 disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {starting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Video className="w-5 h-5" />}
                    {status === 'checking' ? "GRANTING ACCESS..." : 
                     status === 'starting' ? "INITIALIZING AI..." : "START INTERVIEW"}
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

export default InterviewSetup;
