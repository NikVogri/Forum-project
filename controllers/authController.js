const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

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

exports.checkStatus = async (req, res, next) => {
  await jwt.verify(req.token, process.env.SECRET, err => {
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

exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const userExists = await User.findAll({
        where: { username: await jwt.decode(req.cookies.jwt).data.username }
      });
      if (userExists.length === 0) {
        req.loggedIn = false;
        res.clearCookie('jwt');
      } else {
        req.loggedIn = true;
        req.user = userExists[0];
      }
    } else req.loggedIn = false;
    next();
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
};
