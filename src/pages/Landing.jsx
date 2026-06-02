import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const navigate = useNavigate();
  
  const tagline = "Your Personal Interviewer";

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTagline(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate('/signin');
    }, 1000);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 overflow-hidden flex items-center justify-center font-sans">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <AnimatePresence mode="wait">
        {!isTransitioning && (
          <motion.div 
            className="relative z-10 flex flex-col items-center justify-center w-full px-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Logo Container */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-white/50 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] select-none">
                ZIVA
              </h1>
              <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-600/30 to-purple-600/30 -z-10 mix-blend-screen"></div>
            </motion.div>

            {/* Tagline Container */}
            <div className="h-8 mt-6 mb-12 flex items-center justify-center">
              {showTagline && (
                <motion.p 
                  className="text-lg md:text-2xl font-light tracking-wide text-blue-100/80"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                >
                  {tagline.split("").map((char, index) => (
                    <motion.span
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      className={char === " " ? "mr-2" : ""}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.p>
              )}
            </div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showTagline ? 1 : 0, y: showTagline ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <button 
                onClick={handleStart}
                className="group relative px-8 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                <span className="relative z-10 text-sm font-medium tracking-wider text-white/90 flex items-center gap-2">
                  INITIATE SESSION
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Landing;
