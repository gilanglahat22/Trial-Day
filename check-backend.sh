#!/bin/bash

echo "Checking backend status..."

# Check if backend container is running
if ! docker ps | grep -q "backend"; then
    echo "Error: Backend container is not running!"
    echo "Starting backend container..."
    docker-compose up -d backend
    sleep 10
fi

# Check backend logs for errors
echo
echo "Backend logs (last 20 lines):"
echo "-------------------------------"
docker-compose logs --tail=20 backend

# Check database connection
echo
echo "Testing database connection from backend..."
echo "-----------------------------------------"
docker-compose exec backend php artisan db:monitor

# Check if migrations were run successfully
echo
echo "Checking migrations status..."
echo "-------------------------------"
docker-compose exec backend php artisan migrate:status

echo
echo "If you see any errors above, try restarting all services with:"
echo "docker-compose down"
echo "docker-compose up -d" 