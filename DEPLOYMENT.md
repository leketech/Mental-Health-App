# UnwindMind - Render Deployment Guide

## 🚀 Deployment Overview

This guide will help you deploy your UnwindMind mental health application to Render with your custom domain `unwindmind.life`.

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **Domain**: `unwindmind.life` (you'll need to configure DNS)
3. **OpenAI API Key**: For the AI chat functionality
4. **GitHub Repository**: Push your code to GitHub

## 🔧 Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Connect to Render
1. Log into your Render dashboard
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Select this repository

### 3. Configure Environment Variables
Render will automatically create the services defined in `render.yaml`, but you need to set:

**For the API service (unwindmind-api):**
- `OPENAI_API_KEY`: Your OpenAI API key
- Other variables are auto-configured

### 4. Configure Domain DNS
Point your domain `unwindmind.life` to Render:
1. In your domain provider's DNS settings:
   - Add CNAME record: `www` → `unwindmind-frontend.onrender.com`
   - Add A record: `@` → Render's IP (provided in dashboard)

### 5. Deploy Services
The deployment includes:
- **Backend API** (`unwindmind-api`): Go Fiber server on port 10000
- **Frontend** (`unwindmind-frontend`): React static site
- **Database** (`unwindmind-postgres`): PostgreSQL database

## 🌐 Service Architecture

```
unwindmind.life → Frontend (React)
                     ↓
                  Backend API (Go)
                     ↓
                PostgreSQL Database
```

## 🔧 Configuration Details

### Backend Features
- **Health Check**: `/health` endpoint for monitoring
- **Auto-migrations**: Database tables created automatically
- **JWT Authentication**: Secure user sessions
- **CORS**: Configured for your domain
- **OpenAI Integration**: AI chat functionality

### Frontend Features
- **Theme Switching**: Black/white theme toggle
- **Responsive Design**: Works on all devices
- **Progressive Web App**: Can be installed on mobile
- **Environment-aware**: Uses production API URL

### Database Schema
- `users`: User accounts and authentication
- `moods`: Daily mood tracking
- `journals`: Personal journal entries
- `refresh_tokens`: JWT refresh token management
- `blacklisted_tokens`: Logout token management

## 🔍 Monitoring & Health Checks

- **API Health**: `https://unwindmind-api.onrender.com/health`
- **Frontend**: `https://unwindmind.life`
- **Database**: Automatic health monitoring

## 🎯 Post-Deployment Checklist

- [ ] Verify API is responding at health endpoint
- [ ] Test user registration and login
- [ ] Verify theme switching works
- [ ] Test mood tracking
- [ ] Test journal functionality
- [ ] Test AI chat (requires OpenAI API key)
- [ ] Verify domain is accessible
- [ ] Check mobile responsiveness

## 🛠 Troubleshooting

### Common Issues:
1. **API not connecting**: Check `OPENAI_API_KEY` is set
2. **Database errors**: Wait for automatic migrations to complete
3. **CORS errors**: Verify domain configuration
4. **Theme not persisting**: Check localStorage in browser

### Logs:
- View service logs in Render dashboard
- Backend logs show migration status
- Frontend builds show compilation status

## 🔄 Updates

To deploy updates:
1. Push changes to GitHub
2. Render automatically redeploys
3. Database migrations run automatically
4. Zero-downtime deployment

## 🎉 Success!

Once deployed, your UnwindMind app will be available at:
- **Main Site**: https://unwindmind.life
- **API**: https://unwindmind-api.onrender.com
- **Admin**: Render dashboard for monitoring

Your users can now access the full mental health platform with:
- Mood tracking
- Personal journaling  
- AI-powered chat assistance
- Beautiful black/white theme switching
- Secure user authentication