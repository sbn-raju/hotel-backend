// models/PaymentTransaction.js
const mongoose = require('mongoose');

const paymentTransactionSchema = new mongoose.Schema({
  user_id: {
    type: String, // UUID stored as string
    required: true
  },
  booking_id: {
    type: String, // UUID stored as string
    required: true
  },
  payment_gateway_details: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentGatewayResponse', // Reference to payment_gateway_response table
    required: true
  },
  payment_status: {
    type: String,
    enum: ['pending', 'success', 'failure'], // ENUM constraint
    default: 'pending'
  },
  payment_method: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema);
