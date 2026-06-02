import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Mic, MicOff, Video, VideoOff, Loader2, CheckCircle, AlertCircle, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import API from '../../services/api';

function InterviewSession() {
    const { id: interviewId } = useParams();
    const navigate = useNavigate();
    
    // States
    const [loading, setLoading] = useState(true);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [messages, setMessages] = useState([]);
    const [completed, setCompleted] = useState(false);
    
    // Timers
    const [sessionTimeLeft, setSessionTimeLeft] = useState(30 * 60);
    const [questionTimeLeft, setQuestionTimeLeft] = useState(120); // 2 minutes per question
    
    // Voice Recognition
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    const videoRef = useRef(null);
    const chatEndRef = useRef(null);

    // Proctoring Simulation State
    const [proctorStats, setProctorStats] = useState({ eyeTracking: 95, focus: 92, clarity: 88 });

    useEffect(() => {
        if (!interviewId) {
            navigate('/dashboard/interview');
            return;
        }

        if (completed) return;
        const interval = setInterval(() => {
            setProctorStats({
                eyeTracking: Math.floor(Math.random() * (98 - 90 + 1)) + 90,
                focus: Math.floor(Math.random() * (95 - 85 + 1)) + 85,
                clarity: Math.floor(Math.random() * (92 - 80 + 1)) + 80
            });
        }, 3000);
        return () => clearInterval(interval);
    }, [completed, interviewId, navigate]);

    useEffect(() => {
        if (!interviewId) return;

        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setAnswer(prev => prev + (prev ? ' ' : '') + finalTranscript);
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        const startSession = async () => {
            try {
                // Request camera feed for the session
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (videoRef.current) videoRef.current.srcObject = stream;

                // Call backend: GET /api/interview/:id/question
                const res = await API.get(`/interview/${interviewId}/question`);
                if (res.data.success) {
                    setQuestion(res.data.question);
                    setMessages([{ type: 'ai', text: res.data.question }]);
                } else if (res.data.completed) {
                    setCompleted(true);
                }
            } catch (err) {
                console.error("Session start error:", err);
            } finally {
                setLoading(false);
            }
        };

        startSession();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, [interviewId]);

    // Session Timer
    useEffect(() => {
        if (completed || sessionTimeLeft <= 0) return;
        const timer = setInterval(() => setSessionTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [completed, sessionTimeLeft]);

    // Question Timer (2 minutes)
    useEffect(() => {
        if (completed || questionTimeLeft <= 0 || isSubmitting) {
            if (questionTimeLeft === 0 && !isSubmitting && !completed) {
                autoSubmitAnswer();
            }
            return;
        }
        const timer = setInterval(() => setQuestionTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [completed, questionTimeLeft, isSubmitting]);

    const autoSubmitAnswer = () => {
        const finalAnswer = answer.trim() || "(No response provided within time limit)";
        handleSubmitAnswer(null, finalAnswer);
    };

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleSubmitAnswer = async (e, forcedAnswer = null) => {
        if (e) e.preventDefault();
        const finalAnswer = forcedAnswer !== null ? forcedAnswer : answer;
        if (!finalAnswer.trim() && !forcedAnswer) return;

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }

        setMessages(prev => [...prev, { type: 'user', text: finalAnswer }]);
        setAnswer('');
        setIsSubmitting(true);

        try {
            // POST /api/interview/:id/answer
            const res = await API.post(`/interview/${interviewId}/answer`, { 
                answer: finalAnswer
            });
            
            if (res.data.success) {
                if (res.data.completed) {
                    setCompleted(true);
                    setMessages(prev => [...prev, { type: 'ai', text: "Interview completed! Generating your final performance report..." }]);
                } else {
                    // Load next question
                    setQuestion(res.data.nextQuestion);
                    setMessages(prev => [...prev, { type: 'ai', text: res.data.nextQuestion }]);
                    setQuestionTimeLeft(120); // Reset timer
                }
            }
        } catch (err) {
            console.error("Answer submission error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh]">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-slate-400 animate-pulse font-medium">Initializing AI Interview Session...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto h-[85vh] flex flex-col lg:flex-row gap-6 relative p-4">
            
            {/* Main Interview Area */}
            <div className="flex-1 flex flex-col bg-slate-900/50 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl shadow-2xl relative">
                
                {/* Header with Timers */}
                <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">ZIVA AI Interviewer</h3>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-xs text-emerald-400 font-medium">Session Active</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Question Timer */}
                        <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-mono font-bold transition-all duration-500 ${
                            questionTimeLeft < 30 ? 'bg-red-500/10 border-red-500/30 text-red-400 animate-pulse' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                        }`}>
                            <Clock className="w-4 h-4" />
                            <span className="text-xs mr-1 uppercase tracking-tighter opacity-70">Question:</span>
                            {formatTime(questionTimeLeft)}
                        </div>
                        
                        {/* Session Timer */}
                        <div className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 flex items-center gap-2 font-mono text-sm">
                            <span className="text-[10px] uppercase tracking-tighter opacity-50">Total:</span>
                            {formatTime(sessionTimeLeft)}
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                    <AnimatePresence mode='popLayout'>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] px-6 py-4 rounded-2xl text-[0.95rem] leading-relaxed shadow-sm ${
                                    msg.type === 'user' 
                                    ? 'bg-blue-600 text-white rounded-tr-none' 
                                    : 'bg-white/10 text-slate-200 border border-white/5 rounded-tl-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-8 bg-white/[0.02] border-t border-white/10">
                    {!completed ? (
                        <form onSubmit={handleSubmitAnswer} className="space-y-4">
                            <div className="relative group">
                                <textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Speak or type your answer here..."
                                    disabled={isSubmitting}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-3xl py-5 px-8 pr-32 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all min-h-[100px] resize-none"
                                />
                                <div className="absolute right-4 bottom-4 flex items-center gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        type="button"
                                        onClick={toggleListening}
                                        className={`p-3 rounded-2xl transition-all ${
                                            isListening 
                                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 animate-pulse' 
                                            : 'bg-white/10 text-slate-400 hover:text-white hover:bg-white/20'
                                        }`}
                                    >
                                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1, x: 2 }}
                                        whileTap={{ scale: 0.9 }}
                                        type="submit"
                                        disabled={!answer.trim() || isSubmitting}
                                        className="p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-slate-800 text-white rounded-2xl transition-all shadow-lg shadow-blue-600/40"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    </motion.button>
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest font-medium">
                                Press <span className="text-blue-400">Enter</span> to submit or use <span className="text-blue-400">Voice Input</span>
                            </p>
                        </form>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-4"
                        >
                            <div className="inline-flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Interview Concluded</h3>
                                    <p className="text-slate-400 mb-8 max-w-md mx-auto">Your comprehensive performance analysis is ready. Discover your strengths and areas for growth.</p>
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate('/dashboard/feedback')}
                                        className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/30 flex items-center gap-3"
                                    >
                                        VIEW PERFORMANCE REPORT
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Sidebar: Camera & Info */}
            <div className="lg:w-[320px] flex flex-col gap-6">
                
                {/* Camera Preview */}
                <div className="relative aspect-video lg:aspect-square bg-slate-950 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group">
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        muted 
                        playsInline 
                        className={`w-full h-full object-cover transition-all duration-700 ${!isCameraOn ? 'scale-110 blur-xl opacity-50' : 'scale-100 opacity-100'}`}
                    />
                    {!isCameraOn && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-slate-900/80 backdrop-blur-md flex items-center justify-center border border-white/5">
                                <VideoOff className="w-8 h-8 text-slate-600" />
                            </div>
                        </div>
                    )}
                    
                    {/* Live Indicator */}
                    <div className="absolute top-6 left-6 flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded-xl bg-red-500 text-white text-[10px] font-bold tracking-widest flex items-center gap-2 shadow-lg shadow-red-500/40">
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            LIVE FEED
                        </div>
                    </div>

                    {/* Camera Controls Overlay */}
                    <div className="absolute bottom-6 inset-x-6 flex justify-center gap-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button 
                            onClick={() => setIsCameraOn(!isCameraOn)}
                            className={`p-3 rounded-xl backdrop-blur-md border transition-all ${isCameraOn ? 'bg-white/10 border-white/20 text-white' : 'bg-red-500/20 border-red-500/30 text-red-400'}`}
                        >
                            {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                        </button>
                        <button 
                            onClick={() => setIsMicOn(!isMicOn)}
                            className={`p-3 rounded-xl backdrop-blur-md border transition-all ${isMicOn ? 'bg-white/10 border-white/20 text-white' : 'bg-red-500/20 border-red-500/30 text-red-400'}`}
                        >
                            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* AI Proctoring Status */}
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-white font-semibold text-sm">AI Proctoring</h4>
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold">ACTIVE</span>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Eye Tracking</span>
                            <span className="text-emerald-400 font-medium">Optimal</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: '92%' }}></div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Audio Clarity</span>
                            <span className="text-blue-400 font-medium">High</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: '85%' }}></div>
                        </div>
                    </div>
                </div>

                {/* Success Tips */}
                <div className="bg-gradient-to-br from-indigo-600/10 to-blue-600/10 border border-blue-500/20 rounded-[2rem] p-6">
                    <h4 className="text-blue-400 font-bold text-sm mb-4 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Pro Interview Tips
                    </h4>
                    <ul className="text-[11px] text-slate-400 space-y-3">
                        <li className="flex gap-2">
                            <span className="text-blue-500 font-bold">•</span>
                            Maintain consistent eye contact with the lens.
                        </li>
                        <li className="flex gap-2">
                            <span className="text-blue-500 font-bold">•</span>
                            Structure answers using the STAR framework.
                        </li>
                        <li className="flex gap-2">
                            <span className="text-blue-500 font-bold">•</span>
                            Speak naturally; minor pauses are normal.
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    );
}

export default InterviewSession;
