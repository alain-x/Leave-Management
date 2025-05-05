import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';

const TwoFAVerification = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { verify2FA } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await verify2FA(email, code);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
          padding: 2
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 400,
            width: '100%',
            backgroundColor: 'white',
            borderRadius: 2
          }}
        >
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            Email is required for 2FA verification
          </Alert>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: 2
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 400,
          width: '100%',
          backgroundColor: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom>
          2FA Verification
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Enter the 6-digit code sent to {email}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Verification Code"
            variant="outlined"
            margin="normal"
            value={code}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setCode(value);
            }}
            required
            disabled={loading}
            inputProps={{
              pattern: '\\d{6}',
              maxLength: 6,
              inputMode: 'numeric',
              style: { textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.5em' }
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || code.length !== 6}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Verify'}
          </Button>
        </form>

        <Button
          fullWidth
          variant="text"
          onClick={() => navigate('/login')}
          sx={{ mt: 2 }}
        >
          Back to Login
        </Button>
      </Paper>
    </Box>
  );
};

export default TwoFAVerification;
