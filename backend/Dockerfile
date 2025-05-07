FROM php:8.1-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy composer files first
COPY composer.json composer.lock* ./

# Install dependencies
RUN composer install --no-scripts --no-autoloader

# Copy the rest of the application
COPY . .

# Create startup script
RUN echo '#!/bin/bash\n\
if [ ! -f .env ]; then\n\
    cp .env.example .env\n\
fi\n\
\n\
# Create testing environment file with a specific app key\n\
echo "APP_NAME=Laravel\n\
APP_ENV=testing\n\
APP_KEY=base64:2fl+Ktvkfl+Fuz4Qp/A75G2RTiWVA/ZoKZvp6fiiM10=\n\
APP_DEBUG=true\n\
APP_URL=http://localhost\n\
\n\
LOG_CHANNEL=stack\n\
LOG_DEPRECATIONS_CHANNEL=null\n\
LOG_LEVEL=debug\n\
\n\
DB_CONNECTION=mysql\n\
DB_HOST=db\n\
DB_PORT=3306\n\
DB_DATABASE=laravel\n\
DB_USERNAME=laravel\n\
DB_PASSWORD=secret\n\
\n\
BROADCAST_DRIVER=log\n\
CACHE_DRIVER=array\n\
FILESYSTEM_DISK=local\n\
QUEUE_CONNECTION=sync\n\
SESSION_DRIVER=array\n\
SESSION_LIFETIME=120" > .env.testing\n\
\n\
# Generate application key if not set\n\
if [ -z "$(grep "^APP_KEY=" .env)" ] || [ "$(grep "^APP_KEY=" .env | cut -d "=" -f2)" == "" ]; then\n\
    php artisan key:generate\n\
fi\n\
\n\
# Wait for database to be ready\n\
echo "Waiting for database connection..."\n\
while ! php artisan db:monitor > /dev/null 2>&1; do\n\
    sleep 1\n\
done\n\
\n\
# Run migrations\n\
php artisan migrate --force\n\
\n\
# Set proper permissions\n\
chown -R www-data:www-data /var/www\n\
chmod -R 755 /var/www/storage\n\
chmod -R 755 /var/www/bootstrap/cache\n\
\n\
# Generate autoload files\n\
composer dump-autoload --optimize\n\
\n\
# Start PHP-FPM\n\
php-fpm\n\
' > /usr/local/bin/start.sh && chmod +x /usr/local/bin/start.sh

# Create a simple database connection monitor script
RUN echo '<?php\n\
try {\n\
    $dbh = new PDO("mysql:host=$DB_HOST;dbname=$DB_DATABASE", "$DB_USERNAME", "$DB_PASSWORD");\n\
    echo "Connected to database successfully!";\n\
    exit(0);\n\
} catch (PDOException $e) {\n\
    echo "Connection failed: " . $e->getMessage();\n\
    exit(1);\n\
}\n\
?>' > /var/www/database-check.php

# Add artisan db:monitor command
RUN echo '<?php\n\
namespace App\\Console\\Commands;\n\
\n\
use Illuminate\\Console\\Command;\n\
use PDO;\n\
use PDOException;\n\
\n\
class DatabaseMonitor extends Command\n\
{\n\
    protected $signature = "db:monitor";\n\
    protected $description = "Check database connection";\n\
\n\
    public function handle()\n\
    {\n\
        $host = env("DB_HOST");\n\
        $port = env("DB_PORT");\n\
        $database = env("DB_DATABASE");\n\
        $username = env("DB_USERNAME");\n\
        $password = env("DB_PASSWORD");\n\
\n\
        try {\n\
            $dsn = "mysql:host=$host;port=$port";\n\
            $connection = new PDO($dsn, $username, $password);\n\
            $this->info("Database connection successful!");\n\
            return 0;\n\
        } catch (PDOException $e) {\n\
            $this->error("Database connection failed: " . $e->getMessage());\n\
            return 1;\n\
        }\n\
    }\n\
}\n\
' > /var/www/app/Console/Commands/DatabaseMonitor.php

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

# Expose port 9000
EXPOSE 9000

CMD ["/usr/local/bin/start.sh"] 