# Terraform Configuration Validation

This document explains how to validate the Terraform configuration for the Mental Health App deployment.

## Validation Steps

### 1. Syntax Validation

Check that all Terraform files have valid syntax:
```bash
terraform validate
```

### 2. Plan Generation

Generate a deployment plan to verify configuration:
```bash
terraform plan -var-file="terraform.tfvars"
```

### 3. Common Validation Scenarios

#### HTTP-Only Deployment (Default)
- certificate_arn = ""
- No HTTPS listener will be created
- HTTP traffic only

#### HTTPS Deployment with ACM Certificate
- certificate_arn = "arn:aws:acm:us-east-1:ACCOUNT:certificate/CERT_ID"
- HTTPS listener will be created
- HTTP to HTTPS redirection enabled

#### HTTPS Deployment with Let's Encrypt
- certificate_arn = ""
- use_lets_encrypt = true
- domain_name must be set
- Route 53 records will be created

## Required Variables Validation

The configuration includes built-in validation for required variables:

1. **certificate_arn**: 
   - Must be empty or a valid AWS ACM ARN
   - Validation: `length(regexall("^arn:aws:acm:", var.certificate_arn)) > 0`

2. **db_password**: 
   - Must be provided (no default)
   - Marked as sensitive

3. **jwt_secret**: 
   - Must be provided (no default)
   - Marked as sensitive

## Conditional Resource Validation

### HTTPS Listener
Created only when:
```hcl
count = var.certificate_arn != "" ? 1 : 0
```

### Listener Rules
Created only when HTTPS listener exists:
```hcl
count = var.certificate_arn != "" ? 1 : 0
listener_arn = aws_lb_listener.https[0].arn
```

## Configuration Examples

### 1. Minimal HTTP-Only Configuration
```hcl
region = "us-east-1"
db_password = "secure_password"
jwt_secret = "secure_jwt_secret"
certificate_arn = ""
```

### 2. HTTPS with ACM Certificate
```hcl
region = "us-east-1"
db_password = "secure_password"
jwt_secret = "secure_jwt_secret"
certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012"
domain_name = "example.com"
```

### 3. HTTPS with Let's Encrypt
```hcl
region = "us-east-1"
db_password = "secure_password"
jwt_secret = "secure_jwt_secret"
certificate_arn = ""
domain_name = "example.com"
create_route53_records = true
use_lets_encrypt = true
lets_encrypt_email = "admin@example.com"
```

## Troubleshooting

### Common Validation Errors

1. **Invalid certificate_arn format**:
   - Error: "Certificate ARN must be empty or a valid AWS ACM ARN"
   - Solution: Ensure certificate ARN starts with "arn:aws:acm:" or leave empty

2. **Missing required variables**:
   - Error: "The root module input variable is not set"
   - Solution: Provide values for db_password and jwt_secret

3. **Conditional resource reference errors**:
   - Error: "Invalid index" when referencing aws_lb_listener.https[0].arn
   - Solution: Ensure count condition matches resource reference

### Validation Commands

Check configuration syntax:
```bash
terraform validate
```

Format configuration files:
```bash
terraform fmt
```

Show configuration variables:
```bash
terraform console
> var.certificate_arn
```

The configuration has been designed to be flexible and robust, supporting multiple deployment scenarios while maintaining proper validation.