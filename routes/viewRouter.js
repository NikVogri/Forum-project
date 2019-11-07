const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/post/:id', viewController.getPost);
router.get('/', viewController.getIndex);
router.get('/newPost', viewController.getCreatePost);
router.use('/newPost/createNew', viewController.createPost);
router.use('/search/post', viewController.findPostbyQuery);
router.use('/post/:id/createComment', viewController.createComment);

module.exports = router;
