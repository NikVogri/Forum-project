const uniqid = require('uniqid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Post = require('../models/postModel');
const Comments = require('../models/commentModel');

exports.getAllUsers = async (req, res, next) => {
  try {
    const result = await User.findAll();
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

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    // Check if post exists
    const user = await User.findByPk(userId);
    if (user) {
      // Get post comments
      const comment = await Comments.findAll({ where: { poster: user.email } });
      const post = await Post.findAll({ where: { poster: user.email } });
      // Update post comments
      await user.update({
        comments: comment.length,
        posts: post.length
      });
      res.status(200).json({
        status: 'success',
        post: !user ? 'Cannot find specified user' : user
      });
      next();
    } else {
      res.status(404).json({
        status: 'fail',
        message: 'User not found'
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

exports.createUser = async (req, res, next) => {
  try {
    // check if everything necessary is presented at request
    if (
      req.body.email &&
      req.body.password &&
      req.body.confirmPassword &&
      req.body.country &&
      req.body.username
    ) {
      // check if password & confirm passwords are the same
      if (req.body.password === req.body.confirmPassword) {
        const notUnique = await User.findAll({
          where: { email: req.body.email }
        });
        // check if email is unique
        if (notUnique.length === 0) {
          const hashedPw = await bcrypt.hash(req.body.password, 10);
          const result = await User.create({
            email: req.body.email,
            password: hashedPw,
            country: req.body.country,
            name: req.body.name,
            surname: req.body.surname,
            username: req.body.username,
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
            message: 'User with that email already exists'
          });
          next();
        }
      } else {
        res.status(500).json({
          status: 'fail',
          message: 'Password and confirm password do NOT match'
        });
        next();
      }
    } else {
      res.status(500).json({
        status: 'fail',
        message: 'Please provide email, username, password & country'
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
exports.login = async (req, res, next) => {
  try {
    // check if both email and password are presented with request
    if (req.body.email && req.body.password) {
      const user = await User.findAll({
        where: {
          email: req.body.email
        }
      });
      console.log(req.body.password);
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
        const bearer = jwt.sign(
          {
            data: {
              username: user[0].username
            }
          },
          process.env.SECRET,
          { expiresIn: '3h' }
        );
        res.status(200).json({
          status: 'success',
          bearer
        });
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
exports.deleteUser = async (req, res, next) => {
  try {
    // get id and find user by id
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (user)
      User.destroy({
        where: {
          id: userId
        }
      });
    res.status(200).json({
      status: 'success',
      message: !user ? 'Can not find specified user' : 'User sucessfuly deleted'
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

exports.updateUser = async (req, res, next) => {
  try {
    // check if either name or email is presented
    if (req.body.name || req.body.email) {
      const userId = req.params.id;
      // check if database already has provided email
      const checkUnique = await User.findAll({
        where: {
          email: req.body.email
        }
      });
      if (checkUnique.length === 0) {
        const user = await User.findByPk(userId);
        if (user) {
          await User.update(
            {
              name: req.body.title,
              email: req.body.email
            },
            {
              where: {
                id: userId
              }
            }
          );
        }
        res.status(200).json({
          status: 'success',
          message: `sucessfuly updated user`
        });
        next();
      } else {
        res.status(400).json({
          status: 'fail',
          message: 'User with that email already exists'
        });
        next();
      }
    } else {
      res.status(400).json({
        status: 'fail',
        message: 'Please update either name or email!'
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

exports.verifyToken = async (req, res, next) => {
  try {
    const bearerHeader = req.cookies.jwt;
    if (bearerHeader) {
      req.token = bearerHeader;
      next();
    } else {
      res.status(400).json({
        status: 'fail',
        message: 'User not logged in'
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
    next();
  }
};

exports.checkStatus = (req, res, next) => {
  jwt.verify(req.token, process.env.SECRET, err => {
    if (err) {
      res.status(500).json({
        status: 'fail',
        message: err.message
      });
    } else {
      next();
    }
  });
};

exports.logout = (req, res, next) => {
  res.clearCookie('jwt').redirect('/');
  next();
};
