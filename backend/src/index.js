// src/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const {
  DRIVER,
  uploadBufferToS3,
  uploadBufferToBlob,
} = require("./config/storage");

const HERO_BANNER_URL =
  process.env.HERO_BANNER_URL ||
  "https://web.whatsapp.com/4f123d19-7f29-4d2d-8baa-3f7360283603";
const HERO_BANNER_FALLBACK =
  process.env.HERO_BANNER_FALLBACK ||
  "https://sdmntprcentralus.oaiusercontent.com/files/00000000-06fc-61f5-9330-588a0ff01748/raw?se=2025-10-16T15%3A29%3A27Z&sp=r&sv=2024-08-04&sr=b&scid=dc0388f7-91a8-4765-9b5f-8636d0750ae5&skoid=c953efd6-2ae8-41b4-a6d6-34b1475ac07c&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-10-16T11%3A13%3A18Z&ske=2025-10-17T11%3A13%3A18Z&sks=b&skv=2024-08-04&sig=H9/rGyJY8PppXQTyxXlqAGKimIFGF9oY75Q/AQl0q0g%3D";

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const commerceRoutes = require("./routes/commerceRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const avaliacoesRouter = require("./routes/avaliacaoProduto.routes");
const commerceController = require("./controllers/commerceController");
const productImagesRoutes = require("./routes/productImages.routes");
const { toAbsoluteUrl } = require("./utils/url");

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
app.use("/api", productImagesRoutes);

app.get("/api/assets/hero-banner", async (req, res) => {
  try {
    const response = await fetch(HERO_BANNER_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ao buscar banner`);
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Cache-Control",
      "public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400"
    );
    return res.send(buffer);
  } catch (error) {
    console.error("Erro ao fazer proxy do hero banner:", error.message);
    if (HERO_BANNER_FALLBACK) {
      res.setHeader("Cache-Control", "public, max-age=600");
      return res.redirect(302, HERO_BANNER_FALLBACK);
    }
    return res
      .status(502)
      .json({ error: "Não foi possível carregar o banner" });
  }
});

// 5) Upload de imagem de produto (suporta S3/Vercel Blob quando configurado)
if (DRIVER === "s3" || DRIVER === "vercel-blob") {
  const upload = multer({ storage: multer.memoryStorage() });
  app.post(
    "/api/upload/:produtoId",
    upload.single("foto"),
    async (req, res) => {
      try {
        if (!req.file)
          return res.status(400).json({ error: "Arquivo não enviado" });
        const pool = require("./config/db");
        const { produtoId } = req.params;
        const pathMod = require("path");
        const ext = pathMod.extname(req.file.originalname) || ".jpg";
        const base = pathMod.basename(req.file.originalname, ext);
        const safeBase = base.replace(/[^a-zA-Z0-9_.-]/g, "_");
        const key = `uploads/produtos/${produtoId}/${Date.now()}-${safeBase}${ext}`;
        const uploader =
          DRIVER === "s3" ? uploadBufferToS3 : uploadBufferToBlob;
        const url = await uploader({
          buffer: req.file.buffer,
          contentType: req.file.mimetype,
          key,
        });

        await pool.query(
          "INSERT INTO fotos_produto (produto_id, url, principal) VALUES (?, ?, 1)",
          [produtoId, url]
        );

        return res.json({ message: "Imagem enviada com sucesso", url });
      } catch (err) {
        console.error("Upload de produto (remoto) falhou:", err.message);
        return res.status(500).json({ error: "Erro ao salvar imagem" });
      }
    }
  );
} else {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  });
  const upload = multer({ storage });

  app.post(
    "/api/upload/:produtoId",
    upload.single("foto"),
    async (req, res) => {
      try {
        const pool = require("./config/db");
        const { produtoId } = req.params;
        const filePath = `/uploads/${req.file.filename}`;
        const { toAbsoluteUrl } = require("./utils/url");

        await pool.query(
          "INSERT INTO fotos_produto (produto_id, url, principal) VALUES (?, ?, 1)",
          [produtoId, filePath]
        );

        return res.json({
          message: "Imagem enviada com sucesso",
          url: toAbsoluteUrl(filePath) || filePath,
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao salvar no banco" });
      }
    }
  );
}

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
    storage: {
      driver: DRIVER,
      uploadsDir,
    },
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
