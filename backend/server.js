const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const server = express();

server.use(express.json());
server.use(cors({
  origin: 'http://localhost:3001',  // 前端地址
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
server.use(authRoutes);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});