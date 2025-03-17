import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if there's a token in local storage on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (token) {
        try {
          // Get user profile with token
          const userData = await AuthService.getProfile();
          setUser(userData);
        } catch (err) {
          // If access token expired, try to refresh
          if (refreshToken) {
            try {
              await refreshAccessToken(refreshToken);
              const userData = await AuthService.getProfile();
              setUser(userData);
            } catch (refreshErr) {
              console.error("Failed to refresh token:", refreshErr);
              logout();
            }
          } else {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await AuthService.refreshToken(refreshToken);
      localStorage.setItem('access_token', response.access);
      return response.access;
    } catch (error) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      throw error;
    }
  };

  const login = async (username, password) => {
    try {
      setError(null);
      const response = await AuthService.login(username, password);
      
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      
      const userData = response.user || await AuthService.getProfile();
      setUser(userData);
      
      return userData;
    } catch (err) {
      setError(err.message || 'Failed to login');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await AuthService.register(userData);
      
      if (response.token) {
        localStorage.setItem('access_token', response.token);
      }
      
      setUser(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to register');
      throw err;
    }
  };

  const registerParent = async (userData) => {
    try {
      setError(null);
      const response = await AuthService.registerParent(userData);
      
      if (response.token) {
        localStorage.setItem('access_token', response.token);
      }
      
      setUser(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to register parent');
      throw err;
    }
  };

  const registerMentor = async (userData) => {
    try {
      setError(null);
      const response = await AuthService.registerMentor(userData);
      
      if (response.token) {
        localStorage.setItem('access_token', response.token);
      }
      
      setUser(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to register mentor');
      throw err;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      navigate('/login');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const updatedProfile = await AuthService.updateProfile(profileData);
      setUser({...user, ...updatedProfile});
      return updatedProfile;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      throw err;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setError(null);
      return await AuthService.changePassword(passwordData);
    } catch (err) {
      setError(err.message || 'Failed to change password');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      registerParent,
      registerMentor,
      logout,
      updateProfile,
      changePassword,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};