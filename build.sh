#!/bin/bash

# Build script for the Mental Health App
# This script builds both the frontend and backend

echo "🔍 Starting build process..."

# Navigate to the project root directory
cd "$(dirname "$0")"

# Create build directory if it doesn't exist
mkdir -p mentalhealthwebapp/frontend/build

# Build the frontend
echo "📦 Building frontend..."
cd frontend
npm run build

# Copy built files to backend directory
echo "🚚 Copying frontend build to backend..."
cp -r build/* ../mentalhealthwebapp/frontend/build/

# Go back to root directory
cd ..

# Build the backend
echo "🔨 Building backend..."
cd mentalhealthwebapp
go build -o main .

echo "✅ Build process completed!"
echo "📁 Frontend build is in mentalhealthwebapp/frontend/build/"
echo "📁 Backend binary is mentalhealthwebapp/main"