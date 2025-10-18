import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiTrash2,
  FiFilter,
  FiDollarSign,
  FiStar,
  FiXCircle,
  FiSearch,
  FiShoppingBag,
  FiTrendingUp,
  FiGrid,
  FiCpu,
  FiHome,
  FiBook,
  FiHeart,
  FiGlobe,
  FiShoppingCart,
} from "react-icons/fi";
import { GiRunningShoe, GiLipstick, GiGamepad } from "react-icons/gi";
import { MdDevices } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../ProductCard";
import CommerceCard from "../CommerceCard";
import { useTheme } from "../../contexts/ThemeContext";

const PRICE_BANDS = [
  { id: "budget", label: "Até R$100", range: [0, 100] },
  { id: "smart", label: "R$100 - R$500", range: [100, 500] },
  { id: "premium", label: "Acima de R$500", range: [500, Infinity] },
];

// Banner images for dark and light modes
const HERO_IMAGE_DARK = "https://t4.ftcdn.net/jpg/03/39/60/67/360_F_339606710_pFQOII8MwyEVqXK5vb4XsIaJr13cipWO.jpg";
const HERO_IMAGE_LIGHT = "https://t4.ftcdn.net/jpg/03/39/60/67/360_F_339606710_pFQOII8MwyEVqXK5vb4XsIaJr13cipWO.jpg";
const HERO_FALLBACK_URL = "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1920&h=600&fit=crop&q=80";

export default function Home() {
  const navigate = useNavigate();
  const { isDarkMode, dark, light } = useTheme();
  
  // Get current theme
  const currentTheme = isDarkMode ? dark : light;
  const [categories, setCategories] = useState([]);
  const [baseProducts, setBaseProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  // Enhanced category filter state (searchable combobox)
  const [catQuery, setCatQuery] = useState("");
  const [catOpen, setCatOpen] = useState(false);
  const [catHighlight, setCatHighlight] = useState(0);
  const catBoxRef = React.useRef(null);
  const [commerces, setCommerces] = useState([]);
  const [showAllCommerces, setShowAllCommerces] = useState(false);
  // Categoria via filtro (sem seção dedicada)

  const [sortOption, setSortOption] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceBand, setSelectedPriceBand] = useState(null);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  
  // Hero banner image based on theme
  const heroSrc = isDarkMode ? HERO_IMAGE_DARK : HERO_IMAGE_LIGHT;
  const [heroError, setHeroError] = useState(false);

  const toggleLike = (id) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toNumber = (value) => {
    if (typeof value === "number") return value;
    if (!value) return NaN;
    const cleaned = value
      .toString()
      .replace(/[^\d,.-]/g, "")
      .replace(",", ".");
    return parseFloat(cleaned);
  };

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [resCat, resComm, resProd] = await Promise.all([
          axios.get("/api/categories"),
          axios.get("/api/commerces"),
          axios.get("/api/products"),
        ]);

        // usa resCat.data, resComm.data e resProd.data em vez de `data`
        setCategories([{ id: null, nome: "Todos" }, ...(resCat.data || [])]);
        setCommerces(resComm.data.commerces || resComm.data);

        const produtos = Array.isArray(resProd.data)
          ? resProd.data
          : resProd.data.products;

        // armazena em allProducts e em products
        setAllProducts(produtos);
        setBaseProducts(produtos);
        setProducts(produtos);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar dados iniciais");
      }
    }
    fetchInitialData();
  }, []);

  useEffect(() => {
    async function fetchProductsByCategory() {
      // se categoria for “Todos”
      if (selectedCategory === null) {
        setProducts(allProducts);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `/api/products/categoria/${selectedCategory}`
        );
        const data = Array.isArray(res.data) ? res.data : res.data.products;

        setProducts(data);
        setBaseProducts(data);

        // se você quiser que o “Todos” volte a ser allProducts original,
        // não sobreescreva allProducts aqui
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os produtos da categoria");
      } finally {
        setLoading(false);
      }
    }
    fetchProductsByCategory();
  }, [selectedCategory, allProducts]);

  const handleCategorySelect = (id) => {
    setSelectedCategory(id == null ? null : Number(id));
    setCatOpen(false);
    setCatQuery("");
  };

  // Close category dropdown on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!catBoxRef.current) return;
      if (!catBoxRef.current.contains(e.target)) setCatOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const iconByName = {
    "Eletrônicos": <MdDevices className="w-5 h-5" />,
    "Moda": <FiHeart className="w-5 h-5" />,
    "Esportes": <GiRunningShoe className="w-5 h-5" />,
    "Mercado": <FiShoppingCart className="w-5 h-5" />,
    "Beleza": <GiLipstick className="w-5 h-5" />,
    "Casa": <FiHome className="w-5 h-5" />,
    "Livros": <FiBook className="w-5 h-5" />,
    "Jogos": <GiGamepad className="w-5 h-5" />,
    "Outros": <FiStar className="w-5 h-5" />,
    "Todos": <FiGlobe className="w-5 h-5" />,
  };

  const normalizedCategories = categories.map((c) => ({
    id: c.id,
    nome: c.nome,
    icon: iconByName[c.nome] || <FiStar className="w-5 h-5" />,
  }));
  const filteredCats = normalizedCategories.filter((c) =>
    (catQuery || "").length === 0
      ? true
      : c.nome.toLowerCase().includes(catQuery.toLowerCase())
  );

  // Remove slider behavior; we'll use a modal popup instead

  const handleProductClick = (id) => {
    navigate(`/produto/${id}`);
  };

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const productHasStock = (prod) => {
    if (!prod || typeof prod !== "object") return true;
    if (typeof prod.available === "boolean") return prod.available;
    const stockFields = [
      "stock",
      "quantity",
      "estoque",
      "qtd",
      "availableQuantity",
    ];
    for (const field of stockFields) {
      const value = prod[field];
      if (value != null) {
        const asNumber = Number(value);
        if (!Number.isNaN(asNumber)) return asNumber > 0;
        return Boolean(value);
      }
    }
    return true;
  };

  const productHasDiscount = (prod) => {
    if (!prod || typeof prod !== "object") return false;
    const discountFields = [
      "discountPercent",
      "discount",
      "discountPercentage",
    ];
    if (discountFields.some((field) => Number(prod[field]) > 0)) return true;
    const priceValue = toNumber(prod.price);
    const oldPriceValue = toNumber(prod.oldPrice);
    if (!Number.isNaN(priceValue) && !Number.isNaN(oldPriceValue)) {
      return oldPriceValue > priceValue;
    }
    return false;
  };

  const selectedBand = PRICE_BANDS.find((band) => band.id === selectedPriceBand);
  const totalCount = baseProducts.length;
  const filteredCount = products.length;
  const availableCount = baseProducts.filter((prod) => productHasStock(prod)).length;
  const categoryCount = Math.max(categories.length - 1, 0);
  const softSurface = isDarkMode
    ? "bg-slate-900/60 border-slate-700/60 text-slate-200"
    : "bg-white/80 border-blue-100 text-slate-700";
  const toggleActive = isDarkMode
    ? "bg-blue-500/30 border-blue-400 text-blue-100 shadow-inner"
    : "bg-blue-500/10 border-blue-400 text-blue-700 shadow-sm";
  const toggleInactive = isDarkMode
    ? "bg-slate-900/40 border-slate-700 text-slate-200 hover:border-blue-400"
    : "bg-white border-blue-100 text-slate-600 hover:border-blue-400";

  const activeFilters = [];
  if (sortOption) {
    const labelMap = {
      high: "Ordenado: Maior preço",
      low: "Ordenado: Menor preço",
      bestseller: "Ordenado: Mais vendidos",
    };
    activeFilters.push({
      id: "sort",
      label: labelMap[sortOption] || "Ordenação personalizada",
      onRemove: () => setSortOption(""),
    });
  }
  if (minPrice) {
    activeFilters.push({
      id: "minPrice",
      label: `Mínimo R$ ${parseFloat(minPrice).toFixed(2)}`,
      onRemove: () => setMinPrice(""),
    });
  }
  if (maxPrice) {
    activeFilters.push({
      id: "maxPrice",
      label: `Máximo R$ ${parseFloat(maxPrice).toFixed(2)}`,
      onRemove: () => setMaxPrice(""),
    });
  }
  if (minRating !== "") {
    activeFilters.push({
      id: "rating",
      label: `${parseFloat(minRating).toFixed(1)}+ estrelas`,
      onRemove: () => setMinRating(""),
    });
  }
  if (selectedBand) {
    activeFilters.push({
      id: "band",
      label: selectedBand.label,
      onRemove: () => setSelectedPriceBand(null),
    });
  }
  if (onlyAvailable) {
    activeFilters.push({
      id: "available",
      label: "Somente disponíveis",
      onRemove: () => setOnlyAvailable(false),
    });
  }
  if (onlyDiscounted) {
    activeFilters.push({
      id: "discount",
      label: "Com desconto",
      onRemove: () => setOnlyDiscounted(false),
    });
  }

  const applyFilters = () => {
    let filtered = [...baseProducts];

    if (minPrice !== "")
      filtered = filtered.filter(
        (p) => toNumber(p.price) >= parseFloat(minPrice)
      );
    if (maxPrice !== "")
      filtered = filtered.filter(
        (p) => toNumber(p.price) <= parseFloat(maxPrice)
      );
    if (selectedBand) {
      const [min, max] = selectedBand.range;
      filtered = filtered.filter((p) => {
        const priceValue = toNumber(p.price);
        if (Number.isNaN(priceValue)) return true;
        const minOk = min === 0 ? priceValue >= 0 : priceValue >= min;
        const maxOk = max === Infinity ? true : priceValue <= max;
        return minOk && maxOk;
      });
    }
    if (minRating !== "") {
      const min = parseFloat(minRating);
      if (!Number.isNaN(min)) {
        filtered = filtered.filter((p) => (p.avgRating || 0) >= min);
      }
    }
    if (onlyAvailable) {
      filtered = filtered.filter((p) => productHasStock(p));
    }
    if (onlyDiscounted) {
      filtered = filtered.filter((p) => productHasDiscount(p));
    }
    if (sortOption === "high") {
      filtered.sort((a, b) => toNumber(b.price) - toNumber(a.price));
    } else if (sortOption === "low") {
      filtered.sort((a, b) => toNumber(a.price) - toNumber(b.price));
    } else if (sortOption === "bestseller") {
      filtered.sort((a, b) => (b.sales || 0) - (a.sales || 0));
    }

    setProducts(filtered);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setSortOption("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setSelectedPriceBand(null);
    setOnlyAvailable(false);
    setOnlyDiscounted(false);
    const targetProducts = selectedCategory === null ? allProducts : baseProducts;
    setProducts(targetProducts);
    setShowFilters(false);
  };

  // 1) Calcula top 4 por média de avaliação
  const bestRated = [...allProducts]
    .sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0))
    .slice(0, 4);

  return (
    <div className={`min-h-screen font-sans ${currentTheme.textPrimary} ${currentTheme.background} animate-fadeInUp`}>
      {/* Scrim to block clicks behind category dropdown */}
      {catOpen && (
        <div
          className="fixed inset-0 z-50 bg-transparent"
          onClick={() => setCatOpen(false)}
          aria-hidden
        />
      )}
      {/* Hero Image */}
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <img
            src={heroError ? HERO_FALLBACK_URL : heroSrc}
            alt="Banner principal"
            className="w-full h-48 md:h-72 object-cover rounded-2xl shadow"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setHeroError(true)}
          />
        </div>
      </section>

      {/* Comércios */}
      <section className="px-4 md:px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                <FiShoppingBag className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold gradient-text">Comércios</h2>
            </div>
            <Link
              to="/commerces/search"
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              <FiSearch className="w-4 h-4" />
              Pesquisar Comércios
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(showAllCommerces ? commerces : commerces.slice(0, 8)).map((c) => (
              <motion.div
                key={c.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
              >
                <CommerceCard commerce={c} />
              </motion.div>
            ))}
        </div>

        {commerces.length > 8 && (
          <div className="mt-6 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAllCommerces((prev) => !prev)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              <FiGrid className="w-5 h-5" />
              {showAllCommerces
                ? "Mostrar Menos"
                : "Ver Todos os Comércios"}
            </motion.button>
          </div>
        )}
        </div>
      </section>

  {/* (Sem seção de categorias) */}
      {/* Produtos em Destaque */}
      <section className="px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-orange-900/30' : 'bg-orange-100'}`}>
                <FiTrendingUp className={`w-6 h-6 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold gradient-text">
                Produtos em Destaque
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleFilters}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-500 hover:to-purple-600' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                }`}
              >
                <FiFilter className="w-4 h-4" />
                {showCategories ? 'Ocultar Filtros' : 'Filtrar'}
              </button>
              <Link
                to="/search"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-500 hover:to-green-600' 
                    : 'bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700'
                }`}
              >
                <FiSearch className="w-4 h-4" />
                Pesquisar Produtos
              </Link>
            </div>
          </div>
        {/* Filtros visíveis apenas se showFilters === true */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`${currentTheme.card} relative overflow-hidden border rounded-2xl shadow-xl p-6 mb-6 glass`}
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/15 via-purple-500/10 to-pink-500/15 blur-xl"
                aria-hidden
              />
              <div className="relative z-10 space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className={`text-xl font-semibold ${currentTheme.textPrimary} flex items-center gap-2`}>
                      <FiFilter className="w-5 h-5" /> Filtros Avançados
                    </h3>
                    <p className={`text-sm ${currentTheme.textSecondary}`}>
                      Combine múltiplos critérios para encontrar o produto ideal.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${currentTheme.secondary}`}>
                      {filteredCount} de {totalCount || 0} itens visíveis
                    </span>
                    <button
                      onClick={toggleFilters}
                      className={`${currentTheme.text} hover:text-blue-400 transition-colors focus-ring rounded-full p-2`}
                      aria-label="Fechar filtros"
                    >
                      <FiXCircle size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className={`rounded-xl border px-4 py-3 ${softSurface}`}>
                    <p className="text-xs uppercase tracking-wide opacity-70 flex items-center gap-2">
                      <FiTrendingUp className="w-4 h-4" /> Em destaque agora
                    </p>
                    <p className="text-lg font-semibold">{filteredCount}</p>
                  </div>
                  <div className={`rounded-xl border px-4 py-3 ${softSurface}`}>
                    <p className="text-xs uppercase tracking-wide opacity-70 flex items-center gap-2">
                      <FiShoppingBag className="w-4 h-4" /> Com estoque
                    </p>
                    <p className="text-lg font-semibold">{availableCount}</p>
                  </div>
                  <div className={`rounded-xl border px-4 py-3 ${softSurface}`}>
                    <p className="text-xs uppercase tracking-wide opacity-70 flex items-center gap-2">
                      <FiGrid className="w-4 h-4" /> Categorias mapeadas
                    </p>
                    <p className="text-lg font-semibold">{categoryCount}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex flex-col">
                    <label className={`mb-1 text-sm font-medium ${currentTheme.text}`}>
                      Ordenar por
                    </label>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className={`p-3 border rounded-lg focus-ring transition-colors ${currentTheme.card} ${currentTheme.text}`}
                    >
                      <option value="">Selecione</option>
                      <option value="high">Mais caro</option>
                      <option value="low">Mais barato</option>
                      <option value="bestseller">Mais vendidos</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className={`mb-1 text-sm font-medium ${currentTheme.text} flex items-center gap-1`}>
                      <FiDollarSign /> Preço mínimo
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-70">R$</span>
                      <input
                        type="number"
                        placeholder="0,00"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className={`w-full pl-8 pr-3 py-3 border rounded-lg focus-ring transition-colors ${currentTheme.card} ${currentTheme.text}`}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className={`mb-1 text-sm font-medium ${currentTheme.text} flex items-center gap-1`}>
                      <FiDollarSign /> Preço máximo
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-70">R$</span>
                      <input
                        type="number"
                        placeholder="0,00"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className={`w-full pl-8 pr-3 py-3 border rounded-lg focus-ring transition-colors ${currentTheme.card} ${currentTheme.text}`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className={`mb-1 text-sm font-medium ${currentTheme.text} flex items-center gap-1`}>
                      <FiStar /> Estrelas mínimas
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.5"
                      placeholder="0-5"
                      value={minRating}
                      onChange={(e) => setMinRating(e.target.value)}
                      className={`p-3 border rounded-lg focus-ring transition-colors ${currentTheme.card} ${currentTheme.text}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {[
                    {
                      id: "available",
                      label: "Somente em estoque",
                      description: "Oculta itens indisponíveis",
                      value: onlyAvailable,
                      setter: setOnlyAvailable,
                      icon: <FiShoppingBag className="w-5 h-5" />,
                    },
                    {
                      id: "discount",
                      label: "Com desconto",
                      description: "Prioriza ofertas com preço reduzido",
                      value: onlyDiscounted,
                      setter: setOnlyDiscounted,
                      icon: <FiTrendingUp className="w-5 h-5" />,
                    },
                  ].map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => item.setter((prev) => !prev)}
                      className={`rounded-xl border px-4 py-3 text-left transition ${item.value ? toggleActive : toggleInactive}`}
                    >
                      <div className="flex items-center justify-between text-sm font-semibold">
                        <span className="flex items-center gap-2">
                          {item.icon}
                          {item.label}
                        </span>
                        <span className={`text-xs uppercase ${item.value ? "opacity-100" : "opacity-60"}`}>
                          {item.value ? "Ativo" : "Desligado"}
                        </span>
                      </div>
                      <p className="mt-2 text-xs opacity-75">{item.description}</p>
                    </motion.button>
                  ))}
                </div>

                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${currentTheme.textSecondary}`}>
                    Faixas de preço rápidas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_BANDS.map((band) => {
                      const active = selectedPriceBand === band.id;
                      return (
                        <button
                          key={band.id}
                          onClick={() =>
                            setSelectedPriceBand((prev) =>
                              prev === band.id ? null : band.id
                            )
                          }
                          className={`px-3 py-1.5 rounded-full text-sm border transition ${active ? "bg-blue-500 text-white border-blue-500 shadow" : isDarkMode ? "bg-slate-900/40 border-slate-700 text-slate-200 hover:border-blue-400" : "bg-white border-blue-100 text-slate-600 hover:border-blue-400"}`}
                        >
                          {band.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {!!activeFilters.length && (
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${currentTheme.textSecondary}`}>
                      Filtros ativos
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeFilters.map((chip) => (
                        <button
                          key={chip.id}
                          onClick={chip.onRemove}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition ${isDarkMode ? "bg-slate-900/40 border-slate-700 hover:border-blue-400" : "bg-white border-blue-100 hover:border-blue-400"}`}
                        >
                          <span>{chip.label}</span>
                          <FiXCircle size={14} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-4">
                  <button
                    onClick={resetFilters}
                    className={`px-5 py-2 ${currentTheme.secondary} ${currentTheme.text} rounded-lg transition-all duration-200 btn-primary focus-ring`}
                  >
                    Limpar
                  </button>
                  <button
                    onClick={applyFilters}
                    className={`px-5 py-2 ${currentTheme.button} text-white rounded-lg transition-all duration-200 btn-primary focus-ring`}
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Categoria como filtro central — combobox moderno */}
        <div className="my-6">
          <div
            ref={catBoxRef}
            className={`w-full ${currentTheme.card} border rounded-2xl p-4 shadow-lg ${catOpen ? 'relative z-[60]' : ''}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-semibold ${currentTheme.textPrimary}`}>Filtrar por categoria</h3>
              {selectedCategory !== null && (
                <button
                  onClick={() => handleCategorySelect(null)}
                  className={`text-xs px-2 py-1 rounded-lg ${currentTheme.secondary}`}
                >
                  Limpar
                </button>
              )}
            </div>
            {/* Input de busca */}
            <div className="relative">
              <input
                type="text"
                value={catQuery}
                onChange={(e) => { setCatQuery(e.target.value); setCatOpen(true); setCatHighlight(0); }}
                onFocus={() => setCatOpen(true)}
                onKeyDown={(e) => {
                  if (!catOpen) return;
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setCatHighlight((h) => Math.min(h + 1, filteredCats.length - 1));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setCatHighlight((h) => Math.max(h - 1, 0));
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    const choice = filteredCats[catHighlight];
                    if (choice) handleCategorySelect(choice.id);
                  } else if (e.key === 'Escape') {
                    setCatOpen(false);
                  }
                }}
                placeholder={(() => {
                  const sel = normalizedCategories.find((c) => c.id === selectedCategory);
                  return sel ? `Categoria selecionada: ${sel.nome}` : 'Buscar categoria (ex.: Moda, Esportes)';
                })()}
                className={`w-full pl-4 pr-28 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-slate-900/60 text-white border-slate-700' : 'bg-white text-gray-900 border-blue-200'}`}
                aria-autocomplete="list"
                aria-expanded={catOpen}
              />
              {/* Ações rápidas à direita */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  onClick={() => setCatOpen((v) => !v)}
                  className={`text-xs px-3 py-1.5 rounded-lg ${currentTheme.secondary}`}
                >
                  {catOpen ? 'Fechar' : 'Abrir'}
                </button>
              </div>

              {/* Dropdown de sugestões */}
        {catOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
          className={`absolute z-[60] mt-2 w-full max-h-64 overflow-auto rounded-xl shadow-xl border ${isDarkMode ? 'bg-slate-900/95 border-slate-700' : 'bg-white border-blue-200'}`}
                  role="listbox"
                >
                  <li
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleCategorySelect(null)}
                    className={`px-4 py-2 cursor-pointer flex items-center gap-3 ${catHighlight === 0 ? (isDarkMode ? 'bg-slate-800' : 'bg-blue-50') : ''}`}
                    role="option"
                    aria-selected={catHighlight === 0}
                  >
                    <FiGlobe className="w-5 h-5" />
                    <span>Todos</span>
                  </li>
                  {filteredCats
                    .filter((c) => c.id != null)
                    .map((c, idx) => {
                      const pos = idx + 1; // 0 is "Todos"
                      const active = catHighlight === pos;
                      return (
                        <li
                          key={c.id}
                          onMouseDown={(e) => e.preventDefault()}
                          onMouseEnter={() => setCatHighlight(pos)}
                          onClick={() => handleCategorySelect(c.id)}
                          className={`px-4 py-2 cursor-pointer flex items-center gap-3 ${active ? (isDarkMode ? 'bg-slate-800' : 'bg-blue-50') : ''}`}
                          role="option"
                          aria-selected={active}
                        >
                          {c.icon}
                          <span>{c.nome}</span>
                        </li>
                      );
                    })}
                </motion.ul>
              )}
            </div>

            {/* Sugestões rápidas (chips) */}
            <div className="mt-3 flex flex-wrap gap-2">
              {normalizedCategories
                .filter((c) => c.id != null)
                .slice(0, 8)
                .map((c) => (
                  <button
                    key={`chip-${c.id}`}
                    onClick={() => handleCategorySelect(c.id)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition flex items-center gap-1.5 ${
                      selectedCategory === c.id
                        ? 'border-blue-400 bg-blue-500/20'
                        : isDarkMode
                          ? 'border-slate-600 hover:border-slate-500'
                          : 'border-blue-200 hover:border-blue-300'
                    }`}
                    title={c.nome}
                  >
                    {c.icon}
                    {c.nome}
                  </button>
                ))}
            </div>
          </div>
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${catOpen ? 'pointer-events-none select-none' : ''}`}>
          {products.slice(0, 10).map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer"
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ProductCard
                product={product}
                isLiked={liked.includes(product.id)}
                onToggleLike={toggleLike}
              />
            </motion.div>
          ))}
        </div>
        </div>
      </section>
      {/* Melhor Avaliados */}
      <section className="px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${currentTheme.textPrimary}`}>
            ⭐ Melhor Avaliados
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bestRated.map((product) => (
              <ProductCard
                key={`bestRated-${product.id}`}
                product={product}
                isLiked={liked.includes(product.id)}
                onToggleLike={toggleLike}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
