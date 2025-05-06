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
      const response = await axios.get(`/api/restaurants${query}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
  }

  // Get a single restaurant by ID
  async getRestaurant(id) {
    try {
      const response = await axios.get(`/api/restaurants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching restaurant ${id}:`, error);
      throw error;
    }
  }

  // Create a new restaurant (admin only)
  async createRestaurant(restaurantData) {
    try {
      const response = await axios.post('/api/restaurants', restaurantData);
      return response.data;
    } catch (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }
  }

  // Update an existing restaurant (admin only)
  async updateRestaurant(id, restaurantData) {
    try {
      const response = await axios.put(`/api/restaurants/${id}`, restaurantData);
      return response.data;
    } catch (error) {
      console.error(`Error updating restaurant ${id}:`, error);
      throw error;
    }
  }

  // Delete a restaurant (admin only)
  async deleteRestaurant(id) {
    try {
      const response = await axios.delete(`/api/restaurants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting restaurant ${id}:`, error);
      throw error;
    }
  }
}

export default new RestaurantService(); 