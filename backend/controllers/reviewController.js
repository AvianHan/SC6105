// backend/controllers/reviewController.js

const reviewModel = require('../models/reviewModel');

/**
 * 邀请评审
 * 示例：
 *   1) 获取paper的keywords
 *   2) 找到所有reviewer=1的用户 (可在后续根据paper_keywords和reviewer.field做匹配)
 *   3) 在 paper_reviewers 表里插入记录 status='invited'
 */
exports.inviteReview = async (req, res) => {
  try {
    const { paper_id } = req.body;
    if (!paper_id) {
      return res.status(400).json({ success: false, message: 'paper_id required' });
    }

    // 1) 获取paper信息
    const paper = await reviewModel.getPaperById(paper_id);
    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }
    // 取出paper的keywords
    const paperKeywords = paper.keywords ? paper.keywords.split(',').map(s => s.trim()) : [];

    // 2) 获取所有具备reviewer=1的账户
    const reviewers = await reviewModel.getAllReviewers();

    // 3) 如果你想只邀请“领域匹配”的人，则筛选一下
    const matchedReviewers = reviewers.filter(r => {
      if (!r.field) return false;
      return paperKeywords.some(kw => r.field.includes(kw));
    });

    let invitedCount = 0;
    for (let r of matchedReviewers) {
      // 看是否已有记录
      const exist = await reviewModel.getPaperReviewer(paper_id, r.id);
      if (!exist) {
        await reviewModel.insertPaperReviewer(paper_id, r.id, 'invited');
        invitedCount++;
      }
    }

    return res.json({ success: true, message: 'Invite success', invitedCount });
  } catch (error) {
    console.error('[inviteReview error]', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


/**
 * 接受 or 拒绝 评审邀请
 */
exports.respondInvitation = async (req, res) => {
  try {
    const { paper_id, reviewer_id, accept } = req.body;
    if (!paper_id || !reviewer_id) {
      return res.status(400).json({ success: false, message: 'paper_id and reviewer_id required' });
    }

    // 先看是否存在
    const record = await reviewModel.getPaperReviewer(paper_id, reviewer_id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'No invite record found' });
    }

    const newStatus = accept ? 'accepted' : 'rejected';
    await reviewModel.updatePaperReviewerStatus(paper_id, reviewer_id, newStatus);

    return res.json({ success: true, message: `Invitation ${newStatus}` });
  } catch (error) {
    console.error('[respondInvitation error]', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


/**
 * 提交评审
 */
exports.submitReview = async (req, res) => {
  try {
    const { paper_id, reviewer_id, review_content } = req.body;
    if (!paper_id || !reviewer_id) {
      return res.status(400).json({ success: false, message: 'paper_id and reviewer_id required' });
    }

    const record = await reviewModel.getPaperReviewer(paper_id, reviewer_id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Review record not found' });
    }

    if (record.status !== 'accepted') {
      return res.status(400).json({ success: false, message: 'Cannot submit unless status=accepted' });
    }

    await reviewModel.updatePaperReviewContent(paper_id, reviewer_id, review_content);
    return res.json({ success: true, message: 'Review submitted' });
  } catch (error) {
    console.error('[submitReview error]', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


/**
 * 获取(列出)某个reviewer被邀请的论文列表
 *   可选：仅列出 invited / accepted / submitted
 */
exports.getMyInvitations = async (req, res) => {
  try {
    const reviewerId = req.query.reviewer_id;
    const status = req.query.status || 'invited'; // 默认查询invited
    if (!reviewerId) {
      return res.status(400).json({ success: false, message: 'reviewer_id required' });
    }

    const invitations = await reviewModel.getInvitationsByReviewer(reviewerId, status);
    return res.json({ success: true, invitations });
  } catch (error) {
    console.error('[getMyInvitations error]', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
