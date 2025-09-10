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
    
    // Update document class for theme switching
    if (isDarkMode) {
      document.documentElement.classList.add('bw-theme');
    } else {
      document.documentElement.classList.remove('bw-theme');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      // Light theme colors
      light: {
        bg: 'bg-white',
        cardBg: 'bg-white',
        text: 'text-slate-900',
        textSecondary: 'text-slate-600',
        border: 'border-slate-200',
        accent: 'text-blue-600',
        accentBg: 'bg-blue-600',
        hover: 'hover:bg-slate-50'
      },
      // Dark theme colors
      dark: {
        bg: 'bg-black',
        cardBg: 'bg-gray-900',
        text: 'text-white',
        textSecondary: 'text-gray-400',
        border: 'border-gray-800',
        accent: 'text-white',
        accentBg: 'bg-white',
        hover: 'hover:bg-gray-800'
      }
    },
    // Dynamic color getter
    get: (lightColor, darkColor) => isDarkMode ? darkColor : lightColor,
    // CSS classes that work with both themes
    classes: {
      bg: 'bg-white group-[:not(.bw-theme)]/bw-theme:bg-white group-bw-theme/bw-theme:bg-black',
      cardBg: 'bg-white group-[:not(.bw-theme)]/bw-theme:bg-white group-bw-theme/bw-theme:bg-gray-900',
      text: 'text-slate-900 group-[:not(.bw-theme)]/bw-theme:text-slate-900 group-bw-theme/bw-theme:text-white',
      textSecondary: 'text-slate-600 group-[:not(.bw-theme)]/bw-theme:text-slate-600 group-bw-theme/bw-theme:text-gray-400',
      border: 'border-slate-200 group-[:not(.bw-theme)]/bw-theme:border-slate-200 group-bw-theme/bw-theme:border-gray-800',
      accent: 'text-blue-600 group-[:not(.bw-theme)]/bw-theme:text-blue-600 group-bw-theme/bw-theme:text-white',
      accentBg: 'bg-blue-600 group-[:not(.bw-theme)]/bw-theme:bg-blue-600 group-bw-theme/bw-theme:bg-white',
      accentText: 'text-white group-[:not(.bw-theme)]/bw-theme:text-white group-bw-theme/bw-theme:text-black',
      hover: 'hover:bg-slate-50 group-[:not(.bw-theme)]/bw-theme:hover:bg-slate-50 group-bw-theme/bw-theme:hover:bg-gray-800'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;