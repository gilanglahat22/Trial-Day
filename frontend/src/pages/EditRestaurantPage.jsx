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
        console.log('EditRestaurantPage: Fetching restaurant with ID:', id);
        const response = await RestaurantService.getRestaurant(id);
        console.log('EditRestaurantPage: Received restaurant data:', response);
        
        // Handle both direct data and wrapped data response
        const data = response.data || response;
        
        console.log('EditRestaurantPage: Setting form data:', {
          name: data.name,
          opening_hours: data.opening_hours
        });
        
        setRestaurantData({
          name: data.name || '',
          opening_hours: data.opening_hours || ''
        });
        
        setAlertType('info');
        setAlertMessage(`Loaded data for "${data.name}". You can now edit the information below.`);
        
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
    return (
      <Container className="page-container">
        <div className="auth-form">
          <div className="auth-header text-center mb-4">
            <div className="auth-icon mb-3">✏️</div>
            <h2 className="auth-title">Edit Restaurant</h2>
            <p className="auth-subtitle text-muted">Loading restaurant data...</p>
          </div>
          <LoadingSpinner />
        </div>
      </Container>
    );
  }

  return (
    <Container className="page-container">
      <div className="auth-form">
        <div className="auth-header text-center mb-4">
          <div className="auth-icon mb-3">✏️</div>
          <h2 className="auth-title">Edit Restaurant</h2>
          <p className="auth-subtitle text-muted">Update restaurant information</p>
        </div>
        
        {alertMessage && (
          <Alert variant={alertType} className="mb-4">
            {alertMessage}
          </Alert>
        )}
        
        {!loading && restaurantData.name && (
          <Alert variant="light" className="mb-4">
            <h6 className="mb-2">📋 Original Data (for reference):</h6>
            <div className="small">
              <strong>Name:</strong> {restaurantData.name}<br/>
              <strong>Opening Hours:</strong> {restaurantData.opening_hours}
            </div>
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
              className={restaurantData.name ? 'border-info' : ''}
            />
            {restaurantData.name && (
              <Form.Text className="text-info">
                ✓ Current value loaded. You can edit this field.
              </Form.Text>
            )}
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
              className={restaurantData.opening_hours ? 'border-info' : ''}
            />
            {restaurantData.opening_hours && (
              <Form.Text className="text-info">
                ✓ Current value loaded. You can edit this field.
              </Form.Text>
            )}
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
              disabled={submitting}
              className="flex-fill"
            >
              {submitting ? '⏳ Updating...' : '💾 Update Restaurant'}
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default EditRestaurantPage; 