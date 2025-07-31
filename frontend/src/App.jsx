import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import MoodTracker from './components/MoodTracker';
import Chat from './components/Chat';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setUser({ name: 'User' });
  }, []);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <header style={{ background: '#4a6fa5', color: 'white', padding: '1rem' }}>
          <h1>Mental Health App</h1>
          {user && <button onClick={handleLogout}>Logout</button>}
        </header>

        <Routes>
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/moods" />} />
          <Route path="/moods" element={<ProtectedRoute user={user}><MoodTracker /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute user={user}><Chat /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/moods" />} />
        </Routes>
      </div>
    </Router>
  );
}
