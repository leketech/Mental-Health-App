# Finding Your AWS Account ID

This document explains how to find your AWS account ID, which is needed for configuring the Terraform deployment.

## Method 1: Using AWS CLI (Recommended)

The easiest way to find your AWS account ID is by using the AWS CLI:

```bash
aws sts get-caller-identity
```

This command will return output similar to:
```json
{
    "UserId": "AIDACKCEVSQ6C2EXAMPLE",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/username"
}
```

The "Account" field contains your 12-digit AWS account ID.

## Method 2: AWS Management Console

1. Sign in to the AWS Management Console
2. In the top navigation bar, click on your account name or number
3. Your account ID will be displayed in the dropdown menu

## Method 3: Account Settings Page

1. Sign in to the AWS Management Console
2. Click on your account name in the top navigation bar
3. Select "My Account" from the dropdown menu
4. Your account ID will be displayed under the "Account Settings" section

## Using Your Account ID in Terraform Configuration

Once you have your AWS account ID, you'll need to use it in your `terraform.tfvars` file for the SSL certificate ARN:

```hcl
certificate_arn = "arn:aws:acm:us-east-1:YOUR_AWS_ACCOUNT_ID:certificate/YOUR_CERTIFICATE_ID"
```

Replace `YOUR_AWS_ACCOUNT_ID` with your actual 12-digit account ID.

For example, if your account ID is 123456789012, your certificate ARN would look like:
```hcl
certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012"
```

## Using the Helper Script

We've provided a helper script [get-aws-account-id.sh](file:///mnt/c/Users/Leke/Unwindmind/Mental-Health-App/get-aws-account-id.sh) that automatically retrieves your AWS account ID:

```bash
./get-aws-account-id.sh
```

This script will:
1. Verify that AWS CLI is installed and configured
2. Retrieve your account ID
3. Show you how to use it in your configuration

## Prerequisites

Before using these methods, ensure you have:
1. AWS CLI installed and configured with appropriate credentials
2. Sufficient permissions to call the `sts:GetCallerIdentity` API

## Troubleshooting

If you encounter issues:

1. **AWS CLI not found**: Install the AWS CLI from https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html

2. **Not configured**: Run `aws configure` to set up your credentials

3. **Insufficient permissions**: Ensure your AWS user/role has permissions for the `sts:GetCallerIdentity` action (this is available by default to all IAM users)