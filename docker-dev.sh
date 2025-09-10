#!/bin/bash

# UnwindMind Docker Development Script

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

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/mentalhealthwebapp"

# Function to clean up Docker resources
cleanup() {
    print_status "Cleaning up Docker resources..."
    docker compose down --volumes --remove-orphans 2>/dev/null || true
    docker system prune -f 2>/dev/null || true
}

# Function to build and run the application
build_and_run() {
    print_status "Building and starting UnwindMind application..."
    
    # Clean up first
    cleanup
    
    # Build with no cache to ensure fresh build
    print_status "Building Docker images..."
    docker compose build --no-cache --parallel
    
    # Start services
    print_status "Starting services..."
    docker compose up -d db
    
    # Wait for database
    print_status "Waiting for database to be ready..."
    timeout=60
    while ! docker compose exec -T db pg_isready -U mental_user -d mental_db >/dev/null 2>&1; do
        sleep 2
        timeout=$((timeout - 2))
        if [ $timeout -le 0 ]; then
            print_error "Database failed to start within 60 seconds"
            exit 1
        fi
    done
    
    # Start backend
    print_status "Starting backend service..."
    docker compose up -d web
    
    # Wait for backend
    print_status "Waiting for backend to be ready..."
    timeout=60
    while ! curl -f http://localhost:3001/health >/dev/null 2>&1; do
        sleep 2
        timeout=$((timeout - 2))
        if [ $timeout -le 0 ]; then
            print_error "Backend failed to start within 60 seconds"
            exit 1
        fi
    done
    
    # Start frontend
    print_status "Starting frontend service..."
    docker compose up -d frontend
    
    print_success "UnwindMind application is running!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend API: http://localhost:3001"
    print_status "Database: localhost:5432"
    print_status ""
    print_status "To view logs: docker compose logs -f"
    print_status "To stop: docker compose down"
}

# Function to show logs
show_logs() {
    print_status "Showing application logs..."
    docker compose logs -f
}

# Function to stop the application
stop() {
    print_status "Stopping UnwindMind application..."
    docker compose down
    print_success "Application stopped"
}

# Function to restart the application
restart() {
    print_status "Restarting UnwindMind application..."
    docker compose restart
    print_success "Application restarted"
}

# Function to show status
status() {
    print_status "UnwindMind application status:"
    docker compose ps
}

# Main script logic
case "${1:-help}" in
    "start"|"run")
        build_and_run
        ;;
    "stop")
        stop
        ;;
    "restart")
        restart
        ;;
    "logs")
        show_logs
        ;;
    "status")
        status
        ;;
    "clean")
        cleanup
        print_success "Cleanup completed"
        ;;
    "help"|*)
        echo "UnwindMind Docker Development Script"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  start   - Build and start the application"
        echo "  stop    - Stop the application"
        echo "  restart - Restart the application"
        echo "  logs    - Show application logs"
        echo "  status  - Show application status"
        echo "  clean   - Clean up Docker resources"
        echo "  help    - Show this help message"
        echo ""
        echo "After starting, the application will be available at:"
        echo "  Frontend: http://localhost:3000"
        echo "  Backend:  http://localhost:3001"
        ;;
esac