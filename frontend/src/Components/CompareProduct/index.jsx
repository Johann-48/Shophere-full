import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import ProductCard from "../ProductCard"; // ajuste o caminho conforme seu projeto

const CompareProduct = () => {
  const { codigo } = useParams(); // Espera /comparar/:codigo
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!codigo) return;
    async function loadByBarcode() {
      setLoading(true);
      try {
        const res = await axios.get(`/api/products/barcode/${codigo}`);
        console.log("Resposta /api/products/barcode:", res.data);

        // Tenta várias formas de extrair o array
        const lista = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.products)
          ? res.data.products
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];

        console.log("Lista final de produtos:", lista);
        setProducts(lista);
      } catch (err) {
        console.error("Erro ao buscar produtos por código de barras:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadByBarcode();
  }, [codigo]);

  const produtoPrincipal = products[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 text-gray-900 font-inter px-6 py-10">
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-yellow-600 hover:text-yellow-700 transition font-semibold mb-8"
        >
          <FiArrowLeft className="mr-2" size={20} /> Voltar
        </button>

        {produtoPrincipal && (
          <div className="…">
            <img
              src={produtoPrincipal.mainImage || "/assets/placeholder.png"}
              alt={produtoPrincipal.title} // <- use title
              className="w-64 h-64 object-contain rounded-xl"
            />
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold mb-4">
                {produtoPrincipal.title}
              </h1>
              …
            </div>
          </div>
        )}

        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            🛍️ Preços em diferentes lojas
          </h2>
          {loading ? (
            <p className="text-center text-gray-500">Carregando...</p>
          ) : (
            <div className="grid …">
              {products.map((p) => (
                <ProductCard
                  key={`${p.id}-${p.commerceId}`}
                  product={{
                    id: p.id,
                    title: p.title,
                    price: p.price,
                    mainImage: p.mainImage,
                    commerceName: p.commerceName,
                    commercePhoto: p.commercePhoto,
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CompareProduct;
