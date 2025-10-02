#!/bin/bash

# Script to help find your AWS account ID

echo "Finding your AWS account ID..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed."
    echo "Please install the AWS CLI first: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html"
    exit 1
fi

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "Error: AWS CLI is not configured."
    echo "Please configure your AWS CLI: aws configure"
    exit 1
fi

# Get account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "Your AWS Account ID is: $ACCOUNT_ID"

echo ""
echo "To use this in your terraform.tfvars file, replace YOUR_AWS_ACCOUNT_ID in the certificate_arn with: $ACCOUNT_ID"
echo "Example:"
echo "certificate_arn = \"arn:aws:acm:us-east-1:$ACCOUNT_ID:certificate/YOUR_CERTIFICATE_ID\""