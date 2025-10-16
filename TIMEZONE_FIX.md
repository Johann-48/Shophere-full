# 🕐 Solução: Problema de Timezone no Reset de Senha

## 🚨 O Problema

Quando há diferença de timezone entre o servidor Node.js e o MySQL, tokens podem:

- ❌ Expirar imediatamente
- ❌ Nunca expirar
- ❌ Ter comportamento inconsistente

### Exemplo do Problema:

```javascript
// Backend Node.js (seu PC - Horário de Brasília UTC-3)
const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
// Gera: 2025-10-16 14:30:00

// Mas o MySQL pode estar em UTC (3 horas à frente)
// MySQL NOW() retorna: 2025-10-16 17:30:00

// Quando você salva no banco:
// expires_at = 2025-10-16 14:30:00 (do Node.js)

// Quando verifica no banco:
// WHERE expires_at > NOW()
// WHERE 14:30:00 > 17:30:00  ❌ FALSO! Token "expirado"
```

---

## ✅ A Solução

**Usar a função `DATE_ADD()` do MySQL** ao invés de gerar a data no Node.js:

### Antes (❌ Problemático):

```javascript
const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
await pool.query(
  `INSERT INTO password_reset_tokens (..., expires_at) VALUES (?, ?, ?, ?)`,
  [email, token, userType, expiresAt] // ❌ Data do Node.js
);
```

### Depois (✅ Correto):

```javascript
await pool.query(
  `INSERT INTO password_reset_tokens (..., expires_at) 
   VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))`,
  [email, token, userType] // ✅ MySQL calcula a data
);
```

---

## 🔍 Por que Funciona?

- **`NOW()`** → Hora atual do MySQL
- **`DATE_ADD(NOW(), INTERVAL 1 HOUR)`** → Hora atual do MySQL + 1 hora
- **Ambos usam o mesmo timezone** → Consistente! ✅

Quando verifica:

```sql
WHERE expires_at > NOW()
```

Ambos os lados usam o timezone do MySQL! 🎯

---

## 📊 Verificar o Problema

Execute este script SQL para diagnosticar:

```sql
-- Ver timezone do MySQL
SELECT @@global.time_zone, @@session.time_zone;

-- Ver diferenças de hora
SELECT
  NOW() as hora_mysql,
  UTC_TIMESTAMP() as hora_utc,
  TIMESTAMPDIFF(HOUR, UTC_TIMESTAMP(), NOW()) as diferenca_horas;

-- Ver seus tokens
SELECT
  id,
  email,
  LEFT(token, 20) as token_inicio,
  created_at,
  expires_at,
  NOW() as hora_atual_mysql,
  TIMESTAMPDIFF(MINUTE, NOW(), expires_at) as minutos_para_expirar,
  CASE
    WHEN expires_at > NOW() THEN '✅ Válido'
    ELSE '❌ Expirado'
  END as status
FROM password_reset_tokens
ORDER BY created_at DESC
LIMIT 3;
```

### Interpretação:

Se você ver algo como:

```
expires_at: 2025-10-16 14:30:00
NOW():      2025-10-16 17:30:00
minutos_para_expirar: -180  (❌ negativo = expirado)
```

**Isso confirma o problema de timezone!**

---

## 🧪 Testar a Solução

### 1. Reinicie o backend

```bash
# Ctrl+C para parar
npm run dev
```

### 2. Gere um novo token

```http
POST http://localhost:3000/api/auth/forgot-password
{
  "email": "usuario@exemplo.com"
}
```

**Agora você verá no console:**

```
==============================================
📧 RESET DE SENHA SOLICITADO
==============================================
Email: usuario@exemplo.com
Token: abc123...
Tamanho: 64 caracteres
Link: http://localhost:5173/reset-password?token=abc123...
Expira em (MySQL): 2025-10-16T17:30:00.000Z
Hora local: 16/10/2025 14:30:00
==============================================
```

### 3. Verifique no banco

```sql
SELECT
  expires_at,
  NOW() as hora_atual,
  TIMESTAMPDIFF(MINUTE, NOW(), expires_at) as minutos_restantes
FROM password_reset_tokens
ORDER BY created_at DESC
LIMIT 1;
```

Agora deve mostrar **60 minutos restantes**! ✅

### 4. Tente resetar a senha

```http
POST http://localhost:3000/api/auth/reset-password
{
  "token": "SEU_TOKEN_AQUI",
  "novaSenha": "novaSenha123"
}
```

**Deve funcionar!** ✅

---

## 🎯 Vantagens da Solução

✅ **Independente do timezone** do Node.js  
✅ **Consistente** - tudo usa hora do MySQL  
✅ **Preciso** - sempre expira em exatamente 1 hora  
✅ **Simples** - sem conversões complexas  
✅ **Confiável** - funciona em qualquer ambiente

---

## 🌍 Outros Cenários de Timezone

### Cenário 1: MySQL em UTC, Node.js em Brasília

- ✅ **Solução funciona** - usa hora do MySQL

### Cenário 2: MySQL e Node.js em timezones diferentes

- ✅ **Solução funciona** - usa hora do MySQL

### Cenário 3: Servidor em cloud (AWS, Vercel, etc)

- ✅ **Solução funciona** - usa hora do MySQL

### Cenário 4: Desenvolvimento local vs Produção

- ✅ **Solução funciona** - sempre consistente

---

## 📝 Alterações Feitas

### Arquivo: `authController.js`

**Função `forgotPassword`:**

- ❌ Removido: `const expiresAt = new Date(...)`
- ✅ Adicionado: `DATE_ADD(NOW(), INTERVAL 1 HOUR)` na query
- ✅ Busca o `expires_at` real do banco após inserir
- ✅ Mostra no log a hora do MySQL e hora local

**Função `resetPassword`:**

- ✅ Mantido: `WHERE expires_at > NOW()`
- ✅ Agora funciona porque ambos usam hora do MySQL

---

## 🔧 Configurações Opcionais do MySQL

Se quiser garantir timezone específico no MySQL:

### Ver timezone atual:

```sql
SELECT @@global.time_zone, @@session.time_zone;
```

### Alterar para Brasília (UTC-3):

```sql
SET GLOBAL time_zone = '-03:00';
SET time_zone = '-03:00';
```

### Alterar para UTC:

```sql
SET GLOBAL time_zone = '+00:00';
SET time_zone = '+00:00';
```

**Mas com nossa solução, isso não é necessário!** 🎉

---

## ✅ Checklist de Teste

- [ ] Código atualizado (authController.js)
- [ ] Backend reiniciado
- [ ] Novo token gerado
- [ ] Token não expira imediatamente
- [ ] Query no banco mostra ~60 minutos restantes
- [ ] Reset de senha funciona
- [ ] Login com nova senha funciona

---

## 💡 Dica Final

Se você ainda tiver problemas:

1. Execute `check_timezone.sql`
2. Verifique os logs do backend
3. Compare hora do MySQL vs hora local
4. Me envie os resultados!

---

**Problema de timezone resolvido! 🚀✨**
