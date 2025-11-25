const express = require('express');
const Alert = require('../models/Alert');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all alerts for a user
router.get('/', auth, async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get unread alerts count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Alert.countDocuments({
      userId: req.user.userId,
      isRead: false
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create emergency alert
router.post('/emergency', auth, async (req, res) => {
  try {
    const { title, message } = req.body;

    const alert = new Alert({
      userId: req.user.userId,
      type: 'emergency',
      priority: 'critical',
      title: title || 'Emergency Alert',
      message: message || 'Emergency situation reported'
    });

    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark alert as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { isRead: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark all alerts as read
router.put('/read-all', auth, async (req, res) => {
  try {
    await Alert.updateMany(
      { userId: req.user.userId, isRead: false },
      { isRead: true }
    );
    res.json({ message: 'All alerts marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete alert
router.delete('/:id', auth, async (req, res) => {
  try {
    const alert = await Alert.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

