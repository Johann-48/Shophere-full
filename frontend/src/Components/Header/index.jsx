import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiUser, FiSearch, FiTrendingUp, FiShoppingBag, FiStar, FiClock, FiImage, FiArrowRight } from "react-icons/fi";
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
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const profileRef = useRef(null);
  const searchRef = useRef(null);
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

  // Close search results on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    if (showResults) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showResults]);

  // Busca em tempo real quando o usuário digita
  useEffect(() => {
    const searchProducts = async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setSearchLoading(true);
      try {
        const res = await axios.get(`/api/products/search`, {
          params: { q: searchQuery },
        });
        const products = res.data.products || [];
        setSearchResults(products.slice(0, 5)); // Mostra apenas os 5 primeiros resultados
        setShowResults(products.length > 0);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setSearchLoading(false);
      }
    };

    // Debounce - aguarda 300ms após o usuário parar de digitar
    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

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
      setShowResults(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/produto/${productId}`);
    setSearchQuery("");
    setShowResults(false);
  };

  const formatPrice = (price) => {
    const num = Number(price);
    if (isNaN(num)) return "R$ 0,00";
    return num.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
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
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-md relative"
                ref={searchRef}
              >
                <form onSubmit={handleSearch}>
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
                </form>

                {/* Dropdown de Resultados */}
                <AnimatePresence>
                  {showResults && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute top-full mt-3 w-full z-50"
                    >
                      {/* Decorative blur background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10"></div>
                      
                      <div className={`rounded-2xl shadow-2xl border backdrop-blur-xl overflow-hidden ${
                        isDarkMode
                          ? "bg-slate-900/95 border-slate-700/50"
                          : "bg-white/95 border-gray-200/50"
                      }`}>
                        {/* Header com estatísticas */}
                        <div className={`px-4 py-3 border-b flex items-center justify-between ${
                          isDarkMode ? "border-slate-700/50 bg-slate-800/50" : "border-gray-200/50 bg-gray-50/50"
                        }`}>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className={`text-xs font-semibold ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
                              {searchResults.length} produtos encontrados
                            </span>
                          </div>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4"
                          >
                            <FiTrendingUp className="text-blue-500" size={16} />
                          </motion.div>
                        </div>

                        {searchLoading ? (
                          <div className="p-8 text-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
                            ></motion.div>
                            <p className={`mt-3 text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                              Procurando os melhores produtos...
                            </p>
                            <div className="flex items-center justify-center gap-1 mt-2">
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                  className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                                ></motion.div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                            {searchResults.map((product, index) => {
                              const hasDiscount = product.oldPrice && product.price < product.oldPrice;
                              const discountPercent = hasDiscount 
                                ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                                : 0;
                              
                              return (
                                <motion.button
                                  key={product.id}
                                  initial={{ opacity: 0, x: -30 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ 
                                    delay: index * 0.05, 
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 15
                                  }}
                                  onClick={() => handleProductClick(product.id)}
                                  className={`w-full p-4 flex items-center gap-4 transition-all duration-300 group relative overflow-hidden ${
                                    isDarkMode
                                      ? "hover:bg-gradient-to-r hover:from-slate-800/80 hover:to-slate-700/80"
                                      : "hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-purple-50/80"
                                  } border-b ${
                                    isDarkMode
                                      ? "border-slate-800/50"
                                      : "border-gray-100/50"
                                  } last:border-b-0`}
                                >
                                  {/* Efeito de luz no hover */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                  
                                  {/* Imagem do produto */}
                                  <div className="relative flex-shrink-0">
                                    <motion.div
                                      whileHover={{ scale: 1.1, rotate: 2 }}
                                      transition={{ type: "spring", stiffness: 300 }}
                                      className="relative"
                                    >
                                      <img
                                        src={product.mainImage || product.imagem || "https://via.placeholder.com/80"}
                                        alt={product.name || product.nome}
                                        className="w-20 h-20 object-cover rounded-xl shadow-lg ring-2 ring-transparent group-hover:ring-blue-500/50 transition-all duration-300"
                                      />
                                      {/* Badge de desconto */}
                                      {hasDiscount && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                                        >
                                          -{discountPercent}%
                                        </motion.div>
                                      )}
                                      {/* Efeito de brilho */}
                                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </motion.div>
                                  </div>

                                  {/* Informações do produto */}
                                  <div className="flex-1 text-left min-w-0 space-y-2">
                                    {/* Nome e categoria */}
                                    <div>
                                      <h4
                                        className={`font-bold text-base mb-1 group-hover:text-blue-600 transition-colors line-clamp-1 ${
                                          isDarkMode ? "text-slate-100" : "text-gray-900"
                                        }`}
                                      >
                                        {product.name || product.nome}
                                      </h4>
                                      {product.commerceName && (
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                                            isDarkMode 
                                              ? "bg-slate-700/50 text-slate-300" 
                                              : "bg-gray-100 text-gray-600"
                                          }`}>
                                            <FiShoppingBag size={10} />
                                            {product.commerceName}
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Descrição */}
                                    {(product.description || product.descricao) && (
                                      <p
                                        className={`text-xs leading-relaxed line-clamp-2 ${
                                          isDarkMode ? "text-slate-400" : "text-gray-500"
                                        }`}
                                      >
                                        {(product.description || product.descricao)?.substring(0, 80)}
                                        {(product.description || product.descricao)?.length > 80 ? "..." : ""}
                                      </p>
                                    )}

                                    {/* Badges adicionais */}
                                    <div className="flex items-center gap-2">
                                      <motion.span
                                        whileHover={{ scale: 1.05 }}
                                        className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600 dark:text-yellow-500"
                                      >
                                        <FiStar size={12} className="fill-current" />
                                        {product.avgRating || "4.5"}
                                      </motion.span>
                                      <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>•</span>
                                      <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                        {product.sales || Math.floor(Math.random() * 100) + 10} vendas
                                      </span>
                                    </div>
                                  </div>

                                  {/* Preço e ação */}
                                  <div className="text-right flex-shrink-0 space-y-2">
                                    {/* Preço antigo */}
                                    {hasDiscount && (
                                      <p className="text-xs line-through text-gray-400">
                                        {formatPrice(product.oldPrice)}
                                      </p>
                                    )}
                                    
                                    {/* Preço atual */}
                                    <motion.div
                                      whileHover={{ scale: 1.05 }}
                                      className="relative"
                                    >
                                      <p className="font-black text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        {formatPrice(product.price || product.preco)}
                                      </p>
                                      {/* Efeito de brilho no preço */}
                                      <motion.div
                                        animate={{ x: [-100, 100] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                      ></motion.div>
                                    </motion.div>

                                    {/* Botão de ação */}
                                    <motion.div
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 justify-center`}
                                    >
                                      Ver produto
                                      <motion.span
                                        animate={{ x: [0, 3, 0] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                      >
                                        →
                                      </motion.span>
                                    </motion.div>
                                  </div>
                                </motion.button>
                              );
                            })}

                            {/* Footer com botão ver todos */}
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleSearch}
                              className={`w-full p-4 text-center font-bold transition-all duration-300 flex items-center justify-center gap-3 border-t ${
                                isDarkMode
                                  ? "bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 border-slate-700 text-blue-400"
                                  : "bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 border-gray-200 text-blue-600"
                              }`}
                            >
                              <FiSearch size={18} />
                              <span>Ver todos os {searchResults.length}+ resultados</span>
                              <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              >
                                <FiTrendingUp size={18} />
                              </motion.div>
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
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
            className="md:hidden border-t border-current/10 relative"
          >
            <div className="px-4 py-3" ref={searchRef}>
              <form onSubmit={handleSearch}>
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

              {/* Dropdown de Resultados Mobile */}
              <AnimatePresence>
                {showResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="mt-3"
                  >
                    {/* Decorative blur background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-2xl -z-10"></div>
                    
                    <div className={`rounded-2xl shadow-2xl border backdrop-blur-xl overflow-hidden ${
                      isDarkMode
                        ? "bg-slate-900/95 border-slate-700/50"
                        : "bg-white/95 border-gray-200/50"
                    }`}>
                      {/* Header */}
                      <div className={`px-4 py-2.5 border-b flex items-center justify-between ${
                        isDarkMode ? "border-slate-700/50 bg-slate-800/50" : "border-gray-200/50 bg-gray-50/50"
                      }`}>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                          <span className={`text-xs font-semibold ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
                            {searchResults.length} encontrados
                          </span>
                        </div>
                        <FiTrendingUp className="text-blue-500" size={14} />
                      </div>

                      {searchLoading ? (
                        <div className="p-6 text-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="inline-block w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full"
                          ></motion.div>
                          <p className={`mt-2 text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                            Procurando produtos...
                          </p>
                        </div>
                      ) : (
                        <div className="max-h-96 overflow-y-auto custom-scrollbar">
                          {searchResults.map((product, index) => (
                            <motion.button
                              key={product.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.04, type: "spring", stiffness: 100 }}
                              onClick={() => handleProductClick(product.id)}
                              className={`w-full p-3 flex items-center gap-3 transition-all duration-300 group relative overflow-hidden ${
                                isDarkMode
                                  ? "hover:bg-gradient-to-r hover:from-slate-800 hover:to-slate-700"
                                  : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                              } border-b ${
                                isDarkMode ? "border-slate-800/50" : "border-gray-100/50"
                              } last:border-b-0`}
                            >
                              {/* Efeito de luz */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              
                              {/* Imagem */}
                              <div className="relative flex-shrink-0">
                                <motion.div whileHover={{ scale: 1.08 }} className="relative">
                                  <img
                                    src={product.mainImage || product.imagem || "https://via.placeholder.com/80"}
                                    alt={product.name || product.nome}
                                    className="w-16 h-16 object-cover rounded-lg shadow-md ring-1 ring-transparent group-hover:ring-blue-500/30 transition-all"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </motion.div>
                              </div>

                              {/* Info */}
                              <div className="flex-1 text-left min-w-0 space-y-1">
                                <h4 className={`font-bold text-sm truncate group-hover:text-blue-600 transition-colors ${
                                  isDarkMode ? "text-slate-100" : "text-gray-900"
                                }`}>
                                  {product.name || product.nome}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center gap-0.5 text-xs text-yellow-600">
                                    <FiStar size={10} className="fill-current" />
                                    {product.avgRating || "4.5"}
                                  </span>
                                  <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>•</span>
                                  <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                    {product.sales || Math.floor(Math.random() * 50) + 5} vendas
                                  </span>
                                </div>
                                <p className="font-bold text-base bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                  {formatPrice(product.price || product.preco)}
                                </p>
                              </div>
                            </motion.button>
                          ))}

                          {/* Footer */}
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSearch}
                            className={`w-full p-3 text-center text-xs font-bold transition-all flex items-center justify-center gap-2 border-t ${
                              isDarkMode
                                ? "bg-gradient-to-r from-slate-800 to-slate-700 border-slate-700 text-blue-400"
                                : "bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200 text-blue-600"
                            }`}
                          >
                            <FiSearch size={14} />
                            Ver todos os resultados
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
