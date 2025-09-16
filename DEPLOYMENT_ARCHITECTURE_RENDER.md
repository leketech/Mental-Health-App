# Render Deployment Architecture

## Overview

Render does not natively support multi-container Docker Compose deployments. Therefore, the UnwindMind application is deployed as separate services on Render:

1. **Frontend**: Static site serving the React application
2. **Backend**: Web service running the Go API
3. **Database**: PostgreSQL database service

This approach ensures optimal performance, scalability, and compliance with Render's deployment model.

## Service Architecture

### Frontend (Static Site)
- **Type**: Render Static Site
- **Source**: `frontend/` directory
- **Build Process**: 
  - Uses `npm run build` to create production build
  - Serves files via Nginx
- **Environment Variables**:
  - `REACT_APP_API_URL`: Backend service URL
- **Routing**: Rewrite all routes to `/index.html` for React Router

### Backend (Web Service)
- **Type**: Render Web Service
- **Source**: `mentalhealthwebapp/` directory
- **Build Process**:
  - Uses `Dockerfile.backend` for containerization
  - Go application compiled to single binary
- **Environment Variables**:
  - `JWT_SECRET`: Secret for JWT token signing
  - `CORS_ORIGIN`: Frontend domain for CORS protection
  - `DATABASE_URL`: PostgreSQL connection string
  - `PORT`: Service port (8080)
- **Health Check**: `/health` endpoint

### Database (PostgreSQL)
- **Type**: Render PostgreSQL
- **Version**: PostgreSQL 15
- **Configuration**:
  - Database name: `mental_db`
  - User: `mental_user`
  - Connection managed via `DATABASE_URL` environment variable

## Benefits of Separate Services

1. **Independent Scaling**: Each service can be scaled independently based on demand
2. **Isolated Failures**: Issues in one service don't directly impact others
3. **Optimized Resources**: Each service can be configured with appropriate resources
4. **Easier Maintenance**: Updates to one service don't require redeploying others
5. **Better Monitoring**: Each service can be monitored separately
6. **Cost Efficiency**: Pay only for resources each service actually uses

## Communication Between Services

### Frontend to Backend
- Frontend makes API calls to backend service URL
- Configured via `REACT_APP_API_URL` environment variable
- CORS headers properly configured for secure communication

### Backend to Database
- Backend connects to PostgreSQL using `DATABASE_URL`
- Connection pooling for efficient database access
- Secure connection with proper authentication

## Deployment Process

1. **Database Creation**: First, create the PostgreSQL service
2. **Backend Deployment**: Deploy the Go web service with database connection
3. **Frontend Deployment**: Deploy the React static site with backend URL

Each service can be updated independently without affecting the others.

## Environment Configuration

All services use environment variables for configuration:
- Secrets are stored securely in Render's environment variable system
- Configuration can be changed without code changes
- Easy to manage different environments (staging, production)

## Monitoring and Health Checks

Each service has its own health check endpoint:
- **Backend**: `/health` endpoint that verifies service and database connectivity
- **Frontend**: Automatically monitored by Render static site infrastructure

## Custom Domains

Each service can have its own custom domain:
- Frontend typically uses primary domain (e.g., `unwindmind.com`)
- Backend can use subdomain (e.g., `api.unwindmind.com`)
- Database is only accessible internally to backend service

This architecture provides a robust, scalable, and maintainable deployment solution that works within Render's constraints while providing all the functionality of the application.