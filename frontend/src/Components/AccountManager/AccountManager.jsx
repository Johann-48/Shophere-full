import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCheckCircle,
  FiXCircle,
  FiEdit3,
  FiSave,
  FiRefreshCcw,
  FiLock,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

function validateEmail(email) {
  // Regex básica para email
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatPhone(value) {
  // Formata telefone no padrão (XX) XXXXX-XXXX
  if (!value) return "";
  let v = value.replace(/\D/g, "");
  if (v.length <= 2) return `(${v}`;
  if (v.length <= 7) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
  if (v.length <= 11)
    return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7, 11)}`;
  return value;
}

export default function AccountManagerPage() {
  const { isDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cidade: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  // Validações
  const isEmailValid = validateEmail(formData.email);
  const isNomeValid = formData.nome.trim().length > 0;
  const isTelefoneValid = formData.telefone.trim().length >= 13; // ex: (12) 34567-8901

  const isFormValid = isEmailValid && isNomeValid && isTelefoneValid;

  // Para confirmar saída com alterações
  const beforeUnloadListener = (event) => {
    if (hasChanges) {
      event.preventDefault();
      event.returnValue = "";
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", beforeUnloadListener);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadListener);
    };
  }, [hasChanges]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const { data } = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
        setFormData({
          nome: data.nome || "",
          email: data.email || "",
          telefone: formatPhone(data.telefone || ""),
          cidade: data.cidade || "",
        });
        setOriginalData({
          nome: data.nome || "",
          email: data.email || "",
          telefone: formatPhone(data.telefone || ""),
          cidade: data.cidade || "",
        });
      } catch (err) {
        setErrorMsg("Erro ao carregar perfil.");
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telefone") {
      setFormData((f) => ({ ...f, telefone: formatPhone(value) }));
    } else {
      setFormData((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!isFormValid) {
      setErrorMsg("Preencha todos os campos corretamente.");
      return;
    }
    setLoadingSave(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/auth/me", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({ ...user, ...formData });
      setOriginalData(formData);
      setSaved(true);
      setIsEditing(false);
      setErrorMsg("");
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      setErrorMsg("Erro ao salvar alterações.");
    } finally {
      setLoadingSave(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (
        window.confirm("Você tem alterações não salvas. Deseja descartá-las?")
      ) {
        setFormData(originalData);
        setIsEditing(false);
        setErrorMsg("");
      }
    } else {
      setIsEditing(false);
      setErrorMsg("");
    }
  };

  // Avatar simples com iniciais
  const Avatar = ({ name }) => {
    const initials = name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "US";

    return (
      <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold select-none shadow-lg ${
        isDarkMode ? "bg-blue-600" : "bg-[#1565C0]"
      }`}>
        {initials}
      </div>
    );
  };

  // Formatação data fictícia última atualização
  const lastUpdated = new Date(Date.now() - 86400000 * 3).toLocaleDateString(
    "pt-BR",
    { day: "2-digit", month: "long", year: "numeric" }
  );

  // Define o gradiente baseado no tema
  const backgroundGradient = isDarkMode 
    ? 'bg-gradient-to-br from-gray-800 via-blue-50 to-gray-100'
    : 'bg-gradient-to-br from-green-100 via-white to-green-50';

  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-gray-200' : 'text-gray-900';
  const loadingTextColor = isDarkMode ? 'text-white' : 'text-gray-800';

  if (!user)
    return (
      <div className={`flex justify-center items-center h-screen ${backgroundGradient} ${loadingTextColor} text-lg animate-pulse`}>
        Carregando perfil...
      </div>
    );

  return (
    <main className={`min-h-screen ${backgroundGradient} flex items-center justify-center px-4 py-12`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative w-full max-w-3xl ${cardBg} p-12 rounded-3xl shadow-2xl border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} select-none`}
      >
        {/* AVATAR e Botões editar */}
        <div className="flex items-center justify-between mb-8">
          <Avatar name={formData.nome} />

          <div className="flex gap-4">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                aria-label="Editar perfil"
                title="Editar perfil"
                className={`flex items-center gap-2 font-semibold transition ${
                  isDarkMode 
                    ? "text-blue-400 hover:text-blue-300" 
                    : "text-[#1565C0] hover:text-[#0D47A1]"
                }`}
              >
                <FiEdit3 size={20} />
                Editar
              </button>
            )}
            {isEditing && (
              <>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges || !isFormValid || loadingSave}
                  aria-label="Salvar alterações"
                  title="Salvar alterações"
                  className={`flex items-center gap-2 font-semibold rounded-md px-4 py-2 text-white transition ${
                    hasChanges && isFormValid && !loadingSave
                      ? isDarkMode 
                        ? "bg-blue-600 hover:bg-blue-500" 
                        : "bg-[#1565C0] hover:bg-[#0D47A1]"
                      : isDarkMode 
                        ? "bg-gray-600 cursor-not-allowed" 
                        : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {loadingSave ? (
                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-5 w-5"></div>
                  ) : (
                    <FiSave size={20} />
                  )}
                  Salvar
                </button>
                <button
                  onClick={handleCancel}
                  aria-label="Cancelar edição"
                  title="Cancelar edição"
                  className={`flex items-center gap-2 font-semibold transition ${
                    isDarkMode 
                      ? "text-blue-400 hover:text-blue-300" 
                      : "text-[#1565C0] hover:text-[#0D47A1]"
                  }`}
                >
                  <FiRefreshCcw size={20} />
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-8"
          aria-label="Formulário de edição do perfil"
        >
          <Field
            id="nome"
            label="Nome"
            value={formData.nome}
            onChange={handleChange}
            icon={<FiUser />}
            disabled={!isEditing}
            required
            valid={isNomeValid}
            errorMsg="Nome é obrigatório"
            isDarkMode={isDarkMode}
          />
          <Field
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            icon={<FiMail />}
            disabled={!isEditing}
            required
            valid={isEmailValid}
            errorMsg="Email inválido"
            isDarkMode={isDarkMode}
          />
          <Field
            id="telefone"
            label="Telefone"
            value={formData.telefone}
            onChange={handleChange}
            icon={<FiPhone />}
            disabled={!isEditing}
            required
            valid={isTelefoneValid}
            errorMsg="Telefone inválido"
            isDarkMode={isDarkMode}
          />
          <Field
            id="cidade"
            label="Cidade"
            value={formData.cidade}
            onChange={handleChange}
            icon={<FiMapPin />}
            disabled={!isEditing}
            isDarkMode={isDarkMode}
          />

          {/* Última atualização */}
          <p className={`text-sm italic select-text ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            Última atualização do perfil: <strong>{lastUpdated}</strong>
          </p>

          {/* Botão alterar senha */}
          <button
            type="button"
            onClick={() => setShowChangePassword((v) => !v)}
            className={`flex items-center gap-2 font-semibold transition ${
              isDarkMode 
                ? "text-blue-400 hover:text-blue-300" 
                : "text-[#1565C0] hover:text-[#0D47A1]"
            }`}
            aria-expanded={showChangePassword}
            aria-controls="change-password-section"
          >
            <FiLock />
            Alterar Senha
          </button>

          {/* Área alterar senha */}
          <AnimatePresence>
            {showChangePassword && (
              <motion.section
                id="change-password-section"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-4"
              >
                <ChangePasswordForm isDarkMode={isDarkMode} />
              </motion.section>
            )}
          </AnimatePresence>
        </form>

        {/* Notificações */}
        <AnimatePresence>
          {saved && (
            <Toast
              type="success"
              message="Perfil salvo com sucesso!"
              onClose={() => setSaved(false)}
            />
          )}
          {errorMsg && (
            <Toast
              type="error"
              message={errorMsg}
              onClose={() => setErrorMsg("")}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Loader style */}
      <style>{`
        .loader {
          border-top-color: #1565C0;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </main>
  );
}

// Campo com validação e ícone
function Field({
  id,
  label,
  icon,
  valid = true,
  errorMsg = "",
  disabled = false,
  isDarkMode = false,
  ...props
}) {
  const iconColor = disabled 
    ? "text-gray-400 opacity-50" 
    : isDarkMode ? "text-gray-400" : "text-gray-500";
  
  const labelColor = disabled 
    ? "text-gray-400" 
    : isDarkMode ? "text-gray-300" : "text-gray-700";
    
  const inputBg = disabled 
    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
    : isDarkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-900";

  return (
    <div>
      <label
        htmlFor={id}
        className={`block text-sm font-medium mb-1 select-none ${labelColor}`}
      >
        {label}
      </label>
      <div className="relative">
        <span
          className={`absolute left-3 top-3 select-none ${iconColor}`}
        >
          {icon}
        </span>
        <input
          id={id}
          name={id}
          {...props}
          disabled={disabled}
          aria-invalid={!valid}
          aria-describedby={valid ? undefined : `${id}-error`}
          className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
            valid ? (isDarkMode ? "border-gray-600" : "border-gray-300") : "border-red-500"
          } focus:outline-none focus:ring-2 focus:ring-[#1565C0] ${inputBg} transition`}
        />
      </div>
      {!valid && (
        <p
          id={`${id}-error`}
          className={`mt-1 text-xs font-semibold select-text ${
            isDarkMode ? "text-red-400" : "text-red-600"
          }`}
        >
          {errorMsg}
        </p>
      )}
    </div>
  );
}

// Toast / Notificação estilizada
function Toast({ type = "success", message, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.4 }}
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white flex items-center gap-3 max-w-xs font-semibold ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
      role="alert"
      aria-live="assertive"
    >
      {type === "success" ? (
        <FiCheckCircle size={20} />
      ) : (
        <FiXCircle size={20} />
      )}
      <span className="flex-grow">{message}</span>
      <button
        onClick={onClose}
        aria-label="Fechar alerta"
        className="text-white hover:opacity-75 transition"
      >
        ✕
      </button>
    </motion.div>
  );
}

// Formulário simulado para alteração de senha (só UI)
function ChangePasswordForm({ isDarkMode = false }) {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const canSubmit =
    currentPass.length >= 6 &&
    newPass.length >= 6 &&
    newPass === confirmNewPass;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canSubmit) {
      setMsg({ type: "error", text: "Preencha os campos corretamente." });
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "/api/auth/change-password",
        {
          senhaAtual: currentPass,
          novaSenha: newPass,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMsg({ type: "success", text: "Senha alterada com sucesso!" });
      setCurrentPass("");
      setNewPass("");
      setConfirmNewPass("");
    } catch (error) {
      setMsg({
        type: "error",
        text:
          error.response?.data?.message || "Erro ao tentar alterar a senha.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 mt-4" aria-label="Alterar senha">
      <div>
        <label htmlFor="currentPass" className={`block text-sm font-medium mb-1 ${
          isDarkMode ? "text-gray-300" : "text-gray-700"
        }`}>
          Senha Atual
        </label>
        <input
          id="currentPass"
          type="password"
          value={currentPass}
          onChange={(e) => setCurrentPass(e.target.value)}
          required
          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#1565C0] focus:outline-none transition ${
            isDarkMode 
              ? "bg-gray-700 text-gray-200 border-gray-600" 
              : "bg-white text-gray-900 border-gray-300"
          }`}
        />
      </div>
      <div>
        <label htmlFor="newPass" className={`block text-sm font-medium mb-1 ${
          isDarkMode ? "text-gray-300" : "text-gray-700"
        }`}>
          Nova Senha
        </label>
        <input
          id="newPass"
          type="password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          required
          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#1565C0] focus:outline-none transition ${
            isDarkMode 
              ? "bg-gray-700 text-gray-200 border-gray-600" 
              : "bg-white text-gray-900 border-gray-300"
          }`}
        />
      </div>
      <div>
        <label
          htmlFor="confirmNewPass"
          className={`block text-sm font-medium mb-1 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Confirmar Nova Senha
        </label>
        <input
          id="confirmNewPass"
          type="password"
          value={confirmNewPass}
          onChange={(e) => setConfirmNewPass(e.target.value)}
          required
          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-[#1565C0] focus:outline-none transition ${
            isDarkMode 
              ? "bg-gray-700 text-gray-200 border-gray-600" 
              : "bg-white text-gray-900 border-gray-300"
          }`}
        />
      </div>

      <button
        type="button"
        disabled={!canSubmit || loading}
        onClick={handleSubmit}
        className={`w-full py-3 rounded-lg font-semibold text-white transition ${
          canSubmit && !loading
            ? isDarkMode 
              ? "bg-blue-600 hover:bg-blue-500" 
              : "bg-[#1565C0] hover:bg-[#0D47A1]"
            : isDarkMode 
              ? "bg-gray-600 cursor-not-allowed" 
              : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {loading ? "Salvando..." : "Alterar Senha"}
      </button>

      {/* Dica de validação */}
      {!canSubmit && !loading && (
        <p className={`mt-2 text-sm text-center font-semibold ${
          isDarkMode ? "text-red-400" : "text-red-600"
        }`}>
          Preencha todos os campos corretamente. A nova senha precisa ter no
          mínimo 6 caracteres e coincidir com a confirmação.
        </p>
      )}

      {msg && (
        <p
          className={`mt-3 text-center font-semibold ${
            msg.type === "success" 
              ? isDarkMode ? "text-green-400" : "text-green-600"
              : isDarkMode ? "text-red-400" : "text-red-600"
          }`}
        >
          {msg.text}
        </p>
      )}
    </div>
  );
}
