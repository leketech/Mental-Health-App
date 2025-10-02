# AWS Deployment Options

This document explains the various deployment options available for the Mental Health App on AWS.

## Deployment Architectures

### 1. ECS/Fargate (Default)
This is the default deployment method using AWS ECS with Fargate launch type.

**Components:**
- ECS Fargate tasks running frontend and backend containers
- Application Load Balancer for traffic distribution
- RDS PostgreSQL database
- S3 bucket for static assets
- CloudWatch for logging

**Advantages:**
- Serverless containers
- Automatic scaling
- Managed infrastructure
- High availability

**When to use:**
- Production environments
- Applications requiring high availability
- Teams preferring containerized deployments

### 2. EC2 Deployment
Deploy the application directly on EC2 instances with Nginx as a reverse proxy.

**Components:**
- EC2 instances running Amazon Linux 2
- Nginx as reverse proxy and web server
- Docker and Docker Compose for containerization
- Application Load Balancer
- RDS PostgreSQL database

**Advantages:**
- Full control over the OS
- Ability to install custom software
- Lower cost for small workloads
- Familiar server management

**When to use:**
- Applications requiring custom OS configurations
- Teams comfortable with server management
- Cost-sensitive deployments

### 3. Elastic Beanstalk
Deploy using AWS Elastic Beanstalk for a Platform-as-a-Service experience.

**Components:**
- Elastic Beanstalk environment
- Auto Scaling group
- Application Load Balancer
- EC2 instances managed by Elastic Beanstalk

**Advantages:**
- Simplified deployment process
- Built-in health monitoring
- Easy scaling configuration
- Platform management by AWS

**When to use:**
- Teams wanting PaaS experience
- Applications with standard runtime requirements
- Rapid prototyping and development

## SSL/TLS Configuration

### AWS Certificate Manager (ACM) + ALB
This is the recommended approach for production deployments.

**How it works:**
- SSL certificate managed in ACM
- ALB terminates SSL connections
- Traffic between ALB and backend is HTTP

**Advantages:**
- Managed certificate renewal
- Integration with AWS services
- Easy certificate management

### Let's Encrypt with Certbot
Self-managed SSL certificates using Let's Encrypt.

**How it works:**
- Certbot installed on EC2 instances
- Automatic certificate renewal
- DNS validation through Route 53

**Advantages:**
- Free certificates
- Automation capabilities
- No dependency on AWS Certificate Manager

## Custom Domain Configuration

### Route 53 Integration
Point your custom domain to the application using Route 53.

**Requirements:**
- Domain registered in Route 53 or delegated to Route 53
- SSL certificate covering your domain
- ALB or EC2 instance with public IP

**Configuration:**
1. Set `domain_name` variable to your domain
2. Set `create_route53_records` to true
3. Update nginx configuration with your domain

## Configuration Examples

### ECS/Fargate Deployment (Default)
```hcl
# terraform.tfvars
region = "us-east-1"
certificate_arn = "arn:aws:acm:us-east-1:YOUR_ACCOUNT:certificate/CERT_ID"
db_password = "secure_password"
jwt_secret = "secure_jwt_secret"
cors_origin = "https://yourdomain.com"
environment = "production"
```

### EC2 Deployment
```hcl
# terraform.tfvars
region = "us-east-1"
certificate_arn = "arn:aws:acm:us-east-1:YOUR_ACCOUNT:certificate/CERT_ID"
db_password = "secure_password"
jwt_secret = "secure_jwt_secret"
cors_origin = "https://yourdomain.com"
environment = "production"
deploy_to_ec2 = true
ec2_key_name = "your-key-pair"
```

### Elastic Beanstalk Deployment
```hcl
# terraform.tfvars
region = "us-east-1"
certificate_arn = "arn:aws:acm:us-east-1:YOUR_ACCOUNT:certificate/CERT_ID"
db_password = "secure_password"
jwt_secret = "secure_jwt_secret"
cors_origin = "https://yourdomain.com"
environment = "production"
deploy_to_elastic_beanstalk = true
```

### Custom Domain with Route 53
```hcl
# terraform.tfvars
region = "us-east-1"
certificate_arn = "arn:aws:acm:us-east-1:YOUR_ACCOUNT:certificate/CERT_ID"
db_password = "secure_password"
jwt_secret = "secure_jwt_secret"
cors_origin = "https://unwindmind.com"
environment = "production"
domain_name = "unwindmind.com"
create_route53_records = true
```

### Let's Encrypt SSL
```hcl
# terraform.tfvars
region = "us-east-1"
db_password = "secure_password"
jwt_secret = "secure_jwt_secret"
cors_origin = "https://unwindmind.com"
environment = "production"
domain_name = "unwindmind.com"
create_route53_records = true
use_lets_encrypt = true
lets_encrypt_email = "admin@unwindmind.com"
```

## Nginx Configuration Files

### nginx-aws.conf
Default configuration for AWS deployments with catch-all server name.

### nginx-custom-domain.conf
Configuration for custom domain deployments with specific domain names.

### nginx-prod.conf
Original configuration for Render deployments.

### nginx-prod-enhanced.conf
Enhanced configuration with additional security headers and optimizations.

## Deployment Commands

### Initialize Terraform
```bash
cd terraform
terraform init
```

### Plan Deployment
```bash
terraform plan
```

### Apply Deployment
```bash
terraform apply
```

## Monitoring and Maintenance

### ECS/Fargate
- CloudWatch logs: `/ecs/mental-health-app`
- ECS service events in AWS console
- Container insights for performance metrics

### EC2
- CloudWatch logs for system and application logs
- EC2 instance metrics
- Custom monitoring scripts

### Elastic Beanstalk
- Elastic Beanstalk console for application health
- CloudWatch logs
- Enhanced health reporting

## Cost Considerations

### ECS/Fargate
- Pay per vCPU and memory per second
- No upfront costs
- Higher cost for small workloads

### EC2
- Pay for instance hours
- Reserved instances for savings
- Lower cost for consistent workloads

### Elastic Beanstalk
- No additional cost (pay for underlying resources)
- Auto Scaling costs
- Load balancer costs

## Security Considerations

### Network Security
- Security groups for each component
- Private subnets for database
- Public subnets for web services

### Data Security
- Encryption at rest for RDS
- Encryption in transit with SSL
- S3 bucket policies

### Identity and Access
- IAM roles for services
- Least privilege principles
- Regular access reviews

## Troubleshooting

### Common Issues

1. **SSL Certificate Issues**
   - Ensure certificate covers your domain
   - Check certificate expiration
   - Verify certificate ARN format

2. **Domain Resolution Issues**
   - Verify Route 53 records
   - Check domain registration
   - Confirm DNS propagation

3. **Database Connection Issues**
   - Check security group rules
   - Verify database credentials
   - Confirm database endpoint

4. **Container Health Check Failures**
   - Check container logs
   - Verify application configuration
   - Confirm port mappings

### Useful Commands

```bash
# Check Terraform outputs
terraform output

# Check ECS service status
aws ecs describe-services --cluster mental-health-app-cluster --services mental-health-app-service

# View logs
aws logs tail /ecs/mental-health-app --follow

# Check database status
aws rds describe-db-instances --db-instance-identifier mental-health-app-db
```