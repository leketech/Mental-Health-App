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
                <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '2rem' }}>
                  <div style={{ maxWidth: '400px', margin: '0 auto', backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                    <Login onLogin={handleLogin} />
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                      <p>Don't have an account?
                        <button
                          onClick={() => setShowRegister(true)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#4f46e5',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            marginLeft: 5
                          }}
                        >
                          Register here
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
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
              <UserProfile />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        {/* Redirect all other routes */}
        <Route path="*" element={<Navigate to={user ? "/moods" : "/"} />} />
      </Routes>
    </Router>
  </ThemeProvider>
  );
}

// Separate layout component for the app pages
const AppLayout = ({ children, user, onLogout }) => {
  const { toggleTheme } = useTheme();
  
  return (
    <div style={{ fontFamily: 'Inter, "Noto Sans", sans-serif', minHeight: '100vh' }} className="bg-white group-[:not(.bw-theme)]/bw-theme:bg-white group-bw-theme/bw-theme:bg-black">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid group-[:not(.bw-theme)]/bw-theme:border-b-slate-200 group-bw-theme/bw-theme:border-b-gray-800 bg-white group-[:not(.bw-theme)]/bw-theme:bg-white group-bw-theme/bw-theme:bg-black px-10 py-4">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <Link to="/" style={{ textDecoration: 'none' }} className="flex items-center gap-3 text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-white">
            <div className="size-8 text-blue-600 group-[:not(.bw-theme)]/bw-theme:text-blue-600 group-bw-theme/bw-theme:text-white">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
                <path d="M32 20C32 22.2091 30.2091 24 28 24C25.7909 24 24 22.2091 24 20C24 17.7909 25.7909 16 28 16C30.2091 16 32 17.7909 32 20Z" fill="currentColor"></path>
                <path d="M20 20C20 22.2091 18.2091 24 16 24C13.7909 24 12 22.2091 12 20C12 17.7909 13.7909 16 16 16C18.2091 16 20 17.7909 20 20Z" fill="currentColor"></path>
                <path d="M15 31C15 31 18 35 24 35C30 35 33 31 33 31" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
              </svg>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }} className="text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-white">UnwindMind</h1>
          </Link>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <nav style={{ display: 'inline-block' }}>
                <Link to="/moods" className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-gray-400 hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-white" style={{ textDecoration: 'none', marginRight: 15, padding: '0.5rem 1rem', borderRadius: '4px', transition: 'background-color 0.2s' }}>
                  Moods
                </Link>
                <Link to="/journal" className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-gray-400 hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-white" style={{ textDecoration: 'none', marginRight: 15, padding: '0.5rem 1rem', borderRadius: '4px', transition: 'background-color 0.2s' }}>
                  Journal
                </Link>
                <Link to="/chat" className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-gray-400 hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-white" style={{ textDecoration: 'none', marginRight: 15, padding: '0.5rem 1rem', borderRadius: '4px', transition: 'background-color 0.2s' }}>
                  Chat
                </Link>
                <Link to="/therapy" className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-gray-400 hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-white" style={{ textDecoration: 'none', marginRight: 15, padding: '0.5rem 1rem', borderRadius: '4px', transition: 'background-color 0.2s' }}>
                  Therapy
                </Link>
                <Link to="/billing" className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-gray-400 hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-white" style={{ textDecoration: 'none', marginRight: 15, padding: '0.5rem 1rem', borderRadius: '4px', transition: 'background-color 0.2s' }}>
                  Billing
                </Link>
                <Link to="/profile" className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-gray-400 hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-white" style={{ textDecoration: 'none', marginRight: 15, padding: '0.5rem 1rem', borderRadius: '4px', transition: 'background-color 0.2s' }}>
                  Profile
                </Link>
              </nav>
              <button 
                className="flex items-center justify-center rounded-md p-2 hover:bg-slate-100 group-[:not(.bw-theme)]/bw-theme:hover:bg-slate-100 group-bw-theme/bw-theme:hover:bg-gray-800 transition-colors" 
                onClick={toggleTheme}
              >
                <span className="material-symbols-outlined text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-gray-400">contrast</span>
              </button>
              <button
                onClick={onLogout}
                className="bg-slate-100 group-[:not(.bw-theme)]/bw-theme:bg-slate-100 group-bw-theme/bw-theme:bg-gray-800 border border-slate-200 group-[:not(.bw-theme)]/bw-theme:border-slate-200 group-bw-theme/bw-theme:border-gray-700 text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-white hover:bg-slate-200 group-[:not(.bw-theme)]/bw-theme:hover:bg-slate-200 group-bw-theme/bw-theme:hover:bg-gray-700 transition-colors"
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="bg-slate-50 group-[:not(.bw-theme)]/bw-theme:bg-slate-50 group-bw-theme/bw-theme:bg-gray-900" style={{ padding: '2rem', minHeight: 'calc(100vh - 80px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
};
