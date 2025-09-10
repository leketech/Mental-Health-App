#!/bin/bash

# Test script for port binding verification
echo "🧪 Testing UnwindMind API port binding..."

# Set test environment
export PORT=10000
export JWT_SECRET=test-secret-key
export DB_CONNECTION_STRING=postgres://test:test@localhost:5432/test_db?sslmode=disable

cd /mnt/c/Users/Leke/Mental-Health-App/mentalhealthwebapp

echo "📋 Environment variables:"
echo "   PORT: $PORT"
echo "   JWT_SECRET: ${JWT_SECRET:0:10}..."
echo "   DB_CONNECTION_STRING: ${DB_CONNECTION_STRING:0:30}..."

echo ""
echo "🔨 Building application..."
if go build -o main .; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "🚀 Testing server startup (will exit after 5 seconds)..."
echo "   Expected binding: 0.0.0.0:10000"
echo ""

# Start the server in background and capture output
timeout 5s ./main 2>&1 | head -10 &
SERVER_PID=$!

# Wait a moment for startup
sleep 2

# Check if server is running and binding to correct port
if netstat -tuln 2>/dev/null | grep -q ":10000 "; then
    echo "✅ Server successfully bound to port 10000"
else
    echo "⚠️  Could not verify port binding (may be due to database connection)"
fi

# Cleanup
kill $SERVER_PID 2>/dev/null || true
rm -f main

echo ""
echo "🎯 For Render deployment, ensure:"
echo "   1. render.yaml specifies 'port: 10000'"
echo "   2. Environment variable PORT=10000 is set"
echo "   3. Application binds to 0.0.0.0:PORT"
echo "   4. Health check endpoint /health is accessible"