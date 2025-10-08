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
  const [isDarkMode, setIsDarkMode] = useState(true); // Começa com modo escuro (atual)

  // Carrega o tema salvo do localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Salva o tema no localStorage quando muda
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    // Cores para modo escuro (melhorado para visibilidade)
    dark: {
      background: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
      header: 'bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50',
      footer: 'bg-slate-900',
      text: 'text-slate-200',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-400',
      card: 'bg-slate-800/90 backdrop-blur-sm border border-slate-600/50',
      accent: 'bg-gradient-to-r from-blue-500 to-blue-600',
      button: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
      secondary: 'bg-slate-700/80 hover:bg-slate-600/80 text-slate-200',
      success: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      warning: 'bg-gradient-to-r from-blue-400 to-indigo-500',
      danger: 'bg-gradient-to-r from-blue-600 to-purple-600',
    },
    // Cores para modo claro (melhorado)
    light: {
      background: 'bg-gradient-to-br from-blue-50 via-white to-indigo-50',
      header: 'bg-white/95 backdrop-blur-sm border-b border-blue-200/50',
      footer: 'bg-gray-50 border-t border-blue-200/50',
      text: 'text-gray-700',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-500',
      card: 'bg-white/95 backdrop-blur-sm border border-blue-200/50 shadow-sm',
      accent: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      button: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
      secondary: 'bg-blue-100 hover:bg-blue-200 text-blue-800',
      success: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      warning: 'bg-gradient-to-r from-blue-400 to-indigo-500',
      danger: 'bg-gradient-to-r from-blue-600 to-purple-600',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};