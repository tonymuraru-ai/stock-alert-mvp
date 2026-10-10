const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['store', 'warehouse', 'office'],
    default: 'store'
  },
  businessHours: {
    startTime: {
      type: String,
      default: "08:00"
    },
    endTime: {
      type: String,
      default: "18:00"
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Location', locationSchema);