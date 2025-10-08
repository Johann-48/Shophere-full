# Migração do Banco de Dados para a Nuvem

## Opções de Banco de Dados MySQL Gratuito na Nuvem

### 1. PlanetScale (Recomendado)
- **Plano gratuito**: 5GB de armazenamento, 1 bilhão de leituras/mês
- **Vantagens**: Criado para MySQL, branching de schema, auto-scaling
- **Site**: https://planetscale.com/
- **Setup**: Criar conta → Criar database → Obter connection string

### 2. Aiven
- **Plano gratuito**: 1 mês grátis, depois $20/mês (mas tem opções mais baratas)
- **Vantagens**: MySQL gerenciado, backups automáticos
- **Site**: https://aiven.io/

### 3. FreeSQLDatabase
- **Plano gratuito**: 5MB de espaço (limitado, só para testes)
- **Site**: https://www.freesqldatabase.com/

### 4. Railway (Recomendado para desenvolvimento)
- **Plano gratuito**: $5 de crédito por mês
- **Vantagens**: Deploy fácil, integração com GitHub
- **Site**: https://railway.app/

## Configuração Recomendada: PlanetScale

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
   # Produção (Vercel)
   DB_HOST=aws.connect.psdb.cloud
   DB_USER=seu_usuario_planetscale
   DB_PASSWORD=sua_senha_planetscale
   DB_NAME=shophere-db
   ```

### Schema de Migration

Execute estes comandos SQL no PlanetScale para criar as tabelas:

```sql
-- Ver arquivo database/schema.sql para o schema completo
```

## Alternativa: Supabase (PostgreSQL)

Se quiser migrar para PostgreSQL (mais features gratuitas):

1. **Criar projeto no Supabase**
   - Acesse https://supabase.com/
   - Criar novo projeto

2. **Instalar cliente PostgreSQL**
   ```bash
   npm install pg
   ```

3. **Atualizar configuração do banco**
   - Alterar de mysql2 para pg no backend