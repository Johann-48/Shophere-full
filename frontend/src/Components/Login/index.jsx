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
    <main className={`flex-1 ${currentTheme.background} py-16 px-6 min-h-screen`}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Imagem lateral */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:block"
        >
          <img
            src="https://sdmntprcentralus.oaiusercontent.com/files/00000000-06fc-61f5-9330-588a0ff01748/raw?se=2025-10-13T19%3A07%3A08Z&sp=r&sv=2024-08-04&sr=b&scid=597a97f8-e483-5d43-9505-0e397aa7d704&skoid=a6356955-0ca0-4033-9150-c0c162458498&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-10-13T14%3A04%3A30Z&ske=2025-10-14T14%3A04%3A30Z&sks=b&skv=2024-08-04&sig=Ok%2BjnUYIIU%2BNr3mGPOx4hi8fyP9Zg/GlKGcafU4dem8%3D"
            alt="Login Visual"
            className="w-full rounded-3xl shadow-lg object-cover"
            style={{ borderRadius: "1.5rem", maxHeight: 520 }}
          />
        </motion.div>

        {/* Formulário */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className={`${currentTheme.card} p-12 rounded-3xl shadow-lg transition-all`}
        >
          <h2 className={`text-4xl font-bold ${currentTheme.textPrimary} mb-6 text-center`}>
            Bem-vindo de volta!
          </h2>
          <p className={`${currentTheme.text} text-center mb-8`}>
            Insira seus dados para acessar sua conta
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className={`block ${currentTheme.text} mb-1 font-semibold`}
              >
                Email ou Celular
              </label>
              <div className="relative">
                <FaEnvelope className={`absolute left-3 top-3.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} />
                <input
                  id="email"
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  required
                  placeholder="seuemail@exemplo.com"
                  className={`w-full pl-10 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-slate-800 text-white placeholder-slate-400 border-slate-700' : 'bg-white text-gray-900 placeholder-gray-500 border-blue-200'}`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block ${currentTheme.text} mb-1 font-semibold`}
              >
                Senha
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="********"
                  className={`w-full pl-10 pr-10 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-slate-800 text-white placeholder-slate-400 border-slate-700' : 'bg-white text-gray-900 placeholder-gray-500 border-blue-200'}`}
                />
                <button
                  type="button"
                  className={`absolute right-3 top-3.5 ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <span
                onClick={() => navigate("/forgotpassword")}
                className={`text-sm ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} hover:underline float-right mt-1 cursor-pointer`}
              >
                Esqueceu sua senha?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3 rounded-lg transition text-lg font-semibold ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'} ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

            {msg && (
              <p className={`text-center mt-4 font-medium animate-pulse ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
              {msg}
            </p>
          )}

          {/* Opções de login social removidas */}

          {/* Links para cadastro */}
          <p className={`text-center ${currentTheme.text} mt-6 font-medium`}>
            Não possui uma conta?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-600 hover:underline hover:text-blue-700 font-semibold cursor-pointer"
            >
              Cadastre-se
            </span>
          </p>

          <p className={`text-center ${currentTheme.text} mt-2 font-medium`}>
            É vendedor?{" "}
            <span
              onClick={() => navigate("/seller")}
              className="text-red-600 hover:underline hover:text-red-700 font-semibold cursor-pointer"
            >
              Criar conta
            </span>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
