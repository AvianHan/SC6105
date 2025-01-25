const express = require('express');
const sqlite3 = require('sqlite3');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./database.db');
const JWT_SECRET = 'your-secret-key';

app.use(express.json());
app.use(cors());

// 中间件：验证JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// 登录路由
app.post('/api/login', (req, res) => {
  const { accountId, password } = req.body;

  const query = `
    SELECT account_id, password, nickname, reviewer, author 
    FROM Accounts 
    WHERE account_id = ?
  `;

  db.get(query, [accountId], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: '数据库错误' });
    }

    if (!user) {
      return res.status(401).json({ error: '账号不存在' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: '密码错误' });
    }

    const token = jwt.sign(
      { 
        accountId: user.account_id,
        nickname: user.nickname,
        reviewer: user.reviewer,
        author: user.author
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        accountId: user.account_id,
        nickname: user.nickname,
        reviewer: user.reviewer,
        author: user.author
      }
    });
  });
});

// 注册路由
app.post('/api/register', async (req, res) => {
  const { accountId, password, nickname, reviewer, author } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO Accounts (account_id, password, nickname, reviewer, author)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [accountId, hashedPassword, nickname, reviewer, author], (err) => {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(400).json({ error: '账号已存在' });
        }
        return res.status(500).json({ error: '数据库错误' });
      }

      res.status(201).json({ message: '注册成功' });
    });
  } catch (err) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取用户论文列表
app.get('/api/papers', authenticateToken, (req, res) => {
  const query = `
    SELECT p.* 
    FROM Papers p
    JOIN Authors a ON p.DID = a.DID
    WHERE a.author_id = ?
  `;

  db.all(query, [req.user.accountId], (err, papers) => {
    if (err) {
      return res.status(500).json({ error: '数据库错误' });
    }
    res.json(papers);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 初始化数据库
function initDatabase() {
  db.serialize(() => {
    // 创建账号表
    db.run(`CREATE TABLE IF NOT EXISTS Accounts (
      account_id INTEGER PRIMARY KEY AUTOINCREMENT,
      password TEXT NOT NULL,
      nickname TEXT NOT NULL,
      reviewer BOOLEAN NOT NULL CHECK (reviewer IN (0, 1)),
      author BOOLEAN NOT NULL CHECK (author IN (0, 1))
    )`);

    // 创建论文表
    db.run(`CREATE TABLE IF NOT EXISTS Papers (
      DID TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      abstract TEXT,
      keyword TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 创建作者关联表
    db.run(`CREATE TABLE IF NOT EXISTS Authors (
      author_id INTEGER,
      DID TEXT NOT NULL,
      FOREIGN KEY (DID) REFERENCES Papers(DID),
      FOREIGN KEY (author_id) REFERENCES Accounts(account_id)
    )`);
  });
}

initDatabase();