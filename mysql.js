const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config({
  path: './config.env'
});

// Create connection to MySQL
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
};

const DB = mysql.createConnection(dbConfig);
// Validate connection
DB.connect(err => {
  if (err) {
    console.log(err);
  } else {
    console.log('DB connection sucessful');
  }
});

module.exports = DB;
