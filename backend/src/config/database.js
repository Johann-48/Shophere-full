// src/config/database.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Configuração para diferentes ambientes
const getDatabaseConfig = () => {
  const baseConfig = {
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
  };

  // Produção (Vercel + PlanetScale)
  if (process.env.NODE_ENV === 'production') {
    return {
      ...baseConfig,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: true
      }
    };
  }

  // Staging (Vercel Preview + PlanetScale Develop Branch)
  if (process.env.NODE_ENV === 'staging') {
    return {
      ...baseConfig,
      host: process.env.DB_HOST_STAGING,
      user: process.env.DB_USER_STAGING,
      password: process.env.DB_PASSWORD_STAGING,
      database: process.env.DB_NAME_STAGING,
      ssl: {
        rejectUnauthorized: true
      }
    };
  }

  // Desenvolvimento local
  return {
    ...baseConfig,
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'shophere_db',
  };
};

const pool = mysql.createPool(getDatabaseConfig());

// Teste de conexão
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });

module.exports = pool;