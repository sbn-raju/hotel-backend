// models/ExtrasLog.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
        unique: true
    },
    order_response:{
        type: Object,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'failed', 'success'],
        default: 'pending',
        required: true,
    }
}, {
    timestamps: true
});

const Orders = mongoose.model('Orders', orderSchema);

module.exports = Orders;
