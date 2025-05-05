import axios from 'axios';

const API_URL = 'http://localhost:8081/api/auth';

const AuthService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    });
    return response.data;
  },

  loginWithGoogle: async (googleResponse) => {
    try {
      const { credential } = googleResponse;
      const response = await axios.post(`${API_URL}/google`, {
        token: credential
      });
      return response.data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  },

  verifyToken: async (token) => {
    const response = await axios.get(`${API_URL}/verify-token`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  enable2FA: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/2fa/enable`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  disable2FA: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/2fa/disable`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  verify2FALogin: async (email, code) => {
    const response = await axios.post(`${API_URL}/verify-2fa`, {
      email,
      code
    });
    return response.data;
  },

  generate2FASecret: async (email) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/2fa/generate`, { email }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

export default AuthService;
