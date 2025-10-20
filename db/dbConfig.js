// db/dbConfig.js
const mysql2 = require('mysql2');

const dbconnection = mysql2.createPool({
  host: 'localhost',
  user: process.env.user,
  database: process.env.database,
  password: process.env.password,
  connectionLimit: 10,
});

module.exports = dbconnection.promise();
