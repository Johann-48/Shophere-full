import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { LuArrowLeft } from "react-icons/lu";
import { useTheme } from "../../contexts/ThemeContext";
import API_CONFIG from "../../config/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { isDarkMode, dark, light } = useTheme();
  const currentTheme = isDarkMode ? dark : light;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Link inválido. Solicite uma nova recuperação de senha.");
    }
  }, [token]);

  const validate = () => {
    if (!token) return false;
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await fetch(API_CONFIG.getApiUrl("/api/auth/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, novaSenha: password })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || "Não foi possível redefinir a senha.");
      }

      setSuccess(data?.message || "Senha redefinida com sucesso!");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.message);
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
          Redefinir Senha
        </h2>
        <p className={`${currentTheme.text} text-sm text-center mb-6`}>
          Defina sua nova senha para voltar a acessar sua conta.
        </p>

        {!token && (
          <div className="text-center mb-6">
            <p className={`${isDarkMode ? "text-red-300" : "text-red-600"} flex items-center justify-center gap-2`}>
              <FaTimesCircle /> {error}
            </p>
            <button
              onClick={() => navigate("/forgotpassword")}
              className={`mt-4 inline-flex items-center gap-2 font-medium ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-700 hover:text-blue-800"}`}
            >
              <LuArrowLeft /> Voltar para recuperar senha
            </button>
          </div>
        )}

        {token && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <FaLock className={`absolute left-3 top-3.5 ${isDarkMode ? "text-blue-400" : "text-blue-700"}`} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Nova senha"
                className={`w-full pl-10 border px-4 py-2 rounded-lg focus:outline-none transition focus:ring-2 ${
                  isDarkMode
                    ? "border-slate-700 focus:ring-blue-500 bg-slate-800 text-white placeholder-slate-400"
                    : "border-blue-200 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>

            <div className="relative">
              <FaLock className={`absolute left-3 top-3.5 ${isDarkMode ? "text-blue-400" : "text-blue-700"}`} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirmar nova senha"
                className={`w-full pl-10 border px-4 py-2 rounded-lg focus:outline-none transition focus:ring-2 ${
                  isDarkMode
                    ? "border-slate-700 focus:ring-blue-500 bg-slate-800 text-white placeholder-slate-400"
                    : "border-blue-200 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>

            {error && (
              <p className={`${isDarkMode ? "text-red-300" : "text-red-600"} text-sm`}>{error}</p>
            )}

            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              type="submit"
              disabled={loading}
              className={`w-full text-white py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isDarkMode ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Salvando..." : "Salvar nova senha"}
            </motion.button>
          </form>
        )}

        {success && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center ${currentTheme.text} mt-4 text-sm font-medium flex items-center justify-center gap-2`}
          >
            <FaCheckCircle /> {success}
          </motion.p>
        )}

        <div className="text-center mt-6">
          <motion.button
            whileHover={{ scale: 1.05, x: -3 }}
            onClick={() => navigate("/login")}
            className={`inline-flex items-center gap-2 transition font-medium ${
              isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-700 hover:text-blue-800"
            }`}
          >
            <LuArrowLeft className="text-lg" />
            Voltar para o login
          </motion.button>
        </div>
      </motion.div>
    </main>
  );
}
