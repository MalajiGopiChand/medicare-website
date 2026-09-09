const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  invoiceType: {
    type: String,
    enum: ['consultation', 'lab', 'pharmacy', 'bed', 'other'],
    required: true
  },
  items: [{
    description: String,
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  gst: {
    cgst: { type: Number, default: 0 },
    sgst: { type: Number, default: 0 },
    igst: { type: Number, default: 0 }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partial', 'refunded'],
    default: 'pending'
  },
  paymentMethod: String,
  paymentId: String,
  pdfUrl: String,
  sentViaEmail: { type: Boolean, default: false },
  sentViaWhatsApp: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now
  },
  dueDate: Date
});

module.exports = mongoose.model('Invoice', invoiceSchema);

