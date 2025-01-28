// backend/controllers/reviewController.js

const ReviewerModel = require('../models/reviewer'); // 如果你建了这个model

// 邀请审稿人
exports.inviteReviewer = async (req, res) => {
  try {
    const { paperId, reviewerId } = req.body;

    // 检查权限：比如你要确保当前登录用户就是这篇论文的作者之一
    // （可选的校验逻辑）

    await ReviewerModel.inviteReviewer(paperId, reviewerId);

    res.json({ success: true, message: '邀请成功' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 提交审稿
exports.submitReview = async (req, res) => {
  try {
    const { paperId, content } = req.body;
    // reviewerId 通常从当前登录用户获取(比如 token 里)
    const reviewerId = req.user.id; 
    // 或者你也可以让前端一起传；看你项目怎么做的

    await ReviewerModel.submitReview(paperId, reviewerId, content);

    res.json({ success: true, message: '审稿提交成功' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
