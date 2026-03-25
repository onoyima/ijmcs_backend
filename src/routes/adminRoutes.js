const express = require('express');
const router  = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate, requireRole(['admin']));

router.get('/stats',    adminController.getStats);
router.get('/users',    adminController.getAllUsers);
router.patch('/settings', adminController.updateSettings);

module.exports = router;
