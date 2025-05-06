import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true; // Needed for Laravel Sanctum

// Request interceptor for API calls
axios.interceptors.request.use(
  config => {
    // You can add authorization headers or other custom headers here
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

    // Handle session expiration (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Redirect to login page or refresh token logic could be implemented here
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
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