import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Alert, Spinner } from 'react-bootstrap';
import { FaMedal, FaUsers } from 'react-icons/fa';
import { authAPI } from '../utils/api';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

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
      setLoading(true);
      const response = await authAPI.get('/api/food/leaderboard/stats');
      setTopDonors(response.data.topDonors || []);
      setTopVolunteers(response.data.topVolunteers || []);
      setError('');
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <>
      <Navigation />
      <Container className="py-5">
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

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" className="text-success" />
            <p className="mt-3">Loading leaderboard...</p>
          </div>
        ) : (
          <>
            {/* Top Donors */}
            <Row className="mb-5">
              <Col md={12}>
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-success text-white py-3">
                    <FaMedal className="me-2" />
                    Top Donors 🍽️
                  </Card.Header>
                  <Card.Body className="p-0">
                    {topDonors.length > 0 ? (
                      <Table hover className="mb-0" responsive>
                        <thead className="table-light">
                          <tr>
                            <th style={{ width: '10%' }}>Rank</th>
                            <th style={{ width: '30%' }}>Name</th>
                            <th style={{ width: '30%' }}>Organization</th>
                            <th style={{ width: '20%' }}>Donations</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topDonors.map((donor, index) => (
                            <tr key={index} className={index < 3 ? 'table-light' : ''}>
                              <td>
                                <span className="fs-5 fw-bold">
                                  {getRankBadge(donor.rank)}
                                </span>
                              </td>
                              <td className="fw-bold">{donor.name}</td>
                              <td>{donor.organizationName || 'Individual'}</td>
                              <td>
                                <span className="badge bg-success fs-6">
                                  {donor.totalDonations}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
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
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Header className="bg-info text-white py-3">
                    <FaUsers className="me-2" />
                    Top Volunteers 🚚
                  </Card.Header>
                  <Card.Body className="p-0">
                    {topVolunteers.length > 0 ? (
                      <Table hover className="mb-0" responsive>
                        <thead className="table-light">
                          <tr>
                            <th style={{ width: '10%' }}>Rank</th>
                            <th style={{ width: '30%' }}>Name</th>
                            <th style={{ width: '30%' }}>Email</th>
                            <th style={{ width: '20%' }}>Deliveries</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topVolunteers.map((volunteer, index) => (
                            <tr key={index} className={index < 3 ? 'table-light' : ''}>
                              <td>
                                <span className="fs-5 fw-bold">
                                  {getRankBadge(volunteer.rank)}
                                </span>
                              </td>
                              <td className="fw-bold">{volunteer.name}</td>
                              <td>{volunteer.email}</td>
                              <td>
                                <span className="badge bg-info fs-6">
                                  {volunteer.deliveriesCompleted}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="p-4 text-center text-muted">
                        No volunteers yet. Join as a volunteer!
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Stats Cards */}
            <Row className="mb-5">
              <Col md={6} className="mb-3">
                <Card className="border-0 shadow-sm text-center">
                  <Card.Body className="py-4">
                    <h3 className="text-success">{topDonors.length}</h3>
                    <p className="text-muted">Top Donors Listed</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} className="mb-3">
                <Card className="border-0 shadow-sm text-center">
                  <Card.Body className="py-4">
                    <h3 className="text-info">{topVolunteers.length}</h3>
                    <p className="text-muted">Top Volunteers Listed</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Leaderboard;
