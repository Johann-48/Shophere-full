import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { useTheme } from "../../contexts/ThemeContext";

export default function Signup({ goBackToLogin }) {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
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
        "http://localhost:4000/api/auth/signup",
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

  const backgroundGradient = isDarkMode 
    ? 'bg-gradient-to-br from-gray-800 via-blue-50 to-gray-100'
    : 'bg-gradient-to-br from-green-100 via-white to-green-50';

  return (
    <main className={`flex items-center justify-center min-h-screen ${backgroundGradient} px-4 py-12`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white p-10 rounded-3xl shadow-xl border border-[#90CAF9]"
      >
        <h2 className="text-4xl font-bold text-[#1565C0] mb-3 text-center">
          Criar Conta
        </h2>
        <p className="text-gray-700 mb-8 text-center">
          Preencha os campos abaixo para se cadastrar
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3.5 text-gray-500" />
              <input
                id="name"
                type="text"
                placeholder="Digite seu nome"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3.5 text-gray-500" />
              <input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Criar Senha
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3.5 text-gray-500" />
              <input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirmar Senha
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3.5 text-gray-500" />
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="telefone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Telefone
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-gray-500">📞</span>
              <input
                id="telefone"
                type="tel"
                placeholder="(99)999999999"
                value={form.telefone}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1565C0] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#0D47A1] transition"
          >
            Criar Conta
          </button>
        </form>

        <div className="my-6">
          <div className="flex items-center">
            <hr className="flex-grow border-[#90CAF9]" />
            <span className="mx-4 text-gray-600">ou</span>
            <hr className="flex-grow border-[#90CAF9]" />
          </div>

          <div className="mt-6 space-y-3">
            <button className="w-full flex items-center justify-center border border-[#64B5F6] py-2 rounded-lg bg-white text-[#1976D2] hover:bg-[#E3F2FD] transition font-semibold">
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Cadastrar com o Google
            </button>
            <button className="w-full flex items-center justify-center border border-[#64B5F6] py-2 rounded-lg bg-white text-[#1976D2] hover:bg-[#E3F2FD] transition font-semibold">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                alt="Apple"
                className="w-5 h-5 mr-2"
              />
              Cadastrar com Apple
            </button>
          </div>
        </div>

        <p className="text-center text-gray-700 mt-6">
          Já possui uma conta?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#1565C0] hover:underline font-semibold cursor-pointer"
          >
            Fazer Login
          </span>
        </p>
      </motion.div>
    </main>
  );
}
