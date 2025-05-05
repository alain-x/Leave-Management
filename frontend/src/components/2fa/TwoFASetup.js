import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';

const TwoFASetup = () => {
  const [email, setEmail] = useState('');
  const [secret, setSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const { generate2FASecret, enable2FA } = useAuth();
  const navigate = useNavigate();

  const steps = ['Enter Email', 'Scan QR Code', 'Enable 2FA'];

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      const response = await generate2FASecret(email);
      setSecret(response.secret);
      setQrCodeUrl(response.qrCodeUrl);
      setActiveStep(1);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate 2FA secret');
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    setLoading(true);
    try {
      await enable2FA();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enable 2FA');
    } finally {
      setLoading(false);
    }
  };

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
          maxWidth: 500,
          width: '100%',
          backgroundColor: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom>
          Setup Two-Factor Authentication
        </Typography>

        <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {activeStep === 0 && (
          <form onSubmit={handleEmailSubmit} style={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Continue'}
            </Button>
          </form>
        )}

        {activeStep === 1 && (
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Scan QR Code
            </Typography>
            <Box sx={{ my: 3 }}>
              <QRCodeSVG value={qrCodeUrl} size={200} />
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Your secret key: {secret}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              1. Open your authenticator app (e.g., Google Authenticator)
              <br />
              2. Scan the QR code or enter the secret key manually
              <br />
              3. Click the button below to enable 2FA
            </Typography>
            <Button
              fullWidth
              variant="contained"
              onClick={handleEnable2FA}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Enable 2FA'}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default TwoFASetup;
