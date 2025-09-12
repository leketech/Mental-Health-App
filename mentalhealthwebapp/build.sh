#!/bin/bash
# Build script for deployment platforms

set -e

echo "🔍 Checking Go version..."
go version

echo "📦 Tidying Go modules..."
go mod tidy

echo "🏗️  Building application..."
go build -o main .

echo "✅ Build completed successfully!"
echo "📁 Binary created: main"
ls -la main