const express = require('express');
const Alert = require('../models/Alert');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

const router = express.Router();

// Get notifications (alerts + upcoming appointments)
router.get('/', auth, async (req, res) => {
  try {
    const alerts = await Alert.find({
      userId: req.user.userId,
      isRead: false
    }).sort({ createdAt: -1 }).limit(10);

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const upcomingBookings = await Booking.find({
      userId: req.user.userId,
      appointmentDate: {
        $gte: now,
        $lte: tomorrow
      },
      status: { $in: ['pending', 'confirmed'] }
    }).sort({ appointmentDate: 1 });

    res.json({
      alerts,
      upcomingBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

