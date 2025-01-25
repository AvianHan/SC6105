const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1361',
  database: 'sc6105'
});

module.exports = pool;