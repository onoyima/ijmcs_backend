const express = require('express');
const router  = express.Router();
const submissionController = require('../controllers/submissionController');
const { authenticate, requireRole } = require('../middleware/auth');
const upload               = require('../config/multer');

router.use(authenticate); // All submission routes require login

router.post('/',              submissionController.create);
router.post('/:id/upload',    upload.single('manuscript'), submissionController.uploadFile);
router.get('/my-submissions', submissionController.getMySubmissions);

// Editorial Routes
router.post('/:id/decide',  requireRole(['editor', 'admin']), submissionController.editorDecision);
router.post('/:id/publish', requireRole(['editor', 'admin']), submissionController.publishArticle);

module.exports = router;
