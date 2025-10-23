const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  listMensagens,
  createMensagem,
  deleteMensagem,
} = require("../controllers/mensagemController");

router.get("/", listMensagens);
router.post("/", createMensagem);
router.delete("/:mensagemId", deleteMensagem);

module.exports = router;
