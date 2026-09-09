const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Prescription = require('../models/Prescription');
const Notification = require('../models/Notification');

// Get all appointments (role-based)
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    let query = {};

    if (user.role === 'patient') {
      query.patient = req.user.userId;
    } else if (user.role === 'doctor') {
      query.doctor = req.user.userId;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create appointment
router.post('/', auth, async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, appointmentType, reason, consultationFee } = req.body;

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(400).json({ message: 'Invalid doctor' });
    }

    const appointment = new Appointment({
      patient: req.user.userId,
      doctor: doctorId,
      appointmentDate,
      appointmentTime,
      appointmentType: appointmentType || 'in-person',
      reason,
      consultationFee: consultationFee || doctor.consultationFee || 500
    });

    await appointment.save();

    // Create notification
    await Notification.create({
      user: doctorId,
      type: 'appointment',
      title: 'New Appointment Request',
      message: `New appointment request from patient`,
      link: `/dashboard/appointments/${appointment._id}`
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single appointment
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone dateOfBirth gender')
      .populate('doctor', 'name specialization consultationFee')
      .populate('prescription');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update appointment status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    // Notify patient
    await Notification.create({
      user: appointment.patient,
      type: 'appointment',
      title: 'Appointment Status Updated',
      message: `Your appointment status has been updated to ${status}`,
      link: `/dashboard/appointments/${appointment._id}`
    });

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update case sheet
router.put('/:id/case-sheet', auth, async (req, res) => {
  try {
    const { symptoms, diagnosis, treatment, followUpDate, notes } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.caseSheet = {
      symptoms: symptoms || [],
      diagnosis,
      treatment,
      followUpDate,
      notes
    };

    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start video consultation
router.post('/:id/video/start', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const roomId = `room_${appointment._id}_${Date.now()}`;
    appointment.videoRoomId = roomId;
    appointment.videoCallStarted = new Date();
    appointment.status = 'confirmed';
    await appointment.save();

    res.json({ roomId, appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// End video consultation
router.post('/:id/video/end', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.videoCallStarted) {
      const duration = Math.floor((new Date() - appointment.videoCallStarted) / 1000);
      appointment.videoCallEnded = new Date();
      appointment.callDuration = duration;
      appointment.status = 'completed';
      await appointment.save();
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

