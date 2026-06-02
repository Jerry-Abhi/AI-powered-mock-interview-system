import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Minus, Maximize2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const PREDEFINED_RESPONSES = {
    'how to start interview': "To start your interview, go to the Dashboard and click the 'Start Interview' card. Follow the steps on the setup page to begin!",
    'resume upload': "You can upload your resume directly from the Dashboard. Look for the 'Resume Management' section and drag your PDF file there.",
    'camera not working': "If your camera isn't appearing, please ensure you've granted browser permissions. You can also check your system settings to make sure ZIVA has access.",
    'who are you': "I'm Niaa, your personal ZIVA assistant! I'm here to help you navigate the platform and ensure you have a smooth interview experience.",
    'help': "I can help you with starting an interview, uploading resumes, or troubleshooting technical issues. Just ask me a question!",
    'default': "That's a great question! I'm still learning, but I'd suggest checking the Dashboard for most common actions, or try asking about 'starting an interview' or 'resume upload'."
};

function NiaaChat() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: "Hi, I’m Niaa 👋 Your personal assistant. How can I help you today?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    // Hide Niaa when inside an active interview session
    const isInterviewActive = location.pathname.includes('/interview/');
    
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    if (isInterviewActive) return null;

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = {
            id: Date.now(),
            type: 'user',
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        const query = input.toLowerCase().trim();
        setInput('');
        setIsTyping(true);

        // Simulate Niaa thinking
        setTimeout(() => {
            let responseText = PREDEFINED_RESPONSES['default'];
            
            // Check for keywords
            if (query.includes('start') || query.includes('how to start')) responseText = PREDEFINED_RESPONSES['how to start interview'];
            else if (query.includes('resume') || query.includes('upload')) responseText = PREDEFINED_RESPONSES['resume upload'];
            else if (query.includes('camera') || query.includes('microphone') || query.includes('perm')) responseText = PREDEFINED_RESPONSES['camera not working'];
            else if (query.includes('who') || query.includes('niaa')) responseText = PREDEFINED_RESPONSES['who are you'];
            else if (query.includes('help')) responseText = PREDEFINED_RESPONSES['help'];

            const botMsg = {
                id: Date.now() + 1,
                type: 'bot',
                text: responseText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="fixed bottom-8 left-8 z-[100] font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom left' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-6 w-[360px] max-w-[calc(100vw-4rem)] h-[500px] bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                        <Bot className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">Niaa</h3>
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] text-slate-400 font-medium">Online Assistant</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-colors">
                                    <Minus className="w-4 h-4" />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-xl text-slate-400 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex gap-2 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                                            msg.type === 'bot' ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-purple-600/20 border border-purple-500/30'
                                        }`}>
                                            {msg.type === 'bot' ? <Bot className="w-4 h-4 text-blue-400" /> : <User className="w-4 h-4 text-purple-400" />}
                                        </div>
                                        <div>
                                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                                msg.type === 'user' 
                                                ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/20' 
                                                : 'bg-white/10 text-slate-200 border border-white/5 rounded-tl-none'
                                            }`}>
                                                {msg.text}
                                            </div>
                                            <p className={`text-[10px] mt-1 text-slate-500 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                                                {msg.time}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex gap-2 items-center">
                                        <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-6 bg-white/[0.02] border-t border-white/10">
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3 px-5 pr-12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-slate-800 text-white rounded-xl transition-all shadow-lg shadow-blue-600/40"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="mt-3 flex items-center gap-2 justify-center">
                                <Sparkles className="w-3 h-3 text-blue-400" />
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Powered by ZIVA AI</span>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 group ${
                    isOpen 
                    ? 'bg-red-500 shadow-red-500/20 rotate-90' 
                    : 'bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 shadow-blue-500/30'
                }`}
            >
                <div className="absolute inset-0 rounded-full bg-inherit animate-ping opacity-20 group-hover:animate-none"></div>
                {isOpen ? (
                    <X className="w-8 h-8 text-white" />
                ) : (
                    <MessageCircle className="w-8 h-8 text-white" />
                )}
                
                {/* Notification Badge */}
                {!isOpen && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-slate-900 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    </div>
                )}
            </motion.button>
        </div>
    );
}

export default NiaaChat;
