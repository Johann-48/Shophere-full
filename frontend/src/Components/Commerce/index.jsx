// src/pages/Commerce.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiHeart,
  FiTrendingUp,
  FiTrendingDown,
  FiTrash2,
} from "react-icons/fi";
import { motion } from "framer-motion";
import ProductCard from "../ProductCard";
import { useTheme } from "../../contexts/ThemeContext";

export default function Commerce() {
  const { isDarkMode } = useTheme();
  const { id } = useParams();
  const [commerce, setCommerce] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCommerce() {
      try {
        setLoading(true);
        // Busca dados do comércio (inclui address)
        const resComm = await axios.get(`/api/commerces/${id}`);
        setCommerce(resComm.data.commerce || resComm.data);
        // Busca produtos do comércio
        const resProd = await axios.get(`/api/products/commerce/${id}`);
        const data = resProd.data.products || resProd.data;
        setProducts(data);
      } catch (err) {
        console.error("Erro ao carregar comércio ou produtos:", err);
        setError("Não foi possível carregar os dados");
      } finally {
        setLoading(false);
      }
    }
    fetchCommerce();
  }, [id]);

  if (loading) return <div className={`p-6 text-center ${
    isDarkMode ? 'text-gray-200' : 'text-gray-900'
  }`}>Carregando...</div>;
  if (error) return <div className={`p-6 text-center ${
    isDarkMode ? 'text-red-400' : 'text-red-500'
  }`}>{error}</div>;

  // Monta URL do Google Maps
  const mapsUrl =
    commerce.lat && commerce.lng
      ? `https://www.google.com/maps?q=${commerce.lat},${commerce.lng}`
      : commerce.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          commerce.address
        )}`
      : null;

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900' 
        : 'bg-gradient-to-br from-green-100 via-white to-green-50'
    }`}>
      <div className="px-4 py-8 max-w-7xl mx-auto">
      {/* Navegação de volta */}
      <Link
        to="/"
        className={`inline-flex items-center mb-6 transition ${
          isDarkMode 
            ? 'text-gray-300 hover:text-gray-100' 
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <FiArrowLeft className="mr-2" /> Voltar
      </Link>

      {/* Info do Comércio */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
        <img
          src={commerce.logoUrl || "/assets/placeholder-store.png"}
          alt={commerce.name}
          className="w-32 h-32 object-contain rounded-full shadow-lg"
        />
        <div>
          <h1 className={`text-4xl font-extrabold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>{commerce.name}</h1>
          {commerce.description && (
            <p className={`mb-4 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-600'
            }`}>{commerce.description}</p>
          )}

          {/* Exibe endereço */}
          {commerce.address && (
            <p className={`text-sm mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>📍 {commerce.address}</p>
          )}

          {/* Botão de localização */}
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block mt-2 px-4 py-2 text-white rounded transition ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-500' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Ver localização
            </a>
          )}
        </div>
      </div>

      {/* Produtos do Comércio */}
      <section>
        <h2 className={`text-2xl font-bold mb-4 ${
          isDarkMode ? 'text-red-400' : 'text-red-600'
        }`}>
          Produtos de {commerce.name}
        </h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isLiked={false}
                onToggleLike={() => {}}
                onAddToCart={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className={`text-center ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Nenhum produto encontrado 😕
          </div>
        )}
      </section>
      </div>
    </div>
  );
}
