const express = require('express');
const router  = express.Router();
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

// Strict Auth Limiter: Max 5 registrations per IP per window (1 hour) to block bots
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 5,
  message: { message: 'Too many accounts created from this IP, please try again after an hour' }
});

router.post('/register',      authLimiter, authController.register);
router.post('/login',         authController.login);
router.get('/verify-email',   authController.verifyEmail);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout',        authController.logout);

module.exports = router;
