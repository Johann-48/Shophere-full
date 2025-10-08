# Shophere - Plataforma de E-commerce

Uma plataforma completa de e-commerce construída com React (frontend) e Node.js (backend).

## 🚀 Estrutura do Projeto

```
Shophere-Full/
├── frontend/          # Aplicação React + Vite
├── backend/           # API Node.js + Express
├── .github/workflows/ # GitHub Actions para deploy
└── README.md
```

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- MySQL (para desenvolvimento local)

## 🛠️ Configuração Local

### 1. Instalar dependências

```bash
npm run install:all
```

### 2. Configurar variáveis de ambiente

#### Backend (.env)
```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=shophere_db
PORT=4000
JWT_SECRET=seu_jwt_secret
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000
```

### 3. Executar em desenvolvimento

```bash
# Executa backend e frontend simultaneamente
npm run dev

# Ou separadamente:
npm run dev:frontend  # Porta 5173
npm run dev:backend   # Porta 4000
```

## 🚀 Deploy

### Branches
- **main**: Produção
- **develop**: Staging/desenvolvimento

### Deploy automático via GitHub Actions
- Push para `main` → Deploy em produção no Vercel
- Push para `develop` → Deploy em staging no Vercel

## 🏗️ Tecnologias

### Frontend
- React 19
- Vite
- TailwindCSS
- React Router Dom
- Axios
- Socket.io Client

### Backend
- Node.js
- Express
- MySQL2
- Socket.io
- JWT
- Bcrypt
- Multer

## 📝 Scripts Disponíveis

- `npm run dev` - Desenvolvimento (frontend + backend)
- `npm run build` - Build para produção
- `npm run install:all` - Instala todas as dependências

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.