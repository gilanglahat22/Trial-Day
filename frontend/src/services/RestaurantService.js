import axios from 'axios';

class RestaurantService {
  // Get all restaurants with optional filtering
  async getRestaurants(filters = {}) {
    try {
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
      
      // First try with plural 'restaurants' (correct API endpoint)
      try {
        const response = await axios.get(`/api/restaurants${query}`);
        return response.data;
      } catch (pluralError) {
        console.warn('Error with plural endpoint, trying singular:', pluralError);
        
        // If that fails, try with singular 'restaurant' (fallback)
        const singularResponse = await axios.get(`/api/restaurant${query}`);
        return singularResponse.data;
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
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