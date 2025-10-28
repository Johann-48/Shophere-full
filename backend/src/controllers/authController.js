// src/controllers/authController.js
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  generateResetToken,
  hashResetToken,
  buildResetUrl,
} = require("../utils/resetToken");
const { sendPasswordResetEmailSMTP } = require("../services/email-gmail-smtp");

// Função auxiliar: buscar usuário por email
async function findUserByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
    email,
  ]);
  return rows.length > 0 ? rows[0] : null;
}

// Função auxiliar: buscar comércio por email
async function findCommerceByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM comercios WHERE email = ?", [
    email,
  ]);
  return rows.length > 0 ? { ...rows[0], isCommerce: true } : null;
}

// Função para fazer login
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatórios." });
    }

    // ↓↓↓ INÍCIO DO PATCH ↓↓↓
    let entity = await findUserByEmail(email);
    let role = "user";

    if (!entity) {
      entity = await findCommerceByEmail(email);
      role = entity ? "commerce" : role;
    }

    if (!entity) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }
    // ↑↑↑ FIM DO PATCH ↑↑↑

    // ↓↓↓ USAR entity.senha ↓↓↓
    let senhaValida = false;
    if (entity.senha.startsWith("$2b$") || entity.senha.startsWith("$2a$")) {
      senhaValida = await bcrypt.compare(senha, entity.senha);
    } else {
      senhaValida = senha === entity.senha;
    }
    if (!senhaValida) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }
    // ↑↑↑ FIM da verificação de senha ↑↑↑

    // Gera token com role...
    const payload = {
      id: entity.id,
      email: entity.email,
      nome: entity.nome,
      role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    // 1) Coleto informações do dispositivo e IP
    const deviceInfo = req.headers["user-agent"] || null;
    const ip = req.ip;

    // 2) Calculo data de expiração (espelho do expiresIn)
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 dia

    // 3) Insiro na tabela sessions
    // ↓ abaixo de const expiresAt = …
    if (payload.role === "commerce") {
      await pool.query(
        `INSERT INTO sessions_comercios
      (comercio_id, token, device_info, ip, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
        [payload.id, token, deviceInfo, ip, expiresAt]
      );
    } else {
      await pool.query(
        `INSERT INTO sessions
      (user_id, token, device_info, ip, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
        [payload.id, token, deviceInfo, ip, expiresAt]
      );
    }

    return res.json({
      message: "Autenticação realizada com sucesso.",
      token,
      user: { id: entity.id, email: entity.email, nome: entity.nome, role },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
};

exports.getMyProfile = async (req, res) => {
  const userId = req.userId;
  const userRole = req.userRole;

  try {
    let rows;
    if (userRole === "commerce") {
      [rows] = await pool.query(
        "SELECT id, nome, email, telefone, endereco FROM comercios WHERE id = ?",
        [userId]
      );
    } else {
      [rows] = await pool.query(
        "SELECT id, nome, email, telefone, cidade FROM usuarios WHERE id = ?",
        [userId]
      );
    }

    if (!rows.length) {
      return res.status(404).json({ error: "Perfil não encontrado." });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao buscar perfil:", err);
    return res.status(500).json({ error: "Erro interno ao buscar perfil." });
  }
};

exports.signup = async (req, res) => {
  try {
    const { nome, email, senha, endereco = null, telefone = null } = req.body;

    // Validação dos campos obrigatórios
    if (!nome || !email || !senha) {
      return res.status(400).json({
        message: "Nome, email e senha são campos obrigatórios.",
        missingFields: {
          nome: !nome,
          email: !email,
          senha: !senha,
        },
      });
    }

    // Validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Formato de email inválido." });
    }

    // Verificar se o email já existe
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email já cadastrado." });
    }

    // Hashear a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    if (!telefone) {
      return res.status(400).json({
        message: "O telefone é obrigatório.",
      });
    }

    // Limpa o telefone para manter apenas números
    const telefoneNumerico = telefone.replace(/\D/g, "");

    if (telefoneNumerico.length < 11) {
      return res.status(400).json({
        message: "O telefone deve ter 11 dígitos (DDD + número)",
      });
    }

    // Inserir o usuário no banco de dados
    const [result] = await pool.query(
      "INSERT INTO usuarios (nome, email, senha, telefone, cidade) VALUES (?, ?, ?, ?, ?)",
      [
        nome.trim(),
        email.toLowerCase().trim(),
        hashedPassword,
        telefoneNumerico,
        null, // cidade será atualizada posteriormente pelo usuário
      ]
    );

    if (result && result.insertId) {
      return res.status(201).json({
        message: "Usuário criado com sucesso.",
        userId: result.insertId,
      });
    } else {
      throw new Error("Falha ao inserir usuário no banco de dados");
    }
  } catch (error) {
    console.error("Erro no signup:", error);

    // Identificar o tipo de erro para retornar uma mensagem mais específica
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email já está em uso." });
    } else if (error.code === "ER_NO_REFERENCED_ROW") {
      return res
        .status(400)
        .json({ message: "Dados inválidos para criar conta." });
    } else if (error.code === "ER_DATA_TOO_LONG") {
      return res.status(400).json({
        message: "Um ou mais campos excedem o tamanho máximo permitido.",
      });
    }

    return res.status(500).json({
      message: "Erro interno ao criar conta. Por favor, tente novamente.",
      errorDetail:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    const userId = req.userId; // preenchido pelo middleware
    const { nome, email, telefone, cidade } = req.body;

    // Atualiza no banco
    await pool.query(
      "UPDATE usuarios SET nome = ?, email = ?, telefone = ?, cidade = ? WHERE id = ?",
      [nome, email, telefone, cidade, userId]
    );

    // Retorna o usuário atualizado
    const [rows] = await pool.query(
      "SELECT id, nome, email, telefone, cidade FROM usuarios WHERE id = ?",
      [userId]
    );
    return res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    return res.status(500).json({ error: "Erro interno ao salvar perfil" });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    const userId = req.userId;
    const imageUrl = `/uploads/${req.file.filename}`;
    await pool.query("UPDATE usuarios SET foto = ? WHERE id = ?", [
      imageUrl,
      userId,
    ]);
    res.json({ imageUrl });
  } catch (err) {
    console.error("Erro no upload de imagem:", err);
    res.status(500).json({ error: "Erro ao salvar imagem" });
  }
};

// Exemplo no authController.js
exports.changePassword = async (req, res) => {
  const { senhaAtual, novaSenha } = req.body;
  const userId = req.userId;
  const userRole = req.userRole;

  try {
    let tableName = userRole === "commerce" ? "comercios" : "usuarios";

    const [rows] = await pool.query(
      `SELECT senha FROM ${tableName} WHERE id = ?`,
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const usuario = rows[0];

    const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaCorreta) {
      return res.status(400).json({ message: "Senha atual incorreta." });
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);
    await pool.query(`UPDATE ${tableName} SET senha = ? WHERE id = ?`, [
      senhaHash,
      userId,
    ]);

    res.json({ message: "Senha alterada com sucesso." });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    res.status(500).json({ message: "Erro interno." });
  }
};

// ========================================
// FORGOT PASSWORD - Solicitar Reset
// ========================================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email é obrigatório." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    // Verifica se o email existe (usuário ou comércio)
    let user = await findUserByEmail(normalizedEmail);
    let userType = "user";

    if (!user) {
      user = await findCommerceByEmail(normalizedEmail);
      userType = "commerce";
    }

    const genericResponse = {
      message:
        "Se este email estiver cadastrado, você receberá instruções para redefinir sua senha.",
    };

    // Por segurança, sempre retorna sucesso mesmo se o email não existir
    // Isso evita que atacantes descubram quais emails estão cadastrados
    if (!user) {
      return res.status(200).json(genericResponse);
    }

    // Gera token seguro e hash correspondente para salvar no banco
    const { token, hashedToken } = generateResetToken();

    const expiresInMinutes = Number(process.env.RESET_TOKEN_EXP_MINUTES || 15);
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    await pool.query(
      `INSERT INTO password_reset_tokens (email, token, user_type, expires_at) 
       VALUES (?, ?, ?, ?)`,
      [normalizedEmail, hashedToken, userType, expiresAt]
    );

    const resetUrl = buildResetUrl(token, normalizedEmail);

    try {
      await sendPasswordResetEmailSMTP(normalizedEmail, resetUrl);
    } catch (emailError) {
      console.error(
        "Erro ao enviar e-mail de redefinição de senha:",
        emailError
      );
      return res.status(500).json({
        message:
          "Não foi possível enviar o e-mail com instruções. Tente novamente mais tarde.",
      });
    }

    return res.status(200).json({
      ...genericResponse,
      ...(process.env.NODE_ENV === "development" && { resetUrl }),
    });
  } catch (error) {
    console.error("Erro ao solicitar reset de senha:", error);
    return res.status(500).json({
      message: "Erro ao processar solicitação. Tente novamente mais tarde.",
    });
  }
};

// ========================================
// RESET PASSWORD - Redefinir Senha
// ========================================
exports.resetPassword = async (req, res) => {
  try {
    const { token, novaSenha } = req.body;

    if (!token || !novaSenha) {
      return res
        .status(400)
        .json({ message: "Token e nova senha são obrigatórios." });
    }

    // Validação de senha forte
    if (novaSenha.length < 6) {
      return res.status(400).json({
        message: "A senha deve ter pelo menos 6 caracteres.",
      });
    }

    const hashedToken = hashResetToken(token);

    let [tokens] = await pool.query(
      `SELECT * FROM password_reset_tokens 
       WHERE token = ? AND used = 0 AND expires_at > NOW()
       ORDER BY created_at DESC 
       LIMIT 1`,
      [hashedToken]
    );

    // Compatibilidade com tokens antigos salvos sem hash
    if (!tokens.length) {
      [tokens] = await pool.query(
        `SELECT * FROM password_reset_tokens 
         WHERE token = ? AND used = 0 AND expires_at > NOW()
         ORDER BY created_at DESC 
         LIMIT 1`,
        [token]
      );
    }

    if (!tokens.length) {
      return res.status(400).json({
        message: "Token inválido ou expirado. Solicite um novo reset de senha.",
      });
    }

    const resetToken = tokens[0];
    const { email, user_type } = resetToken;

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(novaSenha, 10);

    // Atualiza a senha do usuário
    const tableName = user_type === "commerce" ? "comercios" : "usuarios";
    await pool.query(`UPDATE ${tableName} SET senha = ? WHERE email = ?`, [
      hashedPassword,
      email,
    ]);

    // Marca o token como usado
    await pool.query(
      `UPDATE password_reset_tokens SET used = TRUE WHERE id = ?`,
      [resetToken.id]
    );

    // Opcional: Invalida todas as sessões existentes do usuário (logout forçado)
    if (user_type === "commerce") {
      await pool.query(
        `DELETE FROM sessions_comercios WHERE comercio_id = (
        SELECT id FROM comercios WHERE email = ?
      )`,
        [email]
      );
    } else {
      await pool.query(
        `DELETE FROM sessions WHERE user_id = (
        SELECT id FROM usuarios WHERE email = ?
      )`,
        [email]
      );
    }

    return res.status(200).json({
      message: "Senha redefinida com sucesso! Você já pode fazer login.",
    });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    return res.status(500).json({
      message: "Erro ao redefinir senha. Tente novamente mais tarde.",
    });
  }
};
