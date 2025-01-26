const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// 公开路由
router.post('/login', authController.login);
router.post('/register', authController.register);

// 需要验证的路由
router.get('/verify', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;