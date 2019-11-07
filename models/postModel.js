const Sequelize = require('sequelize');
const sequelize = require('../mysql');

const { Model } = Sequelize;

class Post extends Model {}
Post.init(
  {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    body: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    poster: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    like: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    dislike: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    common_phrases: {
      type: Sequelize.TEXT,
      defaultValue: 0
    },
    comments: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  },
  {
    sequelize,
    modelName: 'Post'
  }
);
module.exports = Post;
