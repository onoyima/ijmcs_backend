const express = require('express');
const router  = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

router.post('/initialize', authenticate, paymentController.initialize);
router.get('/verify/:reference', authenticate, paymentController.verify);

module.exports = router;
