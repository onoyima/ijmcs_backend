const express = require('express');
const router  = express.Router();
const articleController = require('../controllers/articleController');

router.get('/search',    articleController.search);
router.get('/:id',       articleController.getOne);

module.exports = router;
