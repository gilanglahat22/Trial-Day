# Restaurant List Application

This is a full-stack application with Laravel backend and React frontend, containerized using Docker.

## Prerequisites

- Docker
- Docker Compose
- Git

## Project Structure

```
.
├── backend/             # Laravel backend application
├── frontend/           # React frontend application
├── docker/             # Docker configuration files
│   └── nginx/         # Nginx configuration
│   └── mysql/         # MySQL initialization
├── docker-compose.yml  # Docker Compose configuration
├── start.sh           # Startup script for Linux/Mac
├── start.bat          # Startup script for Windows
├── check-backend.sh   # Backend check script for Linux/Mac
├── check-backend.bat  # Backend check script for Windows
└── README.md          # This file
```

## Login Credentials

The application comes with pre-configured user accounts:

### Admin User
- Email: admin@example.com
- Password: password

### Regular User
- Email: user@example.com
- Password: password

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Quick Start (Recommended)

The easiest way to start all services is to use the provided startup script:

#### On Linux/Mac:
```bash
# Make the script executable
chmod +x start.sh check-backend.sh

# Run the startup script
./start.sh
```

#### On Windows:
```bash
# Run the batch file
start.bat
```

This will build and start all services (backend, frontend, and database) with a single command.

### 3. Manual Startup

If you prefer to run commands manually:

```bash
# Build the containers
docker-compose build

# Start all services
docker-compose up -d
```

### 4. Verify Backend Status

To check if the backend is running properly and connected to the database:

#### On Linux/Mac:
```bash
# Make the script executable
chmod +x check-backend.sh

# Run the check script
./check-backend.sh
```

#### On Windows:
```bash
# Run the check script
check-backend.bat
```

### 5. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost
- MySQL Database: localhost:3306
  - Database: laravel
  - Username: laravel
  - Password: secret
  - Root Password: root

## Development Commands

### View Logs

```bash
# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx
docker-compose logs -f db
```

### Backend (Laravel) Commands

```bash
# Run migrations
docker-compose exec backend php artisan migrate

# Run seeders
docker-compose exec backend php artisan db:seed

# Create a new migration
docker-compose exec backend php artisan make:migration migration_name

# Run tests
docker-compose exec backend php artisan test
```

### Frontend (React) Commands

```bash
# Install new dependencies
docker-compose exec frontend npm install package-name

# Build for production
docker-compose exec frontend npm run build
```

## Troubleshooting

### Common Issues

1. **Backend not connecting to the database**
```bash
# Check backend status
./check-backend.sh  # Linux/Mac
check-backend.bat   # Windows

# Restart services
docker-compose down
docker-compose up -d
```

2. **Permission Issues**
```bash
# Fix storage permissions
docker-compose exec backend chown -R www-data:www-data storage bootstrap/cache
```

3. **Container Issues**
```bash
# Rebuild a specific service
docker-compose up -d --build backend

# Remove all containers and volumes (WARNING: This will delete all data)
docker-compose down -v
```

4. **Database Issues**
```bash
# Reset database
docker-compose exec backend php artisan migrate:fresh

# Clear cache
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear
```

## Production Deployment

For production deployment, make sure to:

1. Update environment variables with production values
2. Set proper security measures in Nginx configuration
3. Use production build for frontend
4. Configure proper database backups
5. Set up SSL certificates

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License.

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