// src/pages/Commerce.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../ProductCard";
import BackButton from "../BackButton";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { resolveMediaUrl } from "../../utils/media";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaStore, FaBox } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Commerce() {
  const { isDarkMode } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
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

  if (loading)
    return (
      <div
        className={`p-6 text-center ${
          isDarkMode ? "text-gray-200" : "text-gray-900"
        }`}
      >
        Carregando...
      </div>
    );
  if (error)
    return (
      <div
        className={`p-6 text-center ${
          isDarkMode ? "text-red-400" : "text-red-500"
        }`}
      >
        {error}
      </div>
    );

  // Monta URL do Google Maps
  const mapsUrl =
    commerce.lat && commerce.lng
      ? `https://www.google.com/maps?q=${commerce.lat},${commerce.lng}`
      : commerce.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          commerce.address
        )}`
      : null;

  const handleContactClick = () => {
    if (!commerce?.id) return;

    if (role === "commerce") {
      navigate("/lojadashboard");
      return;
    }

    if (role === "user") {
      const mensagem = encodeURIComponent(
        `Olá, tenho interesse nos produtos da loja ${commerce.name}.`
      );
      navigate(`/contact?lojaId=${commerce.id}&message=${mensagem}`);
      return;
    }

    navigate("/contacts");
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
      <div className="px-4 py-8 max-w-7xl mx-auto">
        {/* Navegação de volta */}
        <div className="mb-6">
          <BackButton to="/" />
        </div>

        {/* Header com Banner e Info do Comércio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`${
            isDarkMode
              ? "bg-gradient-to-r from-slate-800 to-slate-700"
              : "bg-gradient-to-r from-white to-blue-50"
          } rounded-3xl shadow-2xl overflow-hidden mb-10 border ${
            isDarkMode ? "border-slate-700" : "border-gray-100"
          }`}
        >
          {/* Banner decorativo */}
          <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
            </div>
          </div>

          <div className="px-8 pb-8 -mt-16 relative">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Logo da loja */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-50"></div>
                <img
                  src={resolveMediaUrl(
                    commerce.logoUrl || commerce.logo_url || commerce.fotos
                  )}
                  alt={commerce.name}
                  className={`relative w-32 h-32 object-cover rounded-full shadow-2xl border-4 ${
                    isDarkMode ? "border-slate-800" : "border-white"
                  }`}
                />
                <div className="absolute bottom-0 right-0 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                  <FaStore className="text-white text-xs" />
                </div>
              </motion.div>

              {/* Informações da loja */}
              <div className="flex-1 text-center md:text-left mt-4 md:mt-8">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className={`text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}
                >
                  {commerce.name}
                </motion.h1>

                {commerce.description && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className={`text-lg mb-6 max-w-2xl ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {commerce.description}
                  </motion.p>
                )}

                {/* Informações de contato */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex flex-wrap gap-4 justify-center md:justify-start mb-6"
                >
                  {commerce.address && (
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                        isDarkMode
                          ? "bg-slate-700 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <FaMapMarkerAlt className="text-blue-500" />
                      <span className="text-sm font-medium">
                        {commerce.address}
                      </span>
                    </div>
                  )}
                </motion.div>

                {/* Botões de ação */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex flex-wrap gap-3 justify-center md:justify-start"
                >
                  <button
                    type="button"
                    onClick={handleContactClick}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                  >
                    <FaEnvelope />
                    Entrar em contato
                  </button>

                  {mapsUrl && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 ${
                        isDarkMode
                          ? "bg-blue-600 hover:bg-blue-500 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      <FaMapMarkerAlt />
                      Ver localização
                    </a>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Produtos do Comércio */}
        <section>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <FaBox className="text-white text-2xl" />
            </div>
            <div>
              <h2
                className={`text-3xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Produtos de {commerce.name}
              </h2>
              <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                {products.length} {products.length === 1 ? "produto disponível" : "produtos disponíveis"}
              </p>
            </div>
          </motion.div>

          {products.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                >
                  <ProductCard
                    product={product}
                    isLiked={false}
                    onToggleLike={() => {}}
                    onAddToCart={() => {}}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className={`text-center py-16 ${
                isDarkMode
                  ? "bg-slate-800 text-gray-400"
                  : "bg-gray-50 text-gray-500"
              } rounded-3xl`}
            >
              <FaBox className="text-6xl mx-auto mb-4 opacity-30" />
              <p className="text-xl font-medium">Nenhum produto encontrado</p>
              <p className="text-sm mt-2">
                Esta loja ainda não possui produtos cadastrados
              </p>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
