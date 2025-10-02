#!/bin/bash

# Test Docker Build Script
# This script tests that both frontend and backend Docker images can be built successfully

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Testing Docker image builds...${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install it first.${NC}"
    exit 1
fi

# Check for common Dockerfile issues
echo -e "${YELLOW}Checking for common Dockerfile issues...${NC}"

# Check if static directory exists for backend
if [ ! -d "./mentalhealthwebapp/static" ]; then
    echo -e "${YELLOW}Note: static directory not found in mentalhealthwebapp (this is OK if not needed)${NC}"
else
    echo -e "${GREEN}static directory found in mentalhealthwebapp${NC}"
fi

# Test frontend build
echo -e "${YELLOW}Testing frontend Docker build...${NC}"
if docker build -t mental-health-frontend-test ./frontend; then
    echo -e "${GREEN}Frontend Docker build successful!${NC}"
    # Clean up test image
    docker rmi mental-health-frontend-test
else
    echo -e "${RED}Frontend Docker build failed!${NC}"
    exit 1
fi

# Test backend build
echo -e "${YELLOW}Testing backend Docker build...${NC}"
if docker build -t mental-health-backend-test -f ./mentalhealthwebapp/Dockerfile ./mentalhealthwebapp; then
    echo -e "${GREEN}Backend Docker build successful!${NC}"
    # Clean up test image
    docker rmi mental-health-backend-test
else
    echo -e "${RED}Backend Docker build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}All Docker builds successful!${NC}"
echo -e "${GREEN}You can now proceed with the deployment.${NC}"