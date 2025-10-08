// src/config/db.js
// Este arquivo mantém compatibilidade com o código existente
// mas agora usa a configuração mais robusta do database.js

const pool = require('./database');

module.exports = pool;
