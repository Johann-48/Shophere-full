import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiSend, FiCamera, FiMic, FiX } from "react-icons/fi";
import {
  fetchUserChats,
  fetchStoreById,
  startChat as startChatService,
  fetchMessages as fetchMessagesService,
  sendMessage as sendMessageService,
  uploadChatImage,
  uploadChatAudio,
} from "../../services/chatService";
import { useTheme } from "../../contexts/ThemeContext";
import { resolveMediaUrl, fallbackOnError } from "../../utils/media";

const sanitizeQueryValue = (raw) => {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed === "undefined" || trimmed === "null") return null;
  return trimmed;
};

const decodeQueryMessage = (raw) => {
  const sanitized = sanitizeQueryValue(raw);
  if (!sanitized) return null;
  try {
    return decodeURIComponent(sanitized);
  } catch (err) {
    return sanitized;
  }
};

const PLACEHOLDER_TEXT = "Selecione uma loja para iniciar a conversa.";

export default function ContatoLoja() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [clienteId, setClienteId] = useState(null);
  const [lojas, setLojas] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messagesByChat, setMessagesByChat] = useState({});
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [erro, setErro] = useState(null);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [gravando, setGravando] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const chatRef = useRef(null);
  const presetMessageRef = useRef(null);

  const selectedStore = useMemo(
    () => lojas.find((loja) => loja.id === selectedStoreId) || null,
    [lojas, selectedStoreId]
  );

  const currentMessages = useMemo(
    () => (chatId ? messagesByChat[chatId] || [] : []),
    [chatId, messagesByChat]
  );

  const clearPresetParams = useCallback(() => {
    const params = new URLSearchParams(location.search);
    let modified = false;
    if (params.has("message")) {
      params.delete("message");
      modified = true;
    }
    if (params.has("productId")) {
      params.delete("productId");
      modified = true;
    }
    if (!modified) return;

    const newQuery = params.toString();
    const target = newQuery
      ? `${location.pathname}?${newQuery}`
      : location.pathname;
    navigate(target, { replace: true });
  }, [location.pathname, location.search, navigate]);

  const carregarChatsDoUsuario = useCallback(async (usuarioId, lojaParamId) => {
    setLoadingChats(true);
    setErro(null);
    try {
      const chats = await fetchUserChats(usuarioId);
      const lojasMapeadas = chats.map((chat) => ({
        id: chat.loja_id,
        nome: chat.loja_nome,
        imagem: resolveMediaUrl(chat.loja_foto),
        chatId: chat.id,
      }));

      let lista = lojasMapeadas;

      if (
        lojaParamId &&
        !lista.some((loja) => String(loja.id) === lojaParamId)
      ) {
        try {
          const comercio = await fetchStoreById(lojaParamId);
          if (comercio?.id) {
            lista = [
              {
                id: comercio.id,
                nome: comercio.nome,
                imagem: resolveMediaUrl(comercio.foto),
                chatId: null,
              },
              ...lista,
            ];
          }
        } catch (error) {
          console.error("Não foi possível carregar a loja solicitada:", error);
        }
      }

      const unicos = Array.from(
        new Map(lista.map((loja) => [String(loja.id), loja])).values()
      );
      setLojas(unicos);

      const primeiraLoja = lojaParamId
        ? unicos.find((loja) => String(loja.id) === lojaParamId)?.id
        : unicos[0]?.id;

      setSelectedStoreId(primeiraLoja ?? null);
    } catch (error) {
      console.error("Erro ao listar chats do usuário:", error);
      setErro(
        "Não foi possível carregar suas conversas. Tente novamente mais tarde."
      );
      setLojas([]);
      setSelectedStoreId(null);
    } finally {
      setLoadingChats(false);
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const usuarioId = user?.id || null;
    setClienteId(usuarioId);

    const params = new URLSearchParams(location.search);
    const lojaParamId = sanitizeQueryValue(params.get("lojaId"));
    const presetMessage = decodeQueryMessage(params.get("message"));
    presetMessageRef.current = presetMessage;

    if (!usuarioId) {
      setErro("Entre na sua conta para conversar com uma loja.");
      setLoadingChats(false);
      return;
    }

    carregarChatsDoUsuario(usuarioId, lojaParamId);
  }, [location.search, carregarChatsDoUsuario]);

  useEffect(() => {
    if (!chatRef.current) return;
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [currentMessages]);

  useEffect(() => {
    let cancelado = false;
    const garantirChatAtivo = async () => {
      if (!clienteId || !selectedStore) return;

      setLoadingMessages(true);
      try {
        let chatEmUso = selectedStore.chatId;
        let deveLimparPreset = false;

        if (!chatEmUso) {
          const resposta = await startChatService({
            clienteId,
            lojaId: selectedStore.id,
            initialMessage: presetMessageRef.current || undefined,
          });

          const chatCriado = resposta.chat || resposta;
          chatEmUso = chatCriado?.id || null;

          if (!chatEmUso) {
            throw new Error("Chat não pôde ser criado.");
          }

          setLojas((prev) =>
            prev.map((loja) =>
              loja.id === selectedStore.id
                ? { ...loja, chatId: chatEmUso }
                : loja
            )
          );

          if (presetMessageRef.current) {
            deveLimparPreset = true;
            presetMessageRef.current = null;
          }
        } else if (presetMessageRef.current) {
          const mensagemAutomatica = presetMessageRef.current;
          presetMessageRef.current = null;
          try {
            const novaMensagemAutomatica = await sendMessageService(chatEmUso, {
              remetente: "cliente",
              tipo: "texto",
              conteudo: mensagemAutomatica,
            });
            setMessagesByChat((prev) => ({
              ...prev,
              [chatEmUso]: [...(prev[chatEmUso] || []), novaMensagemAutomatica],
            }));
            deveLimparPreset = true;
          } catch (error) {
            console.error("Erro ao enviar mensagem automática:", error);
          }
        }

        setChatId(chatEmUso);

        try {
          const mensagens = await fetchMessagesService(chatEmUso);
          if (!cancelado) {
            setMessagesByChat((prev) => ({ ...prev, [chatEmUso]: mensagens }));
          }
        } catch (error) {
          console.error("Erro ao buscar mensagens:", error);
          if (!cancelado) {
            setErro("Não foi possível carregar as mensagens.");
          }
        }

        if (deveLimparPreset) {
          clearPresetParams();
        }
      } catch (error) {
        if (!cancelado) {
          console.error("Erro ao garantir chat ativo:", error);
          setErro("Não foi possível abrir a conversa. Tente novamente.");
        }
      } finally {
        if (!cancelado) {
          setLoadingMessages(false);
        }
      }
    };

    garantirChatAtivo();

    return () => {
      cancelado = true;
    };
  }, [clienteId, selectedStore, clearPresetParams]);

  const handleSelectStore = (lojaId) => {
    setSelectedStoreId(lojaId);
    setNovaMensagem("");
    setErro(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!chatId || !novaMensagem.trim()) return;

    const payload = {
      remetente: "cliente",
      tipo: "texto",
      conteudo: novaMensagem.trim(),
    };

    try {
      const novaMsg = await sendMessageService(chatId, payload);
      setMessagesByChat((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), novaMsg],
      }));
      setNovaMensagem("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setErro("Não foi possível enviar sua mensagem.");
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !chatId) return;

    try {
      const upload = await uploadChatImage(file);
      const caminho = resolveMediaUrl(upload?.caminho);
      const novaMsg = await sendMessageService(chatId, {
        remetente: "cliente",
        tipo: "imagem",
        conteudo: caminho,
      });
      setMessagesByChat((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), novaMsg],
      }));
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
      setErro("Não foi possível enviar a imagem.");
    }
  };

  const iniciarGravacao = async () => {
    if (!chatId) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        try {
          recorder.stream.getTracks().forEach((track) => track.stop());
        } catch (error) {
          console.warn(
            "Não foi possível finalizar todas as tracks do stream.",
            error
          );
        }

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        chunksRef.current = [];

        if (!blob.size) {
          setGravando(false);
          return;
        }

        try {
          const upload = await uploadChatAudio(blob);
          const caminho = resolveMediaUrl(upload?.caminho);
          const novaMsg = await sendMessageService(chatId, {
            remetente: "cliente",
            tipo: "audio",
            conteudo: caminho,
          });
          setMessagesByChat((prev) => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), novaMsg],
          }));
        } catch (error) {
          console.error("Erro ao enviar áudio:", error);
          setErro("Não foi possível enviar o áudio gravado.");
        } finally {
          setGravando(false);
        }
      };

      recorder.start();
      setGravando(true);
    } catch (error) {
      console.error("Erro ao acessar microfone:", error);
      alert(
        "Não foi possível acessar o microfone. Verifique as permissões do navegador."
      );
    }
  };

  const pararGravacao = () => {
    if (mediaRecorderRef.current && gravando) {
      try {
        mediaRecorderRef.current.stop();
      } catch (error) {
        console.error("Erro ao finalizar gravação:", error);
        setGravando(false);
      }
    }
  };

  const mensagensAtuais = currentMessages;
  const gradientBg = isDarkMode
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    : "bg-gradient-to-br from-green-100 via-white to-green-50";
  const containerBg = isDarkMode ? "bg-gray-900" : "bg-white";
  const sidebarBg = isDarkMode ? "bg-gray-800" : "bg-white";
  const textColor = isDarkMode ? "text-gray-50" : "text-gray-900";

  return (
    <div className={`min-h-screen ${gradientBg} py-10`}>
      <div
        className={`flex h-[640px] max-w-6xl mx-auto ${containerBg} shadow-xl rounded-lg overflow-hidden`}
      >
        <aside
          className={`w-64 ${sidebarBg} border-r ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          } p-4 overflow-y-auto`}
        >
          <h2 className={`text-lg font-semibold mb-3 ${textColor}`}>
            Minhas conversas
          </h2>

          {loadingChats ? (
            <p className="text-sm text-gray-500">Carregando lojas…</p>
          ) : lojas.length === 0 ? (
            <p className="text-sm text-gray-500">
              Nenhuma conversa encontrada.
            </p>
          ) : (
            <ul className="space-y-3">
              {lojas.map((loja) => {
                const ativa = loja.id === selectedStoreId;
                const baseStyles = ativa
                  ? isDarkMode
                    ? "bg-blue-900/70 text-blue-200"
                    : "bg-blue-100 text-blue-700"
                  : isDarkMode
                  ? "hover:bg-gray-700 text-gray-200"
                  : "hover:bg-gray-100 text-gray-700";

                return (
                  <li
                    key={loja.id}
                    onClick={() => handleSelectStore(loja.id)}
                    className={`flex items-center gap-3 p-2 rounded cursor-pointer transition ${baseStyles}`}
                  >
                    <img
                      src={resolveMediaUrl(loja.imagem)}
                      alt={loja.nome}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      onError={fallbackOnError}
                    />
                    <span className="text-sm font-medium line-clamp-2">
                      {loja.nome}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        <section className="flex-1 flex flex-col p-4">
          {erro && (
            <div
              className={`mb-4 text-sm rounded-md px-3 py-2 ${
                isDarkMode
                  ? "bg-red-900/60 text-red-200 border border-red-700"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {erro}
            </div>
          )}

          {!selectedStore ? (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
              {loadingChats ? "Carregando…" : PLACEHOLDER_TEXT}
            </div>
          ) : (
            <>
              <header className="flex items-center gap-3 mb-3">
                <img
                  src={resolveMediaUrl(selectedStore.imagem)}
                  alt={selectedStore.nome}
                  className="w-12 h-12 rounded-full object-cover border"
                  onError={fallbackOnError}
                />
                <div>
                  <h2
                    className={`text-xl font-semibold ${
                      isDarkMode ? "text-blue-300" : "text-blue-700"
                    }`}
                  >
                    {selectedStore.nome}
                  </h2>
                  {loadingMessages && (
                    <p className="text-xs text-gray-400">
                      Atualizando mensagens…
                    </p>
                  )}
                </div>
              </header>

              <div
                ref={chatRef}
                className={`flex-1 overflow-y-auto space-y-4 p-4 rounded ${
                  isDarkMode ? "bg-gray-800/70" : "bg-gray-50"
                }`}
              >
                {mensagensAtuais.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Nenhuma mensagem por aqui ainda.
                  </p>
                ) : (
                  mensagensAtuais.map((msg) => {
                    const isCliente = msg.remetente === "cliente";
                    const key = msg.id || `${msg.remetente}-${msg.criado_em}`;
                    const bubbleStyles = isCliente
                      ? isDarkMode
                        ? "bg-green-700 text-green-100 rounded-bl-none"
                        : "bg-green-100 text-green-900 rounded-bl-none"
                      : isDarkMode
                      ? "bg-blue-700 text-blue-50 rounded-br-none"
                      : "bg-blue-600 text-white rounded-br-none";

                    return (
                      <div
                        key={key}
                        className={`flex ${
                          isCliente ? "justify-start" : "justify-end"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] p-3 rounded-xl shadow ${bubbleStyles}`}
                        >
                          {msg.tipo === "texto" && <span>{msg.conteudo}</span>}
                          {msg.tipo === "imagem" && (
                            <img
                              src={resolveMediaUrl(msg.conteudo)}
                              alt="Mensagem com imagem"
                              className="rounded-md max-h-64 object-cover"
                              onError={fallbackOnError}
                            />
                          )}
                          {msg.tipo === "audio" && (
                            <audio
                              controls
                              className="w-full"
                              src={resolveMediaUrl(msg.conteudo)}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={novaMensagem}
                    onChange={(event) => setNovaMensagem(event.target.value)}
                    placeholder="Digite sua mensagem…"
                    className={`flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      isDarkMode
                        ? "bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-500"
                        : "bg-white text-gray-900 border-gray-300 placeholder-gray-500"
                    }`}
                    disabled={!chatId}
                  />
                  <button
                    type="submit"
                    disabled={!novaMensagem.trim() || !chatId}
                    className={`px-4 py-2 flex items-center justify-center rounded text-white transition disabled:opacity-50 ${
                      isDarkMode
                        ? "bg-blue-600 hover:bg-blue-500"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    <FiSend size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <label
                    className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded text-sm transition ${
                      isDarkMode
                        ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
                  >
                    <FiCamera size={18} />
                    Imagem
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={!chatId}
                    />
                  </label>

                  {!gravando ? (
                    <button
                      type="button"
                      onClick={iniciarGravacao}
                      disabled={!chatId}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
                    >
                      <FiMic size={18} /> Gravar áudio
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={pararGravacao}
                      className={`flex items-center gap-2 px-3 py-2 rounded text-sm text-white ${
                        isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-600 hover:bg-gray-700"
                      }`}
                    >
                      <FiX size={18} /> Parar gravação
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
