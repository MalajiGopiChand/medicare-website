const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ointmentType: {
    type: String,
    required: true
  },
  bookingType: {
    type: String,
    enum: ['medicine', 'appointment'],
    default: 'medicine'
  },
  category: {
    type: String,
    enum: ['Antibiotic', 'Antifungal', 'Steroid', 'Moisturizer', 'Pain Relief', 'Antihistamine', 'Vitamin', 'Topical Treatment', 'Other', 'Fever', 'Cough', 'Cold', 'Headache', 'Stomach', 'Allergy', 'Skin', 'Pain', 'Breathing', 'Infection', 'Eye', 'Ear', 'Throat', 'Dental', 'Mental Health', 'General'],
    default: 'Other'
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notificationSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);

