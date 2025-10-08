import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ReviewForm() {
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({ mode: "onChange" });
  const [rating, setRating] = useState(0);

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
        `http://localhost:4000/api/avaliacoes/${productId}`,
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
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
      toast.error("Erro ao enviar avaliação.");
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-green-100 via-white to-green-50 text-gray-800 dark:text-gray-100">
      <div className="container mx-auto px-4 max-w-lg">
        <motion.form
          onSubmit={handleSubmit(submit)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl space-y-6"
        >
          <h2 className="text-2xl font-bold">Deixe sua avaliação</h2>

          {/* Rating Stars */}
          <div>
            <label className="font-medium block mb-2">Nota*</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setRating(val)}
                  className="text-3xl mx-1 focus:outline-none"
                  aria-label={`Avaliar com ${val} estrelas`}
                >
                  <span
                    className={
                      rating >= val ? "text-yellow-400" : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
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
            disabled={!isValid || rating === 0 || isSubmitting}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              isValid && rating > 0
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
          </button>
        </motion.form>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
