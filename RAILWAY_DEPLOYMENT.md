# Railway Deployment Guide

## 🚀 **Database Setup Complete**

Your Railway PostgreSQL database is configured with these credentials:

```
DATABASE_URL: postgresql://postgres:MhpWEYLHwDhAquMNOClYBQTySTrKpuhz@postgres-kjnv.railway.internal:5432/railway
PUBLIC_URL: postgresql://postgres:MhpWEYLHwDhAquMNOClYBQTySTrKpuhz@turntable.proxy.rlwy.net:27662/railway
```

## 📋 **Required Environment Variables in Railway**

Set these in your Railway project's environment variables:

### Core Variables:
- `DATABASE_URL` = `postgresql://postgres:MhpWEYLHwDhAquMNOClYBQTySTrKpuhz@postgres-kjnv.railway.internal:5432/railway`
- `JWT_SECRET` = `your-super-secret-jwt-key-change-in-production-railway-2024`
- `PORT` = `${{RAILWAY_PORT}}` (Railway auto-assigns this)
- `CORS_ORIGIN` = `https://www.unwindmind.life`

### Optional PostgreSQL Variables:
- `PGDATABASE` = `railway`
- `PGHOST` = `postgres-kjnv.railway.internal`
- `PGPASSWORD` = `MhpWEYLHwDhAquMNOClYBQTySTrKpuhz`
- `PGUSER` = `postgres`

## 🔧 **Deployment Steps**

### 1. **Railway CLI Deployment**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Set environment variables
railway variables set DATABASE_URL="postgresql://postgres:MhpWEYLHwDhAquMNOClYBQTySTrKpuhz@postgres-kjnv.railway.internal:5432/railway"
railway variables set JWT_SECRET="your-super-secret-jwt-key-change-in-production-railway-2024"
railway variables set CORS_ORIGIN="https://www.unwindmind.life"

# Deploy
railway up
```

### 2. **GitHub Integration Deployment**
- Connect your GitHub repository to Railway
- Set the environment variables in Railway dashboard
- Push to main branch to trigger deployment

## 🗄️ **Database Configuration**

Your application is already configured to:
- ✅ Use Railway's `DATABASE_URL` automatically
- ✅ Run database migrations on startup
- ✅ Create all required tables (users, moods, journals, etc.)
- ✅ Handle connection fallbacks

## 🔍 **Verification**

After deployment, verify:
1. **Health Check**: `https://your-app.railway.app/health`
2. **Database**: Check logs for "✅ Database connected"
3. **Migrations**: Check logs for "✅ Database migrations completed"

## 📁 **Files Created**

- `.env.railway` - Environment variables reference
- `docker-compose.railway.yml` - Railway-specific Docker Compose
- `railway.json` - Updated Railway configuration

## 🛠️ **Local Testing with Railway Database**

To test locally with Railway database:
```bash
# Copy environment variables
cp .env.railway .env

# Run locally
go run main.go
```

## 🌐 **Frontend Configuration**

Make sure your frontend is configured to point to:
- **Local**: `http://localhost:3001`
- **Production**: `https://your-backend.railway.app`

Update `REACT_APP_API_URL` in your frontend deployment accordingly.