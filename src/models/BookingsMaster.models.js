// models/BookingsMaster.js
const mongoose = require('mongoose');

const bookingsMasterSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to user_registration
    required: true
  },
  room_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room', // Reference to rooms table/model
    required: true
  },
  check_in: {
    type: Date,
    required: true
  },
  check_out: {
    type: Date,
    required: true
  },
  adults: {
    type: Number,
    required: true
  },
  children: {
    type: Number,
    default: 0
  },
  extra_bed: {
    type: Number,
    default: 0
  },
  extra_persons: {
    type: Number,
    default: 0
  },
  total_price: {
    type: Number,
    required: true
  },
  payment_details: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentMaster' // Reference to payment_master
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('BookingsMaster', bookingsMasterSchema);
