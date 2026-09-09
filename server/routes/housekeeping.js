const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const HousekeepingRequest = require('../models/HousekeepingRequest');
const User = require('../models/User');

// Get requests
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    let query = {};

    if (user.role === 'patient') {
      query.patient = req.user.userId;
    } else if (user.role === 'housekeeping') {
      query.assignedTo = req.user.userId;
    }

    const requests = await HousekeepingRequest.find(query)
      .populate('patient', 'name phone')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create request
router.post('/', auth, async (req, res) => {
  try {
    const { requestType, description, roomNumber, bedNumber, priority } = req.body;

    const request = new HousekeepingRequest({
      patient: req.user.userId,
      requestType,
      description,
      roomNumber,
      bedNumber,
      priority: priority || 'medium'
    });

    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update request status
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const request = await HousekeepingRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (status) request.status = status;
    if (assignedTo) request.assignedTo = assignedTo;
    if (status === 'completed') request.completedAt = new Date();

    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

