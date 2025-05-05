import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FA = () => {
    navigate("/2fa/verify");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#36393f",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          padding: 4,
          width: "100%",
          maxWidth: 440,
          borderRadius: 2,
          backgroundColor: "#2f3136",
          color: "#dcddde",
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            color: "#ffffff",
            fontWeight: 600,
            marginBottom: 3,
          }}
        >
          Welcome back!
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{
            color: "#b9bbbe",
            marginBottom: 4,
          }}
        >
          We're so excited to see you again!
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              backgroundColor: "#ed4245",
              color: "#ffffff",
              "& .MuiAlert-icon": {
                color: "#ffffff",
              },
            }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Typography
            variant="subtitle2"
            sx={{
              color: "#b9bbbe",
              marginBottom: 1,
              fontWeight: 600,
            }}
          >
            EMAIL
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#202225",
                color: "#dcddde",
                "& fieldset": {
                  borderColor: "#040405",
                },
                "&:hover fieldset": {
                  borderColor: "#040405",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#5865f2",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#b9bbbe",
              },
            }}
          />

          <Typography
            variant="subtitle2"
            sx={{
              color: "#b9bbbe",
              marginTop: 2,
              marginBottom: 1,
              fontWeight: 600,
            }}
          >
            PASSWORD
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: "#b9bbbe" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#202225",
                color: "#dcddde",
                "& fieldset": {
                  borderColor: "#040405",
                },
                "&:hover fieldset": {
                  borderColor: "#040405",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#5865f2",
                },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              backgroundColor: "#5865f2",
              color: "#ffffff",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#4752c4",
              },
              "&:disabled": {
                backgroundColor: "#5865f2",
                opacity: 0.7,
              },
            }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          <Typography
            variant="body2"
            sx={{
              color: "#b9bbbe",
              textAlign: "center",
              mt: 2,
            }}
          >
            Need an account?{" "}
            <Button
              variant="text"
              onClick={() => navigate("/register")}
              sx={{
                color: "#00aff4",
                textTransform: "none",
                p: 0,
                "&:hover": {
                  textDecoration: "underline",
                  backgroundColor: "transparent",
                },
              }}
            >
              Register
            </Button>
          </Typography>

          <Button
            fullWidth
            variant="text"
            onClick={handle2FA}
            sx={{
              mt: 2,
              color: "#b9bbbe",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            2FA Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
