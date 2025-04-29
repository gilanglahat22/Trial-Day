# Restaurant List Application

This is a Laravel and React application for managing restaurant listings, developed as part of the Goers technical test.

## Demo

Screenshots of the application can be found in the `/screenshots` directory.

## Features

1. **View Restaurant List**: Users can view a list of all restaurants
2. **Filter Restaurants**: Users can filter restaurants by name, day, or specific time
3. **Admin Functions**: Admin users can add, edit, and delete restaurants
4. **Authentication**: Users can register and login with role-based access control

## Technology Stack

- **Backend**: Laravel 10
- **Frontend**: React 18 with React Router
- **Database**: MySQL/SQLite
- **Authentication**: Laravel Sanctum
- **Styling**: Bootstrap 5

## Database Design

The application uses the following database tables:

1. `users` - Stores user information with roles (admin/user)
2. `restaurants` - Stores restaurant information including name and opening hours

## API Documentation

### Authentication Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - Login existing user
- `POST /api/logout` - Logout authenticated user (requires auth)
- `GET /api/user` - Get authenticated user info (requires auth)

### Restaurant Endpoints

- `GET /api/restaurants` - Get all restaurants (public)
  - Query parameters:
    - `name`: Filter by restaurant name
    - `day`: Filter by day of week (Mon, Tue, etc.)
    - `time`: Filter by time
- `GET /api/restaurants/{restaurant}` - Get a specific restaurant (public)
- `POST /api/restaurants` - Create a new restaurant (admin only)
- `PUT /api/restaurants/{restaurant}` - Update a restaurant (admin only)
- `DELETE /api/restaurants/{restaurant}` - Delete a restaurant (admin only)

## Setup Instructions

### Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js and npm
- MySQL or SQLite

### Installation Steps

1. Clone the repository
```
git clone https://github.com/your-username/restaurant-list-app.git
cd restaurant-list-app
```

2. Install PHP dependencies
```
composer install
```

3. Install JavaScript dependencies
```
npm install
```

4. Copy .env.example to .env and update database configuration
```
cp .env.example .env
```

5. Generate application key
```
php artisan key:generate
```

6. Create database and run migrations with seeders
```
php artisan migrate --seed
```

7. Build frontend assets
```
npm run build
```

8. Start the development server
```
php artisan serve
```

9. Visit http://localhost:8000 in your browser

## Default User Accounts

After running migrations and seeders, you can log in with:

### Admin User
- Email: admin@example.com
- Password: password

### Regular User
- Email: user@example.com
- Password: password

## Testing

Run the tests with:

```
php artisan test
```

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT). 