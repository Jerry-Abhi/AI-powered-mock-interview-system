import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, History, MessageSquare, ArrowRight, Mail, Calendar, Edit2, Sparkles, Upload, FileText, X, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resume, setResume] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Fetch existing resumes for the user
    const fetchResumes = async () => {
      try {
        const response = await API.get('/resume');
        if (response.data.success && response.data.resumes.length > 0) {
          const latestResume = response.data.resumes[response.data.resumes.length - 1];
          setResume({
            id: latestResume._id,
            name: latestResume.fileName,
            uploadedAt: new Date(latestResume.uploadedAt).toLocaleDateString(),
            skills: latestResume.skills
          });
        }
      } catch (error) {
        console.error("Error fetching resumes:", error);
      }
    };

    if (user) {
      fetchResumes();
    }
  }, [user]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setUploadStatus('error');
      setTimeout(() => setUploadStatus(''), 3000);
      return;
    }

    setIsUploading(true);
    setUploadStatus('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await API.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        const newResume = response.data.resume;
        setResume({
          id: newResume._id,
          name: newResume.fileName,
          uploadedAt: new Date(newResume.uploadedAt).toLocaleDateString(),
          skills: newResume.skills
        });
        setUploadStatus('success');
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus(''), 3000);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDeleteResume = () => {
    // For now just clear local state, backend delete can be added later
    setResume(null);
    setUploadStatus('deleted');
    setTimeout(() => setUploadStatus(''), 2000);
  };

  const getInitials = (name) => {
    return name ? name.split(' ')[0][0].toUpperCase() : 'U';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardHoverVariants = {
    idle: { y: 0 },
    hover: { y: -8, transition: { duration: 0.3 } },
  };

  // Dashboard cards data
  const dashboardCards = [
    {
      id: 1,
      title: 'Start Interview',
      description: 'Begin a new AI-powered mock interview session',
      icon: Video,
      action: 'Start Now',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      borderGradient: 'from-blue-500 to-cyan-500',
      hoverGradient: 'group-hover:from-blue-500/30 group-hover:to-cyan-500/30',
      onClick: () => navigate('/interview-setup'),
    },
    {
      id: 2,
      title: 'Interview History',
      description: 'Review your previous interviews and performance metrics',
      icon: History,
      action: 'View History',
      gradient: 'from-purple-500/20 to-pink-500/20',
      borderGradient: 'from-purple-500 to-pink-500',
      hoverGradient: 'group-hover:from-purple-500/30 group-hover:to-pink-500/30',
      onClick: () => navigate('/dashboard/history'),
    },
    {
      id: 3,
      title: 'AI Feedback',
      description: 'Get personalized insights and improvement suggestions',
      icon: MessageSquare,
      action: 'View Feedback',
      gradient: 'from-emerald-500/20 to-teal-500/20',
      borderGradient: 'from-emerald-500 to-teal-500',
      hoverGradient: 'group-hover:from-emerald-500/30 group-hover:to-teal-500/30',
      onClick: () => navigate('/dashboard/feedback'),
    },
  ];

  return (
    <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      {/* Welcome Section with Glowing Effect */}
      <motion.div variants={itemVariants} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl -z-10 animate-pulse"></div>
        
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
          {/* Animated border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10"></div>
          
          {/* Top accent line */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-start justify-between gap-4"
          >
            <div className="flex-1">
              <motion.div
                animate={{ textShadow: ['0 0 0px rgba(59,130,246,0)', '0 0 20px rgba(59,130,246,0.5)', '0 0 0px rgba(59,130,246,0)'] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
                  Welcome, {user.name.split(' ')[0]} 👋
                </h1>
              </motion.div>
              <p className="text-lg text-slate-300 font-light">Your Personal Interviewer</p>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="hidden md:block"
            >
              <Sparkles className="w-8 h-8 text-purple-400" />
            </motion.div>
          </motion.div>

          <p className="mt-6 text-slate-400 max-w-2xl leading-relaxed">
            You're all set! Dive into your first interview session and unlock your potential with AI-powered feedback and insights.
          </p>
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6">
        {/* User Profile Info */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/20 transition-all duration-300 group">
          {/* Top accent */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Profile Information</h2>
              <p className="text-sm text-slate-400">Your account details</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard/profile')}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <Edit2 className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white text-lg">
                {getInitials(user.name)}
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Full Name</p>
                <p className="text-white font-medium">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Email</p>
                <p className="text-white font-medium text-sm truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Joined</p>
                <p className="text-white font-medium">{user.joinedDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats/Quick Info */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/20 transition-all duration-300">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

          <h2 className="text-2xl font-bold text-white mb-6">Quick Stats</h2>

          <div className="space-y-4">
            {[
              { label: 'Interviews Completed', value: '0', icon: '🎯' },
              { label: 'Average Score', value: '--', icon: '📊' },
              { label: 'Weak Areas', value: 'None yet', icon: '⚡' },
              { label: 'Plan', value: 'Pro', icon: '👑' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{stat.icon}</span>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
                <p className="text-white font-semibold">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Resume Upload Section */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-white mb-6">Resume Management</h2>
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>

          {!resume ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                isDragging
                  ? 'border-orange-500/60 bg-orange-500/10'
                  : 'border-white/20 hover:border-orange-500/40 hover:bg-orange-500/5'
              }`}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="flex justify-center mb-4"
              >
                <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500">
                  <Upload className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <h3 className="text-xl font-bold text-white mb-2">Upload Your Resume</h3>
              <p className="text-slate-400 mb-6">Drag and drop your PDF resume here or click to browse</p>

              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
                id="resume-input"
              />
              <label htmlFor="resume-input">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isUploading}
                  onClick={() => document.getElementById('resume-input')?.click()}
                  className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all disabled:opacity-50"
                >
                  {isUploading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    "Choose File"
                  )}
                </motion.button>
              </label>

              <p className="text-xs text-slate-400 mt-4">Supported format: PDF (Max size: 10MB)</p>

              {uploadStatus === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-red-400 text-sm"
                >
                  ❌ Please upload a valid PDF file
                </motion.p>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-start justify-between p-6 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 mt-1">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{resume.name}</h3>
                    <p className="text-sm text-slate-400 mb-2">
                      {resume.size} KB • Uploaded {resume.uploadedAt}
                    </p>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-emerald-400">Resume uploaded successfully</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteResume}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('resume-input2')?.click()}
                className="w-full py-3 rounded-lg border border-white/10 text-white font-medium hover:bg-white/5 transition-all"
              >
                Upload Another Resume
              </motion.button>

              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
                id="resume-input2"
              />

              {uploadStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm text-center"
                >
                  ✅ Resume updated successfully!
                </motion.div>
              )}

              {uploadStatus === 'deleted' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm text-center"
                >
                  📄 Resume deleted. You can upload a new one anytime!
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Main Dashboard Cards */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-white mb-6">Main Options</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {dashboardCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                variants={cardHoverVariants}
                whileHover="hover"
                initial="idle"
                className="group cursor-pointer"
                onClick={card.onClick}
              >
                <div className={`relative h-full bg-gradient-to-br ${card.gradient} ${card.hoverGradient} backdrop-blur-xl border border-white/10 rounded-2xl p-8 overflow-hidden transition-all duration-300`}>
                  {/* Animated border gradient */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${card.borderGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-lg`}></div>

                  {/* Top accent line */}
                  <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r ${card.borderGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                  {/* Icon */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.borderGradient} p-3 mb-6 flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-pink-400 transition-all">
                    {card.title}
                  </h3>
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed h-12">
                    {card.description}
                  </p>

                  {/* Button */}
                  <motion.button
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full flex items-center justify-between py-3 px-4 rounded-lg bg-gradient-to-r ${card.borderGradient} text-white font-medium overflow-hidden group/btn relative`}
                  >
                    <span>{card.action}</span>
                    <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
        {/* Animated gradient blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full bg-gradient-to-br from-blue-600/10 to-transparent blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full bg-gradient-to-tl from-purple-600/10 to-transparent blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.1, 0.9, 1.1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-gradient-to-bl from-cyan-600/10 to-transparent blur-[100px]"
        />
      </div>
    </motion.div>
  );
}

export default Home;
