import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/Form.module.css';
import { ArrowLeft, FileText, Clock, Tag, Users } from 'lucide-react';

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
    <div className={styles.form}>
      <Link href="/search" className={styles.backButton}>
        <ArrowLeft size={24} />
      </Link>

      <h1 className={styles.title}>My Profile</h1>
      <h2 className={styles.subtitle}>My Submitted Papers</h2>

      <div className={styles.paperList}>
        {myPapers.length === 0 ? (
          <p className={styles.noResults}>No papers submitted yet</p>
        ) : (
          myPapers.map(paper => (
            <div key={paper.DID} className={styles.paperCard}>
              <h3 className={styles.cardTitle}>{paper.title}</h3>
              
              <div className={styles.metaInfo}>
                <div className={styles.metaItem}>
                  <Users className={styles.metaIcon} />
                  <span>{paper.authors}</span>
                </div>
                
                <div className={styles.metaItem}>
                  <Clock className={styles.metaIcon} />
                  <span>{paper.timestamp}</span>
                </div>

                <div className={styles.metaItem}>
                  <Tag className={styles.metaIcon} />
                  <span>{paper.keywords}</span>
                </div>
              </div>

              <div className={styles.abstract}>
                <h4>Abstract</h4>
                <p>{paper.abstract}</p>
              </div>

              <div className={styles.reviewStatus}>
                <h4>Review Status</h4>
                <div className={styles.statusBadge}>
                  {formatReviewStatus(paper.reviewStatuses)}
                </div>
              </div>

              <a
                href={`https://gateway.pinata.cloud/ipfs/${paper.DID}`}
                target="_blank"
                rel="noreferrer"
                className={styles.viewButton}
              >
                <FileText className={styles.buttonIcon} />
                View PDF
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}