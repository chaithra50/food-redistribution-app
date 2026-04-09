import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Table, Badge, Modal, Form } from 'react-bootstrap';
import { FaCheck, FaTruck, FaMapMarkerAlt } from 'react-icons/fa';
import { deliveryAPI } from '../utils/api';

const VolunteerDashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [acceptedDeliveries, setAcceptedDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('available');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await deliveryAPI.getVolunteerTasks();
      const pending = response.data.filter(d => d.status === 'Pending');
      const accepted = response.data.filter(d => d.status !== 'Pending' && d.status !== 'Cancelled');
      setDeliveries(pending);
      setAcceptedDeliveries(accepted);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch deliveries');
      setLoading(false);
    }
  };

  const handleAcceptDelivery = async (id) => {
    try {
      await deliveryAPI.acceptDelivery(id);
      setSuccess('Delivery accepted!');
      setTimeout(() => {
        fetchDeliveries();
      }, 1500);
    } catch (err) {
      setError('Failed to accept delivery');
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await deliveryAPI.updateDeliveryStatus(selectedDelivery._id, { status: newStatus });
      setSuccess(`Status updated to ${newStatus}`);
      setShowStatusModal(false);
      setTimeout(() => {
        fetchDeliveries();
      }, 1500);
    } catch (err) {
      setError('Failed to update delivery status');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      Pending: 'secondary',
      Accepted: 'info',
      PickedUp: 'warning',
      Delivered: 'success',
      Cancelled: 'danger',
    };
    return colors[status] || 'secondary';
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">
        <FaTruck className="me-2" />
        Volunteer Dashboard
      </h2>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      {/* Stats */}
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h5 className="text-muted">Available Tasks</h5>
              <h3 className="text-success">{deliveries.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h5 className="text-muted">My Deliveries</h5>
              <h3 className="text-info">{acceptedDeliveries.length}</h3>
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
          Available Tasks
        </Button>
        <Button
          variant={activeTab === 'accepted' ? 'success' : 'outline-success'}
          onClick={() => setActiveTab('accepted')}
        >
          My Deliveries
        </Button>
      </div>

      {/* Available Deliveries */}
      {activeTab === 'available' && (
        <Card className="border-0 shadow-sm">
          <Card.Body>
            {loading ? (
              <p>Loading deliveries...</p>
            ) : deliveries.length === 0 ? (
              <Alert variant="info">No delivery tasks available at the moment.</Alert>
            ) : (
              <Table responsive>
                <thead>
                  <tr>
                    <th>Food</th>
                    <th>Quantity</th>
                    <th>Pickup Location</th>
                    <th>Delivery Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map(delivery => (
                    <tr key={delivery._id}>
                      <td>{delivery.food?.foodName}</td>
                      <td>{delivery.food?.quantity} {delivery.food?.unit}</td>
                      <td>
                        <FaMapMarkerAlt className="me-1" />
                        {delivery.pickupLocation}
                      </td>
                      <td>
                        <FaMapMarkerAlt className="me-1" />
                        {delivery.deliveryLocation}
                      </td>
                      <td>
                        <Badge bg={getStatusBadge(delivery.status)}>
                          {delivery.status}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleAcceptDelivery(delivery._id)}
                        >
                          <FaCheck className="me-1" />
                          Accept
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

      {/* Accepted Deliveries */}
      {activeTab === 'accepted' && (
        <Card className="border-0 shadow-sm">
          <Card.Body>
            {acceptedDeliveries.length === 0 ? (
              <Alert variant="info">You haven't accepted any deliveries yet.</Alert>
            ) : (
              <Table responsive>
                <thead>
                  <tr>
                    <th>Food</th>
                    <th>Quantity</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {acceptedDeliveries.map(delivery => (
                    <tr key={delivery._id}>
                      <td>{delivery.food?.foodName}</td>
                      <td>{delivery.food?.quantity} {delivery.food?.unit}</td>
                      <td>
                        <small>{delivery.donor?.name}</small>
                        <br />
                        <small className="text-muted">{delivery.pickupLocation}</small>
                      </td>
                      <td>
                        <small>{delivery.receiver?.name}</small>
                        <br />
                        <small className="text-muted">{delivery.deliveryLocation}</small>
                      </td>
                      <td>
                        <Badge bg={getStatusBadge(delivery.status)}>
                          {delivery.status}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            setSelectedDelivery(delivery);
                            setNewStatus(delivery.status);
                            setShowStatusModal(true);
                          }}
                        >
                          Update Status
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

      {/* Status Update Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Delivery Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>New Status</Form.Label>
            <Form.Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option value="Accepted">Accepted</option>
              <option value="PickedUp">Picked Up</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleUpdateStatus}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default VolunteerDashboard;
