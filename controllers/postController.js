const Post = require('../models/postModel');
const uniqid = require('uniqid');

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
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err
    });
    next();
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    let post = await Post.findByPk(postId);
    if (!post) post = 'Cannot find specified post';
    res.status(200).json({
      status: 'success',
      post
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
      const update = req.body;
      if (post) {
        const updatedPost = await Post.update(
          {
            title: update.title,
            body: update.body
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
