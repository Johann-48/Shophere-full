import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiTrash2,
  FiFilter,
  FiDollarSign,
  FiStar,
  FiXCircle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../ProductCard";
import CommerceCard from "../CommerceCard";
import { useTheme } from "../../contexts/ThemeContext";

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
  const [commerces, setCommerces] = useState([]);
  const [showAllCommerces, setShowAllCommerces] = useState(false);

  const [sortOption, setSortOption] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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
    setSelectedCategory(id);
  };

  const handleProductClick = (id) => {
    navigate(`/produto/${id}`);
  };

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const applyFilters = () => {
    let filtered = [...baseProducts];

    if (minPrice)
      filtered = filtered.filter(
        (p) => toNumber(p.price) >= parseFloat(minPrice)
      );
    if (maxPrice)
      filtered = filtered.filter(
        (p) => toNumber(p.price) <= parseFloat(maxPrice)
      );
    if (minRating) {
      const min = parseFloat(minRating);
      filtered = filtered.filter((p) => (p.avgRating || 0) >= min);
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

  // 1) Calcula top 4 por média de avaliação
  const bestRated = [...allProducts]
    .sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0))
    .slice(0, 4);

  return (
    <div className={`min-h-screen font-sans ${currentTheme.textPrimary} ${currentTheme.background} animate-fadeInUp`}>
      {/* Banner */}

      {/* Comércios */}
      <section className="px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold gradient-text">🏬 Comércios</h2>
            <Link
              to="/commerces/search"
              className={`text-sm text-white ${currentTheme.button} px-4 py-2 rounded-lg transition-all duration-200 btn-primary focus-ring`}
            >
              Pesquisar Comércio
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
              className={`px-6 py-3 ${currentTheme.button} text-white rounded-lg shadow-lg transition-all duration-300 font-semibold btn-primary`}
            >
              {showAllCommerces
                ? "🔼 Mostrar Menos"
                : "🔽 Ver Todos os Comércios"}
            </motion.button>
          </div>
        )}
        </div>
      </section>

      {/* Categorias */}
      <section className="px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${currentTheme.textPrimary}`}>
            🗂 Navegue por Categorias
          </h2>

          <div className="flex overflow-x-auto gap-4 pb-4 px-1 hide-scrollbar">
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`min-w-[140px] rounded-xl flex flex-col items-center justify-center text-center px-4 py-5 text-sm font-semibold cursor-pointer border-2 transition-all duration-200 card-hover ${
                  selectedCategory === cat.id 
                    ? `${currentTheme.accent} text-white border-blue-400` 
                    : `${currentTheme.card} ${currentTheme.text} border-transparent hover:border-blue-400`
                }`}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              >
                <div className="text-3xl mb-2">🗂</div>
                {cat.nome}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Produtos em Destaque */}
      <section className="px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-2xl md:text-3xl font-bold gradient-text">
              ✨ Produtos em Destaque
            </h2>
            <div className="flex gap-2">
              <button
                onClick={toggleFilters}
                className={`flex items-center gap-2 text-sm text-white ${currentTheme.secondary} px-4 py-2 rounded-lg transition-all duration-200 btn-primary focus-ring`}
              >
                <FiFilter /> Filtrar
              </button>
              <Link
                to="/search"
                className={`text-sm text-white ${currentTheme.button} px-4 py-2 rounded-lg transition-all duration-200 btn-primary focus-ring`}
              >
                🔍 Pesquisar
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
              className={`${currentTheme.card} border rounded-2xl shadow-lg p-6 mb-6 glass`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-semibold ${currentTheme.textPrimary}`}>
                  🎯 Filtros Avançados
                </h3>
                <button
                  onClick={toggleFilters}
                  className={`${currentTheme.text} hover:text-blue-400 transition-colors focus-ring rounded`}
                >
                  <FiXCircle size={20} />
                </button>
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
                  <input
                    type="number"
                    placeholder="R$ 0,00"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className={`p-3 border rounded-lg focus-ring transition-colors ${currentTheme.card} ${currentTheme.text}`}
                  />
                </div>
                <div className="flex flex-col">
                  <label className={`mb-1 text-sm font-medium ${currentTheme.text} flex items-center gap-1`}>
                    <FiDollarSign /> Preço máximo
                  </label>
                  <input
                    type="number"
                    placeholder="R$ 0,00"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className={`p-3 border rounded-lg focus-ring transition-colors ${currentTheme.card} ${currentTheme.text}`}
                  />
                </div>

                <div className="flex flex-col">
                  <label className={`mb-1 text-sm font-medium ${currentTheme.text} flex items-center gap-1`}>
                    <FiStar /> Estrelas mínimas
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="0-5"
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value)}
                    className={`p-3 border rounded-lg focus-ring transition-colors ${currentTheme.card} ${currentTheme.text}`}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6 gap-4">
                <button
                  onClick={() => {
                    setSortOption("");
                    setMinPrice("");
                    setMaxPrice("");
                    setMinRating("");
                    setProducts(allProducts);
                    setShowFilters(false);
                  }}
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
            </motion.div>
          )}
        </AnimatePresence>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
