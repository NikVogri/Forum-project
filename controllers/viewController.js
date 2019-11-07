const uniqid = require('uniqid');
const sequelize = require('sequelize');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

exports.getIndex = async (req, res, next) => {
  const posts = await Post.findAll({
    order: [['createdAt', 'DESC']]
  });
  res.status(200).render('index', {
    title: 'Lightweight Forum | All Posts',
    posts
  });
  next();
};

exports.getCreatePost = async (req, res, next) => {
  res.status(200).render('createPost', {
    title: 'Lightweight Forum | Create Post'
  });
  next();
};

exports.createPost = async (req, res, next) => {
  console.log(req.body);
  try {
    const id = uniqid.process();
    if (req.body.title && req.body.body) {
      await Post.create({
        poster: 'testuser',
        title: req.body.title,
        body: req.body.body,
        common_phrases: req.body.common_phrases,
        // poster: req.body.poster,
        id
      });
      res.status(200).redirect(`/post/${id}`);
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
  const post = await Post.findByPk(req.params.id);
  const comments = await Comment.findAll({
    where: {
      post_id: req.params.id
    }
  });
  res.status(200).render('post', {
    title: 'Lightweight Forum | Post',
    post,
    comments
  });
  next();
};

exports.findPostbyQuery = async (req, res, next) => {
  try {
    console.log('here');
    const posts = await Post.findAll({
      limit: 25,
      where: {
        title: sequelize.where(
          sequelize.fn('LOWER', sequelize.col('title')),
          'LIKE',
          `%${req.body.search}%`
        )
      }
    });

    res.status(200).render('index', {
      title: 'Lightweight Forum | Post',
      posts
    });
    next();
  } catch (err) {
    res.status(500).json({
      title: 'Lightweight Forum | Post',
      message: err.message
    });
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);
    console.log(req.params);
    if (post) {
      const { id } = req.params;
      await Comment.create({
        body: req.body.body,
        poster: 'testuser', //change this
        id: uniqid.process(),
        post_id: id
      });
      res.status(200).redirect(`/post/${id}`);
      next();
    } else {
      res.status(404).json({
        status: 'fail', // add error handler
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
