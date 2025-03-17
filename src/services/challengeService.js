import axios from 'axios';
import AuthService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ChallengeService {
  /**
   * Get all challenges with optional filtering
   * @param {Object} filters - Filter criteria
   * @returns {Promise} - Promise with challenge list
   */
  async getChallenges(filters = {}) {
    try {
      let queryParams = new URLSearchParams();
      
      // Add filters to query params
      if (filters.contentId) queryParams.append('content_id', filters.contentId);
      if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
      if (filters.theme) queryParams.append('theme', filters.theme);
      if (filters.minPoints) queryParams.append('min_points', filters.minPoints);
      if (filters.maxPoints) queryParams.append('max_points', filters.maxPoints);
      if (filters.search) queryParams.append('search', filters.search);
      
      // Add pagination if provided
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.pageSize) queryParams.append('page_size', filters.pageSize);
      
      const url = `${API_URL}/content/challenges/?${queryParams.toString()}`;
      
      if (AuthService.isAuthenticated()) {
        return await AuthService._authenticatedRequest('get', url);
      } else {
        const response = await axios.get(url);
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
      throw error;
    }
  }

  /**
   * Get a specific challenge by ID
   * @param {number} id - Challenge ID
   * @returns {Promise} - Promise with challenge data
   */
  async getChallenge(id) {
    try {
      const url = `${API_URL}/content/challenges/${id}/`;
      
      if (AuthService.isAuthenticated()) {
        return await AuthService._authenticatedRequest('get', url);
      } else {
        const response = await axios.get(url);
        return response.data;
      }
    } catch (error) {
      console.error(`Error fetching challenge ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get hints for a specific challenge
   * @param {number} challengeId - Challenge ID
   * @returns {Promise} - Promise with hints list
   */
  async getHints(challengeId) {
    try {
      return await AuthService._authenticatedRequest(
        'get',
        `${API_URL}/content/challenges/${challengeId}/hints/`
      );
    } catch (error) {
      console.error(`Error fetching hints for challenge ${challengeId}:`, error);
      throw error;
    }
  }

  /**
   * Generate AI hint for the challenge based on user's attempt
   * @param {number} challengeId - Challenge ID
   * @param {string} userAttempt - User's current code attempt
   * @param {number} hintLevel - Level of hint detail (1-3)
   * @returns {Promise} - Promise with generated hint
   */
  async generateHint(challengeId, userAttempt, hintLevel = 1) {
    try {
      return await AuthService._authenticatedRequest(
        'post',
        `${API_URL}/content/challenges/${challengeId}/generate-hint/`,
        {
          attempt: userAttempt,
          hint_level: hintLevel
        }
      );
    } catch (error) {
      console.error(`Error generating hint for challenge ${challengeId}:`, error);
      throw error;
    }
  }

  /**
   * Submit a solution for a challenge
   * @param {number} challengeId - Challenge ID
   * @param {string} code - Submitted code solution
   * @returns {Promise} - Promise with submission results
   */
  async submitSolution(challengeId, code) {
    try {
      return await AuthService._authenticatedRequest(
        'post',
        `${API_URL}/content/challenges/${challengeId}/submit/`,
        { code }
      );
    } catch (error) {
      console.error(`Error submitting solution for challenge ${challengeId}:`, error);
      throw error;
    }
  }

  /**
   * Track progress on a challenge
   * @param {number} challengeId - Challenge ID
   * @param {number} completionPercentage - Completion percentage (0-100)
   * @returns {Promise} - Promise with updated progress data
   */
  async trackProgress(challengeId, completionPercentage) {
    try {
      return await AuthService._authenticatedRequest(
        'post',
        `${API_URL}/progress/track-completion/`,
        {
          challenge_id: challengeId,
          completion_percentage: completionPercentage
        }
      );
    } catch (error) {
      console.error(`Error tracking progress for challenge ${challengeId}:`, error);
      throw error;
    }
  }

  /**
   * Get challenge recommendations for the user
   * @param {number} count - Number of recommendations to fetch
   * @returns {Promise} - Promise with recommended challenges
   */
  async getRecommendedChallenges(count = 5) {
    try {
      return await AuthService._authenticatedRequest(
        'get',
        `${API_URL}/content/recommendations/?content_type=challenge&count=${count}`
      );
    } catch (error) {
      console.error('Error fetching challenge recommendations:', error);
      throw error;
    }
  }

  /**
   * Get concept notes related to a challenge
   * @param {number} challengeId - Challenge ID
   * @returns {Promise} - Promise with concept notes
   */
  async getRelatedConceptNotes(challengeId) {
    try {
      const challenge = await this.getChallenge(challengeId);
      if (!challenge || !challenge.content) {
        return [];
      }
      
      const response = await axios.get(
        `${API_URL}/content/concept-notes/?content_id=${challenge.content}`
      );
      
      return response.data.results || [];
    } catch (error) {
      console.error(`Error fetching concept notes for challenge ${challengeId}:`, error);
      throw error;
    }
  }
}

export default new ChallengeService();