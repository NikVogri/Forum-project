const Sequelize = require('sequelize');
const sequelize = require('../mysql');

const { Model } = Sequelize;

class User extends Model {}

User.init(
  {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    surname: {
      type: Sequelize.STRING,
      allowNull: true
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false
    },
    posts: {
      type: Sequelize.STRING,
      allowNull: true
    },
    comments: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'User'
  }
);

module.exports = User;
