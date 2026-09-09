const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generatePrescriptionPDF = async (prescription, patient, doctor) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const filename = `prescription_${prescription._id}.pdf`;
    const filepath = path.join(__dirname, '../uploads/prescriptions', filename);
    
    // Ensure directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);
    
    // Header
    doc.fontSize(20).text('PRESCRIPTION', { align: 'center' });
    doc.moveDown();
    
    // Hospital Info
    doc.fontSize(12)
       .text('Hospital Management System', { align: 'center' })
       .text('123 Medical Street, City, State - 123456', { align: 'center' });
    doc.moveDown();
    
    // Patient Info
    doc.fontSize(14).text('Patient Information:', { underline: true });
    doc.fontSize(12)
       .text(`Name: ${patient.name}`)
       .text(`Phone: ${patient.phone}`)
       .text(`Date: ${new Date(prescription.createdAt).toLocaleDateString()}`);
    doc.moveDown();
    
    // Doctor Info
    doc.fontSize(14).text('Doctor Information:', { underline: true });
    doc.fontSize(12)
       .text(`Dr. ${doctor.name}`)
       .text(`Specialization: ${doctor.specialization || 'General'}`);
    doc.moveDown();
    
    // Diagnosis
    if (prescription.diagnosis) {
      doc.fontSize(14).text('Diagnosis:', { underline: true });
      doc.fontSize(12).text(prescription.diagnosis);
      doc.moveDown();
    }
    
    // Medicines
    doc.fontSize(14).text('Medicines:', { underline: true });
    prescription.medicines.forEach((medicine, index) => {
      doc.fontSize(12)
         .text(`${index + 1}. ${medicine.name}`)
         .text(`   Dosage: ${medicine.dosage}`)
         .text(`   Frequency: ${medicine.frequency}`)
         .text(`   Duration: ${medicine.duration}`);
      if (medicine.instructions) {
        doc.text(`   Instructions: ${medicine.instructions}`);
      }
      doc.moveDown(0.5);
    });
    
    // Notes
    if (prescription.notes) {
      doc.moveDown();
      doc.fontSize(14).text('Notes:', { underline: true });
      doc.fontSize(12).text(prescription.notes);
    }
    
    doc.end();
    
    stream.on('finish', () => {
      resolve(filepath);
    });
    
    stream.on('error', reject);
  });
};

exports.generateInvoicePDF = async (invoice, patient) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const filename = `invoice_${invoice.invoiceNumber}.pdf`;
    const filepath = path.join(__dirname, '../uploads/invoices', filename);
    
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);
    
    // Header
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();
    
    // Invoice Details
    doc.fontSize(12)
       .text(`Invoice Number: ${invoice.invoiceNumber}`)
       .text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`)
       .text(`Patient: ${patient.name}`)
       .text(`Phone: ${patient.phone}`);
    doc.moveDown();
    
    // Items
    doc.fontSize(14).text('Items:', { underline: true });
    doc.moveDown(0.5);
    
    invoice.items.forEach((item, index) => {
      doc.fontSize(12)
         .text(`${index + 1}. ${item.description} - Qty: ${item.quantity} x ₹${item.unitPrice} = ₹${item.total}`);
    });
    
    doc.moveDown();
    
    // Totals
    doc.fontSize(12)
       .text(`Subtotal: ₹${invoice.subtotal}`)
       .text(`Tax: ₹${invoice.tax}`)
       .text(`Discount: ₹${invoice.discount}`)
       .text(`Total: ₹${invoice.total}`, { fontSize: 14, bold: true });
    
    doc.end();
    
    stream.on('finish', () => {
      resolve(filepath);
    });
    
    stream.on('error', reject);
  });
};

