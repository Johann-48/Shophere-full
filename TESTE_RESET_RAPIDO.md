# 🚀 Teste Rápido - Reset de Senha no Insomnia

## 📌 Resumo dos Passos

```
1. Criar tabela no banco
   ↓
2. Solicitar reset (POST /forgot-password)
   ↓
3. Pegar token da resposta/console
   ↓
4. Resetar senha (POST /reset-password)
   ↓
5. Fazer login com nova senha
```

---

## ⚡ Teste Rápido (3 minutos)

### 1️⃣ Criar Tabela (Execute no MySQL):

```sql
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
);
```

### 2️⃣ Importar Collection no Insomnia:

**Arquivo:** `insomnia_reset_password_collection.json`

1. Abra o Insomnia
2. Menu → Import/Export → Import Data
3. Selecione o arquivo `insomnia_reset_password_collection.json`
4. Pronto! ✅

### 3️⃣ Configurar URL Base:

No Insomnia, clique em "Manage Environments" e ajuste:

```json
{
  "base_url": "http://localhost:3000",
  "reset_token": ""
}
```

> ⚠️ Ajuste a porta se seu backend estiver em outra (ex: 5000)

### 4️⃣ Executar Testes:

#### Passo A: Solicitar Reset

```http
POST http://localhost:3000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "seu_email_cadastrado@exemplo.com"
}
```

**Resposta esperada:**

```json
{
  "message": "Se este email estiver cadastrado...",
  "resetUrl": "http://localhost:5173/reset-password?token=ABC123..."
}
```

✅ **Copie o token!** (tudo após `?token=`)

#### Passo B: Resetar Senha

```http
POST http://localhost:3000/api/auth/reset-password
Content-Type: application/json

{
  "token": "COLE_O_TOKEN_AQUI",
  "novaSenha": "minhaSenha123"
}
```

**Resposta esperada:**

```json
{
  "message": "Senha redefinida com sucesso! Você já pode fazer login."
}
```

#### Passo C: Fazer Login

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "seu_email_cadastrado@exemplo.com",
  "senha": "minhaSenha123"
}
```

**Resposta esperada:**

```json
{
  "message": "Autenticação realizada com sucesso.",
  "token": "eyJhbGc...",
  "user": { ... }
}
```

---

## 🎯 Checklist Rápido

- [ ] Tabela criada
- [ ] Backend rodando
- [ ] Collection importada
- [ ] URL configurada
- [ ] Email de teste válido
- [ ] Request 1: Forgot Password → Pegar token
- [ ] Request 2: Reset Password → Senha alterada
- [ ] Request 3: Login → Funcionou!

---

## 🔍 Verificar no Banco

```sql
-- Ver tokens criados
SELECT * FROM password_reset_tokens ORDER BY created_at DESC LIMIT 5;

-- Ver se token foi usado
SELECT id, email, token, used, expires_at
FROM password_reset_tokens
WHERE email = 'seu_email@exemplo.com';
```

---

## 📸 Screenshots Esperados

### 1. Forgot Password

```
Status: 200 OK
Tempo: ~200ms
Body: { message: "...", resetUrl: "..." }
```

### 2. Reset Password

```
Status: 200 OK
Tempo: ~150ms
Body: { message: "Senha redefinida com sucesso!" }
```

### 3. Login

```
Status: 200 OK
Tempo: ~180ms
Body: { token: "...", user: {...} }
```

---

## ⚠️ Problemas Comuns

| Erro                                    | Solução                                  |
| --------------------------------------- | ---------------------------------------- |
| "Cannot POST /api/auth/forgot-password" | Backend não está rodando                 |
| "Table doesn't exist"                   | Execute a migration SQL                  |
| "Token inválido"                        | Use um token novo (tokens expiram em 1h) |
| "Email não encontrado"                  | Use um email cadastrado no banco         |
| 401 no login                            | Senha incorreta ou não foi alterada      |

---

## 🎉 Pronto!

Se todos os testes passaram, seu sistema de reset de senha está funcionando! 🚀

**Próximo passo:** Integrar com serviço de email (nodemailer, SendGrid, etc.)
