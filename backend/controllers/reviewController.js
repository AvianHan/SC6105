// backend/controllers/reviewController.js

const reviewModel = require('../models/reviewModel');

/**
 * 给 paperDID 邀请匹配到的评审(自动调用)
 * paperKeywords 是传进来的数组，如 ["Artificial Intelligence", "Deep Learning"]
 */
exports.autoInviteReviewers = async (paperDID, paperKeywords) => {
  try {
    // 1) 找到所有 reviewer=1
    const reviewers = await reviewModel.getAllReviewers();

    // 2) 做关键词匹配
    //   若需要所有人都收到，可直接 matchedReviewers = reviewers;
    const matchedReviewers = reviewers.filter(r => {
      if (!r.field) return false;
      // 只要paper里任意keyword在r.field字段字符串中出现，就视为匹配
      return paperKeywords.some(kw => r.field.includes(kw));
    });

    let invitedCount = 0;
    for (let r of matchedReviewers) {
      // 检查是否已邀请过
      const exist = await reviewModel.getPaperReviewer(paperDID, r.id);
      if (!exist) {
        await reviewModel.insertPaperReviewer(paperDID, r.id, 'invited');
        invitedCount++;
      }
    }
    console.log(`autoInviteReviewers: paperDID=${paperDID}, invitedCount=${invitedCount}`);
    return invitedCount;
  } catch (error) {
    console.error('[autoInviteReviewers error]', error);
    return 0; // 出错就邀请0人
  }
};

/**
 * 手动发起邀请(可不再用, 留下以备需要)
 */
exports.inviteReview = async (req, res) => {
  try {
    const { paper_id } = req.body; // 这里paper_id= DID
    if (!paper_id) {
      return res.status(400).json({ success: false, message: 'paper_id required' });
    }

    // 这里也可以参考 autoInviteReviewers 的逻辑
    // ...
  } catch (error) {
    // ...
  }
};

/**
 * 接受 or 拒绝
 */
exports.respondInvitation = async (req, res) => {
  try {
    const { paper_id, reviewer_id, accept } = req.body;
    if (!paper_id || !reviewer_id) {
      return res.status(400).json({ success: false, message: 'paper_id and reviewer_id required' });
    }

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
 * ?reviewer_id=xxx&status=invited/accepted
 */
exports.getMyInvitations = async (req, res) => {
  try {
    const reviewerId = req.query.reviewer_id;
    const status = req.query.status || 'invited';
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
