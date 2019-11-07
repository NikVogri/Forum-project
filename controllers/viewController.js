const Post = require('../models/postModel');

exports.getIndex = async (req, res, next) => {
  const posts = await Post.findAll();
  res.status(200).render('index', {
    title: 'Lightweight Forum | All Posts',
    posts
  });
  next();
};

exports.getPost = async (req, res, next) => {
  console.log(req.params.id);
  const post = await Post.findByPk(req.params.id);
  res.status(200).render('post', {
    title: 'Lightweight Forum | Post',
    post
  });
  next();
};
