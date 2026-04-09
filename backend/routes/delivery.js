const express = require('express');
const { auth, roleCheck } = require('../middleware/auth');
const {
  getDeliveries,
  getVolunteerDeliveries,
  acceptDelivery,
  updateDeliveryStatus,
  getDeliveryById,
} = require('../controllers/deliveryController');

const router = express.Router();

// Admin and general routes
router.get('/', auth, getDeliveries);
router.get('/:id', auth, getDeliveryById);

// Volunteer routes
router.get('/volunteer/tasks', auth, roleCheck('volunteer'), getVolunteerDeliveries);
router.post('/:id/accept', auth, roleCheck('volunteer'), acceptDelivery);
router.put('/:id/status', auth, updateDeliveryStatus);

module.exports = router;
