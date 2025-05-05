import React from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogin = () => {
    navigate('/');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <WarningIcon
            color="warning"
            sx={{ fontSize: 60, mb: 2 }}
          />
          <Typography variant="h4" gutterBottom color="error">
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You do not have permission to access this page.
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Your current role: {user?.role || "Not logged in"}
          </Alert>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDashboard}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleLogin}
            >
              Back to Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Unauthorized;
