// src/config/database.js
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

// Configuração para diferentes ambientes
const getDatabaseConfig = () => {
  const baseConfig = {
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Removido acquireTimeout e timeout que causam warnings no MySQL2
  };

  // Produção AlwaysData
  if (
    process.env.NODE_ENV === "production" &&
    process.env.DB_HOST?.includes("alwaysdata")
  ) {
    return {
      ...baseConfig,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      ssl: false, // AlwaysData não requer SSL para conexões internas
      timezone: "+00:00",
      charset: "utf8mb4",
    };
  }

  // Produção (Vercel + PlanetScale)
  if (process.env.NODE_ENV === "production") {
    return {
      ...baseConfig,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: true,
      },
    };
  }

  // Staging (Vercel Preview + PlanetScale Develop Branch)
  if (process.env.NODE_ENV === "staging") {
    return {
      ...baseConfig,
      host: process.env.DB_HOST_STAGING,
      user: process.env.DB_USER_STAGING,
      password: process.env.DB_PASSWORD_STAGING,
      database: process.env.DB_NAME_STAGING,
      ssl: {
        rejectUnauthorized: true,
      },
    };
  }

  // Desenvolvimento local (usando AlwaysData remotamente)
  if (
    process.env.NODE_ENV === "development" &&
    process.env.DB_HOST?.includes("alwaysdata")
  ) {
    return {
      ...baseConfig,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      ssl: false, // AlwaysData não requer SSL para conexões externas MySQL
      timezone: "+00:00",
      charset: "utf8mb4",
      connectTimeout: 30000,
      acquireTimeout: 30000,
      reconnect: true,
    };
  }

  // Desenvolvimento local (MySQL local)
  return {
    ...baseConfig,
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "shophere_db",
    port: process.env.DB_PORT || 3306,
  };
};

const pool = mysql.createPool(getDatabaseConfig());

// Teste de conexão
pool
  .getConnection()
  .then((connection) => {
    console.log("✅ Database connected successfully");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });

module.exports = pool;
