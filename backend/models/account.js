const pool = require('../config/database');
const bcrypt = require('bcrypt');

// 添加调试信息
console.log('Database pool:', pool);
console.log('Pool connection info:', {
  host: pool.pool.config.connectionConfig.host,
  user: pool.pool.config.connectionConfig.user,
  database: pool.pool.config.connectionConfig.database
});

class Account {
  static async findById(accountId) {
    try {
      console.log('Attempting to find account:', accountId);
      const [rows] = await pool.query('SELECT * FROM account WHERE account_id = ?', [accountId]);
      console.log('Query result:', rows);
      return rows[0];
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  static async create(accountId, password, nickname, reviewer, author) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        'INSERT INTO account (account_id, password, nickname, reviewer, author) VALUES (?, ?, ?, ?, ?)',
        [accountId, hashedPassword, nickname, reviewer, author]
      );
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }
}

module.exports = Account;