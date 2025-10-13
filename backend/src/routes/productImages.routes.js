const express = require("express");
const multer = require("multer");
const path = require("path");
const { DRIVER, uploadBufferToS3 } = require("../config/storage");
const pool = require("../config/db");
const { toAbsoluteUrl } = require("../utils/url");
const { requireAuth, requireCommerce } = require("../middleware/auth");

const router = express.Router();

// Upload middleware based on driver
const upload =
  DRIVER === "s3"
    ? multer({ storage: multer.memoryStorage() })
    : multer({
        storage: multer.diskStorage({
          destination: (req, file, cb) =>
            cb(
              null,
              path.join(
                process.env.VERCEL ? "/tmp" : path.join(__dirname, ".."),
                "uploads"
              )
            ),
          filename: (req, file, cb) =>
            cb(null, Date.now() + "-" + file.originalname),
        }),
      });

// GET /api/products/:id/images — list images for a product
router.get("/products/:id/images", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT id, url, principal FROM fotos_produto WHERE produto_id = ? ORDER BY principal DESC, id ASC`,
      [id]
    );
    const data = rows.map((r) => ({
      id: r.id,
      url: toAbsoluteUrl(r.url),
      principal: !!r.principal,
    }));
    res.json(data);
  } catch (e) {
    console.error("list images error:", e.message);
    res.status(500).json({ error: "Erro ao listar imagens" });
  }
});

// POST /api/products/:id/images — upload new image and attach to product
router.post(
  "/products/:id/images",
  requireAuth,
  requireCommerce,
  upload.single("file"),
  async (req, res) => {
    try {
      const { id } = req.params; // product id
      if (!req.file)
        return res.status(400).json({ error: "Arquivo não enviado" });

      let finalUrl;
      if (DRIVER === "s3") {
        const ext = path.extname(req.file.originalname) || ".jpg";
        const safeName = req.file.originalname.replace(/[^a-zA-Z0-9_.-]/g, "_");
        const key = `uploads/produtos/${Date.now()}-${safeName}${ext}`;
        finalUrl = await uploadBufferToS3({
          buffer: req.file.buffer,
          contentType: req.file.mimetype,
          key,
        });
      } else {
        // local/dev path
        finalUrl = `/uploads/${req.file.filename}`;
      }

      // If product has no principal yet, make this one principal
      const [[{ count }]] = await pool.query(
        `SELECT COUNT(*) AS count FROM fotos_produto WHERE produto_id = ? AND principal = 1`,
        [id]
      );
      const makePrincipal = count === 0;
      if (makePrincipal) {
        await pool.query(
          `UPDATE fotos_produto SET principal = 0 WHERE produto_id = ?`,
          [id]
        );
      }
      const [result] = await pool.query(
        `INSERT INTO fotos_produto (produto_id, url, principal) VALUES (?, ?, ?)`,
        [id, finalUrl, makePrincipal ? 1 : 0]
      );

      res
        .status(201)
        .json({
          id: result.insertId,
          url: toAbsoluteUrl(finalUrl),
          principal: makePrincipal,
        });
    } catch (e) {
      console.error("upload product image error:", e.message);
      res.status(500).json({ error: "Erro ao enviar imagem" });
    }
  }
);

// PUT /api/products/:id/images/:imageId/principal — set image as principal
router.put(
  "/products/:id/images/:imageId/principal",
  requireAuth,
  requireCommerce,
  async (req, res) => {
    try {
      const { id, imageId } = req.params;
      await pool.query(
        `UPDATE fotos_produto SET principal = 0 WHERE produto_id = ?`,
        [id]
      );
      await pool.query(
        `UPDATE fotos_produto SET principal = 1 WHERE id = ? AND produto_id = ?`,
        [imageId, id]
      );
      res.json({ ok: true });
    } catch (e) {
      console.error("set principal error:", e.message);
      res.status(500).json({ error: "Erro ao definir principal" });
    }
  }
);

module.exports = router;
