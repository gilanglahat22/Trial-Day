import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RestaurantService from '../services/RestaurantService';

const AddRestaurantPage = () => {
  const [restaurantData, setRestaurantData] = useState({
    name: '',
    opening_hours: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('danger');

  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurantData({ ...restaurantData, [name]: value });
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!restaurantData.name || restaurantData.name.trim() === '') {
      newErrors.name = 'Restaurant name is required';
    }
    
    if (!restaurantData.opening_hours || restaurantData.opening_hours.trim() === '') {
      newErrors.opening_hours = 'Opening hours are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setAlertMessage('');
    
    try {
      await RestaurantService.createRestaurant(restaurantData);
      setAlertType('success');
      setAlertMessage('Restaurant added successfully!');
      
      // Reset form
      setRestaurantData({
        name: '',
        opening_hours: ''
      });
      
      // Redirect to home page after short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error adding restaurant:', error);
      setAlertType('danger');
      
      // Handle validation errors from the server
      if (error.response?.data?.errors) {
        const serverErrors = {};
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          serverErrors[key] = value[0]; // Take first error message for each field
        });
        setErrors(serverErrors);
      } else {
        setAlertMessage(
          error.response?.data?.message || 
          'Failed to add restaurant. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="page-container">
      <div className="auth-form">
        <div className="auth-header text-center mb-4">
          <div className="auth-icon mb-3">🏪</div>
          <h2 className="auth-title">Add New Restaurant</h2>
          <p className="auth-subtitle text-muted">Share a great dining spot with the community</p>
        </div>
        
        {alertMessage && (
          <Alert variant={alertType} className="mb-4">
            {alertMessage}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Restaurant Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={restaurantData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
              placeholder="Enter restaurant name"
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-4" controlId="opening_hours">
            <Form.Label>Opening Hours</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="opening_hours"
              value={restaurantData.opening_hours}
              onChange={handleChange}
              isInvalid={!!errors.opening_hours}
              placeholder="E.g., Mon-Fri 9 am - 10 pm / Sat-Sun 10 am - 11 pm"
            />
            <Form.Text className="text-muted">
              Format: Day(s) opening time - closing time, separate different schedules with /
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {errors.opening_hours}
            </Form.Control.Feedback>
          </Form.Group>
          
          <div className="d-flex gap-3 justify-content-center">
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate('/')}
              className="flex-fill"
            >
              ❌ Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
              className="flex-fill"
            >
              {loading ? '⏳ Adding...' : '✅ Add Restaurant'}
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default AddRestaurantPage; 