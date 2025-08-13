// models/PaymentGatewayResponse.js
const mongoose = require('mongoose');

const paymentGatewayResponseSchema = new mongoose.Schema({
  id: {
    type: String, // UUID stored as string
    required: true,
    unique: true
  },
  gateway_response: {
    type: String, // JSON or stringified response from the payment gateway
    required: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('PaymentGatewayResponse', paymentGatewayResponseSchema);
