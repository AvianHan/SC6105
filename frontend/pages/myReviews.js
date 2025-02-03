// frontend/pages/myReviews.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function MyReviews() {
  const router = useRouter();

  const [reviewerId, setReviewerId] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [acceptedPapers, setAcceptedPapers] = useState([]);
  const [reviewContent, setReviewContent] = useState({});

  // A helper function to fetch both "invited" and "accepted" papers
  const fetchInvitations = async (rId) => {
    try {
      // invited
      const resInv = await fetch(`http://localhost:3000/review/myInvitations?reviewer_id=${rId}&status=invited`);
      const dataInv = await resInv.json();
      if (dataInv.success) {
        setInvitations(dataInv.invitations);
      }

      // accepted
      const resAcc = await fetch(`http://localhost:3000/review/myInvitations?reviewer_id=${rId}&status=accepted`);
      const dataAcc = await resAcc.json();
      if (dataAcc.success) {
        setAcceptedPapers(dataAcc.invitations);
      }

    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
  };

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (!storedUserInfo) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(storedUserInfo);
    setReviewerId(user.accountId);
  }, [router]);

  useEffect(() => {
    if (!reviewerId) return;
    fetchInvitations(reviewerId);
  }, [reviewerId]);

  // Accept or Reject
  const handleRespond = async (paperId, accept) => {
    try {
      const res = await fetch('http://localhost:3000/review/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paper_id: paperId,
          reviewer_id: reviewerId,
          accept
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`You have ${accept ? 'accepted' : 'rejected'} this paper.`);
        // auto-refresh
        fetchInvitations(reviewerId);
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error(error);
      alert('Network error');
    }
  };

  // Submit review content
  const handleSubmitReview = async (paperId) => {
    try {
      const res = await fetch('http://localhost:3000/review/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paper_id: paperId,
          reviewer_id: reviewerId,
          review_content: reviewContent[paperId] || ''
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Review submitted successfully');
        // auto-refresh
        fetchInvitations(reviewerId);
        setReviewContent(prev => ({ ...prev, [paperId]: '' }));
      } else {
        alert(data.message || 'Submit failed');
      }
    } catch (error) {
      console.error(error);
      alert('Network error');
    }
  };

  const boxStyle = {
    border: '1px solid #ddd',
    borderRadius: '4px',
    margin: '10px 0',
    padding: '10px'
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>My Review Center</h1>

      <section>
        <h2>Invited Papers</h2>
        {invitations.length === 0 && <p style={{ color: '#666' }}>No invitations</p>}
        {invitations.map(inv => (
          <div key={inv.paper_id} style={boxStyle}>
            <p><strong>Paper Title:</strong> {inv.paper_title}</p>
            <p><strong>Status:</strong> {inv.status}</p>
            <button onClick={() => handleRespond(inv.paper_id, true)} style={{ marginRight: 8 }}>
              Accept
            </button>
            <button onClick={() => handleRespond(inv.paper_id, false)}>
              Reject
            </button>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>Accepted Papers</h2>
        {acceptedPapers.length === 0 && <p style={{ color: '#666' }}>No papers to review</p>}
        {acceptedPapers.map(inv => (
          <div key={inv.paper_id} style={boxStyle}>
            <p><strong>Paper Title:</strong> {inv.paper_title}</p>
            <p><strong>Status:</strong> {inv.status}</p>
            <textarea
              placeholder="Write your review comments here"
              rows={4}
              cols={50}
              value={reviewContent[inv.paper_id] || ''}
              onChange={e => {
                const val = e.target.value;
                setReviewContent(prev => ({ ...prev, [inv.paper_id]: val }));
              }}
              style={{ width: '100%', margin: '8px 0' }}
            />
            <br />
            <button onClick={() => handleSubmitReview(inv.paper_id)}>Submit Review</button>
          </div>
        ))}
      </section>
    </div>
  );
}
