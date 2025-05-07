import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!credentials.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!credentials.password) {
      newErrors.password = 'Password is required';
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
      // For demo purposes, we'll use the credentials directly
      console.log("Logging in with:", credentials.email);
      
      await login(credentials);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      
      // Provide more helpful error message based on error type
      if (error.response?.status === 404) {
        setAlertMessage('The login service is not available right now. Please try again later.');
      } else if (error.response?.status === 422) {
        // Validation errors
        setAlertMessage(error.response.data.message || 'Invalid credentials. Please check your email and password.');
      } else if (error.response?.status === 401) {
        setAlertMessage('Invalid credentials. Please check your email and password.');
      } else {
        setAlertMessage(
          error.response?.data?.message || 
          'Login failed. Please check your credentials and try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // For demo purposes, add direct login buttons
  const handleDemoLogin = async (type) => {
    setLoading(true);
    setAlertMessage('');
    
    let demoCredentials = {
      email: type === 'admin' ? 'admin@example.com' : 'user@example.com',
      password: 'password'
    };
    
    try {
      console.log(`Logging in as demo ${type} user:`, demoCredentials.email);
      await login(demoCredentials);
      navigate('/');
    } catch (error) {
      console.error('Demo login error:', error);
      setAlertMessage(`Failed to log in as demo ${type}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="page-container">
      <div className="auth-form">
        <div className="auth-header text-center mb-4">
          <div className="auth-icon mb-3">🔐</div>
          <h2 className="auth-title">Welcome Back!</h2>
          <p className="auth-subtitle text-muted">Sign in to your account to continue</p>
        </div>
        
        {alertMessage && (
          <Alert variant="danger" className="mb-4">
            {alertMessage}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
              placeholder="Enter your email"
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-4" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
              placeholder="Enter your password"
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          
          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 mb-3" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          
          {/* Demo Login Buttons */}
          <div className="demo-section">
            <div className="demo-divider">
              <span className="demo-text">Quick Demo Access</span>
          </div>
          <div className="d-flex gap-2 mb-3">
            <Button
                variant="outline-success"
                className="w-50 demo-btn"
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
            >
                👑 Admin Demo
            </Button>
            <Button
                variant="outline-info"
                className="w-50 demo-btn"
              onClick={() => handleDemoLogin('user')}
              disabled={loading}
            >
                👤 User Demo
            </Button>
            </div>
          </div>
        </Form>
        
        <div className="mt-3 text-center">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </Container>
  );
};

export default LoginPage; 