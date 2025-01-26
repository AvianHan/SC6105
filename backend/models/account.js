const pool = require('../config/database');
const bcrypt = require('bcrypt');

class Account {
  static async findById(accountId) {
    const [rows] = await pool.query('SELECT * FROM Accounts WHERE account_id = ?', [accountId]);
    return rows[0];
  }

  static async create(accountId, password, nickname, reviewer, author) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO Accounts (account_id, password, nickname, reviewer, author) VALUES (?, ?, ?, ?, ?)',
      [accountId, hashedPassword, nickname, reviewer, author]
    );
  }
}
module.exports = Account;