# Leave Management System Frontend

A modern frontend application for managing employee leave requests.

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

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/         # Authentication components (Login, Register)
│   │   ├── leave/        # Leave management components
│   │   ├── 2fa/          # Two-Factor Authentication components
│   │   └── Dashboard.js  # Main dashboard component
│   ├── contexts/
│   │   └── AuthContext.js # Authentication context
│   ├── styles/
│   └── App.js            # Main application component
├── package.json
└── README.md
```

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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
# Leave-Management-system
