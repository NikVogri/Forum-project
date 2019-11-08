const Sequelize = require('sequelize');
const sequelize = require('../mysql');

const { Model } = Sequelize;

class Comment extends Model {}
Comment.init(
  {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    body: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    poster: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    post_id: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Comment'
  }
);
module.exports = Comment;
