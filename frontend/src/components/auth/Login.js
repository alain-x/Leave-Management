import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Typography, TextField, Button, Box, Alert, Link, Paper } from "@mui/material";
import { GoogleLogin } from "react-google-login";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      console.log('Attempting login with:', { email });
      const response = await login({ email, password });
      console.log('Login successful, response:', response);
      
      // Check if 2FA is enabled for the user
      if (response.twoFactorEnabled) {
        console.log('2FA is enabled, redirecting to verification');
        navigate('/2fa/verify', { 
          state: { 
            email,
            message: 'Please enter your 2FA code' 
          } 
        });
      } else {
        console.log('2FA not enabled, redirecting to dashboard');
        navigate("/dashboard");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || "Login failed. Please check your credentials and try again.");
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

  useEffect(() => {
    if (location.state && location.state.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#36393f',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 500,
          backgroundColor: '#2f3136',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            mb: 2,
          }}
        >
          Login
        </Typography>
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
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
            sx={{
              mt: 2,
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
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              Don't have an account?{" "}
              <Link href="/register" color="primary">
                Register
              </Link>
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
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
