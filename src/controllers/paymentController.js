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
          'INSERT IGNORE INTO payments (submission_id, amount, status, reference, user_id, provider) VALUES (?, ?, "completed", ?, ?, "paystack")',
          [submission_id, response.data.data.amount / 100, reference, req.user.id]
        );
        // Update submission status to paid/processing
        await pool.query('UPDATE submissions SET status = "in_production" WHERE id = ?', [submission_id]);
      }
      
      res.json(response.data);
    } catch (err) { next(err); }
  },

  // POST /api/payments/webhook
  webhook: async (req, res, next) => {
    try {
      const crypto = require('crypto');
      const secret = process.env.PAYSTACK_SECRET_KEY;
      
      // Validate event signature
      const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
      if (hash === req.headers['x-paystack-signature']) {
        const event = req.body;
        
        if (event.event === 'charge.success') {
          const { reference, amount, metadata, customer } = event.data;
          const submission_id = metadata.submission_id;
          
          // Securely mark payment as completed. Using 0 for user_id since webhook context lacks user Auth, 
          // or we can fetch the author_id from submission.
          const [submissions] = await pool.query('SELECT author_id FROM submissions WHERE id = ?', [submission_id]);
          const author_id = submissions.length ? submissions[0].author_id : 0;

          await pool.query(
            'INSERT INTO payments (submission_id, user_id, amount, provider, reference, status) VALUES (?, ?, ?, "paystack", ?, "completed") ON DUPLICATE KEY UPDATE status="completed"',
            [submission_id, author_id, amount / 100, reference]
          );
          
          await pool.query('UPDATE submissions SET status = "in_production" WHERE id = ?', [submission_id]);
          console.log(`Webhook Processed: Payment verified for Submission ID: ${submission_id}`);
        }
      }
      res.sendStatus(200);
    } catch (err) { 
      console.error('Webhook Error:', err);
      res.sendStatus(500); 
    }
  }
};

module.exports = paymentController;
