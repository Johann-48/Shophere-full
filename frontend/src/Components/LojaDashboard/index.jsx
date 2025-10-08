import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
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
} from "react-icons/fi";

export default function LojaDashboard() {
  const [abaSelecionada, setAbaSelecionada] = useState("adicionarproduto");
  const [logoUrl, setLogoUrl] = useState(""); // ← estado para a logo
  const [nomeLoja, setNomeLoja] = useState(""); // ← opcional, caso queira mostrar o nome

  // Busca logo e nome da loja quando o componente monta
  useEffect(() => {
    const fetchLoja = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/commerces/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogoUrl(data.logoUrl); // campo retornado pelo backend
        setNomeLoja(data.nome);
      } catch (err) {
        console.error("Erro ao carregar dados da loja:", err);
      }
    };
    fetchLoja();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center transition-all duration-500 bg-gradient-to-br from-green-100 via-white to-green-50 p-16 px-6">
      {/* Logo da Loja */}
      <div className="w-full max-w-4xl relative flex items-center justify-center mb-6">
        <div className="relative group">
          <img
            src={
              logoUrl
                ? logoUrl.startsWith("http")
                  ? logoUrl
                  : `http://localhost:4000/uploads/${logoUrl}`
                : "https://via.placeholder.com/240?text=Sem+Logo"
            }
            alt={nomeLoja || "Logo da Loja"}
            className="rounded-2xl w-60 h-60 object-contain bg-white p-4 shadow-xl transition-transform duration-300 group-hover:scale-105"
          />
          <button className="absolute bottom-2 right-2 p-2 bg-white/80 rounded-full shadow hover:scale-110 transition">
            <FiCamera className="text-zinc-700" />
          </button>
        </div>
      </div>

      {/* Título */}
      <h1 className="text-4xl font-extrabold mb-4 text-zinc-800 text-center tracking-tight">
        Painel da Loja {nomeLoja && `- ${nomeLoja}`}
      </h1>

      {/* Abas com animação */}
      <div className="flex justify-center mb-6 gap-3 flex-wrap">
        <AbaBotao
          ativa={abaSelecionada === "adicionarproduto"}
          onClick={() => setAbaSelecionada("adicionarproduto")}
          icon={<FiPlusCircle />}
          texto="Adicionar Produto"
        />
        <AbaBotao
          ativa={abaSelecionada === "meusprodutos"}
          onClick={() => setAbaSelecionada("meusprodutos")}
          icon={<FiEdit />}
          texto="Meus Produtos"
        />
        <AbaBotao
          ativa={abaSelecionada === "editarloja"}
          onClick={() => setAbaSelecionada("editarloja")}
          icon={<FiEdit />}
          texto="Editar Loja"
        />
        <AbaBotao
          ativa={abaSelecionada === "batepapo"}
          onClick={() => setAbaSelecionada("batepapo")}
          icon={<FiMessageSquare />}
          texto="Bate-papo"
        />
      </div>

      {/* Conteúdo da aba */}
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-xl transition-all duration-300 animate-fade-in">
        {abaSelecionada === "adicionarproduto" && <AdicionarProduto />}
        {abaSelecionada === "meusprodutos" && <MeusProdutos />}
        {abaSelecionada === "editarloja" && <EditarLoja />}
        {abaSelecionada === "batepapo" && <BatePapo />}
      </div>
    </div>
  );
}

function AbaBotao({ ativa, onClick, icon, texto }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-300 shadow-sm transform hover:scale-105 ${
        ativa
          ? "bg-blue-600 text-white border-blue-600 shadow-md"
          : "bg-white text-zinc-700 border-zinc-300"
      }`}
    >
      {icon} {texto}
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
  const [foto, setFoto] = useState(null);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // carrega opções de categoria ao montar
    axios
      .get("/api/categories")
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error("Erro ao buscar categorias:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    const token = localStorage.getItem("token");

    try {
      // 1) Cria o produto
      const res = await axios.post(
        "http://localhost:4000/api/products",
        {
          nome,
          preco,
          categoria_id: categoria, // envia o ID, não o nome
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
      const produtoId = res.data.id; // ajuste conforme seu backend

      // 2) Se veio foto, envia pelo endpoint de upload
      if (foto) {
        const formData = new FormData();
        formData.append("foto", foto);

        await axios.post(
          `http://localhost:4000/api/upload/${produtoId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      setMensagem("Produto cadastrado com sucesso!");
      // limpa campos...
      setNome("");
      setPreco("");
      setCategoria("");
      setDescricao("");
      setMarca("");
      setQuantidade("");
      setCodigoBarras("");
      setFoto(null);
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao cadastrar produto.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <h2 className="text-2xl font-semibold mb-1 text-zinc-800">
        Novo Produto
      </h2>

      <AnimatedInput
        placeholder="Nome do Produto"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <AnimatedInput
        placeholder="Preço"
        type="number"
        value={preco}
        onChange={(e) => setPreco(e.target.value)}
        required
      />
      <label className="flex flex-col">
        Categoria
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
          className="p-2 border rounded"
        >
          <option value="" disabled>
            — Selecione —
          </option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nome}
            </option>
          ))}
        </select>
      </label>
      <AnimatedTextarea
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />

      {/* NOVOS CAMPOS */}
      <AnimatedInput
        placeholder="Marca"
        value={marca}
        onChange={(e) => setMarca(e.target.value)}
      />
      <AnimatedInput
        placeholder="Quantidade"
        type="number"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
      />
      <AnimatedInput
        placeholder="Código de Barras"
        value={codigoBarras}
        onChange={(e) => setCodigoBarras(e.target.value)}
      />
      <label className="flex flex-col">
        Foto do Produto
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFoto(e.target.files[0])}
          className="mt-1"
        />
      </label>

      <button
        type="submit"
        className="bg-blue-600 text-white py-3 font-medium rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
      >
        Adicionar Produto
      </button>

      {mensagem && (
        <p className="text-sm text-center font-medium text-zinc-700">
          {mensagem}
        </p>
      )}
    </form>
  );
}

function MeusProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [produtoEditandoId, setProdutoEditandoId] = useState(null);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [categorias, setCategorias] = useState([]);

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
      }
    };
    fetchProdutos();
  }, []);

  function iniciarEdicao(produto) {
    setProdutoEditandoId(produto.id);
    setProdutoEditando({
      ...produto,
      categoria_id: produto.categoria_id || "", // ensure the field exists
    });
  }

  function cancelarEdicao() {
    setProdutoEditandoId(null);
    setProdutoEditando(null);
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
      cancelarEdicao();
    } catch (err) {
      console.error("Erro ao salvar edição:", err);
      alert("Erro ao salvar edição.");
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
      } catch (err) {
        console.error("Erro ao excluir produto:", err);
        alert("Erro ao excluir produto.");
      }
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-zinc-800">
        Meus Produtos
      </h2>

      {produtos.length === 0 && (
        <p className="text-zinc-500">Nenhum produto cadastrado ainda.</p>
      )}

      <div className="grid gap-6">
        {produtos.map((produto) =>
          produtoEditandoId === produto.id ? (
            <form
              key={produto.id}
              onSubmit={salvarEdicao}
              className="bg-gray-50 rounded-lg p-5 shadow-md flex flex-col gap-4 transition-shadow hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    produtoEditando.imagem || "https://via.placeholder.com/100"
                  }
                  alt={produtoEditando.nome}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    name="nome"
                    value={produtoEditando.nome}
                    onChange={handleEditChange}
                    placeholder="Nome do Produto"
                    required
                  />
                  <input
                    className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    name="preco"
                    type="number"
                    step="0.01"
                    min="0"
                    value={produtoEditando.preco}
                    onChange={handleEditChange}
                    placeholder="Preço"
                    required
                  />
                  <label className="flex flex-col">
                    Categoria
                    <select
                      name="categoria_id"
                      value={produtoEditando.categoria_id || ""}
                      onChange={handleEditChange}
                      required
                      className="p-2 border rounded"
                    >
                      <option value="" disabled>
                        — Selecione —
                      </option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nome}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col">
                    Imagem do produto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const form = new FormData();
                        form.append("foto", file);
                        try {
                          const token = localStorage.getItem("token");
                          // supondo que sua rota de upload seja POST /api/upload/:produtoId
                          const resp = await axios.post(
                            `/api/upload/${produtoEditando.id}`,
                            form,
                            {
                              headers: {
                                "Content-Type": "multipart/form-data",
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          );
                          // resp.data.url → nova URL da imagem
                          setProdutoEditando((prev) => ({
                            ...prev,
                            imagem: resp.data.url,
                          }));
                        } catch (err) {
                          console.error("Erro no upload da imagem:", err);
                          alert("Falha ao enviar imagem");
                        }
                      }}
                      className="mt-1"
                    />
                  </label>

                  <input
                    name="marca"
                    value={produtoEditando.marca || ""}
                    onChange={handleEditChange}
                    placeholder="Marca"
                  />
                  <input
                    name="quantidade"
                    type="number"
                    min="0"
                    value={produtoEditando.quantidade || ""}
                    onChange={handleEditChange}
                    placeholder="Quantidade"
                  />
                  <input
                    name="codigoBarras"
                    value={produtoEditando.codigoBarras || ""}
                    onChange={handleEditChange}
                    placeholder="Código de Barras"
                  />
                </div>
              </div>
              <textarea
                name="descricao"
                value={produtoEditando.descricao}
                onChange={handleEditChange}
                placeholder="Descrição"
                rows={3}
                className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={cancelarEdicao}
                  className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  <FiXCircle /> Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  <FiSave /> Salvar
                </button>
              </div>
            </form>
          ) : (
            <div
              key={produto.id}
              className="bg-gray-50 rounded-lg p-5 shadow-md flex items-center gap-6 transition-shadow hover:shadow-lg"
            >
              <img
                src={produto.imagem || "https://via.placeholder.com/100"}
                alt={produto.nome}
                className="w-24 h-24 object-cover rounded-lg border border-gray-300"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{produto.nome}</h3>
                <p className="text-blue-600 font-bold text-lg">
                  R$ {produto.preco.toFixed(2).replace(".", ",")}
                </p>
                <p className="text-sm text-zinc-600 italic">
                  {produto.categoria || "Sem categoria"}
                </p>
                <p className="mt-2 text-zinc-700">{produto.descricao}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => iniciarEdicao(produto)}
                  className="flex items-center gap-1 px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  title="Editar Produto"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() => excluirProduto(produto.id)}
                  className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  title="Excluir Produto"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          )
        )}
      </div>
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

  // 1) buscar dados ao montar
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

  // 2) handler genérico de inputs
  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  // 3) enviar PUT
  const handleSubmit = async (e) => {
    e.preventDefault();
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
      alert("Loja atualizada com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar alterações:", err);
      alert("Erro ao salvar. Tente novamente.");
    }
  };

  const handleChangePassword = async () => {
    if (!senhaAtual || !novaSenha) {
      alert("Preencha ambos os campos de senha.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/auth/change-password",
        { senhaAtual, novaSenha },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Senha alterada com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
    } catch (err) {
      console.error("Erro ao alterar senha:", err);
      alert(
        err.response?.data?.message || "Erro ao alterar senha. Tente novamente."
      );
    }
  };

  if (loading) return <p>Carregando dados...</p>;

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-semibold mb-1 text-zinc-800">
        Editar Informações da Loja
      </h2>

      <AnimatedInput
        name="nome"
        value={form.nome}
        onChange={handleChange}
        placeholder="Nome da Loja"
      />
      <AnimatedInput
        name="endereco"
        value={form.endereco}
        onChange={handleChange}
        placeholder="Endereço"
      />
      <AnimatedInput
        name="logoUrl"
        value={form.logoUrl}
        onChange={handleChange}
        placeholder="Link da Logo"
      />
      <AnimatedTextarea
        name="descricao"
        value={form.descricao}
        onChange={handleChange}
        placeholder="Descrição da Loja"
      />

      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-semibold text-zinc-800 mb-3">
          Alterar Senha
        </h3>

        <AnimatedInput
          type="password"
          name="senhaAtual"
          value={senhaAtual}
          onChange={(e) => setSenhaAtual(e.target.value)}
          placeholder="Senha Atual"
        />
        <AnimatedInput
          type="password"
          name="novaSenha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          placeholder="Nova Senha"
        />

        <button
          type="button"
          onClick={handleChangePassword}
          className="bg-blue-600 text-white py-3 mt-2 font-medium rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
        >
          Alterar Senha
        </button>
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white py-3 font-medium rounded-lg hover:bg-green-700 transition shadow-md hover:shadow-lg"
      >
        Salvar Alterações
      </button>
    </form>
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
                ? `http://localhost:4000${mediaSrc}`
                : `http://localhost:4000/uploads/audios/${mediaSrc}`;
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
                        : `http://localhost:4000${msg.conteudo}`
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
