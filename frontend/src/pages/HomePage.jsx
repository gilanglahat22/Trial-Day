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
        const data = await RestaurantService.getRestaurants(filters);
        setRestaurants(data);
        setError(null);
      } catch (err) {
        setError('Failed to load restaurants. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [filters]);

  // Handle filter changes from the filter component
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
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
      <h1 className="mb-4">Restaurant List</h1>
      
      <RestaurantFilter onFilterChange={handleFilterChange} />
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
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