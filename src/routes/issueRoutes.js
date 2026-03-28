const express = require('express');
const router  = express.Router();
const issueController = require('../controllers/issueController');

router.get('/',                 issueController.getAll);
router.get('/current',          issueController.getCurrent);
router.get('/:id/articles',     issueController.getArticles);

// Editor Routes
const { authenticate, requireRole } = require('../middleware/auth');
router.post('/',              authenticate, requireRole('editor'), issueController.createIssue);
router.post('/:id/publish',   authenticate, requireRole('editor'), issueController.publishIssue);

module.exports = router;
