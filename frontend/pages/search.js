// frontend/pages/search.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');

  async function searchPapers() {
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      setMessage('请输入搜索关键词');
      setResults([]);
      return;
    }

    // 显示正在搜索
    setMessage('正在搜索...');

    try {
      const response = await fetch(`http://localhost:3000/search?query=${encodeURIComponent(trimmedQuery)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        setMessage('未找到相关论文');
        setResults([]);
      } else {
        setMessage('');
        setResults(data.results);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('发生错误，请稍后重试。');
      setResults([]);
    }
  }

  return (
    <>
      <Head>
        <title>论文搜索</title>
      </Head>

      <style jsx global>{`
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        h1 {
          text-align: center;
          color: #333;
        }
        .search-container {
          display: flex;
          justify-content: center;
          margin: 20px 0;
        }
        input {
          width: 300px;
          padding: 10px;
          margin-right: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        button {
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background-color: #0056b3;
        }
        .results {
          margin-top: 20px;
        }
        .result-item {
          background-color: #fff;
          padding: 15px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .no-results {
          text-align: center;
          color: #999;
          margin-top: 20px;
        }
      `}</style>

      <h1>论文搜索</h1>
      <p><Link href="/SubmitPaper">Go to Upload Page</Link></p>
      <p><Link href="/login">Go to Login Page</Link></p>
      <p><Link href="/register">Go to Register Page</Link></p>
      
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入标题、关键词或摘要"
        />
        <button onClick={searchPapers}>搜索</button>
      </div>

      <div className="results">
        {message && (
          <div className="no-results">{message}</div>
        )}
        
        {results.map((paper, index) => (
          <div key={index} className="result-item">
            <h3>{paper.title}</h3>
            <p><strong>作者:</strong> {paper.authors}</p>
            <p><strong>摘要:</strong> {paper.abstract}</p>
            <p><strong>关键字:</strong> {paper.keywords}</p>
            <small><strong>时间:</strong> {paper.timestamp}</small>
          </div>
        ))}
      </div>
    </>
  );
}