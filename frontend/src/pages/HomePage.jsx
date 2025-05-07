import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Modal, Button } from 'react-bootstrap';
import RestaurantCard from '../components/RestaurantCard';
import RestaurantFilter from '../components/RestaurantFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import RestaurantService from '../services/RestaurantService';

const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);
  
  const { isAdmin } = useAuth();

  // Load restaurants on component mount and when filters change
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        console.log('HomePage: Starting to fetch restaurants...');
        
        const data = await RestaurantService.getRestaurants(filters);
        console.log('HomePage: Received restaurant data:', data);
        console.log('HomePage: Data type:', typeof data);
        console.log('HomePage: Is array:', Array.isArray(data));
        
        if (Array.isArray(data)) {
        setRestaurants(data);
        setError(null);
          console.log('HomePage: Successfully set restaurants:', data.length, 'items');
        } else {
          console.error('HomePage: Data is not an array:', data);
          setError('Invalid data format received from server.');
        }
      } catch (err) {
        console.error('HomePage: Error in fetchRestaurants:', err);
        console.log('HomePage: Error details:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          config: err.config
        });
        
        // Set more specific error message
        if (err.message.includes('timeout')) {
          setError('Request timeout. Please check your internet connection and try again.');
        } else if (err.message.includes('Network error')) {
          setError('Unable to connect to server. Please try again later.');
        } else {
        setError('Failed to load restaurants. Please try again later.');
        }
        
        // As a last resort, set an empty array so the app doesn't crash
        setRestaurants([]);
      } finally {
        setLoading(false);
        console.log('HomePage: Finished loading');
      }
    };

    fetchRestaurants();
  }, [filters]);

  // Handle filter changes from the filter component
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  // Manual retry function
  const handleRetry = () => {
    setError(null);
    setFilters({}); // This will trigger useEffect to refetch
  };

  // Confirm delete modal handlers
  const handleDeleteClick = (id) => {
    setRestaurantToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await RestaurantService.deleteRestaurant(restaurantToDelete);
      setRestaurants(restaurants.filter(r => r.id !== restaurantToDelete));
      setShowDeleteModal(false);
    } catch (err) {
      setError('Failed to delete restaurant. Please try again.');
      console.error(err);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRestaurantToDelete(null);
  };

  return (
    <Container className="page-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="page-title">Discover Amazing Restaurants</h1>
          <p className="hero-subtitle">Find the perfect dining experience for any occasion</p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{restaurants.length}</span>
              <span className="stat-label">Restaurants</span>
            </div>
            <div className="stat-divider">•</div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Available</span>
            </div>
            <div className="stat-divider">•</div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Verified</span>
            </div>
          </div>
        </div>
      </div>
      
      <RestaurantFilter onFilterChange={handleFilterChange} />
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <Alert variant="danger">
          <div className="d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <Button variant="outline-danger" size="sm" onClick={handleRetry}>
              🔄 Retry
            </Button>
          </div>
        </Alert>
      ) : restaurants.length === 0 ? (
        <Alert variant="info">
          No restaurants found. {filters.name || filters.day || filters.time ? 'Try changing your filters.' : ''}
        </Alert>
      ) : (
        <Row>
          {restaurants.map(restaurant => (
            <Col key={restaurant.id} lg={4} md={6} sm={12} className="mb-4">
              <RestaurantCard 
                restaurant={restaurant} 
                onDelete={handleDeleteClick} 
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this restaurant? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default HomePage; 