import axios from "axios";
import API_CONFIG from "../config/api";

const withBase = (endpoint) => API_CONFIG.getApiUrl(endpoint);

export const fetchUserChats = async (clienteId) => {
  const { data } = await axios.get(withBase(`/api/chats/user/${clienteId}`));
  return data;
};

export const fetchStoreById = async (lojaId) => {
  const { data } = await axios.get(withBase(`/api/commerces/${lojaId}`));
  return data;
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
