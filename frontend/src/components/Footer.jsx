import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer mt-auto">
      <Container>
        <Row>
          <Col className="text-center">
            <div className="mb-3">
              <span className="h5 fw-bold text-primary">🍽️ Restaurant Explorer</span>
            </div>
            <p className="mb-2 text-muted">
              Discover amazing restaurants and create unforgettable dining experiences
            </p>
            <p className="mb-0 small text-muted">
              &copy; {new Date().getFullYear()} Restaurant Explorer. Made with ❤️ for food lovers.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 