const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const { generatePrescriptionPDF } = require('../utils/pdfGenerator');
const { generateSOAPNotes } = require('../utils/aiHelper');

// Get prescriptions
router.get('/', auth, async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user.userId);
    let query = {};

    if (user.role === 'patient') {
      query.patient = req.user.userId;
    } else if (user.role === 'doctor') {
      query.doctor = req.user.userId;
    }

    const prescriptions = await Prescription.find(query)
      .populate('appointment')
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create prescription
router.post('/', auth, async (req, res) => {
  try {
    const { appointmentId, medicines, diagnosis, symptoms, notes, soapNotes, voiceTranscription } = req.body;

    const appointment = await Appointment.findById(appointmentId)
      .populate('patient')
      .populate('doctor');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const prescription = new Prescription({
      appointment: appointmentId,
      patient: appointment.patient._id,
      doctor: appointment.doctor._id,
      medicines,
      diagnosis,
      symptoms: symptoms || [],
      notes,
      soapNotes: soapNotes || generateSOAPNotes(),
      voiceTranscription
    });

    await prescription.save();

    // Update appointment
    appointment.prescription = prescription._id;
    appointment.status = 'completed';
    await appointment.save();

    // Generate PDF
    try {
      const pdfPath = await generatePrescriptionPDF(prescription, appointment.patient, appointment.doctor);
      prescription.pdfUrl = pdfPath;
      await prescription.save();
    } catch (pdfError) {
      console.error('PDF generation error:', pdfError);
    }

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single prescription
router.get('/:id', auth, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('appointment')
      .populate('patient')
      .populate('doctor');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

