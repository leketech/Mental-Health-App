# Deployment Configuration Examples

This document provides example configurations for different deployment scenarios.

## 1. ECS/Fargate Deployment (Default)

This is the default and recommended deployment method.

### terraform.tfvars
```hcl
# AWS Region
region = "us-east-1"

# SSL Certificate ARN (required for HTTPS)
# Replace YOUR_AWS_ACCOUNT_ID with your actual AWS account ID
certificate_arn = "arn:aws:acm:us-east-1:YOUR_AWS_ACCOUNT_ID:certificate/YOUR_CERTIFICATE_ID"

# Database credentials
db_username = "mental_user"
db_password = "your_secure_password_here"  # Use a strong password
db_name     = "mental_db"

# JWT Secret for authentication
jwt_secret = "your_super_secret_jwt_key_here_change_in_production"  # Use a strong secret

# CORS Origin
cors_origin = "https://yourdomain.com"

# Environment
environment = "production"

# Custom Domain (optional)
# domain_name = "unwindmind.com"
# create_route53_records = false

# Deployment options (all false for ECS/Fargate)
deploy_to_ec2 = false
deploy_to_elastic_beanstalk = false
```

## 2. EC2 Deployment

Deploy directly to EC2 instances with Nginx.

### terraform.tfvars
```hcl
# AWS Region
region = "us-east-1"

# SSL Certificate ARN (required for HTTPS)
# Replace YOUR_AWS_ACCOUNT_ID with your actual AWS account ID
certificate_arn = "arn:aws:acm:us-east-1:YOUR_AWS_ACCOUNT_ID:certificate/YOUR_CERTIFICATE_ID"

# Database credentials
db_username = "mental_user"
db_password = "your_secure_password_here"  # Use a strong password
db_name     = "mental_db"

# JWT Secret for authentication
jwt_secret = "your_super_secret_jwt_key_here_change_in_production"  # Use a strong secret

# CORS Origin
cors_origin = "https://yourdomain.com"

# Environment
environment = "production"

# EC2 Deployment
deploy_to_ec2 = true
ec2_key_name = "your-ec2-key-pair-name"  # Required for SSH access

# Custom Domain (optional)
# domain_name = "unwindmind.com"
# create_route53_records = false

# Other deployment options
deploy_to_elastic_beanstalk = false
```

## 3. Elastic Beanstalk Deployment

Deploy using AWS Elastic Beanstalk.

### terraform.tfvars
```hcl
# AWS Region
region = "us-east-1"

# SSL Certificate ARN (required for HTTPS)
# Replace YOUR_AWS_ACCOUNT_ID with your actual AWS account ID
certificate_arn = "arn:aws:acm:us-east-1:YOUR_AWS_ACCOUNT_ID:certificate/YOUR_CERTIFICATE_ID"

# Database credentials
db_username = "mental_user"
db_password = "your_secure_password_here"  # Use a strong password
db_name     = "mental_db"

# JWT Secret for authentication
jwt_secret = "your_super_secret_jwt_key_here_change_in_production"  # Use a strong secret

# CORS Origin
cors_origin = "https://yourdomain.com"

# Environment
environment = "production"

# Elastic Beanstalk Deployment
deploy_to_elastic_beanstalk = true
eb_application_name = "mental-health-app"
eb_environment_name = "mental-health-app-prod"

# Custom Domain (optional)
# domain_name = "unwindmind.com"
# create_route53_records = false

# Other deployment options
deploy_to_ec2 = false
```

## 4. Custom Domain with Route 53

Use a custom domain with Route 53 DNS management.

### terraform.tfvars
```hcl
# AWS Region
region = "us-east-1"

# SSL Certificate ARN (required for HTTPS)
# Must cover your domain (e.g., *.yourdomain.com or yourdomain.com)
certificate_arn = "arn:aws:acm:us-east-1:YOUR_AWS_ACCOUNT_ID:certificate/YOUR_CERTIFICATE_ID"

# Database credentials
db_username = "mental_user"
db_password = "your_secure_password_here"  # Use a strong password
db_name     = "mental_db"

# JWT Secret for authentication
jwt_secret = "your_super_secret_jwt_key_here_change_in_production"  # Use a strong secret

# CORS Origin (should match your domain)
cors_origin = "https://unwindmind.com"

# Environment
environment = "production"

# Custom Domain Configuration
domain_name = "unwindmind.com"
create_route53_records = true

# Deployment options (choose one or use default ECS/Fargate)
deploy_to_ec2 = false
deploy_to_elastic_beanstalk = false
```

## 5. Let's Encrypt SSL Certificate

Use Let's Encrypt for free SSL certificates.

### terraform.tfvars
```hcl
# AWS Region
region = "us-east-1"

# Database credentials
db_username = "mental_user"
db_password = "your_secure_password_here"  # Use a strong password
db_name     = "mental_db"

# JWT Secret for authentication
jwt_secret = "your_super_secret_jwt_key_here_change_in_production"  # Use a strong secret

# CORS Origin (should match your domain)
cors_origin = "https://unwindmind.com"

# Environment
environment = "production"

# Custom Domain Configuration
domain_name = "unwindmind.com"
create_route53_records = true

# Let's Encrypt Configuration
use_lets_encrypt = true
lets_encrypt_email = "admin@unwindmind.com"  # Required for Let's Encrypt registration

# Deployment options
deploy_to_ec2 = false
deploy_to_elastic_beanstalk = false
```

## 6. Complete Production Setup

A complete production setup with custom domain, Route 53, and Let's Encrypt.

### terraform.tfvars
```hcl
# AWS Region
region = "us-east-1"

# Database credentials
db_username = "mental_user"
db_password = "your_secure_password_here"  # Use a strong password
db_name     = "mental_db"

# JWT Secret for authentication
jwt_secret = "your_super_secret_jwt_key_here_change_in_production"  # Use a strong secret

# CORS Origin (should match your domain)
cors_origin = "https://unwindmind.com"

# Environment
environment = "production"

# Custom Domain Configuration
domain_name = "unwindmind.com"
create_route53_records = true

# Let's Encrypt Configuration
use_lets_encrypt = true
lets_encrypt_email = "admin@unwindmind.com"

# EC2 Deployment (choose one deployment method)
deploy_to_ec2 = false
ec2_key_name = "your-ec2-key-pair-name"

# Elastic Beanstalk Deployment
deploy_to_elastic_beanstalk = false
eb_application_name = "mental-health-app"
eb_environment_name = "mental-health-app-prod"
```

## Environment Variables for Application

In addition to Terraform variables, you'll need to set environment variables for your application containers.

### For ECS/Fargate
These are automatically configured in the task definition:
- `DB_HOST` - Database endpoint
- `DB_PORT` - Database port (5432)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `JWT_SECRET` - JWT secret key
- `PORT` - Application port (8080)
- `CORS_ORIGIN` - CORS origin
- `ENV` - Environment name
- `S3_BUCKET` - S3 bucket name (`unwindmind-1234`)

### For EC2 Deployment
You'll need to configure these in your Docker Compose file or environment:
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
PORT=8080
ENV=production
```

## Nginx Configuration Selection

Choose the appropriate Nginx configuration file based on your deployment:

1. **ECS/Fargate**: Use `nginx-aws.conf` (default)
2. **EC2 with generic domain**: Use `nginx-aws.conf`
3. **Custom domain**: Use `nginx-custom-domain.conf`
4. **Enhanced security**: Use `nginx-prod-enhanced.conf`

Copy the appropriate file to `frontend/nginx-prod.conf` before building your Docker images.

## Deployment Commands

### Initialize Terraform
```bash
cd terraform
terraform init
```

### Validate Configuration
```bash
terraform validate
```

### Plan Deployment
```bash
terraform plan
```

### Apply Deployment
```bash
terraform apply
```

### Destroy Deployment
```bash
terraform destroy
```

## Post-Deployment Steps

1. **Update DNS records** if not using Route 53
2. **Configure SSL certificate** if using Let's Encrypt
3. **Set up monitoring and alerts**
4. **Test all application functionality**
5. **Configure backup and disaster recovery**