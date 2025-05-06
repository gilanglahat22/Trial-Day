# Restaurant List Frontend

A React application for the Restaurant List system.

## Features

1. View a list of all restaurants
2. Filter restaurants by name, day, or time
3. Admin can add new restaurants
4. Admin can manage restaurant listings

## Setup Instructions

### Prerequisites

- Node.js (>= 14.x)
- npm or yarn
- Backend API server running (Laravel)

### Installation Steps

1. Navigate to the frontend directory
```
cd frontend
```

2. Install dependencies
```
npm install
# or with yarn
yarn
```

3. Create a `.env` file in the root directory with the following content:
```
VITE_APP_NAME="Restaurant List App"
VITE_API_URL="http://localhost:8000"
```

4. Start the development server
```
npm run dev
# or with yarn
yarn dev
```

5. Open your browser and visit http://localhost:5173

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## User Accounts

After setting up the backend, you can log in with:

### Admin User
- Email: admin@example.com
- Password: password

### Regular User
- Email: user@example.com
- Password: password

## Application Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Page components for each route
- `/src/context` - React context providers
- `/src/hooks` - Custom React hooks
- `/src/services` - API services for data fetching
- `/src/utils` - Utility functions and configurations 