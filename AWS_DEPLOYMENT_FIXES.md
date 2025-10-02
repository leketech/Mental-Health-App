# AWS Deployment Fixes

This document explains the fixes implemented to resolve the AWS deployment errors.

## Issues Fixed

### 1. RDS PostgreSQL Version Error
**Error**: `InvalidParameterCombination: Cannot find version 15.4 for postgres`

**Fix**: Updated the PostgreSQL version from 15.4 to 15.2 in [terraform/ec2-rds-s3.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/ec2-rds-s3.tf):
``hcl
# Before
engine_version = "15.4"

# After
engine_version = "15.2"
```

### 2. S3 Bucket Name Conflict
**Error**: `BucketAlreadyExists`

**Fix**: 
1. Re-enabled the random string resource to generate unique bucket names
2. Updated the bucket name to use a dynamic suffix: `unwindmind-${random_string.bucket_suffix.result}`
3. Updated all references to the bucket ARN in IAM policies to use the dynamic name

**Files Modified**:
- [terraform/ec2-rds-s3.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/ec2-rds-s3.tf)
- [terraform/ecs.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/ecs.tf)

### 3. HTTPS Listener Certificate Missing
**Error**: `A certificate must be specified for HTTPS listeners`

**Fix**:
1. Made the HTTPS listener conditional - it's only created when `certificate_arn` is provided
2. Made the listener rules conditional - they're only created when the HTTPS listener exists
3. Made the `certificate_arn` variable optional with a default empty string
4. Updated ECS service dependencies to handle the conditional listener

**Changes Made**:
``hcl
# Before
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.certificate_arn
  # ...
}

# After
resource "aws_lb_listener" "https" {
  count             = var.certificate_arn != "" ? 1 : 0
  load_balancer_arn = aws_lb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.certificate_arn
  # ...
}
```

## Files Modified

1. **[terraform/ec2-rds-s3.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/ec2-rds-s3.tf)**:
   - Updated PostgreSQL version from 15.4 to 15.2
   - Re-enabled random string resource for unique bucket names
   - Updated bucket name to use dynamic suffix
   - Updated IAM policy ARNs to use dynamic bucket name

2. **[terraform/ecs.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/ecs.tf)**:
   - Updated S3 bucket ARNs in IAM policy to use dynamic name
   - Updated ECS service dependencies comment

3. **[terraform/main.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/main.tf)**:
   - Made HTTPS listener conditional on certificate_arn
   - Made listener rules conditional on HTTPS listener existence
   - Added validation for SSL configuration
   - Added default value for certificate_arn variable

4. **[terraform/variables.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/variables.tf)**:
   - Added default empty string for certificate_arn variable

## Configuration Options

### Basic HTTP-Only Deployment
For a basic deployment with HTTP only (no SSL), use this configuration in `terraform.tfvars`:
```hcl
# No certificate_arn needed
domain_name = ""
certificate_arn = ""
```

### HTTPS with ACM Certificate
For HTTPS with an existing ACM certificate:
```hcl
domain_name = "yourdomain.com"
certificate_arn = "arn:aws:acm:us-east-1:YOUR_ACCOUNT:certificate/YOUR_CERT_ID"
```

### HTTPS with Let's Encrypt
For HTTPS with Let's Encrypt:
```hcl
domain_name = "yourdomain.com"
certificate_arn = ""
use_lets_encrypt = true
lets_encrypt_email = "admin@yourdomain.com"
```

## Validation

The configuration now includes validation to ensure proper SSL setup:
- If `domain_name` is set, either `certificate_arn` or `use_lets_encrypt` must be true
- HTTPS listener is only created when a certificate is provided
- All S3 bucket references use dynamic names to avoid conflicts

## Testing

To test the fixes:
1. Run `terraform init` to initialize the backend
2. Run `terraform plan` to verify the configuration
3. Run `terraform apply` to deploy the infrastructure

The deployment should now complete without the previous errors.