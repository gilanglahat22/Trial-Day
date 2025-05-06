import axios from 'axios';

class RestaurantService {
  // Get all restaurants with optional filtering
  async getRestaurants(filters = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      console.log('RestaurantService: Fetching restaurants with filters:', filters);
      
      // Build query params for filtering
      const params = new URLSearchParams();
      
      if (filters.name) {
        params.append('name', filters.name);
      }
      
      if (filters.day) {
        params.append('day', filters.day);
      }
      
      if (filters.time) {
        params.append('time', filters.time);
      }
      
      const query = params.toString() ? `?${params.toString()}` : '';
      const url = `/api/restaurants${query}`;
      
      console.log('RestaurantService: Making request to:', url);
      
      // First try with plural 'restaurants' (correct API endpoint)
      try {
        const response = await axios.get(url, { 
          signal: controller.signal,
          timeout: 8000 
        });
        console.log('RestaurantService: Success! Got response:', response.data);
        
        // Ensure we return an array
        const data = response.data;
        if (Array.isArray(data)) {
          return data;
        } else if (data && typeof data === 'object' && Array.isArray(data.data)) {
          // Handle Laravel pagination response
          return data.data;
        } else {
          console.warn('RestaurantService: Unexpected data format, returning empty array');
          return [];
        }
      } catch (pluralError) {
        if (pluralError.name === 'AbortError') {
          throw new Error('Request timeout - please check your connection');
        }
        
        console.warn('Error with plural endpoint, trying singular:', pluralError);
        console.log('Error details:', {
          status: pluralError.response?.status,
          statusText: pluralError.response?.statusText,
          data: pluralError.response?.data,
          message: pluralError.message
        });
        
        // If that fails, try with singular 'restaurant' (fallback)
        const singularUrl = `/api/restaurant${query}`;
        console.log('RestaurantService: Trying singular endpoint:', singularUrl);
        const singularResponse = await axios.get(singularUrl, { 
          signal: controller.signal,
          timeout: 8000 
        });
        console.log('RestaurantService: Singular endpoint success:', singularResponse.data);
        
        const singularData = singularResponse.data;
        if (Array.isArray(singularData)) {
          return singularData;
        } else if (singularData && typeof singularData === 'object' && Array.isArray(singularData.data)) {
          return singularData.data;
        } else {
          console.warn('RestaurantService: Unexpected singular data format, returning empty array');
          return [];
        }
      }
    } catch (error) {
      console.error('RestaurantService: All endpoints failed. Final error:', error);
      console.log('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: error.config
      });
      
      // Return more specific error messages
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please check your connection');
      } else if (error.response?.status === 0) {
        throw new Error('Network error - unable to connect to server');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error - please try again later');
      } else {
        throw error;
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Get a single restaurant by ID
  async getRestaurant(id) {
    try {
      try {
        const response = await axios.get(`/api/restaurants/${id}`);
        return response.data;
      } catch (pluralError) {
        console.warn('Error with plural endpoint, trying singular:', pluralError);
        
        // If that fails, try with singular 'restaurant' (fallback)
        const singularResponse = await axios.get(`/api/restaurant/${id}`);
        return singularResponse.data;
      }
    } catch (error) {
      console.error(`Error fetching restaurant ${id}:`, error);
      throw error;
    }
  }

  // Create a new restaurant (admin only)
  async createRestaurant(restaurantData) {
    try {
      try {
        const response = await axios.post('/api/restaurants', restaurantData);
        return response.data;
      } catch (pluralError) {
        console.warn('Error with plural endpoint, trying singular:', pluralError);
        
        // If that fails, try with singular 'restaurant' (fallback)
        const singularResponse = await axios.post('/api/restaurant', restaurantData);
        return singularResponse.data;
      }
    } catch (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }
  }

  // Update an existing restaurant (admin only)
  async updateRestaurant(id, restaurantData) {
    try {
      try {
        const response = await axios.put(`/api/restaurants/${id}`, restaurantData);
        return response.data;
      } catch (pluralError) {
        console.warn('Error with plural endpoint, trying singular:', pluralError);
        
        // If that fails, try with singular 'restaurant' (fallback)
        const singularResponse = await axios.put(`/api/restaurant/${id}`, restaurantData);
        return singularResponse.data;
      }
    } catch (error) {
      console.error(`Error updating restaurant ${id}:`, error);
      throw error;
    }
  }

  // Delete a restaurant (admin only)
  async deleteRestaurant(id) {
    try {
      try {
        const response = await axios.delete(`/api/restaurants/${id}`);
        return response.data;
      } catch (pluralError) {
        console.warn('Error with plural endpoint, trying singular:', pluralError);
        
        // If that fails, try with singular 'restaurant' (fallback)
        const singularResponse = await axios.delete(`/api/restaurant/${id}`);
        return singularResponse.data;
      }
    } catch (error) {
      console.error(`Error deleting restaurant ${id}:`, error);
      throw error;
    }
  }
}

export default new RestaurantService(); 