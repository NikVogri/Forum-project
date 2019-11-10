const uniqid = require('uniqid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('sequelize');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');

// BASIC RENDERS
exports.getIndex = async (req, res, next) => {
  let user;
  if (req.loggedIn) {
    user = await jwt.decode(req.cookies.jwt).data;
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
  let user;
  if (req.loggedIn) {
    user = await jwt.decode(req.cookies.jwt).data;
  }
  res.status(200).render('createPost', {
    title: 'Lightweight Forum | Create Post',
    user
  });
  next();
};

exports.getUser = async (req, res, next) => {
  try {
    let user;
    if (req.loggedIn) {
      user = await jwt.decode(req.cookies.jwt).data;
    }
    let currentUser = await User.findAll({
      where: { username: user.username }
    });
    const userPosts = await Post.findAll({
      where: {
        poster: user.username
      }
    });
    currentUser = currentUser[0];
    res.status(200).render('profile', {
      title: 'Lightweight Forum | Create Post',
      currentUser,
      userPosts: userPosts || '',
      user
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

exports.getPost = async (req, res, next) => {
  try {
    let user;
    if (req.loggedIn) {
      user = await jwt.decode(req.cookies.jwt).data;
    }
    const post = await Post.findByPk(req.params.id);
    const comments = await Comment.findAll({
      where: {
        post_id: req.params.id
      }
    });
    res.status(200).render('post', {
      title: 'Lightweight Forum | Post',
      post,
      comments,
      user
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

exports.getLogin = async (req, res, next) => {
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

// RENDERS WITH LOGIC
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

exports.findPostbyQuery = async (req, res, next) => {
  try {
    let user;
    if (req.loggedIn) {
      user = await jwt.decode(req.cookies.jwt).data;
    }
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
        title: 'Lightweight Forum | Post',
        user
      });
    } else {
      res.status(200).render('index', {
        title: 'Lightweight Forum | Post',
        posts,
        user
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
    let user;
    if (req.loggedIn) {
      user = await jwt.decode(req.cookies.jwt).data;
    }
    const post = await Post.findByPk(req.params.id);
    if (post && user) {
      const { id } = req.params;
      await Comment.create({
        body: req.body.body,
        poster: user.username, //change this
        id: uniqid.process(),
        post_id: id
      });
      res.status(200).redirect(`/post/${id}`);
      next();
    } else {
      res.status(404).json({
        status: 'fail', // add error handler
        message: 'Please log in'
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

exports.getSignup = async (req, res, next) => {
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
      console.log(req.body.password, user[0].password);
      // compare passwords
      if (bcrypt.compareSync(req.body.password, user[0].password)) {
        // send bearer token
        const jwtSigned = jwt.sign(
          {
            data: {
              username: user[0].username
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

exports.register = async (req, res, next) => {
  try {
    const checkUsername = await User.findAll({
      where: { username: req.body.username }
    });
    const checkEmail = await User.findAll({
      where: { email: req.body.email }
    });
    if (checkUsername.length === 0 && checkEmail.length === 0) {
      const hashedPw = await bcrypt.hash(req.body.password, 10);
      if (req.body.password === req.body.confirmPassword) {
        await User.create({
          id: uniqid.process(),
          email: req.body.email,
          password: hashedPw,
          username: req.body.username,
          name: req.body.name,
          surname: req.body.surname,
          country: req.body.country
        });
        res.status(200).redirect('/login');
        next();
      } else {
        res.status(500).json({
          status: 'fail',
          message: 'passwords do not match'
        });
        next();
      }
    } else {
      res.status(500).json({
        status: 'fail',
        message: 'User already exists, please select another email or username'
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

exports.updateVisible = async (req, res, next) => {
  try {
    const user = await User.findAll({
      where: {
        username: await jwt.decode(req.cookies.jwt).data.username
      }
    });
    if (req.body.email) {
      const checkUniqueEmail = await User.findAll({
        where: {
          email: req.body.email
        }
      });
      if (checkUniqueEmail.length === 0) {
        await User.update(
          {
            email: req.body.email
          },
          {
            where: {
              id: user[0].id
            }
          }
        );
        res.clearCookie('jwt');
        res.status(200).redirect('/login');
        next();
      }
    } else {
      res.status(400).json({
        status: 'fail',
        message: 'Please insert email address'
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

exports.updatePassword = async (req, res, next) => {
  try {
    if (
      req.body.password &&
      req.body.currentPassword &&
      req.body.confirmPassword
    ) {
      const user = await User.findAll({
        where: {
          username: await jwt.decode(req.cookies.jwt).data.username
        }
      });
      if (bcrypt.compareSync(req.body.currentPassword, user[0].password)) {
        if (req.body.password === req.body.confirmPassword) {
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          await User.update(
            {
              password: hashedPassword
            },
            {
              where: {
                username: await jwt.decode(req.cookies.jwt).data.username
              }
            }
          );
          res.clearCookie('jwt');
          res.status(200).redirect('login');
          next();
        } else {
          res.status(500).json({
            status: 'fail',
            message: 'New password and confirm password do not match!'
          });
          next();
        }
      } else {
        res.status(500).json({
          status: 'fail',
          message: 'Current password is not correct, please try again'
        });
        next();
      }
    } else {
      res.status(500).json({
        status: 'fail',
        message:
          'Please insert current password, new password and confirm password'
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

exports.ratePost = async (req, res, next) => {
  try {
    if (req.params.rating === 'like') {
      const like = await Post.findAll({
        where: {
          id: req.params.postId
        }
      });
      await Post.update(
        {
          like: like[0].like + 1
        },
        {
          where: {
            id: req.params.postId
          }
        }
      );
    }
    if (req.params.rating === 'dislike') {
      const dislike = await Post.findAll({
        where: {
          id: req.params.postId
        }
      });
      await Post.update(
        {
          dislike: dislike[0].dislike + 1
        },
        {
          where: {
            id: req.params.postId
          }
        }
      );
    }
    res.status(200).redirect('back');
    next();
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
    next();
  }
};
