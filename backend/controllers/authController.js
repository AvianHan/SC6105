// backend/controllers/authController.js

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
    const { accountId, password, nickname, reviewer, author, field } = req.body;
    
    if (reviewer && !field) {
      return res.status(400).json({ error: '评审者必须选择领域' });
    }

    await Account.create(accountId, password, nickname, reviewer, author, field);
    res.status(201).json({ message: '注册成功' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: '账号已存在' });
    }
    console.error(err);
    res.status(500).json({ error: '服务器错误' });
  }
};

// ============ 新增 ============

/**
 * updateUser: 更新昵称 / 领域 / 密码 (可选)
 * 需要先通过 authMiddleware，因此从 req.user 中获得当前登录者 ID
 * 前端会传 { nickname, field, newPassword }
 */
exports.updateUser = async (req, res) => {
  try {
    const { nickname, field, newPassword } = req.body;

    // 在 authMiddleware 已解出:
    //   req.user = { accountId, nickname, reviewer, author, iat, exp }
    const userInToken = req.user; 
    if (!userInToken?.accountId) {
      return res.status(401).json({ success: false, message: '未登录或token无效' });
    }

    // 先拿数据库里旧信息
    const oldInfo = await Account.findById(userInToken.accountId);
    if (!oldInfo) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    // 如果用户想改密码，就哈希，否则保留原密码
    let finalPasswordHash = oldInfo.password;
    if (newPassword && newPassword.trim()) {
      finalPasswordHash = await bcrypt.hash(newPassword.trim(), 10);
    }

    // 调用 update
    await Account.update(userInToken.accountId, {
      nickname: nickname || oldInfo.nickname,
      field: field || oldInfo.field,
      password: finalPasswordHash
    });

    return res.json({
      success: true,
      message: '更新成功',
      updated: {
        nickname: nickname || oldInfo.nickname,
        field: field || oldInfo.field
      }
    });
  } catch (error) {
    console.error('updateUser error:', error);
    res.status(500).json({ success: false, message: '服务器错误', error });
  }
};
