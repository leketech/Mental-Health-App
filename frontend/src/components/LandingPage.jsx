import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage = ({ user, onLogout }) => {
  const { toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Enhanced security validation to block malicious URLs
  useEffect(() => {
    // Block URLs with suspicious patterns
    const search = location.search;
    
    // Check for excessively long query strings (Cloudflare typically blocks at ~4KB)
    if (search.length > 1024) {
      console.warn('Blocked excessively long URL query:', search.length, 'characters');
      // Redirect to clean landing page
      navigate('/', { replace: true });
      return;
    }
    
    // Check for SQL injection patterns
    const sqlPatterns = [
      '~and~', 'union select', 'drop table', 'delete from', 
      'insert into', 'update.*set', '--', ';', '/\\*', '\\*/'
    ];
    
    // Check for XSS patterns
    const xssPatterns = [
      // eslint-disable-next-line no-script-url
      '<script', 'javascript\\:', 'onload', 'onerror', 
      'onclick', 'onmouseover', 'eval\\(', 'document\\.cookie'
    ];
    
    // Combine all patterns
    const maliciousPatterns = [...sqlPatterns, ...xssPatterns];
    
    // Check if any malicious pattern is present
    const hasMaliciousPattern = maliciousPatterns.some(pattern => 
      new RegExp(pattern, 'i').test(search)
    );
    
    // Check for excessive repetition of characters
    const hasRepetition = /(.)\1{10,}/.test(search);
    
    if (hasMaliciousPattern || hasRepetition) {
      console.warn('Blocked malicious URL attempt:', search);
      // Redirect to clean landing page
      navigate('/', { replace: true });
      return;
    }
  }, [location, navigate]);

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group-[:not(.bw-theme)]/bw-theme:bg-white group-bw-theme/bw-theme:bg-white overflow-x-hidden" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid group-[:not(.bw-theme)]/bw-theme:border-b-slate-200 group-bw-theme/bw-theme:border-b-gray-300 px-10 py-4">
          <div className="flex items-center gap-3 text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-[var(--text-primary)]">
            <div className="size-8 text-blue-600 group-[:not(.bw-theme)]/bw-theme:text-blue-600 group-bw-theme/bw-theme:text-[var(--primary-color)]">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
                <path d="M32 20C32 22.2091 30.2091 24 28 24C25.7909 24 24 22.2091 24 20C24 17.7909 25.7909 16 28 16C30.2091 16 32 17.7909 32 20Z" fill="currentColor"></path>
                <path d="M20 20C20 22.2091 18.2091 24 16 24C13.7909 24 12 22.2091 12 20C12 17.7909 13.7909 16 16 16C18.2091 16 20 17.7909 20 20Z" fill="currentColor"></path>
                <path d="M15 31C15 31 18 35 24 35C30 35 33 31 33 31" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
              </svg>
            </div>
            <h2 className="text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-[var(--text-primary)] text-2xl font-bold leading-tight tracking-[-0.015em]">UnwindMind</h2>
          </div>
          <div className="flex flex-1 justify-end gap-6">
            <nav className="flex items-center gap-8">
              <a className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)] text-base font-medium leading-normal hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-[var(--text-primary)] transition-colors" href="#features">Features</a>
              <Link className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)] text-base font-medium leading-normal hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-[var(--text-primary)] transition-colors" to={user ? "/therapy" : "/login"}>Therapy</Link>
              <Link className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)] text-base font-medium leading-normal hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-[var(--text-primary)] transition-colors" to={user ? "/billing" : "/login"}>Pricing</Link>
              <a className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)] text-base font-medium leading-normal hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-[var(--text-primary)] transition-colors" href="#support">Support</a>
            </nav>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/moods" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-11 px-5 bg-blue-600 group-[:not(.bw-theme)]/bw-theme:bg-blue-600 group-bw-theme/bw-theme:bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 group-[:not(.bw-theme)]/bw-theme:hover:bg-blue-700 group-bw-theme/bw-theme:hover:bg-black/80 transition-colors">
                    <span className="truncate">Dashboard</span>
                  </Link>
                  <button 
                    onClick={onLogout}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-11 px-5 bg-slate-100 group-[:not(.bw-theme)]/bw-theme:bg-slate-100 group-bw-theme/bw-theme:bg-gray-200 text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-[var(--text-primary)] text-base font-bold leading-normal tracking-[0.015em] hover:bg-slate-200 group-[:not(.bw-theme)]/bw-theme:hover:bg-slate-200 group-bw-theme/bw-theme:hover:bg-gray-300 transition-colors"
                  >
                    <span className="truncate">Logout</span>
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-11 px-5 bg-slate-100 group-[:not(.bw-theme)]/bw-theme:bg-slate-100 group-bw-theme/bw-theme:bg-gray-200 text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-[var(--text-primary)] text-base font-bold leading-normal tracking-[0.015em] hover:bg-slate-200 group-[:not(.bw-theme)]/bw-theme:hover:bg-slate-200 group-bw-theme/bw-theme:hover:bg-gray-300 transition-colors">
                    <span className="truncate">Log In</span>
                  </Link>
                  <Link to="/login" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-11 px-5 bg-blue-600 group-[:not(.bw-theme)]/bw-theme:bg-blue-600 group-bw-theme/bw-theme:bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 group-[:not(.bw-theme)]/bw-theme:hover:bg-blue-700 group-bw-theme/bw-theme:hover:bg-black/80 transition-colors">
                    <span className="truncate">Get Started</span>
                  </Link>
                </>
              )}
              <button 
                className="flex items-center justify-center rounded-md p-2 hover:bg-slate-100 group-[:not(.bw-theme)]/bw-theme:hover:bg-slate-100 group-bw-theme/bw-theme:hover:bg-gray-200 transition-colors" 
                onClick={toggleTheme}
              >
                <span className="material-symbols-outlined text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)]">contrast</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col">
          <div className="relative flex-1">
            <div className="absolute inset-0 z-0">
              <img alt="Person meditating in a nature background" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_3H2MF9ODWqHp23zlZRNDMXyRsbVrVtqovUvW2VFPlQ2CcH446SBl6DqXsQi-uVEYw8mwblWThK3YSY09nM-28sJbo54_eZOHXh2PUw2S4T-bK17-lLK4X-f3RPrePLpVlXjIbNgXdfGo-RHDvVrfZ9Xf7A4gr88sUIA6yIwbqcR_h1t0w70ao0Vzo5pl_FIXZmAKxOyawiA6iW9AQybaNMI_L9Vu1ZP8lzudqo_7GXGYFGjyfZi9vc4_VoGlqYxAMXUM5egMhqQ"/>
              <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
            </div>
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center py-20 px-4 text-center h-full">
              <div className="flex max-w-3xl flex-col items-center gap-6">
                <h1 className="text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-[var(--text-primary)] text-6xl font-black leading-tight tracking-tighter">Find your inner peace with UnwindMind</h1>
                <p className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)] text-xl font-normal leading-normal">Your journey to mental wellness starts here. Track your mood, journal your thoughts, and connect with our AI assistant.</p>
                <div className="flex items-center gap-4">
                  <Link to={user ? "/moods" : "/login"} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-blue-600 group-[:not(.bw-theme)]/bw-theme:bg-blue-600 group-bw-theme/bw-theme:bg-[var(--primary-color)] text-white text-lg font-bold leading-normal tracking-wide hover:bg-blue-700 group-[:not(.bw-theme)]/bw-theme:hover:bg-blue-700 group-bw-theme/bw-theme:hover:bg-black/80 transition-colors">
                    <span className="truncate">Get Started Now</span>
                  </Link>
                  <a href="#features" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-white/80 backdrop-blur-sm text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-[var(--text-primary)] text-lg font-bold leading-normal tracking-wide hover:bg-white transition-colors">
                    <span className="truncate">Learn More</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div id="features" className="bg-slate-50 group-[:not(.bw-theme)]/bw-theme:bg-slate-50 group-bw-theme/bw-theme:bg-gray-100 py-20 px-4">
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-col items-center gap-6 text-center">
                <h2 className="text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-[var(--text-primary)] text-4xl font-bold leading-tight tracking-tight max-w-2xl">Features to support your mental health journey</h2>
                <p className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)] text-lg font-normal leading-normal max-w-3xl">UnwindMind offers a range of tools to help you manage your mental well-being, providing a safe and supportive space for personal growth.</p>
              </div>
              <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-4 rounded-lg bg-white group-[:not(.bw-theme)]/bw-theme:bg-white group-bw-theme/bw-theme:bg-white p-6 shadow-sm">
                  <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 group-[:not(.bw-theme)]/bw-theme:bg-blue-100 group-bw-theme/bw-theme:bg-gray-200 text-blue-600 group-[:not(.bw-theme)]/bw-theme:text-blue-600 group-bw-theme/bw-theme:text-[var(--primary-color)]">
                    <span className="material-symbols-outlined text-3xl">mood</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-[var(--text-primary)] text-xl font-bold leading-tight">Mood Tracking</h3>
                    <p className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)] text-base font-normal leading-normal">Track your daily mood and identify patterns over time to better understand your emotional landscape.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 rounded-lg bg-white group-[:not(.bw-theme)]/bw-theme:bg-white group-bw-theme/bw-theme:bg-white p-6 shadow-sm">
                  <div className="flex size-12 items-center justify-center rounded-full bg-green-100 group-[:not(.bw-theme)]/bw-theme:bg-green-100 group-bw-theme/bw-theme:bg-gray-200 text-green-600 group-[:not(.bw-theme)]/bw-theme:text-green-600 group-bw-theme/bw-theme:text-[var(--primary-color)]">
                    <span className="material-symbols-outlined text-3xl">edit_note</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-[var(--text-primary)] text-xl font-bold leading-tight">Journaling</h3>
                    <p className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)] text-base font-normal leading-normal">Express your thoughts and feelings in a private, secure journal to foster self-reflection and clarity.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 rounded-lg bg-white group-[:not(.bw-theme)]/bw-theme:bg-white group-bw-theme/bw-theme:bg-white p-6 shadow-sm">
                  <div className="flex size-12 items-center justify-center rounded-full bg-purple-100 group-[:not(.bw-theme)]/bw-theme:bg-purple-100 group-bw-theme/bw-theme:bg-gray-200 text-purple-600 group-[:not(.bw-theme)]/bw-theme:text-purple-600 group-bw-theme/bw-theme:text-[var(--primary-color)]">
                    <span className="material-symbols-outlined text-3xl">smart_toy</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-[var(--text-primary)] text-xl font-bold leading-tight">AI Assistant</h3>
                    <p className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)] text-base font-normal leading-normal">Get personalized support and guidance from our AI assistant, available 24/7 to help you navigate challenges.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 rounded-lg bg-white group-[:not(.bw-theme)]/bw-theme:bg-white group-bw-theme/bw-theme:bg-white p-6 shadow-sm">
                  <div className="flex size-12 items-center justify-center rounded-full bg-pink-100 group-[:not(.bw-theme)]/bw-theme:bg-pink-100 group-bw-theme/bw-theme:bg-gray-200 text-pink-600 group-[:not(.bw-theme)]/bw-theme:text-pink-600 group-bw-theme/bw-theme:text-[var(--primary-color)]">
                    <span className="material-symbols-outlined text-3xl">psychology</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-[var(--text-primary)] text-xl font-bold leading-tight">Professional Therapy</h3>
                    <p className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)] text-base font-normal leading-normal">Book sessions with licensed therapists who specialize in various areas including anxiety, depression, and relationship issues.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-white group-[:not(.bw-theme)]/bw-theme:bg-white group-bw-theme/bw-theme:bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
              <div className="flex items-center gap-3 text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-[var(--text-primary)]">
                <div className="size-8 text-blue-600 group-[:not(.bw-theme)]/bw-theme:text-blue-600 group-bw-theme/bw-theme:text-[var(--primary-color)]">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
                    <path d="M32 20C32 22.2091 30.2091 24 28 24C25.7909 24 24 22.2091 24 20C24 17.7909 25.7909 16 28 16C30.2091 16 32 17.7909 32 20Z" fill="currentColor"></path>
                    <path d="M20 20C20 22.2091 18.2091 24 16 24C13.7909 24 12 22.2091 12 20C12 17.7909 13.7909 16 16 16C18.2091 16 20 17.7909 20 20Z" fill="currentColor"></path>
                    <path d="M15 31C15 31 18 35 24 35C30 35 33 31 33 31" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
                  </svg>
                </div>
                <h2 className="text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-[var(--text-primary)] text-2xl font-bold leading-tight tracking-[-0.015em]">UnwindMind</h2>
              </div>
              <nav className="flex flex-wrap justify-center gap-6">
                <a className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)] text-base font-medium leading-normal hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-[var(--text-primary)] transition-colors" href="#privacy">Privacy Policy</a>
                <a className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)] text-base font-medium leading-normal hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-[var(--text-primary)] transition-colors" href="#terms">Terms of Service</a>
                <a className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)] text-base font-medium leading-normal hover:text-slate-900 group-[:not(.bw-theme)]/bw-theme:hover:text-slate-900 group-bw-theme/bw-theme:hover:text-[var(--text-primary)] transition-colors" href="#contact">Contact Us</a>
              </nav>
              <p className="text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-[var(--text-secondary)] text-base font-normal leading-normal">© 2024 UnwindMind. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;