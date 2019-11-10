const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.use(authController.isLoggedIn);
router.get('/post/:id', viewController.getPost);
router.get('/', viewController.getIndex);
router.get(
  '/newPost',
  authController.verifyToken,
  authController.checkStatus,
  viewController.getCreatePost
);
// FORMS
router.post('/search/post', viewController.findPostbyQuery);
router.post('/post/:id/createComment', viewController.createComment);
router.post('/userLogin', viewController.userLogin);
router.post('/newPost/createNew', viewController.createPost);
router.post('/register', viewController.register);
// PATCHES
router.use('/updateVisible', viewController.updateVisible);
router.use('/updatePassword', viewController.updatePassword);
router.use('/:postId/:rating', viewController.ratePost);
// RENDERS
router.get('/signup', viewController.getSignup);
router.get('/login', viewController.getLogin);
router.get('/logout', userController.logout);
router.get(
  '/user',
  authController.verifyToken,
  authController.checkStatus,
  viewController.getUser
);
module.exports = router;
