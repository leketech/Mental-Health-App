# AWS Deployment Complete Setup Guide

This document provides a comprehensive guide for setting up and deploying the Mental Health App on AWS.

## Prerequisites

1. AWS CLI configured with appropriate credentials
2. Terraform installed (v1.0 or higher)
3. Docker installed (for building and pushing images)

## Setup Steps

### 1. Initialize the Environment

```bash
cd terraform
./setup.sh
```

This will create a `terraform.tfvars` file from the example if it doesn't exist.

### 2. Configure Required Variables

Edit `terraform.tfvars` and set the required values:

```hcl
# Database credentials (required)
db_username = "mental_user"
db_password = "your_secure_password_here"  # CHANGE THIS

# JWT Secret for authentication (required)
jwt_secret = "your_super_secret_jwt_key_here_change_in_production"  # CHANGE THIS

# Other variables as needed
region = "us-east-1"
db_name = "mental_db"
cors_origin = "https://yourdomain.com"
environment = "production"
```

### 3. Configure Optional Variables (HTTPS)

For HTTPS support, you need to provide either:

**Option A: AWS Certificate Manager (ACM)**
```hcl
# For HTTP-only deployment, leave certificate_arn empty (default)
certificate_arn = ""

# For HTTPS deployment, provide a valid certificate ARN
# certificate_arn = "arn:aws:acm:us-east-1:YOUR_ACCOUNT:certificate/YOUR_CERT_ID"
```

**Option B: Let's Encrypt**
```hcl
domain_name = "yourdomain.com"
create_route53_records = true
use_lets_encrypt = true
lets_encrypt_email = "admin@yourdomain.com"
```

### 4. Initialize Terraform

```bash
terraform init
```

### 5. Review the Plan

```bash
terraform plan
```

### 6. Apply the Configuration

```bash
terraform apply
```

## Required Variables

These variables must be set in `terraform.tfvars`:

1. **db_password**: Database password for PostgreSQL
2. **jwt_secret**: Secret key for JWT token generation

## Optional Variables

These variables can be set based on your deployment needs:

1. **certificate_arn**: ARN of SSL certificate in ACM (for HTTPS)
2. **domain_name**: Your custom domain (if using Route 53)
3. **create_route53_records**: Whether to create Route 53 records
4. **use_lets_encrypt**: Whether to use Let's Encrypt for SSL
5. **lets_encrypt_email**: Email for Let's Encrypt registration

## Deployment Architecture

The deployment creates:

1. **Networking**:
   - VPC with public and private subnets
   - Internet Gateway
   - Security groups

2. **Load Balancing**:
   - Application Load Balancer
   - HTTP to HTTPS redirection
   - Path-based routing

3. **Compute**:
   - ECS Fargate cluster
   - Auto-scaling capabilities

4. **Data**:
   - RDS PostgreSQL database
   - S3 bucket with unique name

5. **Security**:
   - SSL/TLS encryption (when configured)
   - IAM roles and policies

## Post-Deployment Steps

1. **Build and Push Docker Images**:
   ```bash
   cd ..
   ./deploy-aws.sh
   ```

2. **Configure DNS** (if using custom domain):
   - Point your domain to the Load Balancer DNS name
   - Wait for DNS propagation

3. **Verify Deployment**:
   ```bash
   terraform output
   ```

## Troubleshooting

### Common Issues

1. **Missing Variables**: Ensure all required variables are set in `terraform.tfvars`

2. **SSL Certificate Issues**: 
   - Verify certificate ARN is correct
   - Ensure certificate covers your domain
   - Check certificate region (must be us-east-1 for ALB)

3. **Database Connection**: 
   - Check security group rules
   - Verify database credentials

4. **S3 Bucket Conflicts**: 
   - The deployment now uses unique bucket names
   - No manual intervention needed

### Useful Commands

```bash
# Check Terraform outputs
terraform output

# View resources
terraform state list

# Destroy deployment (WARNING: This will delete everything)
terraform destroy
```

## Security Considerations

1. **Database Password**: Use a strong, unique password
2. **JWT Secret**: Use a long, random secret
3. **CORS Origin**: Restrict to your domain only
4. **SSL/TLS**: Always use HTTPS in production
5. **S3 Bucket**: Private by default with encryption

## Cost Optimization

The default configuration uses cost-effective resources:
- db.t3.micro for database
- Fargate with minimal CPU/Memory allocation
- S3 standard storage class

Adjust these based on your traffic needs.