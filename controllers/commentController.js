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
