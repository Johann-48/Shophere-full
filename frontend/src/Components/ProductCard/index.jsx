// src/components/ProductCard.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHeart, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

export default function ProductCard({ product, isLiked, onToggleLike }) {
  const { isDarkMode, dark, light } = useTheme();
  const currentTheme = isDarkMode ? dark : light;
  
  console.log("💡 ProductCard.product:", product);
  const navigate = useNavigate();
  // Extrai priceNum, oldPriceNum e trend igual ao Home
  let priceNum = null;
  let oldPriceNum = null;
  let priceTrend = null;
  if (typeof product.price === "number") {
    priceNum = product.price;
  } else if (typeof product.price === "string") {
    const parsed = parseFloat(
      product.price.replace(/[R$\s]/g, "").replace(",", ".")
    );
    if (!isNaN(parsed)) priceNum = parsed;
  }
  if (product.oldPrice != null) {
    if (typeof product.oldPrice === "number") oldPriceNum = product.oldPrice;
    else {
      const parsedOld = parseFloat(
        product.oldPrice.replace(/[R$\s]/g, "").replace(",", ".")
      );
      if (!isNaN(parsedOld)) oldPriceNum = parsedOld;
    }
  }
  if (priceNum != null && oldPriceNum != null) {
    priceTrend = priceNum > oldPriceNum ? "up" : "down";
  }
  console.log("DEBUG ProductCard → produto:", product);

  // guarda o id da loja apenas se o backend tiver enviado
  const lojaId = product.comercio?.id;

  const presetMsg = encodeURIComponent(
    `Olá, tenho interesse no produto "${
      product.title || product.name
    }". Você pode me informar disponibilidade e prazo de entrega(se disponível)?`
  );

  console.log(
    "DEBUG ProductCard → commerceId:",
    product.commerceId,
    " ou lojaId:",
    product.lojaId
  );

  // log seguro, apenas para depuração:

  return (
    <motion.div
      onClick={() => navigate(`/produto/${product.id}`)}
      whileHover={{ scale: 1.02 }}
      className={`${currentTheme.card} rounded-2xl p-4 relative flex flex-col hover:ring-2 hover:ring-blue-400 transition-all duration-200 cursor-pointer card-hover h-80 w-full`}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex-shrink-0 mb-3">
        <img
          src={
            // 1) campo principal que sua API realmente retorna
            product.mainImage ||
            // 2) se houver array de miniaturas, usa a primeira
            (Array.isArray(product.thumbnails) && product.thumbnails[0]) ||
            // 3) se mesmo assim nada existir, placeholder
            "/assets/placeholder.png"
          }
          alt={product.title || product.name}
          className="w-full h-32 object-contain"
        />
      </div>
      <div className="flex-grow flex flex-col">
        <h3 className={`text-lg font-semibold mb-2 ${currentTheme.textPrimary} line-clamp-2`}>
          {product.title || product.name}
        </h3>

        {product.comercio && (
          <p className={`text-xs ${currentTheme.textSecondary} mb-2`}>
            Loja: <span className="font-medium">{product.comercio.nome}</span>
          </p>
        )}

        {product.description && (
          <p className={`text-sm ${currentTheme.textSecondary} mb-3 line-clamp-2 flex-grow`}>{product.description}</p>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        {priceNum != null && (
          <span className="text-blue-500 font-bold">
            R$ {priceNum.toFixed(2)}
          </span>
        )}
        {oldPriceNum != null && (
          <span className={`text-xs line-through ${currentTheme.textSecondary}`}>
            R$ {oldPriceNum.toFixed(2)}
          </span>
        )}
        {priceTrend === "up" && <FiTrendingUp className="text-blue-400" />}
        {priceTrend === "down" && <FiTrendingDown className="text-blue-600" />}
      </div>

      <div className="mt-auto flex justify-between items-center">
        {/* Link direto para /contact, passando loja e mensagem */}
        {/* só renderiza o link se tivermos um lojaId válido */}
        {lojaId ? (
          <Link
            to={`/contact?lojaId=${lojaId}&message=${presetMsg}`}
            onClick={(e) => e.stopPropagation()}
            className={`${currentTheme.button} text-white px-4 py-1 rounded-lg transition-all duration-200 text-sm btn-primary focus-ring`}
          >
            Conversar com Vendedor
          </Link>
        ) : (
          <span className={`${currentTheme.textSecondary} text-sm`}>Loja indisponível</span>
        )}
      </div>
    </motion.div>
  );
}
