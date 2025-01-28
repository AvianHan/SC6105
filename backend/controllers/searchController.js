// backend/controllers/searchController.js

const Paper = require('../models/paper');

exports.searchPapers = async (req, res) => {
  try {
    const keyword = req.query.query?.trim();
    
    if (!keyword) {
      return res.json({ results: [] });
    }

    console.log('Searching papers with keyword:', keyword);
    const results = await Paper.search(keyword);
    
    res.json({ results });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
};