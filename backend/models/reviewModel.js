// backend/models/review.js
const db = require('../config/database');

/**
 * 根据 paper_id 获取 paper 记录
 */
async function getPaperById(paperId) {
  return await db.get(`SELECT rowid AS id, * FROM paper WHERE rowid=?`, [paperId]);
}

/**
 * 获取所有具备 reviewer=1 的用户（可根据需要做更多条件）
 */
async function getAllReviewers() {
  return await db.all(`SELECT rowid AS id, * FROM account WHERE reviewer=1`);
}

/**
 * 根据 paper_id 和 reviewer_id 查找是否已有邀请记录
 */
async function getPaperReviewer(paperId, reviewerId) {
  return await db.get(
    `SELECT * FROM paper_reviewers WHERE paper_id=? AND reviewer_id=?`,
    [paperId, reviewerId]
  );
}

/**
 * 新增 paper_reviewers 记录
 */
async function insertPaperReviewer(paperId, reviewerId, status) {
  return await db.run(
    `INSERT INTO paper_reviewers(paper_id, reviewer_id, status) VALUES (?,?,?)`,
    [paperId, reviewerId, status]
  );
}

/**
 * 更新 paper_reviewers 状态
 */
async function updatePaperReviewerStatus(paperId, reviewerId, newStatus) {
  return await db.run(
    `UPDATE paper_reviewers SET status=? WHERE paper_id=? AND reviewer_id=?`,
    [newStatus, paperId, reviewerId]
  );
}

/**
 * 更新 paper_reviewers 的评审内容和状态
 */
async function updatePaperReviewContent(paperId, reviewerId, reviewContent) {
  return await db.run(
    `UPDATE paper_reviewers 
     SET review_content=?, status='submitted'
     WHERE paper_id=? AND reviewer_id=?`,
    [reviewContent, paperId, reviewerId]
  );
}

/**
 * 根据 reviewer_id + status 获取 paper_reviewers
 *   可选再 join paper 获取论文标题
 */
async function getInvitationsByReviewer(reviewerId, status) {
  // 这里举例在同一个查询里 join 到 paper 表
  return await db.all(`
    SELECT pr.*, p.title AS paper_title
    FROM paper_reviewers pr
    JOIN paper p ON pr.paper_id = p.rowid
    WHERE pr.reviewer_id=? AND pr.status=?`,
    [reviewerId, status]
  );
}

/**
 * 根据作者ID，获取该作者提交的论文信息(含paper表的rowid)
 *   可选再 join paper_authors
 */
async function getPapersByAuthor(authorId) {
  // 假设paper_authors 里 DID=paper表的DID 关联，但也可能用rowid或其他方式
  // 具体看你现有 schema，这里示范 rowid=paper_id
  // 如果paper_authors 里是 (DID, author_id)，
  // 你可能需要先把paper_authors和paper做一个关联
  // 具体跟你现有结构匹配就好
  return await db.all(`
    SELECT p.rowid AS paper_id, p.title, p.abstract, p.keywords, p.timestamp
    FROM paper_authors pa
    JOIN paper p ON pa.DID = p.DID
    WHERE pa.author_id = ?
  `, [authorId]);
}

module.exports = {
  getPaperById,
  getAllReviewers,
  getPaperReviewer,
  insertPaperReviewer,
  updatePaperReviewerStatus,
  updatePaperReviewContent,
  getInvitationsByReviewer,
  getPapersByAuthor
};
