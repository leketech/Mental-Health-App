# Frontend Deployment Guide for Render

This guide explains how to deploy the frontend as a static site on Render.

## Prerequisites

1. A Render account (https://render.com)
2. This repository connected to your Render account

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

## Troubleshooting

### If you see "You need to enable JavaScript to run this app"

This is a normal message that appears when JavaScript is disabled in the browser. If you're seeing this message after deployment, it could indicate one of several issues:

1. **JavaScript is actually disabled in the browser** - Enable JavaScript in your browser settings
2. **The JavaScript bundle failed to load** - Check the browser's developer console for errors
3. **The static files are not being served correctly** - Verify the deployment configuration

### Checking Deployment Status

1. Check the build logs in the Render dashboard
2. Verify that all files are present in the build directory
3. Check the browser's developer console for any errors

### Common Issues and Solutions

1. **Missing static files**: Ensure the build command is correct and completes successfully
2. **CORS issues**: Make sure the backend is configured to allow requests from the frontend URL
3. **Routing issues**: Ensure the rewrite rule is configured correctly for client-side routing

## Updates

To update the frontend:
1. Push changes to your GitHub repository
2. Render will automatically redeploy if auto-deploy is enabled
3. Or manually trigger a deploy from the Render dashboard