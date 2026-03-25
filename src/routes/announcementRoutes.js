const express = require('express');
const router  = express.Router();
const announcementController = require('../controllers/announcementController');

router.get('/',    announcementController.getAll);
router.get('/:id', announcementController.getOne);

module.exports = router;
