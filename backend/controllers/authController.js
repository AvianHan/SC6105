const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Account = require('../models/account');

const JWT_SECRET = '123';

exports.login = async (req, res) => {
  try {
    const { accountId, password } = req.body;
    console.log("try login", accountId, password);
    const user = await Account.findById(accountId);

    if (!user) {
      return res.status(401).json({ error: '账号不存在' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: '密码错误' });
    }

    const token = jwt.sign(
      {
        accountId: user.account_id,
        nickname: user.nickname,
        reviewer: user.reviewer,
        author: user.author
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '服务器错误' });
  }
};

exports.register = async (req, res) => {
  try {
    const { accountId, password, nickname, reviewer, author } = req.body;
    await Account.create(accountId, password, nickname, reviewer, author);
    res.status(201).json({ message: '注册成功' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: '账号已存在' });
    }
    console.error(err);
    res.status(500).json({ error: '服务器错误' });
  }
};