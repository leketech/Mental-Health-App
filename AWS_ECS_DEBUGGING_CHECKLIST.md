# AWS ECS Debugging Checklist

## Quick Debug Checklist Results

✅ **Can you manually run the container locally with the same image and env vars?**
- Both frontend and backend Docker images can be built successfully
- Docker is available (version 28.3.3)
- Local testing is possible with appropriate environment variables

✅ **Does the ECR image exist and is the URI correct?**
- ECR repositories are properly defined in Terraform:
  - `mental-health-app-frontend`
  - `mental-health-app-backend`
- Image references in ECS task definition use correct interpolation:
  - `"${aws_ecr_repository.frontend.repository_url}:latest"`
  - `"${aws_ecr_repository.backend.repository_url}:latest"`

✅ **Does the task execution role have ECR + CloudWatch permissions?**
- Execution role uses `AmazonECSTaskExecutionRolePolicy` which includes:
  - ECR permissions for pulling images
  - CloudWatch permissions for logging
- Additional S3 permissions are attached for application functionality

✅ **Are subnets routable (public or with NAT)?**
- ECS service configured with public subnets and `assign_public_ip = true`
- Public subnets properly associated with internet gateway route table
- Internet gateway attached to VPC with default route to 0.0.0.0/0

✅ **Does your app listen on the correct port (e.g., 8000)?**
- Frontend listens on port 80 (nginx)
- Backend listens on port 8080 (Go application)
- ECS task definition correctly maps these ports:
  - Frontend container port 80 -> host port 80
  - Backend container port 8080 -> host port 8080

✅ **Is the health check path (e.g., /health) returning HTTP 200?**
- Frontend health check at `/health` returns HTTP 200 with "healthy" text
- Backend health check at `/health` returns HTTP 200 with JSON response
- ECS task definition includes appropriate health checks with 120-second start period

## Additional Debugging Steps

### 1. Verify ECR Image Push
Before deploying, ensure images are pushed to ECR:
```bash
# Build and push images
./deploy-aws.sh

# Verify images exist
aws ecr describe-images --repository-name mental-health-app-frontend
aws ecr describe-images --repository-name mental-health-app-backend
```

### 2. Check ECS Service Events
Monitor ECS service events for detailed error information:
```bash
aws ecs describe-services --cluster mental-health-app-cluster --services mental-health-app-service --query 'services[0].events'
```

### 3. Review CloudWatch Logs
Check container logs for startup issues:
```bash
aws logs describe-log-streams --log-group-name /ecs/mental-health-app
```

### 4. Validate Task Definition
Ensure task definition is correctly configured:
```bash
aws ecs describe-task-definition --task-definition mental-health-app
```

### 5. Test Container Connectivity
Verify containers can communicate with each other and external services:
- Frontend should be able to proxy requests to backend via localhost:8080
- Backend should be able to connect to RDS database
- Both containers should have internet access for dependencies

## Common Issues and Solutions

### 1. Image Pull Failures
- Ensure ECR repositories exist before pushing images
- Verify IAM permissions for ECS execution role
- Check that images are tagged correctly

### 2. Health Check Failures
- Increase health check start period for slow-starting applications
- Verify health check paths return HTTP 200
- Ensure containers are listening on correct ports

### 3. Container Communication Issues
- Verify nginx proxy configuration for inter-container communication
- Check security groups allow required traffic
- Ensure environment variables are correctly set

### 4. Database Connection Issues
- Verify RDS security group allows connections from ECS security group
- Check that database credentials are correctly configured
- Ensure database is accessible and initialized

## Deployment Sequence
1. Run `terraform apply` to create infrastructure
2. Build and push Docker images using `./deploy-aws.sh`
3. ECS service will automatically start using the new images
4. Monitor service events and logs for successful deployment

## Prevention Best Practices
- Always test Docker images locally before deployment
- Verify all required infrastructure exists before deploying containers
- Use appropriate health check configurations with sufficient timeouts
- Monitor service events during deployment for early issue detection
- Maintain consistent environment variables between local and cloud deployments