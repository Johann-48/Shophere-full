import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

const About = () => {
  const { isDarkMode } = useTheme();
  const cards = [
    {
      title: "🌟 Missão",
      text: "Conectar pessoas aos produtos do mercado me sua região, com uma experiência de busca ágil.",
      icon: "🚀",
      detail:
        "Nossa missão é garantir que cada busca seja relevante e personalizada, colocando o usuário sempre em primeiro lugar.",
    },
    {
      title: "🚀 Visão",
      text: "Promover a economia regional, fotalecendo a região",
      icon: "🌍",
      detail:
        "Expandir continuamente nosso alcance e impactar positivamente milhares de pessoas com tecnologia e design de ponta.",
    },
    {
      title: "❤️ Valores",
      text: "Transparência, acessibilidade, performance e compromisso com a experiência do usuário.",
      icon: "🤝",
      detail:
        "Acreditamos que confiança e ética são a base para relacionamentos duradouros com nossos clientes e parceiros.",
    },
  ];

  const equipe = [
    {
      nome: "Johann Bauermann",
      cargo: "Back-End e Banco de Dados",
      imagem:
        "https://f.i.uol.com.br/fotografia/2021/08/11/162871253661142e587ca24_1628712536_3x2_md.jpg",
      bio: "especialista em Node e SQL, cria a parte funcional do site",
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
      bio: "Auxiliar em desenvolvimento Front",
      instagram: "https://www.instagram.com/leozeraaa2807",
    },
  ];

  const [activeCard, setActiveCard] = useState(null);

  return (
    <div className={`min-h-screen py-16 px-4 sm:px-6 lg:px-8 select-none font-inter ${
      isDarkMode 
        ? 'bg-slate-900' 
        : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Título principal */}
        <motion.h1
          className={`text-5xl sm:text-6xl font-extrabold text-center mb-12 tracking-tight relative cursor-pointer select-none ${
            isDarkMode ? 'text-gray-100' : 'text-[#282933]'
          }`}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{
            textShadow:
              "0 0 10px rgba(21, 101, 192, 0.9), 0 0 20px rgba(21, 101, 192, 0.5)",
            scale: 1.05,
          }}
        >
          Sobre Nós 🛍️
        </motion.h1>

        {/* Descrição da empresa */}
        <motion.p
          className={`max-w-3xl mx-auto text-center text-lg sm:text-xl font-medium leading-relaxed mb-20 font-sans ${
            isDarkMode ? 'text-gray-200' : 'text-gray-800'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Bem-vindo ao{" "}
          <strong
            className={`font-black ${isDarkMode ? 'text-gray-100' : 'text-black'}`}
            style={{ textShadow: "1px 1px 2px rgba(21, 101, 192, 0.4)" }}
          >
            ShopHere
          </strong>
          , a plataforma feita para você descobrir produtos incríveis, comparar
          tendências e explorar as melhores oportunidades de forma moderna e
          eficiente. Aqui, você não compra — você descobre.
        </motion.p>

        {/* Cards Missão, Visão, Valores */}
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3 mb-28">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              onClick={() => setActiveCard(index === activeCard ? null : index)}
              className={`relative cursor-pointer rounded-2xl shadow-md p-8 border border-transparent transform transition-all duration-300 ease-in-out origin-center
                ${isDarkMode 
                  ? 'bg-gray-800 hover:shadow-lg hover:border-gray-600' 
                  : 'bg-white hover:shadow-lg hover:border-[#43444F]'
                }
                ${
                  activeCard === index
                    ? isDarkMode 
                      ? "border-blue-400 shadow-xl scale-[1.03] z-20"
                      : "border-[#1565C0] shadow-xl scale-[1.03] z-20"
                    : "scale-100"
                }
              `}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              layout
            >
              <div className="flex items-center space-x-5 mb-4">
                <div className="text-6xl">{card.icon}</div>
                <h3 className={`text-2xl font-extrabold ${
                  isDarkMode ? 'text-gray-100' : 'text-[#282933]'
                }`}>
                  {card.title}
                </h3>
              </div>
              <p className={`text-base font-medium leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-[#43444F]'
              }`}>
                {card.text}
              </p>

              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={
                  activeCard === index
                    ? { opacity: 1, height: "auto", marginTop: 20 }
                    : { opacity: 0, height: 0, marginTop: 0 }
                }
                transition={{ duration: 0.3 }}
                className={`text-sm font-normal overflow-hidden ${
                  isDarkMode ? 'text-gray-200' : 'text-[#282933]'
                }`}
              >
                {card.detail}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Título da equipe */}
        <motion.h2
          className={`text-3xl sm:text-4xl font-semibold text-center mb-16 border-b-4 pb-3 max-w-max mx-auto cursor-default select-none tracking-wide ${
            isDarkMode 
              ? 'text-gray-200 border-gray-400' 
              : 'text-[#43444F] border-[#43444F]'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          Nossa Equipe 💼
        </motion.h2>

        {/* Cards da equipe */}
        <div className="grid gap-14 sm:grid-cols-2 md:grid-cols-3">
          {equipe.map((membro, index) => (
            <motion.div
              key={index}
              className={`relative rounded-3xl p-8 shadow-md cursor-pointer overflow-hidden group transition-shadow duration-300 hover:shadow-2xl ${
                isDarkMode 
                  ? 'bg-gray-800 border border-gray-600' 
                  : 'bg-white border border-[#43444F]'
              }`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.15 }}
              viewport={{ once: true }}
            >
              <img
                src={membro.imagem}
                alt={membro.nome}
                className={`w-28 h-28 rounded-full mx-auto mb-6 object-cover ring-4 transition-transform duration-500 group-hover:scale-110 ${
                  isDarkMode ? 'ring-gray-500' : 'ring-blue-500'
                }`}
              />
              <h4 className={`text-center text-2xl font-extrabold ${
                isDarkMode ? 'text-gray-100' : 'text-[#282933]'
              }`}>
                {membro.nome}
              </h4>
              <p className={`text-center text-sm font-semibold mb-6 ${
                isDarkMode ? 'text-gray-300' : 'text-[#43444F]'
              }`}>
                {membro.cargo}
              </p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`absolute inset-0 backdrop-blur-sm rounded-3xl p-6 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto flex flex-col justify-center items-center text-center ${
                  isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'
                }`}
              >
                <p className={`text-sm mb-4 font-medium ${
                  isDarkMode ? 'text-gray-200' : 'text-[#43444F]'
                }`}>
                  {membro.bio}
                </p>
                <a
                  href={membro.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-2 text-white rounded-full shadow-md transition ${
                    isDarkMode 
                      ? 'bg-blue-600 hover:bg-blue-500' 
                      : 'bg-[#282933] hover:bg-[#43444F]'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.75 0-5 2.25-5 5v14c0 2.75 2.25 5 5 5h14c2.75 0 5-2.25 5-5v-14c0-2.75-2.25-5-5-5zm-11.5 19h-3v-10h3v10zm-1.5-11.5c-.967 0-1.75-.78-1.75-1.75 0-.967.783-1.75 1.75-1.75s1.75.783 1.75 1.75c0 .967-.783 1.75-1.75 1.75zm13 11.5h-3v-5c0-1.25-.5-2-1.75-2s-2 .75-2 2v5h-3v-10h3v1.4c.9-1.3 2.75-1.4 3.75-1.4 2.3 0 3.25 1.5 3.25 3.75v6.25z" />
                  </svg>
                  Instagram
                </a>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
