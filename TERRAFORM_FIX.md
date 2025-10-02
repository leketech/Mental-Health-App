# Terraform Configuration Fix

This document explains the fix for the Terraform initialization error that occurred due to duplicate variable declarations.

## Problem

When running `terraform init`, the following errors were encountered:

```
Error: Duplicate variable declaration
A variable named "domain_name" was already declared at route53.tf:4,1-23. Variable names must be unique within a module.
```

Similar errors occurred for other variables across multiple files:
- `domain_name`
- `create_route53_records`
- `ec2_instance_type`
- `ec2_key_name`
- `deploy_to_ec2`
- `deploy_to_elastic_beanstalk`
- `eb_application_name`
- `eb_environment_name`
- `use_lets_encrypt`
- `lets_encrypt_email`

## Root Cause

The variables were declared in both the main [variables.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/variables.tf) file and in separate module files ([route53.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/route53.tf), [ec2.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/ec2.tf), [elastic-beanstalk.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/elastic-beanstalk.tf), [letsencrypt.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/letsencrypt.tf)). Terraform requires variable names to be unique within a module, so having them declared in multiple files caused conflicts.

## Solution

1. **Removed duplicate variable declarations** from the separate module files:
   - [route53.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/route53.tf)
   - [ec2.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/ec2.tf)
   - [elastic-beanstalk.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/elastic-beanstalk.tf)
   - [letsencrypt.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/letsencrypt.tf)

2. **Kept all variable declarations** in the main [variables.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/variables.tf) file, which is the standard location for variable definitions.

3. **Added missing variables** to [variables.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/variables.tf):
   - `use_lets_encrypt`
   - `lets_encrypt_email`

## Files Modified

1. **[terraform/variables.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/variables.tf)**:
   - Added missing `use_lets_encrypt` and `lets_encrypt_email` variables

2. **[terraform/route53.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/route53.tf)**:
   - Removed duplicate `domain_name` and `create_route53_records` variable declarations

3. **[terraform/ec2.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/ec2.tf)**:
   - Removed duplicate `ec2_instance_type`, `ec2_key_name`, and `deploy_to_ec2` variable declarations

4. **[terraform/elastic-beanstalk.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/elastic-beanstalk.tf)**:
   - Removed duplicate `deploy_to_elastic_beanstalk`, `eb_application_name`, and `eb_environment_name` variable declarations

5. **[terraform/letsencrypt.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/letsencrypt.tf)**:
   - Removed duplicate `use_lets_encrypt` and `lets_encrypt_email` variable declarations

## Verification

After making these changes, `terraform init` completes successfully without any duplicate variable declaration errors.

## Prevention

To avoid similar issues in the future:
1. Always declare variables in the main [variables.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/variables.tf) file
2. Use `terraform validate` regularly to catch configuration issues early
3. When adding new modules, reference existing variables rather than redeclaring them