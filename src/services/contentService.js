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
  },
  
  async getRelatedConcepts(conceptId) {
    try {
      const params = {
        content_type: 'concept-note',
        exclude: conceptId,
        count: 3
      };
      const response = await apiClient.get('/api/content/recommendations/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching related concepts:', error);
      // Return empty results object as fallback
      return { results: [] };
    }
  },
  
  async getUserPreferences() {
    try {
      const response = await apiClient.get('/api/users/preferences/');
      return response.data;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      // Return default preferences as fallback
      return { 
        saved_concepts: [],
        theme_preference: 'system',
        email_notifications: true
      };
    }
  },
    
  async toggleSavedConcept(conceptId, saved) {
    try {
      const response = await apiClient.post('/api/users/saved-concepts/toggle/', {
        concept_id: conceptId,
        saved: saved
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling saved concept:', error);
      throw error;
    }
  },
  // Add this method to the contentService object
  async getConceptTutorial(conceptId) {
    try {
      const response = await apiClient.get(`/api/content/concept-notes/${conceptId}/tutorial/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching concept tutorial:', error);
      
      // Return a default tutorial structure for development
      if (process.env.NODE_ENV === 'development') {
        return {
          id: conceptId,
          title: "Default Tutorial",
          description: "This is a fallback tutorial for development",
          steps: [
            {
              title: 'Introduction',
              content: 'Welcome to this interactive tutorial. This is a fallback since the API endpoint is not available yet.',
              code: '# Welcome to the tutorial\nprint("Hello, world!")',
            },
            {
              title: 'Getting Started',
              content: 'Let\'s try a simple example to understand how this works.',
              code: '# A simple example\n# Try running this code!\n\nprint("I am learning to code!")',
              runnable: true,
              expected_output: 'I am learning to code!',
            },
            {
              title: 'Going Further',
              content: 'Now let\'s try something a bit more advanced.',
              code: '# A more advanced example\n\n# Define a function\ndef greet(name):\n    return f"Hello, {name}!"\n\n# Call the function\nresult = greet("Learner")\nprint(result)',
              runnable: true,
              expected_output: 'Hello, Learner!',
            },
          ]
        };
      }
      
      // If not in development, let the component handle the error
      throw error;
    }
  },

};