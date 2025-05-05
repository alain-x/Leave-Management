import axios from 'axios';

const API_URL = 'http://localhost:8081/api/auth';

const AuthService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      }, {
        timeout: 10000 // 10 seconds timeout
      });
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      console.log('Login response:', response.data);
      
      // Ensure the response has the expected structure
      const responseData = response.data;
      if (responseData.data) {
        // If the token is nested in a data property
        return responseData.data;
      }
      
      // If the token is in the root of the response
      return responseData;
      
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        throw new Error(error.response.data.message || 'Login failed');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', error.message);
        throw new Error('Error setting up login request');
      }
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
