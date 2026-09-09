const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const Appointment = require('../models/Appointment');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret'
});

// Create payment order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, invoiceId, appointmentId, paymentMethod } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    const payment = new Payment({
      patient: req.user.userId,
      invoice: invoiceId,
      appointment: appointmentId,
      amount,
      paymentMethod: paymentMethod || 'razorpay',
      orderId: order.id,
      paymentStatus: 'pending'
    });

    await payment.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      paymentId: payment._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify payment (Razorpay)
router.post('/verify', auth, async (req, res) => {
  try {
    const { orderId, paymentId, signature, paymentDbId } = req.body;

    const text = `${orderId}|${paymentId}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret')
      .update(text)
      .digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const payment = await Payment.findById(paymentDbId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.paymentStatus = 'success';
    payment.paymentId = paymentId;
    payment.signature = signature;
    payment.paidAt = new Date();
    await payment.save();

    // Update invoice if exists
    if (payment.invoice) {
      const invoice = await Invoice.findById(payment.invoice);
      if (invoice) {
        invoice.paymentStatus = 'paid';
        invoice.paymentId = paymentId;
        await invoice.save();
      }
    }

    // Update appointment payment status
    if (payment.appointment) {
      const appointment = await Appointment.findById(payment.appointment);
      if (appointment) {
        appointment.paymentStatus = 'paid';
        appointment.paymentId = paymentId;
        await appointment.save();
      }
    }

    res.json({ message: 'Payment verified successfully', payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get payments
router.get('/', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ patient: req.user.userId })
      .populate('invoice')
      .populate('appointment')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Payment webhook (Razorpay)
router.post('/webhook', async (req, res) => {
  try {
    const { event, payload } = req.body;

    if (event === 'payment.captured') {
      const { order_id, payment_id } = payload.payment.entity;

      const payment = await Payment.findOne({ orderId: order_id });
      if (payment) {
        payment.paymentStatus = 'success';
        payment.paymentId = payment_id;
        payment.paidAt = new Date();
        payment.webhookData = payload;
        await payment.save();

        // Update related records
        if (payment.invoice) {
          await Invoice.findByIdAndUpdate(payment.invoice, { paymentStatus: 'paid' });
        }
        if (payment.appointment) {
          await Appointment.findByIdAndUpdate(payment.appointment, { paymentStatus: 'paid' });
        }
      }
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

