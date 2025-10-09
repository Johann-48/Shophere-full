# Guia Completo de Deploy - Vercel + AlwaysData

## 🚀 Tutorial Passo a Passo para Deploy no Vercel com Database AlwaysData

### 📋 Arquitetura da Solução

- **Frontend + Backend**: Vercel (hosting gratuito com domínio)
- **Database**: AlwaysData MySQL (já configurado)
- **Vantagens**: Deploy automático, SSL gratuito, CDN global, escalabilidade

---

## 🔧 FASE 1: Preparação do Projeto para Vercel

### 1.1 Configurar Scripts de Build

Primeiro, vamos verificar e ajustar os scripts do projeto:

**Frontend (package.json)** - já está correto:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**Backend (package.json)** - verificar:

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "build": "echo 'No build step needed for Node.js'"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 1.2 Criar Arquivo vercel.json (Root do Projeto)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "backend/src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/src/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/dist/$1"
    }
  ],
  "functions": {
    "backend/src/index.js": {
      "maxDuration": 30
    }
  }
}
```

### 1.3 Criar Arquivo api/index.js (Para Vercel Functions)

Vamos criar um ponto de entrada para as funções Vercel:

```javascript
// api/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Importar todas as rotas do backend
const authRoutes = require("../backend/src/routes/authRoutes");
const productRoutes = require("../backend/src/routes/productRoutes");
const categoryRoutes = require("../backend/src/routes/categoryRoutes");
const commerceRoutes = require("../backend/src/routes/commerceRoutes");
const uploadRoutes = require("../backend/src/routes/uploadRoutes");
const avaliacoesRouter = require("../backend/src/routes/avaliacaoProduto.routes");

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "https://shophere-production.vercel.app",
      "https://*.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/commerces", commerceRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/avaliacoes", avaliacoesRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Rota raiz da API
app.get("/api", (req, res) => {
  res.json({
    message: "Shophere API rodando no Vercel!",
    version: "1.0.0",
  });
});

module.exports = app;
```

---

## 🌐 FASE 2: Configuração no Vercel

### 2.1 Criar Conta e Conectar GitHub

1. **Acessar Vercel**

   - Vá para https://vercel.com/
   - Clique em "Sign up"
   - Conecte com sua conta GitHub

2. **Conectar Repositório**
   - Import Git Repository
   - Selecione: `Johann-48/Shophere-full`
   - Configure as opções conforme mostrado na sua screenshot

### 2.2 Configurações de Build (Como na sua screenshot)

```
Project Name: shophere-production
Framework Preset: Other
Root Directory: ./
Build Command: cd frontend && npm run build
Output Directory: frontend/dist
Install Command: npm install && cd frontend && npm install && cd ../backend && npm install
```

### 2.3 Variáveis de Ambiente

No painel Vercel, configure estas variáveis:

```env
# Database AlwaysData
NODE_ENV=production
DB_HOST=mysql-johann.alwaysdata.net
DB_USER=johann
DB_PASSWORD=Johann@08022008
DB_NAME=johann_shophere_db
DB_PORT=3306

# URLs
FRONTEND_URL=https://shophere-production.vercel.app
BACKEND_URL=https://shophere-production.vercel.app/api

# JWT Secret
JWT_SECRET=seu_jwt_secret_super_seguro_para_producao_123456789

# Upload settings
UPLOAD_DIR=/tmp/uploads/
MAX_FILE_SIZE=5242880

# CORS
CORS_ORIGIN=https://shophere-production.vercel.app,https://*.vercel.app
```

---

## 📁 FASE 3: Estrutura de Arquivos para Vercel

### 3.1 Atualizar vercel.json (versão otimizada)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "frontend/dist"
      }
    }
  ],
  "functions": {
    "api/*.js": {
      "runtime": "nodejs18.x",
      "maxDuration": 30
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/dist/$1"
    }
  ],
  "outputDirectory": "frontend/dist"
}
```

### 3.2 Criar package.json na raiz (para Vercel)

```json
{
  "name": "shophere-vercel",
  "version": "1.0.0",
  "scripts": {
    "build": "cd frontend && npm install && npm run build",
    "install-all": "npm install && cd frontend && npm install && cd ../backend && npm install"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "mysql2": "^3.6.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "socket.io": "^4.7.2"
  }
}
```

---

## 🔄 FASE 4: Configuração de CORS e APIs

### 4.1 Atualizar Backend para Vercel

Editar `backend/src/index.js`:

```javascript
// Configuração CORS para Vercel
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "https://shophere-production.vercel.app",
      "https://*.vercel.app",
      "http://localhost:5173", // Para desenvolvimento
    ],
    credentials: true,
  })
);

// Para Vercel, usar porta do environment
const PORT = process.env.PORT || 4000;

// Não chamar app.listen() no Vercel (serverless)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Servidor rodando: http://localhost:${PORT}`);
  });
}

module.exports = app; // Importante para Vercel
```

### 4.2 Configurar Frontend para APIs do Vercel

Criar `frontend/src/config/api.js`:

```javascript
// Configuração da API baseada no ambiente
const API_BASE_URL = import.meta.env.PROD
  ? "https://shophere-production.vercel.app/api"
  : "http://localhost:4000/api";

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

// Exemplo de uso no frontend
export const api = {
  get: (url) => fetch(`${API_BASE_URL}${url}`),
  post: (url, data) =>
    fetch(`${API_BASE_URL}${url}`, {
      method: "POST",
      headers: apiConfig.headers,
      body: JSON.stringify(data),
    }),
};
```

---

## 🚀 FASE 5: Deploy e Teste

### 5.1 Fazer Deploy

1. **Push para GitHub**:

   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Deploy Automático**: Vercel detectará automaticamente

3. **Monitorar Deploy**: Acompanhe o progresso no dashboard

### 5.2 Verificar URLs

Após deploy bem-sucedido:

- **Frontend**: https://shophere-production.vercel.app
- **API**: https://shophere-production.vercel.app/api
- **Health Check**: https://shophere-production.vercel.app/api/health

---

## 🔧 FASE 6: Troubleshooting

### 6.1 Problemas Comuns

**Erro de Build**:

```bash
# Verificar se os scripts estão corretos
npm run build # deve funcionar localmente
```

**Erro de Database**:

```bash
# Testar conexão
curl https://shophere-production.vercel.app/api/health
```

**CORS Errors**:

```javascript
// Verificar se o CORS está configurado para o domínio Vercel
origin: ["https://shophere-production.vercel.app"];
```

### 6.2 Logs e Debugging

1. **Vercel Dashboard**: Functions → View Function Logs
2. **Real-time Logs**: `vercel logs shophere-production`
3. **Local Testing**: `vercel dev`

---

## 📊 FASE 7: Monitoramento e Performance

### 7.1 Analytics

- **Vercel Analytics**: Ativar no dashboard
- **Web Vitals**: Monitorar performance
- **Function Metrics**: Tempo de execução das APIs

### 7.2 Otimizações

1. **Edge Functions**: Para melhor performance global
2. **Caching**: Configurar cache headers
3. **Compression**: Gzip automático no Vercel

---

## ✅ Checklist Final

### Pré-Deploy

- [ ] vercel.json configurado
- [ ] api/index.js criado
- [ ] package.json na raiz
- [ ] Variáveis de ambiente definidas

### Deploy

- [ ] Repositório conectado no Vercel
- [ ] Build command correto
- [ ] Environment variables configuradas
- [ ] Deploy bem-sucedido

### Pós-Deploy

- [ ] Frontend carregando
- [ ] API respondendo (/api/health)
- [ ] Database conectando
- [ ] CORS funcionando
- [ ] Upload de arquivos (se aplicável)

### Produção

- [ ] Custom domain (opcional)
- [ ] SSL ativo (automático)
- [ ] Analytics configurado
- [ ] Backup de database

---

## 🎉 URLs Finais

**Frontend**: https://shophere-production.vercel.app
**API**: https://shophere-production.vercel.app/api
**Database**: mysql-johann.alwaysdata.net (AlwaysData)

**Benefícios desta arquitetura**:

- ✅ Deploy automático via Git
- ✅ SSL gratuito
- ✅ CDN global
- ✅ Escalabilidade automática
- ✅ Database persistente no AlwaysData
- ✅ Zero downtime deployments
