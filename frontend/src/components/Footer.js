import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaLeaf } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-success text-white mt-5 py-4">
      <Container>
        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <h5>
              <FaLeaf className="me-2" />
              FoodLink
            </h5>
            <p>Reducing food waste and supporting Zero Hunger worldwide.</p>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white text-decoration-none">Home</a></li>
              <li><a href="/about-us" className="text-white text-decoration-none">About Us</a></li>
              <li><a href="/contact" className="text-white text-decoration-none">Contact</a></li>
            </ul>
          </Col>
        </Row>
        <hr className="bg-white" />
        <Row>
          <Col md={6}>
            <p className="mb-0">&copy; {currentYear} FoodLink. All rights reserved.</p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="mb-0">Supporting <strong>SDG 2: Zero Hunger</strong></p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
