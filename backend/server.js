// backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const { testPinataConnection, uploadFileToPinata } = require('./pinata');
const { submitPaperToContract } = require('./contract');

const app = express();
app.use(cors());

testPinataConnection();

// 处理文件上传的配置 (内存存储)
const upload = multer({ storage: multer.memoryStorage() });

// 这个接口仅做测试: 看后端是否在跑
app.get('/', (req, res) => {
  res.send('Backend server is running...');
});


app.post('/SubmitPaper', upload.single('paper'), async (req, res) => {
    try {
      // 如果前端的 <input name="paper" ...> 就可以用 req.file 获取到文件
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


// 启动后端监听
const PORT = 3001; // 也可以从环境变量读取
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
