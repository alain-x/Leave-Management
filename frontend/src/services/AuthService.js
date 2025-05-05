import axios from 'axios';

const API_URL = 'http://localhost:8081/api/auth';

const AuthService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verify2FALogin: async (email, code) => {
    try {
      const response = await axios.post(`${API_URL}/verify-2fa`, {
        email,
        code
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  generate2FASecret: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/2fa/generate`, { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  enable2FA: async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${API_URL}/2fa/enable`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  disable2FA: async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${API_URL}/2fa/disable`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyToken: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/verify-token`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
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
  }
};

export default AuthService;
