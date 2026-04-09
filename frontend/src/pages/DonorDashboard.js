import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Modal, Table } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import FoodCard from '../components/FoodCard';
import { foodAPI } from '../utils/api';

const DonorDashboard = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
    unit: 'plates',
    foodType: 'Veg',
    cookedTime: '',
    expiryTime: '',
    description: '',
    location: '',
    image: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await foodAPI.getDonorDonations();
      setDonations(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch donations');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({
        ...prev,
        image: files[0],
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'image' || formData.image) {
          data.append(key, formData[key]);
        }
      });

      await foodAPI.addDonation(data);
      setSuccess('Food donation added successfully!');
      setFormData({
        foodName: '',
        quantity: '',
        unit: 'plates',
        foodType: 'Veg',
        cookedTime: '',
        expiryTime: '',
        description: '',
        location: '',
        image: null,
      });
      setShowForm(false);
      fetchDonations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add donation');
    }
  };

  const handleDelete = async () => {
    try {
      await foodAPI.deleteDonation(deletingId);
      setSuccess('Donation deleted successfully');
      setShowDeleteModal(false);
      fetchDonations();
    } catch (err) {
      setError('Failed to delete donation');
    }
  };

  const filteredDonations = filter === 'all' 
    ? donations 
    : donations.filter(d => d.status === filter);

  const stats = {
    total: donations.length,
    available: donations.filter(d => d.status === 'Available').length,
    claimed: donations.filter(d => d.status === 'Claimed').length,
    delivered: donations.filter(d => d.status === 'Delivered').length,
  };

  const getStatusStats = () => {
    let totalQuantity = 0;
    donations.forEach(d => {
      if (d.status === 'Delivered') {
        totalQuantity += d.quantity;
      }
    });
    return totalQuantity;
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Donor Dashboard</h2>
        <Button
          variant="success"
          onClick={() => setShowForm(!showForm)}
        >
          <FaPlus className="me-2" />
          Add Donation
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      {/* Stats */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h5 className="text-muted">Total Donations</h5>
              <h3 className="text-success">{stats.total}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h5 className="text-muted">Available</h5>
              <h3 className="text-info">{stats.available}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h5 className="text-muted">Claimed</h5>
              <h3 className="text-warning">{stats.claimed}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <h5 className="text-muted">Delivered</h5>
              <h3 className="text-success">{getStatusStats()} units</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Donation Form */}
      {showForm && (
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <h5>Add New Food Donation</h5>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Food Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="foodName"
                      value={formData.foodName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Unit</Form.Label>
                    <Form.Select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                    >
                      <option value="kg">Kilograms (kg)</option>
                      <option value="liters">Liters</option>
                      <option value="plates">Plates</option>
                      <option value="portions">Portions</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Food Type</Form.Label>
                    <Form.Select
                      name="foodType"
                      value={formData.foodType}
                      onChange={handleChange}
                    >
                      <option value="Veg">Vegetarian</option>
                      <option value="Non-Veg">Non-Vegetarian</option>
                      <option value="Mixed">Mixed</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Cooked Time</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="cookedTime"
                      value={formData.cookedTime}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Expiry Time</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="expiryTime"
                      value={formData.expiryTime}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Pickup location"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the food condition, ingredients, etc."
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Upload Image (Optional)</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button variant="success" type="submit">
                  Add Donation
                </Button>
                <Button variant="outline-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Filter */}
      <div className="mb-4">
        <Form.Group>
          <Form.Label>Filter by Status</Form.Label>
          <Form.Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ maxWidth: '300px' }}
          >
            <option value="all">All Donations</option>
            <option value="Available">Available</option>
            <option value="Claimed">Claimed</option>
            <option value="PickedUp">Picked Up</option>
            <option value="Delivered">Delivered</option>
          </Form.Select>
        </Form.Group>
      </div>

      {/* Donations List */}
      {loading ? (
        <p>Loading donations...</p>
      ) : filteredDonations.length === 0 ? (
        <Alert variant="info">No donations found.</Alert>
      ) : (
        <Row>
          {filteredDonations.map(donation => (
            <Col md={4} className="mb-4" key={donation._id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="mb-0">{donation.foodName}</Card.Title>
                    <small className="badge bg-success">{donation.status}</small>
                  </div>
                  <p className="text-muted small">{donation.quantity} {donation.unit}</p>
                  <p className="small">{donation.location}</p>
                  <p className="small text-muted">Expires: {new Date(donation.expiryTime).toLocaleString()}</p>
                  
                  <div className="d-grid gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => navigate(`/food/${donation._id}`)}
                    >
                      <FaEye className="me-2" />
                      View
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        setDeletingId(donation._id);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrash className="me-2" />
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this donation?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DonorDashboard;
