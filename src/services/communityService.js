import axios from 'axios';
import { 
    API_BASE_URL, 
    API_TIMEOUT, 
    ACCESS_TOKEN_KEY, 
    DEFAULT_PAGE_SIZE,
    calculateLevel
  } from '../config';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: API_TIMEOUT
  });

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
/**
 * Service for handling community-related functionality
 * Implements the API endpoints documented in the project
 */
class CommunityService {
  /**
   * Get all forum topics with optional filtering
   * @param {Object} params - Query parameters including page, page_size, category
   * @returns {Promise} - Promise with paginated topics data
   */
  async getAllTopics(params = {}) {
    try {
      const response = await apiClient.get('/api/community/topics/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching topics:', error);
      throw error;
    }
  }
  
  /**
   * Get a specific forum topic by ID
   * @param {number} topicId - ID of the topic to fetch
   * @returns {Promise} - Promise with topic data
   */
  async getTopicById(topicId) {
    try {
      const response = await apiClient.get(`/api/community/topics/${topicId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching topic ${topicId}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new forum topic
   * @param {Object} data - Topic data including title and description
   * @returns {Promise} - Promise with created topic data
   */
  async createTopic(data) {
    try {
      const response = await apiClient.post('/api/community/topics/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing forum topic
   * @param {number} topicId - ID of the topic to update
   * @param {Object} data - Updated topic data
   * @returns {Promise} - Promise with updated topic data
   */
  async updateTopic(topicId, data) {
    try {
      const response = await apiClient.patch(`/api/community/topics/${topicId}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating topic ${topicId}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a forum topic
   * @param {number} topicId - ID of the topic to delete
   * @returns {Promise} - Promise with deletion result
   */
  async deleteTopic(topicId) {
    try {
      const response = await apiClient.delete(`/api/community/topics/${topicId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting topic ${topicId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get posts for a specific topic
   * @param {number} topicId - ID of the topic
   * @param {Object} params - Query parameters including page and page_size
   * @returns {Promise} - Promise with paginated posts data
   */
  async getPostsByTopic(topicId, params = {}) {
    try {
      const response = await apiClient.get(`/api/community/topics/${topicId}/posts/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching posts for topic ${topicId}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new post in a topic
   * @param {number} topicId - ID of the topic
   * @param {Object} data - Post data including content
   * @returns {Promise} - Promise with created post data
   */
  async createPost(topicId, data) {
    try {
      const response = await apiClient.post(`/api/community/topics/${topicId}/posts/`, data);
      return response.data;
    } catch (error) {
      console.error(`Error creating post for topic ${topicId}:`, error);
      throw error;
    }
  }
  
  /**
   * Update an existing post
   * @param {number} postId - ID of the post to update
   * @param {Object} data - Updated post data
   * @returns {Promise} - Promise with updated post data
   */
  async updatePost(postId, data) {
    try {
      const response = await apiClient.patch(`/api/community/posts/${postId}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating post ${postId}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a post
   * @param {number} postId - ID of the post to delete
   * @returns {Promise} - Promise with deletion result
   */
  async deletePost(postId) {
    try {
      const response = await apiClient.delete(`/api/community/posts/${postId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting post ${postId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get comments for a post
   * @param {number} postId - ID of the post
   * @param {Object} params - Query parameters
   * @returns {Promise} - Promise with paginated comments data
   */
  async getCommentsByPost(postId, params = {}) {
    try {
      const response = await apiClient.get(`/api/community/posts/${postId}/comments/`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new comment on a post
   * @param {number} postId - ID of the post
   * @param {Object} data - Comment data including content
   * @returns {Promise} - Promise with created comment data
   */
  async createComment(postId, data) {
    try {
      const response = await apiClient.post(`/api/community/posts/${postId}/comments/`, data);
      return response.data;
    } catch (error) {
      console.error(`Error creating comment for post ${postId}:`, error);
      throw error;
    }
  }
  
  /**
   * Update an existing comment
   * @param {number} commentId - ID of the comment to update
   * @param {Object} data - Updated comment data
   * @returns {Promise} - Promise with updated comment data
   */
  async updateComment(commentId, data) {
    try {
      const response = await apiClient.patch(`/api/community/comments/${commentId}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating comment ${commentId}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a comment
   * @param {number} commentId - ID of the comment to delete
   * @returns {Promise} - Promise with deletion result
   */
  async deleteComment(commentId) {
    try {
      const response = await apiClient.delete(`/api/community/comments/${commentId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting comment ${commentId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get all mentor connections for current user
   * @param {Object} params - Query parameters
   * @returns {Promise} - Promise with paginated mentor connections data
   */
  async getMentorConnections(params = {}) {
    try {
      const response = await apiClient.get('/api/community/mentors/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching mentor connections:', error);
      throw error;
    }
  }
  
  /**
   * Create a new mentor connection request
   * @param {Object} data - Connection data including mentor ID and goals
   * @returns {Promise} - Promise with created connection data
   */
  async createMentorConnection(data) {
    try {
      const response = await apiClient.post('/api/community/mentors/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating mentor connection:', error);
      throw error;
    }
  }
  
  /**
   * Get details of a specific mentor connection
   * @param {number} connectionId - ID of the connection to fetch
   * @returns {Promise} - Promise with connection data
   */
  async getMentorConnectionById(connectionId) {
    try {
      const response = await apiClient.get(`/api/community/mentors/${connectionId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching mentor connection ${connectionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Update a mentor connection (accept/reject or update goals)
   * @param {number} connectionId - ID of the connection to update
   * @param {Object} data - Updated connection data
   * @returns {Promise} - Promise with updated connection data
   */
  async updateMentorConnection(connectionId, data) {
    try {
      const response = await apiClient.patch(`/api/community/mentors/${connectionId}/`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating mentor connection ${connectionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get role models with optional filtering
   * @param {Object} params - Query parameters including field and country
   * @returns {Promise} - Promise with paginated role models data
   */
  async getRoleModels(params = {}) {
    try {
      const response = await apiClient.get('/api/community/role-models/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching role models:', error);
      throw error;
    }
  }
  
  /**
   * Get a specific role model by ID
   * @param {number} roleModelId - ID of the role model to fetch
   * @returns {Promise} - Promise with role model data
   */
  async getRoleModelById(roleModelId) {
    try {
      const response = await apiClient.get(`/api/community/role-models/${roleModelId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching role model ${roleModelId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get all forum categories
   * @returns {Promise} - Promise with category data
   */
  async getAllCategories() {
    try {
      // Not in your endpoints doc but likely exists
      const response = await apiClient.get('/api/community/categories/');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
  
  // Fallback for development/testing - mock data functions
  _getMockTopics() {
    return [
      {
        id: 1,
        title: "Getting Started with Python",
        description: "Tips and resources for beginners learning Python programming",
        created_by: 1,
        created_by_username: "tech_mentor",
        created_by_avatar: null,
        created_at: "2023-09-15T08:30:00Z",
        updated_at: "2023-09-15T08:30:00Z",
        post_count: 12,
        view_count: 156,
        is_pinned: true,
        is_closed: false,
        category: "Programming"
      },
      {
        id: 2,
        title: "Web Development for Beginners",
        description: "HTML, CSS, and JavaScript basics for building your first website",
        created_by: 2,
        created_by_username: "webdev_girl",
        created_by_avatar: null,
        created_at: "2023-09-18T14:20:00Z",
        updated_at: "2023-09-18T14:20:00Z",
        post_count: 8,
        view_count: 94,
        is_pinned: false,
        is_closed: false,
        category: "Web Development"
      },
      {
        id: 3,
        title: "Data Science Projects for Kids",
        description: "Fun data science projects anyone can try",
        created_by: 3,
        created_by_username: "data_enthusiast",
        created_by_avatar: null,
        created_at: "2023-09-20T10:15:00Z",
        updated_at: "2023-09-20T10:15:00Z",
        post_count: 5,
        view_count: 78,
        is_pinned: false,
        is_closed: false,
        category: "Data Science"
      }
    ];
  }
  
  _getMockPosts() {
    return [
      {
        id: 1,
        topic: 1,
        content: "I just started learning Python and I'm wondering what IDE everyone recommends for beginners?",
        created_by: 3,
        created_by_username: "coding_newbie",
        created_by_avatar: null,
        created_at: "2023-09-15T09:15:00Z",
        updated_at: "2023-09-15T09:15:00Z"
      },
      {
        id: 2,
        topic: 1,
        content: "I highly recommend VS Code with the Python extension. It's free, lightweight, and has great features for beginners and advanced users alike.",
        created_by: 1,
        created_by_username: "tech_mentor",
        created_by_avatar: null,
        created_at: "2023-09-15T09:45:00Z",
        updated_at: "2023-09-15T09:45:00Z"
      },
      {
        id: 3,
        topic: 1,
        content: "PyCharm is also excellent, especially the community edition which is free. It has more Python-specific features out of the box.",
        created_by: 4,
        created_by_username: "python_pro",
        created_by_avatar: null,
        created_at: "2023-09-15T10:30:00Z",
        updated_at: "2023-09-15T10:30:00Z"
      },
      {
        id: 4,
        topic: 2,
        content: "What's the best way to learn CSS Grid and Flexbox? I'm finding them confusing.",
        created_by: 5,
        created_by_username: "html_starter",
        created_by_avatar: null,
        created_at: "2023-09-18T16:10:00Z",
        updated_at: "2023-09-18T16:10:00Z"
      }
    ];
  }
  
  _getMockCategories() {
    return [
      { id: 1, name: "Programming", description: "General programming topics", topic_count: 5 },
      { id: 2, name: "Web Development", description: "HTML, CSS, JavaScript and web frameworks", topic_count: 3 },
      { id: 3, name: "Data Science", description: "Data analysis, visualization, and machine learning", topic_count: 2 },
      { id: 4, name: "General Discussion", description: "General conversation about tech and learning", topic_count: 4 }
    ];
  }
  
  _getMockRoleModels() {
    return [
      {
        id: 1,
        name: "Grace Hopper",
        bio: "Computer scientist and United States Navy rear admiral. One of the first programmers of the Harvard Mark I computer.",
        accomplishments: "Developed the first compiler for a computer programming language. Popularized the term 'debugging'.",
        field: "Computer Science",
        country: "United States",
        image: "/images/role_models/grace_hopper.jpg",
        external_url: "https://en.wikipedia.org/wiki/Grace_Hopper"
      },
      {
        id: 2,
        name: "Ada Lovelace",
        bio: "English mathematician and writer, known for her work on Charles Babbage's Analytical Engine.",
        accomplishments: "Published the first algorithm intended to be carried out by a machine. Recognized as the first computer programmer.",
        field: "Mathematics",
        country: "United Kingdom", 
        image: "/images/role_models/ada_lovelace.jpg",
        external_url: "https://en.wikipedia.org/wiki/Ada_Lovelace"
      }
    ];
  }
  
  // Fallback methods for development or when API is unavailable
  async fallbackGetAllTopics(params = {}) {
    try {
      // Simulate API pagination
      const { page = 1, page_size = 10, category = null } = params;
      let topics = this._getMockTopics();
      
      if (category) {
        topics = topics.filter(topic => topic.category === category);
      }
      
      const startIndex = (page - 1) * page_size;
      const endIndex = startIndex + page_size;
      
      return {
        count: topics.length,
        next: topics.length > endIndex ? `/api/community/topics/?page=${parseInt(page) + 1}` : null,
        previous: page > 1 ? `/api/community/topics/?page=${parseInt(page) - 1}` : null,
        results: topics.slice(startIndex, endIndex)
      };
    } catch (error) {
      console.error('Error in fallback topics:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const communityService = new CommunityService();