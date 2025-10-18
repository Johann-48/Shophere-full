import React, { useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { FaShieldAlt, FaLock, FaUserShield, FaEnvelope, FaCookie, FaDatabase } from "react-icons/fa";
import { motion } from "framer-motion";
import BackButton from "../BackButton";

export default function PrivacyPolicy() {
  const { isDarkMode, dark, light } = useTheme();
  const currentTheme = isDarkMode ? dark : light;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "1. Informações que Coletamos",
      content: [
        "Coletamos informações que você nos fornece diretamente ao criar uma conta, fazer um pedido ou entrar em contato conosco:",
        "• Dados pessoais: nome, e-mail, telefone, endereço",
        "• Informações de pagamento (processadas com segurança)",
        "• Histórico de compras e preferências",
        "• Comunicações com nossa equipe de suporte"
      ]
    },
    {
      icon: <FaDatabase className="w-8 h-8" />,
      title: "2. Como Usamos Suas Informações",
      content: [
        "Utilizamos as informações coletadas para:",
        "• Processar e gerenciar seus pedidos",
        "• Melhorar nossos produtos e serviços",
        "• Enviar atualizações sobre pedidos e ofertas (com seu consentimento)",
        "• Prevenir fraudes e garantir a segurança da plataforma",
        "• Cumprir obrigações legais e regulatórias"
      ]
    },
    {
      icon: <FaLock className="w-8 h-8" />,
      title: "3. Proteção de Dados",
      content: [
        "Levamos a segurança dos seus dados muito a sério:",
        "• Criptografia SSL/TLS em todas as comunicações",
        "• Armazenamento seguro em servidores protegidos",
        "• Acesso restrito apenas a pessoal autorizado",
        "• Monitoramento contínuo de ameaças de segurança",
        "• Conformidade com a LGPD (Lei Geral de Proteção de Dados)"
      ]
    },
    {
      icon: <FaUserShield className="w-8 h-8" />,
      title: "4. Compartilhamento de Informações",
      content: [
        "Não vendemos suas informações pessoais. Compartilhamos apenas quando necessário:",
        "• Com vendedores para processar seus pedidos",
        "• Com processadores de pagamento para transações",
        "• Com serviços de entrega para envio de produtos",
        "• Quando exigido por lei ou ordem judicial",
        "• Com seu consentimento explícito"
      ]
    },
    {
      icon: <FaCookie className="w-8 h-8" />,
      title: "5. Cookies e Tecnologias Similares",
      content: [
        "Utilizamos cookies para melhorar sua experiência:",
        "• Cookies essenciais para funcionamento do site",
        "• Cookies de preferências para lembrar suas escolhas",
        "• Cookies analíticos para entender como você usa o site",
        "• Você pode gerenciar cookies nas configurações do navegador"
      ]
    },
    {
      icon: <FaEnvelope className="w-8 h-8" />,
      title: "6. Seus Direitos",
      content: [
        "De acordo com a LGPD, você tem direito a:",
        "• Acessar seus dados pessoais",
        "• Corrigir dados incompletos ou desatualizados",
        "• Solicitar a exclusão de seus dados",
        "• Revogar consentimentos dados anteriormente",
        "• Portabilidade dos seus dados",
        "• Informações sobre o uso e compartilhamento de dados"
      ]
    }
  ];

  return (
    <main className={`${currentTheme.background} min-h-screen py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <BackButton to="/" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
              <FaShieldAlt className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold ${currentTheme.textPrimary} mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
            Política de Privacidade
          </h1>
          <p className={`text-lg ${currentTheme.text} max-w-3xl mx-auto`}>
            Sua privacidade é importante para nós. Esta política descreve como coletamos, 
            usamos e protegemos suas informações pessoais.
          </p>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'} mt-4`}>
            Última atualização: 18 de Outubro de 2025
          </p>
        </motion.div>

        {/* Introdução */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`${currentTheme.card} rounded-2xl p-8 mb-8 shadow-lg border ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`}
        >
          <p className={`${currentTheme.text} leading-relaxed`}>
            Bem-vindo à ShopHere! Estamos comprometidos em proteger sua privacidade e seus dados pessoais. 
            Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos suas informações 
            quando você usa nosso marketplace. Ao utilizar nossos serviços, você concorda com as práticas descritas 
            nesta política.
          </p>
        </motion.div>

        {/* Seções */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 3) }}
              className={`${currentTheme.card} rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all border ${isDarkMode ? 'border-slate-700 hover:border-slate-600' : 'border-gray-100 hover:border-gray-200'}`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl text-white flex-shrink-0">
                  {section.icon}
                </div>
                <h2 className={`text-2xl font-bold ${currentTheme.textPrimary} flex-1`}>
                  {section.title}
                </h2>
              </div>
              <div className={`${currentTheme.text} space-y-2 ml-16`}>
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contato */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className={`mt-8 ${currentTheme.card} rounded-2xl p-8 shadow-lg border ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`}
        >
          <h2 className={`text-2xl font-bold ${currentTheme.textPrimary} mb-4 flex items-center gap-3`}>
            <FaEnvelope className="text-blue-600" />
            Entre em Contato
          </h2>
          <p className={`${currentTheme.text} mb-4`}>
            Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados, 
            entre em contato conosco:
          </p>
          <div className={`${currentTheme.text} space-y-2 pl-4`}>
            <p>📧 Email: <span className="text-blue-600 font-semibold">privacidade@shophere.com</span></p>
            <p>📱 Telefone: <span className="text-blue-600 font-semibold">(11) 9999-9999</span></p>
            <p>🏢 Endereço: <span className="font-semibold">Rua das Compras, 123 - São Paulo, SP</span></p>
          </div>
        </motion.div>

        {/* Footer da página */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-8 text-center"
        >
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            © 2025 ShopHere. Todos os direitos reservados.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
