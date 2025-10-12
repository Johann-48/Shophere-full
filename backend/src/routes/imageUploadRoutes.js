// routes/imageUploadRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const isServerless = !!process.env.VERCEL;
const baseUploads = isServerless
  ? path.join("/tmp", "uploads")
  : path.join(__dirname, "../uploads");
const imagensDir = path.join(baseUploads, "imagens");
try {
  if (!fs.existsSync(imagensDir)) fs.mkdirSync(imagensDir, { recursive: true });
} catch (e) {
  console.error("Falha ao criar diretório de imagens:", imagensDir, e.message);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagensDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nome = `img_${Date.now()}${ext}`;
    cb(null, nome);
  },
});

const upload = multer({ storage });

router.post("/imagem", upload.single("imagem"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Arquivo não enviado" });
  // retorna caminho público
  return res.json({ caminho: `/uploads/imagens/${req.file.filename}` });
});

module.exports = router;
