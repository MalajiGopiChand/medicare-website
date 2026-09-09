const mongoose = require('mongoose');

const housekeepingRequestSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  roomNumber: String,
  bedNumber: String,
  requestType: {
    type: String,
    enum: ['cleaning', 'laundry', 'maintenance', 'room-service', 'other'],
    required: true
  },
  description: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HousekeepingRequest', housekeepingRequestSchema);

