const express = require('express');
const Booking = require('../models/Booking');
const Alert = require('../models/Alert');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all bookings for a user
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId })
      .sort({ appointmentDate: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { ointmentType, appointmentDate, appointmentTime, description, bookingType, category } = req.body;

    const booking = new Booking({
      userId: req.user.userId,
      ointmentType,
      appointmentDate,
      appointmentTime,
      description,
      bookingType: bookingType || 'medicine',
      category: category || 'Other'
    });

    await booking.save();

    // Create alert for new booking (non-blocking - booking is already saved)
    try {
      const alertType = bookingType === 'appointment' ? 'appointment' : 'medication';
      const alertTitle = bookingType === 'appointment' ? 'New Appointment Booked' : 'New Medicine Appointment Booked';
      const alertMessage = bookingType === 'appointment' 
        ? `Your appointment for ${ointmentType} is scheduled for ${appointmentDate} at ${appointmentTime}`
        : `Your ${ointmentType} medicine appointment is scheduled for ${appointmentDate} at ${appointmentTime}`;

      const alert = new Alert({
        userId: req.user.userId,
        type: alertType,
        priority: 'medium',
        title: alertTitle,
        message: alertMessage
      });
      await alert.save();
    } catch (alertError) {
      // Log alert error but don't fail the booking creation
      console.error('Error creating alert for booking:', alertError);
    }

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

