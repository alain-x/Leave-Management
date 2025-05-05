import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, Container, AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { Logout as LogoutIcon, Menu as MenuIcon } from "@mui/icons-material";
import CssBaseline from "@mui/material/CssBaseline";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import TwoFAVerification from "./components/2fa/TwoFAVerification";
import TwoFASetup from "./components/2fa/TwoFASetup";
import LeaveRequestForm from "./components/leave/LeaveRequestForm";
import LeaveHistory from "./components/leave/LeaveHistory";
import TeamCalendar from "./components/leave/TeamCalendar";
import AdminPanel from "./components/AdminPanel";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Unauthorized from "./components/Unauthorized";

// Navigation Component
function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Leave Management System
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {(user.role === "USER" || user.role === "MANAGER" || user.role === "ADMIN") && (
            <>
              <Button color="inherit" onClick={() => navigate("/leave-request")}>
                Request Leave
              </Button>
              <Button color="inherit" onClick={() => navigate("/leave-history")}>
                Leave History
              </Button>
            </>
          )}
          {(user.role === "MANAGER" || user.role === "ADMIN") && (
            <Button color="inherit" onClick={() => navigate("/team-calendar")}>
              Team Calendar
            </Button>
          )}
          {user.role === "ADMIN" && (
            <Button color="inherit" onClick={() => navigate("/admin")}>
              Admin Panel
            </Button>
          )}
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

// Dashboard Component
function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.firstName} {user.lastName}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Role: {user.role}
      </Typography>
      <Box sx={{ mt: 4, display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
        {(user.role === "USER" || user.role === "MANAGER" || user.role === "ADMIN") && (
          <>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/leave-request")}
              sx={{ p: 3 }}
            >
              Request Leave
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/leave-history")}
              sx={{ p: 3 }}
            >
              View Leave History
            </Button>
          </>
        )}
        {(user.role === "MANAGER" || user.role === "ADMIN") && (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/team-calendar")}
            sx={{ p: 3 }}
          >
            Team Calendar
          </Button>
        )}
        {user.role === "ADMIN" && (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/admin")}
            sx={{ p: 3 }}
          >
            Admin Panel
          </Button>
        )}
      </Box>
    </Container>
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
            <Navigation />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/2fa/verify" element={<TwoFAVerification />} />
              <Route path="/2fa/setup" element={<TwoFASetup />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

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

              {/* Catch all route - redirect to dashboard if authenticated, otherwise to login */}
              <Route
                path="*"
                element={
                  <PrivateRoute>
                    <Navigate to="/dashboard" replace />
                  </PrivateRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;
