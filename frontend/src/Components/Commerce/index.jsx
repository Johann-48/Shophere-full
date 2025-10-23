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
          ? "bg-gray-900"
          : "bg-gray-50"
      }`}
    >
      <div className="px-4 py-8 max-w-7xl mx-auto">
        {/* Navegação de volta */}
        <div className="mb-6">
          <BackButton to="/" />
        </div>

        {/* Header - Info do Comércio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`${
            isDarkMode
              ? "bg-slate-800"
              : "bg-white"
          } rounded-2xl shadow-lg overflow-hidden mb-10 border ${
            isDarkMode ? "border-slate-700" : "border-gray-200"
          }`}
        >
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Logo da loja */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <img
                  src={resolveMediaUrl(
                    commerce.logoUrl || commerce.logo_url || commerce.fotos
                  )}
                  alt={commerce.name}
                  className={`w-32 h-32 object-cover rounded-2xl shadow-lg border-2 ${
                    isDarkMode ? "border-slate-700" : "border-gray-200"
                  }`}
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                  <FaStore className="text-white text-xs" />
                </div>
              </motion.div>

              {/* Informações da loja */}
              <div className="flex-1 text-center md:text-left">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className={`text-3xl md:text-4xl font-bold mb-3 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {commerce.name}
                </motion.h1>

                {commerce.description && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className={`text-base mb-6 max-w-2xl ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
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
                  className="flex flex-wrap gap-3 justify-center md:justify-start mb-6"
                >
                  {commerce.address && (
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                        isDarkMode
                          ? "bg-slate-700 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <FaMapMarkerAlt className={isDarkMode ? "text-blue-400" : "text-blue-600"} />
                      <span className="text-sm">
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
                    className={`px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 ${
                      isDarkMode
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    <FaEnvelope />
                    Entrar em contato
                  </button>

                  {mapsUrl && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2 ${
                        isDarkMode
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
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
            className="mb-6"
          >
            <h2
              className={`text-2xl font-bold flex items-center gap-3 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <FaBox className={isDarkMode ? "text-blue-400" : "text-blue-600"} />
              Produtos de {commerce.name}
              <span className={`text-sm font-normal ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                ({products.length} {products.length === 1 ? "produto" : "produtos"})
              </span>
            </h2>
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
              className={`text-center py-12 ${
                isDarkMode
                  ? "bg-slate-800 text-gray-400"
                  : "bg-white text-gray-500"
              } rounded-xl border ${
                isDarkMode ? "border-slate-700" : "border-gray-200"
              }`}
            >
              <FaBox className={`text-5xl mx-auto mb-3 ${isDarkMode ? "text-gray-600" : "text-gray-300"}`} />
              <p className="text-lg font-medium">Nenhum produto encontrado</p>
              <p className="text-sm mt-1">
                Esta loja ainda não possui produtos cadastrados
              </p>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
