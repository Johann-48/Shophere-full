import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext"; // ou caminho correto
import { useTheme } from "../../contexts/ThemeContext";
import API_CONFIG from "../../config/api";

export default function Login({ goToForgotPassword, goToSignUp, goToSeller }) {
  const navigate = useNavigate();
  const { isDarkMode, dark, light } = useTheme();
  const currentTheme = isDarkMode ? dark : light;
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const response = await axios.post(
        API_CONFIG.getApiUrl("/api/auth/login"),
        {
          email: emailOrPhone,
          senha: password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, user } = response.data;

      login(token, user.role);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user.id);

      navigate("/");
    } catch (err) {
      setMsg(
        err.response?.status === 401
          ? "Credenciais inválidas."
          : "Erro ao conectar ao servidor."
      );
    } finally {
      setLoading(false);
    }
  };

  // Social logins removidos a pedido (Google / Apple)

  return (
    <main className={`flex-1 ${currentTheme.background} py-8 px-4 min-h-screen flex items-center justify-center`}>
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Imagem lateral - Melhorada */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex items-center justify-center"
        >
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
            <img
              src="/assets/login-banner.png"
              alt="Login Visual"
              className="relative w-full h-auto max-h-[400px] rounded-3xl shadow-2xl object-cover transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </motion.div>

        {/* Formulário - Melhorado e mais largo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-xl mx-auto"
        >
          <div className={`${currentTheme.card} p-10 md:p-12 rounded-3xl shadow-2xl transition-all border ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`}>
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className={`text-3xl md:text-4xl font-bold ${currentTheme.textPrimary} mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                Bem-vindo de volta! 👋
              </h2>
              <p className={`${currentTheme.text} text-sm md:text-base`}>
                Faça login para continuar sua jornada
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className={`block ${currentTheme.text} mb-2 font-semibold text-sm`}
                >
                  Email ou Celular
                </label>
                <div className="relative">
                  <FaEnvelope className={`absolute left-4 top-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} />
                  <input
                    id="email"
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    required
                    placeholder="seuemail@exemplo.com"
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-slate-800 text-white placeholder-slate-400 border-slate-700 hover:border-slate-600' : 'bg-white text-gray-900 placeholder-gray-400 border-gray-200 hover:border-gray-300'}`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className={`block ${currentTheme.text} mb-2 font-semibold text-sm`}
                >
                  Senha
                </label>
                <div className="relative">
                  <FaLock className={`absolute left-4 top-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-slate-800 text-white placeholder-slate-400 border-slate-700 hover:border-slate-600' : 'bg-white text-gray-900 placeholder-gray-400 border-gray-200 hover:border-gray-300'}`}
                  />
                  <button
                    type="button"
                    className={`absolute right-4 top-4 ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition`}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>

                <div className="flex justify-end mt-2">
                  <span
                    onClick={() => navigate("/forgotpassword")}
                    className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} hover:underline cursor-pointer font-medium transition`}
                  >
                    Esqueceu sua senha?
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl transition-all text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:from-blue-700 hover:to-purple-700"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Entrando...
                  </span>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>

            {msg && (
              <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-lg animate-fadeIn">
                <p className="text-sm font-medium">{msg}</p>
              </div>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className={`absolute inset-0 flex items-center`}>
                <div className={`w-full border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-4 ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-gray-500'}`}>
                  Não tem uma conta?
                </span>
              </div>
            </div>

            {/* Links para cadastro */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/signup")}
                className={`w-full py-3 rounded-xl font-semibold transition-all border-2 ${isDarkMode ? 'border-slate-600 text-slate-200 hover:bg-slate-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Criar conta como Cliente
              </button>
              <button
                onClick={() => navigate("/seller")}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Sou Vendedor 🏪
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
