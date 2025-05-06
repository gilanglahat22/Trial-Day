import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Badge, ButtonGroup } from 'react-bootstrap';

const RestaurantFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    name: '',
    day: '',
    time: ''
  });
  const [currentTime, setCurrentTime] = useState('');
  const [currentDay, setCurrentDay] = useState('');

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

  const timePresets = [
    { label: 'Breakfast', time: '08:00', icon: '🥐' },
    { label: 'Lunch', time: '12:00', icon: '🍽️' },
    { label: 'Dinner', time: '19:00', icon: '🍷' },
    { label: 'Late Night', time: '22:00', icon: '🌙' }
  ];

  // Update current time and day
  useEffect(() => {
    const updateCurrentDateTime = () => {
      const now = new Date();
      const timeString = now.toTimeString().slice(0, 5); // HH:MM format
      const dayString = now.toLocaleDateString('en-US', { weekday: 'long' });
      
      setCurrentTime(timeString);
      setCurrentDay(dayString);
    };

    updateCurrentDateTime();
    const interval = setInterval(updateCurrentDateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // Auto-apply filters on change for better UX
    onFilterChange(newFilters);
  };

  const handlePresetTime = (time) => {
    const newFilters = { ...filters, time };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCurrentTime = () => {
    const newFilters = { 
      ...filters, 
      time: currentTime,
      day: currentDay 
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      name: '',
      day: '',
      time: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = filters.name || filters.day || filters.time;

  return (
    <div className="filters-container">
      <div className="filter-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="filter-title">🔍 Filter & Search Restaurants</h4>
            <p className="filter-subtitle text-muted">Find exactly what you're looking for</p>
          </div>
          <div className="current-time-info text-end">
            <Badge bg="info" className="me-2">
              📅 {currentDay}
            </Badge>
            <Badge bg="success">
              ⏰ {currentTime}
            </Badge>
          </div>
        </div>
      </div>
      
      <Form onSubmit={handleSubmit}>
        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <Form.Group controlId="name" className="filter-group">
              <Form.Label className="filter-label">
                <span className="label-icon">🏪</span>
                Restaurant Name
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Search by name..."
                value={filters.name}
                onChange={handleChange}
                className="filter-input"
              />
            </Form.Group>
          </Col>
          <Col md={4} className="mb-3">
            <Form.Group controlId="day" className="filter-group">
              <Form.Label className="filter-label">
                <span className="label-icon">📅</span>
                Day of Week
              </Form.Label>
              <Form.Select
                name="day"
                value={filters.day}
                onChange={handleChange}
                className="filter-input"
              >
                {daysOfWeek.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4} className="mb-3">
            <Form.Group controlId="time" className="filter-group">
              <Form.Label className="filter-label">
                <span className="label-icon">⏰</span>
                Preferred Time
              </Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={filters.time}
                onChange={handleChange}
                className="filter-input"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Time Presets */}
        <Row className="mb-4">
          <Col>
            <div className="time-presets">
              <Form.Label className="filter-label mb-2">
                <span className="label-icon">⚡</span>
                Quick Time Selection
              </Form.Label>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleCurrentTime}
                  className="preset-btn"
                >
                  🕐 Now ({currentTime})
                </Button>
                {timePresets.map((preset) => (
                  <Button
                    key={preset.time}
                    variant={filters.time === preset.time ? "primary" : "outline-secondary"}
                    size="sm"
                    onClick={() => handlePresetTime(preset.time)}
                    className="preset-btn"
                  >
                    {preset.icon} {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </Col>
        </Row>
        
        <div className="filter-actions">
          <div className="d-flex justify-content-between align-items-center">
            <div className="filter-status">
              {hasActiveFilters && (
                <Badge bg="primary" className="me-2">
                  {Object.values(filters).filter(Boolean).length} filter(s) active
                </Badge>
              )}
            </div>
            <div className="d-flex gap-2">
              {hasActiveFilters && (
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={handleReset}
                  className="filter-btn reset-btn"
                >
                  🔄 Clear All
                </Button>
              )}
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default RestaurantFilter; 