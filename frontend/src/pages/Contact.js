import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send to a backend endpoint
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <Container className="my-5">
      <Row className="mb-5">
        <Col lg={8} className="mx-auto">
          <h1 className="mb-4">Contact Us</h1>
          <p className="lead">
            Have questions or feedback about FoodLink? We'd love to hear from you!
          </p>
        </Col>
      </Row>

      <Row>
        <Col lg={6} className="mx-auto mb-5">
          <Card className="shadow-sm">
            <Card.Body>
              {submitted && (
                <div className="alert alert-success" role="alert">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this about?"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message..."
                    required
                  />
                </Form.Group>

                <Button variant="success" type="submit" className="w-100">
                  Send Message
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col lg={8} className="mx-auto">
          <h3 className="mb-4">Other Ways to Reach Us</h3>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col lg={8} className="mx-auto">
          <Row>
            <Col md={6} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <h5 className="card-title">Email</h5>
                  <p className="card-text">
                    <a href="mailto:info@foodlink.org">info@foodlink.org</a>
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <h5 className="card-title">Social Media</h5>
                  <p className="card-text">
                    Follow us on Facebook, Twitter, and Instagram @FoodLink
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col lg={8} className="mx-auto">
          <h3 className="mb-4">Frequently Asked Questions</h3>
          <div className="accordion" id="faqAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                  Is FoodLink available in my area?
                </button>
              </h2>
              <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  FoodLink is continuously expanding. Check the app to see if we serve your location, or contact us to request expansion to your area.
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                  How do I become a volunteer?
                </button>
              </h2>
              <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Simply sign up on FoodLink, select the "Volunteer" role, and start accepting delivery tasks in your area.
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                  Is there any cost to use FoodLink?
                </button>
              </h2>
              <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  FoodLink is completely free for all users. We're a non-profit dedicated to reducing food waste and supporting food security.
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
