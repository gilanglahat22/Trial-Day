import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RestaurantCard = ({ restaurant, onDelete }) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // Format opening hours for display
  const formatOpeningHours = (hours) => {
    return hours.split('/').map((slot, index) => (
      <div key={index} className="mb-1">
        <span className="time-slot">🕒 {slot.trim()}</span>
      </div>
    ));
  };

  // Get random gradient for card variety
  const gradients = [
    'var(--primary-gradient)',
    'var(--blue-gradient)', 
    'var(--pink-gradient)',
    'var(--green-gradient)',
    'var(--orange-gradient)'
  ];
  const cardGradient = gradients[restaurant.id % gradients.length];

  return (
    <Card className="restaurant-card h-100">
      <div className="card-header-gradient" style={{ background: cardGradient }}>
        <div className="restaurant-icon">🍽️</div>
        <div className="card-number">#{restaurant.id}</div>
      </div>
      <Card.Body className="d-flex flex-column">
        <div className="flex-grow-1">
          <Card.Title className="restaurant-name">
            {restaurant.name}
          </Card.Title>
          
          <div className="restaurant-meta mb-3">
            <div className="meta-item">
              <Badge bg="light" text="dark" className="meta-badge">
                <span className="meta-icon">⏰</span>
                <span className="meta-label">Opening Hours</span>
              </Badge>
            </div>
          </div>
          
          <Card.Text className="opening-hours">
            {formatOpeningHours(restaurant.opening_hours)}
          </Card.Text>
        </div>
        
        {isAdmin() && (
          <div className="card-actions mt-auto pt-3">
            <div className="d-flex gap-2">
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="flex-fill action-btn edit-btn"
                onClick={() => navigate(`/edit-restaurant/${restaurant.id}`)}
              >
                <span className="btn-icon">✏️</span>
                <span className="btn-text">Edit</span>
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm"
                className="flex-fill action-btn delete-btn"
                onClick={() => onDelete(restaurant.id)}
              >
                <span className="btn-icon">🗑️</span>
                <span className="btn-text">Delete</span>
              </Button>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default RestaurantCard; 