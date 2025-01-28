// backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { testPinataConnection } = require('./pinata');
const authRoutes = require('./routes/auth');
const paperRoutes = require('./routes/paper');
const searchRoutes = require('./routes/search');
const reviewRoutes = require('./routes/review');


const app = express();


app.use(cors({
  origin: 'http://localhost:3001',  // 前端地址 (3001端口)
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 添加解析 JSON 请求体的中间件
app.use(express.json());
// 添加解析 URL-encoded 请求体的中间件
app.use(express.urlencoded({ extended: true }));

testPinataConnection();

// 注册路由
app.use('/auth', authRoutes);
app.use('/paper', paperRoutes);
app.use('/search', searchRoutes);
app.use('/review', reviewRoutes);

// 启动后端监听在 3000 端口
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});