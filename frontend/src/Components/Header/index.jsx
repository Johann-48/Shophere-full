import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useTheme } from "../../contexts/ThemeContext";
import ThemeToggle from "../ThemeToggle";

export default function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const { isDarkMode, dark, light } = useTheme();

  // Get current theme
  const currentTheme = isDarkMode ? dark : light;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(res.data.nome);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
        } else {
          console.error("Erro ao buscar perfil:", err);
        }
      }
    })();
  }, []);

  const defaultLinks = [
    { to: "/", label: "Página Inicial" },
    { to: "/contact", label: "Contato" },
    { to: "/about", label: "Sobre" },
  ];

  const authLinks = [
    { to: "/accountmanager", label: userName || "Perfil", underline: true },
    { to: "/lojadashboard", label: "Dashboard", underline: false },
    {
      to: "/",
      label: "Logout",
      action: () => {
        localStorage.clear();
        setUserName(null);
        navigate("/login");
      },
    },
  ];

  const guestLinks = [
    { to: "/seller", label: "Sign Up Seller" },
    { to: "/signup", label: "Sign Up", underline: true },
    { to: "/login", label: "Login" },
  ];

  const navLinks = userName
    ? [...defaultLinks, ...authLinks]
    : [...defaultLinks, ...guestLinks];

  return (
    <header className={`w-full ${currentTheme.header} glass sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl md:text-2xl font-bold gradient-text">
              SHOPHERE
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {link.action ? (
                <button
                  onClick={link.action}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${currentTheme.text} hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200 focus-ring ${
                    link.underline ? "bg-blue-500/20 text-blue-400" : ""
                  }`}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${currentTheme.text} hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200 focus-ring ${
                    link.underline ? "bg-blue-500/20 text-blue-400" : ""
                  }`}
                >
                  {link.label}
                </Link>
              )}
            </motion.div>
          ))}
          
          {/* Theme Toggle */}
          <div className="ml-4 pl-4 border-l border-current border-opacity-20">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className={`p-2 rounded-lg ${currentTheme.text} hover:bg-blue-500/10 focus-ring transition-colors`}
          >
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`md:hidden ${currentTheme.card} border-t mx-4 mb-4 rounded-lg p-4 space-y-2`}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map((link, idx) => (
              <div key={idx}>
                {link.action ? (
                  <button
                    onClick={() => {
                      link.action();
                      setIsOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${currentTheme.text} hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200 focus-ring ${
                      link.underline ? "bg-blue-500/20 text-blue-400" : ""
                    }`}
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium ${currentTheme.text} hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200 focus-ring ${
                      link.underline ? "bg-blue-500/20 text-blue-400" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
