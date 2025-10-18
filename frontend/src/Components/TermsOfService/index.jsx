import React, { useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { FaFileContract, FaShoppingCart, FaStore, FaGavel, FaExclamationTriangle, FaMoneyBillWave, FaUndo, FaUserCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import BackButton from "../BackButton";

export default function TermsOfService() {
  const { isDarkMode, dark, light } = useTheme();
  const currentTheme = isDarkMode ? dark : light;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: <FaFileContract className="w-8 h-8" />,
      title: "1. Aceitação dos Termos",
      content: [
        "Ao acessar e usar o marketplace ShopHere, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com alguma parte destes termos, não deverá usar nossos serviços.",
        "Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação. É sua responsabilidade verificar periodicamente as atualizações.",
        "O uso continuado do serviço após as alterações constitui sua aceitação dos novos termos."
      ]
    },
    {
      icon: <FaUserCheck className="w-8 h-8" />,
      title: "2. Cadastro e Conta de Usuário",
      content: [
        "Para usar determinados recursos do ShopHere, você deve criar uma conta fornecendo informações precisas e completas.",
        "Requisitos para criação de conta:",
        "• Ter pelo menos 18 anos de idade",
        "• Fornecer informações verdadeiras e atualizadas",
        "• Manter a segurança de sua senha",
        "• Não compartilhar sua conta com terceiros",
        "• Notificar-nos imediatamente sobre uso não autorizado",
        "Você é responsável por todas as atividades realizadas em sua conta. Contas falsas ou fraudulentas serão suspensas."
      ]
    },
    {
      icon: <FaShoppingCart className="w-8 h-8" />,
      title: "3. Compras e Pagamentos",
      content: [
        "Ao realizar uma compra no ShopHere, você concorda com os seguintes termos:",
        "• Todos os preços estão em Reais (R$) e incluem impostos quando aplicável",
        "• Os preços podem variar sem aviso prévio",
        "• Você é responsável por verificar os detalhes do produto antes da compra",
        "• O pagamento deve ser feito através dos métodos disponíveis na plataforma",
        "• Transações fraudulentas serão reportadas às autoridades competentes",
        "• A confirmação de compra será enviada por e-mail"
      ]
    },
    {
      icon: <FaStore className="w-8 h-8" />,
      title: "4. Vendedores e Responsabilidades",
      content: [
        "Os vendedores no ShopHere são responsáveis por:",
        "• Fornecer descrições precisas dos produtos",
        "• Garantir a qualidade e autenticidade dos produtos",
        "• Cumprir os prazos de entrega prometidos",
        "• Responder às dúvidas dos compradores em tempo hábil",
        "• Processar devoluções de acordo com a política estabelecida",
        "• Manter documentação fiscal adequada",
        "A ShopHere atua como intermediária, mas não se responsabiliza diretamente pela qualidade dos produtos vendidos por terceiros."
      ]
    },
    {
      icon: <FaUndo className="w-8 h-8" />,
      title: "5. Política de Devolução e Reembolso",
      content: [
        "Você tem direito a solicitar devolução ou reembolso nas seguintes condições:",
        "• Produto com defeito ou danificado",
        "• Produto diferente do anunciado",
        "• Produto não entregue no prazo estipulado",
        "• Arrependimento dentro do prazo legal (7 dias para compras online)",
        "Processo de devolução:",
        "1. Entre em contato com o vendedor através da plataforma",
        "2. Aguarde aprovação da devolução",
        "3. Envie o produto nas mesmas condições recebidas",
        "4. Reembolso será processado em até 10 dias úteis",
        "Produtos personalizados ou perecíveis podem não ser elegíveis para devolução."
      ]
    },
    {
      icon: <FaMoneyBillWave className="w-8 h-8" />,
      title: "6. Taxas e Comissões",
      content: [
        "O ShopHere cobra taxas dos vendedores pelos serviços prestados:",
        "• Taxa de comissão sobre vendas realizadas",
        "• Taxa de processamento de pagamento",
        "• Taxas adicionais para recursos premium (se aplicável)",
        "Os compradores não pagam taxas adicionais além do preço do produto e frete.",
        "Todas as taxas são claramente informadas antes da conclusão da transação."
      ]
    },
    {
      icon: <FaGavel className="w-8 h-8" />,
      title: "7. Uso Aceitável da Plataforma",
      content: [
        "É expressamente proibido:",
        "• Vender produtos ilegais, falsificados ou contrabandeados",
        "• Usar a plataforma para atividades fraudulentas",
        "• Assediar, ameaçar ou difamar outros usuários",
        "• Publicar conteúdo ofensivo, obsceno ou discriminatório",
        "• Manipular avaliações ou classificações",
        "• Fazer spam ou enviar comunicações não solicitadas",
        "• Tentar acessar áreas restritas da plataforma",
        "• Usar bots ou scripts automatizados sem autorização",
        "Violações podem resultar em suspensão ou banimento permanente da conta."
      ]
    },
    {
      icon: <FaExclamationTriangle className="w-8 h-8" />,
      title: "8. Limitação de Responsabilidade",
      content: [
        "O ShopHere não se responsabiliza por:",
        "• Problemas com produtos vendidos por terceiros",
        "• Atrasos de entrega causados por transportadoras",
        "• Perda de dados devido a problemas técnicos",
        "• Danos indiretos, incidentais ou consequenciais",
        "• Disputas entre compradores e vendedores",
        "Fazemos o possível para manter a plataforma segura e funcional, mas não garantimos operação ininterrupta ou livre de erros.",
        "Nosso limite máximo de responsabilidade é o valor da transação em questão."
      ]
    },
    {
      icon: <FaGavel className="w-8 h-8" />,
      title: "9. Propriedade Intelectual",
      content: [
        "Todo o conteúdo da plataforma ShopHere, incluindo:",
        "• Logotipos, marcas e designs",
        "• Textos, gráficos e imagens",
        "• Software e código-fonte",
        "• Layout e interface do usuário",
        "...são propriedade da ShopHere ou de seus licenciadores e estão protegidos por leis de propriedade intelectual.",
        "Você não pode copiar, modificar, distribuir ou usar nosso conteúdo sem permissão expressa."
      ]
    },
    {
      icon: <FaFileContract className="w-8 h-8" />,
      title: "10. Rescisão",
      content: [
        "Reservamo-nos o direito de suspender ou encerrar sua conta a qualquer momento se:",
        "• Você violar estes Termos de Uso",
        "• Houver suspeita de atividade fraudulenta",
        "• Você fornecer informações falsas",
        "• Receber múltiplas reclamações de outros usuários",
        "Você também pode encerrar sua conta a qualquer momento através das configurações de conta.",
        "Após o encerramento, você não terá mais acesso aos serviços e dados associados à sua conta."
      ]
    },
    {
      icon: <FaGavel className="w-8 h-8" />,
      title: "11. Lei Aplicável e Jurisdição",
      content: [
        "Estes Termos de Uso são regidos pelas leis brasileiras.",
        "Qualquer disputa decorrente do uso da plataforma será resolvida:",
        "• Preferencialmente por negociação amigável",
        "• Por mediação ou arbitragem, se acordado",
        "• Pelo foro da comarca de São Paulo/SP, Brasil",
        "Ao usar o ShopHere, você concorda em se submeter à jurisdição exclusiva dos tribunais brasileiros."
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
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-4 rounded-2xl">
              <FaFileContract className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold ${currentTheme.textPrimary} mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent`}>
            Termos de Uso
          </h1>
          <p className={`text-lg ${currentTheme.text} max-w-3xl mx-auto`}>
            Leia atentamente estes termos antes de usar nossos serviços. 
            Ao acessar o ShopHere, você concorda com todas as condições descritas abaixo.
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
          <p className={`${currentTheme.text} leading-relaxed mb-4`}>
            Bem-vindo aos Termos de Uso do ShopHere! Este documento estabelece as regras e condições 
            para o uso de nossa plataforma de marketplace. Ao criar uma conta ou realizar qualquer 
            transação em nosso site, você automaticamente concorda em cumprir todos os termos aqui 
            estabelecidos.
          </p>
          <p className={`${currentTheme.text} leading-relaxed`}>
            Se você não concordar com algum dos termos, por favor, não utilize nossos serviços. 
            Reservamo-nos o direito de atualizar estes termos a qualquer momento, e é sua 
            responsabilidade revisá-los periodicamente.
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
                <div className="bg-gradient-to-r from-green-600 to-teal-600 p-3 rounded-xl text-white flex-shrink-0">
                  {section.icon}
                </div>
                <h2 className={`text-2xl font-bold ${currentTheme.textPrimary} flex-1`}>
                  {section.title}
                </h2>
              </div>
              <div className={`${currentTheme.text} space-y-3 ml-16`}>
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Aceitação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className={`mt-8 ${currentTheme.card} rounded-2xl p-8 shadow-lg border-2 ${isDarkMode ? 'border-green-700' : 'border-green-200'} bg-gradient-to-r ${isDarkMode ? 'from-green-900/20 to-teal-900/20' : 'from-green-50 to-teal-50'}`}
        >
          <h2 className={`text-2xl font-bold ${currentTheme.textPrimary} mb-4 flex items-center gap-3`}>
            <FaUserCheck className="text-green-600" />
            Aceitação dos Termos
          </h2>
          <p className={`${currentTheme.text} mb-4`}>
            Ao continuar usando o ShopHere, você declara que:
          </p>
          <ul className={`${currentTheme.text} space-y-2 pl-4 list-disc list-inside`}>
            <li>Leu e compreendeu completamente estes Termos de Uso</li>
            <li>Concorda em cumprir todas as regras e condições estabelecidas</li>
            <li>Tem capacidade legal para celebrar este acordo</li>
            <li>Usará a plataforma de forma ética e legal</li>
          </ul>
        </motion.div>

        {/* Contato */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className={`mt-8 ${currentTheme.card} rounded-2xl p-8 shadow-lg border ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`}
        >
          <h2 className={`text-2xl font-bold ${currentTheme.textPrimary} mb-4 flex items-center gap-3`}>
            <FaFileContract className="text-green-600" />
            Dúvidas sobre os Termos?
          </h2>
          <p className={`${currentTheme.text} mb-4`}>
            Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
          </p>
          <div className={`${currentTheme.text} space-y-2 pl-4`}>
            <p>📧 Email: <span className="text-green-600 font-semibold">termos@shophere.com</span></p>
            <p>📱 Telefone: <span className="text-green-600 font-semibold">(11) 9999-9999</span></p>
            <p>🏢 Endereço: <span className="font-semibold">Rua das Compras, 123 - São Paulo, SP</span></p>
          </div>
        </motion.div>

        {/* Footer da página */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
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
