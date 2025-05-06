import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

const LoadingSpinner = () => {
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '300px' }}>
      <div className="loading-container text-center">
        <div className="loading-icon mb-4">🍽️</div>
        <Spinner animation="border" role="status" variant="primary" className="mb-4">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mb-0">Loading amazing restaurants for you...</p>
        <div className="loading-dots mt-2">
          <span>•</span>
          <span>•</span>
          <span>•</span>
        </div>
      </div>
    </Container>
  );
};

export default LoadingSpinner; 