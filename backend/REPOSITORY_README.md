# Restaurant List Application

A Laravel backend application for managing restaurant listings.

## Features

1. View a list of all restaurants
2. Filter restaurants by name, day, or time
3. Admin can add new restaurants
4. Admin can manage restaurant listings

## Setup Instructions

### Prerequisites

- PHP 8.1 or higher
- Composer
- SQLite

### Installation Steps

1. Navigate to the backend directory
```
cd backend
```

2. Install PHP dependencies
```
composer install
```

3. Create a .env file from example and generate key
```
cp .env.example .env
php artisan key:generate
```

4. Update .env file with SQLite configuration
```
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

5. Create SQLite database file
```
touch database/database.sqlite
```

6. Run migrations and seed the database
```
php artisan migrate --seed
```

7. Start the Laravel development server
```
php artisan serve
```

8. The API will be available at http://localhost:8000/api

## API Documentation

### Authentication Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - Login existing user
- `POST /api/logout` - Logout authenticated user (requires auth)
- `GET /api/user` - Get authenticated user info (requires auth)

### Restaurant Endpoints

- `GET /api/restaurants` - Get all restaurants (public)
  - Optional filter parameters:
    - `name`: Filter by restaurant name (case-insensitive)
    - `day`: Filter by day (e.g., 'Monday', 'Tuesday', etc. or 'Mon', 'Tue', etc.)
    - `time`: Filter by time (format: 24-hour, e.g., '14:30' for 2:30 PM)

- `GET /api/restaurants/{restaurant}` - Get a specific restaurant (public)
- `POST /api/restaurants` - Create a new restaurant (admin only)
- `PUT /api/restaurants/{restaurant}` - Update a restaurant (admin only)
- `DELETE /api/restaurants/{restaurant}` - Delete a restaurant (admin only)

## Default User Accounts

After running migrations and seeders, you can log in with:

### Admin User
- Email: admin@example.com
- Password: password

### Regular User
- Email: user@example.com
- Password: password

## Data Structure

The application uses the following tables:

1. `users` - Stores user information with roles (admin/user)
2. `restaurants` - Stores restaurant information:
   - `id`: Auto-incremented primary key
   - `name`: Restaurant name (string)
   - `opening_hours`: Opening hours text (text)
   - `created_at`: Timestamp of creation
   - `updated_at`: Timestamp of last update 