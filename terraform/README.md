# Terraform Infrastructure for Mental Health App

This directory contains the Terraform configuration to deploy the Mental Health App on AWS.

## Architecture Overview

The infrastructure consists of:

1. **VPC** with public and private subnets
2. **Application Load Balancer** (ALB) with HTTPS support
3. **ECS Fargate** cluster running the application containers
4. **RDS PostgreSQL** database
5. **S3 Bucket** for static assets
6. **CloudWatch** for logging
7. **IAM Roles** for secure access

## Prerequisites

1. AWS CLI configured with appropriate credentials
2. Terraform installed (v1.0 or higher)
3. An SSL certificate in AWS Certificate Manager (ACM)

## Setup Instructions

1. Copy `terraform.tfvars.example` to `terraform.tfvars`:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```
   
   Or use the setup script:
   ```bash
   ./setup.sh
   ```

2. Edit `terraform.tfvars` and fill in the required values:
   - `db_password` - Secure password for the database (required)
   - `jwt_secret` - Secret key for JWT token generation (required)
   - `certificate_arn` - ARN of your SSL certificate in ACM (optional, for HTTPS)
   - `cors_origin` - Your domain name

3. Initialize Terraform:
   ```bash
   terraform init
   ```

4. Plan the deployment:
   ```bash
   terraform plan
   ```

5. Apply the deployment:
   ```bash
   terraform apply
   ```

## Components

### Networking
- VPC with CIDR block 10.0.0.0/16
- 2 public subnets for ALB and ECS tasks
- 2 private subnets for RDS database
- Internet Gateway for public access
- Security groups for each component

### Application Load Balancer
- Listens on ports 80 and 443
- Automatically redirects HTTP to HTTPS
- Routes `/api/*` paths to backend service
- Routes all other paths to frontend service

### ECS Fargate
- Runs both frontend and backend containers
- Auto-scaling based on demand
- Health checks for both services
- CloudWatch logging

### RDS Database
- PostgreSQL 15.4 database
- db.t3.micro instance (adjust as needed)
- 20GB storage with GP2 type
- Automatic backups with 7-day retention

### S3 Bucket
- Private bucket for static assets
- Server-side encryption enabled
- Public access blocked

## Customization

You can customize the infrastructure by modifying the variables in `variables.tf`:

- `instance_type` - Change the compute resources
- `region` - Deploy to a different AWS region
- `db_name` - Change the database name
- `environment` - Set environment (production, staging, etc.)

## Teardown

To destroy the infrastructure:

```bash
terraform destroy
```

**Warning**: This will permanently delete all resources including the database and S3 bucket.