# Migração do Banco de Dados para a Nuvem

## Opções de Banco de Dados MySQL na Nuvem

### 1. AlwaysData (Recomendado - Hosting + Database)

- **Plano gratuito**: 100MB MySQL database + 100MB web hosting
- **Planos pagos**: A partir de €3/mês (1GB database + hosting)
- **Vantagens**: Hosting completo, phpMyAdmin incluído, suporte brasileiro
- **Site**: https://www.alwaysdata.com/
- **Setup**: Criar conta → Criar database → Deploy aplicação

### 2. PlanetScale (Apenas Database)

- **Plano gratuito**: 5GB de armazenamento, 1 bilhão de leituras/mês
- **Vantagens**: Criado para MySQL, branching de schema, auto-scaling
- **Site**: https://planetscale.com/
- **Setup**: Criar conta → Criar database → Obter connection string

### 3. Railway (Database + Hosting)

- **Plano gratuito**: $5 de crédito por mês
- **Vantagens**: Deploy fácil, integração com GitHub
- **Site**: https://railway.app/

### 4. Supabase (PostgreSQL)

- **Plano gratuito**: 500MB database, 2GB transfer
- **Vantagens**: PostgreSQL com recursos avançados, APIs automáticas
- **Site**: https://supabase.com/

## Configuração Recomendada: AlwaysData (Hosting Completo)

### Tutorial Completo para Deploy no AlwaysData

#### Passo 1: Criar Conta no AlwaysData

1. **Acessar o site**

   - Vá para https://www.alwaysdata.com/
   - Clique em "Sign up" ou "Créer un compte"

2. **Escolher plano**

   - **Gratuito**: 100MB MySQL + 100MB hosting (ideal para testes)
   - **Pack 10**: €3/mês - 1GB MySQL + 10GB hosting (recomendado para produção)

3. **Completar registro**
   - Preencha dados pessoais
   - Confirme email
   - Escolha um subdomínio (ex: seuprojeto.alwaysdata.net)

#### Passo 2: Configurar Database MySQL

1. **Acessar painel administrativo**

   - Faça login em https://admin.alwaysdata.com/

2. **Criar database MySQL**

   ```
   Databases → MySQL → Add a MySQL database
   Nome: johann_shophere_db
   Encoding: utf8mb4
   Collation: utf8mb4_unicode_ci
   ```

3. **Anotar credenciais**
   ```
   Host: mysql-johann.alwaysdata.net
   Database: johann_shophere_db
   User: johann
   Password: minha senha
   Port: 3306
   ```

#### Passo 3: Importar Schema do Banco

1. **Acessar phpMyAdmin**

   - No painel: Databases → MySQL → phpMyAdmin
   - Ou acesse: https://phpmyadmin.alwaysdata.com/

2. **Importar schema**

   - Selecione seu database
   - Clique em "Import"
   - Escolha o arquivo `sistemacomercioslocais (11).sql` (ou use `database/current_schema.sql` se copiou para o projeto)
   - Execute a importação

3. **Verificar tabelas criadas**
   - Confirme que todas as tabelas foram criadas:
     - users
     - categories
     - commerces
     - products
     - avaliacoes_produto
     - mensagens
     - chat_rooms

#### Passo 4: Preparar Aplicação para Deploy

1. **Criar arquivo .env para produção**

   ```env
   # Configurações do Database AlwaysData
   NODE_ENV=production
   DB_HOST=mysql-johann.alwaysdata.net
   DB_USER=johann
   DB_PASSWORD=[sua_senha_mysql]
   DB_NAME=johann_shophere_db
   DB_PORT=3306

   # JWT Secret (gere uma chave segura)
   JWT_SECRET=sua_chave_jwt_super_secreta_aqui

   # URLs para CORS
   FRONTEND_URL=https://johann.alwaysdata.net
   BACKEND_URL=https://johann.alwaysdata.net/api

   # Upload settings
   UPLOAD_DIR=uploads/
   MAX_FILE_SIZE=5242880
   ```

2. **Atualizar package.json do backend**
   ```json
   {
     "scripts": {
       "start": "node src/index.js",
       "dev": "nodemon src/index.js",
       "build": "echo 'No build step needed for Node.js'"
     },
     "engines": {
       "node": ">=18.0.0",
       "npm": ">=8.0.0"
     }
   }
   ```

#### Passo 5: Deploy da Aplicação

1. **Preparar arquivos para upload**

   ```bash
   # No seu projeto local, criar build do frontend
   cd frontend
   npm run build

   # O build será criado em frontend/dist/
   ```

2. **Upload via FTP/SFTP**

   - **Método 1: Interface Web**

     - Vá para "Files" no painel AlwaysData
     - Upload pasta `backend/` para `/www/api/`
     - Upload pasta `frontend/dist/` para `/www/`

   - **Método 2: FTP Client (Recomendado)**
     ```
     Host: ftp-johann.alwaysdata.net
     Username: johann
     Password: [sua_senha_ftp]
     Port: 21 (FTP) ou 22 (SFTP)
     ```

3. **Estrutura final no servidor**
   ```
   /www/
   ├── index.html (frontend)
   ├── assets/ (frontend assets)
   ├── api/ (backend)
   │   ├── src/
   │   ├── package.json
   │   ├── .env
   │   └── node_modules/
   └── uploads/ (pasta para uploads)
   ```

#### Passo 6: Configurar Node.js no AlwaysData

1. **Ativar Node.js**

   - Vá para "Web → Sites"
   - Clique no seu site
   - Em "Type": selecione "Node.js"

2. **Configurar aplicação Node.js**

   ```
   Application path: /www/api
   Startup file: src/index.js
   Environment: production
   Node.js version: 18 ou superior
   ```

3. **Configurar reescrita de URL**

   - Adicione um arquivo `.htaccess` na pasta `/www/`:

   ```apache
   # Redirecionar API para Node.js
   RewriteEngine On
   RewriteRule ^api/(.*)$ http://localhost:8080/$1 [P,L]

   # SPA fallback para frontend React
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteCond %{REQUEST_URI} !^/api/
   RewriteRule . /index.html [L]
   ```

#### Passo 7: Instalar Dependências e Iniciar

1. **Via terminal SSH (se disponível)**

   ```bash
   cd /www/api
   npm install --production
   ```

2. **Ou via interface web**

   - Vá para "Tasks" no painel
   - Crie uma tarefa para executar `npm install`

3. **Iniciar aplicação**
   - A aplicação deve iniciar automaticamente
   - Verifique em "Processes" se está rodando

#### Passo 8: Configurar Variáveis de Ambiente

1. **No painel AlwaysData**

   - Vá para "Environment → Environment variables"
   - Adicione todas as variáveis do arquivo .env:

   ```
   NODE_ENV=production
   DB_HOST=mysql-johann.alwaysdata.net
   DB_USER=johann
   DB_PASSWORD=[sua_senha_mysql]
   DB_NAME=johann_shophere_db
   JWT_SECRET=[sua_chave_jwt]
   FRONTEND_URL=https://johann.alwaysdata.net
   ```

#### Passo 9: Testar a Aplicação

1. **Verificar frontend**

   - Acesse: https://johann.alwaysdata.net
   - Deve carregar a página inicial do Shophere

2. **Testar API**

   - Acesse: https://johann.alwaysdata.net/api/health
   - Deve retornar status da API

3. **Testar database**
   - Tente fazer login/cadastro
   - Verifique se dados são salvos no MySQL

#### Passo 10: Monitoramento e Logs

1. **Visualizar logs**

   - Painel: "Logs → HTTP logs"
   - Para erros Node.js: "Logs → Task logs"

2. **Monitorar performance**
   - "Advanced → Statistics"
   - Acompanhe uso de CPU, memória e database

### Troubleshooting Comum

#### Erro de Conexão com Database

```javascript
// Verificar se SSL está configurado corretamente
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : false,
};
```

#### Erro de CORS

```javascript
// No backend, configurar CORS para AlwaysData
app.use(
  cors({
    origin: [
      "https://johann.alwaysdata.net",
      "http://localhost:3000", // Para desenvolvimento
    ],
    credentials: true,
  })
);
```

#### Upload de Arquivos

```javascript
// Configurar pasta de uploads
const uploadDir =
  process.env.NODE_ENV === "production" ? "/www/uploads/" : "./uploads/";
```

### Schema de Migration

Execute estes comandos SQL no AlwaysData (via phpMyAdmin) para criar as tabelas:

```sql
-- Use o arquivo sistemacomercioslocais (11).sql
-- Ou o arquivo database/current_schema.sql (se copiado para o projeto)
-- Importe diretamente via phpMyAdmin
```

## Configuração Alternativa: PlanetScale (Apenas Database)

### Passos para configurar PlanetScale:

1. **Criar conta no PlanetScale**

   - Acesse https://planetscale.com/
   - Faça login com GitHub

2. **Criar novo database**

   ```bash
   # Nome do database: shophere-db
   # Região: us-east (ou mais próxima)
   ```

3. **Obter connection string**

   - Vá em Settings → Passwords
   - Clique em "New password"
   - Copie a connection string

4. **Configurar variáveis de ambiente**
   ```env
   # Produção com PlanetScale
   DB_HOST=aws.connect.psdb.cloud
   DB_USER=seu_usuario_planetscale
   DB_PASSWORD=sua_senha_planetscale
   DB_NAME=shophere-db
   ```

## Arquivos de Configuração para AlwaysData

### 1. Arquivo .htaccess (colocar em /www/)

```apache
# Configuração para AlwaysData
RewriteEngine On

# Redirecionar chamadas da API para o backend Node.js
RewriteRule ^api/(.*)$ http://localhost:8080/$1 [P,L]

# Fallback para SPA React (frontend)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /index.html [L]

# Configurações de segurança
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"

# Cache para assets estáticos
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

### 2. Configuração atualizada do database.js

```javascript
// Adicionar suporte específico para AlwaysData
const getDatabaseConfig = () => {
  const baseConfig = {
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
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
    };
  }

  // Produção PlanetScale
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

  // Desenvolvimento local
  return {
    ...baseConfig,
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "shophere_db",
    port: process.env.DB_PORT || 3306,
  };
};
```

### 3. Script de deploy automatizado

```bash
#!/bin/bash
# deploy.sh - Script para facilitar deploy no AlwaysData

echo "🚀 Iniciando deploy para AlwaysData..."

# 1. Build do frontend
echo "📦 Fazendo build do frontend..."
cd frontend
npm run build

# 2. Preparar arquivos para upload
echo "📁 Preparando arquivos..."
cd ..
mkdir -p deploy/www
mkdir -p deploy/www/api

# Copiar frontend build
cp -r frontend/dist/* deploy/www/

# Copiar backend
cp -r backend/* deploy/www/api/
cp .htaccess deploy/www/

# 3. Criar .env de produção
echo "⚙️ Criando arquivo .env de produção..."
cat > deploy/www/api/.env << EOF
NODE_ENV=production
DB_HOST=mysql-[SUBSTITUA].alwaysdata.net
DB_USER=[SUBSTITUA]
DB_PASSWORD=[SUBSTITUA]
DB_NAME=[SUBSTITUA]_shophere_db
DB_PORT=3306
JWT_SECRET=[SUBSTITUA]
FRONTEND_URL=https://[SUBSTITUA].alwaysdata.net
BACKEND_URL=https://[SUBSTITUA].alwaysdata.net/api
UPLOAD_DIR=/www/uploads/
MAX_FILE_SIZE=5242880
EOF

echo "✅ Deploy preparado na pasta 'deploy/'!"
echo "📋 Próximos passos:"
echo "1. Edite o arquivo deploy/www/api/.env com suas credenciais"
echo "2. Faça upload da pasta deploy/www/ para o AlwaysData"
echo "3. Configure as variáveis de ambiente no painel AlwaysData"
echo "4. Ative o Node.js no painel do AlwaysData"
```

## Checklist de Deploy

### ✅ Pré-Deploy

- [ ] Conta criada no AlwaysData
- [ ] Database MySQL criado
- [ ] Schema importado via phpMyAdmin
- [ ] Credenciais de database anotadas

### ✅ Configuração Local

- [ ] Build do frontend gerado (`npm run build`)
- [ ] Arquivo .env de produção criado
- [ ] Arquivo .htaccess configurado
- [ ] Scripts de package.json atualizados

### ✅ Upload e Deploy

- [ ] Arquivos enviados via FTP/SFTP
- [ ] Node.js ativado no painel AlwaysData
- [ ] Variáveis de ambiente configuradas
- [ ] Dependências instaladas (`npm install`)

### ✅ Testes Pós-Deploy

- [ ] Frontend carregando (https://johann.alwaysdata.net)
- [ ] API respondendo (https://johann.alwaysdata.net/api/health)
- [ ] Database conectando (teste de login/cadastro)
- [ ] Upload de arquivos funcionando
- [ ] Chat em tempo real operacional

### ✅ Monitoramento

- [ ] Logs de erro configurados
- [ ] Backup de database agendado
- [ ] Monitoramento de performance ativo
