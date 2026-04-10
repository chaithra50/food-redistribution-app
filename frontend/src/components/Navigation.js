import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserRole, clearAuthData } from '../utils/auth';
import { FaLeaf, FaSignOutAlt } from 'react-icons/fa';

const Navigation = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const role = getUserRole();

  const handleLogout = () => {
    clearAuthData();
    navigate('/');
  };

  return (
    <Navbar bg="success" expand="lg" sticky="top" className="shadow">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-white">
          <FaLeaf className="me-2" />
          FoodLink
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="text-white">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/leaderboard" className="text-white">
              Leaderboard
            </Nav.Link>
            
            {authenticated && role === 'donor' && (
              <>
                <Nav.Link as={Link} to="/donor-dashboard" className="text-white">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/add-donation" className="text-white">
                  Add Donation
                </Nav.Link>
              </>
            )}

            {authenticated && role === 'receiver' && (
              <>
                <Nav.Link as={Link} to="/receiver-dashboard" className="text-white">
                  Dashboard
                </Nav.Link>
              </>
            )}

            {authenticated && role === 'volunteer' && (
              <>
                <Nav.Link as={Link} to="/volunteer-dashboard" className="text-white">
                  Dashboard
                </Nav.Link>
              </>
            )}

            {authenticated && role === 'admin' && (
              <>
                <Nav.Link as={Link} to="/admin-dashboard" className="text-white">
                  Admin Panel
                </Nav.Link>
              </>
            )}

            {authenticated ? (
              <Button
                variant="outline-light"
                size="sm"
                onClick={handleLogout}
                className="ms-2"
              >
                <FaSignOutAlt className="me-2" />
                Logout
              </Button>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-white">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="text-white">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
