#!/bin/bash

# Native UnwindMind Startup Script (without Docker)
# This runs the components directly on the host system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

print_status "🚀 Starting UnwindMind application in native mode..."

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL is not installed. Please install PostgreSQL first:"
    echo "  sudo apt update"
    echo "  sudo apt install postgresql postgresql-contrib"
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first:"
    echo "  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
    echo "  sudo apt install nodejs"
    exit 1
fi

# Check if Go is available
if ! command -v go &> /dev/null; then
    print_error "Go is not installed. Please install Go first:"
    echo "  wget https://go.dev/dl/go1.21.0.linux-amd64.tar.gz"
    echo "  sudo tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz"
    echo "  export PATH=\$PATH:/usr/local/go/bin"
    exit 1
fi

print_status "All required tools are available!"

# Set environment variables
export PORT=3001
export DB_CONNECTION_STRING="postgres://mental_user:mental_pass@localhost:5432/mental_db?sslmode=disable"
export JWT_SECRET="your-super-secret-jwt-key-change-in-production"
export CORS_ORIGIN="http://localhost:3000"
export REACT_APP_API_URL="http://localhost:3001"

print_status "Environment variables set"

# Start PostgreSQL service if not running
if ! sudo systemctl is-active --quiet postgresql; then
    print_status "Starting PostgreSQL service..."
    sudo systemctl start postgresql
fi

# Setup database
print_status "Setting up database..."
sudo -u postgres psql -c "CREATE USER mental_user WITH PASSWORD 'mental_pass';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE mental_db OWNER mental_user;" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE mental_db TO mental_user;" 2>/dev/null || true

# Run database initialization script
if [ -f "mentalhealthwebapp/init.sql" ]; then
    print_status "Initializing database schema..."
    PGPASSWORD=mental_pass psql -h localhost -U mental_user -d mental_db -f mentalhealthwebapp/init.sql 2>/dev/null || print_warning "Database may already be initialized"
fi

# Build and run backend
print_status "Building Go backend..."
cd mentalhealthwebapp
go mod tidy
go build -o main .

print_status "Starting backend server..."
./main &
BACKEND_PID=$!
cd ..

# Wait for backend to start
print_status "Waiting for backend to be ready..."
timeout=30
while ! curl -f http://localhost:3001/health >/dev/null 2>&1; do
    sleep 2
    timeout=$((timeout - 2))
    if [ $timeout -le 0 ]; then
        print_error "Backend failed to start"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    echo -n "."
done
echo ""
print_success "Backend is ready!"

# Build and run frontend
print_status "Installing frontend dependencies..."
cd frontend
npm install

print_status "Starting frontend development server..."
npm start &
FRONTEND_PID=$!
cd ..

print_success "🎉 UnwindMind application started successfully!"
echo ""
echo "📍 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   Health Check: http://localhost:3001/health"
echo ""
echo "🛑 To stop the application:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop all services"

# Create cleanup function
cleanup() {
    print_status "Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    print_success "Services stopped"
    exit 0
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait