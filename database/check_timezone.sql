-- 🕐 Verificar Timezone do MySQL vs Sistema

-- 1. Ver timezone do MySQL
SELECT @@global.time_zone, @@session.time_zone;

-- 2. Ver hora atual em diferentes formatos
SELECT 
  NOW() as hora_mysql,
  CURRENT_TIMESTAMP as timestamp_atual,
  UTC_TIMESTAMP() as hora_utc,
  CONVERT_TZ(NOW(), @@session.time_zone, '+00:00') as hora_convertida_utc;

-- 3. Ver diferença entre NOW() e UTC
SELECT 
  NOW() as hora_local,
  UTC_TIMESTAMP() as hora_utc,
  TIMESTAMPDIFF(HOUR, UTC_TIMESTAMP(), NOW()) as diferenca_horas;

-- 4. Ver seus tokens e comparar com NOW()
SELECT 
  id,
  email,
  LEFT(token, 20) as token_inicio,
  created_at,
  expires_at,
  NOW() as hora_atual_mysql,
  TIMESTAMPDIFF(MINUTE, created_at, expires_at) as duracao_token_minutos,
  TIMESTAMPDIFF(MINUTE, NOW(), expires_at) as minutos_para_expirar,
  CASE 
    WHEN expires_at > NOW() THEN '✅ Válido'
    ELSE '❌ Expirado'
  END as status
FROM password_reset_tokens 
ORDER BY created_at DESC 
LIMIT 3;
