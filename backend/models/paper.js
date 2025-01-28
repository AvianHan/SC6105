// backend/models/paper.js

const dbPromise = require('../config/database'); // 这里拿到的是一个Promise

class Paper {
  static async search(keyword) {
    try {
      console.log('Searching papers with keyword:', keyword);

      // 拿到真正的 db 对象
      const db = await dbPromise;

      const query = `
        SELECT
          p.title,
          p.abstract,
          p.DID,
          p.timestamp,
          p.keywords,
          group_concat(a.nickname, ', ') AS authors
        FROM paper p
        LEFT JOIN paper_authors pa ON p.DID = pa.DID
        LEFT JOIN account a ON pa.author_id = a.account_id
        WHERE LOWER(p.title) LIKE LOWER(?)
           OR LOWER(p.abstract) LIKE LOWER(?)
           OR LOWER(p.keywords) LIKE LOWER(?)
        GROUP BY p.DID, p.title, p.abstract, p.timestamp, p.keywords
      `;

      const searchPattern = `%${keyword}%`;

      // sqlite 的用法：all() 返回所有结果数组
      // 注意: group_concat 在 SQLite 中是内置函数，但名称是 group_concat(小写)，不区分大小写的话大写也能用
      // 如果你的 SQLite 版本较旧，或者需要自定义分隔符，可以参考官方文档
      const results = await db.all(query, [searchPattern, searchPattern, searchPattern]);

      console.log('Search results:', results);
      return results;
    } catch (error) {
      console.error('Error in paper search:', error);
      throw error;
    }
  }
}

module.exports = Paper;


// const pool = require('../config/database');

// class Paper {
//   static async search(keyword) {
//     try {
//       console.log('Searching papers with keyword:', keyword);
//       const query = `
//         SELECT 
//           p.title, 
//           p.abstract, 
//           p.DID, 
//           p.timestamp, 
//           p.keywords,
//           GROUP_CONCAT(a.nickname SEPARATOR ', ') AS authors
//         FROM paper p
//         LEFT JOIN paper_author pa ON p.DID = pa.DID
//         LEFT JOIN account a ON pa.author_id = a.account_id
//         WHERE LOWER(p.title) LIKE LOWER(?)
//            OR LOWER(p.abstract) LIKE LOWER(?)
//            OR LOWER(p.keywords) LIKE LOWER(?)
//         GROUP BY p.DID, p.title, p.abstract, p.timestamp, p.keywords
//       `;
      
//       const searchPattern = `%${keyword}%`;
//       const [results] = await pool.query(query, [searchPattern, searchPattern, searchPattern]);
      
//       console.log('Search results:', results);
//       return results;
//     } catch (error) {
//       console.error('Error in paper search:', error);
//       throw error;
//     }
//   }
// }

// module.exports = Paper;