const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();
// RENDERS
router.use(authController.isLoggedIn);
router.get('/', viewController.getIndex);
router.get(
  '/newPost',
  authController.verifyToken,
  authController.checkStatus,
  viewController.getCreatePost
);
router.get('/post/:id', viewController.getPost);
// FORMS
router.post('/search/post', viewController.findPostbyQuery);
router.post('/post/:id/createComment', viewController.createComment);
router.post('/userLogin', viewController.userLogin);
router.post('/newPost/createNew', viewController.createPost);
router.post('/register', viewController.register);
// PATCHES
router.post('/updateVisible', viewController.updateVisible);
router.post('/updatePassword', viewController.updatePassword);
router.patch(
  '/updateImage',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto
);
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
