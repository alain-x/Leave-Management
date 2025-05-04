import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './2FA.css';

const TwoFAVerification = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { verify2FA } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await verify2FA(code);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>2FA Verification</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Enter 6-digit code from your authenticator app</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              pattern="\d{6}"
              maxLength="6"
            />
          </div>
          <button type="submit" className="auth-button">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default TwoFAVerification;
