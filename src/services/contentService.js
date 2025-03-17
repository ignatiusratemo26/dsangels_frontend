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

export const contentService = {
  async getContentList(params) {
    const response = await apiClient.get('/api/content/', { params });
    return response.data;
  },
  
  async getContentDetail(id) {
    const response = await apiClient.get(`/api/content/${id}/`);
    return response.data;
  },
  
  async getChallenges(params) {
    const response = await apiClient.get('/api/content/challenges/', { params });
    return response.data;
  },
  
  async getChallenge(id) {
    const response = await apiClient.get(`/api/content/challenges/${id}/`);
    return response.data;
  },
  
  async getConceptNotes(params) {
    const response = await apiClient.get('/api/content/concept-notes/', { params });
    return response.data;
  },
  
  async getConceptNote(id) {
    const response = await apiClient.get(`/api/content/concept-notes/${id}/`);
    return response.data;
  },
  
  async getHints(challengeId) {
    const response = await apiClient.get(`/api/content/challenges/${challengeId}/hints/`);
    return response.data;
  },
  
  async generateHint(challengeId, userAttempt, hintLevel = 1) {
    const response = await apiClient.post(`/api/content/challenges/${challengeId}/generate-hint/`, {
      user_attempt: userAttempt,
      hint_level: hintLevel
    });
    return response.data;
  },
  
  async getAgeGroups() {
    const response = await apiClient.get('/api/content/age-groups/');
    return response.data;
  },
  
  async getRecommendations(params) {
    const response = await apiClient.get('/api/content/recommendations/', { params });
    return response.data;
  }
};