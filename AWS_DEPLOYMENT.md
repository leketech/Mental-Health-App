# AWS Deployment Guide for Mental Health App

This guide provides step-by-step instructions for deploying the Mental Health App to AWS using the provided Terraform configuration and deployment scripts.

## Prerequisites

1. AWS CLI installed and configured with appropriate credentials
2. Terraform installed (v1.0 or higher)
3. Docker installed
4. An SSL certificate in AWS Certificate Manager (ACM)
5. Git installed

See [AWS_ACCOUNT_ID.md](AWS_ACCOUNT_ID.md) for instructions on finding your AWS account ID.

## Deployment Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Mental-Health-App
```

### 2. Set Up Terraform Infrastructure

1. Navigate to the terraform directory:
   ```bash
   cd terraform
   ```

2. Copy the example variables file:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

3. Edit `terraform.tfvars` with your specific values:
   - `certificate_arn`: ARN of your SSL certificate in ACM (replace YOUR_AWS_ACCOUNT_ID with your actual AWS account ID)
   - `db_password`: Secure password for the database
   - `jwt_secret`: Secret key for JWT token generation
   - `cors_origin`: Your domain name (e.g., https://yourdomain.com)

   To find your AWS account ID:
   - Log into the AWS Console
   - In the top navigation bar, click on your account name
   - Your account ID will be displayed in the dropdown
   - Or run `aws sts get-caller-identity` in your terminal

4. Initialize Terraform:
   ```bash
   terraform init
   ```

5. Review the planned infrastructure:
   ```bash
   terraform plan
   ```

6. Deploy the infrastructure:
   ```bash
   terraform apply
   ```

### 3. Build and Deploy Docker Images

1. Return to the project root:
   ```bash
   cd ..
   ```

2. Make the deployment script executable (if not already):
   ```bash
   chmod +x deploy-aws.sh
   ```

3. Run the deployment script:
   ```bash
   ./deploy-aws.sh
   ```

### 4. Configure Environment Variables

After the Terraform deployment, you'll need to configure some environment variables in the ECS task definition. You can do this by:

1. Going to the AWS ECS console
2. Finding your cluster and service
3. Updating the service with the correct environment variables

Or you can modify the `ecs.tf` file with your specific values before running `terraform apply`.

### 5. Verify Deployment

1. Check the status of your ECS service:
   ```bash
   aws ecs describe-services --cluster mental-health-app-cluster --services mental-health-app-service
   ```

2. Get the Load Balancer DNS name from the Terraform outputs:
   ```bash
   cd terraform
   terraform output alb_dns_name
   ```

3. Access your application using the Load Balancer DNS name.

## Updating the Application

To update the application with new code:

1. Make your code changes
2. Run the deployment script:
   ```bash
   ./deploy-aws.sh
   ```

The script will rebuild and push new Docker images, then force a new deployment of the ECS service.

## Monitoring and Logging

- CloudWatch logs are available under the `/ecs/mental-health-app` log group
- ECS container insights are enabled for performance monitoring
- RDS performance insights can be accessed through the RDS console

## Security Considerations

1. The database is deployed in private subnets and is not publicly accessible
2. Security groups restrict access to only necessary ports
3. S3 bucket has public access blocked
4. SSL is enforced through the Load Balancer
5. Secrets are stored as Terraform variables with sensitive marking

## Cost Optimization

1. The default setup uses cost-effective instance types:
   - db.t3.micro for the database
   - Fargate for ECS with minimal CPU/Memory allocation
2. Consider adjusting these based on your traffic needs
3. Enable auto-scaling policies for production workloads

## Troubleshooting

### Common Issues

1. **SSL Certificate Issues**: Ensure your certificate in ACM covers your domain name
2. **Database Connection**: Verify security group rules allow ECS tasks to connect to RDS
3. **Health Check Failures**: Check that your containers are listening on the correct ports
4. **Permission Errors**: Ensure your AWS CLI credentials have the necessary permissions

### Useful Commands

- Check ECS service events:
  ```bash
  aws ecs describe-services --cluster mental-health-app-cluster --services mental-health-app-service --query 'services[0].events'
  ```

- View CloudWatch logs:
  ```bash
  aws logs tail /ecs/mental-health-app --follow
  ```

- Check RDS instance status:
  ```bash
  aws rds describe-db-instances --db-instance-identifier mental-health-app-db
  ```

## Teardown

To completely remove the infrastructure:

1. Navigate to the terraform directory:
   ```bash
   cd terraform
   ```

2. Destroy the infrastructure:
   ```bash
   terraform destroy
   ```

**Warning**: This will permanently delete all resources including the database and S3 bucket. Ensure you have backups of any important data before running this command.