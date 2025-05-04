import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Link,
  Paper,
  Alert,
} from "@mui/material";
import { GoogleLogin } from "react-google-login";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./AuthStyles.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password });
      navigate("/dashboard"); // redirect after login
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      await login(response.tokenId);
      navigate("/dashboard");
    } catch (err) {
      setError("Google login failed");
    }
  };

  const handle2FA = () => {
    navigate("/2fa/verify");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #1e88e5, #90caf9)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          width: "100%",
          maxWidth: 450,
          borderRadius: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          align="center"
          gutterBottom
          className="auth-form h2"
        >
          Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} className="error-message">
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="form-group">
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            margin="normal"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="auth-button"
            sx={{
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 3,
              },
              "&:disabled": {
                opacity: 0.7,
                transform: "none",
                boxShadow: 1,
              },
            }}
          >
            Login
          </Button>
          <Box className="auth-links" sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              Don't have an account?{" "}
              <Link href="/register" color="primary">
                Register
              </Link>
            </Typography>
          </Box>
          <Box className="auth-links" sx={{ mt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handle2FA}
              sx={{ mb: 2 }}
            >
              2FA Login
            </Button>
            <GoogleLogin
              clientId="311505275626-8d5j5bhvjtb0vj8o27p4gg59qpffbad5.apps.googleusercontent.com"
              buttonText="Login with Google"
              onSuccess={handleGoogleLogin}
              onFailure={() => setError("Google login failed")}
              cookiePolicy={"single_host_origin"}
              render={(renderProps) => (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  sx={{ mt: 2 }}
                  startIcon={
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                      alt="Google"
                      style={{ width: 20, height: 20 }}
                    />
                  }
                >
                  Login with Google
                </Button>
              )}
            />
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
