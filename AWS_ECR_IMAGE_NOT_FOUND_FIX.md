# AWS ECR Image Not Found Fix

## Issue
```
Task stopped at: 2025-10-02T11:26:29.107Z
CannotPullContainerError: pull image manifest has been retried 1 time(s): failed to resolve ref 907849381252.dkr.ecr.us-east-1.amazonaws.com/mental-health-app-backend:latest: 907849381252.dkr.ecr.us-east-1.amazonaws.com/mental-health-app-backend:latest: not found
```

## Root Cause
The ECS service is unable to pull the container images from ECR because they don't exist in the repository yet. This happens when the deployment sequence is incorrect:
1. Terraform creates the ECS service
2. ECS service tries to start containers immediately
3. Containers fail to start because images don't exist in ECR yet
4. The deployment script to build and push images hasn't been run yet

## Solution
Follow the correct deployment sequence:

### 1. Provision Infrastructure with Terraform
```bash
cd terraform
terraform init
terraform apply
```

This creates:
- ECR repositories
- ECS cluster and service
- Load balancer and target groups
- RDS database
- All other required AWS resources

### 2. Build and Push Docker Images to ECR
```bash
cd ..
./deploy-aws.sh
```

This script:
- Builds Docker images for frontend and backend
- Tags images with the correct ECR repository URLs
- Pushes images to ECR
- Forces a new deployment of the ECS service

### 3. Verify Deployment
```bash
# Check if images exist in ECR
aws ecr describe-images --repository-name mental-health-app-frontend
aws ecr describe-images --repository-name mental-health-app-backend

# Check ECS service status
aws ecs describe-services --cluster mental-health-app-cluster --services mental-health-app-service

# Check service events
aws ecs describe-services --cluster mental-health-app-cluster --services mental-health-app-service --query 'services[0].events'
```

## Troubleshooting Steps

### 1. Verify ECR Repositories Exist
```bash
aws ecr describe-repositories --repository-names mental-health-app-frontend mental-health-app-backend
```

If they don't exist, create them:
```bash
aws ecr create-repository --repository-name mental-health-app-frontend
aws ecr create-repository --repository-name mental-health-app-backend
```

### 2. Manually Build and Push Images
If the deployment script fails, manually build and push the images:

```bash
# Get AWS account ID and login to ECR
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="${ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com"
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_REGISTRY

# Build and push frontend image
docker build -t mental-health-app-frontend ./frontend
docker tag mental-health-app-frontend:latest $ECR_REGISTRY/mental-health-app-frontend:latest
docker push $ECR_REGISTRY/mental-health-app-frontend:latest

# Build and push backend image
docker build -t mental-health-app-backend -f ./mentalhealthwebapp/Dockerfile ./mentalhealthwebapp
docker tag mental-health-app-backend:latest $ECR_REGISTRY/mental-health-app-backend:latest
docker push $ECR_REGISTRY/mental-health-app-backend:latest
```

### 3. Force ECS Service Update
After pushing images, force a new deployment:
```bash
aws ecs update-service --cluster mental-health-app-cluster --service mental-health-app-service --force-new-deployment
```

## Prevention

To avoid this issue in the future:

1. **Always follow the correct deployment sequence**:
   - First run `terraform apply` to create infrastructure
   - Then run `./deploy-aws.sh` to build and push images

2. **Verify ECR repositories exist** before attempting to push images:
   ```bash
   aws ecr describe-repositories --repository-names mental-health-app-frontend mental-health-app-backend
   ```

3. **Check that images exist in ECR** before expecting ECS to pull them:
   ```bash
   aws ecr describe-images --repository-name mental-health-app-frontend
   aws ecr describe-images --repository-name mental-health-app-backend
   ```

4. **Monitor ECS service events** during deployment for early issue detection:
   ```bash
   aws ecs describe-services --cluster mental-health-app-cluster --services mental-health-app-service --query 'services[0].events'
   ```

## Common Causes

1. **Running deployment script before Terraform apply**: ECR repositories don't exist yet
2. **Docker build failures**: Images aren't created locally
3. **Docker push failures**: Images aren't pushed to ECR
4. **Incorrect image tags**: ECS tries to pull non-existent image tags
5. **AWS authentication issues**: Not logged into ECR properly

By following the correct deployment sequence and verifying each step, you can avoid the "image not found" error and successfully deploy your application to AWS ECS.