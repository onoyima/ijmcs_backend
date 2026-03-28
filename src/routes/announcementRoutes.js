const express = require('express');
const router  = express.Router();
const announcementController = require('../controllers/announcementController');
const { auth, requireRole } = require('../middleware/auth');

router.get('/', announcementController.getAll);
router.get('/:id', announcementController.getOne);

// Protected Management Routes
router.post('/', auth, requireRole('admin', 'editor'), announcementController.create);
router.put('/:id', auth, requireRole('admin', 'editor'), announcementController.update);
router.delete('/:id', auth, requireRole('admin', 'editor'), announcementController.delete);

module.exports = router;
