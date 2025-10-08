import React from "react";
import { motion } from "framer-motion";
import { FiMail, FiMapPin, FiPhone, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4
gap-10 px-6"
      >
        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h4
            className="text-[#0D47A1] font-semibold mb-3
text-lg"
          >
            Fique de Olho
          </h4>
          <p className="mb-4 text-sm">Receba novidades por e-mail</p>
          <div className="relative w-full">
            <input
              type="email"
              placeholder="Digite seu email"
              className="w-full py-3 pl-5 pr-12 rounded-full
bg-gray-800 text-gray-200 border border-gray-700 placeholder-gray-400
focus:outline-none focus:ring-2 focus:ring-[#0D47A1] transition-all
text-sm"
            />
            <button
              className="absolute top-1/2 right-2 transform
-translate-y-1/2 bg-[#0D47A1] hover:bg-blue-800 text-white p-2
rounded-full transition-all"
              aria-label="Enviar"
            >
              <FiArrowRight size={18} />
            </button>
          </div>
        </motion.div>
        {/* Ajuda / Contato */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h4
            className="text-[#0D47A1] font-semibold mb-3
text-lg"
          >
            Ajuda
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <FiMapPin className="mt-1 text-[#0D47A1]" />
              111 Bijoy Sarani, Dhaka, DH 1515, Bangladesh
            </li>
            <li className="flex items-center gap-2">
              <FiMail className="text-[#0D47A1]" />
              shopherecompany1@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <FiPhone className="text-[#0D47A1]" />
              (19) 99358-8498
            </li>
          </ul>
        </motion.div>
        {/* Conta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h4
            className="text-[#0D47A1] font-semibold mb-3
text-lg"
          >
            Conta
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/accountmanager"
                className="hover:text-[#0D47A1]
transition"
              >
                Minha Conta
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="hover:text-[#0D47A1]
transition"
              >
                Login / Signup
              </Link>
            </li>
          </ul>
        </motion.div>
        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h4
            className="text-[#0D47A1] font-semibold mb-3
text-lg"
          >
            Links Úteis
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/privacidade"
                className="hover:text-[#0D47A1]
transition"
              >
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link
                to="/termos"
                className="hover:text-[#0D47A1]
transition"
              >
                Termos de Uso
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className="hover:text-[#0D47A1]
transition"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-[#0D47A1]
transition"
              >
                Contato
              </Link>
            </li>
          </ul>
        </motion.div>
      </div>
      {/* Copyright */}
      <div
        className="mt-10 border-t border-gray-700 pt-6 text-center
text-sm text-gray-500"
      >
        © {new Date().getFullYear()} ShopHere. Todos os direitos reservados.
      </div>
    </footer>
  );
}
