const axios = require('axios');
const pool  = require('../config/db');

const paymentController = {
  // POST /api/payments/initialize
  initialize: async (req, res, next) => {
    try {
      const { submission_id, amount, email } = req.body;
      
      const response = await axios.post('https://api.paystack.co/transaction/initialize', {
        email,
        amount: amount * 100, // Paystack uses kobo
        metadata: { submission_id }
      }, {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      res.json(response.data);
    } catch (err) { next(err); }
  },

  // GET /api/payments/verify/:reference
  verify: async (req, res, next) => {
    try {
      const { reference } = req.params;
      const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
      });
      
      if (response.data.data.status === 'success') {
        const { submission_id } = response.data.data.metadata;
        await pool.query(
          'INSERT INTO payments (submission_id, amount, status, reference) VALUES (?, ?, "completed", ?)',
          [submission_id, response.data.data.amount / 100, reference]
        );
        // Update submission status to paid/processing
        await pool.query('UPDATE submissions SET status = "in_production" WHERE id = ?', [submission_id]);
      }
      
      res.json(response.data);
    } catch (err) { next(err); }
  }
};

module.exports = paymentController;
