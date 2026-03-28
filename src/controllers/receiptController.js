const pool = require('../config/db');
const { generateReceiptPDF } = require('../utils/pdfGenerator');
const path = require('path');
const fs = require('fs');

const receiptController = {
  // GET /api/payments/receipt/:reference
  getReceipt: async (req, res, next) => {
    try {
      const { reference } = req.params;
      
      // Fetch payment details joined with submission and user info
      const [rows] = await pool.query(`
        SELECT p.*, s.title as submission_title, u.first_name, u.last_name, u.email
        FROM payments p
        JOIN submissions s ON p.submission_id = s.id
        JOIN users u ON p.user_id = u.id
        WHERE p.reference = ?
      `, [reference]);

      if (!rows.length) {
        return res.status(404).json({ message: 'Payment record not found' });
      }

      const payment = rows[0];
      
      // Check if user is the owner or admin
      if (req.user.id !== payment.user_id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized access to this receipt' });
      }

      const fileName = `ijmcs_receipt_${reference}_${Date.now()}.pdf`;
      const destPath = path.join(__dirname, '../../uploads/receipts', fileName);
      
      await generateReceiptPDF({
        reference: payment.reference,
        amount: payment.amount,
        currency: payment.currency,
        date: payment.created_at,
        user_name: `${payment.first_name} ${payment.last_name}`,
        email: payment.email,
        submission_title: payment.submission_title
      }, destPath);

      // Set headers for download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      
      // Stream file to response
      const readStream = fs.createReadStream(destPath);
      readStream.pipe(res);
      
      // Optional: Delete file after sending (or keep as archive)
      readStream.on('end', () => {
        // We could delete it, but better to keep for audit logs for a while
        // fs.unlinkSync(destPath);
      });

    } catch (err) { next(err); }
  }
};

module.exports = receiptController;
