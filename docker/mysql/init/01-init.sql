-- Initialize database
CREATE DATABASE IF NOT EXISTS laravel;
USE laravel;

-- Grant privileges
GRANT ALL PRIVILEGES ON laravel.* TO 'laravel'@'%';
FLUSH PRIVILEGES; 