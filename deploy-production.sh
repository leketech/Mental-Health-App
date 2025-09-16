#!/bin/bash

# Production Deployment Script for UnwindMind

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

# Navigate to the project root directory
cd "$(dirname "$0")"

print_status "🚀 Starting UnwindMind production deployment..."

# Stop any existing containers
print_status "Stopping existing containers..."
docker compose down 2>/dev/null || true

# Build and start services
print_status "Building and starting services..."
docker compose up --build -d

# Wait a moment for services to start
sleep 10

# Check status
print_status "Checking service status..."
docker compose ps

# Check if services are healthy
print_status "Waiting for services to be ready..."

# Wait for database
print_status "Checking database..."
timeout=60
while ! docker compose exec -T db pg_isready -U mental_user -d mental_db >/dev/null 2>&1; do
    sleep 2
    timeout=$((timeout - 2))
    if [ $timeout -le 0 ]; then
        print_error "Database not ready after 60 seconds"
        print_status "Database logs:"
        docker compose logs db
        exit 1
    fi
    echo -n "."
done
echo ""
print_success "Database is ready!"

# Check backend health
print_status "Checking backend API..."
timeout=60
while ! curl -f http://localhost:8080/health >/dev/null 2>&1; do
    sleep 2
    timeout=$((timeout - 2))
    if [ $timeout -le 0 ]; then
        print_error "Backend not responding after 60 seconds"
        print_status "Backend logs:"
        docker compose logs web
        exit 1
    fi
    echo -n "."
done
echo ""
print_success "Backend API is ready!"

# Check frontend
print_status "Checking frontend..."
timeout=30
while ! curl -f http://localhost >/dev/null 2>&1; do
    sleep 2
    timeout=$((timeout - 2))
    if [ $timeout -le 0 ]; then
        print_error "Frontend not responding after 30 seconds"
        print_status "Frontend logs:"
        docker compose logs frontend
        break
    fi
    echo -n "."
done
echo ""

print_success "🎉 UnwindMind application deployed successfully!"
echo ""
echo "📍 Access your application:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:8080"
echo "   Health Check: http://localhost:8080/health"
echo ""
echo "🔧 Useful commands:"
echo "   View logs: docker compose logs -f"
echo "   Stop app: docker compose down"
echo "   Restart: docker compose restart"
echo "   Scale services: docker compose up -d --scale web=3 --scale frontend=3"
echo ""
echo "📈 Performance optimizations applied:"
echo "   - Backend replicas: 2"
echo "   - Frontend replicas: 2"
echo "   - Memory limits set for all services"
echo "   - Gzip compression enabled"
echo "   - Static asset caching configured"
echo "   - Database performance tuning"