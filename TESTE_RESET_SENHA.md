# 🧪 Guia de Testes - Reset de Senha no Insomnia

Este guia mostra como testar o fluxo completo de recuperação de senha usando o Insomnia.

---

## 📋 Pré-requisitos

1. **Banco de dados configurado** com a tabela `password_reset_tokens`
2. **Backend rodando** (geralmente em `http://localhost:3000` ou `http://localhost:5000`)
3. **Insomnia instalado**
4. **Pelo menos 1 usuário cadastrado** no banco de dados

---

## 🔧 Passo 1: Executar a Migration

Antes de testar, execute o script SQL para criar a tabela:

```sql
-- Abra seu cliente MySQL e execute:
USE shophere_db;  -- ou o nome do seu banco

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
```

---

## 🚀 Passo 2: Testar Solicitação de Reset (Forgot Password)

### Configuração da Requisição no Insomnia:

**Método:** `POST`  
**URL:** `http://localhost:3000/api/auth/forgot-password`  
**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "email": "usuario@exemplo.com"
}
```

> ⚠️ **Importante:** Use um email que **EXISTE** no seu banco de dados (tabela `usuarios` ou `comercios`)

### Resposta Esperada (Sucesso):

**Status:** `200 OK`

```json
{
  "message": "Se este email estiver cadastrado, você receberá instruções para redefinir sua senha.",
  "resetUrl": "http://localhost:5173/reset-password?token=abc123def456..."
}
```

> 📝 **Nota:** O campo `resetUrl` só aparece em desenvolvimento. Copie o **token** da URL para usar no próximo passo!

### Console do Backend:

Você verá algo assim no terminal do backend:

```
==============================================
📧 RESET DE SENHA SOLICITADO
==============================================
Email: usuario@exemplo.com
Token: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
Link: http://localhost:5173/reset-password?token=a1b2c3d4e5...
Expira em: 16/10/2025 15:30:45
==============================================
```

### Verificar no Banco de Dados:

```sql
SELECT * FROM password_reset_tokens
WHERE email = 'usuario@exemplo.com'
ORDER BY created_at DESC
LIMIT 1;
```

Você deve ver:

- Um registro com o **token** gerado
- `used = 0` (false)
- `expires_at` = data/hora 1 hora no futuro

---

## 🔑 Passo 3: Testar Redefinição de Senha (Reset Password)

### Configuração da Requisição no Insomnia:

**Método:** `POST`  
**URL:** `http://localhost:3000/api/auth/reset-password`  
**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
  "novaSenha": "minhaNovaSenha123"
}
```

> ⚠️ **Importante:**
>
> - Substitua o `token` pelo token que você recebeu no passo anterior
> - A senha deve ter **pelo menos 6 caracteres**

### Resposta Esperada (Sucesso):

**Status:** `200 OK`

```json
{
  "message": "Senha redefinida com sucesso! Você já pode fazer login."
}
```

### Verificar no Banco de Dados:

```sql
-- 1. Verificar se o token foi marcado como usado
SELECT * FROM password_reset_tokens
WHERE token = 'SEU_TOKEN_AQUI';
-- Deve mostrar: used = 1 (true)

-- 2. Verificar se a senha foi atualizada (hash diferente)
SELECT id, email, senha FROM usuarios
WHERE email = 'usuario@exemplo.com';
-- A senha deve estar com um novo hash bcrypt
```

---

## ✅ Passo 4: Testar Login com Nova Senha

### Configuração da Requisição no Insomnia:

**Método:** `POST`  
**URL:** `http://localhost:3000/api/auth/login`  
**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "email": "usuario@exemplo.com",
  "senha": "minhaNovaSenha123"
}
```

### Resposta Esperada (Sucesso):

**Status:** `200 OK`

```json
{
  "message": "Autenticação realizada com sucesso.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@exemplo.com",
    "nome": "Nome do Usuário",
    "role": "user"
  }
}
```

---

## ⚠️ Cenários de Erro para Testar

### 1. Email não cadastrado

**Request:**

```json
{
  "email": "emailinexistente@exemplo.com"
}
```

**Response:**

```json
{
  "message": "Se este email estiver cadastrado, você receberá instruções para redefinir sua senha."
}
```

> Por segurança, retorna a mesma mensagem!

---

### 2. Token inválido ou expirado

**Request:**

```json
{
  "token": "token_invalido_123",
  "novaSenha": "novaSenha123"
}
```

**Response (400):**

```json
{
  "message": "Token inválido ou expirado. Solicite um novo reset de senha."
}
```

---

### 3. Token já usado

Se você tentar usar o mesmo token duas vezes:

**Response (400):**

```json
{
  "message": "Token inválido ou expirado. Solicite um novo reset de senha."
}
```

---

### 4. Senha muito curta

**Request:**

```json
{
  "token": "token_valido",
  "novaSenha": "123"
}
```

**Response (400):**

```json
{
  "message": "A senha deve ter pelo menos 6 caracteres."
}
```

---

### 5. Campos obrigatórios ausentes

**Request:**

```json
{
  "token": "token_valido"
  // novaSenha ausente
}
```

**Response (400):**

```json
{
  "message": "Token e nova senha são obrigatórios."
}
```

---

## 📦 Collection do Insomnia (Importar)

Salve este JSON em um arquivo e importe no Insomnia:

```json
{
  "name": "Shophere - Reset Password",
  "requests": [
    {
      "name": "1. Forgot Password",
      "method": "POST",
      "url": "{{ base_url }}/api/auth/forgot-password",
      "headers": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"email\": \"usuario@exemplo.com\"\n}"
      }
    },
    {
      "name": "2. Reset Password",
      "method": "POST",
      "url": "{{ base_url }}/api/auth/reset-password",
      "headers": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"token\": \"COLE_O_TOKEN_AQUI\",\n  \"novaSenha\": \"minhaNovaSenha123\"\n}"
      }
    },
    {
      "name": "3. Login (Testar Nova Senha)",
      "method": "POST",
      "url": "{{ base_url }}/api/auth/login",
      "headers": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "body": {
        "mimeType": "application/json",
        "text": "{\n  \"email\": \"usuario@exemplo.com\",\n  \"senha\": \"minhaNovaSenha123\"\n}"
      }
    }
  ],
  "environment": {
    "base_url": "http://localhost:3000"
  }
}
```

---

## 🔍 Checklist de Testes

- [ ] Tabela `password_reset_tokens` criada
- [ ] Backend rodando
- [ ] Solicitar reset com email válido (sucesso)
- [ ] Verificar token no banco de dados
- [ ] Token aparece no console do backend
- [ ] Redefinir senha com token válido (sucesso)
- [ ] Verificar token marcado como `used = true`
- [ ] Login com nova senha (sucesso)
- [ ] Tentar usar mesmo token novamente (erro)
- [ ] Solicitar reset com email inexistente (retorna sucesso mas não cria token)
- [ ] Redefinir com token inválido (erro)
- [ ] Redefinir com senha curta < 6 caracteres (erro)

---

## 🛠️ Troubleshooting

### Erro: "Cannot POST /api/auth/forgot-password"

- Verifique se o backend está rodando
- Confirme a URL base (porta correta)
- Verifique se as rotas estão registradas em `authRoutes.js`

### Erro: "Table 'password_reset_tokens' doesn't exist"

- Execute a migration SQL primeiro
- Verifique se está usando o banco de dados correto

### Token não aparece na resposta (desenvolvimento)

- Verifique se `NODE_ENV=development` está definido no `.env`
- Ou remova a condição no código para sempre retornar

### Senha não está sendo atualizada

- Verifique se o email está correto (case-insensitive)
- Confirme que o token está válido e não expirado
- Veja os logs do backend para erros

---

## 📧 Próximos Passos (Produção)

Para implementar o envio real de emails:

1. Instalar `nodemailer`:

   ```bash
   npm install nodemailer
   ```

2. Configurar serviço de email (Gmail, SendGrid, etc.)

3. Substituir o `console.log` por envio de email real

4. Remover `resetUrl` da resposta da API

---

## 💡 Dicas

- **Tokens expiram em 1 hora** - para testar expiração, você pode alterar o tempo no código
- **Tokens são de uso único** - cada reset precisa de um novo token
- **Segurança:** Mesmo emails não cadastrados retornam "sucesso" para não expor usuários
- **Desenvolvimento:** O token aparece no console e na resposta para facilitar testes
- **Produção:** Tokens devem ser enviados APENAS por email

---

**Boa sorte nos testes! 🚀**
