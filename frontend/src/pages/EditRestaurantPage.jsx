import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RestaurantService from '../services/RestaurantService';
import LoadingSpinner from '../components/LoadingSpinner';

const EditRestaurantPage = () => {
  const [restaurantData, setRestaurantData] = useState({
    name: '',
    opening_hours: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('danger');

  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  // Load restaurant data and redirect if not admin
  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!isAdmin()) {
        navigate('/');
        return;
      }

      try {
        const data = await RestaurantService.getRestaurant(id);
        setRestaurantData({
          name: data.name,
          opening_hours: data.opening_hours
        });
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        setAlertType('danger');
        setAlertMessage('Failed to load restaurant data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, isAdmin, navigate]);

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
    
    setSubmitting(true);
    setAlertMessage('');
    
    try {
      await RestaurantService.updateRestaurant(id, restaurantData);
      setAlertType('success');
      setAlertMessage('Restaurant updated successfully!');
      
      // Redirect to home page after short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error updating restaurant:', error);
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
          'Failed to update restaurant. Please try again.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container className="page-container">
      <div className="auth-form">
        <h2 className="text-center mb-4">Edit Restaurant</h2>
        
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
          
          <div className="d-flex justify-content-between">
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update Restaurant'}
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default EditRestaurantPage; 