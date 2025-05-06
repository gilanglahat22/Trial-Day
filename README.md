# Restaurant List Application

A full-stack web application for managing restaurant listings, built with Laravel (backend) and React (frontend).

## Features

1. View a list of all restaurants
2. Filter restaurants by name, day, or specific time
3. Admin users can add new restaurants
4. Admin users can manage restaurant listings (edit/delete)
5. User authentication with role-based access control

## System Architecture

The application follows a client-server architecture with the following components:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│                 │       │                 │       │                 │
│  React Frontend │◄─────►│  Laravel API    │◄─────►│   Database      │
│  (Client-side)  │       │  (Server-side)  │       │  (SQLite/MySQL) │
│                 │       │                 │       │                 │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

### Frontend (React)
- **Framework**: React 18 with hooks and functional components
- **Routing**: React Router v6
- **State Management**: Context API (AuthContext)
- **HTTP Client**: Axios for API communication
- **UI Components**: React Bootstrap
- **Build Tool**: Vite

### Backend (Laravel)
- **Framework**: Laravel 10
- **Authentication**: Laravel Sanctum (token-based auth)
- **Database**: SQLite/MySQL
- **API**: RESTful API endpoints
- **Middleware**: Admin access control

### Database Schema

```
┌───────────────────────┐       ┌───────────────────────┐
│         users         │       │      restaurants      │
├───────────────────────┤       ├───────────────────────┤
│ id: bigint (PK)       │       │ id: bigint (PK)       │
│ name: varchar         │       │ name: varchar         │
│ email: varchar        │       │ opening_hours: text   │
│ password: varchar     │       │ created_at: timestamp │
│ role: varchar         │       │ updated_at: timestamp │
│ created_at: timestamp │       └───────────────────────┘
│ updated_at: timestamp │
└───────────────────────┘
```

## Application Flow Diagram

```
┌──────────────┐     ┌────────────────┐     ┌────────────────┐
│              │     │                │     │                │
│  User Login  │────►│ Authentication │────►│  JWT Token     │
│              │     │                │     │                │
└──────────────┘     └────────────────┘     └────────────────┘
                                                    │
                                                    ▼
┌──────────────┐     ┌────────────────┐     ┌────────────────┐
│              │     │                │     │                │
│  API Access  │◄────│ Authorization  │◄────│  Role Check    │
│              │     │                │     │                │
└──────────────┘     └────────────────┘     └────────────────┘
       │
       │
       ▼
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                   Authorized Operations                     │
│                                                            │
├────────────────┬────────────────┬────────────────┬─────────┤
│                │                │                │         │
│ List           │ Filter         │ Add (Admin)    │ Edit/   │
│ Restaurants    │ Restaurants    │ Restaurant     │ Delete  │
│                │                │                │ (Admin) │
└────────────────┴────────────────┴────────────────┴─────────┘
```

## Setup Instructions

### Prerequisites
- PHP 8.1+
- Composer
- Node.js 14+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```
cd backend
```

2. Install PHP dependencies:
```
composer install
```

3. Create a .env file from the example:
```
cp .env.example .env
php artisan key:generate
```

4. Configure the database in the .env file.

5. Run migrations and seed the database:
```
php artisan migrate --seed
```

6. Start the backend server:
```
php artisan serve
```

### Frontend Setup

1. Navigate to the frontend directory:
```
cd frontend
```

2. Install dependencies:
```
npm install
```

3. Create a .env file with API URL:
```
VITE_APP_NAME="Restaurant List App"
VITE_API_URL="http://localhost:8000"
```

4. Start the development server:
```
npm run dev
```

5. Open your browser and navigate to http://localhost:5173

## Default User Accounts

After running migrations and seeders, you can log in with:

### Admin User
- Email: admin@example.com
- Password: password

### Regular User
- Email: user@example.com
- Password: password

## API Endpoints

### Authentication
- POST /api/register - Register a new user
- POST /api/login - Log in a user
- POST /api/logout - Log out a user (requires auth)

### Restaurants
- GET /api/restaurants - List all restaurants
- GET /api/restaurants?name=query - Filter by name
- GET /api/restaurants?day=Monday - Filter by day
- GET /api/restaurants?time=14:30 - Filter by time (24h format)
- GET /api/restaurants/{id} - Get a specific restaurant
- POST /api/restaurants - Create a restaurant (admin only)
- PUT /api/restaurants/{id} - Update a restaurant (admin only)
- DELETE /api/restaurants/{id} - Delete a restaurant (admin only)

## Technologies Used

- Laravel 10
- React 18
- Bootstrap 5
- Axios
- React Router
- Laravel Sanctum
- SQLite/MySQL