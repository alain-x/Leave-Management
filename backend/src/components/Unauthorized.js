import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogin = () => {
    navigate('/');
  };

  return (
    <div className="unauthorized">
      <h2>Access Denied</h2>
      <p>You do not have permission to access this page.</p>
      <p>Your role is: {user?.role || 'Not logged in'}</p>
      <button onClick={handleLogin} className="unauthorized-button">
        Go to Login
      </button>
    </div>
  );
};

export default Unauthorized;
