const express = require('express');
const router  = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate);

// Reviewer Routes
router.get('/pending',        requireRole('reviewer', 'editor'), reviewController.getPendingReviews);
router.get('/history',        requireRole('reviewer', 'editor'), reviewController.getReviewHistory);
router.post('/:id/submit',    requireRole('reviewer', 'editor'), reviewController.submitReview);

// Editor Routes
router.get('/editor/all',     requireRole('editor', 'admin'),             reviewController.getAllForEditor);
router.post('/editor/assign', requireRole('editor', 'admin'),             reviewController.assignReviewer);
router.get('/submission/:submissionId', requireRole('editor', 'admin'),   reviewController.getSubmissionReviews);
router.get('/author/submission/:id', requireRole('author', 'editor', 'admin'), reviewController.getAuthorReviews);

module.exports = router;
