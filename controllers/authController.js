const jwt = require('jsonwebtoken');

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
