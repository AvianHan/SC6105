// routes/paper.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getAllKeywords, updatePaperKeywords } = require('../controllers/keywordController');
const { submitPaper, testServer, getMyPapers } = require('../controllers/paperController');

// 处理文件上传的配置 (内存存储)
const upload = multer({ storage: multer.memoryStorage() });

// 测试路由
router.get('/', testServer);

// 关键词相关路由
router.get('/keywords', getAllKeywords);
router.put('/keywords', updatePaperKeywords);

// 提交论文路由
router.post('/submit', upload.single('paper'), submitPaper);

router.get('/myPapers', getMyPapers);

module.exports = router;