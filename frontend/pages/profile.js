// frontend/pages/profile.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Profile() {
  const router = useRouter();

  const [authorId, setAuthorId] = useState(null);
  const [myPapers, setMyPapers] = useState([]);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (!storedUserInfo) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(storedUserInfo);
    setAuthorId(user.accountId);
  }, [router]);

  useEffect(() => {
    if (!authorId) return;
    fetch(`http://localhost:3000/paper/myPapers?author_id=${authorId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setMyPapers(data.papers);
        } else {
          console.error('Failed to fetch my papers:', data.message);
        }
      })
      .catch(err => console.error('Network error:', err));
  }, [authorId]);

  function formatReviewStatus(reviewStatuses) {
    if (!reviewStatuses) return 'No reviewers yet';
    const statuses = reviewStatuses.split(',').map(s => s.trim());
    if (statuses.includes('submitted')) {
      return `Some reviews are submitted (${reviewStatuses})`;
    }
    return `In review (${reviewStatuses})`;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>My Profile</h1>
      <h2>My Submitted Papers</h2>

      {myPapers.map(paper => (
        <div key={paper.DID} style={{ border: '1px solid #ddd', margin: '10px 0', padding: 10 }}>
          <h3>{paper.title}</h3>
          <p><strong>Authors:</strong> {paper.authors}</p>
          <p><strong>Abstract:</strong> {paper.abstract}</p>
          <p><strong>Keywords:</strong> {paper.keywords}</p>
          <p><strong>Review Status:</strong> {formatReviewStatus(paper.reviewStatuses)}</p>
          <p><strong>Time:</strong> {paper.timestamp}</p>
          <a
            href={`https://gateway.pinata.cloud/ipfs/${paper.DID}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: 'blue', textDecoration: 'underline' }}
          >
            View PDF
          </a>
        </div>
      ))}
    </div>
  );
}
