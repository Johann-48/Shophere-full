import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * BackButton - Botão de voltar bonito e interativo
 * @param {string} to - Rota específica para navegar (opcional, padrão: -1)
 * @param {string} label - Texto do botão (padrão: "Voltar")
 * @param {string} variant - Estilo do botão: "primary", "secondary", "minimal" (padrão: "primary")
 * @param {string} className - Classes CSS adicionais
 */
export default function BackButton({ 
  to, 
  label = "Voltar", 
  variant = "primary",
  className = "" 
}) {
  const navigate = useNavigate();
  const { isDarkMode, dark, light } = useTheme();
  const currentTheme = isDarkMode ? dark : light;

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  // Variantes de estilo
  const variants = {
    primary: `
      ${currentTheme.card} ${currentTheme.textPrimary} 
      shadow-lg hover:shadow-xl 
      border border-blue-500/30 hover:border-blue-500/60
      bg-gradient-to-r from-blue-500/10 to-purple-500/10
      hover:from-blue-500/20 hover:to-purple-500/20
    `,
    secondary: `
      ${currentTheme.card} ${currentTheme.textPrimary}
      shadow-md hover:shadow-lg
      border ${isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'}
    `,
    minimal: `
      bg-transparent ${currentTheme.textPrimary}
      hover:bg-gray-100 dark:hover:bg-gray-800
      border border-transparent hover:border-gray-300 dark:hover:border-gray-600
    `
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`
        ${variants[variant]}
        px-6 py-3 rounded-xl
        flex items-center gap-3
        font-medium text-sm
        transition-all duration-300 ease-out
        transform hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2
        ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}
        ${className}
      `}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ x: -4 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{ x: [0, -4, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        <FiArrowLeft size={20} className="text-blue-500" />
      </motion.div>
      <span className="font-semibold">{label}</span>
    </motion.button>
  );
}
