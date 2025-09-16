# Render Deployment Guide

This guide explains how to deploy the UnwindMind application on Render using separate services for the frontend and backend.

## Architecture Overview

The application is deployed as three separate services on Render:
1. **Frontend**: Static site serving the React application
2. **Backend**: Web service running the Go API
3. **Database**: PostgreSQL database service

## Prerequisites

1. A Render account (https://render.com)
2. This repository connected to your Render account

## Deployment Steps

### 1. Create the PostgreSQL Database

1. Go to your Render dashboard
2. Click "New" → "PostgreSQL"
3. Configure the database settings:
   - **Name**: `unwindmind-db`
   - **Database**: `mental_db`
   - **User**: `mental_user`
4. Click "Create Database"
5. Note the connection information for use in the backend service configuration

### 2. Deploy the Backend Web Service

1. Go to your Render dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the following settings:
   - **Name**: `unwindmind-backend`
   - **Branch**: `main` (or your deployment branch)
   - **Root Directory**: `mentalhealthwebapp`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `Dockerfile.backend`

5. Configure Environment Variables:
   - **JWT_SECRET**: A random string at least 32 characters long for JWT token signing
   - **CORS_ORIGIN**: `https://unwindmind-frontend.onrender.com`
   - **DATABASE_URL**: Use the connection string from your PostgreSQL service
   - **PORT**: `8080`

6. Click "Create Web Service" to start the deployment process

### 3. Deploy the Frontend Static Site

1. Go to your Render dashboard
2. Click "New" → "Static Site"
3. Connect your GitHub repository
4. Configure the following settings:
   - **Name**: `unwindmind-frontend`
   - **Branch**: `main` (or your deployment branch)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`

5. Configure Environment Variables:
   - **REACT_APP_API_URL**: The URL of your backend service (e.g., `https://unwindmind-backend.onrender.com`)

6. Configure Routes:
   ```yaml
   routes:
     - type: rewrite
       source: /*
       destination: /index.html
   ```

7. Click "Create Static Site" to start the deployment process

## Configuration Files

The deployment is configured using:
- `render.yaml`: Main Render configuration file
- `frontend/render.yaml`: Frontend-specific Render configuration
- `mentalhealthwebapp/Dockerfile.backend`: Backend Docker configuration
- Environment variables set in the Render dashboard

## Health Checks

Both services include health check endpoints:
- **Backend**: `/health` endpoint that verifies service and database connectivity
- **Frontend**: Automatically served by Render static site

## Custom Domains (Optional)

To use custom domains:

### For the Frontend:
1. In the Render dashboard, go to your static site settings
2. Click "Custom Domains"
3. Add your domain
4. Follow the DNS configuration instructions

### For the Backend:
1. In the Render dashboard, go to your web service settings
2. Click "Custom Domains"
3. Add your domain
4. Follow the DNS configuration instructions

## Troubleshooting

### Build Issues

If builds fail:
1. Check that all dependencies are correctly listed in package.json (frontend) or go.mod (backend)
2. Ensure build commands work locally
3. Check build logs in the Render dashboard for specific error messages

### Runtime Issues

If services fail to start:
1. Check the logs in the Render dashboard
2. Verify all required environment variables are set
3. Ensure the database connection is working
4. Check that the PORT environment variable is set correctly

### Database Issues

If there are database connection problems:
1. Verify the DATABASE_URL is correctly formatted
2. Ensure the database service is running
3. Check that the database credentials are correct
4. Verify network access between the web service and database

## Updates

To update the application:
1. Push changes to your GitHub repository
2. Render will automatically redeploy if auto-deploy is enabled
3. Or manually trigger a deploy from the Render dashboard

## Scaling

Render automatically handles scaling for your services. For high-traffic applications:
1. Upgrade to a paid plan for more resources
2. Consider adding more instances in the service settings
3. Monitor performance metrics in the Render dashboard