#!/bin/bash

# OG Merch Store Deployment Script
# This script handles the complete deployment process

set -e  # Exit on any error

echo "🔥 OG MERCH STORE - DEPLOYMENT SCRIPT 🔥"
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_status "Docker and Docker Compose are available"

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p backend/logs
mkdir -p frontend/build

# Check if .env file exists for backend
if [ ! -f "backend/.env" ]; then
    print_warning "Backend .env file not found. Copying from template..."
    cp backend/.env.production backend/.env
    print_warning "Please edit backend/.env with your actual configuration values"
fi

# Build and start services
print_status "Building and starting services..."
docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    print_status "Services are running successfully!"
    echo ""
    echo "🎉 DEPLOYMENT SUCCESSFUL! 🎉"
    echo "========================="
    echo "Frontend: http://localhost"
    echo "Backend API: http://localhost:8000"
    echo "Backend Health: http://localhost:8000/health"
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop services: docker-compose down"
else
    print_error "Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi

# Show running containers
print_status "Running containers:"
docker-compose ps

echo ""
print_status "Deployment completed successfully! 🚀"