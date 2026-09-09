const mongoose = require('mongoose');

const labReportSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  labTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  testName: {
    type: String,
    required: true
  },
  testType: {
    type: String,
    enum: ['blood', 'urine', 'xray', 'ct-scan', 'mri', 'ultrasound', 'ecg', 'other'],
    required: true
  },
  testRequestDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  results: [{
    parameter: String,
    value: String,
    unit: String,
    normalRange: String,
    status: {
      type: String,
      enum: ['normal', 'abnormal', 'critical']
    }
  }],
  reportUrl: String, // PDF URL
  notes: String,
  completedAt: Date,
  notified: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LabReport', labReportSchema);

