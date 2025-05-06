import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const RestaurantFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    name: '',
    day: '',
    time: ''
  });

  const daysOfWeek = [
    { value: '', label: 'Select Day' },
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters({
      name: '',
      day: '',
      time: ''
    });
    onFilterChange({});
  };

  return (
    <div className="filters-container">
      <h4 className="mb-3">Filter Restaurants</h4>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="name">
              <Form.Label>Restaurant Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Search by name"
                value={filters.name}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="day">
              <Form.Label>Day</Form.Label>
              <Form.Select
                name="day"
                value={filters.day}
                onChange={handleChange}
              >
                {daysOfWeek.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="time">
              <Form.Label>Time (24-hour format)</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={filters.time}
                onChange={handleChange}
                placeholder="e.g., 14:30"
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex justify-content-end">
          <Button variant="outline-secondary" type="button" onClick={handleReset} className="me-2">
            Reset
          </Button>
          <Button variant="primary" type="submit">
            Apply Filters
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default RestaurantFilter; 