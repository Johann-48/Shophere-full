const pool = require("../config/db");

const normalizeMessage = (raw, shouldTrim = true) => {
  if (typeof raw !== "string") return null;
  const value = shouldTrim ? raw.trim() : raw;
  if (!value) return null;
  if (value === "undefined" || value === "null") return null;
  return value;
};

const ensureChat = async ({ clienteId, lojaId, initialMessage, remetente }) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [[existing]] = await conn.query(
      `SELECT id FROM chats WHERE cliente_id = ? AND loja_id = ?`,
      [clienteId, lojaId]
    );

    let chatId;
    let created = false;

    if (existing) {
      chatId = existing.id;
    } else {
      const [insertRes] = await conn.query(
        `INSERT INTO chats (cliente_id, loja_id, criado_em)
         VALUES (?, ?, NOW())
         ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
        [clienteId, lojaId]
      );
      chatId = insertRes.insertId;
      created = true;
    }

    let createdMessage = null;
    if (initialMessage) {
      const sender = remetente === "loja" ? "loja" : "cliente";
      const [msgRes] = await conn.query(
        `INSERT INTO mensagens (chat_id, remetente, tipo, conteudo, criado_em)
         VALUES (?, ?, 'texto', ?, NOW())`,
        [chatId, sender, initialMessage]
      );

      const [messageRows] = await conn.query(
        `SELECT * FROM mensagens WHERE id = ?`,
        [msgRes.insertId]
      );
      createdMessage = messageRows[0] || null;
    }

    const [[chat]] = await conn.query(`SELECT * FROM chats WHERE id = ?`, [
      chatId,
    ]);

    await conn.commit();

    return { chat, createdMessage, created };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

exports.startChat = async (req, res) => {
  const { clienteId, lojaId, initialMessage, remetente } = req.body || {};

  if (!clienteId || !lojaId) {
    return res
      .status(400)
      .json({ error: "Os campos clienteId e lojaId são obrigatórios." });
  }

  try {
    const normalizedMessage = normalizeMessage(initialMessage);
    const result = await ensureChat({
      clienteId,
      lojaId,
      initialMessage: normalizedMessage,
      remetente,
    });

    return res.status(result.created ? 201 : 200).json(result);
  } catch (err) {
    console.error("Erro ao iniciar chat:", err);
    return res.status(500).json({ error: "Erro interno ao iniciar chat" });
  }
};

// GET /api/chats?clienteId=...&lojaId=...&message=...
exports.getOrCreateChat = async (req, res) => {
  const { clienteId, lojaId } = req.query;
  const messageParam =
    req.query.initMessage !== undefined
      ? req.query.initMessage
      : req.query.message;

  if (!clienteId || !lojaId) {
    return res
      .status(400)
      .json({ error: "Parâmetros clienteId e lojaId são obrigatórios." });
  }

  try {
    const normalizedMessage = normalizeMessage(messageParam);
    const result = await ensureChat({
      clienteId,
      lojaId,
      initialMessage: normalizedMessage,
      remetente: "cliente",
    });

    return res.status(result.created ? 201 : 200).json(result.chat);
  } catch (err) {
    console.error("Erro ao obter/criar chat:", err);
    return res.status(500).json({ error: "Erro interno ao obter/criar chat" });
  }
};

exports.listChats = async (req, res) => {
  const { lojaId } = req.query;
  if (!lojaId) {
    return res.status(400).json({ error: "Falta query param lojaId" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT 
         ch.cliente_id,
         MAX(ch.criado_em) AS ultimo_contato,
         u.nome AS cliente_nome,
         u.foto_perfil
       FROM chats ch
       JOIN usuarios u ON u.id = ch.cliente_id
       WHERE ch.loja_id = ?
       GROUP BY ch.cliente_id
       ORDER BY ultimo_contato DESC`,
      [lojaId]
    );

    return res.json(rows);
  } catch (err) {
    console.error("Erro ao listar chats:", err);
    return res.status(500).json({ error: "Erro interno ao listar chats." });
  }
};
