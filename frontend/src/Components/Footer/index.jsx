import React from "react";
import { motion } from "framer-motion";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
export default function Footer() {
  const { isDarkMode, dark, light } = useTheme();
  const currentTheme = isDarkMode ? dark : light;
  const accentText = isDarkMode ? "text-blue-400" : "text-blue-700";
  return (
    <footer className={`${currentTheme.footer} ${currentTheme.text} py-12`}>
      <div
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 justify-items-center text-center"
      >
        {/* Ajuda / Contato */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h4
            className={`${accentText} font-semibold mb-3
text-lg`}
          >
            Ajuda
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2 justify-center">
              <FiMapPin className={`mt-1 ${accentText}`} />
              111 Bijoy Sarani, Dhaka, DH 1515, Bangladesh
            </li>
            <li className="flex items-center gap-2 justify-center">
              <FiMail className={`${accentText}`} />
              shopherecompany1@gmail.com
            </li>
            <li className="flex items-center gap-2 justify-center">
              <FiPhone className={`${accentText}`} />
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
            className={`${accentText} font-semibold mb-3
text-lg`}
          >
            Conta
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/accountmanager"
                className={`hover:${isDarkMode ? 'text-blue-400' : 'text-blue-700'}
transition`}
              >
                Minha Conta
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className={`hover:${isDarkMode ? 'text-blue-400' : 'text-blue-700'}
transition`}
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
            className={`${accentText} font-semibold mb-3
text-lg`}
          >
            Links Úteis
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/privacy-policy"
                className={`hover:${isDarkMode ? 'text-blue-400' : 'text-blue-700'} transition`}
              >
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link
                to="/terms-of-service"
                className={`hover:${isDarkMode ? 'text-blue-400' : 'text-blue-700'} transition`}
              >
                Termos de Uso
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className={`hover:${isDarkMode ? 'text-blue-400' : 'text-blue-700'}
transition`}
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`hover:${isDarkMode ? 'text-blue-400' : 'text-blue-700'}
transition`}
              >
                Contato
              </Link>
            </li>
          </ul>
        </motion.div>
      </div>
      {/* Copyright */}
      <div
        className={`mt-10 border-t pt-6 text-center text-sm ${isDarkMode ? 'border-slate-700 text-slate-400' : 'border-blue-200 text-gray-500'}`}
      >
        © {new Date().getFullYear()} ShopHere. Todos os direitos reservados.
      </div>
    </footer>
  );
}
