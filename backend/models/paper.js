const pool = require('../config/database');

class Paper {
  static async search(keyword) {
    try {
      console.log('Searching papers with keyword:', keyword);
      const query = `
        SELECT 
          p.title, 
          p.abstract, 
          p.DID, 
          p.timestamp, 
          p.keywords,
          GROUP_CONCAT(a.nickname SEPARATOR ', ') AS authors
        FROM paper p
        LEFT JOIN paper_author pa ON p.DID = pa.DID
        LEFT JOIN account a ON pa.author_id = a.account_id
        WHERE LOWER(p.title) LIKE LOWER(?)
           OR LOWER(p.abstract) LIKE LOWER(?)
           OR LOWER(p.keywords) LIKE LOWER(?)
        GROUP BY p.DID, p.title, p.abstract, p.timestamp, p.keywords
      `;
      
      const searchPattern = `%${keyword}%`;
      const [results] = await pool.query(query, [searchPattern, searchPattern, searchPattern]);
      
      console.log('Search results:', results);
      return results;
    } catch (error) {
      console.error('Error in paper search:', error);
      throw error;
    }
  }
}

module.exports = Paper;