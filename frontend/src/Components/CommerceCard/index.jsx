import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

export default function CommerceCard({ commerce }) {
  const { isDarkMode, dark, light } = useTheme();
  const currentTheme = isDarkMode ? dark : light;

  return (
    <Link to={`/commerce/${commerce.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`${currentTheme.card} rounded-2xl p-6 flex flex-col items-center text-center hover:ring-2 hover:ring-blue-400 transition-all duration-200 card-hover h-80 w-full`}
      >
        <div className="flex-shrink-0 mb-4">
          <img
            src={commerce.logoUrl || "/assets/placeholder-store.png"}
            alt={commerce.name}
            className="w-20 h-20 object-contain rounded-full mx-auto"
          />
        </div>
        <div className="flex-grow flex flex-col justify-center">
          <h3 className={`text-lg font-semibold mb-2 ${currentTheme.textPrimary} line-clamp-2`}>{commerce.name}</h3>
          {commerce.description && (
            <p className={`text-sm ${currentTheme.textSecondary} line-clamp-3`}>{commerce.description}</p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
