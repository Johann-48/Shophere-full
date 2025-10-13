import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { useTheme } from "../../contexts/ThemeContext";
import API_CONFIG from "../../config/api";

export default function Signup({ goBackToLogin }) {
  const navigate = useNavigate();
  const { isDarkMode, dark, light } = useTheme();
  const currentTheme = isDarkMode ? dark : light;
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica dos campos
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
      !form.telefone
    ) {
      alert(
        "Por favor, preencha todos os campos obrigatórios (nome, email, telefone e senha)."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    // Validação do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Por favor, insira um email válido.");
      return;
    }

    // Validação do telefone (aceita formatos: (99)99999-9999 ou 99999999999)
    const telefoneRegex = /^(?:\([0-9]{2}\)|[0-9]{2})?[0-9]{9}$/;
    const telefoneNumerico = form.telefone.replace(/\D/g, "");
    if (!telefoneRegex.test(telefoneNumerico)) {
      alert("Por favor, insira um número de telefone válido com DDD.");
      return;
    }

    try {
      const response = await axios.post(
        API_CONFIG.getApiUrl("/api/auth/signup"),
        {
          nome: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          senha: form.password,
          telefone: telefoneNumerico,
        }
      );

      alert("Conta criada com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error("Erro no cadastro:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else if (error.code === "ERR_NETWORK") {
        alert(
          "Erro de conexão com o servidor. Verifique se o servidor está rodando."
        );
      } else {
        alert("Erro ao tentar criar conta. Por favor, tente novamente.");
      }
    }
  };

  const accentText = isDarkMode ? 'text-blue-400' : 'text-blue-700';

  return (
    <main
      className={`flex items-center justify-center min-h-screen ${currentTheme.background} px-4 py-12`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-lg ${currentTheme.card} p-10 rounded-3xl shadow-xl`}
      >
        <h2 className={`text-4xl font-bold ${currentTheme.textPrimary} mb-3 text-center`}>
          Criar Conta
        </h2>
        <p className={`${currentTheme.text} mb-8 text-center`}>
          Preencha os campos abaixo para se cadastrar
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className={`block text-sm font-medium ${currentTheme.text} mb-1`}
            >
              Nome
            </label>
            <div className="relative">
              <FaUser className={`absolute left-3 top-3.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
              <input
                id="name"
                type="text"
                placeholder="Digite seu nome"
                value={form.name}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-slate-800 text-white placeholder-slate-400 border-slate-700' : 'bg-white text-gray-900 placeholder-gray-500 border-blue-200'}`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium ${currentTheme.text} mb-1`}
            >
              Email
            </label>
            <div className="relative">
              <FaEnvelope className={`absolute left-3 top-3.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
              <input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={form.email}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-slate-800 text-white placeholder-slate-400 border-slate-700' : 'bg-white text-gray-900 placeholder-gray-500 border-blue-200'}`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className={`block text-sm font-medium ${currentTheme.text} mb-1`}
            >
              Criar Senha
            </label>
            <div className="relative">
              <FaLock className={`absolute left-3 top-3.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
              <input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={form.password}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-slate-800 text-white placeholder-slate-400 border-slate-700' : 'bg-white text-gray-900 placeholder-gray-500 border-blue-200'}`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className={`block text-sm font-medium ${currentTheme.text} mb-1`}
            >
              Confirmar Senha
            </label>
            <div className="relative">
              <FaLock className={`absolute left-3 top-3.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-slate-800 text-white placeholder-slate-400 border-slate-700' : 'bg-white text-gray-900 placeholder-gray-500 border-blue-200'}`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="telefone"
              className={`block text-sm font-medium ${currentTheme.text} mb-1`}
            >
              Telefone
            </label>
            <div className="relative">
              <span className={`absolute left-3 top-3.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>📞</span>
              <input
                id="telefone"
                type="tel"
                placeholder="(99)999999999"
                value={form.telefone}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-slate-800 text-white placeholder-slate-400 border-slate-700' : 'bg-white text-gray-900 placeholder-gray-500 border-blue-200'}`}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full text-white py-3 rounded-lg font-semibold text-lg transition ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            Criar Conta
          </button>
        </form>

        <p className={`text-center ${currentTheme.text} mt-6`}>
          Já possui uma conta?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:text-blue-700 hover:underline font-semibold cursor-pointer"
          >
            Fazer Login
          </span>
        </p>
      </motion.div>
    </main>
  );
}
