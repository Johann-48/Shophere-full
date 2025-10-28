  # Shophere - Plataforma de E-commerce

Aplicação completa de e‑commerce com React (Vite) no frontend e Node.js/Express no backend, hospedada na Vercel. O banco de dados MySQL roda na AlwaysData.

## 🚀 Arquitetura

```
Shophere-Full/
├── frontend/          # React + Vite
├── backend/           # Express + MySQL2
├── api/               # Entrada Serverless para Vercel (reexporta o app Express)
├── database/          # Schemas SQL (PT‑BR)
├── vercel.json        # Configuração de deploy
└── README.md
```

Backend e API são expostos pela função serverless `api/index.js`, que importa `backend/src/index.js` e exporta o app Express diretamente.

## 📋 Pré‑requisitos (dev local)

- Node.js 18+
- npm
- MySQL local (opcional; produção usa AlwaysData)

## 🛠️ Como rodar localmente

1. Instalar dependências por app

```bash
cd backend && npm install
cd ../frontend && npm install
```

2. Backend: criar `.env` na pasta `backend/`

```env
NODE_ENV=development
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=shophere_db
DB_PORT=3306
JWT_SECRET=uma_chave_segura
```

3. Frontend: (opcional) criar `frontend/.env.development`

```env
VITE_API_BASE_URL=http://localhost:4000
```

4. Iniciar

```bash
# terminal 1
cd backend && npm run dev     # http://localhost:4000

# terminal 2
cd frontend && npm run dev    # http://localhost:5173
```

O frontend chamará a API usando a variável `VITE_API_BASE_URL` em dev e caminhos relativos (`/api/...`) em produção.

## ☁️ Deploy (Vercel + AlwaysData)

- App hospedado na Vercel; DB MySQL na AlwaysData
- vercel.json atual (resumo):

```json
{
  "version": 2,
  "buildCommand": "npm run build --prefix frontend",
  "installCommand": "npm install --prefix frontend && npm install --prefix backend",
  "outputDirectory": "frontend/dist",
  "regions": ["cdg1"],
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index.js" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Variáveis de ambiente na Vercel (Settings → Environment Variables):

```
NODE_ENV=production
DB_HOST=mysql-johann.alwaysdata.net
DB_USER=johann
DB_PASSWORD=********
DB_NAME=johann_shophere_db
DB_PORT=3306
JWT_SECRET=uma_chave_segura
FRONTEND_URL=https://shophere-production.vercel.app
```

Endpoints úteis (produção):

- `/api/health` — status da API
- `/api/db-health` — teste de conexão com o MySQL
- `/api/debug/summary` — contagem de registros principais

Observação de uploads em serverless: arquivos são gravados em `/tmp` durante a execução. Para persistência, considere mover para um storage externo (S3/R2) no futuro.

## 🏗️ Tecnologias

- Frontend: React 19, Vite, TailwindCSS, React Router, Axios
- Backend: Node.js, Express, MySQL2, JWT, Bcrypt, Multer, CORS

## 🤝 Contribuição

1. Fork
2. Branch: `feat/minha-feature`
3. Commits claros
4. PR para `main`

## 📄 Licença

MIT
