# GitHub Deployment Guide for UnwindMind

## 🎯 Deployment Architecture

**Frontend**: GitHub Pages (Free Static Hosting)
**Backend**: Railway.app (Free tier with PostgreSQL)
**Domain**: Your GitHub Pages URL or custom domain

## 🚀 Step-by-Step Deployment

### 1. Setup GitHub Repository

```bash
# If not already done, initialize git and push to GitHub
git init
git add .
git commit -m "Initial commit: UnwindMind mental health app"
git branch -M main
git remote add origin https://github.com/yourusername/Mental-Health-App.git
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** tab
3. Scroll to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. This enables the deployment workflow I created

### 3. Deploy Backend to Railway

1. **Sign up at [Railway.app](https://railway.app)**
2. **Connect your GitHub repository**
3. **Create a new project**:
   - Click "Deploy from GitHub repo"
   - Select your Mental-Health-App repository
   - Choose the `mentalhealthwebapp` folder as root directory
4. **Add PostgreSQL database**:
   - In your Railway project, click "New" → "Database" → "PostgreSQL"
   - Railway will automatically set DATABASE_URL environment variable

### 4. Configure Environment Variables in Railway

Set these environment variables in your Railway project:

```bash
PORT=10000                    # Railway sets this automatically
JWT_SECRET=your-super-secret-jwt-key-change-in-production
OPENAI_API_KEY=your-openai-api-key
CORS_ORIGIN=https://yourusername.github.io
DB_CONNECTION_STRING=${{PostgreSQL.DATABASE_URL}}  # Railway provides this
```

### 5. Configure GitHub Repository Variables

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Under **Variables** tab, add:
   - `REACT_APP_API_URL`: Your Railway backend URL (e.g., `https://your-app.railway.app`)
3. Under **Secrets** tab, add:
   - `RAILWAY_TOKEN`: Your Railway API token (optional, for auto-deployment)

### 6. Update Frontend Package.json

I've already updated your `package.json` with:
- GitHub Pages homepage URL
- Build scripts for GitHub Pages
- gh-pages dependency

**Important**: Replace `yourusername` in the homepage URL with your actual GitHub username.

### 7. Deploy!

```bash
# Update the homepage URL in package.json with your username
# Then commit and push
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

## 🌐 Access Your Application

After deployment:
- **Frontend**: `https://yourusername.github.io/Mental-Health-App`
- **Backend**: `https://your-app.railway.app`
- **Health Check**: `https://your-app.railway.app/health`

## 🔧 Alternative Backend Options

### Option 2: Vercel (Serverless)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from mentalhealthwebapp directory
cd mentalhealthwebapp
vercel --prod
```

### Option 3: Heroku
```bash
# Create Heroku app
heroku create unwindmind-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git subtree push --prefix=mentalhealthwebapp heroku main
```

## 📋 Configuration Files Created

- `.github/workflows/deploy-frontend.yml` - GitHub Actions for frontend
- `.github/workflows/deploy-backend.yml` - GitHub Actions for Railway
- `mentalhealthwebapp/railway.json` - Railway configuration
- `mentalhealthwebapp/nixpacks.toml` - Build configuration
- Updated `frontend/package.json` - GitHub Pages configuration

## 🛠️ Next Steps

1. **Replace placeholders**:
   - Update GitHub username in `package.json` homepage
   - Set your actual environment variables in Railway
   - Configure your OpenAI API key

2. **Custom Domain (Optional)**:
   - Add your domain to GitHub Pages settings
   - Update CORS_ORIGIN to your custom domain

3. **Monitor deployment**:
   - Check GitHub Actions tab for build status
   - Check Railway dashboard for backend deployment

## 🎯 Benefits of This Setup

✅ **Free hosting** for frontend (GitHub Pages)
✅ **Free backend** hosting (Railway free tier)
✅ **Automatic deployments** via GitHub Actions
✅ **PostgreSQL database** included
✅ **SSL certificates** provided automatically
✅ **Custom domain** support
✅ **Easy monitoring** and logs

Your app will be live and accessible to users worldwide! 🚀