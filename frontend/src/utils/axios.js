import axios from 'axios';

// Configure axios defaults
// In development, we'll use relative URLs to leverage Vite's proxy
// In production, we can use the VITE_API_URL from environment variables if needed
const baseURL = import.meta.env.VITE_API_URL || '';
console.log('Axios configuration - Base URL:', baseURL);

axios.defaults.baseURL = baseURL;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true; // Needed for Laravel Sanctum

// Set up authorization header from stored token on initial load
const storedToken = localStorage.getItem('auth_token');
if (storedToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
}

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
      
      // Clear stored user data and token
        localStorage.removeItem('user_data');
      localStorage.removeItem('auth_token');
      delete axios.defaults.headers.common['Authorization'];
        
      // Only redirect to login if we're not already on login/register pages
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
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