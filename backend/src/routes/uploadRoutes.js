const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Detecta ambiente serverless (Vercel) e usa /tmp como diretório gravável
const isServerless = !!process.env.VERCEL;
const baseUploads = isServerless
  ? path.join("/tmp", "uploads")
  : path.join(__dirname, "../uploads");
const audiosDir = path.join(baseUploads, "audios");

// Garante que os diretórios existam (em Vercel, /var/task é read-only; /tmp é permitido)
try {
  if (!fs.existsSync(audiosDir)) {
    fs.mkdirSync(audiosDir, { recursive: true });
  }
} catch (e) {
  console.error("Falha ao criar diretório de áudios:", audiosDir, e.message);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, audiosDir);
  },
  filename: (req, file, cb) => {
    const nome = `audio_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, nome);
  },
});

const upload = multer({ storage });

router.post("/audio", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Arquivo não enviado" });
  }

  // Retorna a URL pública correta
  const caminho = `/uploads/audios/${req.file.filename}`;
  res.json({ caminho });
});

module.exports = router;
