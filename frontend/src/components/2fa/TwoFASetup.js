import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, Paper } from '@mui/material';

const TwoFASetup = () => {
  const [secret, setSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState('');
  const { generate2FASecret, enable2FA } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    generateSecret();
  }, []);

  const generateSecret = async () => {
    try {
      const response = await generate2FASecret();
      setSecret(response.data.secret);
      setQrCodeUrl(response.data.qrCodeUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate 2FA secret');
    }
  };

  const enable = async () => {
    try {
      await enable2FA();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enable 2FA');
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
        <h2>Setup 2FA</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="qr-container">
          <img src={qrCodeUrl} alt="QR Code" />
        </div>
        <div className="secret-container">
          <p>Your secret key:</p>
          <div className="secret-key">{secret}</div>
          <p>1. Open your authenticator app (e.g., Google Authenticator)</p>
          <p>2. Scan the QR code or enter the secret key</p>
          <p>3. Click the button below to enable 2FA</p>
        </div>
        <button onClick={enable} className="auth-button">
          Enable 2FA
        </button>
      </Paper>
    </Box>
  );
};

export default TwoFASetup;
