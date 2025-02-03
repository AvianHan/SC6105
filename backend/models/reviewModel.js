// backend/models/reviewModel.js

const dbPromise = require('../config/database');

/**
 * 评审相关数据库操作
 */
class ReviewModel {
  static async getDb() {
    return await dbPromise;
  }

  /**
   * 获取所有具备 reviewer=1 的用户
   */
  static async getAllReviewers() {
    const db = await this.getDb();
    return db.all(`SELECT rowid AS id, * FROM account WHERE reviewer=1`);
  }

  /**
   * 根据 paperDID 和 reviewerId 查找 paper_reviewers
   */
  static async getPaperReviewer(paperDID, reviewerId) {
    const db = await this.getDb();
    return db.get(
      `SELECT * 
         FROM paper_reviewers 
        WHERE paper_id=? 
          AND reviewer_id=?`,
      [paperDID, reviewerId]
    );
  }

  /**
   * 新增 paper_reviewers 记录
   */
  static async insertPaperReviewer(paperDID, reviewerId, status) {
    const db = await this.getDb();
    return db.run(
      `INSERT INTO paper_reviewers (paper_id, reviewer_id, status)
       VALUES (?,?,?)`,
      [paperDID, reviewerId, status]
    );
  }

  /**
   * 更新 paper_reviewers 状态
   */
  static async updatePaperReviewerStatus(paperDID, reviewerId, newStatus) {
    const db = await this.getDb();
    return db.run(
      `UPDATE paper_reviewers
          SET status=?
        WHERE paper_id=?
          AND reviewer_id=?`,
      [newStatus, paperDID, reviewerId]
    );
  }

  /**
   * 更新 paper_reviewers 的review_content并置为 submitted
   */
  static async updatePaperReviewContent(paperDID, reviewerId, reviewContent) {
    const db = await this.getDb();
    return db.run(
      `UPDATE paper_reviewers
          SET review_content=?, status='submitted'
        WHERE paper_id=?
          AND reviewer_id=?`,
      [reviewContent, paperDID, reviewerId]
    );
  }

  /**
   * 根据 reviewerId + status 拉取论文邀请列表
   */
  static async getInvitationsByReviewer(reviewerId, status) {
    const db = await this.getDb();
    return db.all(`
      SELECT pr.*, p.title AS paper_title
        FROM paper_reviewers pr
        JOIN paper p ON pr.paper_id = p.DID
       WHERE pr.reviewer_id=?
         AND pr.status=?`,
      [reviewerId, status]
    );
  }
}

module.exports = ReviewModel;
