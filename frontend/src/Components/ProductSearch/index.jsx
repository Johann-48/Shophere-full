// src/pages/ProductSearch.jsx
import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../ProductCard";

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetcheia toda vez que query muda (você pode também usar debounce ou buscar ao submeter)
  useEffect(() => {
    const fetchSearch = async () => {
      if (!query) {
        setProducts([]);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/api/products/search`, {
          params: { q: query },
        });
        setProducts(res.data.products);
      } catch (err) {
        console.error(err);
        setError("Falha ao buscar produtos");
      } finally {
        setLoading(false);
      }
    };
    fetchSearch();
  }, [query]);

  const toggleFavorite = (id) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const addToCart = (product) => {
    // se quiser manter carrinho aqui, simule da mesma forma do Home
    console.log("Adicionar ao carrinho:", product);
  };

  return (
    <div className="px-4 py-10 max-w-7xl mx-auto">
      {/* Busca */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full md:w-1/2">
          <FiSearch className="absolute top-3 left-3 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Buscar produto..."
            className="w-full pl-10 pr-4 py-2 border rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {loading && (
        <div className="text-center text-gray-500">Carregando...</div>
      )}
      {error && <div className="text-center text-red-500">{error}</div>}

      {!loading && !error && (
        <>
          {products.length > 0 ? (
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isLiked={favorites.includes(product.id)}
                  onToggleLike={toggleFavorite}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center text-gray-500 text-lg mt-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Nenhum produto encontrado 😕
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
