import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';
import { authAPI } from '../utils/api';
import { setAuthData } from '../utils/auth';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'donor',
    address: '',
    city: '',
    state: '',
    pincode: '',
    organizationName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    if (!formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      setError('All fields are required');
      return false;
    }
    if (formData.role !== 'donor' && !formData.organizationName) {
      setError('Organization name is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      };

      if (formData.organizationName) {
        dataToSend.organizationName = formData.organizationName;
      }

      const response = await authAPI.register(dataToSend);
      setAuthData(response.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center py-5">
        <Col md={6}>
          <Card className="border-0 shadow">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <FaLeaf size={50} className="text-success mb-3" />
                <h3>Join FoodLink</h3>
                <p className="text-muted">Step {step} of 2</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={step === 2 ? handleSubmit : (e) => {
                e.preventDefault();
                if (validateStep1()) {
                  setStep(2);
                }
              }}>
                {step === 1 && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter password"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Confirm password"
                      />
                    </Form.Group>
                  </>
                )}

                {step === 2 && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>I am a...</Form.Label>
                      <Form.Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <option value="donor">Donor (Restaurant/Individual/Hostel)</option>
                        <option value="receiver">Receiver (NGO/Orphanage)</option>
                        <option value="volunteer">Volunteer (Delivery Helper)</option>
                      </Form.Select>
                    </Form.Group>

                    {formData.role !== 'donor' && (
                      <Form.Group className="mb-3">
                        <Form.Label>Organization Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="organizationName"
                          value={formData.organizationName}
                          onChange={handleChange}
                          placeholder="Your organization name"
                        />
                      </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="Your phone number"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        placeholder="Street address"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        placeholder="City"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        placeholder="State"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Pincode</Form.Label>
                      <Form.Control
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        placeholder="Pincode"
                      />
                    </Form.Group>
                  </>
                )}

                <div className="d-grid gap-2">
                  {step === 2 && (
                    <Button
                      variant="outline-secondary"
                      onClick={() => setStep(1)}
                      className="mb-2"
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    variant="success"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : step === 1 ? 'Next' : 'Register'}
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-4">
                <p className="text-muted">
                  Already have an account? <Link to="/login" className="text-success fw-bold">Login here</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
