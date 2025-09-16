# UnwindMind - Mental Health Application

## Production Deployment Guide

This guide explains how to deploy the UnwindMind application using Docker Compose for production environments.

## Prerequisites

- Docker and Docker Compose installed
- At least 2GB of free disk space
- Internet connection for downloading Docker images

## Deployment Steps

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd mental-health-app
   ```

2. **Deploy the application**:
   ```bash
   ./deploy-production.sh
   ```

   This script will:
   - Build the frontend and backend Docker images
   - Start all services (frontend, backend, database)
   - Wait for services to be ready
   - Verify that all services are running correctly

3. **Access the application**:
   - Frontend: http://localhost
   - Backend API: http://localhost:8080
   - Health Check: http://localhost:8080/health

## Manual Deployment

If you prefer to deploy manually, you can use Docker Compose directly:

```bash
# Build and start all services
docker compose up --build -d

# Check service status
docker compose ps

# View logs
docker compose logs -f
```

## Stopping the Application

To stop the application:

```bash
docker compose down
```

To stop the application and remove all data (including database):

```bash
docker compose down -v
```

## Environment Variables

The application uses the following environment variables (defaults are provided):

- `JWT_SECRET`: Secret key for JWT token signing (default provided for development)
- `DB_CONNECTION_STRING`: Database connection string (default provided)
- `PORT`: Backend port (default: 8080)

For production deployment, you should set these environment variables appropriately.

## Troubleshooting

If you encounter issues:

1. Check the logs: `docker compose logs -f`
2. Ensure Docker has enough resources (memory/CPU)
3. Verify that ports 80 and 8080 are not already in use
4. Check that you have sufficient disk space

## Services Overview

- **Frontend**: React application served by Nginx on port 80
- **Backend**: Go Fiber API on port 8080
- **Database**: PostgreSQL 15 on port 5432

The frontend automatically proxies API requests to the backend service.