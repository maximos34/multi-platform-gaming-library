import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark' | 'blue' | 'green' | 'purple';

interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
}

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: (newTheme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeColors: Record<Theme, ThemeColors> = {
  light: {
    primary: '#3b82f6',
    background: '#f3f4f6',
    card: '#ffffff',
    text: '#1f2937',
    border: '#d1d5db',
    notification: '#ef4444',
  },
  dark: {
    primary: '#3b82f6',
    background: '#111827',
    card: '#1f2937',
    text: '#f9fafb',
    border: '#374151',
    notification: '#ef4444',
  },
  blue: {
    primary: '#0ea5e9',
    background: '#0c4a6e',
    card: '#075985',
    text: '#e0f2fe',
    border: '#0369a1',
    notification: '#38bdf8',
  },
  green: {
    primary: '#10b981',
    background: '#052e16',
    card: '#064e3b',
    text: '#d1fae5',
    border: '#047857',
    notification: '#34d399',
  },
  purple: {
    primary: '#8b5cf6',
    background: '#312e81',
    card: '#3730a3',
    text: '#e0e7ff',
    border: '#4338ca',
    notification: '#a78bfa',
  },
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    // Load theme from storage or use system preference
    const loadTheme = async () => {
      // In a real app, you would load from AsyncStorage or similar
      // For now, we'll use the system preference or default to dark
      setTheme(colorScheme === 'light' ? 'light' : 'dark');
    };
    
    loadTheme();
  }, [colorScheme]);

  const toggleTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    // In a real app, you would save to AsyncStorage or similar
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors: themeColors[theme],
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};