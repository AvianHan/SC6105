// frontend/pages/profile.js
import React, { useState, useEffect } from 'react';

export default function Profile() {
  const [myPapers, setMyPapers] = useState([]);
  // 假设当前登录作者ID=10
  const authorId = 10;

  useEffect(() => {
    fetch(`http://localhost:3000/paper/myPapers?author_id=${authorId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setMyPapers(data.papers);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleInvite = async (paperId) => {
    try {
      const res = await fetch('http://localhost:3000/review/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paper_id: paperId })
      });
      const data = await res.json();
      if (data.success) {
        alert(`已成功邀请${data.invitedCount}位评审`);
      } else {
        alert(data.message || '邀请失败');
      }
    } catch (error) {
      console.error(error);
      alert('网络错误');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>我的个人中心</h1>
      <h2>我提交的论文</h2>
      {myPapers.map(paper => (
        <div key={paper.paper_id} style={{ border: '1px solid #ddd', margin: '10px 0', padding: 10 }}>
          <h3>{paper.title}</h3>
          <p>摘要：{paper.abstract}</p>
          <p>关键词：{paper.keywords}</p>
          <p>时间：{paper.timestamp}</p>
          <button onClick={() => handleInvite(paper.paper_id)}>邀请评审</button>
        </div>
      ))}
    </div>
  );
}
