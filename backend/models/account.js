// backend/models/account.js

const dbPromise = require('../config/database');
const bcrypt = require('bcrypt');

class Account {
  static async findById(accountId) {
    try {
      console.log('Attempting to find account:', accountId);

      const db = await dbPromise;
      const row = await db.get('SELECT * FROM account WHERE account_id = ?', [accountId]);
      
      console.log('Query result:', row);
      return row;
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  static async create(accountId, password, nickname, reviewer, author, field) {
    try {
      const db = await dbPromise;
      const hashedPassword = await bcrypt.hash(password, 10);

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

  // ============== 新增：更新账号信息 =============
  /**
   * @param {string|number} accountId
   * @param {object} data  - { nickname, field, password } 
   *   (data.password 为最终要存进数据库的哈希，如果不改密码就保留原值)
   */
  static async update(accountId, data) {
    try {
      const db = await dbPromise;
      // data.password 已经是哈希过的(若有修改)
      await db.run(
        `UPDATE account
            SET nickname=?,
                field=?,
                password=?
          WHERE account_id=?`,
        [data.nickname, data.field, data.password, accountId]
      );
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }
}

module.exports = Account;
