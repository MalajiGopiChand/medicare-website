const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generateGSTInvoice = async (invoice, patient, hospitalInfo = {}) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const filename = `invoice_${invoice.invoiceNumber}.pdf`;
    const filepath = path.join(__dirname, '../uploads/invoices', filename);
    
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    // Hospital Header
    doc.fontSize(20).text(hospitalInfo.name || 'Hospital Management System', { align: 'center' });
    doc.fontSize(12)
       .text(hospitalInfo.address || '123 Medical Street, City, State - 123456', { align: 'center' })
       .text(`Phone: ${hospitalInfo.phone || '+91-1234567890'} | Email: ${hospitalInfo.email || 'info@hospital.com'}`, { align: 'center' });
    
    doc.moveDown();
    doc.strokeColor('#000000').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Invoice Title
    doc.fontSize(18).text('TAX INVOICE', { align: 'center', underline: true });
    doc.moveDown();

    // Invoice Details
    const invoiceDetailsY = doc.y;
    doc.fontSize(10)
       .text(`Invoice Number: ${invoice.invoiceNumber}`, 50, invoiceDetailsY)
       .text(`Date: ${new Date(invoice.createdAt).toLocaleDateString('en-IN')}`, 50, invoiceDetailsY + 15)
       .text(`GSTIN: ${hospitalInfo.gstin || 'GSTIN123456789'}`, 50, invoiceDetailsY + 30);

    // Patient Details
    doc.fontSize(10)
       .text('Bill To:', 300, invoiceDetailsY)
       .fontSize(11)
       .text(patient.name, 300, invoiceDetailsY + 15)
       .fontSize(10)
       .text(`Phone: ${patient.phone}`, 300, invoiceDetailsY + 30)
       .text(`Email: ${patient.email || 'N/A'}`, 300, invoiceDetailsY + 45);

    doc.moveDown(60);

    // Items Table Header
    const tableTop = doc.y;
    doc.fontSize(10).font('Helvetica-Bold')
       .text('S.No.', 50, tableTop)
       .text('Description', 100, tableTop)
       .text('Qty', 350, tableTop)
       .text('Rate', 400, tableTop)
       .text('Amount', 500, tableTop);

    doc.moveDown(5);
    doc.strokeColor('#000000').lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(5);

    // Items
    let currentY = doc.y;
    invoice.items.forEach((item, index) => {
      doc.font('Helvetica').fontSize(9)
         .text(`${index + 1}.`, 50, currentY)
         .text(item.description, 100, currentY, { width: 240 })
         .text(item.quantity.toString(), 350, currentY)
         .text(`₹${item.unitPrice.toFixed(2)}`, 400, currentY)
         .text(`₹${item.total.toFixed(2)}`, 500, currentY);
      
      currentY += 20;
    });

    doc.y = currentY + 10;
    doc.strokeColor('#000000').lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(10);

    // Totals
    const totalsY = doc.y;
    doc.fontSize(10)
       .text('Subtotal:', 400, totalsY)
       .text(`₹${invoice.subtotal.toFixed(2)}`, 500, totalsY);

    if (invoice.discount > 0) {
      doc.text('Discount:', 400, totalsY + 15)
         .text(`-₹${invoice.discount.toFixed(2)}`, 500, totalsY + 15);
    }

    // GST Details
    if (invoice.gst) {
      doc.text('CGST (9%):', 400, totalsY + 30)
         .text(`₹${invoice.gst.cgst.toFixed(2)}`, 500, totalsY + 30)
         .text('SGST (9%):', 400, totalsY + 45)
         .text(`₹${invoice.gst.sgst.toFixed(2)}`, 500, totalsY + 45);
    } else if (invoice.tax > 0) {
      doc.text('GST (18%):', 400, totalsY + 30)
         .text(`₹${invoice.tax.toFixed(2)}`, 500, totalsY + 30);
    }

    doc.moveDown(20);
    doc.fontSize(12).font('Helvetica-Bold')
       .text('Total Amount:', 400, doc.y)
       .text(`₹${invoice.total.toFixed(2)}`, 500, doc.y);

    doc.moveDown(30);

    // Payment Status
    doc.fontSize(10).font('Helvetica')
       .text(`Payment Status: ${invoice.paymentStatus.toUpperCase()}`, 50, doc.y)
       .text(`Payment Method: ${invoice.paymentMethod || 'N/A'}`, 50, doc.y + 15);

    doc.moveDown(20);

    // Footer
    doc.fontSize(8).text('This is a computer-generated invoice.', { align: 'center' });
    doc.text('Thank you for your business!', { align: 'center' });

    doc.end();
    
    stream.on('finish', () => {
      resolve(filepath);
    });
    
    stream.on('error', reject);
  });
};

