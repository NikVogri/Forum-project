const express = require('express');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');

const router = express.Router();
//
// API ROUTES
// //

// Normal routes
router
  .route('/posts')
  .post(postController.createPost)
  .get(postController.getAllPosts);

// Routes with specified ID
router
  .route('/post/:id')
  .get(postController.getPost)
  .delete(postController.deletePost)
  .patch(postController.updatePost)
  .post(commentController.createComment);

router.route('/comments').get(commentController.getAllComments);
router
  .route('/comments/:id')
  .patch(commentController.editComment)
  .delete(commentController.deleteComment);
module.exports = router;