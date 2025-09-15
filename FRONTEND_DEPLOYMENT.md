# Frontend Deployment Guide - Render Static Site

This guide explains how to deploy the frontend as a separate static site on Render.

## Prerequisites

1. A Render account (https://render.com)
2. This repository connected to your Render account
3. The backend service deployed and running

## Deployment Steps

### 1. Create the Static Site Service

1. Go to your Render dashboard
2. Click "New" → "Static Site"
3. Connect your GitHub repository
4. Configure the following settings:
   - **Name**: `unwindmind-frontend` (or your preferred name)
   - **Branch**: `main` (or your deployment branch)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`

### 2. Configure Environment Variables

Add the following environment variable:
- **Key**: `REACT_APP_API_URL`
- **Value**: The URL of your backend service (e.g., `https://unwindmind-backend.onrender.com`)

### 3. Configure Routes

Ensure the following route is configured to handle client-side routing:
```yaml
routes:
  - type: rewrite
    source: /*
    destination: /index.html
```

### 4. Deploy

Click "Create Static Site" to start the deployment process.

## Configuration Files

The frontend deployment is configured using:
- `frontend/render.yaml`: Render configuration file
- `frontend/package.json`: Build scripts and dependencies
- Environment variables set in the Render dashboard

## Custom Domain (Optional)

To use a custom domain:

1. In the Render dashboard, go to your static site settings
2. Click "Custom Domains"
3. Add your domain
4. Follow the DNS configuration instructions

## Troubleshooting

### Build Issues

If the build fails:
1. Check that all dependencies are correctly listed in `package.json`
2. Ensure the build command `npm run build` works locally
3. Check the build logs in the Render dashboard for specific error messages

### Runtime Issues

If the frontend loads but doesn't connect to the backend:
1. Verify the `REACT_APP_API_URL` environment variable is set correctly
2. Check that the backend service is running and accessible
3. Ensure CORS is properly configured on the backend

## Updates

To update the frontend:
1. Push changes to your GitHub repository
2. Render will automatically redeploy if auto-deploy is enabled
3. Or manually trigger a deploy from the Render dashboard