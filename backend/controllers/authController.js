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

exports.updateUser = async (req, res) => {
  try {
    const { oldPassword, newPassword, accountId } = req.body;
    console.log('Received request body:', { 
      accountId,
      oldPasswordLength: oldPassword?.length,
      newPasswordLength: newPassword?.length 
    });

    if (!oldPassword || !newPassword) {
      console.log('Missing password(s)');
      return res.status(400).json({
        success: false,
        message: '请提供当前密码和新密码'
      });
    }

    const oldInfo = await Account.findById(accountId);
    console.log('Found user:', oldInfo ? 'yes' : 'no');
    
    if (!oldInfo) {
      console.log('User not found for id:', accountId);
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    const isValidPassword = await bcrypt.compare(oldPassword, oldInfo.password);
    console.log('Password validation result:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('Invalid password for user:', accountId);
      return res.status(401).json({
        success: false,
        message: '当前密码错误'
      });
    }

    // 更新新密码
    const finalPasswordHash = await bcrypt.hash(newPassword.trim(), 10);
    await Account.update(req.body.accountId, {
      nickname: oldInfo.nickname,
      field: oldInfo.field,
      password: finalPasswordHash
    });

    return res.json({
      success: true,
      message: '密码更新成功'
    });

  } catch (error) {
    console.error('updateUser error:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误', 
      error 
    });
  }
};