// backend/models/paper.js

const dbPromise = require('../config/database');

class Paper {
  static async getDb() {
    return await dbPromise;
  }

  /**
   * 推荐论文：额外连到 paper_reviewers，查看评审状态
   */
  static async getRecommendedPapers() {
    try {
      const db = await this.getDb();
      const query = `
        SELECT 
          p.title, 
          p.abstract, 
          p.DID, 
          p.timestamp, 
          p.keywords,
          group_concat(DISTINCT a.nickname) AS authors,
          group_concat(DISTINCT pr.status) AS reviewStatuses
        FROM paper p
        LEFT JOIN paper_authors pa ON p.DID = pa.DID
        LEFT JOIN account a ON pa.author_id = a.account_id
        LEFT JOIN paper_reviewers pr ON p.DID = pr.paper_id
        GROUP BY p.DID, p.title, p.abstract, p.timestamp, p.keywords
        ORDER BY p.timestamp DESC
        LIMIT 5
      `;
      const results = await db.all(query);
      return results;
    } catch (error) {
      console.error('Error getting recommended papers:', error);
      throw error;
    }
  }

  /**
   * 搜索功能
   */
  static async search(keyword) {
    try {
      const db = await this.getDb();
      const query = `
        SELECT
          p.title, 
          p.abstract, 
          p.DID,
          p.timestamp,
          p.keywords,
          group_concat(DISTINCT a.nickname) AS authors,
          group_concat(DISTINCT pr.status) AS reviewStatuses
        FROM paper p
        LEFT JOIN paper_authors pa ON p.DID = pa.DID
        LEFT JOIN account a ON pa.author_id = a.account_id
        LEFT JOIN paper_reviewers pr ON p.DID = pr.paper_id
        WHERE LOWER(p.title)    LIKE LOWER(?)
           OR LOWER(p.abstract) LIKE LOWER(?)
           OR LOWER(p.keywords) LIKE LOWER(?)
        GROUP BY p.DID, p.title, p.abstract, p.timestamp, p.keywords
      `;
      const searchPattern = `%${keyword}%`;
      const results = await db.all(query, [searchPattern, searchPattern, searchPattern]);
      return results;
    } catch (error) {
      console.error('Error in paper search:', error);
      throw error;
    }
  }

  /**
   * 新建论文
   */
  static async createPaper(paperData) {
    try {
      const db = await this.getDb();
      const { title, abstract, DID, keywords } = paperData;
      const keywordsString = keywords.join(', ');
      const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const query = `
        INSERT INTO paper (title, abstract, DID, timestamp, keywords)
        VALUES (?, ?, ?, ?, ?)
      `;

      const result = await db.run(query, [
        title,
        abstract,
        DID,
        timestamp,
        keywordsString
      ]);
      return result.lastID;
    } catch (error) {
      console.error('Error creating paper:', error);
      throw error;
    }
  }

  /**
   * 向 paper_authors 中插入 (DID, author_id)
   */
  static async addPaperAuthor(DID, authorId) {
    try {
      const db = await this.getDb();
      const sql = `INSERT INTO paper_authors (DID, author_id) VALUES (?, ?)`;
      await db.run(sql, [DID, authorId]);
    } catch (error) {
      console.error('Error adding paper_author:', error);
      throw error;
    }
  }

  /**
   * 获取作者提交的论文 + reviewStatuses
   */
  static async getPapersByAuthor(authorId) {
    try {
      const db = await this.getDb();
      const query = `
        SELECT 
          p.title, 
          p.abstract, 
          p.DID, 
          p.timestamp,
          p.keywords,
          group_concat(DISTINCT a.nickname) AS authors,
          group_concat(DISTINCT pr.status) AS reviewStatuses
        FROM paper p
        JOIN paper_authors pa ON p.DID = pa.DID
        LEFT JOIN account a ON pa.author_id = a.account_id
        LEFT JOIN paper_reviewers pr ON p.DID = pr.paper_id
        WHERE pa.author_id = ?
        GROUP BY p.DID, p.title, p.abstract, p.timestamp, p.keywords
        ORDER BY p.timestamp DESC
      `;
      const results = await db.all(query, [authorId]);
      return results;
    } catch (error) {
      console.error('Error getting papers by author:', error);
      throw error;
    }
  }

  static async getAllKeywords() {
    try {
      const db = await this.getDb();
      const query = `
        WITH RECURSIVE
        split(keyword, rest) AS (
          SELECT '', keywords || ','
          FROM paper
          UNION ALL
          SELECT
            trim(substr(rest, 0, instr(rest, ','))),
            substr(rest, instr(rest, ',') + 1)
          FROM split
          WHERE rest <> ''
        )
        SELECT DISTINCT keyword
        FROM split
        WHERE keyword <> ''
        ORDER BY keyword;
      `;
      
      const keywords = await db.all(query);
      return keywords.map(k => k.keyword);
    } catch (error) {
      console.error('Error getting keywords:', error);
      throw error;
    }
  }

  static async updateKeywords(DID, keywords) {
    try {
      const db = await this.getDb();
      const keywordsString = keywords.join(', ');
      const query = 'UPDATE paper SET keywords = ? WHERE DID = ?';
      await db.run(query, [keywordsString, DID]);
      return true;
    } catch (error) {
      console.error('Error updating keywords:', error);
      throw error;
    }
  }

  static async saveWithKeywords(DID, keywords) {
    try {
      if (keywords && keywords.length > 0) {
        return await this.updateKeywords(DID, keywords);
      }
      return true;
    } catch (error) {
      console.error('Error saving paper with keywords:', error);
      throw error;
    }
  }
}

module.exports = Paper;
