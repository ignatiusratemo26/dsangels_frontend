import AuthService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class AnalyticsService {
  /**
   * Track user activity
   * @param {string} activityType - Type of activity (view, complete, etc.)
   * @param {Object} contentObject - Content object related to activity
   * @param {Object} additionalData - Any additional data to track
   * @returns {Promise} - Promise with tracking response
   */
  async trackActivity(activityType, contentObject, additionalData = {}) {
    if (!AuthService.isAuthenticated()) {
      return null; // Skip tracking for unauthenticated users
    }

    try {
      const data = {
        activity_type: activityType,
        content_type: contentObject.type,
        object_id: contentObject.id,
        data: additionalData
      };
      
      return await AuthService._authenticatedRequest(
        'post',
        `${API_URL}/analytics/activity/`,
        data
      );
    } catch (error) {
      console.error('Error tracking user activity:', error);
      // Don't throw, just log - analytics failures shouldn't break the app
      return null;
    }
  }

  /**
   * Get user analytics data
   * @param {number} days - Number of days to include in analytics
   * @returns {Promise} - Promise with user analytics data
   */
  async getUserAnalytics(days = 30) {
    try {
      return await AuthService._authenticatedRequest(
        'get',
        `${API_URL}/analytics/user/?days=${days}`
      );
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      throw error;
    }
  }

  /**
   * Get content analytics (admin/staff only)
   * @param {Object} params - Content parameters
   * @param {number} params.contentId - Content ID (optional)
   * @param {number} params.challengeId - Challenge ID (optional)
   * @param {number} params.days - Days to include (default: 30)
   * @returns {Promise} - Promise with content analytics data
   */
  async getContentAnalytics(params = {}) {
    try {
      let queryString = [];
      
      if (params.contentId) queryString.push(`content_id=${params.contentId}`);
      if (params.challengeId) queryString.push(`challenge_id=${params.challengeId}`);
      if (params.days) queryString.push(`days=${params.days}`);
      
      const qs = queryString.length > 0 ? `?${queryString.join('&')}` : '';
      
      return await AuthService._authenticatedRequest(
        'get',
        `${API_URL}/analytics/content/${qs}`
      );
    } catch (error) {
      console.error('Error fetching content analytics:', error);
      throw error;
    }
  }

  /**
   * Get engagement statistics (admin/staff only)
   * @param {number} days - Days to include
   * @returns {Promise} - Promise with engagement statistics
   */
  async getEngagementStats(days = 30) {
    try {
      return await AuthService._authenticatedRequest(
        'get',
        `${API_URL}/analytics/engagement/?days=${days}`
      );
    } catch (error) {
      console.error('Error fetching engagement stats:', error);
      throw error;
    }
  }

  /**
   * Get user's activity timeline
   * @param {number} days - Number of days to include
   * @returns {Promise} - Promise with activity timeline data
   */
  async getActivityTimeline(days = 30) {
    try {
      return await AuthService._authenticatedRequest(
        'get',
        `${API_URL}/analytics/timeline/?days=${days}`
      );
    } catch (error) {
      console.error('Error fetching activity timeline:', error);
      throw error;
    }
  }

  /**
   * Get user's learning progress statistics
   * @returns {Promise} - Promise with user stats data
   */
  async getUserStats() {
    try {
      return await AuthService._authenticatedRequest(
        'get',
        `${API_URL}/progress/stats/`
      );
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  /**
   * Get user's recommended learning path
   * @returns {Promise} - Promise with learning path data
   */
  async getLearningPath() {
    try {
      return await AuthService._authenticatedRequest(
        'get',
        `${API_URL}/progress/learning-path/`
      );
    } catch (error) {
      console.error('Error fetching learning path:', error);
      throw error;
    }
  }
}

export default new AnalyticsService();