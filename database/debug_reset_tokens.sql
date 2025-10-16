-- 🔍 Script de Debug - Reset de Senha
-- Execute estas queries para diagnosticar o problema

-- 1️⃣ Ver TODOS os tokens criados recentemente
SELECT 
  id,
  email,
  LEFT(token, 20) as token_inicio,
  user_type,
  used,
  expires_at,
  created_at,
  CASE 
    WHEN expires_at > NOW() THEN '✅ Válido'
    ELSE '❌ Expirado'
  END as status_expiracao,
  TIMESTAMPDIFF(MINUTE, NOW(), expires_at) as minutos_restantes
FROM password_reset_tokens 
ORDER BY created_at DESC 
LIMIT 5;

-- 2️⃣ Verificar se o token específico existe (substitua o token completo)
SELECT 
  id,
  email,
  token,
  user_type,
  used,
  expires_at,
  created_at,
  expires_at > NOW() as token_valido,
  used = 0 as nao_usado
FROM password_reset_tokens 
WHERE token = '3b5362024568358d88f1d8235f09995307689294b10450c815226c4023a2761';
-- ⚠️ SUBSTITUA o token acima pelo seu token completo!

-- 3️⃣ Ver a data/hora atual do servidor MySQL
SELECT NOW() as hora_atual_mysql;

-- 4️⃣ Comparar com timezone
SELECT 
  NOW() as hora_servidor,
  CONVERT_TZ(NOW(), 'SYSTEM', 'America/Sao_Paulo') as hora_brasil;

-- 5️⃣ Ver tokens expirados vs não expirados
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN expires_at > NOW() THEN 1 ELSE 0 END) as validos,
  SUM(CASE WHEN expires_at <= NOW() THEN 1 ELSE 0 END) as expirados,
  SUM(CASE WHEN used = 1 THEN 1 ELSE 0 END) as usados,
  SUM(CASE WHEN used = 0 THEN 1 ELSE 0 END) as nao_usados
FROM password_reset_tokens;
