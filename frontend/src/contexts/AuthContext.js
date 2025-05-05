import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      AuthService.verifyToken(token)
        .then(response => {
          const userData = response.data;
          console.log('User data:', userData); // Debug log
          setUser(userData);
          setIs2FAEnabled(userData.twoFactorEnabled);
        })
        .catch(error => {
          console.error('Token verification error:', error); // Debug log
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      console.log('No token found'); // Debug log
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await AuthService.login(credentials.email, credentials.password);
      if (response.twoFactorEnabled) {
        return response;
      }
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIs2FAEnabled(response.twoFactorEnabled);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await AuthService.register(userData);
      localStorage.setItem('token', response.data.token);
      setUser(response.data);
      setIs2FAEnabled(response.data.twoFactorEnabled);
      const user = response.data;
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      return true;
    } catch (error) {
      throw error;
    }
  };

  const verify2FA = async (email, code) => {
    try {
      const response = await AuthService.verify2FALogin(email, code);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIs2FAEnabled(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const generate2FASecret = async (email) => {
    try {
      const response = await AuthService.generate2FASecret(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const enable2FA = async () => {
    try {
      await AuthService.enable2FA();
      setIs2FAEnabled(true);
    } catch (error) {
      throw error;
    }
  };

  const disable2FA = async () => {
    try {
      await AuthService.disable2FA();
      setIs2FAEnabled(false);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIs2FAEnabled(false);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    is2FAEnabled,
    login,
    register,
    verify2FA,
    generate2FASecret,
    enable2FA,
    disable2FA,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
