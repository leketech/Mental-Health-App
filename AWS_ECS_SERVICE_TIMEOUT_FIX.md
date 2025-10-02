# AWS ECS Service Timeout Fix

## Issues Fixed

### 1. Invalid Attribute Combination Warning
```
Warning: Invalid Attribute Combination
  with aws_lb_listener.http,
  on main.tf line 230, in resource "aws_lb_listener" "http":
 230:   default_action {

 Attribute "default_action[0].redirect" cannot be specified when
 "default_action[0].type" is "forward".
```

**Root Cause**: This warning was likely from a previous version of the configuration where both redirect and forward actions were specified in the same default_action block.

**Fix**: The configuration was already corrected to use only the forward action, which is the correct approach.

### 2. ECS Service Timeout Error
```
Error: waiting for ECS Service (arn:aws:ecs:us-east-1:907849381252:service/mental-health-app-cluster/mental-health-app-service) create: timeout while waiting for state to become 'tfSTABLE' (last state: 'tfPENDING', timeout: 20m0s)
```

**Root Cause**: The ECS service was timing out because the Docker images were not available in the ECR repositories. The ECS service requires the container images to exist in the registry before it can successfully start.

## Solutions Implemented

### 1. Fixed Deployment Script
Updated the [deploy-aws.sh](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/deploy-aws.sh) script to correctly define the ECR_REGISTRY variable before using it:

```bash
# Get AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# Login to AWS ECR
echo -e "${YELLOW}Logging in to AWS ECR...${NC}"
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
```

### 2. Verified Load Balancer Configuration
Confirmed that the load balancer configuration is correct:
- HTTP listener forwards traffic to the frontend target group by default
- HTTP listener rule forwards `/api/*` paths to the backend target group
- HTTPS listener (when configured) also properly forwards traffic

### 3. Verified ECS Service Configuration
Confirmed that the ECS service configuration is correct:
- Properly references the target groups for both frontend and backend containers
- Has appropriate dependencies on load balancer resources

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

## Prevention

To avoid similar issues in the future:

1. Always ensure Docker images are built and pushed to ECR before creating or updating ECS services
2. Test the deployment script independently before running terraform apply
3. Monitor ECS service events for diagnostic information:
   ```bash
   aws ecs describe-services --cluster mental-health-app-cluster --services mental-health-app-service --query 'services[0].events'
   ```

## Common Troubleshooting Steps

If the ECS service still times out:

1. Check if ECR repositories exist and contain the required images:
   ```bash
   aws ecr describe-images --repository-name mental-health-app-frontend
   aws ecr describe-images --repository-name mental-health-app-backend
   ```

2. Check ECS service events for more detailed error information:
   ```bash
   aws ecs describe-services --cluster mental-health-app-cluster --services mental-health-app-service --query 'services[0].events'
   ```

3. Verify that the container images can be pulled by checking IAM permissions for the ECS execution role

4. Check CloudWatch logs for container startup issues:
   ```bash
   aws logs describe-log-streams --log-group-name /ecs/mental-health-app
   ```