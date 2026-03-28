const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generates an automated IJMCS PDF Galley Proof for an article.
 * @param {Object} articleData
 * @param {string} destPath - The file path to save the PDF
 * @returns {Promise<string>} - Resolves with the saved file path
 */
const generateArticlePDF = (articleData, destPath) => {
  return new Promise((resolve, reject) => {
    try {
      // Initialize PDFDocument with academic dimensions (roughly A4)
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      // Ensure directory exists
      const dir = path.dirname(destPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const stream = fs.createWriteStream(destPath);
      doc.pipe(stream);

      // --- BRAND HEADER ---
      doc.rect(0, 0, doc.page.width, 100).fill('#1a3a5c');
      doc.fillColor('#ffffff')
         .fontSize(22)
         .font('Times-Bold')
         .text('IJMCS', 50, 30, { align: 'center' });
      
      doc.fontSize(10)
         .font('Times-Roman')
         .text('Igniting Journal of Multidisciplinary and Contemporary Studies', { align: 'center', characterSpacing: 1 });
      
      doc.fontSize(9)
         .fillColor('#d4622a')
         .text(`Vol. ${articleData.issue_volume || 1}, No. ${articleData.issue_number || 1} (${articleData.issue_year || new Date().getFullYear()})`, { align: 'center' });
      
      // --- ARTICLE META ---
      doc.moveDown(4);
      doc.fillColor('#333333')
         .fontSize(18)
         .font('Times-Bold')
         .text(articleData.title, { align: 'left', lineGap: 4 });

      doc.moveDown(1);
      
      // Authors
      const authors = JSON.parse(articleData.authors_json || '[]');
      const authorText = authors.map(a => `${a.name}${a.is_corresponding ? '*' : ''} (${a.institution})`).join(', ');
      
      doc.fontSize(11)
         .font('Times-Italic')
         .fillColor('#1a3a5c')
         .text(authorText, { align: 'left' });

      doc.moveDown(2);

      // --- ABSTRACT ---
      doc.fontSize(12)
         .font('Times-Bold')
         .fillColor('#d4622a')
         .text('ABSTRACT', { underline: true });
         
      doc.moveDown(0.5);
      doc.fontSize(10)
         .font('Times-Roman')
         .fillColor('#333333')
         .text(articleData.abstract, { align: 'justify', lineGap: 3 });

      doc.moveDown(1);
      doc.font('Times-Bold').text('Keywords: ', { continued: true })
         .font('Times-Roman').text(articleData.keywords || 'N/A');

      doc.moveDown(2);
      
      // --- BODY ---
      doc.fontSize(12).font('Times-Bold').fillColor('#1a3a5c').text('1. INTRODUCTION');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Times-Roman').fillColor('#333333')
         .text('The full text of this manuscript is currently being formatted by the IJMCS production team. This automated Galley Proof demonstrates the successful peer-review integration and metadata capture via the Advanced Publishing Engine.', { align: 'justify', lineGap: 3 });
      
      doc.moveDown(1);
      doc.text('For the final published version, please refer to the official HTML/PDF distribution on the IJMCS platform once typesetting is complete.', { align: 'justify', lineGap: 3 });

      // --- FOOTER ---
      doc.fontSize(8)
         .font('Times-Italic')
         .fillColor('#999999')
         .text(`DOI: ${articleData.doi || 'Pending'} | Published: ${new Date().toLocaleDateString()}`, 50, doc.page.height - 40, { align: 'center' });

      doc.end();

      stream.on('finish', () => resolve(destPath));
      stream.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Generates an official IJMCS Payment Receipt.
 * @param {Object} paymentData
 * @param {string} destPath
 * @returns {Promise<string>}
 */
const generateReceiptPDF = (paymentData, destPath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margins: { top: 70, bottom: 50, left: 70, right: 70 } });
      const dir = path.dirname(destPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const stream = fs.createWriteStream(destPath);
      doc.pipe(stream);

      // Header
      doc.rect(0, 0, doc.page.width, 140).fill('#1a3a5c');
      doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold').text('OFFICIAL PAYMENT RECEIPT', 70, 50);
      doc.fontSize(10).font('Helvetica').text('Igniting Journal of Multidisciplinary and Contemporary Studies (IJMCS)', 70, 85);
      doc.text('ISSN: 2992-4529 | www.ijmcs.com', 70, 100);

      doc.moveDown(6);
      doc.fillColor('#333333').fontSize(12).font('Helvetica-Bold').text('TRANSACTION DETAILS');
      doc.rect(70, doc.y + 5, 450, 1).fill('#eeeeee');
      doc.moveDown(1.5);

      const labelX = 70;
      const valueX = 220;

      const addRow = (label, value) => {
        doc.font('Helvetica-Bold').fontSize(10).text(label, labelX, doc.y);
        doc.font('Helvetica').text(value, valueX, doc.y - 12); // value is on the same line
        doc.moveDown(1.2);
      };

      addRow('Receipt Number:', `REC-${paymentData.reference.substring(0, 8).toUpperCase()}`);
      addRow('Date:', new Date(paymentData.date).toLocaleDateString('en-US', { dateStyle: 'long' }));
      addRow('Payment Reference:', paymentData.reference);
      addRow('Paid By:', paymentData.user_name);
      addRow('Payer Email:', paymentData.email);
      doc.moveDown(1);
      
      doc.font('Helvetica-Bold').text('FOR MANUSCRIPT:', labelX, doc.y);
      doc.moveDown(0.5);
      doc.font('Helvetica').fontSize(11).text(paymentData.submission_title, { width: 450, lineGap: 3 });
      doc.moveDown(2);

      // Amount Box
      doc.rect(300, doc.y, 220, 60).fill('#f9f9f9').stroke('#dddddd');
      doc.fillColor('#1a3a5c').fontSize(14).font('Helvetica-Bold').text('TOTAL PAID', 320, doc.y + 15);
      doc.fontSize(18).text(`${paymentData.currency || 'USD'} ${paymentData.amount}`, 320, doc.y + 5);

      // Footer
      doc.fillColor('#999999').fontSize(9).font('Helvetica-Oblique').text('This is a computer-generated receipt for Article Processing Charges (APC).', 70, doc.page.height - 80, { align: 'center' });

      doc.end();
      stream.on('finish', () => resolve(destPath));
      stream.on('error', (err) => reject(err));
    } catch (err) { reject(err); }
  });
};

module.exports = { generateArticlePDF, generateReceiptPDF };
