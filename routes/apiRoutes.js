const express = require('express');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const userController = require('../controllers/userController');

const router = express.Router();
//
// API ROUTES
// //

// Routes with specified ID

// POSTS ROUTES
router
  .route('/posts')
  .post(
    userController.verifyToken,
    userController.checkStatus,
    postController.createPost
  )
  .get(postController.getAllPosts);

router
  .route('/post/:id')
  .get(postController.getPost)
  .delete(
    userController.verifyToken,
    userController.checkStatus,
    postController.deletePost
  )
  .patch(
    userController.verifyToken,
    userController.checkStatus,
    postController.updatePost
  )
  .post(
    userController.verifyToken,
    userController.checkStatus,
    commentController.createComment
  );

// COMMENTS ROUTES
router
  .route('/comments')
  .get(
    userController.verifyToken,
    userController.checkStatus,
    commentController.getAllComments
  );
router
  .route('/comments/:id')
  .patch(
    userController.verifyToken,
    userController.checkStatus,
    commentController.editComment
  )
  .delete(
    userController.verifyToken,
    userController.checkStatus,
    commentController.deleteComment
  );

// USER ROUTES
router
  .route('/users')
  .post(userController.createUser)
  .get(
    userController.verifyToken,
    userController.checkStatus,
    userController.getAllUsers
  );
router.route('/login').post(userController.login);
router
  .route('/users/:id')
  .get(
    userController.verifyToken,
    userController.checkStatus,
    userController.getUser
  )
  .delete(
    userController.verifyToken,
    userController.checkStatus,
    userController.deleteUser
  )
  .patch(
    userController.verifyToken,
    userController.checkStatus,
    userController.updateUser
  );
module.exports = router;
