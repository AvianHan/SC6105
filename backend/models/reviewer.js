// backend/models/reviewer.js

const db = require('../config/database');

const ReviewerModel = {
  // 邀请时，插入一行
  inviteReviewer: (paperId, reviewerId) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO paper_reviewers (paper_id, reviewer_id, status) VALUES (?, ?, 'invited')`;
      db.run(sql, [paperId, reviewerId], function(err) {
        if (err) {
          return reject(err);
        }
        resolve(this.lastID); // 返回新插入行的 id
      });
    });
  },

  // 提交审稿时，更新对应记录
  submitReview: (paperId, reviewerId, content) => {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE paper_reviewers
        SET status = 'submitted', content = ?
        WHERE paper_id = ? AND reviewer_id = ?
      `;
      db.run(sql, [content, paperId, reviewerId], function(err) {
        if (err) {
          return reject(err);
        }
        resolve(this.changes); // 返回修改行数
      });
    });
  },

  // 需要的话，也可以补充一个方法查找某篇论文的所有review
  findReviewsByPaperId: (paperId) => {
    // ...
  }
};

module.exports = ReviewerModel;
