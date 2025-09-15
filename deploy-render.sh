#!/bin/bash

# Deployment script for Render - Updated for separate frontend/backend deployment

echo "🚀 Starting deployment process for UnwindMind App..."

# Check if we're in the right directory
if [ ! -f "render.yaml" ]; then
    echo "❌ Error: render.yaml not found in current directory"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo "📋 This project now uses a separate deployment approach:"
echo "   1. Frontend: Deployed as a Render Static Site"
echo "   2. Backend: Deployed as a Render Web Service"
echo "   3. Database: PostgreSQL service on Render"

echo ""
echo "🔧 To deploy the frontend:"
echo "   1. Go to your Render dashboard"
echo "   2. Create a new Static Site"
echo "   3. Connect this repository"
echo "   4. Set root directory to 'frontend'"
echo "   5. Set build command to 'npm run build'"
echo "   6. Set publish directory to 'build'"
echo "   7. Add environment variable REACT_APP_API_URL"

echo ""
echo "🔧 To deploy the backend:"
echo "   1. Go to your Render dashboard"
echo "   2. Create a new Web Service"
echo "   3. Connect this repository"
echo "   4. Set root directory to 'mentalhealthwebapp'"
echo "   5. Set environment to 'Docker'"
echo "   6. Set Dockerfile path to 'Dockerfile.backend'"
echo "   7. Add required environment variables"

echo ""
echo "📄 For detailed instructions, see:"
echo "   - FRONTEND_DEPLOYMENT.md"
echo "   - BACKEND_DEPLOYMENT.md"

echo ""
echo "✅ Deployment process information provided!"
echo "💡 Note: Manual deployment through Render dashboard is recommended for this architecture"