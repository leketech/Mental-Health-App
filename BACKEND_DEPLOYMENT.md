# Backend Deployment Guide

This guide explains how to deploy the UnwindMind backend service on Render as a standalone web service.

## Overview

The backend is deployed as a standalone web service on Render. For information about the overall deployment architecture on Render, see [DEPLOYMENT_ARCHITECTURE_RENDER.md](DEPLOYMENT_ARCHITECTURE_RENDER.md).

## Prerequisites

1. A Render account (https://render.com)
2. This repository connected to your Render account
3. An existing Render PostgreSQL database service

## Deployment Steps

### 1. Configure the Database Connection

The database connection is already configured in the [render.yaml](render.yaml) file with the provided connection string:
- **DATABASE_URL**: `postgresql://postgres_w55i_user:X2Ql4NcLRRmdDcEq31o4K5qhsclQHToh@dpg-d33fa3odl3ps738rcem0-a.oregon-postgres.render.com/postgres_w55i`

### 2. Deploy the Web Service

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

### 3. Configure Health Checks

The service includes a health check endpoint at `/health` which:
1. Verifies the service is running
2. Checks database connectivity (if configured)
3. Returns appropriate status information

### 4. Deploy

Click "Create Web Service" to start the deployment process.

## Configuration Files

The backend deployment is configured using:
- `render.yaml`: Render configuration file
- `mentalhealthwebapp/Dockerfile.backend`: Docker configuration
- Environment variables set in the Render dashboard

## Health Checks

The service includes a health check endpoint at `/health` which:
1. Verifies the service is running
2. Checks database connectivity (if configured)
3. Returns appropriate status information

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

## Custom Domain (Optional)

To use a custom domain:

1. In the Render dashboard, go to your web service settings
2. Click "Custom Domains"
3. Add your domain
4. Follow the DNS configuration instructions

## Troubleshooting

### Build Issues

If the build fails:
1. Check that the Dockerfile.backend is correctly configured
2. Ensure all Go dependencies are properly declared in go.mod
3. Check the build logs in the Render dashboard for specific error messages

### Runtime Issues

If the service fails to start:
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

To update the backend:
1. Push changes to your GitHub repository
2. Render will automatically redeploy if auto-deploy is enabled
3. Or manually trigger a deploy from the Render dashboard

## Scaling

Render automatically handles scaling for your service. For high-traffic applications:
1. Upgrade to a paid plan for more resources
2. Consider adding more instances in the service settings
3. Monitor performance metrics in the Render dashboard