const express = require('express');
const router  = express.Router();
const adminController = require('../controllers/adminController');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth, requireRole('admin'));

router.get('/stats',    adminController.getStats);
router.get('/users',    adminController.getAllUsers);
router.patch('/users/:id/role', adminController.updateUserRole);
router.get('/payments', adminController.getPayments);
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/contacts', adminController.getContacts);
router.patch('/settings/:key', adminController.updateGlobalSetting);
router.patch('/settings', adminController.updateSettings);

module.exports = router;
