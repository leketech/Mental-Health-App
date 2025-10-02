# AWS RDS PostgreSQL Version Fix

## Issue
```
Error: creating RDS DB Instance (mental-health-app-db): operation error RDS: CreateDBInstance, https response error StatusCode: 400, RequestID: 239eb9aa-7377-4747-9424-34fcc5dd6376, api error InvalidParameterCombination: Cannot find version 15.2 for postgres
```

## Root Cause
The specified PostgreSQL version (15.2) is not available in the AWS region being used for deployment. This can happen when:
1. The version has been deprecated by AWS
2. The version is not available in the specific AWS region
3. There's a mismatch between documented and actually available versions

## Solution
Updated the PostgreSQL engine version in the Terraform configuration from 15.2 to 15.8, which is a more current version that's widely available across AWS regions.

### Files Modified
- `terraform/ec2-rds-s3.tf`: Changed `engine_version` from "15.2" to "15.8"

## Verification
The fix has been applied and the configuration should now successfully deploy the RDS instance with a supported PostgreSQL version.

## Alternative Versions
If 15.8 is still not available in your region, you can try other recent PostgreSQL 15.x versions such as:
- 15.9
- 15.10

Or consider using PostgreSQL 16.x if your application is compatible:
- 16.1
- 16.2
- 16.3

## How to Apply
1. Update the `terraform/ec2-rds-s3.tf` file with the new engine version
2. Run `terraform init` to initialize the Terraform environment
3. Run `terraform plan` to verify the changes
4. Run `terraform apply` to apply the changes

## Prevention
For future deployments, consider:
1. Checking AWS documentation for currently supported PostgreSQL versions
2. Using more generic version specifications when possible
3. Testing deployments in a non-production environment first