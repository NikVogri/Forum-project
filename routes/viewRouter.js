const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/post/:id', viewController.getPost);
router.get('/', viewController.getIndex);
router.get(
  '/newPost',
  authController.verifyToken,
  authController.checkStatus,
  viewController.getCreatePost
);
router.use('/newPost/createNew', viewController.createPost);
router.use('/search/post', viewController.findPostbyQuery);
router.use('/post/:id/createComment', viewController.createComment);
router.use('/signup', viewController.signup);
router.use('/login', viewController.login);
router.use('/userLogin', viewController.userLogin);
router.use('/logout', userController.logout);
module.exports = router;
