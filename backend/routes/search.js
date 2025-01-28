const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// 公开路由
router.get('/', searchController.searchPapers);
router.get('/recommended', searchController.getRecommendedPapers);

module.exports = router;