const pool = require("../config/db");
const { deleteStoredFile } = require("../config/storage");

// GET /api/chats/:chatId/mensagens
exports.listMensagens = async (req, res) => {
  const { chatId } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT * FROM mensagens
       WHERE chat_id = ?
       ORDER BY criado_em ASC`,
      [chatId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Não foi possível listar mensagens" });
  }
};

// POST /api/chats/:chatId/mensagens
exports.createMensagem = async (req, res) => {
  const { chatId } = req.params;
  const { remetente, tipo, conteudo } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO mensagens (chat_id, remetente, tipo, conteudo)
       VALUES (?, ?, ?, ?)`,
      [chatId, remetente, tipo, conteudo]
    );
    const [newMsg] = await pool.query(`SELECT * FROM mensagens WHERE id = ?`, [
      result.insertId,
    ]);
    res.status(201).json(newMsg[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao enviar mensagem" });
  }
};

// DELETE /api/chats/:chatId/mensagens/:mensagemId
exports.deleteMensagem = async (req, res) => {
  const { chatId, mensagemId } = req.params;

  try {
    const [[mensagem]] = await pool.query(
      `SELECT id, tipo, conteudo FROM mensagens WHERE id = ? AND chat_id = ? LIMIT 1`,
      [mensagemId, chatId]
    );

    if (!mensagem) {
      return res.status(404).json({ error: "Mensagem não encontrada" });
    }

    await pool.query(`DELETE FROM mensagens WHERE id = ?`, [mensagemId]);

    await deleteStoredFile(mensagem.conteudo);

    return res.json({ ok: true, deletedId: Number(mensagemId) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao excluir mensagem" });
  }
};
