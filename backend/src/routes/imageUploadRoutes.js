// routes/imageUploadRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const {
  DRIVER,
  uploadBufferToS3,
  uploadBufferToBlob,
} = require("../config/storage");
const { toAbsoluteUrl } = require("../utils/url");

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

if (DRIVER === "s3" || DRIVER === "vercel-blob") {
  const upload = multer({ storage: multer.memoryStorage() });
  router.post("/imagem", upload.single("imagem"), async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ error: "Arquivo não enviado" });
      const ext = path.extname(req.file.originalname) || ".jpg";
      const key = `uploads/imagens/img_${Date.now()}${ext}`;
      const uploader = DRIVER === "s3" ? uploadBufferToS3 : uploadBufferToBlob;
      const url = await uploader({
        buffer: req.file.buffer,
        contentType: req.file.mimetype,
        key,
      });
      return res.json({ caminho: url });
    } catch (e) {
      console.error("Upload remoto falhou:", e.message);
      return res.status(500).json({ error: "Falha ao enviar imagem" });
    }
  });
} else {
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
    if (!req.file)
      return res.status(400).json({ error: "Arquivo não enviado" });
    const relative = `/uploads/imagens/${req.file.filename}`;
    // Always return absolute URL so the frontend doesn't depend on window.location
    return res.json({ caminho: toAbsoluteUrl(relative) || relative });
  });
}

module.exports = router;
