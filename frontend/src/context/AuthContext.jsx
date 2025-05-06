import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the Auth Context
export const AuthContext = createContext();

const USER_DATA = 'user_data';
const AUTH_TOKEN = 'auth_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem(USER_DATA)) || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up axios auth header when user changes
  useEffect(() => {
    if (user) {
      // Store user data in localStorage
      localStorage.setItem(USER_DATA, JSON.stringify(user));
      
      // Set auth token in axios headers if available
      const token = localStorage.getItem(AUTH_TOKEN);
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } else {
      // Remove user data and token from localStorage on logout
      localStorage.removeItem(USER_DATA);
      localStorage.removeItem(AUTH_TOKEN);
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const storedToken = localStorage.getItem(AUTH_TOKEN);
        const storedUser = JSON.parse(localStorage.getItem(USER_DATA) || 'null');
        
        console.log('AuthContext: Checking logged in status');
        console.log('Stored token:', storedToken ? 'exists' : 'none');
        console.log('Stored user:', storedUser);
        
        // If no token, clear everything and finish loading
        if (!storedToken) {
          console.log('AuthContext: No token found, setting user to null');
          setUser(null);
          setLoading(false);
          return;
        }

        // Set auth header for token validation
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        console.log('AuthContext: Token set, validating with server...');
        
        // Validate user session with server
        const response = await axios.get('/api/user');
        console.log('AuthContext: User validation response:', response.data);
        if (response.data) {
          // Update user data if session is valid
          setUser(response.data);
        } else {
          // Clear user data if session is invalid
          console.log('AuthContext: Empty response, clearing user');
          setUser(null);
        }
      } catch (error) {
        console.error('AuthContext: Session validation error:', error);
        console.log('Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
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
      
      // Store the access token
      if (response.data.access_token) {
        localStorage.setItem(AUTH_TOKEN, response.data.access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      }
      
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
      
      // Store the access token
      if (response.data.access_token) {
        localStorage.setItem(AUTH_TOKEN, response.data.access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      }
      
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
      // Only make logout request if we have a token
      const token = localStorage.getItem(AUTH_TOKEN);
      if (token) {
        await axios.post('/api/logout');
      }
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