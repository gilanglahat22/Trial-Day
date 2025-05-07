#!/bin/bash

# Script to start all services with docker-compose

echo "🚀 Starting Restaurant List Application..."

# Ensure all services are stopped first
echo "🛑 Stopping any existing services..."
docker-compose down

# Build the containers if needed
echo "🏗️ Building containers..."
docker-compose build

# Start the services
echo "🚀 Starting services..."
docker-compose up -d

# Show logs and wait for services to be ready
echo "📋 Checking service status..."
docker-compose ps

echo "✅ All services started!"
echo ""
echo "🌐 Frontend available at: http://localhost:5173"
echo "🌐 Backend API available at: http://localhost"
echo "🔌 Database available at: localhost:3306"
echo ""
echo "📋 View logs with: docker-compose logs -f"
echo "🛑 Stop services with: docker-compose down"
echo ""
echo "Have a great day! 😊" 