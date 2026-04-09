import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { FaClock, FaMapMarkerAlt, FaLeaf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const FoodCard = ({ food, onClaim, showClaim }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const colors = {
      Available: 'success',
      Claimed: 'warning',
      PickedUp: 'info',
      Delivered: 'secondary',
      Expired: 'danger',
    };
    return colors[status] || 'secondary';
  };

  const getTypeColor = (type) => {
    const colors = {
      Veg: 'success',
      'Non-Veg': 'danger',
      Mixed: 'warning',
    };
    return colors[type] || 'secondary';
  };

  const isExpired = new Date(food.expiryTime) < new Date();

  return (
    <Card className="h-100 shadow-sm border-0 overflow-hidden">
      {food.imageUrl && (
        <Card.Img variant="top" src={food.imageUrl} style={{ height: '200px', objectFit: 'cover' }} />
      )}
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0">{food.foodName}</Card.Title>
          <Badge bg={getStatusColor(food.status)}>{food.status}</Badge>
        </div>

        <div className="mb-3">
          <Badge bg={getTypeColor(food.foodType)} className="me-2">
            {food.foodType}
          </Badge>
          <Badge bg="light" text="dark">
            {food.quantity} {food.unit}
          </Badge>
        </div>

        {food.description && (
          <p className="text-muted small mb-2">{food.description}</p>
        )}

        <div className="small mb-2">
          <div>
            <FaMapMarkerAlt className="text-success me-2" />
            {food.location}
          </div>
          <div>
            <FaClock className="text-warning me-2" />
            Expires: {new Date(food.expiryTime).toLocaleString()}
          </div>
        </div>

        {food.donor && (
          <div className="bg-light p-2 rounded small mb-3">
            <strong>From:</strong> {food.donor.name}
            {food.donor.organizationName && ` (${food.donor.organizationName})`}
          </div>
        )}

        <div className="d-grid gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/food/${food._id}`)}
          >
            View Details
          </Button>
          {showClaim && food.status === 'Available' && !isExpired && (
            <Button
              variant="success"
              size="sm"
              onClick={() => onClaim(food._id)}
            >
              <FaLeaf className="me-2" />
              Claim This Food
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default FoodCard;
