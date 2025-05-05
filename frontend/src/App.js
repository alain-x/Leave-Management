import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import TwoFAVerification from "./components/2fa/TwoFAVerification";
import TwoFASetup from "./components/2fa/TwoFASetup";
import LeaveRequestForm from "./components/leave/LeaveRequestForm";
import LeaveHistory from "./components/leave/LeaveHistory";
import TeamCalendar from "./components/leave/TeamCalendar";
import AdminPanel from "./components/AdminPanel";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

// Dashboard Component
function Dashboard({ user }) {
  return (
    <div className="dashboard">
      <h1>{user.role} Dashboard</h1>
      <div>
        <p>
          Welcome, {user.firstName} {user.lastName}
        </p>
        <p>Your Role: {user.role}</p>
        <nav>
          {(user.role === "USER" ||
            user.role === "MANAGER" ||
            user.role === "ADMIN") && (
            <>
              <Link to="/leave-request" className="dashboard-link">
                Request Leave
              </Link>
              <Link to="/leave-history" className="dashboard-link">
                View Leave History
              </Link>
            </>
          )}
          {(user.role === "MANAGER" || user.role === "ADMIN") && (
            <Link to="/team-calendar" className="dashboard-link">
              Team Calendar
            </Link>
          )}
          {user.role === "ADMIN" && (
            <Link to="/admin" className="dashboard-link">
              Admin Panel
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}

// Unauthorized Component
function Unauthorized() {
  const navigate = require("react-router-dom").useNavigate();
  const { user } = require("./contexts/AuthContext").useAuth();

  return (
    <div>
      <h2>Access Denied</h2>
      <p>You do not have permission to access this page.</p>
      <p>Your role is: {user?.role || "Not logged in"}</p>
      <button onClick={() => navigate("/")}>Go to Login</button>
    </div>
  );
}

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#FF6B6B",
      },
      secondary: {
        main: "#4ECDC4",
      },
      error: {
        main: "#FF6B6B",
      },
      background: {
        default: "#F8F9FA",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/2fa/verify" element={<TwoFAVerification />} />
              <Route path="/2fa/setup" element={<TwoFASetup />} />

              <Route
                path="/leave-request"
                element={
                  <PrivateRoute allowedRoles={["USER", "MANAGER", "ADMIN"]}>
                    <LeaveRequestForm />
                  </PrivateRoute>
                }
              />

              <Route
                path="/leave-history"
                element={
                  <PrivateRoute allowedRoles={["USER", "MANAGER", "ADMIN"]}>
                    <LeaveHistory />
                  </PrivateRoute>
                }
              />

              <Route
                path="/team-calendar"
                element={
                  <PrivateRoute allowedRoles={["MANAGER", "ADMIN"]}>
                    <TeamCalendar />
                  </PrivateRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <PrivateRoute allowedRoles={["ADMIN"]}>
                    <AdminPanel />
                  </PrivateRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    {({ user }) => <Dashboard user={user} />}
                  </PrivateRoute>
                }
              />

              <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
          </AuthProvider>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;
