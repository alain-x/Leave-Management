# Leave Management System Backend

A Spring Boot backend service for managing employee leave requests.

## Features

- User Authentication (Login/Register)
- Role-based Access Control (User, Manager, Admin)
- Leave Management System
- Two-Factor Authentication
- Responsive Design
- Modern UI with Material-UI

## Tech Stack

- React 18
- Material-UI (MUI)
- React Router
- Axios for API calls
- React Context for state management
- Google OAuth2 Authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

The application will be available at `http://localhost:3000`


## Available Scripts

- `npm start` - Starts the development server
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm eject` - Ejects the app from Create React App

## API Endpoints

The frontend communicates with the backend API at `http://localhost:8081`. The main API endpoints used are:



- Leave Management:
  - POST `/api/leave/requests` - Create leave request
  - GET `/api/leave/requests` - Get leave requests
  - PUT `/api/leave/requests/:id` - Update leave request status
  - GET `/api/leave/balance` - Get leave balance

- Two-Factor Authentication:
  - POST `/api/auth/2fa/setup` - Setup 2FA
  - POST `/api/auth/2fa/verify` - Verify 2FA code

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_API_URL=http://localhost:8081
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```
 