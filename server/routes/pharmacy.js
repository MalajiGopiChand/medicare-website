const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Medicine = require('../models/Medicine');
const Prescription = require('../models/Prescription');
const Invoice = require('../models/Invoice');
const { generateInvoicePDF } = require('../utils/pdfGenerator');

// Get medicines
router.get('/medicines', auth, async (req, res) => {
  try {
    const medicines = await Medicine.find({ isActive: true })
      .sort({ name: 1 });

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get prescriptions for pharmacy
router.get('/prescriptions', auth, async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update medicine stock
router.put('/medicines/:id/stock', auth, async (req, res) => {
  try {
    const { stock, price } = req.body;
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    if (stock !== undefined) medicine.stock = stock;
    if (price !== undefined) medicine.price = price;

    await medicine.save();
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create medicine purchase invoice
router.post('/purchase', auth, async (req, res) => {
  try {
    const { prescriptionId, items } = req.body;

    const prescription = await Prescription.findById(prescriptionId)
      .populate('patient');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Calculate totals
    let subtotal = 0;
    const invoiceItems = [];

    for (const item of items) {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine) continue;

      const total = medicine.price * item.quantity;
      subtotal += total;

      invoiceItems.push({
        description: `${medicine.name} (${item.quantity} ${medicine.unit})`,
        quantity: item.quantity,
        unitPrice: medicine.price,
        total
      });

      // Update stock
      medicine.stock -= item.quantity;
      await medicine.save();
    }

    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;

    const invoice = new Invoice({
      invoiceNumber: `INV-${Date.now()}`,
      patient: prescription.patient._id,
      invoiceType: 'pharmacy',
      items: invoiceItems,
      subtotal,
      tax,
      total,
      gst: {
        cgst: tax / 2,
        sgst: tax / 2
      }
    });

    await invoice.save();

    // Generate PDF
    try {
      const pdfPath = await generateInvoicePDF(invoice, prescription.patient);
      invoice.pdfUrl = pdfPath;
      await invoice.save();
    } catch (pdfError) {
      console.error('PDF generation error:', pdfError);
    }

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

