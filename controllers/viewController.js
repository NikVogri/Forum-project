const uniqid = require('uniqid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('sequelize');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');

exports.getIndex = async (req, res, next) => {
  let user;
  if (req.cookies.jwt) {
    user = jwt.decode(req.cookies.jwt).data;
  }
  const posts = await Post.findAll({
    order: [['createdAt', 'DESC']]
  });
  res.status(200).render('index', {
    title: 'Lightweight Forum | All Posts',
    posts,
    user
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
  try {
    const id = uniqid.process();
    if (req.body.title && req.body.body) {
      await Post.create({
        poster: jwt.decode(req.cookies.jwt).data.username,
        title: req.body.title,
        body: req.body.body,
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
  try {
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
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
    next();
  }
};

exports.findPostbyQuery = async (req, res, next) => {
  try {
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
    if (posts.length === 0) {
      res.status(200).render('notFound', {
        title: 'Lightweight Forum | Post'
      });
    } else {
      res.status(200).render('index', {
        title: 'Lightweight Forum | Post',
        posts
      });
    }
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
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
    next();
  }
};

exports.signup = async (req, res, next) => {
  try {
    res.status(200).render('register', {
      title: 'Lightweight Forum | Create User'
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

exports.login = async (req, res, next) => {
  try {
    res.status(200).render('login', {
      title: 'Lightweight Forum | Log in'
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

exports.userLogin = async (req, res, next) => {
  try {
    // check if both email and password are presented with request
    if (req.body.email && req.body.password) {
      const user = await User.findAll({
        where: {
          email: req.body.email
        }
      });
      if (user.length === 0) {
        res.status(400).json({
          status: 'fail',
          message: 'User not found'
        });
        next();
        return;
      }
      // compare passwords
      if (bcrypt.compareSync(req.body.password, user[0].password)) {
        // send bearer token
        const jwtSigned = jwt.sign(
          {
            data: {
              username: user[0].username,
              email: user[0].email,
              name: user[0].name
            }
          },
          process.env.SECRET,
          { expiresIn: '3h' }
        );
        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
          ),
          httpOnly: true
        };
        res.cookie('jwt', jwtSigned, cookieOptions);
        res.status(200).redirect('/');
      } else {
        // return wrong password
        res.status(400).json({
          status: 'fail',
          message: 'Wrong password'
        });
        next();
      }
    } else {
      res.status(404).json({
        status: 'fail',
        message: 'Please insert username and password'
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
