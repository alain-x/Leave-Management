# Leave Management System Frontend

## Features

- Employee leave request management
- Leave balance tracking
- Team calendar view
- Leave history tracking
- 2FA authentication
- Google login integration
- Responsive design with Material-UI
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

## Project Structure

## Available Scripts

- `npm start` - Starts the development server
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm eject` - Ejects the app from Create React App

## API Endpoints

The frontend communicates with the backend API at `http://localhost:8081`. The main API endpoints used are:

- Authentication:

  - POST `/api/auth/login` - User login
  - POST `/api/auth/register` - User registration
  - GET `/api/auth/verify` - Token verification

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
