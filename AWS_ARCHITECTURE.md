# AWS Architecture Overview

This document provides a comprehensive overview of the AWS architecture for the Mental Health App, including all deployment options and their components.

## Architecture Components

### 1. Networking Layer

**VPC (Virtual Private Cloud)**
- CIDR block: 10.0.0.0/16
- Public subnets for web services
- Private subnets for database
- Internet Gateway for public access

**Security Groups**
- ALB Security Group: HTTP/HTTPS access from internet
- ECS/EC2 Security Group: Access from ALB only
- RDS Security Group: PostgreSQL access from ECS/EC2 only

### 2. Load Balancing Layer

**Application Load Balancer (ALB)**
- Listens on ports 80 and 443
- HTTP to HTTPS redirection
- Path-based routing:
  - `/api/*` → Backend service (port 8080)
  - `/*` → Frontend service (port 80)
- Health checks for both services

### 3. Compute Layer Options

#### ECS/Fargate (Default)
- Serverless containers
- Two containers per task:
  - Frontend (Nginx serving React app)
  - Backend (Go API)
- Auto-scaling capabilities
- Task IAM roles for secure access

#### EC2 Instances
- Amazon Linux 2 AMI
- Nginx as reverse proxy
- Docker and Docker Compose
- SSH access for administration
- Elastic IP for static addressing

#### Elastic Beanstalk
- Managed platform deployment
- Auto Scaling group
- ELB integration
- Health monitoring

### 4. Data Layer

**RDS PostgreSQL**
- Private subnets
- Automated backups
- Multi-AZ deployment option
- Security group restrictions

**S3 Bucket**
- Private storage
- Server-side encryption
- Bucket policies
- Fixed name: `unwindmind-1234`

### 5. DNS and SSL Layer

**Route 53**
- Domain registration (optional)
- DNS records for custom domains
- Alias records for ALB

**SSL/TLS Options**
- AWS Certificate Manager (ACM)
- Let's Encrypt with Certbot
- Automatic renewal

## Deployment Scenarios

### Scenario 1: Basic ECS/Fargate Deployment

```
Internet → ALB → ECS/Fargate Tasks (Frontend + Backend) → RDS
                    ↓
                  S3 (static assets)
```

**Components:**
- VPC with public/private subnets
- ALB with HTTP/HTTPS listeners
- ECS cluster with Fargate tasks
- RDS PostgreSQL database
- S3 bucket for static assets

### Scenario 2: EC2 Deployment with Custom Domain

```
Internet → ALB → EC2 Instances (Nginx + Docker) → RDS
                   ↓
               Custom Domain (Route 53)
                   ↓
               Let's Encrypt SSL
```

**Components:**
- VPC with public/private subnets
- ALB with HTTP/HTTPS listeners
- EC2 instances with Nginx
- Route 53 for DNS
- Let's Encrypt for SSL
- RDS PostgreSQL database

### Scenario 3: Elastic Beanstalk Deployment

```
Internet → ALB → Elastic Beanstalk → RDS
                    ↓
                  S3 (application versions)
```

**Components:**
- VPC with public/private subnets
- ALB managed by Elastic Beanstalk
- Elastic Beanstalk environment
- RDS PostgreSQL database

## Service Communication

### Frontend to Backend
- Internal Docker networking (ECS)
- localhost:8080 (EC2)
- Path: `/api/*` routes to backend

### Backend to Database
- Direct RDS connection
- Environment variables for credentials
- Private subnet communication

### Nginx Configuration
All deployment options use Nginx for:
- Static file serving
- API proxying to backend
- SSL termination (with ALB)
- Caching and compression
- Security headers

## Environment Variables

### Required Variables
- `DB_HOST`: Database endpoint
- `DB_PORT`: Database port (5432)
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `JWT_SECRET`: JWT secret key
- `PORT`: Application port
- `CORS_ORIGIN`: CORS origin
- `ENV`: Environment name

### ECS/Fargate Specific
- Automatically injected from Terraform
- Stored in task definition
- Secure handling through IAM roles

### EC2 Specific
- Set in Docker Compose or systemd
- Can use .env files
- Managed through user data scripts

## Security Features

### Network Security
- Private subnets for database
- Security groups for all components
- No direct internet access to database
- Restricted inbound/outbound rules

### Data Security
- Encryption at rest (RDS, S3)
- Encryption in transit (SSL/TLS)
- IAM roles for service access
- No hardcoded credentials

### Application Security
- CORS restrictions
- Security headers in Nginx
- JWT authentication
- Input validation

## Monitoring and Logging

### ECS/Fargate
- CloudWatch logs
- Container insights
- ALB access logs
- RDS performance insights

### EC2
- CloudWatch logs
- System logs
- Application logs
- Custom metrics

### Elastic Beanstalk
- Elastic Beanstalk health
- CloudWatch logs
- Enhanced health reporting

## Scaling Options

### Horizontal Scaling
- ECS: Task count adjustment
- EC2: Auto Scaling groups
- Elastic Beanstalk: Environment scaling

### Vertical Scaling
- ECS: CPU/Memory in task definition
- EC2: Instance type change
- RDS: Instance class change

## Cost Optimization

### ECS/Fargate
- Pay per vCPU/memory second
- Right-size task definitions
- Use Spot capacity (if supported)

### EC2
- Reserved instances for savings
- Spot instances for development
- Right-size instance types

### General
- RDS: Right-size database instances
- S3: Use appropriate storage classes
- ALB: Single ALB for multiple services

## Backup and Recovery

### Database
- Automated RDS backups
- Manual snapshots
- Point-in-time recovery

### Application
- ECR for Docker images
- S3 for static assets
- Version control for configurations

### Disaster Recovery
- Multi-AZ deployments
- Cross-region backups
- Recovery procedures documentation

## Deployment Process

### 1. Infrastructure Provisioning
- Terraform apply
- DNS configuration
- SSL certificate setup

### 2. Application Deployment
- Docker image building
- ECR push (ECS) or direct deployment (EC2/EB)
- Service configuration

### 3. Testing and Validation
- Health checks
- Functional testing
- Performance testing

### 4. Monitoring Setup
- CloudWatch alarms
- Log aggregation
- Performance monitoring

## Maintenance Procedures

### Regular Maintenance
- Security updates
- Certificate renewals
- Backup verification
- Performance tuning

### Emergency Procedures
- Service restarts
- Rollbacks
- Incident response
- Disaster recovery

## Troubleshooting Guide

### Common Issues
1. **Database Connection**: Check security groups and credentials
2. **SSL Certificate**: Verify certificate validity and domain match
3. **DNS Resolution**: Confirm Route 53 records
4. **Container Health**: Check logs and health check configuration
5. **Performance Issues**: Review resource allocation and scaling

### Diagnostic Commands
```bash
# Check ECS service status
aws ecs describe-services --cluster mental-health-app-cluster --services mental-health-app-service

# View logs
aws logs tail /ecs/mental-health-app --follow

# Check database status
aws rds describe-db-instances --db-instance-identifier mental-health-app-db

# Check ALB target groups
aws elbv2 describe-target-health --target-group-arn <target-group-arn>
```

This architecture provides a flexible, secure, and scalable deployment option for the Mental Health App on AWS, supporting multiple deployment scenarios based on specific requirements and constraints.