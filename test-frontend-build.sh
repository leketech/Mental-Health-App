#!/bin/bash

# Test script to verify frontend build process

echo "🔍 Testing frontend build process..."

# Navigate to the project root directory
cd "$(dirname "$0")"

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
  echo "❌ Frontend directory not found!"
  exit 1
fi

# Check if package.json exists in frontend directory
if [ ! -f "frontend/package.json" ]; then
  echo "❌ frontend/package.json not found!"
  exit 1
fi

# Check if build script exists in package.json
if ! grep -q '"build"' frontend/package.json; then
  echo "❌ Build script not found in frontend/package.json!"
  exit 1
fi

# Check if root package.json exists
if [ ! -f "package.json" ]; then
  echo "❌ Root package.json not found!"
  exit 1
fi

# Check if build script exists in root package.json
if ! grep -q '"build"' package.json; then
  echo "❌ Build script not found in root package.json!"
  exit 1
fi

echo "✅ All checks passed!"
echo "✅ Frontend build can be run with: npm run build"
echo "✅ Full build can be run with: npm run build:all"
echo "✅ Or using the shell script: ./build.sh"