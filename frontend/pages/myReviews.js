// frontend/pages/myReviews.js
import React, { useState, useEffect } from 'react';

export default function MyReviews() {
  const [invitations, setInvitations] = useState([]);
  const [acceptedPapers, setAcceptedPapers] = useState([]);
  const [reviewContent, setReviewContent] = useState('');

  // 假设当前登录reviewer ID = 99
  const reviewerId = 99;

  useEffect(() => {
    fetch(`http://localhost:3000/review/myInvitations?reviewer_id=${reviewerId}&status=invited`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setInvitations(data.invitations);
        }
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:3000/review/myInvitations?reviewer_id=${reviewerId}&status=accepted`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setAcceptedPapers(data.invitations);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleRespond = async (paperId, accept) => {
    try {
      const res = await fetch('http://localhost:3000/review/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paper_id: paperId, reviewer_id: reviewerId, accept })
      });
      const data = await res.json();
      if (data.success) {
        alert(`已${accept ? '接受' : '拒绝'}`);
        setInvitations(invitations.filter(inv => inv.paper_id !== paperId));
      } else {
        alert(data.message || '操作失败');
      }
    } catch (error) {
      console.error(error);
      alert('网络错误');
    }
  };

  const handleSubmitReview = async (paperId) => {
    try {
      const res = await fetch('http://localhost:3000/review/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paper_id: paperId,
          reviewer_id: reviewerId,
          review_content: reviewContent
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('提交成功');
        setAcceptedPapers(acceptedPapers.filter(a => a.paper_id !== paperId));
        setReviewContent('');
      } else {
        alert(data.message || '提交失败');
      }
    } catch (error) {
      console.error(error);
      alert('网络错误');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>我的评审</h1>

      <section>
        <h2>被邀请的论文 (status = invited)</h2>
        {invitations.map(inv => (
          <div key={inv.id} style={{ border: '1px solid #ddd', margin: 10, padding: 10 }}>
            <p>Paper Title: {inv.paper_title}</p>
            <p>Status: {inv.status}</p>
            <button onClick={() => handleRespond(inv.paper_id, true)}>接受邀请</button>
            <button onClick={() => handleRespond(inv.paper_id, false)}>拒绝邀请</button>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>待我评审的论文 (status = accepted)</h2>
        {acceptedPapers.map(inv => (
          <div key={inv.id} style={{ border: '1px solid #ddd', margin: 10, padding: 10 }}>
            <p>Paper Title: {inv.paper_title}</p>
            <p>Status: {inv.status}</p>
            <div>
              <textarea
                placeholder="在此填写评审意见"
                value={reviewContent}
                onChange={e => setReviewContent(e.target.value)}
                rows={4}
                cols={50}
              />
            </div>
            <button onClick={() => handleSubmitReview(inv.paper_id)}>提交评审</button>
          </div>
        ))}
      </section>
    </div>
  );
}
