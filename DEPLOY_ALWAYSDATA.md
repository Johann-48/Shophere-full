# Guia Completo de Deploy - AlwaysData

## 🚀 Tutorial Passo a Passo para Deploy no AlwaysData

### Pré-requisitos

- [ ] Projeto Shophere funcionando localmente
- [ ] Node.js e npm instalados
- [ ] Conta no AlwaysData criada

---

## 📋 FASE 1: Preparação Local

### 1.1 Fazer Build do Frontend

```bash
cd frontend
npm run build
```

✅ **Resultado**: Pasta `frontend/dist/` criada com arquivos otimizados

### 1.2 Verificar Configuração do Backend

```bash
# Verificar se todas as dependências estão corretas
cd backend
npm install
npm run dev  # Testar se funciona localmente
```

---

## 🌐 FASE 2: Configuração no AlwaysData

### 2.1 Criar Conta e Database

1. **Registrar-se**: https://www.alwaysdata.com/
2. **Escolher plano**:

   - **Gratuito**: 100MB MySQL + 100MB web hosting
   - **Pack 10**: €3/mês - 1GB MySQL + 10GB hosting (recomendado)

3. **Criar Database MySQL**:

   ```
   Painel Admin → Databases → MySQL → Add a MySQL database
   Nome: shophere_db
   Encoding: utf8mb4
   Collation: utf8mb4_unicode_ci
   ```

4. **Anotar credenciais** (exemplo):
   ```
   Host: mysql-joao123.alwaysdata.net
   Database: joao123_shophere_db
   User: joao123
   Password: suasenhamysql
   Port: 3306
   ```

### 2.2 Importar Schema do Database

1. **Acessar phpMyAdmin**:

   - Painel: Databases → MySQL → phpMyAdmin
   - URL: https://phpmyadmin.alwaysdata.com/

2. **Importar arquivo SQL**:

   - Selecionar database criado
   - Import → Choose File → Selecionar `database/schema.sql`
   - Execute

3. **Verificar tabelas criadas**:
   - users, categories, commerces, products, etc.

---

## 📁 FASE 3: Preparação dos Arquivos

### 3.1 Criar Arquivo de Configuração de Produção

Criar arquivo `.env` para produção:

```env
NODE_ENV=production
DB_HOST=mysql-joao123.alwaysdata.net
DB_USER=joao123
DB_PASSWORD=suasenhamysql
DB_NAME=joao123_shophere_db
DB_PORT=3306
JWT_SECRET=sua_chave_jwt_de_32_caracteres_ou_mais
FRONTEND_URL=https://joao123.alwaysdata.net
BACKEND_URL=https://joao123.alwaysdata.net/api
UPLOAD_DIR=/www/uploads/
MAX_FILE_SIZE=5242880
```

### 3.2 Estrutura de Arquivos para Upload

```
deploy/
└── www/
    ├── index.html (do frontend/dist/)
    ├── assets/ (do frontend/dist/)
    ├── .htaccess
    ├── uploads/ (pasta para uploads)
    └── api/
        ├── src/
        ├── package.json
        ├── .env
        └── node_modules/ (será criado após npm install)
```

---

## 📤 FASE 4: Upload dos Arquivos

### 4.1 Conexão FTP/SFTP

**Credenciais de FTP**:

```
Host: ftp-joao123.alwaysdata.net
Username: joao123
Password: suasenhaftp
Port: 21 (FTP) ou 22 (SFTP)
```

**Clientes FTP recomendados**:

- FileZilla (gratuito)
- WinSCP (Windows)
- Interface web do AlwaysData

### 4.2 Upload dos Arquivos

1. **Frontend** → `/www/` (raiz)

   - Copiar todo conteúdo de `frontend/dist/`

2. **Backend** → `/www/api/`

   - Copiar pasta `backend/src/`
   - Copiar `backend/package.json`
   - Copiar arquivo `.env` criado

3. **Configurações** → `/www/`

   - Copiar `.htaccess`

4. **Criar pasta uploads** → `/www/uploads/`

---

## ⚙️ FASE 5: Configuração do Node.js

### 5.1 Ativar Node.js no Painel

1. **Web → Sites → [seu site]**
2. **Type**: Node.js
3. **Configurações**:
   ```
   Application path: /www/api
   Startup file: src/index.js
   Environment: production
   Node.js version: 18+ (última LTS)
   ```

### 5.2 Configurar Variáveis de Ambiente

**Environment → Environment variables**:

```
NODE_ENV=production
DB_HOST=mysql-joao123.alwaysdata.net
DB_USER=joao123
DB_PASSWORD=suasenhamysql
DB_NAME=joao123_shophere_db
JWT_SECRET=sua_chave_jwt
FRONTEND_URL=https://joao123.alwaysdata.net
BACKEND_URL=https://joao123.alwaysdata.net/api
```

### 5.3 Instalar Dependências

**Via Terminal SSH** (se disponível):

```bash
cd /www/api
npm install --production
```

**Via Interface Web**:

- Tasks → Create task
- Command: `cd /www/api && npm install --production`

---

## 🧪 FASE 6: Testes e Verificação

### 6.1 Verificar Frontend

```
✅ Acessar: https://joao123.alwaysdata.net
✅ Página inicial deve carregar
✅ Navegação entre páginas funcionando
```

### 6.2 Verificar API

```
✅ Acessar: https://joao123.alwaysdata.net/api/health
✅ Retorna: {"status": "OK", "timestamp": "..."}
```

### 6.3 Verificar Database

```
✅ Cadastrar novo usuário
✅ Fazer login
✅ Criar produto/comércio
✅ Verificar dados no phpMyAdmin
```

### 6.4 Verificar Upload de Arquivos

```
✅ Upload de imagem de produto
✅ Upload de avatar do usuário
✅ Arquivos salvos em /www/uploads/
```

---

## 🔧 FASE 7: Troubleshooting

### Problemas Comuns e Soluções

#### ❌ Erro 500 - Internal Server Error

**Solução**:

1. Verificar logs: Logs → Task logs
2. Conferir variáveis de ambiente
3. Verificar se Node.js está ativo

#### ❌ Erro de Conexão com Database

**Solução**:

```javascript
// Verificar configuração no database.js
ssl: false, // Para AlwaysData
timezone: '+00:00'
```

#### ❌ Erro de CORS

**Solução**:

```javascript
// No backend, verificar configuração CORS
app.use(
  cors({
    origin: ["https://joao123.alwaysdata.net", "http://localhost:3000"],
    credentials: true,
  })
);
```

#### ❌ Arquivos de Upload não funcionam

**Solução**:

1. Verificar permissões da pasta /www/uploads/
2. Configurar UPLOAD_DIR corretamente
3. Verificar MAX_FILE_SIZE

---

## 📊 FASE 8: Monitoramento

### 8.1 Logs e Monitoramento

- **HTTP Logs**: Logs → HTTP logs
- **Application Logs**: Logs → Task logs
- **Performance**: Advanced → Statistics

### 8.2 Backup e Manutenção

- **Database Backup**: Databases → Export
- **Files Backup**: Files → Download folder
- **Agendar backups automáticos**

---

## ✅ Checklist Final

### Pré-Deploy

- [ ] Build do frontend concluído
- [ ] Database criado no AlwaysData
- [ ] Schema importado via phpMyAdmin
- [ ] Credenciais anotadas

### Deploy

- [ ] Arquivos enviados via FTP
- [ ] Node.js configurado e ativo
- [ ] Variáveis de ambiente definidas
- [ ] Dependências instaladas

### Pós-Deploy

- [ ] Frontend carregando
- [ ] API respondendo
- [ ] Database conectando
- [ ] Upload funcionando
- [ ] Logs sem erros críticos

### Produção

- [ ] Backup configurado
- [ ] Monitoramento ativo
- [ ] Performance adequada
- [ ] SSL ativo (HTTPS)

---

## 🎉 Parabéns!

Seu projeto Shophere está agora rodando em produção no AlwaysData!

**URLs de acesso**:

- Frontend: https://[sua-conta].alwaysdata.net
- API: https://[sua-conta].alwaysdata.net/api
- phpMyAdmin: https://phpmyadmin.alwaysdata.com

**Próximos passos**:

1. Configurar domínio personalizado (opcional)
2. Implementar sistema de backup automático
3. Configurar CDN para assets (opcional)
4. Monitorar performance e logs regularmente
