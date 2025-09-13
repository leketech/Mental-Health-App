import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import api from './utils/auth';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import MoodTracker from './components/MoodTracker';
import Journal from './components/Journal';
import Chat from './components/Chat';
import UserProfile from './components/UserProfile';
import TherapyBooking from './components/TherapyBooking';
import Billing from './components/Billing';
import ProtectedRoute from './components/ProtectedRoute';
import Settings from './components/Settings';
import PrivacyPolicy from './components/PrivacyPolicy';
import CookieConsent from './components/CookieConsent';

export default function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setUser({ name: 'User' });
  }, []);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    try {
      // Call logout endpoint to blacklist tokens
      if (token) {
        await api.post('/api/logout',
          { refresh_token: refreshToken, logout_all: false }
        );
      }
    } catch (err) {
      console.error('Logout API call failed:', err);
      // Continue with local logout even if API call fails
    }

    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <ThemeProvider>
      <Router>
      <Routes>
        {/* Landing Page Route */}
        <Route
          path="/"
          element={<LandingPage user={user} onLogout={handleLogout} />}
        />
        
        {/* Authentication Routes */}
        <Route
          path="/login"
          element={
            !user ? (
              showRegister ? (
                <Register onRegister={() => setShowRegister(false)} />
              ) : (
                <Login onLogin={handleLogin} />
              )
            ) : (
              <Navigate to="/moods" />
            )
          }
        />
        
        {/* Protected App Routes with Navigation */}
        <Route path="/moods" element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout}>
              <MoodTracker />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/journal" element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout}>
              <Journal />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout}>
              <Chat />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/therapy" element={
          <ProtectedRoute user={user}>
            <TherapyBooking />
          </ProtectedRoute>
        } />
        <Route path="/billing" element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout}>
              <Billing />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout}>
              <UserProfile user={user} />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute user={user}>
            <Settings user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        
        {/* Public Routes */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        
        {/* Redirect all other routes */}
        <Route path="*" element={<Navigate to={user ? "/moods" : "/"} />} />
      </Routes>
      <CookieConsent />
    </Router>
  </ThemeProvider>
  );
}

// Separate layout component for the app pages
const AppLayout = ({ children, user, onLogout }) => {
  const { toggleTheme, classes } = useTheme();
  
  return (
    <div className={`min-h-screen ${classes.transition} ${classes.bgPrimary}`}>
      <header className={`flex items-center justify-between whitespace-nowrap border-b ${classes.borderPrimary} ${classes.bgPrimary} px-10 py-4`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          <Link to="/" className={`flex items-center gap-3 ${classes.textPrimary} no-underline`}>
            <div className={`size-8 ${classes.accentPrimary}`}>
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
                <path d="M32 20C32 22.2091 30.2091 24 28 24C25.7909 24 24 22.2091 24 20C24 17.7909 25.7909 16 28 16C30.2091 16 32 17.7909 32 20Z" fill="currentColor"></path>
                <path d="M20 20C20 22.2091 18.2091 24 16 24C13.7909 24 12 22.2091 12 20C12 17.7909 13.7909 16 16 16C18.2091 16 20 17.7909 20 20Z" fill="currentColor"></path>
                <path d="M15 31C15 31 18 35 24 35C30 35 33 31 33 31" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
              </svg>
            </div>
            <h1 className={`text-xl font-bold ${classes.textPrimary}`}>UnwindMind</h1>
          </Link>
          {user && (
            <div className="flex items-center gap-6">
              <nav className="flex items-center gap-6">
                <Link to="/moods" className={`${classes.textSecondary} ${classes.hover} no-underline px-3 py-2 rounded-md ${classes.transition}`}>Moods</Link>
                <Link to="/journal" className={`${classes.textSecondary} ${classes.hover} no-underline px-3 py-2 rounded-md ${classes.transition}`}>Journal</Link>
                <Link to="/chat" className={`${classes.textSecondary} ${classes.hover} no-underline px-3 py-2 rounded-md ${classes.transition}`}>Chat</Link>
                <Link to="/therapy" className={`${classes.textSecondary} ${classes.hover} no-underline px-3 py-2 rounded-md ${classes.transition}`}>Therapy</Link>
                <Link to="/billing" className={`${classes.textSecondary} ${classes.hover} no-underline px-3 py-2 rounded-md ${classes.transition}`}>Billing</Link>
                <Link to="/profile" className={`${classes.textSecondary} ${classes.hover} no-underline px-3 py-2 rounded-md ${classes.transition}`}>Profile</Link>
              </nav>
              
              <div className="flex items-center gap-3">
                {/* Settings Icon */}
                <Link
                  to="/settings"
                  className={`p-2 rounded-full ${classes.textSecondary} hover:${classes.textPrimary} ${classes.bgSecondary} hover:opacity-80 transition-all`}
                  title="Settings"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Link>
                
                {/* Theme Toggle */}
                <button 
                  className={`flex items-center justify-center rounded-md p-2 ${classes.hover} ${classes.transition}`} 
                  onClick={toggleTheme}
                  title="Toggle theme"
                >
                  <span className={`text-xl ${classes.textSecondary}`}>🌗</span>
                </button>
                
                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className={`px-4 py-2 rounded-lg font-medium ${classes.bgSecondary} border ${classes.borderPrimary} ${classes.textPrimary} ${classes.hover} ${classes.transition}`}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      <main className={`${classes.bgSecondary} min-h-screen py-6`}>
        <div className="max-w-7xl mx-auto px-6">
          {children}
        </div>
      </main>
    </div>
  );
};
