import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Video, Loader2, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import API from '../../services/api';

function InterviewSetupPage() {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
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

  const handleStartInterview = async () => {
    if (!resume) {
      setError('Please upload your resume on the dashboard first!');
      return;
    }

    setStarting(true);
    setError('');

    try {
      // 1. Call backend to create interview
      const res = await API.post('/interview/start', {
        role: "General Software Engineer", // Can be dynamic if needed
        difficulty: "Intermediate",
        resumeId: resume._id
      });

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to initialize interview");
      }

      const interviewId = res.data.interviewId;

      // 2. Request Camera/Mic Permissions
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        // Stop preview tracks immediately as requested
        stream.getTracks().forEach(track => track.stop());
      } catch (permErr) {
        throw new Error("Camera & Microphone access is required");
      }

      // 3. Show "All The Best" Animation
      setShowAnimation(true);

      // 4. Redirect after animation (1.8s)
      setTimeout(() => {
        navigate(`/interview/${interviewId}`);
      }, 1800);

    } catch (err) {
      console.error("Setup error:", err);
      if (err.message === "Camera & Microphone access is required") {
        alert("Camera & Microphone access is required");
        setError("Camera & Microphone access is required");
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Loading Interview Configuration...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <AnimatePresence>
        {!showAnimation ? (
          <motion.div
            key="setup-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            className="w-full max-w-xl"
          >
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-14 text-center relative overflow-hidden shadow-2xl">
              {/* Top Accent */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-500/20">
                <Video className="w-10 h-10 text-white" />
              </div>

              <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Ready for Your Interview?</h1>
              <p className="text-slate-400 text-lg mb-10 max-w-sm mx-auto leading-relaxed">
                Ensure your environment is quiet and your camera is positioned correctly.
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm text-left"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}

              <div className="space-y-6">
                <div className="flex items-center justify-center gap-8 py-6 border-y border-white/5">
                  <div className="flex flex-col items-center gap-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Resume</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Mic</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Camera</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={starting}
                  onClick={handleStartInterview}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {starting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>INITIALIZING...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      <span>START YOUR INTERVIEW</span>
                    </>
                  )}
                </motion.button>
                
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
                >
                  Cancel and go back
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="animation-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-slate-900 z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: [0.8, 1.1, 1],
                opacity: [0, 1, 1]
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-center"
            >
              <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 tracking-tighter">
                All The Best
              </h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"
              ></motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default InterviewSetupPage;
