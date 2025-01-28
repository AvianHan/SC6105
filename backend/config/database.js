// backend/config/database.js

const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function initDB() {
  const db = await open({
    filename: path.join(__dirname, './database.db'),
    driver: sqlite3.Database
  });
  
  console.log('Successfully connected to SQLite database');
  return db;
}

module.exports = initDB();


// const mysql = require('mysql2/promise');

// const pool = mysql.createPool({
//   host: 'localhost',
//   port: 3307,
//   user: 'root',
//   password: '1361l',
//   database: 'sc6105',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// // 立即测试连接
// (async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log('Successfully connected to MySQL database');

//     connection.release();
//   } catch (err) {
//     console.error('Failed to connect to MySQL:', err);
//     process.exit(1); // 如果数据库连接失败，终止程序
//   }
// })();

// module.exports = pool;