import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Promise with registration response
   */
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register/`, userData);
      if (response.data.token) {
        this.setTokens(response.data.token, response.data.refresh);
      }
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Register a parent account
   * @param {Object} parentData - Parent registration data
   * @returns {Promise} - Promise with registration response
   */
  async registerParent(parentData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register/parent/`, parentData);
      if (response.data.token) {
        this.setTokens(response.data.token, response.data.refresh);
      }
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Register a mentor account
   * @param {Object} mentorData - Mentor registration data
   * @returns {Promise} - Promise with registration response
   */
  async registerMentor(mentorData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register/mentor/`, mentorData);
      if (response.data.token) {
        this.setTokens(response.data.token, response.data.refresh);
      }
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Log in a user
   * @param {string} email - User's email
   * @param {string} password - Password
   * @returns {Promise} - Promise with login response
   */
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login/`, {
        email,
        password,
      });
      
      if (response.data.access) {
        // Store tokens in localStorage
        this.setTokens(response.data.access, response.data.refresh);
      }
      return response.data;
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Log out the current user
   * @returns {Promise} - Promise with logout response
   */
  async logout() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await axios.post(`${API_URL}/auth/logout/`, {
          refresh: refreshToken,
        });
      }
      this.clearTokens();
      return { success: true };
    } catch (error) {
      this.clearTokens();
      return { success: true, error: error.message };
    }
  }

  /**
   * Get current user profile
   * @returns {Promise} - Promise with user data
   */
  async getUserProfile() {
    try {
      return await this._authenticatedRequest('get', `${API_URL}/auth/profile/`);
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - Promise with updated user data
   */
  async updateUserProfile(profileData) {
    try {
      return await this._authenticatedRequest('patch', `${API_URL}/auth/profile/`, profileData);
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Change user password
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @param {string} newPassword2 - Confirm new password
   * @returns {Promise} - Promise with response data
   */
  async changePassword(oldPassword, newPassword, newPassword2) {
    try {
      return await this._authenticatedRequest('post', `${API_URL}/auth/change-password/`, {
        old_password: oldPassword,
        new_password: newPassword,
        new_password2: newPassword2,
      });
    } catch (error) {
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Refresh the access token using refresh token
   * @returns {Promise} - Promise with new access token
   */
  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
        refresh: refreshToken,
      });
      
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        return response.data;
      }
    } catch (error) {
      this.clearTokens();
      this._handleError(error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user has valid token
   */
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }

  /**
   * Set authentication tokens in localStorage
   * @param {string} accessToken - JWT access token
   * @param {string} refreshToken - JWT refresh token
   */
  setTokens(accessToken, refreshToken) {
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  /**
   * Clear authentication tokens from localStorage
   */
  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  /**
   * Make an authenticated API request
   * @param {string} method - HTTP method (get, post, etc.)
   * @param {string} url - API endpoint
   * @param {Object} data - Request payload
   * @returns {Promise} - Promise with response data
   */
  async _authenticatedRequest(method, url, data = null) {
    try {
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      };
      
      const config = { headers };
      
      let response;
      if (method.toLowerCase() === 'get') {
        response = await axios.get(url, config);
      } else if (method.toLowerCase() === 'post') {
        response = await axios.post(url, data, config);
      } else if (method.toLowerCase() === 'put') {
        response = await axios.put(url, data, config);
      } else if (method.toLowerCase() === 'patch') {
        response = await axios.patch(url, data, config);
      } else if (method.toLowerCase() === 'delete') {
        response = await axios.delete(url, config);
      }
      
      return response.data;
    } catch (error) {
      // Handle token expiration
      if (error.response && error.response.status === 401) {
        try {
          await this.refreshToken();
          // Retry the request with new token
          return this._authenticatedRequest(method, url, data);
        } catch (refreshError) {
          this.clearTokens();
          throw refreshError;
        }
      }
      throw error;
    }
  }

  /**
   * Handle common error scenarios
   * @param {Object} error - Axios error object
   */
  _handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response error:", error.response.data);
      
      // Log out on token issues (except when trying to refresh)
      if (error.response.status === 401 && 
          !error.config.url.includes('token/refresh')) {
        this.clearTokens();
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request error:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
    }
  }
}

export default new AuthService();