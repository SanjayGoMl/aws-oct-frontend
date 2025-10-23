import axios from 'axios';

const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL || import.meta.env.VITE_API_BASE_URL;
const TOKEN_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY || 'crisis_journalist_auth_token';
const USER_KEY = import.meta.env.VITE_USER_STORAGE_KEY || 'crisis_journalist_user_data';

const authAPI = axios.create({
  baseURL: AUTH_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User's email address
   * @param {string} userData.password - User's password (min 6 chars)
   * @param {string} userData.full_name - User's full name
   * @returns {Promise<Object>} Response with token and user data
   */
  register: async (userData) => {
    try {
      const response = await authAPI.post('/api/auth/register', {
        email: userData.email,
        password: userData.password,
        full_name: userData.full_name,
      });
      
      if (response.data.token) {
        // Store token and user data
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      } else if (error.response?.status === 400) {
        throw new Error('Email already registered or invalid data');
      } else if (error.request) {
        throw new Error('Network error: Unable to reach server');
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    }
  },

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User's email address
   * @param {string} credentials.password - User's password
   * @returns {Promise<Object>} Response with token and user data
   */
  login: async (credentials) => {
    try {
      const response = await authAPI.post('/api/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });
      
      if (response.data.token) {
        // Store token and user data
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      } else if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.request) {
        throw new Error('Network error: Unable to reach server');
      } else {
        throw new Error('Login failed. Please try again.');
      }
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Get stored authentication token
   * @returns {string|null} JWT token or null
   */
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Get stored user data
   * @returns {Object|null} User object or null
   */
  getUser: () => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user has valid token
   */
  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem(USER_KEY);
    return !!(token && user);
  },

  /**
   * Get Authorization header for API requests
   * @returns {Object} Headers object with Authorization
   */
  getAuthHeader: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

export default authService;
