conda activate 6105

npm run dev:frontend

npm run dev:backend

npm run dev:contracts

npm run compile:contracts

npm run deploy:contracts

npm run dev:all


88888888


npx hardhat clean

npm init -y
npm install next react react-dom express cors hardhat @nomicfoundation/hardhat-toolbox concurrently


npm install

mysqld --skip-grant-tables
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';


CREATE TABLE IF NOT EXISTS paper_reviewers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  paper_id INTEGER,
  reviewer_id INTEGER,
  status TEXT,        -- invited / submitted / 等等
  content TEXT,       -- 存放审稿意见、评分等
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);


