const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const LabReport = require('../models/LabReport');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendNotificationEmail, sendNotificationSMS } = require('../utils/email');
const { sendNotificationSMS: sendSMS } = require('../utils/sms');

// Get lab reports
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    let query = {};

    if (user.role === 'patient') {
      query.patient = req.user.userId;
    } else if (user.role === 'lab') {
      // Lab can see all reports
    } else if (user.role === 'doctor') {
      query.doctor = req.user.userId;
    }

    const reports = await LabReport.find(query)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .populate('labTechnician', 'name')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create lab test request
router.post('/', auth, async (req, res) => {
  try {
    const { patientId, testName, testType, notes } = req.body;

    const report = new LabReport({
      patient: patientId || req.user.userId,
      doctor: req.user.role === 'doctor' ? req.user.userId : null,
      testName,
      testType,
      notes,
      status: 'pending'
    });

    await report.save();

    // Notify lab
    const labUsers = await User.find({ role: 'lab' });
    for (const labUser of labUsers) {
      await Notification.create({
        user: labUser._id,
        type: 'lab-report',
        title: 'New Lab Test Request',
        message: `New ${testName} test requested`,
        link: `/dashboard/lab/${report._id}`
      });
    }

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update lab report
router.put('/:id', auth, async (req, res) => {
  try {
    const { results, reportUrl, status, notes } = req.body;
    const report = await LabReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (results) report.results = results;
    if (reportUrl) report.reportUrl = reportUrl;
    if (status) report.status = status;
    if (notes) report.notes = notes;

    if (status === 'completed' && !report.notified) {
      report.completedAt = new Date();
      report.labTechnician = req.user.userId;
      report.notified = true;

      // Notify patient
      const patient = await User.findById(report.patient);
      if (patient) {
        await Notification.create({
          user: report.patient,
          type: 'lab-report',
          title: 'Lab Report Ready',
          message: `Your ${report.testName} report is ready`,
          link: `/dashboard/lab-reports/${report._id}`
        });

        // Send email and SMS
        if (patient.email) {
          await sendNotificationEmail(patient.email, 'Lab Report Ready', 
            `Your ${report.testName} report is ready. Please check your dashboard.`);
        }
        if (patient.phone) {
          await sendSMS(patient.phone, `Your ${report.testName} lab report is ready. Check your dashboard.`);
        }
      }
    }

    await report.save();
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

