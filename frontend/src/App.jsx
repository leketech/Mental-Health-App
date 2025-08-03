import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import api from './utils/auth';
import Login from './components/Login';
import Register from './components/Register';
import MoodTracker from './components/MoodTracker';
import Journal from './components/Journal';
import Chat from './components/Chat';
import UserProfile from './components/UserProfile';
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
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <header style={{ background: '#4a6fa5', color: 'white', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ margin: 0 }}>Mental Health App</h1>
            {user && (
              <div>
                <nav style={{ display: 'inline-block', marginRight: 20 }}>
                  <Link to="/moods" style={{ color: 'white', textDecoration: 'none', marginRight: 15 }}>
                    Moods
                  </Link>
                  <Link to="/journal" style={{ color: 'white', textDecoration: 'none', marginRight: 15 }}>
                    Journal
                  </Link>
                  <Link to="/chat" style={{ color: 'white', textDecoration: 'none', marginRight: 15 }}>
                    Chat
                  </Link>
                  <Link to="/profile" style={{ color: 'white', textDecoration: 'none', marginRight: 15 }}>
                    Profile
                  </Link>
                </nav>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid white',
                    color: 'white',
                    padding: '5px 15px',
                    borderRadius: 3,
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <Routes>
          <Route
            path="/login"
            element={
              !user ? (
                showRegister ? (
                  <Register onRegister={() => setShowRegister(false)} />
                ) : (
                  <div>
                    <Login onLogin={handleLogin} />
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                      <p>Don't have an account?
                        <button
                          onClick={() => setShowRegister(true)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#4a6fa5',
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
                )
              ) : (
                <Navigate to="/moods" />
              )
            }
          />
          <Route path="/moods" element={<ProtectedRoute user={user}><MoodTracker /></ProtectedRoute>} />
          <Route path="/journal" element={<ProtectedRoute user={user}><Journal /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute user={user}><Chat /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute user={user}><UserProfile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={user ? "/moods" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}
