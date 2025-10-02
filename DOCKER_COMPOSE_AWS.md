# Docker Compose for AWS Deployment

This guide explains how to use the `docker-compose.aws.yml` file for deploying the Mental Health App in AWS environments.

## Overview

The `docker-compose.aws.yml` file is designed for AWS deployments and includes:

1. **Frontend Service**: React application served by Nginx
2. **Backend Service**: Go API with Fiber framework
3. **Database Service**: PostgreSQL database

## Prerequisites

1. Docker and Docker Compose installed
2. AWS CLI configured
3. Appropriate AWS permissions

## Environment Variables

Before deploying, you need to set the following environment variables:

```bash
# Database configuration
DB_HOST=your-rds-endpoint.amazonaws.com
DB_PORT=5432
DB_USER=mental_user
DB_PASSWORD=your_secure_password
DB_NAME=mental_db

# Application configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
CORS_ORIGIN=https://yourdomain.com
```

You can set these in a `.env` file in the project root:

```bash
# .env file
DB_HOST=your-rds-endpoint.amazonaws.com
DB_PORT=5432
DB_USER=mental_user
DB_PASSWORD=your_secure_password
DB_NAME=mental_db
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
CORS_ORIGIN=https://yourdomain.com
```

## Deployment Steps

### 1. Build and Deploy to ECS

For AWS ECS deployment, you'll typically:

1. Build Docker images:
   ```bash
   docker build -t mental-health-frontend ./frontend
   docker build -t mental-health-backend ./mentalhealthwebapp
   ```

2. Push images to ECR:
   ```bash
   docker tag mental-health-frontend:latest your-account.dkr.ecr.region.amazonaws.com/mental-health-frontend:latest
   docker tag mental-health-backend:latest your-account.dkr.ecr.region.amazonaws.com/mental-health-backend:latest
   docker push your-account.dkr.ecr.region.amazonaws.com/mental-health-frontend:latest
   docker push your-account.dkr.ecr.region.amazonaws.com/mental-health-backend:latest
   ```

### 2. Using with EC2

If deploying directly to EC2:

1. Copy the docker-compose.aws.yml to your EC2 instance
2. Set the environment variables
3. Run the application:
   ```bash
   docker-compose -f docker-compose.aws.yml up -d
   ```

### 3. Health Checks

The configuration includes health checks for all services:

- Frontend: HTTP check on `/health` endpoint
- Backend: HTTP check on `/health` endpoint
- Database: PostgreSQL readiness check

You can check service health with:
```bash
docker-compose -f docker-compose.aws.yml ps
```

## Configuration Details

### Frontend Service

- Runs on port 80
- Uses Nginx for serving static files
- Includes gzip compression for better performance
- Configured with 2 replicas for high availability

### Backend Service

- Runs on port 8080
- Configured with Go performance tuning parameters
- Includes health checks
- Configured with 2 replicas for high availability

### Database Service

- PostgreSQL 15-alpine image
- Configured with performance optimizations
- Persistent data volume
- Health checks enabled

## Scaling

To scale services, modify the `replicas` value in the deploy section:

```yaml
deploy:
  replicas: 3  # Increase for more instances
```

## Monitoring

The configuration includes resource limits to prevent container resource exhaustion:

```yaml
deploy:
  resources:
    limits:
      memory: 512M
      cpus: '0.75'
    reservations:
      memory: 256M
      cpus: '0.5'
```

## Security Considerations

1. Database password should be stored securely
2. JWT secret should be a strong, random secret
3. CORS origin should be restricted to your domain
4. Services are configured with restart policies for resilience

## Troubleshooting

### Common Issues

1. **Database Connection**: Verify DB_HOST, DB_USER, and DB_PASSWORD
2. **Port Conflicts**: Ensure ports 80 and 8080 are available
3. **Health Check Failures**: Check service logs with `docker-compose logs`

### Useful Commands

- View logs:
  ```bash
  docker-compose -f docker-compose.aws.yml logs
  ```

- View service status:
  ```bash
  docker-compose -f docker-compose.aws.yml ps
  ```

- Stop services:
  ```bash
  docker-compose -f docker-compose.aws.yml down
  ```

- Restart services:
  ```bash
  docker-compose -f docker-compose.aws.yml restart
  ```

## Customization

You can customize the deployment by modifying the docker-compose.aws.yml file:

1. Adjust resource limits based on your requirements
2. Change replica counts for scaling
3. Modify environment variables for different environments
4. Add additional services as needed