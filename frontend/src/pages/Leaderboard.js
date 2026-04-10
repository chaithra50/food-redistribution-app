import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { FaMedal, FaUsers } from 'react-icons/fa';
import { foodAPI } from '../utils/api';

const Leaderboard = () => {
  const [topDonors, setTopDonors] = useState([]);
  const [topVolunteers, setTopVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(false); // Turn off loading immediately
      console.log('Fetching leaderboard...');
      const response = await foodAPI.getLeaderboard();
      console.log('Leaderboard response:', response.data);
      setTopDonors(response.data.topDonors || []);
      setTopVolunteers(response.data.topVolunteers || []);
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
      setError(err.message || 'Failed to load leaderboard');
    }
  };

  return (
    <>
      <Container className="py-5" style={{ minHeight: '500px' }}>
        <Row className="mb-5">
          <Col md={12} className="text-center">
            <h1 className="mb-4">
              <FaMedal className="text-warning me-3" />
              Leaderboard
            </h1>
            <p className="text-muted">Top Contributors in the FoodLink Community</p>
          </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Top Donors */}
        <Row className="mb-5">
          <Col md={12}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-success text-white py-3">
                <FaMedal className="me-2" />
                Top Donors 🍽️
              </Card.Header>
              <Card.Body>
                {topDonors.length > 0 ? (
                  <div>
                    {topDonors.map((donor, index) => (
                      <div key={index} className="p-3 border-bottom">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h5>
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                              {' '}{donor.name}
                            </h5>
                            <p className="text-muted mb-0">{donor.organizationName}</p>
                          </div>
                          <div className="text-end">
                            <p className="mb-0"><strong>{donor.totalDonations}</strong> donations</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted">
                    No donors yet. Be the first!
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Top Volunteers */}
        <Row className="mb-5">
          <Col md={12}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-info text-white py-3">
                <FaUsers className="me-2" />
                Top Volunteers 🚚
              </Card.Header>
              <Card.Body>
                {topVolunteers.length > 0 ? (
                  <div>
                    {topVolunteers.map((volunteer, index) => (
                      <div key={index} className="p-3 border-bottom">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h5>
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                              {' '}{volunteer.name}
                            </h5>
                            <p className="text-muted mb-0">{volunteer.email}</p>
                          </div>
                          <div className="text-end">
                            <p className="mb-0"><strong>{volunteer.deliveriesCompleted}</strong> deliveries</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted">
                    No volunteers yet. Join as a volunteer!
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Leaderboard;
