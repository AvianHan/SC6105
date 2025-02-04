import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/Form.module.css';
import { ArrowLeft, Send, CheckCircle, XCircle } from 'lucide-react';

export default function MyReviews() {
  const router = useRouter();
  const [reviewerId, setReviewerId] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [acceptedPapers, setAcceptedPapers] = useState([]);
  const [reviewContent, setReviewContent] = useState({});
  const [activeTab, setActiveTab] = useState('invited');

  // 保持现有的fetch和handler函数
  const fetchInvitations = async (rId) => {
    try {
      const resInv = await fetch(`http://localhost:3000/review/myInvitations?reviewer_id=${rId}&status=invited`);
      const dataInv = await resInv.json();
      if (dataInv.success) setInvitations(dataInv.invitations);

      const resAcc = await fetch(`http://localhost:3000/review/myInvitations?reviewer_id=${rId}&status=accepted`);
      const dataAcc = await resAcc.json();
      if (dataAcc.success) setAcceptedPapers(dataAcc.invitations);
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

  const handleRespond = async (paperId, accept) => {
    try {
      const res = await fetch('http://localhost:3000/review/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paper_id: paperId, reviewer_id: reviewerId, accept })
      });
      const data = await res.json();
      if (data.success) {
        fetchInvitations(reviewerId);
      }
    } catch (error) {
      console.error(error);
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
          review_content: reviewContent[paperId] || ''
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchInvitations(reviewerId);
        setReviewContent(prev => ({ ...prev, [paperId]: '' }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.form}>
      <Link href="/search" className={styles.backButton}>
        <ArrowLeft size={24} />
      </Link>

      <h1 className={styles.title}>My Review Center</h1>

      <div className={styles.tabContainer}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'invited' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('invited')}
        >
          Invited Papers ({invitations.length})
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'accepted' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('accepted')}
        >
          Accepted Papers ({acceptedPapers.length})
        </button>
      </div>

      {activeTab === 'invited' && (
        <div className={styles.tabContent}>
          {invitations.length === 0 ? (
            <p className={styles.noResults}>No pending invitations found.</p>
          ) : (
            invitations.map(inv => (
              <div key={inv.paper_id} className={styles.paperCard}>
                <h3 className={styles.cardTitle}>{inv.paper_title}</h3>
                <div className={styles.cardStatus}>{inv.status}</div>
                <div className={styles.cardActions}>
                  <button 
                    onClick={() => handleRespond(inv.paper_id, true)}
                    className={`${styles.button} ${styles.acceptButton}`}
                  >
                    <CheckCircle className={styles.buttonIcon} />
                    Accept
                  </button>
                  <button 
                    onClick={() => handleRespond(inv.paper_id, false)}
                    className={`${styles.button} ${styles.rejectButton}`}
                  >
                    <XCircle className={styles.buttonIcon} />
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'accepted' && (
        <div className={styles.tabContent}>
          {acceptedPapers.length === 0 ? (
            <p className={styles.noResults}>No accepted papers to review.</p>
          ) : (
            acceptedPapers.map(inv => (
              <div key={inv.paper_id} className={styles.paperCard}>
                <h3 className={styles.cardTitle}>{inv.paper_title}</h3>
                <div className={styles.cardStatus}>{inv.status}</div>
                <textarea
                  placeholder="Write your review comments here..."
                  className={styles.textArea}
                  value={reviewContent[inv.paper_id] || ''}
                  onChange={e => {
                    setReviewContent(prev => ({
                      ...prev,
                      [inv.paper_id]: e.target.value
                    }));
                  }}
                />
                <button 
                  onClick={() => handleSubmitReview(inv.paper_id)}
                  className={styles.button}
                >
                  <Send className={styles.buttonIcon} />
                  Submit Review
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}