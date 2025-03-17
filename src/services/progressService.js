import axios from 'axios';
import { API_BASE_URL } from '../config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
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

export const progressService = {
  async getUserProgress() {
    const response = await apiClient.get('/api/progress/');
    return response.data;
  },
  
  async trackCompletion(data) {
    const response = await apiClient.post('/api/progress/track-completion/', data);
    return response.data;
  },
  
  async getUserStats() {
    const response = await apiClient.get('/api/progress/stats/');
    return response.data;
  },
  
  async getLearningPath() {
    const response = await apiClient.get('/api/progress/learning-path/');
    return response.data;
  }
};