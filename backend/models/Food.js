const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    enum: ['kg', 'liters', 'plates', 'portions'],
    required: true,
  },
  foodType: {
    type: String,
    enum: ['Veg', 'Non-Veg', 'Mixed'],
    required: true,
  },
  cookedTime: {
    type: Date,
    required: true,
  },
  expiryTime: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
  imageUrl: {
    type: String,
  },
  donor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Available', 'Claimed', 'PickedUp', 'Delivered', 'Expired'],
    default: 'Available',
  },
  claimedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  claimedAt: {
    type: Date,
  },
  assignedVolunteer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  deliveryDetails: {
    pickupTime: Date,
    deliveryTime: Date,
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

module.exports = mongoose.model('Food', foodSchema);
