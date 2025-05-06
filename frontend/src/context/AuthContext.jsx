import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the Auth Context
export const AuthContext = createContext();

const USER_DATA = 'user_data';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem(USER_DATA)) || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up axios auth header when user changes
  useEffect(() => {
    if (user) {
      // Store user data in localStorage
      localStorage.setItem(USER_DATA, JSON.stringify(user));
    } else {
      // Remove user data from localStorage on logout
      localStorage.removeItem(USER_DATA);
    }
  }, [user]);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }
        
        // Validate user session with server
        const response = await axios.get('/api/user');
        if (response.data) {
          // Update user data if session is valid
          setUser(response.data);
        } else {
          // Clear user data if session is invalid
          setUser(null);
        }
      } catch (error) {
        console.error('Session validation error:', error);
        // User is not authenticated or session expired
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Try to get CSRF token, but continue if it fails
  const tryGetCsrfToken = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie');
      return true;
    } catch (error) {
      console.warn('CSRF token retrieval failed, continuing anyway:', error);
      return false;
    }
  };

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      // Try to get CSRF token first, but proceed anyway
      await tryGetCsrfToken();
      
      const response = await axios.post('/api/register', userData);
      
      // Set the user state with the response data
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Registration failed. Please try again.'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login an existing user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      // Try to get CSRF token first, but proceed anyway
      await tryGetCsrfToken();
      
      // Backend uses Laravel Sanctum for authentication
      const response = await axios.post('/api/login', credentials);
      
      // Set the user state with the response data
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      setError(
        error.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout the current user
  const logout = async () => {
    setLoading(true);
    try {
      await axios.post('/api/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear user data regardless of success/failure of logout API call
      setUser(null);
      setLoading(false);
    }
  };

  // Check if the user is an admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Value object to provide through the context
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 