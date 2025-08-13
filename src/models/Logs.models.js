// models/ExtrasLog.js
const mongoose = require('mongoose');

const extrasLogSchema = new mongoose.Schema({
  extra_bed_cost: {
    type: Number,
    default: 0
  },
  extra_person_cost: {
    type: Number,
    default: 0
  },
  total_rooms: {
    type: Number,
    default: 0
  },
  total_rooms_booked: {
    type: Number,
    default: 0
  },
  total_rooms_available: {
    type: Number,
    default: 0
  },
  total_4bedrooms_available: {
    type: Number,
    default: 0
  },
  total_2bedrooms_available: {
    type: Number,
    default: 0
  },
  total_3bedrooms_available: {
    type: Number,
    default: 0
  }
}, {
    timestamps: true
});

module.exports = mongoose.model('ExtrasLog', extrasLogSchema);
