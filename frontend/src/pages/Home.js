import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaLeaf, FaUsers, FaTruck, FaChartLine } from 'react-icons/fa';
import FoodCard from '../components/FoodCard';
import { foodAPI } from '../utils/api';
import { isAuthenticated, getUserRole } from '../utils/auth';

const Home = () => {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'Available',
    page: 1,
    limit: 6,
  });

  useEffect(() => {
    fetchFoods();
  }, [filters]);

  const fetchFoods = async () => {
    try {
      const response = await foodAPI.getAllFoods(filters);
      setFoods(response.data.foods);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching foods:', error);
      setLoading(false);
    }
  };

  const handleClaim = (foodId) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    navigate(`/food/${foodId}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-success text-white py-5">
        <Container className="text-center">
          <FaLeaf size={80} className="mb-3" />
          <h1 className="display-4 fw-bold">FoodLink</h1>
          <h2 className="h4 mb-4">Reducing Food Waste, Supporting Zero Hunger</h2>
          <p className="lead mb-4">
            Connect with donors, receivers, and volunteers to redistribute food and make a difference.
          </p>
          {!isAuthenticated() && (
            <div>
              <Button
                variant="light"
                size="lg"
                className="me-3 mb-2"
                onClick={() => navigate('/register')}
              >
                Join Us
              </Button>
              <Button
                variant="outline-light"
                size="lg"
                className="mb-2"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </div>
          )}
        </Container>
      </section>

      {/* Statistics Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center">
            <Col md={3} className="mb-3">
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <FaUsers size={40} className="text-success mb-3" />
                  <h3 className="h5">Active Users</h3>
                  <p className="text-muted">1000+</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <FaLeaf size={40} className="text-success mb-3" />
                  <h3 className="h5">Meals Saved</h3>
                  <p className="text-muted">5000+</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <FaTruck size={40} className="text-success mb-3" />
                  <h3 className="h5">Deliveries</h3>
                  <p className="text-muted">500+</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <FaChartLine size={40} className="text-success mb-3" />
                  <h3 className="h5">Impact</h3>
                  <p className="text-muted">Growing Daily</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Available Food Listings */}
      <section className="py-5">
        <Container>
          <h2 className="mb-4">
            <FaLeaf className="me-2 text-success" />
            Available Food Donations
          </h2>

          <Card className="mb-4 border-0 shadow-sm">
            <Card.Body>
              <Form>
                <Row>
                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>Food Type</Form.Label>
                      <Form.Select
                        name="foodType"
                        onChange={handleFilterChange}
                      >
                        <option value="">All Types</option>
                        <option value="Veg">Vegetarian</option>
                        <option value="Non-Veg">Non-Vegetarian</option>
                        <option value="Mixed">Mixed</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        placeholder="Search by location"
                        onChange={handleFilterChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                      >
                        <option value="Available">Available</option>
                        <option value="">All Status</option>
                        <option value="Claimed">Claimed</option>
                        <option value="Delivered">Delivered</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          {loading ? (
            <div className="text-center py-5">
              <p>Loading food donations...</p>
            </div>
          ) : foods.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FaLeaf size={40} className="mb-3" />
              <p>No food donations available at the moment.</p>
            </div>
          ) : (
            <Row>
              {foods.map(food => (
                <Col md={4} className="mb-4" key={food._id}>
                  <FoodCard
                    food={food}
                    onClaim={handleClaim}
                    showClaim={isAuthenticated() && getUserRole() === 'receiver'}
                  />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </div>
  );
};

export default Home;
