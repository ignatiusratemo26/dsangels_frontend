import axios from 'axios';
import AuthService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ChatService {
  async sendMessage(data) {
    try {
      const response = await AuthService._authenticatedRequest(
        'post',
        `${API_URL}/chat/send-message/`,
        data
      );
      return response;
    } catch (error) {
      console.error('Error sending chat message:', error);
      
      // If in development, use mock response
      if (process.env.NODE_ENV === 'development') {
        return this.getMockResponse(data.message, data.age_group);
      }
      throw error;
    }
  }
  
  // Mockup responses for development
  getMockResponse(message, ageGroup) {
    const lowerMessage = message.toLowerCase();
    
    // Check for greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return {
        message: "Hi there! I'm Mowgli, your friendly tech helper! How can I assist you today?",
        success: true
      };
    }
    
    // Check for questions about coding
    if (lowerMessage.includes('what is coding') || lowerMessage.includes('how to code')) {
      if (ageGroup === 'elementary') {
        return {
          message: "Coding is like giving instructions to a computer! It's similar to when you tell a friend how to play a game. You use special words that the computer understands to make it do cool things like games, apps, or websites!",
          success: true
        };
      } else {
        return {
          message: "Coding is the process of creating instructions for computers using programming languages. These instructions tell computers what to do, allowing us to create software, websites, apps, games, and more. It's like writing a detailed recipe that the computer follows exactly!",
          success: true
        };
      }
    }
    
    // Check for questions about DSAngels platform
    if (lowerMessage.includes('what can i do here') || lowerMessage.includes('how to use')) {
      return {
        message: "In DSAngels, you can learn coding through fun challenges, read concept notes about tech topics, earn badges as you learn, track your progress on the leaderboard, and discuss with other learners in the forum. What would you like to explore first?",
        success: true
      };
    }
    
    // Default response
    return {
      message: "That's an interesting question! I'm still learning, but I'd be happy to help you with coding concepts, challenges, or exploring this platform. Could you tell me more specifically what you'd like to know?",
      success: true
    };
  }
}


export default new ChatService();