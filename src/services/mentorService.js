import axios from 'axios';
import AuthService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with authentication header
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const mentorService = {
  async getMentors(params = {}) {
    try {
      const response = await apiClient.get('/mentors/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching mentors:', error);
      
      // If in development mode, return mock data
      if (process.env.NODE_ENV === 'development') {
        return this.getMockMentors(params);
      }
      
      throw error;
    }
  },
  
  async getMentorById(id) {
    try {
      const response = await apiClient.get(`/mentors/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching mentor with id ${id}:`, error);
      throw error;
    }
  },
  
  async requestMentorship(data) {
    try {
      const response = await apiClient.post('/mentors/request/', data);
      return response.data;
    } catch (error) {
      console.error('Error sending mentorship request:', error);
      
      // For development only, simulate successful API call
      if (process.env.NODE_ENV === 'development') {
        return {
          success: true,
          message: 'Mentorship request sent successfully',
          request_id: Math.floor(Math.random() * 1000),
          status: 'pending'
        };
      }
      
      throw error;
    }
  },
  
  async getMentorshipRequests() {
    try {
      const response = await apiClient.get('/mentors/requests/');
      return response.data;
    } catch (error) {
      console.error('Error fetching mentorship requests:', error);
      
      // For development
      if (process.env.NODE_ENV === 'development') {
        return {
          sent: [
            {
              id: 1,
              mentor: {
                id: 3,
                name: 'Jessica Williams',
                title: 'Mobile Developer',
                avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
              },
              created_at: new Date().toISOString(),
              status: 'pending',
              message: 'I would love to learn more about mobile app development.'
            }
          ],
          received: [] // For mentors who receive requests
        };
      }
      
      throw error;
    }
  },
  
  async updateMentorshipRequest(requestId, status) {
    try {
      const response = await apiClient.patch(`/mentors/requests/${requestId}/`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating mentorship request:', error);
      throw error;
    }
  },
  
  async getMentorSessions() {
    try {
      const response = await apiClient.get('/mentors/sessions/');
      return response.data;
    } catch (error) {
      console.error('Error fetching mentor sessions:', error);
      
      // For development
      if (process.env.NODE_ENV === 'development') {
        return [
          {
            id: 1,
            mentor: {
              id: 5,
              name: 'Aisha Khan',
              title: 'AI Researcher',
              avatar: 'https://randomuser.me/api/portraits/women/62.jpg'
            },
            next_session: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            topic: 'Introduction to Machine Learning',
            status: 'scheduled',
            notes: 'Prepare questions about classification algorithms'
          }
        ];
      }
      
      throw error;
    }
  },
  
  async scheduleMentorSession(mentorId, data) {
    try {
      const response = await apiClient.post(`/mentors/${mentorId}/schedule/`, data);
      return response.data;
    } catch (error) {
      console.error('Error scheduling mentor session:', error);
      throw error;
    }
  },
  
  // Helper method for mock data in development
  getMockMentors(params = {}) {
    const { page = 1, page_size = 8, search = '' } = params;
    
    const skills = ['JavaScript', 'Python', 'React', 'Data Science', 'AI', 'Machine Learning', 
      'Web Development', 'Mobile Apps', 'Game Development', 'HTML/CSS', 'UI/UX', 'AR/VR'];
    
    const mentors = [
      {
        id: 1,
        name: 'Sarah Johnson',
        title: 'Senior Software Engineer',
        company: 'Google',
        bio: 'Passionate about helping young girls learn to code and build amazing projects.',
        experience_years: 8,
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        skills: ['JavaScript', 'React', 'Web Development'],
        availability: '2 hours/week'
      },
      {
        id: 2,
        name: 'Maria Rodriguez',
        title: 'Data Scientist',
        company: 'Microsoft',
        bio: 'I love working with data and teaching others how to analyze and visualize information.',
        experience_years: 5,
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        skills: ['Python', 'Data Science', 'Machine Learning'],
        availability: '1 hour/week'
      },
      // ...other mentor objects remain the same
    ];
    
    // Filter by search if provided
    let filteredMentors = mentors;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredMentors = mentors.filter(mentor => {
        return (
          mentor.name.toLowerCase().includes(searchLower) ||
          mentor.title.toLowerCase().includes(searchLower) ||
          mentor.company.toLowerCase().includes(searchLower) ||
          mentor.bio.toLowerCase().includes(searchLower) ||
          mentor.skills.some(skill => skill.toLowerCase().includes(searchLower))
        );
      });
    }
    
    // Calculate pagination
    const startIndex = (page - 1) * page_size;
    const endIndex = startIndex + page_size;
    const paginatedMentors = filteredMentors.slice(startIndex, endIndex);
    
    return {
      count: filteredMentors.length,
      next: endIndex < filteredMentors.length ? `/api/mentors/?page=${page + 1}` : null,
      previous: page > 1 ? `/api/mentors/?page=${page - 1}` : null,
      results: paginatedMentors
    };
  }
};

export default mentorService;