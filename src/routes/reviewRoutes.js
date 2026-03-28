const express = require('express');
const router  = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate);

// Reviewer Routes
router.get('/pending',        requireRole('reviewer', 'editor'), reviewController.getPendingReviews);
router.post('/:id/submit',    requireRole('reviewer', 'editor'), reviewController.submitReview);

// Editor Routes
router.get('/editor/all',     requireRole('editor'),             reviewController.getAllForEditor);
router.post('/editor/assign', requireRole('editor'),             reviewController.assignReviewer);

module.exports = router;
