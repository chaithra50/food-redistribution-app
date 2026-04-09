const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  food: {
    type: mongoose.Schema.ObjectId,
    ref: 'Food',
    required: true,
  },
  donor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  volunteer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'PickedUp', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  deliveryLocation: {
    type: String,
    required: true,
  },
  pickupTime: {
    type: Date,
  },
  deliveryTime: {
    type: Date,
  },
  estimatedDeliveryTime: {
    type: Date,
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Delivery', deliverySchema);
