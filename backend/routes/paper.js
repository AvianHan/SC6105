const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFileToPinata } = require('../pinata');
const { submitPaperToContract } = require('../contract');

// 处理文件上传的配置 (内存存储)
const upload = multer({ storage: multer.memoryStorage() });

// 测试路由
router.get('/', (req, res) => {
  res.send('Backend server is running...');
});

// 提交论文路由
router.post('/submit', upload.single('paper'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // 1. 上传到 Pinata, 得到 CID
    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname || 'paper';
    const cid = await uploadFileToPinata(fileBuffer, originalName);

    // 2. 调用合约 submitPaper
    const txHash = await submitPaperToContract(cid);
    console.log("Contract txHash:", txHash);

    // 返回给前端
    res.json({ success: true, cid, txHash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Upload failed', error });
  }
});

module.exports = router;