#!/bin/bash

# UnwindMind GitHub Deployment Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_status "🚀 Preparing UnwindMind for GitHub deployment..."

# Check if git is initialized
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_status "Initializing git repository..."
    git init
    git branch -M main
fi

# Check for GitHub remote
if ! git remote get-url origin > /dev/null 2>&1; then
    print_error "❌ No GitHub remote found!"
    echo "Please add your GitHub repository as origin:"
    echo "  git remote add origin https://github.com/yourusername/Mental-Health-App.git"
    exit 1
fi

# Get GitHub username from remote URL
GIT_REMOTE=$(git remote get-url origin)
if [[ $GIT_REMOTE =~ github\.com[:/]([^/]+)/([^/]+)\.git ]]; then
    USERNAME=${BASH_REMATCH[1]}
    REPO_NAME=${BASH_REMATCH[2]}
    print_status "Detected GitHub: $USERNAME/$REPO_NAME"
else
    print_error "❌ Could not parse GitHub repository URL"
    exit 1
fi

# Update package.json homepage if needed
PACKAGE_JSON="frontend/package.json"
if grep -q "yourusername" "$PACKAGE_JSON"; then
    print_status "Updating package.json homepage URL..."
    sed -i "s/yourusername/$USERNAME/g" "$PACKAGE_JSON"
    print_success "✅ Updated homepage URL to https://$USERNAME.github.io/$REPO_NAME"
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

# Build frontend locally to test
print_status "Testing frontend build..."
cd frontend
npm run build:ci
cd ..
print_success "✅ Frontend builds successfully"

# Add all files and commit
print_status "Staging changes for deployment..."
git add .

if git diff --cached --quiet; then
    print_warning "⚠️  No changes to commit"
else
    print_status "Committing changes..."
    git commit -m "Deploy to GitHub Pages: Update configuration and add workflows"
fi

# Push to GitHub
print_status "Pushing to GitHub..."
git push origin main

print_success "🎉 Deployment initiated!"
echo ""
echo "📋 Next Steps:"
echo "1. 🔧 Go to https://github.com/$USERNAME/$REPO_NAME/settings/pages"
echo "2. 🔧 Under 'Source', select 'GitHub Actions'"
echo "3. 🔧 Sign up at https://railway.app and deploy your backend"
echo "4. 🔧 Set environment variables in Railway dashboard"
echo "5. 🔧 Update GitHub repository variables with your Railway URL"
echo ""
echo "📍 Your app will be available at:"
echo "   Frontend: https://$USERNAME.github.io/$REPO_NAME"
echo "   Backend: https://your-app.railway.app (after Railway setup)"
echo ""
echo "📖 See GITHUB_DEPLOYMENT.md for detailed instructions"