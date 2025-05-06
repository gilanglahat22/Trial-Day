import axios from 'axios';

// Configure axios defaults
// In development, we'll use relative URLs to leverage Vite's proxy
// In production, we can use the VITE_API_URL from environment variables if needed
axios.defaults.baseURL = '';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true; // Needed for Laravel Sanctum

// Add request logging for debugging
axios.interceptors.request.use(
  config => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
axios.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    
    console.error('API Error:', error.response?.status, error.response?.data || error.message);

    // Handle session expiration (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Check if user data exists in localStorage
        const userData = localStorage.getItem('user_data');
        
        if (!userData) {
          // No stored user data, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Try the request again
        return axios(originalRequest);
      } catch (retryError) {
        // Clear stored user data
        localStorage.removeItem('user_data');
        
        // Redirect to login page
        window.location.href = '/login';
        return Promise.reject(retryError);
      }
    }

    // Handle forbidden access (403)
    if (error.response?.status === 403) {
      console.error('Access forbidden');
      // Additional handling like notifications could be added here
    }

    return Promise.reject(error);
  }
);

export default axios; 