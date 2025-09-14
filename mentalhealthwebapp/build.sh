#!/bin/sh

# Ensure we're in the correct directory
cd /app

echo "🔍 Current directory: $(pwd)"
echo "📂 Listing files in current directory:"
ls -la

# Check if required files exist
if [ ! -f "go.mod" ]; then
    echo "❌ go.mod file not found"
    echo "🔍 Looking for go.mod in parent directories:"
    find .. -name "go.mod" -type f
    exit 1
fi

if [ ! -f "go.sum" ]; then
    echo "❌ go.sum file not found"
    echo "🔍 Looking for go.sum in parent directories:"
    find .. -name "go.sum" -type f
    exit 1
fi

echo "✅ Found go.mod and go.sum files"
echo "📦 Building application..."

# Build the application
go build -ldflags="-w -s" -a -installsuffix cgo -o main .

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi