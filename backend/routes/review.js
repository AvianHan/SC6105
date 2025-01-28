// backend/routes/review.js
const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController');

// 发起邀请
router.post('/invite', reviewController.inviteReview);

// 评审回应(接受/拒绝)
router.post('/respond', reviewController.respondInvitation);

// 提交评审意见
router.post('/submit', reviewController.submitReview);

// 获取我被邀请的论文（可带status参数）
router.get('/myInvitations', reviewController.getMyInvitations);

module.exports = router;
