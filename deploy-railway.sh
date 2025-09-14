#!/bin/bash

# Deployment script for Railway
echo "🚀 Starting deployment to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null
then
    echo "❌ Railway CLI could not be found. Please install it first:"
    echo "   curl -fsSL https://railway.app/install.sh | sh"
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