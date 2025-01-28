// controllers/paperController.js
const { uploadFileToPinata } = require('../pinata');
const { submitPaperToContract } = require('../contract');
const Paper = require('../models/paper');

exports.submitPaper = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { title, abstract } = req.body;
    const keywords = req.body.keywords ? JSON.parse(req.body.keywords) : [];

    if (!title || !abstract) {
      return res.status(400).json({
        success: false,
        message: '标题和摘要不能为空'
      });
    }

    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname || 'paper';
    
    // 1. Upload to Pinata
    const cid = await uploadFileToPinata(fileBuffer, originalName);

    // 2. Call contract submitPaper
    const txHash = await submitPaperToContract(cid);
    console.log("Contract txHash:", txHash);

    try {
      // 3. Save paper info to database
      await Paper.createPaper({
        title,
        abstract,
        DID: cid,
        keywords
      });

      res.json({ success: true, cid, txHash });
    } catch (dbError) {
      // 检查是否是重复键错误
      if (dbError.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ 
          success: false, 
          message: '该论文已经被上传过了。每篇论文只能上传一次。',
          error: 'DUPLICATE_PAPER'
        });
      }
      // 其他数据库错误
      throw dbError;
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Upload failed', 
      error 
    });
  }
};

exports.testServer = (req, res) => {
  res.send('Backend server is running...');
};