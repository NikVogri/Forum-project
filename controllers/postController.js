const uniqid = require('uniqid');
const Post = require('../models/postModel');
const Comments = require('../models/commentModel');

exports.getAllPosts = async (req, res, next) => {
  try {
    const result = await Post.findAll();
    res.status(200).json({
      status: 'success',
      length: result.length,
      result
    });
    next();
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
    next();
  }
};

exports.createPost = async (req, res, next) => {
  try {
    if (req.body.title && req.body.body && req.body.poster) {
      const result = await Post.create({
        title: req.body.title,
        body: req.body.body,
        poster: req.body.poster,
        id: uniqid.process()
      });
      res.status(200).json({
        status: 'success',
        result
      });
      next();
    } else {
      res.status(500).json({
        status: 'fail',
        message: 'Please provide title, body and original poster username!'
      });
      next();
    }
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
    next();
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    // Check if post exists
    const post = await Post.findByPk(postId);
    if (post) {
      // Get post comments
      const comment = await Comments.findAll({ where: { post_id: postId } });
      // Update post comments
      await post.update({
        comments: comment.length
      });
      res.status(200).json({
        status: 'success',
        post: !post ? 'Cannot find specified post' : post
      });
      next();
    } else {
      res.status(404).json({
        status: 'fail',
        message: 'Post not found'
      });
      next();
    }
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
    next();
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findByPk(postId);
    if (post)
      Post.destroy({
        where: {
          id: postId
        }
      });
    res.status(200).json({
      status: 'success',
      message: !post ? 'Can not find specified post' : 'Post sucessfuly deleted'
    });
    next();
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
    next();
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    if (req.body.title || req.body.body) {
      const postId = req.params.id;
      const post = await Post.findByPk(postId);
      if (post) {
        await Post.update(
          {
            title: req.body.title,
            body: req.body.body
          },
          {
            where: {
              id: postId
            }
          }
        );
      }
      res.status(200).json({
        status: 'success',
        message: `sucessfuly updated post`
      });
      next();
    } else {
      res.status(400).json({
        status: 'fail',
        message: 'Please update either body or title!'
      });
      next();
    }
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
    next();
  }
};
