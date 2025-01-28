// frontend/pages/search.js
import React, { useState } from 'react';
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

      <h1>论文搜索</h1>
      <p><Link href="/SubmitPaper">Go to Upload Page</Link></p>
      <p><Link href="/login">Go to Login Page</Link></p>
      <p><Link href="/register">Go to Register Page</Link></p>
      
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入标题、关键词或摘要"
          style={{ width: 300, padding: 10, marginRight: 10, border: '1px solid #ccc', borderRadius: 5 }}
        />
        <button
          onClick={searchPapers}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: 5 }}
        >
          搜索
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        {message && (
          <div style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>
            {message}
          </div>
        )}
        
        {results.map((paper, index) => (
          <div key={index} style={{ backgroundColor: '#fff', padding: 15, marginBottom: 10, border: '1px solid #ddd', borderRadius: 5 }}>
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
