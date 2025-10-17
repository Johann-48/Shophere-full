import React, { useState } from "react";
import { FaEnvelope, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import API_CONFIG from "../../config/api";

export default function ForgotPassword({ goBackToLogin }) {
  const navigate = useNavigate();
  const { isDarkMode, dark, light } = useTheme();
  const currentTheme = isDarkMode ? dark : light;
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setIsValid(false);
      return;
    }

    setIsValid(true);
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(API_CONFIG.getApiUrl("/api/auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json().catch(() => ({}));
      // Sempre mostra mensagem de sucesso por segurança
      setMsg(
        data?.message ||
          "✅ Se este email estiver cadastrado, você receberá o link em breve."
      );
      setEmail("");
    } catch (err) {
      // Mesmo em erro, não exponha existência do email
      setMsg(
        "✅ Se este email estiver cadastrado, você receberá o link em breve."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`flex items-center justify-center min-h-screen ${currentTheme.background} px-4 py-12 transition-colors`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`${currentTheme.card} shadow-2xl p-10 rounded-3xl max-w-md w-full`}
      >
        <h2 className={`text-3xl font-extrabold text-center ${currentTheme.textPrimary} mb-4`}>
          Recuperar Senha
        </h2>
        <p className={`${currentTheme.text} text-sm text-center mb-6`}>
          Digite seu e-mail para receber um link de redefinição de senha.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FaEnvelope className={`absolute left-3 top-3.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`} />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (msg) setMsg("");
                if (!isValid) setIsValid(true);
              }}
              required
              placeholder="seuemail@exemplo.com"
              className={`w-full pl-10 border px-4 py-2 rounded-lg focus:outline-none transition focus:ring-2 ${
                isValid
                  ? `${isDarkMode ? 'border-slate-700 focus:ring-blue-500 bg-slate-800 text-white placeholder-slate-400' : 'border-blue-200 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500'}`
                  : `${isDarkMode ? 'border-red-700 bg-slate-800 text-white placeholder-slate-400 focus:ring-red-500' : 'border-red-400 bg-white text-gray-900 placeholder-gray-500 focus:ring-red-300'}`
              }`}
            />
            {!isValid && (
              <p className={`${isDarkMode ? 'text-red-300' : 'text-red-500'} text-xs mt-1 ml-1`}>Email inválido.</p>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <motion.div
                  className="w-4 h-4 rounded-full bg-white"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                />
                <span>Enviando...</span>
              </div>
            ) : (
              "Enviar link de recuperação"
            )}
          </motion.button>
        </form>

        {msg && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center ${currentTheme.text} mt-4 text-sm font-medium flex items-center justify-center gap-2`}
          >
            <FaCheckCircle /> {msg}
          </motion.p>
        )}

        <div className="text-center mt-6">
          <motion.button
            whileHover={{ scale: 1.05, x: -3 }}
            onClick={() => navigate("/login")}
            className={`inline-flex items-center gap-2 transition font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-800'}`}
          >
            <LuArrowLeft className="text-lg" />
            Voltar para o login
          </motion.button>
        </div>
      </motion.div>
    </main>
  );
}
