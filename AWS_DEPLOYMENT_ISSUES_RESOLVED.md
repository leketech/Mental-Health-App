# AWS Deployment Issues Resolved

This document summarizes all the issues that were identified and resolved in the AWS deployment configuration.

## Issues Fixed

### 1. RDS PostgreSQL Version Error
**Problem**: `InvalidParameterCombination: Cannot find version 15.4 for postgres`
**Solution**: Updated PostgreSQL version from 15.4 to 15.2 in [terraform/ec2-rds-s3.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/ec2-rds-s3.tf)

### 2. S3 Bucket Name Conflict
**Problem**: `BucketAlreadyExists` error when trying to create the S3 bucket
**Solution**: 
- Re-enabled the random string resource to generate unique bucket names
- Updated the bucket name to use a dynamic suffix: `unwindmind-${random_string.bucket_suffix.result}`
- Updated all references to the bucket ARN in IAM policies to use the dynamic name

### 3. HTTPS Listener Certificate Missing
**Problem**: `A certificate must be specified for HTTPS listeners`
**Solution**:
- Made the HTTPS listener conditional - it's only created when `certificate_arn` is provided and valid
- Made the listener rules conditional - they're only created when the HTTPS listener exists
- Made the `certificate_arn` variable optional with a default empty string
- Added validation to ensure `certificate_arn` is either empty or a valid AWS ACM ARN
- Added validation to ensure proper SSL configuration

### 4. Missing Random Provider
**Problem**: `Missing required provider registry.terraform.io/hashicorp/random`
**Solution**: Added the random provider to the required providers block in [terraform/main.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/main.tf)

## Files Modified

1. **[terraform/main.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/main.tf)**:
   - Added random provider to required providers
   - Made HTTPS listener conditional on certificate_arn
   - Made listener rules conditional on HTTPS listener existence
   - Added validation for SSL configuration

2. **[terraform/ec2-rds-s3.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/ec2-rds-s3.tf)**:
   - Updated PostgreSQL version from 15.4 to 15.2
   - Re-enabled random string resource for unique bucket names
   - Updated bucket name to use dynamic suffix
   - Updated IAM policy ARNs to use dynamic bucket name

3. **[terraform/ecs.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/ecs.tf)**:
   - Updated S3 bucket ARNs in IAM policy to use dynamic name
   - Updated ECS service dependencies comment

4. **[terraform/variables.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/variables.tf)**:
   - Added default empty string for certificate_arn variable

5. **[AWS_DEPLOYMENT_FIXES.md](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/AWS_DEPLOYMENT_FIXES.md)**:
   - Created documentation explaining all fixes

## Configuration Options

### Basic HTTP-Only Deployment
``hcl
# No certificate_arn needed (default is empty)
domain_name = ""
certificate_arn = ""
```

### HTTPS with ACM Certificate
```hcl
domain_name = "yourdomain.com"
certificate_arn = "arn:aws:acm:us-east-1:YOUR_ACCOUNT:certificate/YOUR_CERT_ID"
```

### HTTPS with Let's Encrypt
```hcl
domain_name = "yourdomain.com"
certificate_arn = ""
use_lets_encrypt = true
lets_encrypt_email = "admin@yourdomain.com"
create_route53_records = true
```

## Required Variables

Some variables are required and must be provided in a terraform.tfvars file:

1. **db_password**: Database password for the PostgreSQL instance
2. **jwt_secret**: Secret key for JWT token generation

These can be set in terraform.tfvars:
```hcl
db_password = "your_secure_password_here"
jwt_secret = "your_super_secret_jwt_key_here_change_in_production"
```

To create a terraform.tfvars file from the example:
```bash
cp terraform.tfvars.example terraform.tfvars
# Then edit terraform.tfvars with your actual values
```

## Validation

The configuration now includes validation to ensure proper SSL setup:
- If `domain_name` is set, either `certificate_arn` or `use_lets_encrypt` must be true
- HTTPS listener is only created when a certificate is provided
- All S3 bucket references use dynamic names to avoid conflicts
- All required providers are properly declared

## Testing

The fixes have been validated through:
1. `terraform init` - Successfully initializes and downloads all required providers
2. Configuration files pass syntax validation
3. The infrastructure plan can be generated without errors

The deployment should now complete without the previous errors.