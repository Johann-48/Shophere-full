import axios from "axios";
import API_CONFIG from "../config/api";

const withBase = (endpoint) => API_CONFIG.getApiUrl(endpoint);

const normalizeCommerce = (payload) => {
  if (!payload) return null;

  const id =
    payload.id ??
    payload.loja_id ??
    payload.comercio_id ??
    payload.commerceId ??
    null;

  const nome =
    payload.nome ??
    payload.name ??
    payload.loja_nome ??
    payload.commerceName ??
    null;

  const imagem =
    payload.imagem ??
    payload.foto ??
    payload.fotos ??
    payload.logoUrl ??
    payload.logo_url ??
    payload.loja_foto ??
    payload.avatar ??
    null;

  return id ? { id, nome, imagem } : null;
};

export const fetchUserChats = async (clienteId) => {
  const { data } = await axios.get(withBase(`/api/chats/user/${clienteId}`));
  if (!Array.isArray(data)) return [];

  return data.map((chat) => ({
    id: chat.id,
    chatId: chat.id,
    loja: normalizeCommerce({
      id: chat.loja_id,
      nome: chat.loja_nome,
      imagem: chat.loja_foto,
    }),
    criadoEm: chat.criado_em,
    raw: chat,
  }));
};

export const fetchStoreById = async (lojaId) => {
  const { data } = await axios.get(withBase(`/api/commerces/${lojaId}`));
  const commerce = data?.commerce || data || null;
  const normalizado = normalizeCommerce(commerce);
  if (!normalizado) return null;

  return { ...normalizado, raw: commerce };
};

export const startChat = async ({
  clienteId,
  lojaId,
  initialMessage,
  remetente,
}) => {
  const payload = {
    clienteId,
    lojaId,
  };

  if (initialMessage) {
    payload.initialMessage = initialMessage;
  }

  if (remetente) {
    payload.remetente = remetente;
  }

  const { data } = await axios.post(withBase(`/api/chats/start`), payload);
  return data;
};

export const fetchMessages = async (chatId) => {
  const { data } = await axios.get(withBase(`/api/chats/${chatId}/mensagens`));
  return data;
};

export const sendMessage = async (chatId, message) => {
  const { data } = await axios.post(
    withBase(`/api/chats/${chatId}/mensagens`),
    message
  );
  return data;
};

export const deleteMessage = async (chatId, messageId) => {
  await axios.delete(withBase(`/api/chats/${chatId}/mensagens/${messageId}`));
};

export const uploadChatImage = async (file) => {
  const formData = new FormData();
  formData.append("imagem", file);
  const { data } = await axios.post(
    withBase(`/api/upload/image/imagem`),
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data;
};

export const uploadChatAudio = async (blob) => {
  const formData = new FormData();
  formData.append("audio", blob, "audio.webm");
  const { data } = await axios.post(withBase(`/api/upload/audio`), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
