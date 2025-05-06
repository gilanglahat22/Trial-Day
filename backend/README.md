<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# Restaurant List Application

A Laravel and React application for managing restaurant listings.

## Features

1. View a list of all restaurants
2. Filter restaurants by name, day, or time
3. Admin can add new restaurants
4. Admin can manage restaurant listings

## Database Design

The application uses the following database tables:

1. `users` - Stores user information with roles (admin/user)
2. `restaurants` - Stores restaurant information including name and opening hours

## Tech Stack

- **Backend**: Laravel 10
- **Frontend**: React 18 with React Router
- **Database**: MySQL/SQLite
- **Authentication**: Laravel Sanctum
- **Styling**: Bootstrap 5

## Installation

### Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js and npm
- MySQL or SQLite

### Setup Steps

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

## API Documentation

### Authentication Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - Login existing user
- `POST /api/logout` - Logout authenticated user (requires auth)
- `GET /api/user` - Get authenticated user info (requires auth)

### Restaurant Endpoints

- `GET /api/restaurants` - Get all restaurants (public)
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

## Testing the Application

To test the application features:

1. Login with admin or user accounts.
2. As a regular user, you can view and filter restaurants.
3. As an admin, you can also add, edit, and delete restaurants.

## Screenshots

Screenshots of the application can be found in the `/screenshots` directory.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
