import axios from 'axios';

const API_URL = 'http://localhost:8081/api/auth';

const AuthService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    });
    return response;
  },

  loginWithGoogle: async (token) => {
    const response = await axios.post(`${API_URL}/google`, {
      token
    });
    return response;
  },

  register: async (userData) => {
    const { confirmPassword, ...registerData } = userData;
    // Add default values for required fields
    const registrationData = {
      ...registerData,
      active: true,
      department: null,
      manager: null,
      profilePicture: null,
      twoFactorEnabled: false,
      twoFactorSecret: null,
      enabled: true
    };
    const response = await axios.post(`${API_URL}/register`, registrationData);
    return response;
  },

  verifyToken: async (token) => {
    const response = await axios.get(`${API_URL}/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  },

  enable2FA: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/2fa/enable`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  },

  disable2FA: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/2fa/disable`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  },

  verify2FA: async (code) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/2fa/verify`, { code }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  },

  generate2FASecret: async (email) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/2fa/generate`, { email }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  }
};

export default AuthService;
