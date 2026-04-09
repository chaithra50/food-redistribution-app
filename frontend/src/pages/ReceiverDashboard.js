import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Table, Badge } from 'react-bootstrap';
import { FaEye, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import FoodCard from '../components/FoodCard';
import { foodAPI, deliveryAPI } from '../utils/api';

const ReceiverDashboard = () => {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [claimedFoods, setClaimedFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await foodAPI.getAllFoods({ status: 'Available', limit: 100 });
      setFoods(response.data.foods);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch foods');
      setLoading(false);
    }
  };

  const handleClaim = async (foodId) => {
    try {
      setError('');
      await foodAPI.claimFood(foodId);
      setSuccess('Food claimed successfully!');
      setTimeout(() => {
        fetchData();
        setActiveTab('claimed');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to claim food');
    }
  };

  const stats = {
    available: foods.length,
    claimed: claimedFoods.length,
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Receiver Dashboard</h2>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      {/* Stats */}
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h5 className="text-muted">Available Foods</h5>
              <h3 className="text-success">{stats.available}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h5 className="text-muted">Claimed Foods</h5>
              <h3 className="text-info">{stats.claimed}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <div className="mb-4">
        <Button
          variant={activeTab === 'available' ? 'success' : 'outline-success'}
          onClick={() => setActiveTab('available')}
          className="me-2"
        >
          Available Foods
        </Button>
        <Button
          variant={activeTab === 'claimed' ? 'success' : 'outline-success'}
          onClick={() => setActiveTab('claimed')}
        >
          Claimed Foods
        </Button>
      </div>

      {/* Available Foods */}
      {activeTab === 'available' && (
        <>
          {loading ? (
            <p>Loading available foods...</p>
          ) : foods.length === 0 ? (
            <Alert variant="info">No foods available at the moment.</Alert>
          ) : (
            <Row>
              {foods.map(food => (
                <Col md={4} className="mb-4" key={food._id}>
                  <FoodCard
                    food={food}
                    onClaim={handleClaim}
                    showClaim={true}
                  />
                </Col>
              ))}
            </Row>
          )}
        </>
      )}

      {/* Claimed Foods */}
      {activeTab === 'claimed' && (
        <Card className="border-0 shadow-sm">
          <Card.Body>
            {claimedFoods.length === 0 ? (
              <Alert variant="info">You haven't claimed any foods yet.</Alert>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>Food Name</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Claimed Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {claimedFoods.map(food => (
                    <tr key={food._id}>
                      <td>{food.foodName}</td>
                      <td>{food.quantity} {food.unit}</td>
                      <td>
                        <Badge bg="info">{food.status}</Badge>
                      </td>
                      <td>{new Date(food.claimedAt).toLocaleDateString()}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => navigate(`/food/${food._id}`)}
                        >
                          <FaEye className="me-2" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default ReceiverDashboard;
