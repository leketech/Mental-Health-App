import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Update document class and CSS variables for theme switching
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark-theme');
      root.style.setProperty('--bg-primary', '#000000');
      root.style.setProperty('--bg-secondary', '#111111');
      root.style.setProperty('--bg-card', '#1a1a1a');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#a1a1aa');
      root.style.setProperty('--text-muted', '#71717a');
      root.style.setProperty('--border-primary', '#27272a');
      root.style.setProperty('--border-secondary', '#3f3f46');
      root.style.setProperty('--accent-primary', '#ffffff');
      root.style.setProperty('--accent-secondary', '#f1f5f9');
      root.style.setProperty('--shadow', '0 4px 6px -1px rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--hover-bg', '#262626');
    } else {
      root.classList.remove('dark-theme');
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8fafc');
      root.style.setProperty('--bg-card', '#ffffff');
      root.style.setProperty('--text-primary', '#0f172a');
      root.style.setProperty('--text-secondary', '#475569');
      root.style.setProperty('--text-muted', '#64748b');
      root.style.setProperty('--border-primary', '#e2e8f0');
      root.style.setProperty('--border-secondary', '#cbd5e1');
      root.style.setProperty('--accent-primary', '#2563eb');
      root.style.setProperty('--accent-secondary', '#3b82f6');
      root.style.setProperty('--shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--hover-bg', '#f1f5f9');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    // Modern CSS classes using CSS variables
    classes: {
      // Backgrounds
      bgPrimary: 'bg-[var(--bg-primary)]',
      bgSecondary: 'bg-[var(--bg-secondary)]',
      bgCard: 'bg-[var(--bg-card)]',
      
      // Text
      textPrimary: 'text-[var(--text-primary)]',
      textSecondary: 'text-[var(--text-secondary)]',
      textMuted: 'text-[var(--text-muted)]',
      
      // Borders
      borderPrimary: 'border-[var(--border-primary)]',
      borderSecondary: 'border-[var(--border-secondary)]',
      
      // Accents
      accentPrimary: 'text-[var(--accent-primary)]',
      accentSecondary: 'text-[var(--accent-secondary)]',
      accentBg: 'bg-[var(--accent-primary)]',
      
      // Interactive states
      hover: 'hover:bg-[var(--hover-bg)]',
      shadow: 'shadow-[var(--shadow)]',
      
      // Transitions
      transition: 'transition-all duration-200 ease-in-out',
      
      // Combined utility classes
      card: 'bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg shadow-[var(--shadow)]',
      button: 'bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:bg-[var(--accent-secondary)] transition-all duration-200 ease-in-out',
      input: 'bg-[var(--bg-card)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]',
    },
    
    // Utility functions
    get: (lightValue, darkValue) => isDarkMode ? darkValue : lightValue,
    
    // Color values for direct use
    colors: {
      primary: isDarkMode ? '#ffffff' : '#2563eb',
      secondary: isDarkMode ? '#a1a1aa' : '#475569',
      background: isDarkMode ? '#000000' : '#ffffff',
      card: isDarkMode ? '#1a1a1a' : '#ffffff',
      border: isDarkMode ? '#27272a' : '#e2e8f0',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div className={`min-h-screen transition-colors duration-300 ${theme.classes.bgPrimary}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;