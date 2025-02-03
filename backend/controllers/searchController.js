// backend/controllers/searchController.js

const Paper = require('../models/paper');

exports.getRecommendedPapers = async (req, res) => {
  try {
    const results = await Paper.getRecommendedPapers();
    res.json({ results });
  } catch (err) {
    console.error('Get recommended papers error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
};

exports.searchPapers = async (req, res) => {
  try {
    const keyword = req.query.query?.trim();
    if (!keyword) {
      return res.json({ results: [] });
    }
    const results = await Paper.search(keyword);
    res.json({ results });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
};
