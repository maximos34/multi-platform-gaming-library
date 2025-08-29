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
  const [theme, setTheme] = useState('dark');

  // Available themes
  const themes = {
    dark: {
      name: 'Dark',
      bg: 'bg-gray-900',
      cardBg: 'bg-gray-800',
      text: 'text-white',
      textSecondary: 'text-gray-300',
      border: 'border-gray-700',
      primary: 'bg-blue-600',
      primaryHover: 'hover:bg-blue-700',
      secondary: 'bg-gray-700',
      secondaryHover: 'hover:bg-gray-600'
    },
    light: {
      name: 'Light',
      bg: 'bg-gray-100',
      cardBg: 'bg-white',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-gray-300',
      primary: 'bg-blue-500',
      primaryHover: 'hover:bg-blue-600',
      secondary: 'bg-gray-200',
      secondaryHover: 'hover:bg-gray-300'
    },
    blue: {
      name: 'Ocean',
      bg: 'bg-blue-900',
      cardBg: 'bg-blue-800',
      text: 'text-blue-50',
      textSecondary: 'text-blue-200',
      border: 'border-blue-700',
      primary: 'bg-cyan-500',
      primaryHover: 'hover:bg-cyan-600',
      secondary: 'bg-blue-700',
      secondaryHover: 'hover:bg-blue-600'
    },
    green: {
      name: 'Forest',
      bg: 'bg-green-900',
      cardBg: 'bg-green-800',
      text: 'text-green-50',
      textSecondary: 'text-green-200',
      border: 'border-green-700',
      primary: 'bg-emerald-500',
      primaryHover: 'hover:bg-emerald-600',
      secondary: 'bg-green-700',
      secondaryHover: 'hover:bg-green-600'
    },
    purple: {
      name: 'Purple',
      bg: 'bg-purple-900',
      cardBg: 'bg-purple-800',
      text: 'text-purple-50',
      textSecondary: 'text-purple-200',
      border: 'border-purple-700',
      primary: 'bg-violet-500',
      primaryHover: 'hover:bg-violet-600',
      secondary: 'bg-purple-700',
      secondaryHover: 'hover:bg-purple-600'
    }
  };

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const themeColors = themes[theme];
    
    // Remove all theme classes
    Object.values(themes).forEach(t => {
      root.classList.remove(t.bg.split(' ')[0]);
    });
    
    // Add current theme class
    root.classList.add(themeColors.bg.split(' ')[0]);
  }, [theme, themes]);

  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('gamingLibraryTheme');
    if (savedTheme && themes[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when it changes
  const changeTheme = (newTheme) => {
    if (themes[newTheme]) {
      setTheme(newTheme);
      localStorage.setItem('gamingLibraryTheme', newTheme);
    }
  };

  const value = {
    theme,
    themes,
    changeTheme,
    currentTheme: themes[theme]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};