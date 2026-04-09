import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Table, Button, Badge, Tab, Tabs, Modal, Form } from 'react-bootstrap';
import { FaChartLine, FaUsers, FaApple, FaTruck } from 'react-icons/fa';
import { adminAPI } from '../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [verifyStatus, setVerifyStatus] = useState('verified');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [statsRes, usersRes, foodsRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getAllUsers(),
        adminAPI.getAllFoods(),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data.users);
      setFoods(foodsRes.data.foods);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const handleVerifyUser = async () => {
    try {
      await adminAPI.verifyUser(selectedUser._id, { status: verifyStatus });
      setSuccess('User status updated');
      setShowVerifyModal(false);
      fetchAllData();
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  const handleRemoveFood = async (id) => {
    if (window.confirm('Are you sure you want to delete this food?')) {
      try {
        await adminAPI.removeFood(id);
        setSuccess('Food removed');
        fetchAllData();
      } catch (err) {
        setError('Failed to remove food');
      }
    }
  };

  const handleRemoveUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.removeUser(id);
        setSuccess('User removed');
        fetchAllData();
      } catch (err) {
        setError('Failed to remove user');
      }
    }
  };

  if (loading) return <Container className="py-4"><p>Loading dashboard...</p></Container>;

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">
        <FaChartLine className="me-2" />
        Admin Dashboard
      </h2>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      {/* Statistics */}
      {stats && (
        <>
          <Row className="mb-4">
            <Col md={3} className="mb-3">
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center">
                  <FaUsers size={30} className="text-success mb-2" />
                  <h5 className="text-muted">Total Users</h5>
                  <h3 className="text-success">{stats.totalUsers}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center">
                  <FaApple size={30} className="text-success mb-2" />
                  <h5 className="text-muted">Food Listings</h5>
                  <h3 className="text-success">{stats.foodStatistics.total}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center">
                  <FaTruck size={30} className="text-success mb-2" />
                  <h5 className="text-muted">Deliveries</h5>
                  <h3 className="text-success">{stats.deliveryStatistics.total}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center">
                  <FaChartLine size={30} className="text-success mb-2" />
                  <h5 className="text-muted">Meals Saved</h5>
                  <h3 className="text-success">{stats.impact.totalMealsSaved}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* User Breakdown */}
          <Row className="mb-4">
            <Col md={12}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h5 className="mb-3">User Distribution</h5>
                  <Row className="text-center">
                    <Col md={3}>
                      <p className="text-muted">Donors</p>
                      <h4 className="text-success">{stats.userBreakdown.donors}</h4>
                    </Col>
                    <Col md={3}>
                      <p className="text-muted">Receivers</p>
                      <h4 className="text-info">{stats.userBreakdown.receivers}</h4>
                    </Col>
                    <Col md={3}>
                      <p className="text-muted">Volunteers</p>
                      <h4 className="text-warning">{stats.userBreakdown.volunteers}</h4>
                    </Col>
                    <Col md={3}>
                      <p className="text-muted">Delivered Foods</p>
                      <h4 className="text-success">{stats.foodStatistics.delivered}</h4>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Tabs for Users and Foods */}
      <Tabs defaultActiveKey="users" className="mb-4">
        {/* Users Tab */}
        <Tab eventKey="users" title="Users Management">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              {users.length === 0 ? (
                <Alert variant="info">No users found.</Alert>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>City</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <Badge bg={
                            user.role === 'donor' ? 'success' :
                            user.role === 'receiver' ? 'info' :
                            user.role === 'volunteer' ? 'warning' : 'secondary'
                          }>
                            {user.role}
                          </Badge>
                        </td>
                        <td>{user.phone}</td>
                        <td>{user.city}</td>
                        <td>
                          <Badge bg={
                            user.verificationStatus === 'verified' ? 'success' :
                            user.verificationStatus === 'pending' ? 'warning' : 'danger'
                          }>
                            {user.verificationStatus}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => {
                              setSelectedUser(user);
                              setVerifyStatus(user.verificationStatus);
                              setShowVerifyModal(true);
                            }}
                          >
                            Verify
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveUser(user._id)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>

        {/* Foods Tab */}
        <Tab eventKey="foods" title="Food Listings">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              {foods.length === 0 ? (
                <Alert variant="info">No food listings found.</Alert>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Food Name</th>
                      <th>Donor</th>
                      <th>Quantity</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Location</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foods.map(food => (
                      <tr key={food._id}>
                        <td>{food.foodName}</td>
                        <td>{food.donor.name}</td>
                        <td>{food.quantity} {food.unit}</td>
                        <td>
                          <Badge bg={
                            food.foodType === 'Veg' ? 'success' :
                            food.foodType === 'Non-Veg' ? 'danger' : 'warning'
                          }>
                            {food.foodType}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={
                            food.status === 'Available' ? 'success' :
                            food.status === 'Claimed' ? 'warning' :
                            food.status === 'Delivered' ? 'info' : 'secondary'
                          }>
                            {food.status}
                          </Badge>
                        </td>
                        <td>{food.location}</td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveFood(food._id)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Verify Modal */}
      <Modal show={showVerifyModal} onHide={() => setShowVerifyModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Verify User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={verifyStatus}
                  onChange={(e) => setVerifyStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVerifyModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleVerifyUser}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
