// backend/controllers/paperController.js

const { uploadFileToPinata } = require('../pinata');
const { submitPaperToContract } = require('../contract');
const Paper = require('../models/paper');
const reviewController = require('./reviewController');

// 提交论文
exports.submitPaper = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { title, abstract, author_id } = req.body;
    const keywords = req.body.keywords ? JSON.parse(req.body.keywords) : [];

    if (!title || !abstract) {
      return res.status(400).json({ success: false, message: '标题和摘要不能为空' });
    }
    if (!author_id) {
      return res.status(400).json({ success: false, message: 'author_id is required' });
    }

    // 1. Pinata
    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname || 'paper';
    const cid = await uploadFileToPinata(fileBuffer, originalName);

    // 2. 合约
    const txHash = await submitPaperToContract(cid);
    console.log("Contract txHash:", txHash);

    // 3. 写paper表
    await Paper.createPaper({
      title,
      abstract,
      DID: cid,
      keywords
    });

    // 4. 写paper_authors
    await Paper.addPaperAuthor(cid, author_id);

    // 5. 自动邀请评审
    await reviewController.autoInviteReviewers(cid, keywords);

    return res.json({ success: true, cid, txHash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Upload failed',
      error
    });
  }
};

// 给前端调试用
exports.testServer = (req, res) => {
  res.send('Backend server is running...');
};

// 获取作者的论文
exports.getMyPapers = async (req, res) => {
  try {
    const { author_id } = req.query;
    if (!author_id) {
      return res.status(400).json({ success: false, message: 'author_id is required' });
    }

    const papers = await Paper.getPapersByAuthor(author_id);
    return res.json({ success: true, papers });
  } catch (error) {
    console.error('Error in getMyPapers:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
