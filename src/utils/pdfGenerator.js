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

module.exports = { generateArticlePDF };
