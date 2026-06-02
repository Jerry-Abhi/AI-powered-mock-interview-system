import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/dashboard/Home';
import Profile from './pages/dashboard/Profile';
import InterviewSetup from './pages/dashboard/InterviewSetup';
import InterviewSetupPage from './pages/dashboard/InterviewSetupPage';
import InterviewSession from './pages/dashboard/InterviewSession';
import ResumeAnalysis from './pages/dashboard/ResumeAnalysis';
import History from './pages/dashboard/History';
import Analytics from './pages/dashboard/Analytics';
import Feedback from './pages/dashboard/Feedback';
import Settings from './pages/dashboard/Settings';
import NiaaChat from './components/NiaaChat';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
  
  return user ? <Outlet /> : <Navigate to="/signin" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Landing />
            </motion.div>
          } 
        />
        <Route 
          path="/signin" 
          element={
            <PublicRoute>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SignIn />
              </motion.div>
            </PublicRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SignUp />
              </motion.div>
            </PublicRoute>
          } 
        />

        {/* Dashboard Routes with Layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="interview" element={<InterviewSetupPage />} />
            <Route path="resume" element={<ResumeAnalysis />} />
            <Route path="history" element={<History />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/interview-setup" element={<InterviewSetupPage />} />
          <Route path="/interview/:id" element={<InterviewSession />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatedRoutes />
        <NiaaChat />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
