#!/bin/sh
set -e

if [ ! -f .env ]; then
    cp .env.example .env
fi

# Create testing environment file with a specific app key
cat > .env.testing << EOL
APP_NAME=Laravel
APP_ENV=testing
APP_KEY=base64:2fl+Ktvkfl+Fuz4Qp/A75G2RTiWVA/ZoKZvp6fiiM10=
APP_DEBUG=true
APP_URL=http://localhost

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=secret

BROADCAST_DRIVER=log
CACHE_DRIVER=array
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=array
SESSION_LIFETIME=120
EOL

# Update .env file for Docker environment
sed -i "s/DB_HOST=.*/DB_HOST=db/" .env
sed -i "s/DB_DATABASE=.*/DB_DATABASE=laravel/" .env
sed -i "s/DB_USERNAME=.*/DB_USERNAME=laravel/" .env
sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=secret/" .env

# Generate application key if not set
if [ -z "$(grep "^APP_KEY=" .env | cut -d "=" -f2)" ] || [ "$(grep "^APP_KEY=" .env | cut -d "=" -f2)" == "" ]; then
    php artisan key:generate
fi

# Wait for database to be ready
echo "Waiting for database connection..."
max_retries=30
counter=0

while ! nc -z db 3306; do
    counter=$((counter+1))
    if [ $counter -gt $max_retries ]; then
        echo "Error: Failed to connect to MySQL after $max_retries attempts!"
        exit 1
    fi
    echo "Waiting for MySQL to be available... ($counter/$max_retries)"
    sleep 2
done

echo "MySQL is available, waiting for it to be ready..."
sleep 5

# Try to run migrations
echo "Running database migrations..."
php artisan migrate --force || {
    echo "Warning: Migrations failed on first attempt, retrying..."
    sleep 5
    php artisan migrate --force || {
        echo "Error: Migrations failed on second attempt."
        # Continue anyway as this might just be because migrations are already applied
    }
}

# Set proper permissions
echo "Setting file permissions..."
chown -R www-data:www-data /var/www
chmod -R 755 /var/www/storage
chmod -R 755 /var/www/bootstrap/cache

# Generate autoload files
echo "Generating autoload files..."
composer dump-autoload --optimize

# Clear cache
php artisan config:clear
php artisan route:clear
php artisan cache:clear

echo "Laravel backend is ready!"

# Start PHP-FPM
exec php-fpm 