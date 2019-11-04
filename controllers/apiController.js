const database = require('../mysql');

exports.getAllPosts = async (req, res, next) => {
  try {
    const sql = 'SELECT * FROM Posts';
    await database.query(sql, (err, result) => {
      res.status(200).json({
        status: 'success',
        result
      });
      next();
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
    next();
  }
};
