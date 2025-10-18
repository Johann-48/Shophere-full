import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import BackButton from "../BackButton";
import { FaRocket, FaGlobe, FaHeart, FaChevronDown, FaChevronUp } from "react-icons/fa";

const About = () => {
  const { isDarkMode, dark, light } = useTheme();
  const currentTheme = isDarkMode ? dark : light;
  
  const cards = [
    {
      title: "Missão",
      text: "Conectar pessoas aos produtos do mercado em sua região, com uma experiência de busca ágil.",
      icon: <FaRocket className="w-12 h-12" />,
      color: "from-blue-500 to-blue-600",
      detail:
        "Nossa missão é garantir que cada busca seja relevante e personalizada, colocando o usuário sempre em primeiro lugar. Trabalhamos incansavelmente para oferecer uma plataforma intuitiva e eficiente.",
    },
    {
      title: "Visão",
      text: "Promover a economia regional, fortalecendo a comunidade local.",
      icon: <FaGlobe className="w-12 h-12" />,
      color: "from-green-500 to-green-600",
      detail:
        "Expandir continuamente nosso alcance e impactar positivamente milhares de pessoas com tecnologia e design de ponta. Queremos ser referência em marketplaces regionais.",
    },
    {
      title: "Valores",
      text: "Transparência, acessibilidade, performance e compromisso com a experiência do usuário.",
      icon: <FaHeart className="w-12 h-12" />,
      color: "from-purple-500 to-purple-600",
      detail:
        "Acreditamos que confiança e ética são a base para relacionamentos duradouros com nossos clientes e parceiros. Cada decisão é tomada pensando no bem-estar da comunidade.",
    },
  ];

  const equipe = [
    {
      nome: "Johann Bauermann",
      cargo: "Back-End e Banco de Dados",
      imagem:
        "https://f.i.uol.com.br/fotografia/2021/08/11/162871253661142e587ca24_1628712536_3x2_md.jpg",
      bio: "Especialista em Node.js e SQL, cria toda a estrutura funcional do sistema",
      instagram: "https://www.instagram.com/johannsb2008",
    },
    {
      nome: "Gabriel Luccas",
      cargo: "Front-End e Back-End",
      imagem:
        "https://upload.wikimedia.org/wikipedia/pt/b/bf/SpongeBob_SquarePants_personagem.png",
      bio: "Especialista em React e design responsivo, cria interfaces modernas e funcionais.",
      instagram: "https://www.instagram.com/gabrieel.lc",
    },
    {
      nome: "Leonardo",
      cargo: "Front-End",
      imagem: "https://randomuser.me/api/portraits/men/75.jpg",
      bio: "Auxiliar em desenvolvimento Front-End e UX/UI",
      instagram: "https://www.instagram.com/leozeraaa2807",
    },
  ];

  const [expandedCards, setExpandedCards] = useState([]);

  const toggleCard = (index) => {
    setExpandedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className={`min-h-screen py-16 px-4 sm:px-6 lg:px-8 ${currentTheme.background} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <BackButton to="/" />
        </div>

        {/* Título principal */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className={`text-5xl sm:text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent`}>
            Sobre Nós 🛍️
          </h1>
          <div className="flex justify-center mb-6">
            <div className="h-1 w-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
          </div>
        </motion.div>

        {/* Descrição da empresa */}
        <motion.div
          className={`max-w-4xl mx-auto text-center mb-20 ${currentTheme.card} rounded-3xl p-8 shadow-xl border ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p className={`text-lg sm:text-xl leading-relaxed ${currentTheme.text}`}>
            Bem-vindo ao{" "}
            <strong className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-black text-2xl">
              ShopHere
            </strong>
            , a plataforma feita para você descobrir produtos incríveis, comparar
            tendências e explorar as melhores oportunidades de forma moderna e
            eficiente. Aqui, você não compra — você <span className="font-bold text-blue-600">descobre</span>.
          </p>
        </motion.div>

        {/* Cards Missão, Visão, Valores - MELHORADOS */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-28">
          {cards.map((card, index) => {
            const isExpanded = expandedCards.includes(index);
            return (
              <motion.div
                key={index}
                className={`relative rounded-3xl shadow-lg overflow-hidden transition-all duration-300 ${currentTheme.card} border-2 ${
                  isExpanded 
                    ? 'border-blue-500 shadow-2xl' 
                    : isDarkMode ? 'border-slate-700' : 'border-gray-200'
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                {/* Gradiente de fundo */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-5`}></div>
                
                <div className="relative p-8">
                  {/* Header do card */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${card.color} shadow-lg`}>
                      <div className="text-white">
                        {card.icon}
                      </div>
                    </div>
                    <h3 className={`text-2xl font-extrabold ${currentTheme.textPrimary} ml-4 flex-1`}>
                      {card.title}
                    </h3>
                  </div>

                  {/* Texto principal */}
                  <p className={`text-base leading-relaxed mb-6 ${currentTheme.text}`}>
                    {card.text}
                  </p>

                  {/* Detalhes expansíveis */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`mb-4 p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100'}`}
                      >
                        <p className={`text-sm leading-relaxed ${currentTheme.text}`}>
                          {card.detail}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Botão expandir */}
                  <button
                    onClick={() => toggleCard(index)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      isExpanded
                        ? `bg-gradient-to-r ${card.color} text-white shadow-lg`
                        : isDarkMode 
                          ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isExpanded ? (
                      <>
                        <FaChevronUp /> Ver menos
                      </>
                    ) : (
                      <>
                        <FaChevronDown /> Saiba mais
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Título da equipe */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl sm:text-5xl font-extrabold mb-4 ${currentTheme.textPrimary}`}>
            Nossa Equipe 💼
          </h2>
          <p className={`text-lg ${currentTheme.text} max-w-2xl mx-auto`}>
            Conheça as pessoas por trás do ShopHere
          </p>
          <div className="flex justify-center mt-6">
            <div className="h-1 w-32 bg-gradient-to-r from-green-600 to-teal-600 rounded-full"></div>
          </div>
        </motion.div>

        {/* Cards da equipe - MELHORADOS */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {equipe.map((membro, index) => (
            <motion.div
              key={index}
              className={`relative rounded-3xl overflow-hidden shadow-xl group ${currentTheme.card} border-2 ${
                isDarkMode ? 'border-slate-700' : 'border-gray-200'
              }`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              {/* Card principal */}
              <div className="p-8 text-center">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <img
                    src={membro.imagem}
                    alt={membro.nome}
                    className="relative w-32 h-32 rounded-full mx-auto object-cover ring-4 ring-white dark:ring-slate-700 shadow-xl transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                <h4 className={`text-2xl font-extrabold mb-2 ${currentTheme.textPrimary}`}>
                  {membro.nome}
                </h4>
                <p className={`text-sm font-semibold mb-4 px-4 py-2 rounded-full inline-block ${
                  isDarkMode 
                    ? 'bg-blue-900/30 text-blue-400' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {membro.cargo}
                </p>

                <p className={`text-sm leading-relaxed mb-6 ${currentTheme.text}`}>
                  {membro.bio}
                </p>

                <a
                  href={membro.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-purple-500/50' 
                      : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-purple-500/30'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm8.75 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
                  </svg>
                  Instagram
                </a>
              </div>

              {/* Efeito de brilho ao hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 pointer-events-none"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
