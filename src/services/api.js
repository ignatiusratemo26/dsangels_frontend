import axios from 'axios';
import { API_BASE_URL } from '../config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          localStorage.setItem('access_token', response.data.access);
          
          // Retry the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  async register(userData) {
    const response = await apiClient.post('/api/auth/register/', userData);
    return response.data;
  },
  
  async registerParent(userData) {
    const response = await apiClient.post('/api/auth/register/parent/', userData);
    return response.data;
  },
  
  async registerMentor(userData) {
    const response = await apiClient.post('/api/auth/register/mentor/', userData);
    return response.data;
  },
  
  async login(username, password) {
    const response = await apiClient.post('/api/auth/login/', { username, password });
    return response.data;
  },
  
  async logout(refreshToken) {
    const response = await apiClient.post('/api/auth/logout/', { refresh: refreshToken });
    return response.data;
  },
  
  async getProfile() {
    const response = await apiClient.get('/api/auth/profile/');
    return response.data;
  },
  
  async updateProfile(profileData) {
    // Handle FormData for file uploads
    let config = {};
    if (profileData instanceof FormData) {
      config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
    }
    
    const response = await apiClient.put('/api/auth/profile/', profileData, config);
    return response.data;
  },
  
  async changePassword(passwordData) {
    const response = await apiClient.post('/api/auth/change-password/', passwordData);
    return response.data;
  },
  
  async refreshToken(refreshToken) {
    const response = await apiClient.post('/api/auth/token/refresh/', { refresh: refreshToken });
    return response.data;
  },
};