# S3 Bucket Naming

This document explains the S3 bucket naming convention used in the Mental Health App deployment.

## Current Bucket Name

The S3 bucket name has been updated to: `unwindmind-1234`

This is a fixed bucket name that will be used for all deployments instead of the previously generated dynamic name.

## Why the Change?

1. **Consistency**: Using a fixed bucket name makes it easier to reference the bucket across different environments and configurations.

2. **Simplicity**: Removes the need for generating random suffixes, simplifying the Terraform configuration.

3. **Predictability**: Makes it easier to set up IAM policies, CORS configurations, and other bucket-related settings.

## Files Updated

The following files were updated to use the fixed bucket name `unwindmind-1234`:

1. **[terraform/ec2-rds-s3.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/ec2-rds-s3.tf)**:
   - Changed the bucket name from `"mental-health-app-static-${random_string.bucket_suffix.result}"` to `"unwindmind-1234"`
   - Updated the IAM policy document to use the fixed ARN: `arn:aws:s3:::unwindmind-1234`
   - Commented out the `random_string` resource that was used for generating unique suffixes

2. **[terraform/ecs.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/ecs.tf)**:
   - Updated the ECS task S3 policy to use the fixed ARN: `arn:aws:s3:::unwindmind-1234`

## ARN Format

The S3 bucket ARN used in IAM policies is: `arn:aws:s3:::unwindmind-1234`

For object-level permissions, the ARN pattern is: `arn:aws:s3:::unwindmind-1234/*`

## Important Notes

1. **Uniqueness**: S3 bucket names must be globally unique across all AWS accounts. If you encounter naming conflicts during deployment, you may need to modify the bucket name.

2. **Permissions**: All references to the bucket in IAM policies and other AWS services have been updated to use the new fixed name.

3. **Deployment**: The deployment process remains the same, but now uses a predictable bucket name.

## Customization

If you need to use a different bucket name:

1. Update the bucket name in [terraform/ec2-rds-s3.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/ec2-rds-s3.tf):
   ```hcl
   resource "aws_s3_bucket" "app_static" {
     bucket = "your-custom-bucket-name"
   
     tags = {
       Name = "mental-health-app-static"
     }
   }
   ```

2. Update the ARN references in both files:
   - In [terraform/ec2-rds-s3.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/ec2-rds-s3.tf), update the `aws_iam_policy_document` resource
   - In [terraform/ecs.tf](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/terraform/ecs.tf), update the `aws_iam_policy` resource

## Troubleshooting

If you encounter issues with the S3 bucket:

1. **Bucket Already Exists**: If you get an error that the bucket already exists, you'll need to choose a different bucket name that is globally unique.

2. **Permission Issues**: Ensure that all ARN references in the IAM policies match the actual bucket name.

3. **Deployment Failures**: Check that the bucket name conforms to AWS S3 naming requirements:
   - Between 3 and 63 characters long
   - Consists only of lowercase letters, numbers, dots (.), and hyphens (-)
   - Begins and ends with a letter or number
   - Cannot be formatted as an IP address