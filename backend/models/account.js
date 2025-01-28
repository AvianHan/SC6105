// backend/models/account.js

const dbPromise = require('../config/database');
const bcrypt = require('bcrypt');

class Account {
  static async findById(accountId) {
    try {
      console.log('Attempting to find account:', accountId);

      const db = await dbPromise;
      // sqlite 中可以用 get() 拿一条数据, 返回的是一个对象
      const row = await db.get('SELECT * FROM account WHERE account_id = ?', [accountId]);
      
      console.log('Query result:', row);
      return row;
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  static async create(accountId, password, nickname, reviewer, author,field) {
    try {
      const db = await dbPromise;
      const hashedPassword = await bcrypt.hash(password, 10);

      // 使用 run() 执行 INSERT/UPDATE/DELETE
      await db.run(
        `INSERT INTO account (account_id, password, nickname, reviewer, author, field)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [accountId, hashedPassword, nickname, reviewer, author, field]
      );
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }
}

module.exports = Account;


// const pool = require('../config/database');
// const bcrypt = require('bcrypt');

// // 添加调试信息
// console.log('Database pool:', pool);
// console.log('Pool connection info:', {
//   host: pool.pool.config.connectionConfig.host,
//   user: pool.pool.config.connectionConfig.user,
//   database: pool.pool.config.connectionConfig.database
// });

// class Account {
//   static async findById(accountId) {
//     try {
//       console.log('Attempting to find account:', accountId);
//       const [rows] = await pool.query('SELECT * FROM account WHERE account_id = ?', [accountId]);
//       console.log('Query result:', rows);
//       return rows[0];
//     } catch (error) {
//       console.error('Error in findById:', error);
//       throw error;
//     }
//   }

//   static async create(accountId, password, nickname, reviewer, author) {
//     try {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       await pool.query(
//         'INSERT INTO account (account_id, password, nickname, reviewer, author) VALUES (?, ?, ?, ?, ?)',
//         [accountId, hashedPassword, nickname, reviewer, author]
//       );
//     } catch (error) {
//       console.error('Error in create:', error);
//       throw error;
//     }
//   }
// }

// module.exports = Account;