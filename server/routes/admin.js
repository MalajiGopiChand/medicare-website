const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Department = require('../models/Department');
const Bed = require('../models/Bed');
const Complaint = require('../models/Complaint');
const Appointment = require('../models/Appointment');
const Invoice = require('../models/Invoice');

// Middleware to check admin role
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Staff Management
router.get('/staff', auth, isAdmin, async (req, res) => {
  try {
    const staff = await User.find({ role: { $ne: 'patient' } })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/staff', auth, isAdmin, async (req, res) => {
  try {
    const staffData = req.body;
    const staff = new User(staffData);
    await staff.save();

    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Department Management
router.get('/departments', auth, isAdmin, async (req, res) => {
  try {
    const departments = await Department.find().populate('head', 'name');
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/departments', auth, isAdmin, async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bed Management
router.get('/beds', auth, isAdmin, async (req, res) => {
  try {
    const beds = await Bed.find().populate('patient', 'name phone');
    res.json(beds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/beds', auth, isAdmin, async (req, res) => {
  try {
    const bed = new Bed(req.body);
    await bed.save();
    res.status(201).json(bed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Analytics
router.get('/analytics', auth, isAdmin, async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalAppointments = await Appointment.countDocuments();
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const totalRevenue = await Invoice.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const monthlyRevenue = await Invoice.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      completedAppointments,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthlyRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Complaints
router.get('/complaints', auth, isAdmin, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('patient', 'name email phone')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/complaints/:id', auth, isAdmin, async (req, res) => {
  try {
    const { status, resolution, assignedTo } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (status) complaint.status = status;
    if (resolution) complaint.resolution = resolution;
    if (assignedTo) complaint.assignedTo = assignedTo;
    if (status === 'resolved') complaint.resolvedAt = new Date();

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

