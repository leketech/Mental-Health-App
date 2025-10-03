# AWS Certificate Manager Configuration

## Overview
This configuration enables automatic SSL certificate management for the Mental Health App using AWS Certificate Manager (ACM). It provides two approaches for SSL configuration:

1. **Automatic certificate fetching** - Automatically fetches issued certificates from ACM
2. **Manual certificate ARN** - Uses a certificate ARN provided via Terraform variables

## Files Created

### [terraform/acm.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/acm.tf)
Contains the AWS Certificate Manager configuration:
- Data source to fetch issued certificates from ACM
- HTTPS listener using the fetched certificate
- HTTP to HTTPS redirect listener
- Listener rules for routing traffic to frontend and backend services

## Configuration Options

### 1. Automatic Certificate Fetching (New)
To use automatic certificate fetching:

1. Set the `domain_name` variable in [terraform.tfvars](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/terraform.tfvars):
   ```hcl
   domain_name = "unwindmind.life"
   ```

2. Ensure a certificate for the domain exists in AWS Certificate Manager with "ISSUED" status

### 2. Manual Certificate ARN (Existing)
To use a manually specified certificate ARN:

1. Set both `domain_name` and `certificate_arn` variables:
   ```hcl
   domain_name = "unwindmind.life"
   certificate_arn = "arn:aws:acm:us-east-1:YOUR_ACCOUNT:certificate/YOUR_CERT_ID"
   ```

### 3. HTTP Only (Default)
To run without SSL (development/testing):

1. Leave `domain_name` and `certificate_arn` as empty strings (default)

## How It Works

### Certificate Selection Priority
1. If `certificate_arn` is provided and `domain_name` is set, use the manual certificate
2. If only `domain_name` is set, automatically fetch the certificate from ACM
3. If neither is set, run in HTTP-only mode

### HTTP to HTTPS Redirection
When SSL is enabled (either automatically or manually), all HTTP traffic is automatically redirected to HTTPS.

## Prerequisites

1. **Domain Name**: You must own or control the domain name you want to use
2. **Certificate in ACM**: A certificate for your domain must exist in AWS Certificate Manager
3. **Certificate Status**: The certificate must be in "ISSUED" status

## Certificate Request Process

If you don't have a certificate in ACM:

1. Request a certificate in the AWS Certificate Manager console
2. Choose the domain name you want to use
3. Select DNS validation method
4. Create the DNS validation records as instructed
5. Wait for the certificate to be issued (usually takes a few minutes)

## Variables

The configuration uses the following variables from [variables.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/variables.tf):

- `domain_name`: The domain name for the application
- `certificate_arn`: (Optional) Manual certificate ARN

## Validation

The configuration includes validation to ensure:
- Domain name is provided when using SSL features
- Certificate ARN is valid when provided
- Proper SSL configuration is used

## Testing

After deployment, you can test the configuration:

1. **Check certificate fetching**:
   ```bash
   terraform plan
   ```

2. **Verify HTTPS listener**:
   ```bash
   aws elbv2 describe-listeners --load-balancer-arn YOUR_LOAD_BALANCER_ARN
   ```

3. **Test redirection**:
   ```bash
   curl -I http://your-domain.com
   # Should return a 301 redirect to https://your-domain.com
   ```

## Troubleshooting

### Certificate Not Found
If Terraform cannot find your certificate:
- Verify the certificate exists in ACM
- Check that the domain name matches exactly
- Ensure the certificate status is "ISSUED"
- Check that the certificate is in the same region as your deployment

### Certificate ARN Validation Failed
If you get validation errors with the certificate ARN:
- Verify the ARN format is correct
- Ensure the ARN points to a valid ACM certificate
- Check that the certificate is in the same region

### HTTP Redirect Not Working
If HTTP to HTTPS redirect is not working:
- Verify both listeners are created
- Check the listener rules
- Ensure the security group allows traffic on ports 80 and 443