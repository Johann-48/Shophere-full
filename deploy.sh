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
DB_HOST=mysql-johann.alwaysdata.net
DB_USER=johann
DB_PASSWORD=[SUBSTITUA]
DB_NAME=johann_shophere_db
DB_PORT=3306
JWT_SECRET=[SUBSTITUA]
FRONTEND_URL=https://johann.alwaysdata.net
BACKEND_URL=https://johann.alwaysdata.net/api
UPLOAD_DIR=/www/uploads/
MAX_FILE_SIZE=5242880
EOF

echo "✅ Deploy preparado na pasta 'deploy/'!"
echo "📋 Próximos passos:"
echo "1. Edite o arquivo deploy/www/api/.env com suas credenciais"
echo "2. Faça upload da pasta deploy/www/ para o AlwaysData"
echo "3. Configure as variáveis de ambiente no painel AlwaysData"
echo "4. Ative o Node.js no painel do AlwaysData"