#!/bin/bash

# Test script to verify Go server can bind to port 10000
echo "🧪 Testing UnwindMind API server port binding..."

# Set environment variables for testing
export PORT=10000
export JWT_SECRET=test-secret-key
export DB_CONNECTION_STRING=postgres://test:test@localhost:5432/test?sslmode=disable
export CORS_ORIGIN=http://localhost:3000

# Build the Go application
echo "🔨 Building Go application..."
cd mentalhealthwebapp
go build -o main .

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Start the server in background
echo "🚀 Starting server on port $PORT..."
./main &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Test if port is bound
echo "🔍 Testing port binding..."
if curl -f http://localhost:10000/health 2>/dev/null; then
    echo "✅ Server is responding on port 10000!"
    echo "✅ Health check passed!"
else
    echo "❌ Server is not responding on port 10000"
fi

# Test root endpoint
if curl -f http://localhost:10000/ 2>/dev/null; then
    echo "✅ Root endpoint is working!"
else
    echo "❌ Root endpoint failed"
fi

# Clean up
echo "🧹 Cleaning up..."
kill $SERVER_PID 2>/dev/null
rm -f main

echo "🏁 Test completed!"