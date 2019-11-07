const uniqid = require('uniqid');
const Comment = require('../models/commentModel');
const Post = require('../models/postModel');

exports.createComment = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (post) {
      const { id } = req.params;
      await Comment.create({
        body: req.body.body,
        poster: req.body.poster,
        id: uniqid.process(),
        post_id: id
      });
      res.status(200).json({
        status: 'success',
        message: `Comment created successfuly`
      });
      next();
    } else {
      res.status(404).json({
        status: 'fail',
        message: 'Post with that ID could not be found'
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
exports.getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.findAll();
    res.status(200).json({
      status: 'success',
      length: comments.length,
      comments
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

exports.editComment = async (req, res, next) => {
  const { id } = req.params;
  const comment = await Comment.findByPk(id);
  try {
    if (comment && req.body.body) {
      await comment.update({
        body: req.body.body
      });
      res.status(200).json({
        status: 'success',
        comment
      });
      next();
    } else if (!comment) {
      res.status(404).json({
        status: 'fail',
        message: 'Comment with that ID is not found'
      });
      next();
    } else {
      res.status(404).json({
        status: 'fail',
        message: 'Please provide body to update'
      });
      next();
    }
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByPk(id);
    if (comment)
      Comment.destroy({
        where: {
          id
        }
      });
    res.status(200).json({
      status: 'success',
      message: !comment
        ? 'Can not find specified comment with that ID'
        : 'Comment sucessfuly deleted'
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
