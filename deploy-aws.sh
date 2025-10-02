#!/bin/bash

# AWS Deployment Script for Mental Health App
# This script builds and deploys Docker images to AWS ECR and updates ECS service

set -e  # Exit on any error

# Configuration
AWS_REGION="us-east-1"
FRONTEND_REPO="mental-health-app-frontend"
BACKEND_REPO="mental-health-app-backend"
CLUSTER_NAME="mental-health-app-cluster"
SERVICE_NAME="mental-health-app-service"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting AWS deployment process...${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install it first.${NC}"
    exit 1
fi

# Get AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# Login to AWS ECR
echo -e "${YELLOW}Logging in to AWS ECR...${NC}"
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

# Create ECR repositories if they don't exist
echo -e "${YELLOW}Creating ECR repositories if they don't exist...${NC}"
aws ecr describe-repositories --repository-names $FRONTEND_REPO || aws ecr create-repository --repository-name $FRONTEND_REPO
aws ecr describe-repositories --repository-names $BACKEND_REPO || aws ecr create-repository --repository-name $BACKEND_REPO

# Test ECR connectivity
echo -e "${YELLOW}Testing ECR connectivity...${NC}"
if curl -s -o /dev/null -w "%{http_code}" https://$ECR_REGISTRY/v2/ | grep -q "401"; then
    echo -e "${GREEN}ECR connectivity test passed${NC}"
else
    echo -e "${RED}ECR connectivity test failed${NC}"
    exit 1
fi

# Build and push frontend image
echo -e "${YELLOW}Building and pushing frontend image...${NC}"
docker build -t $FRONTEND_REPO ./frontend

# Tag and push with retry logic
for i in {1..3}; do
    echo -e "${YELLOW}Attempt $i to push frontend image...${NC}"
    if docker tag $FRONTEND_REPO:latest $ECR_REGISTRY/$FRONTEND_REPO:latest && docker push $ECR_REGISTRY/$FRONTEND_REPO:latest; then
        echo -e "${GREEN}Frontend image pushed successfully${NC}"
        break
    else
        echo -e "${YELLOW}Frontend push attempt $i failed, waiting 10 seconds before retry...${NC}"
        sleep 10
        if [ $i -eq 3 ]; then
            echo -e "${RED}Failed to push frontend image after 3 attempts${NC}"
            exit 1
        fi
    fi
done

# Build and push backend image
echo -e "${YELLOW}Building and pushing backend image...${NC}"
docker build -t $BACKEND_REPO -f ./mentalhealthwebapp/Dockerfile ./mentalhealthwebapp

# Tag and push with retry logic
for i in {1..3}; do
    echo -e "${YELLOW}Attempt $i to push backend image...${NC}"
    if docker tag $BACKEND_REPO:latest $ECR_REGISTRY/$BACKEND_REPO:latest && docker push $ECR_REGISTRY/$BACKEND_REPO:latest; then
        echo -e "${GREEN}Backend image pushed successfully${NC}"
        break
    else
        echo -e "${YELLOW}Backend push attempt $i failed, waiting 10 seconds before retry...${NC}"
        sleep 10
        if [ $i -eq 3 ]; then
            echo -e "${RED}Failed to push backend image after 3 attempts${NC}"
            exit 1
        fi
    fi
done

# Update ECS service
echo -e "${YELLOW}Updating ECS service...${NC}"
aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --force-new-deployment

# Wait for service to stabilize
echo -e "${YELLOW}Waiting for service to stabilize...${NC}"
aws ecs wait services-stable --cluster $CLUSTER_NAME --services $SERVICE_NAME

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}Your application should be accessible through the Load Balancer DNS.${NC}"