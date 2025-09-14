# Deployment Guide

## Overview
This application now serves the frontend directly from the Go backend using a single-container approach. This simplifies deployment and eliminates the need for separate frontend and backend containers.

## Deployment Options

### Render Deployment (Recommended)
1. Use the `render.yaml` configuration file
2. The application will be deployed as a single web service
3. The database will be automatically provisioned
4. Environment variables will be configured through the Render dashboard

### Docker Compose Deployment
For local development and testing:
```bash
docker-compose -f docker-compose.yml up --build
```

### Manual Deployment
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Copy the build to the backend:
   ```bash
   cp -r build ../mentalhealthwebapp/frontend/
   ```

3. Build the backend:
   ```bash
   cd ../mentalhealthwebapp
   go build -o main .
   ```

4. Run the application:
   ```bash
   ./main
   ```

## Environment Variables
- `PORT`: The port to run the server on (default: 8080)
- `JWT_SECRET`: Secret key for JWT token signing (must be at least 32 characters)
- `DB_CONNECTION_STRING`: PostgreSQL connection string
- `CORS_ORIGIN`: Allowed CORS origin (required in production)

## API Endpoints
All API endpoints are available under the `/api` prefix:
- `/api/login` - User login
- `/api/register` - User registration
- `/api/chat` - Chat with AI assistant
- `/api/moods` - Mood tracking
- `/api/journals` - Journal entries
- `/api/user/profile` - User profile
- `/api/user/stats` - User statistics

## Frontend Routes
The frontend is served from the root path (`/`) and all subpaths that don't match API endpoints.

## Health Check
The application provides a health check endpoint at `/health`.