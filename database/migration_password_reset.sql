-- Migration: Tabela para tokens de reset de senha
-- Execute este script no seu banco de dados MySQL

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  user_type ENUM('user', 'commerce') NOT NULL DEFAULT 'user',
  expires_at DATETIME NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_token (token),
  INDEX idx_email_expires (email, expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Adiciona comentário na tabela
ALTER TABLE password_reset_tokens 
COMMENT = 'Armazena tokens temporários para recuperação de senha';
