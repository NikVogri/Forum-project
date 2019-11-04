const express = require('express');
const apiController = require('./../controllers/apiController');

const router = express.Router();

router.route('/posts').get(apiController.getAllPosts);

module.exports = router;
