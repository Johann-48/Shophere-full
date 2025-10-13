import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_CONFIG from "../../config/api";
import { FiStar, FiFilter } from "react-icons/fi";
import { useTheme } from "../../contexts/ThemeContext";

export default function ReviewForm() {
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const { isDarkMode, dark, light } = useTheme();
  const currentTheme = isDarkMode ? dark : light;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({ mode: "onChange" });
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(true);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [sortBy, setSortBy] = useState("new");
  const [minStars, setMinStars] = useState(0);

  // Pre-check: user already reviewed this product?
  useEffect(() => {
    async function checkUserAlreadyReviewed() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.id) {
          setLoadingCheck(false);
          return;
        }
        const res = await axios.get(
          API_CONFIG.getApiUrl(`/api/avaliacoes/${productId}`)
        );
        const revs = res.data?.reviews || [];
        setReviews(revs);
        const found = revs.some((r) => r.usuario_id === user.id);
        setAlreadyReviewed(found);
      } catch (e) {
        // swallow; allow submission to proceed, backend will enforce
      } finally {
        setLoadingCheck(false);
      }
    }
    async function fetchProduct() {
      try {
        const res = await axios.get(API_CONFIG.getApiUrl(`/api/products/${productId}`));
        setProduct(res.data?.product || res.data);
      } catch {}
    }
    if (productId) {
      checkUserAlreadyReviewed();
      fetchProduct();
    }
  }, [productId]);

  const submit = async (data) => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        nota: rating,
        conteudo: data.detail,
      };

      console.log("Payload que será enviado:", {
        nota: rating,
        conteudo: data.detail,
      });

      const response = await axios.post(
        API_CONFIG.getApiUrl(`/api/avaliacoes/${productId}`),
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // <- importante
          },
        }
      );

      console.log("Resposta:", response.data);

      toast.success("Avaliação enviada!", { autoClose: 3000 });
      // refresh list
      try {
        const res = await axios.get(API_CONFIG.getApiUrl(`/api/avaliacoes/${productId}`));
        setReviews(res.data?.reviews || []);
      } catch {}
      // Opcional: voltar para a página do produto
      setTimeout(() => navigate(`/produto/${productId}`), 500);
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err?.response || err);
      const backendMsg =
        err?.response?.data?.error || err?.response?.data?.message;
      if (err?.response?.status === 400 && backendMsg) {
        toast.error(backendMsg);
      } else if (err?.response?.status === 401) {
        toast.error("Sessão expirada. Faça login novamente.");
        navigate("/login");
      } else {
        toast.error("Erro ao enviar avaliação.");
      }
    }
  };

  const filteredReviews = useMemo(() => {
    let out = [...reviews];
    if (minStars > 0) out = out.filter((r) => (r.nota || 0) >= minStars);
    if (sortBy === "new") out.sort((a, b) => (b.id || 0) - (a.id || 0));
    if (sortBy === "best") out.sort((a, b) => (b.nota || 0) - (a.nota || 0));
    if (sortBy === "worst") out.sort((a, b) => (a.nota || 0) - (b.nota || 0));
    return out;
  }, [reviews, minStars, sortBy]);

  return (
    <div className={`min-h-screen py-8 ${currentTheme.background} ${currentTheme.text}`}>
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Product header */}
        {product && (
          <div className={`${currentTheme.card} rounded-2xl p-5 mb-6 border`}> 
            <div className="flex items-center gap-4">
              {product.imagem && (
                <img src={product.imagem} alt={product.nome} className="w-16 h-16 rounded-lg object-cover" />
              )}
              <div>
                <h1 className="text-xl font-bold">{product.nome}</h1>
                {typeof product.avgRating !== 'undefined' && (
                  <div className="text-sm opacity-80">Média: {product.avgRating?.toFixed?.(1) ?? product.avgRating}/5</div>
                )}
              </div>
            </div>
          </div>
        )}
        <motion.form
          onSubmit={handleSubmit(submit)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-2xl shadow-xl space-y-6 ${currentTheme.card}`}
        >
          <h2 className="text-2xl font-bold">Deixe sua avaliação</h2>

          {loadingCheck ? (
            <p className="text-sm text-gray-500">Carregando…</p>
          ) : alreadyReviewed ? (
            <div className="p-3 rounded bg-yellow-100 text-yellow-800 border border-yellow-300">
              Você já avaliou este produto. No momento não é possível enviar
              outra avaliação.
            </div>
          ) : null}

          {/* Rating Stars */}
          <div>
            <label className="font-medium block mb-2">Nota*</label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setRating(val)}
                  onMouseEnter={() => setHoverRating(val)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-3xl mx-1 focus:outline-none"
                  aria-label={`Avaliar com ${val} estrelas`}
                >
                  <span className={`${(hoverRating || rating) >= val ? 'text-yellow-400' : 'text-gray-400'} drop-shadow`}>★</span>
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-3 text-sm opacity-80">{rating} de 5</span>
              )}
            </div>
            {rating === 0 && (
              <p className="text-red-500 text-sm mt-1">Selecione uma nota*</p>
            )}
          </div>

          {/* Detalhamento */}
          <div>
            <label className="font-medium block mb-2">Detalhamento*</label>
            <textarea
              {...register("detail", {
                required: "Este campo é obrigatório",
                minLength: { value: 10, message: "Mínimo 10 caracteres" },
              })}
              placeholder="Conte em detalhes sua experiência..."
              className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 transition-colors resize-none"
              rows={5}
            />
            {errors.detail && (
              <p className="text-red-500 text-sm mt-1">
                {errors.detail.message}
              </p>
            )}
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            disabled={
              !isValid ||
              rating === 0 ||
              isSubmitting ||
              alreadyReviewed ||
              loadingCheck
            }
            className={`w-full py-3 rounded-lg font-semibold transition ${
              isValid && rating > 0 && !alreadyReviewed && !loadingCheck
                ? `${currentTheme.button} text-white`
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
          </button>
        </motion.form>

        {/* Reviews list */}
        <div className={`mt-8 ${currentTheme.card} rounded-2xl p-6 border`}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-xl font-semibold">Avaliações</h3>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-2 rounded-lg border ${currentTheme.text} ${currentTheme.card}`}
              >
                <option value="new">Mais recentes</option>
                <option value="best">Melhores</option>
                <option value="worst">Piores</option>
              </select>
              <select
                value={minStars}
                onChange={(e) => setMinStars(Number(e.target.value))}
                className={`px-3 py-2 rounded-lg border ${currentTheme.text} ${currentTheme.card}`}
              >
                <option value={0}>Todas notas</option>
                <option value={5}>5 estrelas</option>
                <option value={4}>4+ estrelas</option>
                <option value={3}>3+ estrelas</option>
              </select>
            </div>
          </div>

          {filteredReviews.length === 0 ? (
            <p className="opacity-70">Sem avaliações ainda.</p>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((r) => (
                <div key={r.id} className={`p-4 rounded-xl border ${currentTheme.card}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold">{r.usuario || 'Usuário'}</div>
                    <div className="text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i < (r.nota || 0) ? '★' : '☆'}</span>
                      ))}
                    </div>
                  </div>
                  <p className="opacity-90 leading-relaxed whitespace-pre-line">{r.conteudo}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
