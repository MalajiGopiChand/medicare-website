const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const DietPlan = require('../models/DietPlan');
const User = require('../models/User');

// Get diet plans
router.get('/plans', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    let query = {};

    if (user.role === 'patient') {
      query.patient = req.user.userId;
    } else if (user.role === 'dietician') {
      query.dietician = req.user.userId;
    }

    const plans = await DietPlan.find(query)
      .populate('patient', 'name email phone')
      .populate('dietician', 'name')
      .sort({ createdAt: -1 });

    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create diet plan
router.post('/plans', auth, async (req, res) => {
  try {
    const { patientId, disease, planName, meals, recommendations, restrictions, notes, endDate } = req.body;

    const plan = new DietPlan({
      patient: patientId,
      dietician: req.user.userId,
      disease,
      planName,
      meals,
      recommendations: recommendations || [],
      restrictions: restrictions || [],
      notes,
      endDate
    });

    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

