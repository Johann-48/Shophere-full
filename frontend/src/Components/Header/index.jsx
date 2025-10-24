import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiUser, FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import API_CONFIG from "../../config/api";
import { useTheme } from "../../contexts/ThemeContext";
import ThemeToggle from "../ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileRef = useRef(null);
  const { isDarkMode, dark, light } = useTheme();
  const { role } = useAuth();

  // Get current theme
  const currentTheme = isDarkMode ? dark : light;

  // Detecta o scroll para mostrar/esconder a barra de pesquisa
  useEffect(() => {
    // Só ativa na página inicial
    if (location.pathname !== "/") {
      setShowSearchBar(false);
      return;
    }

    const handleScroll = () => {
      // Mostra a barra após rolar 600px (aproximadamente após a seção de comércios)
      const scrollPosition = window.scrollY;
      setShowSearchBar(scrollPosition > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUserName(null);
      return;
    }

    (async () => {
      try {
        const res = await axios.get(API_CONFIG.getApiUrl("/api/auth/me"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(res.data.nome);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          setUserName(null);
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

  // Só mostra Dashboard/Contatos se o usuário estiver logado
  const contactDestination = userName
    ? role === "commerce"
      ? { to: "/lojadashboard", label: "Dashboard" }
      : { to: role === "user" ? "/contact" : "/contacts", label: "Contatos" }
    : null;

  const rightNavLinks = [
    { to: "/", label: "Página Inicial" },
    ...(contactDestination ? [contactDestination] : []),
    { to: "/about", label: "Sobre" },
  ];

  const logoutItem = {
    label: "Sair",
    action: () => {
      localStorage.clear();
      setUserName(null);
      setProfileOpen(false);
      navigate("/login");
    },
  };

  const authMenu =
    role === "commerce"
      ? [{ to: "/lojadashboard", label: "Dashboard" }, logoutItem]
      : [{ to: "/accountmanager", label: "Meu Perfil" }, logoutItem];

  const guestMenu = [
    { to: "/login", label: "Entrar" },
    { to: "/signup", label: "Criar conta" },
    { to: "/seller", label: "Vender" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className={`w-full ${currentTheme.header} glass sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center py-3 px-4 md:px-6">
        {/* Left: Brand (start of page) */}
        <div className="flex items-center">
          <Link to="/" className="inline-flex items-center gap-2 select-none">
            <span className="text-xl md:text-2xl font-extrabold tracking-tight">
              <span className={isDarkMode ? "text-white" : "text-gray-900"}>
                SHOP
              </span>
              <span className="text-blue-600">HERE</span>
            </span>
          </Link>
        </div>

        {/* Center: Barra de pesquisa (aparece no scroll) */}
        <div className="hidden md:flex justify-center">
          <AnimatePresence>
            {showSearchBar && (
              <motion.form
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSearch}
                className="w-full max-w-md"
              >
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar produtos..."
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-slate-800/80 border-slate-700 text-white placeholder-slate-400"
                        : "bg-white/90 border-blue-200 text-gray-900 placeholder-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  />
                  <FiSearch
                    className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      isDarkMode ? "text-slate-400" : "text-gray-400"
                    }`}
                    size={18}
                  />
                  {searchQuery && (
                    <button
                      type="submit"
                      className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md text-xs font-medium ${
                        isDarkMode
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white transition-colors`}
                    >
                      Buscar
                    </button>
                  )}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Theme + User icon */}
        <div className="hidden md:flex items-center justify-end gap-2">
          {/* Nav links near theme toggle */}
          <nav className="hidden md:flex items-center gap-1 pr-2 mr-2 border-r border-current/20">
            {rightNavLinks.map((link, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
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
                    <p
                      className={`text-xs ${
                        isDarkMode
                          ? "text-slate-300"
                          : "opacity-70 text-gray-600"
                      }`}
                    >
                      {userName ? "Conectado como" : "Bem-vindo"}
                    </p>
                    <p
                      className={`text-sm font-semibold truncate ${
                        isDarkMode ? "text-slate-100" : ""
                      }`}
                    >
                      {userName || "Visitante"}
                    </p>
                  </div>
                  <div className="py-1">
                    {(userName ? authMenu : guestMenu).map((item, idx) => (
                      <div key={idx}>
                        {item.action ? (
                          <button
                            onClick={item.action}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                              isDarkMode ? "text-slate-100" : currentTheme.text
                            } hover:bg-blue-500/10 transition-colors`}
                          >
                            {item.label}
                          </button>
                        ) : (
                          <Link
                            to={item.to}
                            onClick={() => setProfileOpen(false)}
                            className={`block px-3 py-2 rounded-lg text-sm ${
                              isDarkMode ? "text-slate-100" : currentTheme.text
                            } hover:bg-blue-500/10 transition-colors`}
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

      {/* Barra de pesquisa mobile (abaixo do header principal) */}
      <AnimatePresence>
        {showSearchBar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-current/10"
          >
            <form onSubmit={handleSearch} className="px-4 py-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar produtos..."
                  className={`w-full pl-10 pr-20 py-2.5 rounded-lg border ${
                    isDarkMode
                      ? "bg-slate-800/80 border-slate-700 text-white placeholder-slate-400"
                      : "bg-white/90 border-blue-200 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                />
                <FiSearch
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                    isDarkMode ? "text-slate-400" : "text-gray-400"
                  }`}
                  size={18}
                />
                {searchQuery && (
                  <button
                    type="submit"
                    className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md text-xs font-medium ${
                      isDarkMode
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white transition-colors`}
                  >
                    Buscar
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

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
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-slate-300" : "opacity-70 text-gray-600"
                  }`}
                >
                  {userName ? "Conectado como" : "Bem-vindo"}
                </p>
                <p
                  className={`text-sm font-semibold truncate ${
                    isDarkMode ? "text-slate-100" : ""
                  }`}
                >
                  {userName || "Visitante"}
                </p>
              </div>
              {(userName ? authMenu : guestMenu).map((item, idx) => (
                <div key={`m-auth-${idx}`}>
                  {item.action ? (
                    <button
                      onClick={() => {
                        item.action();
                        setIsOpen(false);
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                        isDarkMode ? "text-slate-100" : currentTheme.text
                      } hover:bg-blue-500/10 transition-colors`}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 rounded-lg text-sm ${
                        isDarkMode ? "text-slate-100" : currentTheme.text
                      } hover:bg-blue-500/10 transition-colors`}
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
