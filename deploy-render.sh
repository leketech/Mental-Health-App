#!/bin/bash

# Deployment script for Render
echo "🚀 Preparing for Render deployment..."

# Check if we're in the correct directory
if [ ! -f "render.yaml" ]; then
    echo "❌ render.yaml not found in current directory"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo "✅ Found render.yaml configuration"

# Display deployment instructions
echo ""
echo "📋 To deploy to Render:"
echo "========================"
echo "1. Go to https://render.com"
echo "2. Sign up or log in to your Render account"
echo "3. Click 'New' and select 'Web Service'"
echo "4. Connect your GitHub repository"
echo "5. Set the following options:"
echo "   - Name: unwindmind"
echo "   - Region: Choose your preferred region"
echo "   - Branch: main (or your default branch)"
echo "   - Root Directory: leave empty"
echo "   - Environment: Docker"
echo "   - Docker Command: leave empty"
echo "   - Instance Type: Free"
echo ""
echo "6. Add the following environment variables:"
echo "   - JWT_SECRET: [generate a strong secret]"
echo "   - DATABASE_URL: [will be auto-provisioned by Render]"
echo "   - CORS_ORIGIN: https://unwindmind-frontend.onrender.com"
echo ""
echo "7. Click 'Create Web Service'"
echo ""
echo "📝 Note: Render will automatically provision a PostgreSQL database"
echo "   and set the DATABASE_URL environment variable for you."
echo ""
echo "🔗 After deployment, your app will be available at:"
echo "   Frontend: https://unwindmind-frontend.onrender.com"
echo "   API: https://unwindmind-api.onrender.com"