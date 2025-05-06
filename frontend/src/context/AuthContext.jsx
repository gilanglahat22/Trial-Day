import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the Auth Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Get user info if logged in
        const response = await axios.get('/api/user');
        setUser(response.data);
      } catch (error) {
        // User is not authenticated
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
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
      // Backend uses Laravel Sanctum for authentication
      // The API returns a user object if login is successful
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
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
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