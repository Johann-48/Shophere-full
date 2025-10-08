import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext"; // ou caminho correto
import { useTheme } from "../../contexts/ThemeContext";

export default function Login({ goToForgotPassword, goToSignUp, goToSeller }) {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
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
        "http://localhost:4000/api/auth/login",
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

  const handleGoogleLogin = () => {
    // Para teste, vou abrir a página de login do Google
    // Em produção, você precisa configurar OAuth no Google Cloud Console
    window.open('https://accounts.google.com/signin', '_blank', 'width=500,height=600');
    
    // Simula o retorno do OAuth (para teste)
    setTimeout(() => {
      const simulateLogin = confirm('Simular login com Google bem-sucedido?');
      if (simulateLogin) {
        // Simula dados do usuário Google
        const googleUser = {
          id: 'google_' + Date.now(),
          nome: 'Usuário Google',
          email: 'usuario@gmail.com',
          role: 'user'
        };
        
        // Simula token
        const token = 'google_token_' + Date.now();
        
        // Salva no localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", googleUser.role);
        localStorage.setItem("user", JSON.stringify(googleUser));
        localStorage.setItem("userId", googleUser.id);
        
        // Atualiza o contexto de autenticação
        login(token, googleUser.role);
        
        // Dispara evento para atualizar o header
        window.dispatchEvent(new Event('localStorageUpdate'));
        
        // Redireciona para home
        navigate("/");
      }
    }, 2000);
  };

  const handleAppleLogin = () => {
    // Para teste, vou abrir a página de login da Apple
    // Em produção, você precisa configurar OAuth no Apple Developer
    window.open('https://appleid.apple.com/sign-in', '_blank', 'width=500,height=600');
    
    // Simula o retorno do OAuth (para teste)
    setTimeout(() => {
      const simulateLogin = confirm('Simular login com Apple bem-sucedido?');
      if (simulateLogin) {
        // Simula dados do usuário Apple
        const appleUser = {
          id: 'apple_' + Date.now(),
          nome: 'Usuário Apple',
          email: 'usuario@icloud.com',
          role: 'user'
        };
        
        // Simula token
        const token = 'apple_token_' + Date.now();
        
        // Salva no localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", appleUser.role);
        localStorage.setItem("user", JSON.stringify(appleUser));
        localStorage.setItem("userId", appleUser.id);
        
        // Atualiza o contexto de autenticação
        login(token, appleUser.role);
        
        // Dispara evento para atualizar o header
        window.dispatchEvent(new Event('localStorageUpdate'));
        
        // Redireciona para home
        navigate("/");
      }
    }, 2000);
  };

  const backgroundGradient = isDarkMode 
    ? 'bg-gradient-to-br from-gray-800 via-blue-50 to-gray-100'
    : 'bg-gradient-to-br from-green-100 via-white to-green-50';

  return (
    <main className={`flex-1 ${backgroundGradient} py-16 px-6 min-h-screen`}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Imagem lateral */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:block"
        >
          <img
            src="https://sdmntprwestus2.oaiusercontent.com/files/00000000-af5c-61f8-bb80-12e433b100c0/raw?se=2025-09-21T19%3A16%3A49Z&sp=r&sv=2024-08-04&sr=b&scid=666a61b7-dd5c-5597-902c-0fb7f9a98b30&skoid=60f2aa1f-3685-43ee-be37-d8c8d08d5a64&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-09-20T20%3A07%3A50Z&ske=2025-09-21T20%3A07%3A50Z&sks=b&skv=2024-08-04&sig=0w6ozFP7uG3svJf1MSXLbuKw92k%2B4Hdk8cNzLynOpbA%3D"
            alt="Login Visual"
            className="w-full rounded-3xl shadow-lg"
            style={{ borderRadius: "1.5rem" }}
          />
        </motion.div>

        {/* Formulário */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white p-12 rounded-3xl shadow-lg border border-[#90CAF9] transition-all"
        >
          <h2 className="text-4xl font-bold text-black mb-6 text-center">
            Bem-vindo de volta!
          </h2>
          <p className="text-black text-center mb-8">
            Insira seus dados para acessar sua conta
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-black mb-1 font-semibold"
              >
                Email ou Celular
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  id="email"
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  required
                  placeholder="seuemail@exemplo.com"
                  className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-2 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-black mb-1 font-semibold"
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
                  className="w-full pl-10 pr-10 border border-gray-300 rounded-lg px-4 py-2 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1565C0]"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-400"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <span
                onClick={() => navigate("/forgotPassword")}
                className="text-sm text-gray-600 hover:underline float-right mt-1 cursor-pointer"
              >
                Esqueceu sua senha?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-black text-white py-3 rounded-lg transition text-lg font-semibold ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
              }`}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {msg && (
            <p className="text-red-600 text-center mt-4 font-medium animate-pulse">
              {msg}
            </p>
          )}

          {/* Login Social */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-t border-[#90CAF9]" />
            <span className="mx-3 text-black font-medium">ou</span>
            <hr className="flex-grow border-t border-[#90CAF9]" />
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center border border-[#64B5F6] py-2 rounded-lg bg-white text-[#1976D2] hover:bg-[#E3F2FD] transition font-semibold"
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Entrar com o Google
            </button>

            <button
              type="button"
              onClick={handleAppleLogin}
              className="w-full flex items-center justify-center border border-[#64B5F6] py-2 rounded-lg bg-white text-[#1976D2] hover:bg-[#E3F2FD] transition font-semibold"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                alt="Apple"
                className="w-5 h-5 mr-2"
              />
              Entrar com Apple ID
            </button>
          </div>

          {/* Links para cadastro */}
          <p className="text-center text-black mt-6 font-medium">
            Não possui uma conta?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-[#1565C0] hover:underline font-semibold cursor-pointer"
            >
              Cadastre-se
            </span>
          </p>

          <p className="text-center text-black mt-2 font-medium">
            É vendedor?{" "}
            <span
              onClick={() => navigate("/seller")}
              className="text-red-600 hover:underline font-semibold cursor-pointer"
            >
              Criar conta
            </span>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
