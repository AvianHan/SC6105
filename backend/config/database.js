const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: '1361l',
  database: 'sc6105',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 立即测试连接
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database');
    
    // 测试 Accounts 表是否存在
    const [tables] = await connection.query('SHOW TABLES LIKE "Accounts"');
    if (tables.length === 0) {
      console.log('Creating Accounts table...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS Accounts (
          account_id VARCHAR(255) PRIMARY KEY,
          password VARCHAR(255) NOT NULL,
          nickname VARCHAR(255),
          reviewer BOOLEAN DEFAULT false,
          author BOOLEAN DEFAULT false
        )
      `);
      console.log('Accounts table created successfully');
    } else {
      console.log('Accounts table already exists');
    }
    
    connection.release();
  } catch (err) {
    console.error('Failed to connect to MySQL:', err);
    process.exit(1); // 如果数据库连接失败，终止程序
  }
})();

module.exports = pool;