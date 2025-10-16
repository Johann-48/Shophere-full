# 🔧 Troubleshooting - Token Inválido no Reset de Senha

## 🚨 Problema

Token é gerado corretamente, aparece no banco com `used = 0`, mas ao tentar resetar a senha retorna "Token inválido ou expirado".

---

## 🔍 Diagnóstico

### Passo 1: Verificar o Token no Banco de Dados

Execute no MySQL:

```sql
-- Ver tokens recentes
SELECT
  id,
  email,
  LEFT(token, 30) as token_preview,
  used,
  expires_at,
  created_at,
  expires_at > NOW() as ainda_valido,
  TIMESTAMPDIFF(MINUTE, NOW(), expires_at) as minutos_restantes
FROM password_reset_tokens
ORDER BY created_at DESC
LIMIT 3;
```

**O que verificar:**

- ✅ `used` = 0 (não usado)
- ✅ `ainda_valido` = 1 (não expirado)
- ✅ `minutos_restantes` > 0 (tem tempo restante)

---

### Passo 2: Comparar o Token

**No Console do Backend** (quando você solicita o reset):

```
Token: 3b5362024568358d88f1d8235f09995307689294b10450c815226c4023a2761
```

**No Insomnia** (quando você envia para reset):

```json
{
  "token": "3b5362024568358d88f1d8235f09995307689294b10450c815226c4023a2761"
}
```

⚠️ **ATENÇÃO:**

- Tokens devem ser **EXATAMENTE iguais**
- Sem espaços extras
- Sem aspas dentro do valor
- 64 caracteres hexadecimais

---

### Passo 3: Ver Logs de Debug

Agora o backend vai mostrar logs detalhados. Faça a requisição de reset e veja no console:

```
🔍 DEBUG - Reset Password:
Token recebido: 3b536202...
Tamanho do token: 64
Tokens encontrados: 1
Token no banco: {
  id: 1,
  email: 'usuario@exemplo.com',
  used: 0,
  is_used: 0,
  expires_at: 2025-10-16T17:30:00.000Z,
  is_valid_time: 1,
  created_at: 2025-10-16T16:30:00.000Z
}
Tokens válidos (após filtros): 1
```

---

## 🐛 Possíveis Causas e Soluções

### 1️⃣ **Token com Espaços ou Caracteres Extras**

**Problema:** Token copiado com espaços ou quebras de linha

**Solução:**

- Copie o token diretamente do campo `resetUrl` na resposta do Insomnia
- Ou copie do console do backend
- Remova qualquer espaço ou quebra de linha

**Teste:**

```javascript
// Token CORRETO (64 caracteres)
"3b5362024568358d88f1d8235f09995307689294b10450c815226c4023a2761";

// Token ERRADO (com espaços)
"3b536202 4568358d 88f1d823 5f099953 07689294 b10450c8 15226c40 23a2761";

// Token ERRADO (com quebra de linha)
"3b5362024568358d88f1d8235f09995307689294b10450c815226c4023a2761\n";
```

---

### 2️⃣ **Token Expirado (mais de 1 hora)**

**Problema:** Token foi gerado há mais de 1 hora

**Verificar:**

```sql
SELECT
  token,
  expires_at,
  NOW() as hora_atual,
  TIMESTAMPDIFF(MINUTE, NOW(), expires_at) as minutos_restantes
FROM password_reset_tokens
WHERE token = 'SEU_TOKEN_AQUI';
```

**Solução:**

- Se `minutos_restantes` é negativo, o token expirou
- Gere um novo token (faça nova requisição /forgot-password)

---

### 3️⃣ **Problema de Timezone**

**Problema:** Horário do banco está diferente do servidor

**Verificar:**

```sql
SELECT
  NOW() as hora_mysql,
  CONVERT_TZ(NOW(), 'SYSTEM', 'America/Sao_Paulo') as hora_brasil;
```

**Solução:** Ajustar timezone no MySQL ou no código

---

### 4️⃣ **Token Sendo Modificado na Requisição**

**Problema:** Token sendo alterado pelo Insomnia/Navegador

**Teste no Insomnia:**

1. Vá em **Body** → **JSON**
2. Certifique-se que está assim:

```json
{
  "token": "3b5362024568358d88f1d8235f09995307689294b10450c815226c4023a2761",
  "novaSenha": "teste123"
}
```

3. **NÃO use** variáveis de ambiente para o token inicialmente (para debug)

---

### 5️⃣ **Tipo de Dado do Campo `used`**

**Problema:** Campo `used` pode estar como string em vez de boolean

**Verificar:**

```sql
DESCRIBE password_reset_tokens;
```

Deve mostrar:

```
Field      | Type
-----------+-------------
used       | tinyint(1)
```

**Solução no código:** Mudei `used = FALSE` para `used = 0` (mais compatível)

---

## ✅ Checklist de Verificação

Execute este checklist:

- [ ] Tabela `password_reset_tokens` existe
- [ ] Token foi gerado (aparece no console do backend)
- [ ] Token está salvo no banco (query retorna 1 linha)
- [ ] Campo `used` = 0
- [ ] Token não expirou (`expires_at > NOW()`)
- [ ] Token copiado é EXATAMENTE igual ao do banco
- [ ] Token tem 64 caracteres
- [ ] Sem espaços, quebras de linha ou caracteres extras
- [ ] Backend está rodando
- [ ] Logs de debug aparecem no console

---

## 🧪 Teste Completo

### 1. Gerar novo token:

```http
POST http://localhost:3000/api/auth/forgot-password
{
  "email": "usuario@exemplo.com"
}
```

### 2. Copiar token da resposta:

```json
{
  "resetUrl": "http://localhost:5173/reset-password?token=ABC123..."
}
```

Copie apenas: `ABC123...`

### 3. Verificar no banco:

```sql
SELECT * FROM password_reset_tokens
WHERE email = 'usuario@exemplo.com'
ORDER BY created_at DESC
LIMIT 1;
```

### 4. Resetar senha:

```http
POST http://localhost:3000/api/auth/reset-password
{
  "token": "COLE_TOKEN_AQUI_SEM_ESPACOS",
  "novaSenha": "novaSenha123"
}
```

### 5. Ver logs no console do backend:

```
🔍 DEBUG - Reset Password:
Token recebido: ABC123...
Tamanho do token: 64
Tokens encontrados: 1
Tokens válidos (após filtros): 1
```

---

## 💡 Dica Rápida

Se os logs mostram:

- `Tokens encontrados: 1` → Token existe no banco ✅
- `Tokens válidos (após filtros): 0` → Token expirou ou foi usado ❌

Se os logs mostram:

- `Tokens encontrados: 0` → Token não existe ou está diferente ❌

---

## 🔧 Solução Temporária (Para Testes)

Se você quer testar rapidamente, pode atualizar manualmente no banco:

```sql
-- Atualizar expiry para mais 1 hora
UPDATE password_reset_tokens
SET expires_at = DATE_ADD(NOW(), INTERVAL 1 HOUR)
WHERE token = 'SEU_TOKEN_AQUI';

-- Marcar como não usado
UPDATE password_reset_tokens
SET used = 0
WHERE token = 'SEU_TOKEN_AQUI';
```

---

## 📞 Próximos Passos

1. Execute as queries de debug
2. Faça uma nova requisição de reset
3. Veja os logs no console do backend
4. Me envie os logs para eu ajudar a identificar o problema exato!

---

**Boa sorte! 🚀**
