const express = require('express');
const router  = express.Router();
const paymentController = require('../controllers/paymentController');
const receiptController = require('../controllers/receiptController');
const { authenticate } = require('../middleware/auth');

router.post('/initialize', authenticate, paymentController.initialize);
router.get('/verify/:reference', authenticate, paymentController.verify);
router.get('/receipt/:reference', authenticate, receiptController.getReceipt);
router.post('/webhook', paymentController.webhook);

module.exports = router;
