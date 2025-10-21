import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart, FaStar, FaRegStar } from "react-icons/fa";

import BackButton from "../BackButton";
import ProductCard from "../ProductCard";
import { useTheme } from "../../contexts/ThemeContext";
import { resolveMediaUrl, fallbackOnError } from "../../utils/media";

const PLACEHOLDER_IMAGE = "/assets/placeholder.svg";

const formatPrice = (value) => {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return null;
};

const buildContactMessage = (product) => {
  const title = product?.title || product?.name || product?.nome || "produto";
  return encodeURIComponent(
    `Olá, tenho interesse no produto "${title}". Poderia informar disponibilidade e prazo de entrega?`
  );
};

const sanitizeRating = (value) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) return 0;
  if (parsed > 5) return 5;
  return Math.round(parsed);
};

const determineStock = (product) => {
  if (!product || typeof product !== "object") return true;
  if (typeof product.stock === "boolean") return product.stock;

  const fields = [
    "stock",
    "quantity",
    "quantidade",
    "estoque",
    "availableQuantity",
  ];
  for (const field of fields) {
    const value = product[field];
    if (value == null) continue;

    const numeric = Number(value);
    if (!Number.isNaN(numeric)) return numeric > 0;
    return Boolean(value);
  }

  return true;
};

const getStockAmount = (product) => {
  if (!product || typeof product !== "object") return null;

  const fields = [
    "quantidade",
    "quantity",
    "stock",
    "estoque",
    "availableQuantity",
  ];
  for (const field of fields) {
    const value = product[field];
    if (value == null) continue;

    const numeric = Number(value);
    if (!Number.isNaN(numeric)) return numeric;
  }

  return null;
};

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(PLACEHOLDER_IMAGE);
  const [thumbnails, setThumbnails] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [favorited, setFavorited] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(`/api/products/${id}`);
        const payload = response.data;
        setProduct(payload);

        const resolvedMain = resolveMediaUrl(
          payload.mainImage ||
            payload.imageUrl ||
            payload.image ||
            payload.thumbnail
        );
        setMainImage(resolvedMain || PLACEHOLDER_IMAGE);

        const resolvedThumbs = Array.isArray(payload.thumbnails)
          ? payload.thumbnails
              .map((thumb) => resolveMediaUrl(thumb))
              .filter((thumb) => Boolean(thumb))
          : [];
        setThumbnails(resolvedThumbs);

        if (payload.categoria_id) {
          try {
            const relatedResponse = await axios.get(
              `/api/products/categoria/${payload.categoria_id}`
            );
            const base = Array.isArray(relatedResponse.data)
              ? relatedResponse.data
              : relatedResponse.data?.products || [];
            const filtered = base
              .filter((item) => item.id !== payload.id)
              .slice(0, 4);
            setRelatedProducts(filtered);
          } catch (relatedError) {
            console.error(
              "Erro ao carregar produtos relacionados",
              relatedError
            );
          }
        }
      } catch (err) {
        console.error("Erro ao carregar produto", err);
        setError("Produto não encontrado ou indisponível.");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (!id || id === "null" || id === "undefined") {
      setError("Produto inválido ou não selecionado.");
      setProduct(null);
      setLoading(false);
      return;
    }

    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const increment = () => setQuantity((prev) => Math.min(prev + 1, 10));
  const decrement = () => setQuantity((prev) => Math.max(prev - 1, 1));
  const toggleFavorite = () => setFavorited((prev) => !prev);

  const handleContactSeller = () => {
    if (!product?.comercio?.id) return;
    navigate(
      `/contact?lojaId=${product.comercio.id}&productId=${
        product.id
      }&message=${buildContactMessage(product)}`
    );
  };

  const handleComparePrices = () => {
    if (!product) return;
    const identifier = product.barcode || product.id;
    if (!identifier) return;
    navigate(`/comparar/${identifier}`);
  };

  const handleVisitStore = () => {
    if (!product?.comercio?.id) return;
    navigate(`/commerce/${product.comercio.id}`);
  };

  const renderStars = (count) => {
    const rating = sanitizeRating(count);
    return (
      <>
        {[...Array(5)].map((_, index) =>
          index < rating ? (
            <FaStar key={index} className="text-yellow-400" />
          ) : (
            <FaRegStar key={index} className="text-yellow-400" />
          )
        )}
      </>
    );
  };

  if (loading) {
    return (
      <div
        className={`p-6 max-w-7xl mx-auto ${
          isDarkMode ? "text-gray-200" : "text-gray-900"
        }`}
      >
        Carregando produto...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`p-6 max-w-7xl mx-auto ${
          isDarkMode ? "text-red-400" : "text-red-500"
        }`}
      >
        {error}
        <div className="mt-4">
          <BackButton variant="secondary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const priceLabel = formatPrice(
    product.price ?? product.valor ?? product.preco
  );
  const oldPriceLabel = formatPrice(product.oldPrice ?? product.precoOriginal);
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  const reviewsCount = Number(product.reviewsCount ?? reviews.length) || 0;
  const inStock = determineStock(product);
  const stockAmount = getStockAmount(product);
  const hasContact = Boolean(product?.comercio?.id);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900"
          : "bg-gradient-to-br from-green-100 via-white to-green-50"
      }`}
    >
      <div
        className={`p-6 max-w-7xl mx-auto font-sans ${
          isDarkMode ? "text-gray-100" : "text-gray-900"
        }`}
      >
        <div className="mb-6">
          <BackButton />
        </div>

        {product.comercio?.id && (
          <div
            className={`mb-4 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Loja:{" "}
            <button
              onClick={handleVisitStore}
              className={`font-semibold hover:underline focus:outline-none ${
                isDarkMode ? "text-blue-300" : "text-blue-600"
              }`}
              type="button"
            >
              {product.comercio.nome}
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex md:flex-col gap-4">
            {thumbnails.length > 0 ? (
              thumbnails.map((thumbnail, index) => (
                <button
                  key={thumbnail || index}
                  onClick={() => setMainImage(thumbnail)}
                  className={`border rounded-lg p-1 cursor-pointer hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    isDarkMode ? "border-gray-600" : "border-gray-300"
                  }`}
                  type="button"
                >
                  <img
                    src={thumbnail}
                    alt={`${
                      product.title || product.name || "Produto"
                    } imagem ${index + 1}`}
                    className="w-20 h-20 object-contain"
                    loading="lazy"
                    onError={fallbackOnError}
                  />
                </button>
              ))
            ) : (
              <div
                className={`border rounded-lg p-3 text-xs ${
                  isDarkMode
                    ? "border-gray-700 text-gray-400"
                    : "border-gray-200 text-gray-500"
                }`}
              >
                Sem imagens adicionais
              </div>
            )}
          </div>

          <div
            className={`flex-1 flex justify-center items-center rounded-xl p-6 shadow-md ${
              isDarkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <img
              src={mainImage || PLACEHOLDER_IMAGE}
              alt={product.title || product.name || product.nome || "Produto"}
              className="max-h-[400px] object-contain rounded"
              loading="lazy"
              onError={(event) => {
                fallbackOnError(event);
                setMainImage(PLACEHOLDER_IMAGE);
              }}
            />
          </div>

          <div className="md:w-[420px] space-y-6 flex flex-col">
            <h1
              className={`text-3xl font-extrabold leading-tight ${
                isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {product.title ||
                product.name ||
                product.nome ||
                "Produto sem título"}
            </h1>

            <div className="flex items-center gap-3">
              <div className="flex text-yellow-400 text-lg">
                {renderStars(
                  product.stars ||
                    product.rating ||
                    product.mediaAvaliacoes ||
                    0
                )}
              </div>
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                ({reviewsCount} avaliações)
              </span>
              <span
                className={`ml-auto font-semibold text-sm ${
                  inStock ? "text-green-600" : "text-red-600"
                }`}
              >
                {inStock ? "Em estoque" : "Indisponível"}
              </span>
              {inStock && stockAmount != null && (
                <span
                  className={`text-sm ml-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  ({stockAmount} disponíveis)
                </span>
              )}
            </div>

            {priceLabel && (
              <div className="flex items-center gap-4">
                <p
                  className={`text-3xl font-bold ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {priceLabel}
                </p>
                {oldPriceLabel && (
                  <p
                    className={`line-through text-lg ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {oldPriceLabel}
                  </p>
                )}
              </div>
            )}

            {product.description && (
              <p
                className={`text-base leading-relaxed ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {product.description}
              </p>
            )}

            <div className="flex items-center gap-4">
              <span
                className={`font-semibold select-none ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Quantidade:
              </span>
              <div
                className={`flex items-center border rounded-md overflow-hidden select-none ${
                  isDarkMode ? "border-gray-600" : "border-gray-300"
                }`}
              >
                <button
                  onClick={decrement}
                  className={`px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    isDarkMode
                      ? "bg-gray-600 hover:bg-gray-500 text-gray-100"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                  type="button"
                >
                  -
                </button>
                <span
                  className={`px-6 py-2 font-mono ${
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  {quantity}
                </span>
                <button
                  onClick={increment}
                  className={`px-4 py-2 transition focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    isDarkMode
                      ? "bg-gray-600 hover:bg-gray-500 text-gray-100"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                  type="button"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4 mt-auto">
              <button
                onClick={handleContactSeller}
                className={`flex-1 py-3 rounded-md font-semibold shadow-md transition focus:outline-none focus:ring-2 text-white ${
                  isDarkMode
                    ? "bg-blue-600 hover:bg-blue-500 focus:ring-blue-500"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-600"
                } ${hasContact ? "" : "opacity-60 cursor-not-allowed"}`}
                type="button"
                disabled={!hasContact}
              >
                📞 Entrar em contato com a loja -{" "}
                {product.comercio?.nome || "Loja"}
              </button>
              {product.barcode && (
                <button
                  onClick={handleComparePrices}
                  className={`flex-1 py-3 rounded-md font-semibold shadow-md transition focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "bg-yellow-500 hover:bg-yellow-400 text-black focus:ring-yellow-400"
                      : "bg-yellow-400 hover:bg-yellow-500 text-black focus:ring-yellow-600"
                  }`}
                  type="button"
                >
                  Comparar Preços 🛍️
                </button>
              )}
              <button
                onClick={toggleFavorite}
                aria-label={
                  favorited
                    ? "Remover dos favoritos"
                    : "Adicionar aos favoritos"
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
          </div>
        </div>

        <section className="mt-16">
          <div className="flex items-center justify-between mb-6 select-none">
            <h3
              className={`text-2xl font-semibold ${
                isDarkMode ? "text-gray-200" : "text-gray-900"
              }`}
            >
              Avaliações dos clientes
            </h3>
            <Link
              to={`/review/${product.id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Escreva uma avaliação
            </Link>
          </div>

          {reviewsCount > 0 && reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div
                  key={`${review.id || review.user || "review"}-${index}`}
                  className={`border-b pb-4 ${
                    isDarkMode ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {renderStars(review.note || review.rating || 0)}
                    <span
                      className={`ml-2 text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {review.user || review.autor || "Cliente"}
                    </span>
                  </div>
                  <p
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {review.content ||
                      review.texto ||
                      "Avaliação sem descrição."}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <p
                className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Nenhuma avaliação disponível.
              </p>
              <Link
                to={`/review/${product.id}`}
                className={`px-4 py-2 text-white rounded-lg transition ${
                  isDarkMode
                    ? "bg-blue-600 hover:bg-blue-500"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Escreva a primeira avaliação
              </Link>
            </div>
          )}
        </section>

        <section className="mt-16">
          <div className="flex items-center justify-between mb-6 select-none">
            <h3
              className={`text-2xl font-semibold ${
                isDarkMode ? "text-gray-200" : "text-gray-900"
              }`}
            >
              Produtos relacionados
            </h3>
            <Link
              to="/search"
              className={`text-sm font-semibold ${
                isDarkMode ? "text-blue-300" : "text-blue-600"
              } hover:underline`}
            >
              Ver mais produtos
            </Link>
          </div>

          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          ) : (
            <p
              className={`${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              } text-center`}
            >
              Nenhum produto relacionado encontrado.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
