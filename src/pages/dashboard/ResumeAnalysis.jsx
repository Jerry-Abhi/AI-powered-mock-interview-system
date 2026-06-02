import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, XCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';

const skillData = [
  { subject: 'React', A: 90, fullMark: 100 },
  { subject: 'Node.js', A: 80, fullMark: 100 },
  { subject: 'System Design', A: 60, fullMark: 100 },
  { subject: 'TypeScript', A: 85, fullMark: 100 },
  { subject: 'AWS', A: 45, fullMark: 100 },
  { subject: 'GraphQL', A: 75, fullMark: 100 },
];

function ResumeAnalysis() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Resume Analysis</h1>
        <p className="text-slate-400">AI-powered insights to optimize your resume for ATS and target roles.</p>
      </div>

      {/* Top Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[50px] -mr-10 -mt-10"></div>
          <p className="text-slate-400 text-sm font-medium mb-2">Overall Score</p>
          <div className="flex items-end gap-3">
            <h2 className="text-5xl font-bold text-white">82</h2>
            <span className="text-lg text-slate-400 mb-1">/ 100</span>
          </div>
          <p className="text-sm text-emerald-400 mt-4 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> Strong candidate profile
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[50px] -mr-10 -mt-10"></div>
          <p className="text-slate-400 text-sm font-medium mb-2">ATS Compatibility</p>
          <div className="flex items-end gap-3">
            <h2 className="text-5xl font-bold text-white">95</h2>
            <span className="text-lg text-slate-400 mb-1">%</span>
          </div>
          <p className="text-sm text-emerald-400 mt-4 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> Highly readable format
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-[50px] -mr-10 -mt-10"></div>
          <p className="text-slate-400 text-sm font-medium mb-2">Keyword Match</p>
          <div className="flex items-end gap-3">
            <h2 className="text-5xl font-bold text-white">74</h2>
            <span className="text-lg text-slate-400 mb-1">%</span>
          </div>
          <p className="text-sm text-orange-400 mt-4 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" /> Missing key industry terms
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart for Skills */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Skill Alignment Radar</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Radar name="Your Profile" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Actionable Feedback */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Actionable Insights</h3>
          
          <div className="space-y-4 flex-1">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-emerald-300 font-medium mb-1">Strong Impact Verbs</h4>
                  <p className="text-sm text-slate-300">You have successfully used metrics-driven impact verbs in 80% of your experience bullet points.</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-orange-300 font-medium mb-1">Missing Cloud Experience</h4>
                  <p className="text-sm text-slate-300">The role "Senior Full Stack" frequently requires AWS/GCP. Consider highlighting your basic AWS knowledge more prominently.</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="flex gap-3">
                <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-300 font-medium mb-1">Lengthy Summary</h4>
                  <p className="text-sm text-slate-300">Your professional summary is over 4 lines long. ATS systems and recruiters prefer concise, 2-3 line summaries.</p>
                </div>
              </div>
            </div>
          </div>

          <button className="mt-6 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" /> Download Annotated PDF
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default ResumeAnalysis;
