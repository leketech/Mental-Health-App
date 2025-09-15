import React, { useState, useEffect } from 'react';
import api from '../utils/auth';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login({ onLogin }) {
  const { classes } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Security validation to block suspicious URLs
  useEffect(() => {
    // Block URLs with suspicious patterns
    if (location.search.includes('~and~') || location.search.length > 200) {
      console.warn('Blocked suspicious URL:', location.search);
      navigate('/login', { replace: true }); // Redirect to clean URL
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await api.post('/api/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      if (res.data.refresh_token) {
        localStorage.setItem('refreshToken', res.data.refresh_token);
      }
      onLogin(res.data.user || { name: 'User' });
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${classes.bgSecondary}`}>
      <div className="max-w-md w-full space-y-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/')}
            className={`inline-flex items-center gap-2 ${classes.textSecondary} hover:${classes.textPrimary} transition-colors`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl mb-4">
            🧘‍♀️
          </div>
          <h2 className={`text-3xl font-bold ${classes.textPrimary}`}>Welcome back</h2>
          <p className={`mt-2 text-lg ${classes.textSecondary}`}>
            Sign in to your UnwindMind account
          </p>
        </div>

        {/* Login Form */}
        <div className={`${classes.card} p-8`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-800 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${classes.textSecondary} mb-2`}>
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 pl-12 rounded-lg ${classes.input} ${classes.transition} focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your email"
                />
                <svg className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${classes.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${classes.textSecondary} mb-2`}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 pl-12 pr-12 rounded-lg ${classes.input} ${classes.transition} focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your password"
                />
                <svg className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${classes.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${classes.textMuted} ${classes.hover} p-1 rounded ${classes.transition}`}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className={`ml-2 block text-sm ${classes.textSecondary}`}>
                  Remember me
                </label>
              </div>
              <button type="button" className={`text-sm font-medium ${classes.accentPrimary} ${classes.hover} rounded px-2 py-1 ${classes.transition}`}>
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold ${classes.transition} ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : `${classes.button} hover:shadow-lg transform hover:scale-[1.02]`
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        {/* Registration Prompt */}
        <div className={`${classes.card} p-6 text-center`}>
          <p className={`text-sm ${classes.textSecondary} mb-2`}>
            Don't have an account?
          </p>
          <p className={`text-sm ${classes.textMuted}`}>
            Kindly register if you don't have an account
          </p>
          <button 
            onClick={() => window.location.href = '/register'}
            className={`mt-3 font-medium ${classes.accentPrimary} ${classes.hover} rounded px-3 py-2 ${classes.transition}`}
          >
            Create Account
          </button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className={`text-sm ${classes.textSecondary}`}>
            Your mental health journey matters.
          </p>
        </div>
      </div>
    </div>
  );
}