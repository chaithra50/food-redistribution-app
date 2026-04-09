import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const AboutUs = () => {
  return (
    <Container className="my-5">
      <Row className="mb-5">
        <Col lg={8} className="mx-auto">
          <h1 className="mb-4">About FoodLink</h1>
          <p className="lead">
            FoodLink is a community-driven platform dedicated to reducing food waste and supporting food security through efficient food redistribution.
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col lg={8} className="mx-auto">
          <h2 className="mb-3">Our Mission</h2>
          <p>
            We believe that no food should go to waste while people go hungry. FoodLink connects donors with surplus food to receivers who need it most, 
            with volunteers facilitating safe and timely delivery. Together, we're working towards UN Sustainable Development Goal 2: Zero Hunger.
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col lg={8} className="mx-auto">
          <h2 className="mb-3">How It Works</h2>
          <div className="mb-4">
            <h5>For Donors</h5>
            <p>
              Have surplus food from your restaurant, grocery store, or home? List your available food on FoodLink and help those in need. 
              Our platform makes it easy to donate responsibly and track your impact.
            </p>
          </div>
          <div className="mb-4">
            <h5>For Receivers</h5>
            <p>
              Browse available food donations in your area and claim items directly. Connect with donors and volunteers to arrange pickup 
              at convenient times and locations.
            </p>
          </div>
          <div className="mb-4">
            <h5>For Volunteers</h5>
            <p>
              Make a difference in your community by helping transport food from donors to receivers. Accept delivery tasks and help ensure 
              nutritious food reaches those who need it most.
            </p>
          </div>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col lg={8} className="mx-auto">
          <h2 className="mb-3">Our Values</h2>
          <ul className="list-unstyled">
            <li className="mb-3">
              <strong>Community:</strong> We believe in the power of collective action to solve food insecurity
            </li>
            <li className="mb-3">
              <strong>Sustainability:</strong> Reducing food waste protects our environment and resources
            </li>
            <li className="mb-3">
              <strong>Equity:</strong> Everyone deserves access to nutritious food regardless of background
            </li>
            <li className="mb-3">
              <strong>Transparency:</strong> We maintain trust through clear communication and accountability
            </li>
          </ul>
        </Col>
      </Row>

      <Row>
        <Col lg={8} className="mx-auto">
          <h2 className="mb-3">Get Involved</h2>
          <p>
            Whether you're a food donor, someone in need, or a community volunteer, FoodLink welcomes you. 
            Sign up today and join our mission to build a more food-secure world.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
