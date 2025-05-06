import React, { useState, useEffect } from 'react';
import { Navbar as BsNavbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <BsNavbar bg="light" variant="light" expand="lg" className={`navbar mb-0 ${scrolled ? 'scrolled' : ''}`} fixed="top">
      <Container>
        <BsNavbar.Brand as={Link} to="/" className="navbar-brand">
          🍽️ Restaurant Explorer
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="nav-link-modern">
              🏠 Home
            </Nav.Link>
            {isAdmin() && (
              <Nav.Link as={Link} to="/add-restaurant" className="nav-link-modern">
                ➕ Add Restaurant
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-primary" id="dropdown-basic" className="user-dropdown">
                  👤 {user.name} {isAdmin() ? '(Admin)' : ''}
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-modern">
                  <Dropdown.Item as="div" className="text-center text-muted dropdown-header">
                    <small>Signed in as</small>
                    <div className="fw-bold text-primary">{user.email}</div>
                    <div className="badge bg-gradient text-white mt-1">
                      {isAdmin() ? 'Administrator' : 'User'}
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="logout-item">
                    🚪 Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="d-flex gap-2">
                <Button as={Link} to="/login" variant="outline-primary" size="sm">
                  🔑 Login
                </Button>
                <Button as={Link} to="/register" variant="primary" size="sm">
                  📝 Register
                </Button>
              </div>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar; 