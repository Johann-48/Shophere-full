import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import API_CONFIG from "../../config/api";
import { useTheme } from "../../contexts/ThemeContext";
import ThemeToggle from "../ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const { isDarkMode, dark, light } = useTheme();
  const { role } = useAuth();

  // Get current theme
  const currentTheme = isDarkMode ? dark : light;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        const res = await axios.get(API_CONFIG.getApiUrl("/api/auth/me"), {
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

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const rightNavLinks = [
    { to: "/", label: "Página Inicial" },
    { to: "/contact", label: "Contato" },
    { to: "/about", label: "Sobre" },
  ];

  const authMenuBase = [
    { to: "/accountmanager", label: "Meu Perfil" },
    {
      label: "Sair",
      action: () => {
        localStorage.clear();
        setUserName(null);
        setProfileOpen(false);
        navigate("/login");
      },
    },
  ];
  const authMenu = role === "commerce"
    ? [{ to: "/accountmanager", label: "Meu Perfil" }, { to: "/lojadashboard", label: "Dashboard" }, ...authMenuBase.slice(1)]
    : authMenuBase;

  const guestMenu = [
    { to: "/login", label: "Entrar" },
    { to: "/signup", label: "Criar conta" },
    { to: "/seller", label: "Vender" },
  ];

  return (
    <header className={`w-full ${currentTheme.header} glass sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center py-3 px-4 md:px-6">
        {/* Left: Brand (start of page) */}
        <div className="flex items-center">
          <Link to="/" className="inline-flex items-center gap-2 select-none">
            <span className="text-xl md:text-2xl font-extrabold tracking-tight">
              <span className={isDarkMode ? "text-white" : "text-gray-900"}>SHOP</span>
              <span className="text-blue-600">HERE</span>
            </span>
          </Link>
        </div>

        {/* Center: spacer */}
        <div className="hidden md:flex" />

        {/* Right: Theme + User icon */}
        <div className="hidden md:flex items-center justify-end gap-2">
          {/* Nav links near theme toggle */}
          <nav className="hidden md:flex items-center gap-1 pr-2 mr-2 border-r border-current/20">
            {rightNavLinks.map((link, idx) => (
              <motion.div key={idx} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${currentTheme.text} hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200 focus-ring`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>
          <ThemeToggle />
          <div className="relative" ref={profileRef}>
            <button
              aria-label="Abrir menu do usuário"
              onClick={() => setProfileOpen((v) => !v)}
              className={`inline-flex items-center justify-center w-9 h-9 rounded-full border border-current/20 ${currentTheme.text} hover:bg-blue-500/10 transition-colors focus-ring`}
            >
              <FiUser size={18} />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 mt-2 min-w-48 ${currentTheme.card} shadow-lg rounded-xl border p-2`}
                >
                  <div className="px-2 pb-2 border-b border-current/10">
                    <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'opacity-70 text-gray-600'}`}>{userName ? "Conectado como" : "Bem-vindo"}</p>
                    <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-slate-100' : ''}`}>{userName || "Visitante"}</p>
                  </div>
                  <div className="py-1">
                    {(userName ? authMenu : guestMenu).map((item, idx) => (
                      <div key={idx}>
                        {item.action ? (
                          <button
                            onClick={item.action}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${isDarkMode ? 'text-slate-100' : currentTheme.text} hover:bg-blue-500/10 transition-colors`}
                          >
                            {item.label}
                          </button>
                        ) : (
                          <Link
                            to={item.to}
                            onClick={() => setProfileOpen(false)}
                            className={`block px-3 py-2 rounded-lg text-sm ${isDarkMode ? 'text-slate-100' : currentTheme.text} hover:bg-blue-500/10 transition-colors`}
                          >
                            {item.label}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right (mobile): theme + menu button */}
        <div className="md:hidden flex items-center justify-end gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen((v) => !v)}
            className={`p-2 rounded-lg ${currentTheme.text} hover:bg-blue-500/10 focus-ring transition-colors`}
            aria-label="Abrir menu"
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
            {/* Auth block */}
            <div className="mb-2">
              <div className="px-2 pb-2 border-b border-current/10">
                <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'opacity-70 text-gray-600'}`}>{userName ? "Conectado como" : "Bem-vindo"}</p>
                <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-slate-100' : ''}`}>{userName || "Visitante"}</p>
              </div>
              {(userName ? authMenu : guestMenu).map((item, idx) => (
                <div key={`m-auth-${idx}`}>
                  {item.action ? (
                    <button
                      onClick={() => {
                        item.action();
                        setIsOpen(false);
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${isDarkMode ? 'text-slate-100' : currentTheme.text} hover:bg-blue-500/10 transition-colors`}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 rounded-lg text-sm ${isDarkMode ? 'text-slate-100' : currentTheme.text} hover:bg-blue-500/10 transition-colors`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Main nav */}
            {rightNavLinks.map((link, idx) => (
              <Link
                key={`m-nav-${idx}`}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${currentTheme.text} hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200 focus-ring`}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
