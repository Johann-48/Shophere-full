import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme, dark, light } = useTheme();
  const currentTheme = isDarkMode ? dark : light;

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative flex items-center justify-center w-12 h-6 rounded-full transition-all duration-300 ${
        isDarkMode ? 'bg-slate-600' : 'bg-blue-200'
      } focus-ring`}
      whileTap={{ scale: 0.95 }}
      aria-label={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
    >
      {/* Toggle circle */}
      <motion.div
        className={`absolute w-5 h-5 rounded-full shadow-md flex items-center justify-center ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}
        animate={{
          x: isDarkMode ? -12 : 12,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {isDarkMode ? (
          <FiMoon className="w-3 h-3 text-blue-400" />
        ) : (
          <FiSun className="w-3 h-3 text-yellow-500" />
        )}
      </motion.div>
    </motion.button>
  );
}