import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FiPlusCircle,
  FiEdit,
  FiMessageSquare,
  FiCamera,
  FiTrash2,
  FiSave,
  FiXCircle,
  FiMic,
  FiSend,
  FiX,
  FiStar,
  FiLink,
  FiPackage,
  FiShoppingBag,
  FiTrendingUp,
  FiDollarSign,
  FiEye,
  FiHeart,
  FiBarChart2,
  FiUsers,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import API_CONFIG from "../../config/api";

const formatCurrency = (valor) => {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) {
    return "R$ 0,00";
  }
  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
};

export default function LojaDashboard() {
  const [abaSelecionada, setAbaSelecionada] = useState("dashboard");
  const [logoUrl, setLogoUrl] = useState("");
  const [nomeLoja, setNomeLoja] = useState("");
  const [stats, setStats] = useState({
    totalProdutos: 0,
    produtosAtivos: 0,
    totalConversas: 0,
    valorTotal: 0,
  });

  // Busca logo e estatísticas
  useEffect(() => {
    let ativo = true;

    const carregarDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}` };
        const { data } = await axios.get("/api/commerces/me", { headers });
        if (!ativo) return;
        setLogoUrl(data.logoUrl);
        setNomeLoja(data.nome);

        const lojaId = data.id;

        const [produtosRes, conversasRes] = await Promise.all([
          axios.get("/api/products/meus", { headers }),
          lojaId
            ? axios.get("/api/chats", { params: { lojaId }, headers })
            : Promise.resolve({ data: [] }),
        ]);

        if (!ativo) return;

        const produtosPayload = Array.isArray(produtosRes.data)
          ? produtosRes.data
          : produtosRes.data?.products || [];

        const produtosNormalizados = produtosPayload.map((produto) => ({
          preco:
            Number(produto.preco ?? produto.price ?? produto.valor ?? 0) || 0,
          quantidade:
            Number(
              produto.quantidade ?? produto.stock ?? produto.estoque ?? 0
            ) || 0,
        }));

        const totalProdutos = produtosPayload.length;
        const produtosAtivos = produtosNormalizados.filter(
          (produto) => produto.quantidade > 0
        ).length;
        const valorTotal = produtosNormalizados.reduce(
          (acc, produto) => acc + produto.preco * produto.quantidade,
          0
        );

        const conversasPayload = Array.isArray(conversasRes.data)
          ? conversasRes.data
          : [];

        setStats({
          totalProdutos,
          produtosAtivos,
          totalConversas: conversasPayload.length,
          valorTotal,
        });
      } catch (err) {
        console.error("Erro ao carregar dados da loja:", err);
        toast.error("Não foi possível carregar os dados do painel.");
      }
    };

    carregarDashboard();

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header com Logo e Info */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Logo Container */}
            <div className="relative group flex flex-col items-center md:items-start">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={
                    logoUrl
                      ? logoUrl.startsWith("http")
                        ? logoUrl
                        : `${API_CONFIG.getApiUrl("/uploads")}/${logoUrl}`
                      : "https://via.placeholder.com/200?text=Sua+Logo"
                  }
                  alt={nomeLoja || "Logo da Loja"}
                  className="rounded-2xl w-32 h-32 object-cover bg-white p-2 shadow-lg transition-transform duration-200"
                />
              </div>
              <span className="mt-3 text-xs text-gray-500 text-center md:text-left opacity-80">
                Atualize a logo na aba "Editar Loja" usando o campo URL da Logo.
              </span>
            </div>

            {/* Info da Loja */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {nomeLoja || "Minha Loja"}
              </h1>
              <p className="text-gray-600 text-lg">
                Gerencie sua loja de forma inteligente
              </p>
            </div>

            {/* Botão rápido */}
            <button
              onClick={() => setAbaSelecionada("adicionarproduto")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <FiPlusCircle className="w-5 h-5" />
              Novo Produto
            </button>
          </div>
        </div>

        {/* Stats Cards - apenas para dashboard */}
        {abaSelecionada === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<FiPackage className="w-8 h-8" />}
              title="Total de Produtos"
              value={stats.totalProdutos}
              color="from-blue-500 to-cyan-500"
              delay="0"
            />
            <StatCard
              icon={<FiShoppingBag className="w-8 h-8" />}
              title="Produtos Ativos"
              value={stats.produtosAtivos}
              color="from-green-500 to-emerald-500"
              delay="100"
            />
            <StatCard
              icon={<FiMessageSquare className="w-8 h-8" />}
              title="Conversas"
              value={stats.totalConversas}
              color="from-purple-500 to-pink-500"
              delay="200"
            />
            <StatCard
              icon={<FiDollarSign className="w-8 h-8" />}
              title="Valor em Estoque"
              value={formatCurrency(stats.valorTotal)}
              color="from-orange-500 to-red-500"
              delay="300"
            />
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <TabButton
              active={abaSelecionada === "dashboard"}
              onClick={() => setAbaSelecionada("dashboard")}
              icon={<FiBarChart2 />}
              text="Dashboard"
              color="purple"
            />
            <TabButton
              active={abaSelecionada === "adicionarproduto"}
              onClick={() => setAbaSelecionada("adicionarproduto")}
              icon={<FiPlusCircle />}
              text="Adicionar"
              color="blue"
            />
            <TabButton
              active={abaSelecionada === "meusprodutos"}
              onClick={() => setAbaSelecionada("meusprodutos")}
              icon={<FiPackage />}
              text="Produtos"
              color="green"
            />
            <TabButton
              active={abaSelecionada === "editarloja"}
              onClick={() => setAbaSelecionada("editarloja")}
              icon={<FiEdit />}
              text="Editar Loja"
              color="orange"
            />
            <TabButton
              active={abaSelecionada === "batepapo"}
              onClick={() => setAbaSelecionada("batepapo")}
              icon={<FiMessageSquare />}
              text="Chat"
              color="pink"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 min-h-[400px] transform transition-all duration-300">
          {abaSelecionada === "dashboard" && (
            <DashboardHome
              stats={stats}
              setAbaSelecionada={setAbaSelecionada}
            />
          )}
          {abaSelecionada === "adicionarproduto" && <AdicionarProduto />}
          {abaSelecionada === "meusprodutos" && <MeusProdutos />}
          {abaSelecionada === "editarloja" && <EditarLoja />}
          {abaSelecionada === "batepapo" && <BatePapo />}
        </div>
      </div>
    </div>
  );
}

// Novo componente: Dashboard Home
function DashboardHome({ stats, setAbaSelecionada }) {
  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Bem-vindo ao seu Painel! 🎉
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          Aqui você tem tudo para gerenciar sua loja de forma profissional
        </p>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <QuickActionCard
            icon={<FiPlusCircle className="w-12 h-12" />}
            title="Adicionar Produto"
            description="Cadastre novos produtos rapidamente"
            color="from-blue-500 to-cyan-500"
            onClick={() => setAbaSelecionada("adicionarproduto")}
          />
          <QuickActionCard
            icon={<FiEdit className="w-12 h-12" />}
            title="Gerenciar Produtos"
            description="Edite e organize seu catálogo"
            color="from-green-500 to-emerald-500"
            onClick={() => setAbaSelecionada("meusprodutos")}
          />
          <QuickActionCard
            icon={<FiMessageSquare className="w-12 h-12" />}
            title="Atender Clientes"
            description="Responda mensagens e dúvidas"
            color="from-purple-500 to-pink-500"
            onClick={() => setAbaSelecionada("batepapo")}
          />
        </div>

        {/* Tips Section */}
        <div className="mt-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
            <FiAlertCircle className="text-purple-600" />
            Dicas para Vender Mais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-3xl mx-auto">
            <TipItem text="Adicione fotos de qualidade aos seus produtos" />
            <TipItem text="Mantenha descrições detalhadas e precisas" />
            <TipItem text="Responda mensagens dos clientes rapidamente" />
            <TipItem text="Mantenha seu estoque sempre atualizado" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TipItem({ text }) {
  return (
    <div className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <FiCheckCircle className="text-green-500 flex-shrink-0 mt-1" />
      <span className="text-gray-700">{text}</span>
    </div>
  );
}

function StatCard({ icon, title, value, color, delay }) {
  return (
    <div
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div
          className={`bg-gradient-to-r ${color} w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg`}
        >
          {icon}
        </div>
      </div>
      <div className={`mt-4 h-1 bg-gradient-to-r ${color} rounded-full`}></div>
    </div>
  );
}

function QuickActionCard({ icon, title, description, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer active:scale-95"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-r ${color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      ></div>
      <div
        className={`bg-gradient-to-r ${color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900">
        {title}
      </h3>
      <p className="text-gray-600 group-hover:text-gray-700">{description}</p>
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, text, color }) {
  const colors = {
    purple: "from-purple-600 to-pink-600",
    blue: "from-blue-600 to-cyan-600",
    green: "from-green-600 to-emerald-600",
    orange: "from-orange-600 to-red-600",
    pink: "from-pink-600 to-rose-600",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
        active
          ? `bg-gradient-to-r ${colors[color]} text-white shadow-lg`
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{text}</span>
    </button>
  );
}

function AdicionarProduto() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [marca, setMarca] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [codigoBarras, setCodigoBarras] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [foto, setFoto] = useState(null);
  const [imagemUrl, setImagemUrl] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewImagem, setPreviewImagem] = useState(null);

  useEffect(() => {
    axios
      .get("/api/categories")
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error("Erro ao buscar categorias:", err));
  }, []);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    setFoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagem(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        API_CONFIG.getApiUrl("/api/products"),
        {
          nome,
          preco,
          categoria_id: categoria,
          descricao,
          marca,
          quantidade,
          codigo_barras: codigoBarras,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const produtoId = res.data.id;

      if (imagemUrl && /^https?:\/\//i.test(imagemUrl)) {
        await axios.post(
          `/api/products/${produtoId}/images/url`,
          { url: imagemUrl, principal: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (foto) {
        const formData = new FormData();
        formData.append("file", foto);
        await axios.post(`/api/products/${produtoId}/images`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setMensagem("✅ Produto cadastrado com sucesso!");
      toast.success("Produto adicionado com sucesso!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setNome("");
      setPreco("");
      setCategoria("");
      setDescricao("");
      setMarca("");
      setQuantidade("");
      setCodigoBarras("");
      setFoto(null);
      setImagemUrl("");
      setPreviewImagem(null);
    } catch (error) {
      console.error(error);
      setErro("❌ Erro ao cadastrar produto. Tente novamente.");
      toast.error("Erro ao cadastrar produto. Tente novamente.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          Adicionar Novo Produto
        </h2>
        <p className="text-gray-600">Preencha os dados do seu produto</p>
      </div>

      {/* Preview da Imagem */}
      {previewImagem && (
        <div className="flex justify-center mb-6 animate-fadeIn">
          <div className="relative group">
            <img
              src={previewImagem}
              alt="Preview"
              className="w-48 h-48 object-cover rounded-2xl shadow-lg"
            />
            <button
              type="button"
              onClick={() => {
                setPreviewImagem(null);
                setFoto(null);
              }}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FiX />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ModernInput
          label="Nome do Produto"
          icon={<FiPackage />}
          placeholder="Ex: Camiseta Polo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <ModernInput
          label="Preço"
          icon={<FiDollarSign />}
          type="number"
          step="0.01"
          placeholder="0.00"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FiShoppingBag className="text-blue-600" />
            Categoria
          </label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
          >
            <option value="" disabled>
              Selecione uma categoria
            </option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>
        <ModernInput
          label="Marca"
          icon={<FiStar />}
          placeholder="Ex: Nike"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ModernInput
          label="Quantidade em Estoque"
          icon={<FiPackage />}
          type="number"
          min="0"
          step="1"
          placeholder="0"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
        />
        <ModernInput
          label="Código de Barras"
          icon={<FiLink />}
          placeholder="000000000000"
          value={codigoBarras}
          onChange={(e) => setCodigoBarras(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
          <FiEdit className="text-blue-600" />
          Descrição
        </label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descreva seu produto em detalhes..."
          rows={4}
          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
        />
      </div>

      {/* Upload de Imagem */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <FiCamera className="text-blue-600" />
          Imagem do Produto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="cursor-pointer">
            <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-all">
              <FiCamera className="w-12 h-12 mx-auto mb-3 text-blue-600" />
              <p className="font-medium text-gray-700">Upload de Arquivo</p>
              <p className="text-sm text-gray-500 mt-1">
                Clique para selecionar
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              className="hidden"
            />
          </label>
          <div>
            <ModernInput
              label="Ou URL Externa"
              icon={<FiLink />}
              placeholder="https://exemplo.com/imagem.jpg"
              value={imagemUrl}
              onChange={(e) => setImagemUrl(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Mensagens */}
      {mensagem && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg animate-fadeIn flex items-center gap-3">
          <FiCheckCircle className="w-6 h-6" />
          <span className="font-medium">{mensagem}</span>
        </div>
      )}
      {erro && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg animate-fadeIn flex items-center gap-3">
          <FiAlertCircle className="w-6 h-6" />
          <span className="font-medium">{erro}</span>
        </div>
      )}

      {/* Botão Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Cadastrando...
          </>
        ) : (
          <>
            <FiPlusCircle className="w-5 h-5" />
            Adicionar Produto
          </>
        )}
      </button>
    </form>
  );
}

function ModernInput({
  label,
  icon,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  min,
  step,
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
        {icon && <span className="text-blue-600">{icon}</span>}
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        step={step || (type === "number" ? "0.01" : undefined)}
        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
      />
    </div>
  );
}

function MeusProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [produtoEditandoId, setProdutoEditandoId] = useState(null);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [galeria, setGaleria] = useState([]);
  const [galeriaLoading, setGaleriaLoading] = useState(false);
  const [novaImagemUrl, setNovaImagemUrl] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get("/api/categories")
      .then((res) => setCategorias(res.data))
      .catch(console.error);
    const fetchProdutos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/products/meus", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProdutos(res.data);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, []);

  async function iniciarEdicao(produto) {
    setProdutoEditandoId(produto.id);
    setProdutoEditando({
      ...produto,
      categoria_id: produto.categoria_id || "",
    });
    const imgs = await carregarGaleria(produto.id);
    const principal = (imgs || []).find((g) => g.principal);
    if (principal) {
      setProdutoEditando((prev) => ({ ...prev, imagem: principal.url }));
    }
  }

  function cancelarEdicao() {
    setProdutoEditandoId(null);
    setProdutoEditando(null);
  }

  async function carregarGaleria(produtoId) {
    setGaleriaLoading(true);
    try {
      const res = await axios.get(`/api/products/${produtoId}/images`);
      const data = res.data || [];
      setGaleria(data);
      return data;
    } catch (e) {
      console.error("Erro ao carregar galeria:", e);
      return [];
    } finally {
      setGaleriaLoading(false);
    }
  }

  async function uploadImagemArquivo(file) {
    if (!file || !produtoEditandoId) return;
    const token = localStorage.getItem("token");
    const form = new FormData();
    form.append("file", file);
    try {
      await axios.post(`/api/products/${produtoEditandoId}/images`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      const imgs = await carregarGaleria(produtoEditandoId);
      const principal = (imgs || []).find((g) => g.principal);
      if (principal) {
        setProdutoEditando((prev) => ({ ...prev, imagem: principal.url }));
        setProdutos((prev) =>
          prev.map((p) =>
            p.id === produtoEditandoId ? { ...p, imagem: principal.url } : p
          )
        );
      }
    } catch (e) {
      console.error("Erro ao enviar imagem:", e);
      alert("Falha ao enviar imagem.");
    }
  }

  async function anexarImagemUrl() {
    if (!novaImagemUrl.trim()) return;
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `/api/products/${produtoEditandoId}/images/url`,
        { url: novaImagemUrl, principal: galeria.length === 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNovaImagemUrl("");
      const imgs = await carregarGaleria(produtoEditandoId);
      const principal = (imgs || []).find((g) => g.principal);
      if (principal) {
        setProdutoEditando((prev) => ({ ...prev, imagem: principal.url }));
        setProdutos((prev) =>
          prev.map((p) =>
            p.id === produtoEditandoId ? { ...p, imagem: principal.url } : p
          )
        );
      }
    } catch (e) {
      console.error("Erro ao anexar URL:", e);
      alert(
        e.response?.data?.error || "Não foi possível anexar a URL informada."
      );
    }
  }

  async function definirComoPrincipal(imageId) {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `/api/products/${produtoEditandoId}/images/${imageId}/principal`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const imgs = await carregarGaleria(produtoEditandoId);
      const principal = (imgs || []).find((g) => g.principal);
      if (principal) {
        setProdutoEditando((prev) => ({ ...prev, imagem: principal.url }));
        setProdutos((prev) =>
          prev.map((p) =>
            p.id === produtoEditandoId ? { ...p, imagem: principal.url } : p
          )
        );
      }
    } catch (e) {
      console.error("Erro ao definir principal:", e);
      alert("Falha ao definir imagem principal.");
    }
  }

  function handleEditChange(e) {
    const { name, value } = e.target;
    setProdutoEditando((prev) => ({ ...prev, [name]: value }));
  }

  async function salvarEdicao(e) {
    e.preventDefault();
    if (!produtoEditando.nome || !produtoEditando.preco) {
      alert("Preencha nome e preço!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/products/${produtoEditando.id}`,
        {
          ...produtoEditando,
          categoria_id: produtoEditando.categoria_id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProdutos((prev) =>
        prev.map((p) => (p.id === produtoEditandoId ? produtoEditando : p))
      );
      toast.success("Produto atualizado com sucesso!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      cancelarEdicao();
    } catch (err) {
      console.error("Erro ao salvar edição:", err);
      toast.error("Erro ao salvar edição. Tente novamente.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }

  async function excluirProduto(id) {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProdutos((prev) => prev.filter((p) => p.id !== id));
        toast.success("Produto removido com sucesso!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (err) {
        console.error("Erro ao excluir produto:", err);
        toast.error("Erro ao excluir produto. Tente novamente.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Meus Produtos
        </h2>
        <p className="text-gray-600">
          {produtos.length} produto{produtos.length !== 1 ? "s" : ""} cadastrado
          {produtos.length !== 1 ? "s" : ""}
        </p>
      </div>

      {produtos.length === 0 ? (
        <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
          <FiPackage className="w-20 h-20 mx-auto text-gray-300 mb-4" />
          <h3 className="text-2xl font-bold text-gray-600 mb-2">
            Nenhum produto ainda
          </h3>
          <p className="text-gray-500 mb-6">
            Comece adicionando seu primeiro produto!
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
            <FiPlusCircle className="inline mr-2" />
            Adicionar Produto
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {produtos.map((produto) =>
            produtoEditandoId === produto.id ? (
              <form
                key={produto.id}
                onSubmit={salvarEdicao}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-lg border-2 border-blue-200"
              >
                <div className="flex items-start gap-6 mb-6">
                  <img
                    src={
                      galeria.find((g) => g.principal)?.url ||
                      produtoEditando.imagem ||
                      "https://via.placeholder.com/150"
                    }
                    alt={produtoEditando.nome}
                    className="w-32 h-32 object-cover rounded-xl border-4 border-white shadow-lg"
                  />
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      className="p-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      name="nome"
                      value={produtoEditando.nome}
                      onChange={handleEditChange}
                      placeholder="Nome do Produto"
                      required
                    />
                    <input
                      className="p-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      name="preco"
                      type="number"
                      step="0.01"
                      min="0"
                      value={produtoEditando.preco}
                      onChange={handleEditChange}
                      placeholder="Preço"
                      required
                    />
                    <select
                      name="categoria_id"
                      value={produtoEditando.categoria_id || ""}
                      onChange={handleEditChange}
                      required
                      className="p-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                      <option value="" disabled>
                        Selecione categoria
                      </option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nome}
                        </option>
                      ))}
                    </select>
                    <input
                      className="p-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      name="marca"
                      value={produtoEditando.marca || ""}
                      onChange={handleEditChange}
                      placeholder="Marca"
                    />
                    <input
                      className="p-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      name="quantidade"
                      type="number"
                      min="0"
                      step="1"
                      value={produtoEditando.quantidade || ""}
                      onChange={handleEditChange}
                      placeholder="Quantidade"
                    />
                    <input
                      className="p-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      name="codigoBarras"
                      value={produtoEditando.codigoBarras || ""}
                      onChange={handleEditChange}
                      placeholder="Código de Barras"
                    />
                  </div>
                </div>

                {/* Galeria */}
                <div className="bg-white rounded-xl p-4 mb-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FiCamera className="text-blue-600" />
                    Galeria de Imagens
                  </h4>
                  <div className="flex items-center gap-3 flex-wrap mb-4">
                    <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                      <FiCamera />
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => uploadImagemArquivo(e.target.files[0])}
                      />
                    </label>
                    <input
                      type="url"
                      placeholder="https://imagem.externa/..."
                      value={novaImagemUrl}
                      onChange={(e) => setNovaImagemUrl(e.target.value)}
                      className="flex-1 p-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={anexarImagemUrl}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Anexar URL
                    </button>
                  </div>
                  {galeriaLoading ? (
                    <p>Carregando...</p>
                  ) : galeria.length === 0 ? (
                    <p className="text-sm text-gray-500">Sem imagens</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {galeria.map((img) => (
                        <div
                          key={img.id}
                          className="relative group border-2 border-gray-200 rounded-lg overflow-hidden"
                        >
                          <img
                            src={img.url}
                            alt="imagem"
                            className="aspect-square object-cover w-full"
                          />
                          <div className="absolute top-2 left-2 bg-white/90 rounded-lg px-2 py-1 text-xs flex items-center gap-1">
                            {img.principal ? (
                              <>
                                <FiStar className="text-yellow-500" /> Principal
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => definirComoPrincipal(img.id)}
                                className="flex items-center gap-1 hover:text-blue-600 transition"
                              >
                                <FiStar /> Definir
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <textarea
                  name="descricao"
                  value={produtoEditando.descricao}
                  onChange={handleEditChange}
                  placeholder="Descrição"
                  rows={3}
                  className="w-full p-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none mb-4"
                />

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={cancelarEdicao}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition transform hover:scale-105 shadow-lg"
                  >
                    <FiXCircle /> Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition transform hover:scale-105 shadow-lg"
                  >
                    <FiSave /> Salvar
                  </button>
                </div>
              </form>
            ) : (
              <div
                key={produto.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    <img
                      src={produto.imagem || "https://via.placeholder.com/200"}
                      alt={produto.nome}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-green-600">
                      {produto.quantidade > 0
                        ? `${produto.quantidade} un.`
                        : "Esgotado"}
                    </div>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">
                          {produto.nome}
                        </h3>
                        <p className="text-sm text-gray-500 italic">
                          {produto.categoria || "Sem categoria"} •{" "}
                          {produto.marca || "Sem marca"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          R${" "}
                          {parseFloat(produto.preco || 0)
                            .toFixed(2)
                            .replace(".", ",")}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {produto.descricao || "Sem descrição"}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => iniciarEdicao(produto)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition transform hover:scale-105"
                      >
                        <FiEdit /> Editar
                      </button>
                      <button
                        onClick={() => excluirProduto(produto.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition transform hover:scale-105"
                      >
                        <FiTrash2 /> Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

function EditarLoja() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [form, setForm] = useState({
    nome: "",
    endereco: "",
    logoUrl: "",
    descricao: "",
  });
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/commerces/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({
          nome: data.nome,
          endereco: data.endereco,
          logoUrl: data.logoUrl,
          descricao: data.descricao,
        });
      } catch (err) {
        console.error("Erro ao carregar dados da loja:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/commerces/me",
        {
          nome: form.nome,
          endereco: form.endereco,
          logoUrl: form.logoUrl,
          descricao: form.descricao,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensagem("✅ Loja atualizada com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar alterações:", err);
      setErro("❌ Erro ao salvar. Tente novamente.");
    }
  };

  const handleChangePassword = async () => {
    if (!senhaAtual || !novaSenha) {
      setErro("❌ Preencha ambos os campos de senha.");
      return;
    }
    setMensagem("");
    setErro("");

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/auth/change-password",
        { senhaAtual, novaSenha },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensagem("✅ Senha alterada com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
    } catch (err) {
      console.error("Erro ao alterar senha:", err);
      setErro(
        err.response?.data?.message ||
          "❌ Erro ao alterar senha. Tente novamente."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
          Editar Loja
        </h2>
        <p className="text-gray-600">Atualize as informações da sua loja</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiShoppingBag className="text-orange-600" />
            Informações da Loja
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModernInput
              label="Nome da Loja"
              icon={<FiShoppingBag />}
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Nome da Loja"
            />
            <ModernInput
              label="Endereço"
              icon={<FiPackage />}
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
              placeholder="Rua, Número, Cidade"
            />
          </div>
          <div className="mt-6">
            <ModernInput
              label="URL da Logo"
              icon={<FiCamera />}
              name="logoUrl"
              value={form.logoUrl}
              onChange={handleChange}
              placeholder="https://exemplo.com/logo.png"
            />
          </div>
          <div className="mt-6 space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FiEdit className="text-orange-600" />
              Descrição da Loja
            </label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Conte aos clientes sobre sua loja..."
              rows={4}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
          >
            <FiSave className="w-5 h-5" />
            Salvar Alterações
          </button>
        </div>
      </form>

      {/* Alterar Senha */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FiEdit className="text-purple-600" />
          Alterar Senha
        </h3>
        <div className="space-y-4">
          <ModernInput
            label="Senha Atual"
            icon={<FiEdit />}
            type="password"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            placeholder="Digite sua senha atual"
          />
          <ModernInput
            label="Nova Senha"
            icon={<FiEdit />}
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            placeholder="Digite a nova senha"
          />
          <button
            type="button"
            onClick={handleChangePassword}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3"
          >
            <FiCheckCircle className="w-5 h-5" />
            Alterar Senha
          </button>
        </div>
      </div>

      {/* Mensagens */}
      {mensagem && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg animate-fadeIn flex items-center gap-3">
          <FiCheckCircle className="w-6 h-6" />
          <span className="font-medium">{mensagem}</span>
        </div>
      )}
      {erro && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg animate-fadeIn flex items-center gap-3">
          <FiAlertCircle className="w-6 h-6" />
          <span className="font-medium">{erro}</span>
        </div>
      )}
    </div>
  );
}

function BatePapo() {
  // Estado clientes e mensagens
  const [clientes, setClientes] = useState([]); // virá da API
  const [chatId, setChatId] = useState(null); // id do chat selecionado

  const [clienteSelecionado, setClienteSelecionado] = useState(clientes[0]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [imagemParaEnviar, setImagemParaEnviar] = useState(null);
  const [gravando, setGravando] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Função para buscar mensagens de um chat
  async function fetchMensagens(id) {
    try {
      const res = await axios.get(`/api/chats/${id}/mensagens`);
      return res.data;
    } catch (err) {
      console.error("Erro ao buscar mensagens:", err);
      return [];
    }
  }

  useEffect(() => {
    async function loadChats() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) throw new Error("Usuário não encontrado");
        const lojaId = user.id;

        // 1) pega lista de clientes que já conversaram (sem chat.id):
        const res = await axios.get("/api/chats", { params: { lojaId } });
        const summaries = res.data; // cada { cliente_id, cliente_nome, … }

        // 2) para cada summary, chama getOrCreateChat para obter o chat real:
        const chats = await Promise.all(
          summaries.map(async (s) => {
            // retorna { id, cliente_id, loja_id } do chat
            const chatRes = await axios.get("/api/chats", {
              params: { clienteId: s.cliente_id, lojaId },
            });
            const chatId = chatRes.data.id;

            // 3) busca mensagens usando o chat real
            const msgsRes = await axios.get(`/api/chats/${chatId}/mensagens`);

            return {
              id: chatId,
              nome: s.cliente_nome,
              mensagens: msgsRes.data,
            };
          })
        );

        setClientes(chats);
        if (chats.length) {
          setClienteSelecionado(chats[0]);
          setChatId(chats[0].id);
        }
      } catch (err) {
        console.error("Erro ao carregar chats:", err);
      }
    }
    loadChats();
  }, []);

  // Atualizar cliente selecionado no array clientes
  function atualizarClienteAtualizado(clienteAtualizado) {
    setClientes((prev) =>
      prev.map((c) => (c.id === clienteAtualizado.id ? clienteAtualizado : c))
    );
    setClienteSelecionado(clienteAtualizado);
  }

  // Enviar mensagem texto
  async function enviarMensagemTexto(e) {
    e.preventDefault();
    if (!novaMensagem.trim() || !chatId) return;
    const payload = {
      remetente: "loja",
      tipo: "texto",
      conteudo: novaMensagem.trim(),
    };
    try {
      await axios.post(`/api/chats/${chatId}/mensagens`, payload);
      // refaz o fetch das mensagens
      const res = await axios.get(`/api/chats/${chatId}/mensagens`);
      atualizarClienteAtualizado({
        ...clienteSelecionado,
        mensagens: res.data,
      });
      setNovaMensagem("");
    } catch (err) {
      console.error("Erro ao enviar texto:", err);
    }
  }

  // Enviar imagem
  async function enviarImagem(e) {
    const file = e.target.files[0];
    if (!file || !chatId) return;

    try {
      // 1. Envia a imagem para o servidor
      const formData = new FormData();
      formData.append("imagem", file);

      const uploadRes = await axios.post(
        "/api/upload/image/imagem", // endpoint que criamos
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const caminho = uploadRes.data.caminho; // exemplo: "/uploads/imagens/img_123.png"

      // 2. Envia a mensagem com o caminho da imagem
      const payload = {
        remetente: "loja",
        tipo: "imagem",
        conteudo: caminho,
      };

      await axios.post(`/api/chats/${chatId}/mensagens`, payload);

      // 3. Atualiza a lista de mensagens
      const res = await axios.get(`/api/chats/${chatId}/mensagens`);
      atualizarClienteAtualizado({
        ...clienteSelecionado,
        mensagens: res.data,
      });
    } catch (err) {
      console.error("Erro ao enviar imagem:", err);
    }

    // Limpa input
    e.target.value = null;
  }

  // Gravação áudio
  async function iniciarGravacao() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Seu navegador não suporta gravação de áudio.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        chunksRef.current = [];
        const url = URL.createObjectURL(blob);
        const payload = { remetente: "loja", tipo: "audio", conteudo: url };
        await axios.post(`/api/chats/${chatId}/mensagens`, payload);
        const res = await axios.get(`/api/chats/${chatId}/mensagens`);
        atualizarClienteAtualizado({
          ...clienteSelecionado,
          mensagens: res.data,
        });
        setGravando(false);
      };
      mediaRecorderRef.current.start();
      setGravando(true);
    } catch (err) {
      alert("Erro ao acessar microfone.");
    }
  }

  function pararGravacao() {
    if (mediaRecorderRef.current && gravando) {
      mediaRecorderRef.current.stop();
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[600px]">
      {/* Lista clientes */}
      <div className="md:w-1/3 bg-gray-100 rounded-lg p-4 overflow-y-auto shadow">
        <h2 className="text-xl font-semibold mb-4">Clientes</h2>
        {clientes
          .filter((cliente) => cliente && cliente.id) // <- filtro de segurança
          .map((cliente) => (
            <button
              key={cliente.id}
              onClick={async () => {
                // recupera aqui mesmo o user do localStorage
                const user = JSON.parse(localStorage.getItem("user"));
                const lojaId = user.id;

                // obtem (ou cria) o chat correto
                const chatRes = await axios.get("/api/chats", {
                  params: { clienteId: cliente.id, lojaId },
                });
                const chatId = chatRes.data.id;
                setChatId(chatId);

                // busca as mensagens
                const msgsRes = await axios.get(
                  `/api/chats/${chatId}/mensagens`
                );
                atualizarClienteAtualizado({
                  ...cliente,
                  id: chatId,
                  mensagens: msgsRes.data,
                });
              }}
              className={`w-full text-left px-4 py-2 rounded mb-2 transition ${
                clienteSelecionado?.id === cliente.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-100"
              }`}
            >
              {cliente.nome}
            </button>
          ))}
      </div>

      {/* Conversa */}
      <div className="md:w-2/3 bg-gray-50 rounded-lg flex flex-col p-4 shadow">
        <h2 className="text-xl font-semibold mb-4">
          Conversa com {clienteSelecionado?.nome}
        </h2>
        <div
          className="flex-1 overflow-y-auto mb-4 flex flex-col gap-2 px-2"
          style={{ scrollbarWidth: "thin" }}
        >
          {clienteSelecionado?.mensagens.map((msg, index) => {
            // 1) quem é o cliente?
            const isCliente = msg.remetente === "cliente";

            // 2) prepara a url de mídia (imagem ou áudio)
            let mediaSrc = msg.conteudo;
            if (msg.tipo === "audio" && !mediaSrc.startsWith("blob:")) {
              // se o backend guardou apenas o filename em conteudo,
              // monte a URL completa. Se já for "/uploads/...",
              // use diretamente:
              mediaSrc = mediaSrc.startsWith("/")
                ? `${window.location.origin}${mediaSrc}`
                : `${window.location.origin}/uploads/audios/${mediaSrc}`;
            }

            return (
              <div
                key={msg.id ?? `${msg.tipo}-${index}`}
                className={`max-w-[75%] p-3 rounded-lg whitespace-pre-wrap break-words flex flex-col ${
                  isCliente
                    ? "bg-green-200 self-start"
                    : "bg-blue-500 text-white self-end"
                }`}
                style={{ alignSelf: isCliente ? "flex-start" : "flex-end" }}
              >
                {/* Texto (sempre usa msg.conteudo) */}
                {msg.tipo === "texto" && <span>{msg.conteudo}</span>}

                {/* Imagem */}
                {msg.tipo === "imagem" && (
                  <img
                    src={
                      msg.conteudo.startsWith("http")
                        ? msg.conteudo
                        : `${window.location.origin}${msg.conteudo}`
                    }
                  />
                )}

                {/* Áudio */}
                {msg.tipo === "audio" && (
                  <audio controls src={mediaSrc} className="max-w-xs rounded" />
                )}
              </div>
            );
          })}
        </div>

        {/* Formulario para enviar */}
        <form onSubmit={enviarMensagemTexto} className="flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              disabled={!novaMensagem.trim()}
              className={`p-3 rounded bg-blue-600 text-white flex items-center justify-center transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <FiSend size={20} />
            </button>
          </div>

          <div className="flex gap-4 items-center">
            {/* Upload imagem */}
            <label
              htmlFor="input-file"
              className="cursor-pointer p-2 bg-gray-200 rounded hover:bg-gray-300 transition flex items-center gap-1"
              title="Enviar foto"
            >
              <FiCamera size={20} />
              <input
                id="input-file"
                type="file"
                accept="image/*"
                onChange={enviarImagem}
                className="hidden"
              />
            </label>

            {/* Botão gravar áudio */}
            {!gravando ? (
              <button
                type="button"
                onClick={iniciarGravacao}
                className="p-2 bg-red-500 rounded hover:bg-red-600 transition flex items-center gap-1 text-white"
                title="Gravar áudio"
              >
                <FiMic size={20} />
                Gravar
              </button>
            ) : (
              <button
                type="button"
                onClick={pararGravacao}
                className="p-2 bg-gray-700 rounded hover:bg-gray-800 transition flex items-center gap-1 text-white"
                title="Parar gravação"
              >
                <FiX size={20} />
                Parar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function AnimatedInput({
  placeholder,
  type = "text",
  name,
  value,
  onChange,
  required,
}) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="p-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 placeholder:text-gray-400"
    />
  );
}

function AnimatedTextarea({ placeholder, name, value, onChange }) {
  return (
    <textarea
      name={name}
      rows={4}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="p-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 placeholder:text-gray-400 resize-none"
    />
  );
}
