#!/bin/bash

# Deployment script for Railway
echo "🚀 Starting deployment to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null
then
    echo "❌ Railway CLI could not be found."
    echo "Please install it first by running:"
    echo "curl -fsSL https://railway.app/install.sh | sh"
    echo ""
    echo "Or deploy manually through the Railway dashboard:"
    echo "1. Go to https://railway.app"
    echo "2. Create a new project"
    echo "3. Connect your GitHub repository"
    echo "4. Set the root directory to 'mentalhealthwebapp'"
    echo "5. Set the Dockerfile path to 'Dockerfile.production'"
    exit 1
fi

# Login to Railway (if not already logged in)
echo "🔐 Logging into Railway..."
railway login

# Deploy the application
echo "🚢 Deploying application..."
railway up

echo "✅ Deployment completed!"
echo "🌐 Visit your application at: https://unwindmind.life"