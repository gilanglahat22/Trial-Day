import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RestaurantCard = ({ restaurant, onDelete }) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // Format opening hours for display
  const formatOpeningHours = (hours) => {
    return hours.split('/').map((slot, index) => (
      <div key={index} className="mb-1">
        {slot.trim()}
      </div>
    ));
  };

  return (
    <Card className="restaurant-card mb-4">
      <Card.Body>
        <Card.Title>{restaurant.name}</Card.Title>
        <Card.Subtitle className="mb-3 text-muted">Opening Hours</Card.Subtitle>
        <Card.Text className="small">
          {formatOpeningHours(restaurant.opening_hours)}
        </Card.Text>
        
        {isAdmin() && (
          <div className="d-flex justify-content-end mt-3">
            <Button 
              variant="outline-primary" 
              size="sm" 
              className="me-2"
              onClick={() => navigate(`/edit-restaurant/${restaurant.id}`)}
            >
              Edit
            </Button>
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={() => onDelete(restaurant.id)}
            >
              Delete
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default RestaurantCard; 