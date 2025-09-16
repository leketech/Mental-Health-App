# Render Deployment Guide

This guide explains how to deploy the UnwindMind application on Render using separate services for the frontend and backend.

## Architecture Overview

The application is deployed as two separate services on Render:
1. **Frontend**: Static site serving the React application
2. **Backend**: Web service running the Go API

The database is an existing Render PostgreSQL database service that has already been provisioned.

For detailed information about this deployment architecture, see [DEPLOYMENT_ARCHITECTURE_RENDER.md](DEPLOYMENT_ARCHITECTURE_RENDER.md).

## Prerequisites

1. A Render account (https://render.com)
2. This repository connected to your Render account
3. An existing Render PostgreSQL database service

## Deployment Steps

### 1. Configure the Database Connection

The database connection is already configured in the [render.yaml](render.yaml) file with the provided connection string:
- **DATABASE_URL**: `postgresql://postgres_w55i_user:X2Ql4NcLRRmdDcEq31o4K5qhsclQHToh@dpg-d33fa3odl3ps738rcem0-a.oregon-postgres.render.com/postgres_w55i`

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
   - **DATABASE_URL**: `postgresql://postgres_w55i_user:X2Ql4NcLRRmdDcEq31o4K5qhsclQHToh@dpg-d33fa3odl3ps738rcem0-a.oregon-postgres.render.com/postgres_w55i`
   - **OPENAI_API_KEY**: Your OpenAI API key for chat functionality (set securely through Render dashboard)
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

## Security Best Practices

### API Key Management
- **OPENAI_API_KEY** and other secrets should be set through the Render dashboard
- Never hardcode API keys in configuration files that are committed to version control
- Render securely stores environment variables and injects them at runtime

### Setting Secrets in Render
1. After creating your web service, go to the service dashboard
2. Click on "Environment Variables" section
3. Add your secrets with the "Sync" option disabled for sensitive values
4. Render will securely store and inject these values at runtime

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