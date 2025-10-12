// src/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const commerceRoutes = require("./routes/commerceRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const avaliacoesRouter = require("./routes/avaliacaoProduto.routes");
const commerceController = require("./controllers/commerceController");

const app = express();

// 1) Middlewares globais
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "https://shophere-production.vercel.app",
  "https://shophere-full.vercel.app",
  "https://*.vercel.app",
];

// For production, allow multiple origins
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list or matches vercel pattern
    if (allowedOrigins.includes(origin) || origin.includes(".vercel.app")) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// 2) Garante que as pastas uploads e uploads/audios existam
// Em ambiente serverless (Vercel), use /tmp (ephemeral) para evitar erros de escrita
const isServerless = !!process.env.VERCEL;
const uploadsDir = isServerless
  ? path.join("/tmp", "uploads")
  : path.join(__dirname, "uploads");
const audiosDir = path.join(uploadsDir, "audios");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(audiosDir)) {
  fs.mkdirSync(audiosDir, { recursive: true });
}

// 3) Servir uploads como caminho estático (apenas uma vez!)
app.use("/uploads", express.static(uploadsDir));

// 4) Rotas principais
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/commerces", commerceRoutes);
app.get("/api/lojas", commerceController.listCommerces);
app.use("/api/avaliacoes", avaliacoesRouter);
app.use("/api/chats", require("./routes/chatRoutes"));
app.use("/api/chats/:chatId/mensagens", require("./routes/mensagemRoutes"));
app.use("/api/upload", uploadRoutes); // Inclui upload de áudio
// src/index.js — logo abaixo de app.use("/api/upload", uploadRoutes);
app.use("/api/upload/image", require("./routes/imageUploadRoutes"));

// 5) Upload de imagem de produto
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

app.post("/api/upload/:produtoId", upload.single("foto"), async (req, res) => {
  try {
    const pool = require("./config/db");
    const { produtoId } = req.params;
    const filePath = `/uploads/${req.file.filename}`;

    await pool.query(
      "INSERT INTO fotos_produto (produto_id, url, principal) VALUES (?, ?, 1)",
      [produtoId, filePath]
    );

    return res.json({ message: "Imagem enviada com sucesso", url: filePath });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao salvar no banco" });
  }
});

// 6) Teste básico
app.get("/", (req, res) => {
  res.json({ message: "Backend funcionando" });
});

// Health check endpoint (useful on Vercel)
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    env: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    time: new Date().toISOString(),
  });
});

// Debug summary: counts of main tables to check if DB has data
app.get("/api/debug/summary", async (req, res) => {
  try {
    const pool = require("./config/db");
    const results = {};
    // Try Portuguese table names first
    try {
      const [[c1]] = await pool.query("SELECT COUNT(*) AS cnt FROM categorias");
      results.categorias = c1.cnt;
    } catch {}
    try {
      const [[c2]] = await pool.query("SELECT COUNT(*) AS cnt FROM comercios");
      results.comercios = c2.cnt;
    } catch {}
    try {
      const [[c3]] = await pool.query("SELECT COUNT(*) AS cnt FROM produtos");
      results.produtos = c3.cnt;
    } catch {}
    // Try English names as fallback
    if (results.categories == null) {
      try {
        const [[e1]] = await pool.query(
          "SELECT COUNT(*) AS cnt FROM categories"
        );
        results.categories = e1.cnt;
      } catch {}
    }
    if (results.commerces == null) {
      try {
        const [[e2]] = await pool.query(
          "SELECT COUNT(*) AS cnt FROM commerces"
        );
        results.commerces = e2.cnt;
      } catch {}
    }
    if (results.products == null) {
      try {
        const [[e3]] = await pool.query("SELECT COUNT(*) AS cnt FROM products");
        results.products = e3.cnt;
      } catch {}
    }
    res.json({ ok: true, results });
  } catch (err) {
    console.error("/api/debug/summary error:", err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Database health check: verifies connection and simple query
app.get("/api/db-health", async (req, res) => {
  try {
    const pool = require("./config/db");
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({
      status: "ok",
      db: rows && rows[0] && rows[0].ok === 1 ? "reachable" : "unknown",
    });
  } catch (err) {
    console.error("DB health check failed:", err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 7) Catch‑all de rota não encontrada
app.use((req, res) => {
  console.log("Rota não encontrada:", req.method, req.url);
  res.status(404).json({ error: "Rota não encontrada" });
});

// 8) Iniciar servidor
const PORT = process.env.PORT || 4000;

// Para desenvolvimento local
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Servidor rodando: http://localhost:${PORT}`);
  });
}

// Exportar para Vercel
module.exports = app;
