const express = require('express');
const router  = express.Router();
const submissionController = require('../controllers/submissionController');
const { authenticate }    = require('../middleware/auth');
const upload               = require('../config/multer');

router.use(authenticate); // All submission routes require login

router.post('/',              submissionController.create);
router.post('/:id/upload',    upload.single('manuscript'), submissionController.uploadFile);
router.get('/my-submissions', submissionController.getMySubmissions);

module.exports = router;
