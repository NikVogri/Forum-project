const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/post/:id', viewController.getPost);
router.get('/', viewController.getIndex);

module.exports = router;
