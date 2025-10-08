import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaTruck,
  FaUndo,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaRegStar,
  FaArrowLeft,
} from "react-icons/fa";

import ProductCard from "../ProductCard";
import { useTheme } from "../../contexts/ThemeContext";

export default function ProductPage() {
  const { isDarkMode } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [thumbnails, setThumbnails] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/products/${id}`);
        const prod = res.data;
        console.log("Produto carregado:", prod); // 👈 VERIFIQUE ISSO NO CONSOLE
        setProduct(prod);
        if (prod.categoria_id) {
          try {
            const resRel = await axios.get(
              `/api/products/categoria/${prod.categoria_id}`
            );
            const related = Array.isArray(resRel.data)
              ? resRel.data
              : resRel.data.products || [];

            console.log("Produtos relacionados recebidos:", related);

            // Remove o produto atual da lista
            const filtered = related.filter((p) => p.id !== prod.id);
            console.log(
              "Produtos relacionados filtrados e limitados:",
              filtered.slice(0, 4)
            );

            setRelatedProducts(filtered.slice(0, 4));
          } catch (err) {
            console.error("Erro ao carregar produtos relacionados", err);
          }
        }
        setMainImage(prod.mainImage || "/assets/placeholder.png");
        setThumbnails(prod.thumbnails || []);
        setQuantity(1);
        setFavorited(false);
      } catch (err) {
        console.error("Erro ao buscar produto:", err);
        setError("Produto não encontrado.");
      } finally {
        setLoading(false);
      }
    };

    if (!id || id === "undefined" || id === "null") {
      setError("Produto inválido ou não selecionado.");
      setLoading(false);
      return;
    }
    fetchProduct();
  }, [id]);

  const increment = () => setQuantity((q) => (q < 10 ? q + 1 : q));
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : q));
  const toggleFavorite = () => setFavorited(!favorited);

  const renderStars = (count) => (
    <>
      {[...Array(5)].map((_, i) =>
        i < count ? (
          <FaStar key={i} className="text-yellow-400" />
        ) : (
          <FaRegStar key={i} className="text-yellow-400" />
        )
      )}
    </>
  );

  if (loading) {
    return <div className={`p-6 max-w-7xl mx-auto ${
      isDarkMode ? 'text-gray-200' : 'text-gray-900'
    }`}>Carregando produto...</div>;
  }

  if (error) {
    return (
      <div className={`p-6 max-w-7xl mx-auto ${
        isDarkMode ? 'text-red-400' : 'text-red-500'
      }`}>
        {error}
        <button
          onClick={() => window.history.back()}
          className={`mt-4 inline-flex items-center gap-2 transition ${
            isDarkMode 
              ? 'text-gray-300 hover:text-gray-100' 
              : 'text-gray-700 hover:text-gray-900'
          }`}
        >
          <FaArrowLeft /> Voltar
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900' 
        : 'bg-gradient-to-br from-green-100 via-white to-green-50'
    }`}>
      <div className={`p-6 max-w-7xl mx-auto font-sans ${
        isDarkMode ? 'text-gray-100' : 'text-gray-900'
      }`}>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className={`inline-flex items-center gap-2 transition ${
            isDarkMode 
              ? 'text-gray-300 hover:text-gray-100' 
              : 'text-gray-700 hover:text-gray-900'
          }`}
          type="button"
        >
          <FaArrowLeft /> Voltar
        </button>
      </div>

      {/* Loja clicável */}
      <div className={`mb-4 text-sm ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Loja:{" "}
        <button
          onClick={() => navigate(`/commerce/${product.comercio.id}`)}
          className={`font-semibold hover:underline focus:outline-none ${
            isDarkMode ? 'text-blue-300' : 'text-blue-600'
          }`}
          type="button"
        >
          {product.comercio.nome}
        </button>
      </div>
      <div className="flex items-center mb-6"></div>
      <div className="flex flex-col md:flex-row gap-10">
        {/* Thumbnails */}
        <div className="flex md:flex-col gap-4">
          {thumbnails.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setMainImage(src)}
              className={`border rounded-lg p-1 cursor-pointer hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                isDarkMode ? 'border-gray-600' : 'border-gray-300'
              }`}
              type="button"
            >
              <img
                src={src}
                alt={`${product.title} imagem ${idx + 1}`}
                className="w-20 h-20 object-contain"
                loading="lazy"
              />
            </button>
          ))}
        </div>

        {/* Imagem principal */}
        <div className={`flex-1 flex justify-center items-center rounded-xl p-6 shadow-md ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <img
            src={mainImage}
            alt={product.title}
            className="max-h-[400px] object-contain rounded"
            loading="lazy"
          />
        </div>

        {/* Detalhes do produto */}
        <div className="md:w-[420px] space-y-6 flex flex-col">
          <h1 className={`text-3xl font-extrabold leading-tight ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {product.title}
          </h1>

          <div className="flex items-center gap-3">
            <div className="flex text-yellow-400 text-lg">
              {renderStars(product.stars || 0)}
            </div>
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              ({product.reviewsCount || 0} Reviews)
            </span>
            <span
              className={`ml-auto font-semibold text-sm ${
                product.stock ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock ? "Em estoque" : "Indisponível"}
            </span>
            {product.stock && (
              <span className={`text-sm ml-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                ({product.quantidade} disponíveis)
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <p className={`text-3xl font-bold ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>{product.price}</p>
            {product.oldPrice && (
              <p className={`line-through text-lg ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {product.oldPrice}
              </p>
            )}
          </div>

          <p className={`text-base leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {product.description}
          </p>

          <div className="flex items-center gap-4">
            <span className={`font-semibold select-none ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Quantidade:
            </span>
            <div className={`flex items-center border rounded-md overflow-hidden select-none ${
              isDarkMode ? 'border-gray-600' : 'border-gray-300'
            }`}>
              <button
                onClick={decrement}
                className={`px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  isDarkMode 
                    ? 'bg-gray-600 hover:bg-gray-500 text-gray-100' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
                type="button"
              >
                -
              </button>
              <span className={`px-6 py-2 font-mono ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              }`}>{quantity}</span>
              <button
                onClick={increment}
                className={`px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  isDarkMode 
                    ? 'bg-gray-600 hover:bg-gray-500 text-gray-100' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
                type="button"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-4 mt-auto">
            <button
              onClick={() =>
                (window.location.href = `tel:${product.comercio.telefone}`)
              }
              className={`flex-1 py-3 rounded-md font-semibold shadow-md transition focus:outline-none focus:ring-2 text-white ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-500 focus:ring-blue-500' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-600'
              }`}
              type="button"
            >
              📞 Entrar em contato com a loja –{" "}
              {product.comercio?.nome || "Loja"}
            </button>
            {product.barcode && (
              <button
                onClick={() => navigate(`/comparar/${product.barcode}`)}
                className={`flex-1 py-3 rounded-md font-semibold shadow-md transition focus:outline-none focus:ring-2 ${
                  isDarkMode 
                    ? 'bg-yellow-500 hover:bg-yellow-400 text-black focus:ring-yellow-400' 
                    : 'bg-yellow-400 hover:bg-yellow-500 text-black focus:ring-yellow-600'
                }`}
                type="button"
              >
                Comparar Preços 🛍️
              </button>
            )}
            <button
              onClick={toggleFavorite}
              aria-label={
                favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"
              }
              className={`w-14 h-14 flex justify-center items-center border rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                favorited
                  ? isDarkMode 
                    ? "text-blue-400 bg-blue-900 border-blue-600"
                    : "text-blue-600 bg-blue-100 border-blue-300"
                  : isDarkMode 
                    ? "text-gray-400 hover:text-blue-400 hover:bg-blue-900 border-gray-600"
                    : "text-gray-400 hover:text-blue-600 hover:bg-blue-100 border-gray-300"
              }`}
              type="button"
            >
              {favorited ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
            </button>
          </div>

          <div className={`border rounded-lg divide-y shadow-sm mt-6 ${
            isDarkMode 
              ? 'border-gray-600 divide-gray-600' 
              : 'border-gray-200 divide-gray-200'
          }`}>
            <div className="flex items-center gap-4 p-4">
              <FaTruck className={`text-2xl ${
                isDarkMode ? 'text-gray-400' : 'text-gray-700'
              }`} />
              <div>
                <p className={`font-semibold ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>Entrega Grátis</p>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Receba em até 7 dias úteis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4">
              <FaUndo className={`text-2xl ${
                isDarkMode ? 'text-gray-400' : 'text-gray-700'
              }`} />
              <div>
                <p className={`font-semibold ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>Devolução</p>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Grátis em até 15 dias depois da compra
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Avaliações */}

      <section className="mt-16">
        <div className="flex items-center justify-between mb-6 select-none">
          <h3 className={`text-2xl font-semibold ${
            isDarkMode ? 'text-gray-200' : 'text-gray-900'
          }`}>Avaliações dos clientes</h3>
          {/* Botão para escrever avaliação */}
          <Link
            to={`/review/${product.id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Escreva uma avaliação
          </Link>
        </div>

        {product.reviewsCount > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((rev, i) => (
              <div key={i} className={`border-b pb-4 ${
                isDarkMode ? 'border-gray-600' : 'border-gray-200'
              }`}>
                <div className="flex items-center mb-1">
                  {renderStars(rev.note)}
                  <span className={`ml-2 text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>{rev.user}</span>
                </div>
                <p className={`${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>{rev.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <p className={`${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Nenhuma avaliação disponível.</p>
            {/* Também podemos sugerir escrever a primeira avaliação aqui */}
            <Link
              to={`/review/${product.id}`}
              className={`px-4 py-2 text-white rounded-lg transition ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-500' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Seja o primeiro a avaliar
            </Link>
          </div>
        )}
      </section>
      {/* Relacionados */}
      <section className="mt-16">
        <h3 className={`text-2xl font-semibold mb-6 select-none ${
          isDarkMode ? 'text-gray-200' : 'text-gray-900'
        }`}>
          Produtos relacionados
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((product) => (
              <ProductCard
                key={`rel-${product.id}`}
                product={product}
                isLiked={false} // ou ajuste se quiser controle
                onToggleLike={() => {}} // pode ser vazio ou implementar lógica
                onAddToCart={() => {}} // idem
              />
            ))
          ) : (
            <p className={`${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Sem produtos relacionados.</p>
          )}
        </div>
      </section>
      </div>
    </div>
  );
}
