const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

router
  .route('/posts')
  .post(postController.createPost)
  .get(postController.getAllPosts);

router
  .route('/post/:id')
  .get(postController.getPost)
  .delete(postController.deletePost)
  .patch(postController.updatePost);
module.exports = router;
