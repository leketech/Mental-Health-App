# Deployment Architecture Update

## Overview

This document summarizes the changes made to update the deployment architecture of the Mental Health App to use separate services for frontend and backend, which is the cleanest, most professional, and scalable approach.

## Changes Made

### 1. Frontend Deployment Configuration

- Created `frontend/render.yaml` for static site deployment
- Updated build process to work with Render's static site service
- Added environment configuration files:
  - `.env.development` for local development
  - `.env.production` for production settings

### 2. Backend Deployment Configuration

- Created `mentalhealthwebapp/Dockerfile.backend` for backend-only deployment
- Updated `render.yaml` to focus only on backend service
- Removed frontend build from backend Dockerfile

### 3. Documentation Updates

- Created `FRONTEND_DEPLOYMENT.md` with detailed frontend deployment instructions
- Created `BACKEND_DEPLOYMENT.md` with detailed backend deployment instructions
- Created `ARCHITECTURE.md` with system architecture diagram and descriptions
- Updated `README.md` to reflect the new deployment approach
- Updated `deploy-render.sh` to guide users on the new deployment process

### 4. Code Updates

- Modified `mentalhealthwebapp/main.go` to remove static file serving (frontend will be served separately)
- Updated environment variable handling for CORS configuration

## New Architecture Benefits

### Scalability
- Frontend and backend can be scaled independently based on demand
- Static files served from CDN for better performance
- Database can be scaled separately from application logic

### Maintainability
- Clear separation of concerns between frontend and backend
- Independent deployment cycles
- Easier to troubleshoot issues in specific components

### Performance
- Static files served directly from CDN
- Backend API optimized for data processing
- Better resource allocation for each service

### Cost-Effectiveness
- Pay only for resources needed for each service
- CDN delivery reduces backend load
- Efficient resource utilization

## Deployment Process

### Frontend (Static Site)
1. Render builds the React app using `npm run build`
2. Built files are served from Render's global CDN
3. Environment variables configured in Render dashboard

### Backend (Web Service)
1. Render builds Docker image using `Dockerfile.backend`
2. Container deployed to Render infrastructure
3. Environment variables configured in Render dashboard

### Database (PostgreSQL)
1. PostgreSQL service provisioned through Render
2. Connection details provided to backend service

## Environment Variables

### Frontend
- `REACT_APP_API_URL`: URL of the backend service

### Backend
- `JWT_SECRET`: Secret for JWT token signing
- `CORS_ORIGIN`: URL of the frontend for CORS protection
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Port for the application

## Migration from Previous Architecture

If migrating from the previous monolithic deployment:

1. Deploy the new frontend static site
2. Update the backend service to use the new Dockerfile
3. Configure environment variables for both services
4. Test the integration between services
5. Update DNS/custom domains as needed

## Future Enhancements

This architecture allows for easy addition of new services:
- Microservices for specific functionality
- Additional frontend applications (mobile, admin panel)
- Caching layers (Redis)
- Message queues for async processing
- Monitoring and logging services