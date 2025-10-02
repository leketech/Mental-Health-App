# AWS ECS Service Final Fix

## Issue
```
Error: waiting for ECS Service (arn:aws:ecs:us-east-1:907849381252:service/mental-health-app-cluster/mental-health-app-service) create: timeout while waiting for state to become 'tfSTABLE' (last state: 'tfPENDING', timeout: 20m0s)
```

## Root Cause Analysis
The ECS service timeout issue was caused by multiple factors:

1. **Incorrect Nginx Configuration**: The frontend nginx configuration was trying to proxy API requests to `http://web:8080`, which is not available in the ECS environment.

2. **Insufficient Health Check Start Period**: The health checks were not giving containers enough time to initialize.

3. **Missing Docker Images**: The ECS service requires Docker images to be available in ECR before it can start.

## Solutions Implemented

### 1. Fixed Nginx Configuration
Updated the frontend nginx configuration to proxy API requests to `http://localhost:8080` instead of `http://web:8080`:

```nginx
# Proxy API requests to the backend
location /api {
    proxy_pass http://localhost:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # Performance optimizations
    proxy_buffering on;
    proxy_buffer_size 128k;
    proxy_buffers 4 256k;
    proxy_busy_buffers_size 256k;
}
```

### 2. Increased Health Check Start Period
Increased the health check start period from 60 to 120 seconds to give containers more time to initialize:

```hcl
healthCheck = {
  command     = ["CMD-SHELL", "curl -f http://localhost/health || exit 1"]
  interval    = 30
  timeout     = 5
  retries     = 3
  startPeriod = 120
}
```

### 3. Verified Security Groups
Confirmed that security groups are properly configured:
- ECS tasks can receive traffic from the ALB
- ECS tasks can access the RDS database on port 5432
- ALB can receive traffic from the internet

### 4. Verified Dockerfiles
Confirmed that both frontend and backend Dockerfiles are correctly configured:
- Frontend builds a React app and serves it with Nginx
- Backend builds a Go application with proper health checks

## Deployment Process

To successfully deploy the application:

1. **Initialize Terraform**:
   ```bash
   cd terraform
   terraform init
   terraform apply
   ```

2. **Build and Push Docker Images**:
   ```bash
   ./deploy-aws.sh
   ```

3. **Verify Deployment**:
   ```bash
   aws ecs describe-services --cluster mental-health-app-cluster --services mental-health-app-service
   ```

## Troubleshooting Steps

If the ECS service still times out:

1. **Check ECR Repositories**:
   ```bash
   aws ecr describe-images --repository-name mental-health-app-frontend
   aws ecr describe-images --repository-name mental-health-app-backend
   ```

2. **Check ECS Service Events**:
   ```bash
   aws ecs describe-services --cluster mental-health-app-cluster --services mental-health-app-service --query 'services[0].events'
   ```

3. **Check CloudWatch Logs**:
   ```bash
   aws logs describe-log-streams --log-group-name /ecs/mental-health-app
   ```

4. **Verify Container Health**:
   ```bash
   aws ecs describe-tasks --cluster mental-health-app-cluster --tasks $(aws ecs list-tasks --cluster mental-health-app-cluster --query 'taskArns' --output text)
   ```

## Prevention

To avoid similar issues in the future:

1. Always ensure Docker images are built and pushed to ECR before creating or updating ECS services
2. Test the deployment script independently before running terraform apply
3. Verify that container health checks are appropriate for the application startup time
4. Ensure that inter-container communication is properly configured for the target environment
5. Monitor ECS service events for diagnostic information during deployment