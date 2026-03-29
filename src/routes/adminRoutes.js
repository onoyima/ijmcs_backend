const express = require('express');
const router  = express.Router();
const adminController = require('../controllers/adminController');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth, requireRole('admin'));

router.get('/stats',    adminController.getStats);
router.get('/users',    adminController.getAllUsers);
router.patch('/users/:id/role', adminController.updateUserRole);
router.patch('/users/:id/verify', adminController.verifyUser);
router.patch('/users/:id/update', adminController.updateUser);
router.get('/payments', adminController.getPayments);
router.post('/payments/verify/:reference', adminController.verifyPaymentAdmin);
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/contacts', adminController.getContacts);
router.patch('/settings/:key', adminController.updateGlobalSetting);
router.patch('/settings', adminController.updateSettings);

// Issues
router.get('/issues', adminController.getIssues);
router.post('/issues', adminController.createIssue);
router.patch('/issues/:id', adminController.updateIssue);
router.patch('/issues/:id/publish', adminController.publishIssue);
router.patch('/issues/:id/set-active', adminController.setActiveIssue);
router.delete('/issues/:id', adminController.deleteIssue);

// Submissions (Admin view)
router.get('/submissions', adminController.getAllSubmissions);

module.exports = router;
