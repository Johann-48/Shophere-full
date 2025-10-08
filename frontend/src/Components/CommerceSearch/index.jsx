import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import CommerceCard from "../CommerceCard";

export default function CommerceSearch() {
  const [query, setQuery] = useState("");
  const [commerces, setCommerces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommerces = async () => {
      // Se query estiver vazia, limpa estados e não busca
      if (!query.trim()) {
        setCommerces([]);
        setError(null);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("/api/commerces/search", {
          params: { q: query },
        });
        const data = res.data.commerces || res.data;
        setCommerces(data);
      } catch (err) {
        console.error("Erro ao buscar comércios:", err);
        setError("Não foi possível carregar comércios");
      } finally {
        setLoading(false);
      }
    };

    fetchCommerces();
  }, [query]);

  return (
    <div className="px-4 py-10 max-w-7xl mx-auto">
      {/* Título e busca */}
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-blue-600 drop-shadow-sm"
        >
          🏬 Encontre Comércios
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-500 text-md md:text-lg mt-2"
        >
          Busque por nome ou aproveite nossas opções!
        </motion.p>
      </div>

      {/* Input de busca */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full md:w-1/2">
          <FiSearch className="absolute top-3 left-3 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Buscar comércio..."
            className="w-full pl-10 pr-4 py-2 border rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Se não houver query, não mostra nada */}
      {!query.trim() && <></>}

      {/* Loading e erro quando existir query */}
      {query.trim() && loading && (
        <div className="text-center text-gray-500">Carregando...</div>
      )}
      {query.trim() && error && (
        <div className="text-center text-red-500">{error}</div>
      )}

      {/* Resultados */}
      {query.trim() && !loading && !error && (
        <>
          {commerces.length > 0 ? (
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {commerces.map((com) => (
                <CommerceCard key={com.id} commerce={com} />
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center text-gray-500 text-lg mt-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Nenhum comércio encontrado 😕
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
