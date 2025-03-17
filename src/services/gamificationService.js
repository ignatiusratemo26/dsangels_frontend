import axios from 'axios';
import { 
  API_BASE_URL, 
  API_TIMEOUT, 
  ACCESS_TOKEN_KEY, 
  DEFAULT_PAGE_SIZE,
  calculateLevel
} from '../config';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle unauthorized errors that need token refresh
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // This would typically trigger a token refresh through AuthService
      // We're just rejecting here, as the AuthService would handle the refresh
      return Promise.reject(error);
    }
    
    // Handle network errors with a more user-friendly message
    if (error.code === 'ECONNABORTED' || !error.response) {
      return Promise.reject({
        ...error,
        userMessage: 'Network error: Please check your internet connection and try again.'
      });
    }
    
    return Promise.reject(error);
  }
);

export const gamificationService = {
  /**
   * Get all available badges
   * @param {Object} options - Query options
   * @param {number} options.page - Page number
   * @param {number} options.pageSize - Items per page
   * @param {string} options.sortBy - Sort field
   * @param {boolean} options.isAchievement - Filter by achievement type
   * @returns {Promise} Promise with badges data
   */
  async getBadges(options = {}) {
    try {
      const params = {
        page: options.page || 1,
        page_size: options.pageSize || DEFAULT_PAGE_SIZE
      };
      
      if (options.sortBy) params.ordering = options.sortBy;
      if (options.isAchievement !== undefined) params.is_achievement = options.isAchievement;
      
      const response = await apiClient.get('/api/gamification/badges/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching badges:', error);
      throw error;
    }
  },
  
  /**
   * Get a specific badge by ID
   * @param {number} badgeId - Badge ID
   * @returns {Promise} Promise with badge data
   */
  async getBadgeById(badgeId) {
    try {
      const response = await apiClient.get(`/api/gamification/badges/${badgeId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching badge ${badgeId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get badges earned by the current user
   * @returns {Promise} Promise with user badges data
   */
  async getUserBadges() {
    try {
      const response = await apiClient.get('/api/gamification/user-badges/');
      
      // Add client-side calculation of level based on points
      if (response.data && response.data.total_points) {
        response.data.level = calculateLevel(response.data.total_points);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user badges:', error);
      throw error;
    }
  },
  
  /**
   * Get the leaderboard
   * @param {Object} options - Query options
   * @param {number} options.limit - Number of users to retrieve
   * @param {string} options.timeframe - Timeframe to consider (all, week, month)
   * @returns {Promise} Promise with leaderboard data
   */
  async getLeaderboard(options = {}) {
    try {
      const params = {};
      if (options.limit) params.limit = options.limit;
      if (options.timeframe) params.timeframe = options.timeframe;
      
      const response = await apiClient.get('/api/gamification/leaderboard/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },
  
  /**
   * Trigger badge evaluation for the current user
   * @returns {Promise} Promise with award results
   */
  async checkForNewBadges() {
    try {
      const response = await apiClient.post('/api/gamification/award-badge/');
      return response.data;
    } catch (error) {
      console.error('Error checking for new badges:', error);
      throw error;
    }
  },
  
  /**
   * Track points earned from an activity
   * @param {string} activityType - Type of activity
   * @param {number} points - Points earned
   * @param {Object} metadata - Additional activity metadata
   * @returns {Promise} Promise with updated points data
   */
  async trackPoints(activityType, points, metadata = {}) {
    try {
      const response = await apiClient.post('/api/gamification/track-points/', {
        activity_type: activityType,
        points,
        metadata
      });
      return response.data;
    } catch (error) {
      console.error('Error tracking points:', error);
      throw error;
    }
  },
  
  /**
   * Get user's points history
   * @param {Object} options - Query options
   * @param {number} options.page - Page number
   * @param {number} options.pageSize - Items per page
   * @param {string} options.activityType - Filter by activity type
   * @returns {Promise} Promise with points history data
   */
  async getPointsHistory(options = {}) {
    try {
      const params = {
        page: options.page || 1,
        page_size: options.pageSize || DEFAULT_PAGE_SIZE
      };
      
      if (options.activityType) params.activity_type = options.activityType;
      
      const response = await apiClient.get('/api/gamification/points-history/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching points history:', error);
      throw error;
    }
  },
  
  /**
   * Get user's achievements summary
   * @returns {Promise} Promise with achievements summary
   */
  async getAchievementsSummary() {
    try {
      const response = await apiClient.get('/api/gamification/achievements-summary/');
      return response.data;
    } catch (error) {
      console.error('Error fetching achievements summary:', error);
      throw error;
    }
  }
};

export default gamificationService;