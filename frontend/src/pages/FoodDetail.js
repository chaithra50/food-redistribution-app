import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge, Image } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaLeaf } from 'react-icons/fa';
import { foodAPI } from '../utils/api';
import { isAuthenticated, getUserRole } from '../utils/auth';

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    fetchFood();
  }, [id]);

  const fetchFood = async () => {
    try {
      const response = await foodAPI.getFoodById(id);
      setFood(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch food details');
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    setClaiming(true);
    try {
      await foodAPI.claimFood(id);
      setSuccess('Food claimed successfully! Check your dashboard to track the delivery.');
      setTimeout(() => {
        navigate('/receiver-dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to claim food');
      setClaiming(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Available: 'success',
      Claimed: 'warning',
      PickedUp: 'info',
      Delivered: 'secondary',
      Expired: 'danger',
    };
    return colors[status] || 'secondary';
  };

  const getTypeColor = (type) => {
    const colors = {
      Veg: 'success',
      'Non-Veg': 'danger',
      Mixed: 'warning',
    };
    return colors[type] || 'secondary';
  };

  if (loading) {
    return (
      <Container className="py-4">
        <p>Loading food details...</p>
      </Container>
    );
  }

  if (!food) {
    return (
      <Container className="py-4">
        <Alert variant="danger">Food not found</Alert>
        <Button onClick={() => navigate('/')} variant="outline-primary">
          <FaArrowLeft className="me-2" />
          Back to Home
        </Button>
      </Container>
    );
  }

  const isExpired = new Date(food.expiryTime) < new Date();

  return (
    <Container className="py-4">
      <Button
        variant="outline-secondary"
        className="mb-4"
        onClick={() => navigate('/')}
      >
        <FaArrowLeft className="me-2" />
        Back to Listings
      </Button>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      <Row>
        {/* Image Section */}
        <Col md={6} className="mb-4">
          {food.imageUrl ? (
            <Image src={food.imageUrl} alt={food.foodName} fluid rounded className="shadow" />
          ) : (
            <div
              className="bg-light rounded shadow d-flex align-items-center justify-content-center"
              style={{ height: '400px' }}
            >
              <FaLeaf size={80} className="text-success opacity-50" />
            </div>
          )}
        </Col>

        {/* Details Section */}
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              {/* Title and Status */}
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h2>{food.foodName}</h2>
                <Badge bg={getStatusColor(food.status)} className="mt-2">
                  {food.status}
                </Badge>
              </div>

              {/* Type and Quantity */}
              <div className="mb-3">
                <Badge bg={getTypeColor(food.foodType)} className="me-2">
                  {food.foodType}
                </Badge>
                <Badge bg="light" text="dark">
                  {food.quantity} {food.unit}
                </Badge>
              </div>

              {/* Description */}
              {food.description && (
                <Card className="mb-3 border-0 bg-light">
                  <Card.Body>
                    <h6>Description</h6>
                    <p className="mb-0">{food.description}</p>
                  </Card.Body>
                </Card>
              )}

              {/* Key Details */}
              <Card className="mb-3 border-0 bg-light">
                <Card.Body>
                  <h6 className="mb-3">Details</h6>
                  <div className="mb-2">
                    <strong>
                      <FaClock className="me-2 text-success" />
                      Cooked Time:
                    </strong>
                    <p className="mb-0">{new Date(food.cookedTime).toLocaleString()}</p>
                  </div>
                  <div className="mb-2">
                    <strong>
                      <FaClock className="me-2 text-danger" />
                      Expiry Time:
                    </strong>
                    <p className="mb-0">
                      {new Date(food.expiryTime).toLocaleString()}
                      {isExpired && (
                        <Badge bg="danger" className="ms-2">EXPIRED</Badge>
                      )}
                    </p>
                  </div>
                </Card.Body>
              </Card>

              {/* Location */}
              <Card className="mb-3 border-0 bg-light">
                <Card.Body>
                  <h6 className="mb-2">
                    <FaMapMarkerAlt className="me-2 text-success" />
                    Pickup Location
                  </h6>
                  <p className="mb-0">{food.location}</p>
                </Card.Body>
              </Card>

              {/* Donor Information */}
              {food.donor && (
                <Card className="mb-3 border-0 bg-light">
                  <Card.Body>
                    <h6>From</h6>
                    <p className="mb-1">
                      <strong>{food.donor.name}</strong>
                    </p>
                    {food.donor.organizationName && (
                      <p className="mb-1 text-muted">{food.donor.organizationName}</p>
                    )}
                    <p className="mb-0 small text-muted">
                      📍 {food.donor.address} <br />
                      📞 {food.donor.phone}
                    </p>
                  </Card.Body>
                </Card>
              )}

              {/* Claimed By */}
              {food.claimedBy && (
                <Card className="mb-3 border-0 bg-light">
                  <Card.Body>
                    <h6>Claimed By</h6>
                    <p className="mb-0">
                      <strong>{food.claimedBy.name}</strong> ({food.claimedBy.email})
                    </p>
                  </Card.Body>
                </Card>
              )}

              {/* Actions */}
              {isAuthenticated() && getUserRole() === 'receiver' && food.status === 'Available' && !isExpired && (
                <div className="d-grid">
                  <Button
                    variant="success"
                    size="lg"
                    onClick={handleClaim}
                    disabled={claiming}
                  >
                    <FaLeaf className="me-2" />
                    {claiming ? 'Claiming...' : 'Claim This Food'}
                  </Button>
                </div>
              )}

              {(!isAuthenticated() || getUserRole() !== 'receiver') && (
                <Alert variant="info" className="mb-0">
                  <strong>Want to claim this food?</strong>
                  {!isAuthenticated() ? (
                    <div className="mt-2">
                      Please <Button variant="link" className="p-0" onClick={() => navigate('/login')}>login</Button> or <Button variant="link" className="p-0" onClick={() => navigate('/register')}>register</Button> as a Receiver.
                    </div>
                  ) : (
                    <p className="mb-0 mt-2">Only receivers can claim food donations.</p>
                  )}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FoodDetail;
