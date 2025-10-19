import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function ContactsPage() {
  const { role } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "user") {
      navigate("/contact", { replace: true });
    } else if (role === "commerce") {
      navigate("/lojadashboard", { replace: true });
    }
  }, [role, navigate]);

  if (role === "user" || role === "commerce") {
    return null;
  }

  return (
    <>
      <Header />
      <main
        className={`min-h-[60vh] flex items-center justify-center px-6 py-16 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-gray-100"
            : "bg-gradient-to-br from-green-100 via-white to-green-50 text-gray-900"
        }`}
      >
        <div className="max-w-xl text-center space-y-6">
          <h1 className="text-3xl font-bold">Converse com comerciantes</h1>
          <p className="text-base leading-relaxed">
            Faça login ou crie uma conta gratuita para enviar mensagens aos
            comércios parceiros. Assim que estiver conectado, você poderá
            iniciar conversas diretamente com os vendedores.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              className="px-6 py-3 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              Fazer login
            </Link>
            <Link
              to="/signup"
              className={`px-6 py-3 rounded-md font-semibold border ${
                isDarkMode
                  ? "border-blue-400 text-blue-200 hover:bg-blue-900/40"
                  : "border-blue-600 text-blue-700 hover:bg-blue-50"
              } transition`}
            >
              Criar conta
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
