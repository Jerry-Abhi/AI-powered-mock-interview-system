import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    MessageSquare, Lightbulb, Target, TrendingUp, ChevronRight, 
    PlayCircle, Star, AlertCircle, CheckCircle2, BarChart3, 
    ArrowRight, Loader2, Award, Zap
} from 'lucide-react';
import { 
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
    CartesianGrid, Tooltip, Cell, RadarChart, PolarGrid, 
    PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import API from '../../services/api';

function Feedback() {
    const [loading, setLoading] = useState(true);
    const [interview, setInterview] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLatestFeedback = async () => {
            try {
                const res = await API.get('/interview/history');
                if (!res.data?.success) throw new Error(res.data?.message || 'Failed to load history');

                const items = Array.isArray(res.data.interviews) ? res.data.interviews : res.data.history;
                if (!Array.isArray(items) || items.length === 0) {
                    setError('No interview history found.');
                    return;
                }

                const completed = items.filter(i => i.status === 'completed');
                if (!completed.length) {
                    setError('No completed interviews found yet.');
                    return;
                }

                setInterview(completed[completed.length - 1]);
            } catch (err) {
                console.error('Failed to fetch feedback', err);
                setError('Failed to load your performance report.');
            } finally {
                setLoading(false);
            }
        };

        fetchLatestFeedback();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-slate-400 animate-pulse">Analyzing your interview performance...</p>
            </div>
        );
    }

    if (error || !interview) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
                <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center mb-6 border border-white/10">
                    <AlertCircle className="w-10 h-10 text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Performance Report Unavailable</h2>
                <p className="text-slate-400 max-w-md mb-8">{error || "Complete an interview session to see your AI-powered performance analysis."}</p>
                <button
                    onClick={() => (window.location.href = '/dashboard/interview')}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20"
                >
                    START AN INTERVIEW
                </button>
            </div>
        );
    }

    const totalScore = interview.totalScore ?? 0;
    const maxScore = interview.maxScore ?? (Array.isArray(interview.questions) ? interview.questions.length * 2 : 0);
    const percent = interview.percentage ?? (maxScore ? (totalScore / maxScore) * 100 : 0);

    const chartData = [
        { name: 'Accuracy', value: interview.accuracy ?? 70 },
        { name: 'Comm.', value: interview.communication ?? 80 },
        { name: 'Overall', value: Math.round(percent) },
        { name: 'Clarity', value: 78 },
        { name: 'Impact', value: 75 },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const questionCards = Array.isArray(interview.questions) ? interview.questions : [];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 max-w-7xl mx-auto pb-12"
        >
            {/* Hero Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Award className="w-5 h-5 text-blue-400" />
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em]">Interview Insights</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Performance Report</h1>
                    <p className="text-slate-400 mt-2">Comprehensive AI analysis for your {interview.role} interview.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 bg-white/5 border border-white/10 p-2 rounded-2xl">
                    <div className="px-6 py-3 rounded-xl bg-blue-600 text-white font-black text-2xl shadow-lg shadow-blue-600/20">
                        {Math.round(percent)}%
                    </div>
                    <div className="pr-4">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total Score</p>
                        <p className="text-sm text-slate-300 font-medium">{totalScore}/{maxScore}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Analytics */}
                <motion.div variants={itemVariants} className="lg:col-span-8 space-y-8">
                    {/* Main Stats Card */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] -z-10" />

                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <BarChart3 className="w-6 h-6 text-blue-400" /> Skills Proficiency
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Latest Interview</span>
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ fill: '#ffffff05' }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-slate-900 border border-white/10 p-3 rounded-xl shadow-2xl">
                                                        <p className="text-xs text-slate-400 mb-1">{payload[0].payload.name}</p>
                                                        <p className="text-lg font-bold text-white">{payload[0].value}%</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={50}>
                                        {chartData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 2 ? '#3b82f6' : '#ffffff15'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Detailed Question Review */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3 pl-2">
                            <MessageSquare className="w-6 h-6 text-purple-400" /> Per Question Breakdown
                        </h3>

                        <div className="space-y-4">
                            {questionCards.map((q, i) => {
                                const score = typeof q.score === 'number' ? q.score : 0;
                                const scoreLabel = `${score}/2`;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.06 }}
                                        className="bg-white/5 border border-white/10 rounded-3xl p-6 group hover:bg-white/[0.08] transition-all"
                                    >
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="shrink-0">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center font-bold text-slate-500 border border-white/5 group-hover:border-blue-500/50 group-hover:text-blue-400 transition-all">
                                                    {i + 1}
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-4">
                                                <div>
                                                    <h4 className="text-white font-bold mb-2 leading-snug">{q.question}</h4>
                                                    <div className="p-4 rounded-2xl bg-black/20 border border-white/5 text-sm text-slate-400 italic">
                                                        “{q.answer || '(No response)'}”
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-4">
                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                                        <Star className="w-4 h-4 text-blue-400 fill-blue-400" />
                                                        <span className="text-xs font-bold text-blue-400">{scoreLabel}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 text-slate-400 text-xs font-medium">
                                                        <Zap className="w-3.5 h-3.5" />
                                                        {score === 2 ? 'Strong' : score === 1 ? 'Average' : 'Needs Work'}
                                                    </div>
                                                    <p className="text-xs text-slate-500 flex-1">{q.feedback || ''}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>

                {/* Sidebar Analysis */}
                <motion.div variants={itemVariants} className="lg:col-span-4 space-y-8">
                    {/* Strengths & Weaknesses */}
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-8">
                        <section>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Strengths
                            </h4>
                            <div className="space-y-3">
                                {(interview.strengths || []).map((s, i) => (
                                    <div key={i} className="flex gap-3 text-sm text-slate-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                        {s}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="h-px bg-white/10" />

                        <section>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-400" /> Weak Areas
                            </h4>
                            <div className="space-y-3">
                                {(interview.weaknesses || []).map((w, i) => (
                                    <div key={i} className="flex gap-3 text-sm text-slate-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                        {w}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* AI Suggestions Card */}
                    <div className="bg-gradient-to-br from-indigo-600/20 to-blue-600/20 border border-blue-500/20 rounded-[2.5rem] p-8 relative overflow-hidden group">
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full transition-transform duration-700 group-hover:scale-110" />

                        <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                            <Lightbulb className="w-6 h-6 text-yellow-400" /> Improvement Suggestions
                        </h4>

                        <div className="space-y-4 relative z-10">
                            {(interview.suggestions || []).map((suggestion, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                                    <p className="text-sm text-slate-300 leading-relaxed">{suggestion}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 rounded-2xl bg-black/20 border border-white/5">
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Summary</p>
                            <p className="text-sm text-slate-200 mt-2 leading-relaxed">{interview.overallFeedback || ''}</p>
                        </div>

                        <button
                            className="w-full mt-6 py-4 bg-white text-slate-950 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-white/5"
                            onClick={() => (window.location.href = '/dashboard/interview')}
                        >
                            START PRACTICE MODE <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default Feedback;
